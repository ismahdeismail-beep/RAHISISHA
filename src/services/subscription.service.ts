import { BraintreeProvider } from '../providers/braintree.provider';
import { MpesaProvider } from '../providers/mpesa.provider';
import { SubscriptionModel } from '../models';
import { logger } from '../utils/logger';

export class SubscriptionService {
  private braintree: BraintreeProvider;
  private mpesa: MpesaProvider;

  constructor() { this.braintree = new BraintreeProvider(); this.mpesa = new MpesaProvider(); }

  async createPlan(planData: { name: string; description: string; amount: number; currency: string; interval: 'daily' | 'weekly' | 'monthly' | 'yearly'; intervalCount: number; trialDays?: number; setupFee?: number }): Promise<any> {
    return SubscriptionModel.create({ planId: `PLAN-${Date.now()}`, ...planData, status: 'active', createdAt: new Date() });
  }

  async subscribe(subscriptionData: { customerId: string; planId: string; paymentMethod: 'card' | 'mpesa'; paymentToken?: string; phoneNumber?: string; startDate?: Date }): Promise<any> {
    const plan = await SubscriptionModel.findOne({ planId: subscriptionData.planId });
    if (!plan) throw new Error('Plan not found');
    let providerSubscription;
    if (subscriptionData.paymentMethod === 'card') providerSubscription = await this.braintree.createSubscription(plan.planId, subscriptionData.paymentToken!, { id: subscriptionData.customerId, amount: plan.amount });
    else providerSubscription = { success: true, transactionId: `MP-SUB-${Date.now()}`, status: 'active' };
    return SubscriptionModel.create({ subscriptionId: `SUB-${Date.now()}`, customerId: subscriptionData.customerId, planId: subscriptionData.planId, paymentMethod: subscriptionData.paymentMethod, providerSubscriptionId: providerSubscription.transactionId, status: 'active', nextBillingDate: this.calculateNextBillingDate(plan), amount: plan.amount, currency: plan.currency, phoneNumber: subscriptionData.phoneNumber, createdAt: new Date() });
  }

  async cancelSubscription(subscriptionId: string, reason?: string): Promise<any> {
    const subscription = await SubscriptionModel.findOne({ subscriptionId });
    if (!subscription) throw new Error('Subscription not found');
    if (subscription.paymentMethod === 'card') await this.braintree.cancelSubscription(subscription.providerSubscriptionId!);
    await SubscriptionModel.updateOne({ subscriptionId }, { $set: { status: 'cancelled', cancelledAt: new Date(), cancelReason: reason } });
    return { success: true, subscriptionId, status: 'cancelled' };
  }

  async processRecurringPayments(): Promise<any> {
    const dueSubscriptions = await SubscriptionModel.find({ status: 'active', nextBillingDate: { $lte: new Date() } });
    const results = [];
    for (const sub of dueSubscriptions) {
      try {
        let paymentResult;
        if (sub.paymentMethod === 'card') paymentResult = { success: true, autoHandled: true };
        else if (sub.paymentMethod === 'mpesa') paymentResult = await this.mpesa.initiateStkPush({ phoneNumber: sub.phoneNumber!, amount: sub.amount, orderId: `${sub.subscriptionId}-${Date.now()}`, accountReference: sub.subscriptionId, description: `Subscription payment for ${sub.planId}` });
        const plan = await SubscriptionModel.findOne({ planId: sub.planId });
        await SubscriptionModel.updateOne({ subscriptionId: sub.subscriptionId }, { $set: { nextBillingDate: this.calculateNextBillingDate(plan!), lastPaymentDate: new Date(), lastPaymentStatus: paymentResult.success ? 'success' : 'failed' } });
        results.push({ subscriptionId: sub.subscriptionId, success: paymentResult.success });
      } catch (error: any) { results.push({ subscriptionId: sub.subscriptionId, success: false, error: error.message }); }
    }
    return results;
  }

  private calculateNextBillingDate(plan: any): Date {
    const now = new Date();
    switch (plan.interval) { case 'daily': return new Date(now.setDate(now.getDate() + plan.intervalCount)); case 'weekly': return new Date(now.setDate(now.getDate() + (plan.intervalCount * 7))); case 'monthly': return new Date(now.setMonth(now.getMonth() + plan.intervalCount)); case 'yearly': return new Date(now.setFullYear(now.getFullYear() + plan.intervalCount)); default: return new Date(now.setMonth(now.getMonth() + 1)); }
  }

  async getPlans(): Promise<any> { return SubscriptionModel.find({ type: { $exists: false } }).sort({ createdAt: -1 }); }
  async getSubscriptions(customerId: string): Promise<any> { return SubscriptionModel.find({ customerId }).sort({ createdAt: -1 }); }
  async pauseSubscription(subscriptionId: string): Promise<any> { await SubscriptionModel.updateOne({ subscriptionId }, { $set: { status: 'paused', pauseCollection: true, pauseCollectionResumesAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } }); return { success: true, subscriptionId, status: 'paused' }; }
  async resumeSubscription(subscriptionId: string): Promise<any> { await SubscriptionModel.updateOne({ subscriptionId }, { $set: { status: 'active', pauseCollection: false, pauseCollectionResumesAt: null } }); return { success: true, subscriptionId, status: 'active' }; }
}