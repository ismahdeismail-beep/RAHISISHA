import { WalletModel, TransactionModel } from '../models';
import { TransactionResult } from '../types';
import { logger } from '../utils/logger';

export class WalletService {
  async createWallet(userId: string, currency: string = 'KES'): Promise<any> {
    return WalletModel.create({ userId, currency, balance: 0, heldBalance: 0, totalDeposited: 0, totalWithdrawn: 0, status: 'active', createdAt: new Date() });
  }

  async getBalance(userId: string, currency: string = 'KES'): Promise<number> {
    const wallet = await WalletModel.findOne({ userId, currency });
    return wallet ? wallet.balance : 0;
  }

  async creditWallet(userId: string, amount: number, currency: string, reference: string, metadata?: any): Promise<TransactionResult> {
    const wallet = await WalletModel.findOneAndUpdate({ userId, currency }, { $inc: { balance: amount, totalDeposited: amount }, $set: { lastActivityAt: new Date(), updatedAt: new Date() } }, { new: true, upsert: true });
    const transaction = await TransactionModel.create({ transactionId: `WAL-CR-${Date.now()}`, type: 'wallet_credit', userId, amount, currency, status: 'completed', reference, metadata, createdAt: new Date() });
    return { success: true, transactionId: transaction.transactionId, status: 'completed', amount, currency, provider: 'wallet', paymentMethod: 'internal', newBalance: wallet.balance, createdAt: new Date() };
  }

  async deductFromWallet(userId: string, amount: number, currency: string, reference: string): Promise<TransactionResult> {
    const wallet = await WalletModel.findOne({ userId, currency });
    if (!wallet || wallet.balance < amount) throw new Error('Insufficient wallet balance');
    const updatedWallet = await WalletModel.findOneAndUpdate({ userId, currency, balance: { $gte: amount } }, { $inc: { balance: -amount, totalWithdrawn: amount }, $set: { lastActivityAt: new Date(), updatedAt: new Date() } }, { new: true });
    if (!updatedWallet) throw new Error('Insufficient wallet balance');
    const transaction = await TransactionModel.create({ transactionId: `WAL-DR-${Date.now()}`, type: 'wallet_debit', userId, amount: -amount, currency, status: 'completed', reference, createdAt: new Date() });
    return { success: true, transactionId: transaction.transactionId, status: 'completed', amount: -amount, currency, provider: 'wallet', paymentMethod: 'internal', newBalance: updatedWallet.balance, createdAt: new Date() };
  }

  async transferBetweenWallets(fromUserId: string, toUserId: string, amount: number, currency: string, reference: string): Promise<TransactionResult> {
    const debitResult = await this.deductFromWallet(fromUserId, amount, currency, reference);
    const creditResult = await this.creditWallet(toUserId, amount, currency, reference);
    return { success: true, transactionId: `WAL-TF-${Date.now()}`, status: 'completed', amount, currency, provider: 'wallet', paymentMethod: 'p2p_transfer', fromUserId, toUserId, debitTransactionId: debitResult.transactionId, creditTransactionId: creditResult.transactionId, createdAt: new Date() };
  }

  async holdFunds(userId: string, amount: number, currency: string, escrowId: string): Promise<TransactionResult> {
    const wallet = await WalletModel.findOne({ userId, currency });
    if (!wallet || wallet.balance < amount) throw new Error('Insufficient balance for hold');
    await WalletModel.findOneAndUpdate({ userId, currency }, { $inc: { balance: -amount, heldBalance: amount }, $set: { updatedAt: new Date() } });
    return { success: true, transactionId: `WAL-HOLD-${Date.now()}`, status: 'held', amount, currency, provider: 'wallet', escrowId, createdAt: new Date() };
  }

  async releaseHeldFunds(userId: string, amount: number, currency: string, escrowId: string, releaseToUserId?: string): Promise<TransactionResult> {
    await WalletModel.findOneAndUpdate({ userId, currency }, { $inc: { heldBalance: -amount }, $set: { updatedAt: new Date() } });
    if (releaseToUserId) return await this.creditWallet(releaseToUserId, amount, currency, `Escrow release ${escrowId}`);
    else return await this.creditWallet(userId, amount, currency, `Escrow release ${escrowId}`);
  }

  async fundWallet(userId: string, amount: number, currency: string, paymentMethod: string, phoneNumber?: string): Promise<TransactionResult> {
    logger.info(`Funding wallet for user ${userId}: ${amount} ${currency} via ${paymentMethod}`);
    return { success: true, transactionId: `WAL-FUND-${Date.now()}`, status: 'pending', amount, currency, provider: 'wallet', paymentMethod, createdAt: new Date(), metadata: { fundingMethod: paymentMethod, phoneNumber } };
  }

  async withdraw(userId: string, amount: number, currency: string, destination: any): Promise<TransactionResult> {
    const wallet = await WalletModel.findOne({ userId, currency });
    if (!wallet || wallet.balance < amount) throw new Error('Insufficient wallet balance');
    logger.info(`Withdrawing ${amount} ${currency} from wallet for user ${userId}`);
    return { success: true, transactionId: `WAL-WD-${Date.now()}`, status: 'pending', amount, currency, provider: 'wallet', paymentMethod: 'withdrawal', createdAt: new Date(), metadata: { destination } };
  }
}