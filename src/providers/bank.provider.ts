import axios from 'axios';
import { TransactionRequest, TransactionResult, PaymentProviderError } from '../types';
import { logger } from '../utils/logger';

interface BankConfig { name: string; baseUrl: string; apiKey: string; apiSecret: string; authType: 'oauth' | 'api_key' | 'basic'; }

export class BankProvider {
  private banks: Map<string, BankConfig> = new Map();
  private tokens: Map<string, { token: string; expiry: Date }> = new Map();

  constructor() { this.registerBanks(); }

  private registerBanks(): void {
    if (process.env.KCB_API_KEY) this.banks.set('kcb', { name: 'KCB Bank', baseUrl: process.env.KCB_BASE_URL || 'https://api.kcbgroup.com', apiKey: process.env.KCB_API_KEY, apiSecret: process.env.KCB_API_SECRET || '', authType: 'oauth' });
    if (process.env.EQUITY_API_KEY) this.banks.set('equity', { name: 'Equity Bank', baseUrl: process.env.EQUITY_BASE_URL || 'https://api.equitybankgroup.com', apiKey: process.env.EQUITY_API_KEY, apiSecret: process.env.EQUITY_API_SECRET || '', authType: 'oauth' });
    if (process.env.COOP_API_KEY) this.banks.set('coop', { name: 'Co-operative Bank', baseUrl: process.env.COOP_BASE_URL || 'https://developer.co-opbank.co.ke', apiKey: process.env.COOP_API_KEY, apiSecret: process.env.COOP_API_SECRET || '', authType: 'api_key' });
  }

  private async getBankToken(bankCode: string): Promise<string> {
    const bank = this.banks.get(bankCode);
    if (!bank) throw new Error(`Unsupported bank: ${bankCode}`);
    const cached = this.tokens.get(bankCode);
    if (cached && cached.expiry > new Date()) return cached.token;
    if (bank.authType === 'oauth') {
      const response = await axios.post(`${bank.baseUrl}/oauth/token`, { grant_type: 'client_credentials', client_id: bank.apiKey, client_secret: bank.apiSecret }, { timeout: 10000 });
      const token = response.data.access_token;
      const expiry = new Date(Date.now() + (response.data.expires_in - 60) * 1000);
      this.tokens.set(bankCode, { token, expiry });
      return token;
    }
    return bank.apiKey;
  }

  async initiateBankTransfer(request: TransactionRequest): Promise<TransactionResult> {
    const bankCode = request.bankCode || 'kcb';
    const bank = this.banks.get(bankCode);
    if (!bank) throw new PaymentProviderError(`Bank ${bankCode} not configured`, null, 400);
    try {
      const token = await this.getBankToken(bankCode);
      const payload = { sourceAccount: request.sourceAccount, destinationAccount: request.destinationAccount, destinationBankCode: request.destinationBankCode, amount: request.amount, currency: request.currency || 'KES', reference: request.orderId, narration: request.description || 'Bank Transfer', transferType: request.transferType || 'rtgs' };
      logger.info(`Initiating bank transfer: ${request.orderId} via ${bank.name}`);
      const response = await axios.post(`${bank.baseUrl}/v1/transfers`, payload, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, timeout: 30000 });
      return { success: response.data.status === 'SUCCESS' || response.data.status === 'PENDING', transactionId: response.data.transactionReference || response.data.reference, providerRef: response.data.bankReference, status: response.data.status === 'SUCCESS' ? 'completed' : 'pending', amount: request.amount, currency: request.currency || 'KES', provider: 'bank', paymentMethod: request.transferType || 'rtgs', metadata: { bankCode, bankName: bank.name, sourceAccount: request.sourceAccount, destinationAccount: request.destinationAccount, destinationBankCode: request.destinationBankCode, transferType: request.transferType, bankStatus: response.data.status }, createdAt: new Date() };
    } catch (error: any) { logger.error(`Bank transfer error [${bankCode}]:`, error.response?.data || error.message); throw new PaymentProviderError('Bank transfer failed', error, 500); }
  }

  async checkBankTransactionStatus(bankCode: string, transactionId: string): Promise<TransactionResult> {
    try { const token = await this.getBankToken(bankCode); const bank = this.banks.get(bankCode)!; const response = await axios.get(`${bank.baseUrl}/v1/transfers/${transactionId}/status`, { headers: { Authorization: `Bearer ${token}` }, timeout: 10000 }); const statusMap: { [key: string]: string } = { 'PENDING': 'pending', 'PROCESSING': 'pending', 'COMPLETED': 'completed', 'FAILED': 'failed', 'REVERSED': 'refunded' }; return { success: response.data.status === 'COMPLETED', transactionId, status: statusMap[response.data.status] || 'unknown', provider: 'bank', metadata: { bankStatus: response.data.status, settlementDate: response.data.settlementDate, failureReason: response.data.failureReason, bankCode, bankName: bank.name }, createdAt: new Date() }; }
    catch (error: any) { logger.error('Bank status check error:', error.response?.data || error.message); throw new PaymentProviderError('Bank status check failed', error, 500); }
  }

  getSupportedBanks(): Array<{ code: string; name: string }> { return Array.from(this.banks.entries()).map(([code, config]) => ({ code, name: config.name })); }
}