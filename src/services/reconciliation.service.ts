import { TransactionModel } from '../models';
import { MpesaProvider } from '../providers/mpesa.provider';
import { PesapalProvider } from '../providers/pesapal.provider';
import { BraintreeProvider } from '../providers/braintree.provider';
import { BankProvider } from '../providers/bank.provider';
import { logger } from '../utils/logger';

export class ReconciliationService {
  private mpesa: MpesaProvider;
  private pesapal: PesapalProvider;
  private braintree: BraintreeProvider;
  private bank: BankProvider;

  constructor() { this.mpesa = new MpesaProvider(); this.pesapal = new PesapalProvider(); this.braintree = new BraintreeProvider(); this.bank = new BankProvider(); }

  async reconcileTransactions(date: Date): Promise<any> {
    const startOfDay = new Date(date); startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date); endOfDay.setHours(23, 59, 59, 999);
    const pendingTransactions = await TransactionModel.find({ status: { $in: ['pending', 'processing'] }, createdAt: { $gte: startOfDay, $lte: endOfDay } });
    const results = { checked: pendingTransactions.length, updated: 0, failed: 0, errors: [] as string[] };
    for (const tx of pendingTransactions) {
      try {
        let status;
        switch (tx.provider) { case 'mpesa': status = await this.mpesa.checkTransactionStatus(tx.transactionId); break; case 'pesapal': status = await this.pesapal.getTransactionStatus(tx.transactionId); break; case 'braintree': status = { status: 'completed' }; break; case 'bank': status = await this.bank.checkBankTransactionStatus(tx.metadata?.bankCode || 'kcb', tx.transactionId); break; default: continue; }
        if (status.status !== tx.status) { await TransactionModel.updateOne({ _id: tx._id }, { $set: { status: status.status, providerRef: status.providerRef || tx.providerRef, completedAt: status.status === 'completed' ? new Date() : tx.completedAt, 'metadata.reconciliationCheckedAt': new Date(), 'metadata.reconciliationStatus': status.status } }); results.updated++; }
      } catch (error: any) { results.failed++; results.errors.push(`Transaction ${tx.transactionId}: ${error.message}`); }
    }
    return results;
  }

  async generateDailyReport(date: Date): Promise<any> {
    const startOfDay = new Date(date); startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date); endOfDay.setHours(23, 59, 59, 999);
    const transactions = await TransactionModel.find({ createdAt: { $gte: startOfDay, $lte: endOfDay } });
    const report = { date: date.toISOString().split('T')[0], summary: { totalTransactions: transactions.length, totalAmount: transactions.reduce((sum, tx) => sum + tx.amount, 0), successfulAmount: transactions.filter(tx => tx.status === 'completed').reduce((sum, tx) => sum + tx.amount, 0), pendingAmount: transactions.filter(tx => tx.status === 'pending').reduce((sum, tx) => sum + tx.amount, 0), failedAmount: transactions.filter(tx => tx.status === 'failed').reduce((sum, tx) => sum + tx.amount, 0), refundedAmount: transactions.filter(tx => tx.status === 'refunded').reduce((sum, tx) => sum + (tx.refundAmount || 0), 0) }, byProvider: {} as any, byPaymentMethod: {} as any, byStatus: {} as any, hourlyBreakdown: Array(24).fill(0).map((_, i) => ({ hour: i, count: 0, amount: 0 })) };
    for (const tx of transactions) { if (!report.byProvider[tx.provider]) report.byProvider[tx.provider] = { count: 0, amount: 0 }; report.byProvider[tx.provider].count++; report.byProvider[tx.provider].amount += tx.amount; if (!report.byPaymentMethod[tx.paymentMethod]) report.byPaymentMethod[tx.paymentMethod] = { count: 0, amount: 0 }; report.byPaymentMethod[tx.paymentMethod].count++; report.byPaymentMethod[tx.paymentMethod].amount += tx.amount; if (!report.byStatus[tx.status]) report.byStatus[tx.status] = { count: 0, amount: 0 }; report.byStatus[tx.status].count++; report.byStatus[tx.status].amount += tx.amount; const hour = tx.createdAt.getHours(); report.hourlyBreakdown[hour].count++; report.hourlyBreakdown[hour].amount += tx.amount; }
    return report;
  }
}