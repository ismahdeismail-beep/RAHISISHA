import { BraintreeProvider } from '../providers/braintree.provider';
import { MpesaProvider } from '../providers/mpesa.provider';
import { PesapalProvider } from '../providers/pesapal.provider';
import { BankProvider } from '../providers/bank.provider';
import { WalletService } from './wallet.service';
import { TransactionModel } from '../models/transaction.model';
import { TransactionRequest, TransactionResult } from '../types';
import { logger } from '../utils/logger';

export class PaymentService {
  private braintree: BraintreeProvider;
  private mpesa: MpesaProvider;
  private pesapal: PesapalProvider;
  private bank: BankProvider;
  private walletService: WalletService;

  constructor() {
    this.braintree = new BraintreeProvider();
    this.mpesa = new MpesaProvider();
    this.pesapal = new PesapalProvider();
    this.bank = new BankProvider();
    this.walletService = new WalletService();
  }

  async processPayment(request: TransactionRequest): Promise<TransactionResult> {
    this.validatePaymentRequest(request);
    let result: TransactionResult;

    switch (request.provider) {
      case 'braintree':
        if (request.paymentMethod === 'card') result = await this.braintree.processCardPayment(request);
        else throw new Error('Unsupported Braintree payment method');
        break;
      case 'mpesa':
        if (request.paymentMethod === 'stk_push') result = await this.mpesa.initiateStkPush(request);
        else if (request.paymentMethod === 'b2c') result = await this.mpesa.sendB2C(request);
        else throw new Error('Unsupported M-Pesa payment method');
        break;
      case 'pesapal':
        result = await this.pesapal.submitOrder(request);
        break;
      case 'bank':
        result = await this.bank.initiateBankTransfer(request);
        break;
      case 'wallet':
        result = await this.walletService.deductFromWallet(request.customerId!, request.amount, request.currency || 'KES', request.orderId);
        break;
      default:
        throw new Error(`Unsupported payment provider: ${request.provider}`);
    }

    await this.saveTransaction(result, request);

    if (request.walletAmount && request.walletAmount > 0) {
      const walletResult = await this.walletService.deductFromWallet(request.customerId!, request.walletAmount, request.currency || 'KES', `${request.orderId}-wallet`);
      result.splitPayment = { walletAmount: request.walletAmount, providerAmount: request.amount - request.walletAmount, walletTransactionId: walletResult.transactionId! };
    }

    return result;
  }

  async processRefund(transactionId: string, provider: string, amount?: number): Promise<TransactionResult> {
    const transaction = await TransactionModel.findOne({ transactionId });
    if (!transaction) throw new Error('Transaction not found');

    let result: TransactionResult;
    switch (provider) {
      case 'braintree': result = await this.braintree.processRefund(transaction.providerRef!, amount); break;
      case 'mpesa': result = await this.mpesa.reverseTransaction(transaction.providerRef!, amount || transaction.amount, transaction.phoneNumber!); break;
      case 'pesapal': result = await this.pesapal.requestRefund(transaction.providerRef!, amount || transaction.amount, 'Customer refund request'); break;
      case 'wallet': result = await this.walletService.creditWallet(transaction.customerId!, amount || transaction.amount, transaction.currency, `Refund for ${transactionId}`); break;
      default: throw new Error(`Refund not supported for provider: ${provider}`);
    }

    await TransactionModel.updateOne({ transactionId }, { $set: { status: amount ? 'partially_refunded' : 'refunded', refundedAt: new Date(), refundAmount: amount || transaction.amount }, $push: { refunds: { refundId: result.transactionId!, amount: amount || transaction.amount, status: result.status, createdAt: new Date() } } });
    return result;
  }

  async getTransactionStatus(transactionId: string, provider: string): Promise<TransactionResult> {
    switch (provider) {
      case 'mpesa': return await this.mpesa.checkTransactionStatus(transactionId);
      case 'pesapal': return await this.pesapal.getTransactionStatus(transactionId);
      case 'bank': return await this.bank.checkBankTransactionStatus('kcb', transactionId);
      default: throw new Error(`Status check not supported for provider: ${provider}`);
    }
  }

  async generateBraintreeClientToken(customerId?: string): Promise<string> {
    return this.braintree.generateClientToken(customerId);
  }

  private validatePaymentRequest(request: TransactionRequest): void {
    if (!request.amount || request.amount <= 0) throw new Error('Invalid payment amount');
    if (!request.provider) throw new Error('Payment provider is required');
    if (!request.orderId) throw new Error('Order ID is required');
    if (request.provider === 'mpesa' && !request.phoneNumber) throw new Error('Phone number is required for M-Pesa payments');
  }

  private async saveTransaction(result: TransactionResult, request: TransactionRequest): Promise<void> {
    await TransactionModel.create({ transactionId: result.transactionId, providerRef: result.providerRef, orderId: request.orderId, customerId: request.customerId, provider: result.provider, paymentMethod: result.paymentMethod || request.paymentMethod, amount: result.amount, currency: result.currency || request.currency || 'KES', status: result.status, phoneNumber: request.phoneNumber, accountReference: request.accountReference, description: request.description, metadata: result.metadata, createdAt: new Date() });
  }
}