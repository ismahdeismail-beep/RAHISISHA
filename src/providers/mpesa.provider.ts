import axios from 'axios';
import { mpesaConfig } from '../config/mpesa.config';
import { TransactionRequest, TransactionResult, TransactionStatus, PaymentProviderError } from '../types';
import { logger } from '../utils/logger';

export class MpesaProvider {
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) return this.accessToken;
    const auth = Buffer.from(`${mpesaConfig.credentials.consumerKey}:${mpesaConfig.credentials.consumerSecret}`).toString('base64');
    const isProduction = process.env.NODE_ENV === 'production';
    const url = isProduction ? mpesaConfig.production.authUrl : mpesaConfig.sandbox.authUrl;
    try {
      const response = await axios.get(url, { headers: { Authorization: `Basic ${auth}` }, timeout: 10000 });
      this.accessToken = response.data.access_token;
      this.tokenExpiry = new Date(Date.now() + (response.data.expires_in - 60) * 1000);
      logger.info('M-Pesa access token refreshed');
      return this.accessToken;
    } catch (error: any) { logger.error('M-Pesa auth failed:', error.response?.data || error.message); throw new PaymentProviderError('M-Pesa authentication failed', error, 401); }
  }

  private generatePassword(timestamp: string): string {
    const { shortCode, passKey } = mpesaConfig.credentials;
    return Buffer.from(`${shortCode}${passKey}${timestamp}`).toString('base64');
  }

  private generateTimestamp(): string { return new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3); }

  async initiateStkPush(request: TransactionRequest): Promise<TransactionResult> {
    try {
      const token = await this.getAccessToken();
      const timestamp = this.generateTimestamp();
      const password = this.generatePassword(timestamp);
      const isProduction = process.env.NODE_ENV === 'production';
      const url = isProduction ? mpesaConfig.production.stkPushUrl : mpesaConfig.sandbox.stkPushUrl;
      const payload = {
        BusinessShortCode: mpesaConfig.credentials.shortCode, Password: password, Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline', Amount: Math.ceil(request.amount),
        PartyA: this.formatPhoneNumber(request.phoneNumber!), PartyB: mpesaConfig.credentials.shortCode,
        PhoneNumber: this.formatPhoneNumber(request.phoneNumber!), CallBackURL: mpesaConfig.callbacks.stkCallback,
        AccountReference: (request.accountReference || request.orderId).substring(0, 12),
        TransactionDesc: (request.description || 'Payment').substring(0, 13),
      };
      logger.info(`Initiating M-Pesa STK push: ${request.orderId}`);
      const response = await axios.post(url, payload, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, timeout: 30000 });
      if (response.data.ResponseCode !== '0') throw new Error(response.data.ResponseDescription || 'STK push failed');
      return { success: true, transactionId: response.data.CheckoutRequestID, providerRef: response.data.MerchantRequestID, status: 'pending', amount: request.amount, currency: 'KES', provider: 'mpesa', paymentMethod: 'stk_push', phoneNumber: request.phoneNumber, createdAt: new Date(), metadata: { merchantRequestId: response.data.MerchantRequestID, checkoutRequestId: response.data.CheckoutRequestID, responseCode: response.data.ResponseCode, responseDescription: response.data.ResponseDescription, customerMessage: response.data.CustomerMessage } };
    } catch (error: any) { logger.error('M-Pesa STK push error:', error.response?.data || error.message); throw new PaymentProviderError('M-Pesa STK push failed', error, 500); }
  }

  async sendB2C(request: TransactionRequest): Promise<TransactionResult> {
    try {
      const token = await this.getAccessToken();
      const isProduction = process.env.NODE_ENV === 'production';
      const url = isProduction ? mpesaConfig.production.b2cUrl : mpesaConfig.sandbox.b2cUrl;
      const payload = {
        InitiatorName: mpesaConfig.credentials.initiatorName, SecurityCredential: mpesaConfig.credentials.securityCredential,
        CommandID: 'BusinessPayment', Amount: Math.ceil(request.amount), PartyA: mpesaConfig.credentials.shortCode,
        PartyB: this.formatPhoneNumber(request.phoneNumber!), Remarks: (request.description || 'Disbursement').substring(0, 140),
        QueueTimeOutURL: mpesaConfig.callbacks.b2cTimeout, ResultURL: mpesaConfig.callbacks.b2cResult,
        Occasion: (request.orderId || 'B2C').substring(0, 140),
      };
      logger.info(`Sending M-Pesa B2C: ${request.orderId}, amount: ${request.amount}`);
      const response = await axios.post(url, payload, { headers: { Authorization: `Bearer ${token}` }, timeout: 30000 });
      return { success: response.data.ResponseCode === '0', transactionId: response.data.ConversationID, providerRef: response.data.OriginatorConversationID, status: 'pending', amount: request.amount, currency: 'KES', provider: 'mpesa', paymentMethod: 'b2c', phoneNumber: request.phoneNumber, createdAt: new Date(), metadata: { conversationId: response.data.ConversationID, originatorConversationId: response.data.OriginatorConversationID, responseCode: response.data.ResponseCode, responseDescription: response.data.ResponseDescription } };
    } catch (error: any) { logger.error('M-Pesa B2C error:', error.response?.data || error.message); throw new PaymentProviderError('M-Pesa B2C failed', error, 500); }
  }

  async checkTransactionStatus(checkoutRequestId: string): Promise<TransactionResult> {
    try {
      const token = await this.getAccessToken();
      const timestamp = this.generateTimestamp();
      const password = this.generatePassword(timestamp);
      const isProduction = process.env.NODE_ENV === 'production';
      const url = isProduction ? mpesaConfig.production.transactionStatusUrl : mpesaConfig.sandbox.transactionStatusUrl;
      const payload = { BusinessShortCode: mpesaConfig.credentials.shortCode, Password: password, Timestamp: timestamp, CheckoutRequestID: checkoutRequestId };
      const response = await axios.post(url, payload, { headers: { Authorization: `Bearer ${token}` }, timeout: 30000 });
      const resultCode = response.data.ResultCode;
      const isSuccess = resultCode === 0 || resultCode === '0';
      return { success: isSuccess, transactionId: checkoutRequestId, status: isSuccess ? 'completed' : 'failed' as TransactionStatus, amount: 0, provider: 'mpesa', createdAt: new Date(), metadata: { resultCode: response.data.ResultCode, resultDesc: response.data.ResultDesc, mpesaReceiptNumber: response.data.CallbackMetadata?.Item?.find((item: any) => item.Name === 'MpesaReceiptNumber')?.Value, transactionDate: response.data.CallbackMetadata?.Item?.find((item: any) => item.Name === 'TransactionDate')?.Value, phoneNumber: response.data.CallbackMetadata?.Item?.find((item: any) => item.Name === 'PhoneNumber')?.Value } };
    } catch (error: any) { logger.error('M-Pesa status check error:', error.response?.data || error.message); throw new PaymentProviderError('M-Pesa status check failed', error, 500); }
  }

  async reverseTransaction(transactionId: string, amount: number, phoneNumber: string): Promise<TransactionResult> {
    try {
      const token = await this.getAccessToken();
      const isProduction = process.env.NODE_ENV === 'production';
      const url = isProduction ? mpesaConfig.production.reversalUrl : mpesaConfig.sandbox.reversalUrl;
      const payload = {
        Initiator: mpesaConfig.credentials.initiatorName, SecurityCredential: mpesaConfig.credentials.securityCredential,
        CommandID: 'TransactionReversal', TransactionID: transactionId, Amount: Math.ceil(amount),
        ReceiverParty: mpesaConfig.credentials.shortCode, RecieverIdentifierType: '11',
        ResultURL: mpesaConfig.callbacks.b2cResult, QueueTimeOutURL: mpesaConfig.callbacks.b2cTimeout,
        Remarks: 'Transaction reversal', Occasion: 'Refund',
      };
      const response = await axios.post(url, payload, { headers: { Authorization: `Bearer ${token}` }, timeout: 30000 });
      return { success: response.data.ResponseCode === '0', transactionId: response.data.ConversationID, status: 'pending' as TransactionStatus, amount: Math.ceil(amount), provider: 'mpesa', createdAt: new Date(), metadata: { responseCode: response.data.ResponseCode, responseDescription: response.data.ResponseDescription } };
    } catch (error: any) { logger.error('M-Pesa reversal error:', error.response?.data || error.message); throw new PaymentProviderError('M-Pesa reversal failed', error, 500); }
  }

  private formatPhoneNumber(phone: string): string {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) cleaned = '254' + cleaned.substring(1);
    if (cleaned.startsWith('+')) cleaned = cleaned.substring(1);
    if (cleaned.startsWith('7')) cleaned = '254' + cleaned;
    return cleaned;
  }
}