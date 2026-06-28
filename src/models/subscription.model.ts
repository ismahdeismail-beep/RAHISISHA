import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
  subscriptionId: string; customerId: string; planId: string; paymentMethod: 'card' | 'mpesa';
  providerSubscriptionId?: string; status: 'active' | 'cancelled' | 'past_due' | 'paused' | 'trialing';
  nextBillingDate: Date; lastPaymentDate?: Date; lastPaymentStatus?: 'success' | 'failed';
  failureCount: number; amount: number; currency: string; phoneNumber?: string;
  cardLast4?: string; cardBrand?: string; trialEnd?: Date; cancelledAt?: Date;
  cancelReason?: string; pauseCollection?: boolean; pauseCollectionResumesAt?: Date;
  metadata?: Record<string, any>; createdAt: Date; updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>({
  subscriptionId: { type: String, required: true, unique: true, index: true },
  customerId: { type: String, required: true, index: true },
  planId: { type: String, required: true, index: true },
  paymentMethod: { type: String, enum: ['card', 'mpesa'], required: true },
  providerSubscriptionId: { type: String, index: true },
  status: { type: String, enum: ['active', 'cancelled', 'past_due', 'paused', 'trialing'], default: 'active', index: true },
  nextBillingDate: { type: Date, required: true, index: true },
  lastPaymentDate: { type: Date },
  lastPaymentStatus: { type: String, enum: ['success', 'failed'] },
  failureCount: { type: Number, default: 0, min: 0 },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'KES', uppercase: true },
  phoneNumber: { type: String, trim: true },
  cardLast4: { type: String, trim: true },
  cardBrand: { type: String, trim: true },
  trialEnd: { type: Date },
  cancelledAt: { type: Date },
  cancelReason: { type: String, trim: true },
  pauseCollection: { type: Boolean, default: false },
  pauseCollectionResumesAt: { type: Date },
  metadata: { type: Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

SubscriptionSchema.index({ customerId: 1, status: 1, createdAt: -1 });
SubscriptionSchema.index({ status: 1, nextBillingDate: 1 });
SubscriptionSchema.index({ planId: 1, status: 1 });
SubscriptionSchema.pre('save', function(next) { this.updatedAt = new Date(); next(); });

export const SubscriptionModel = mongoose.model<ISubscription>('Subscription', SubscriptionSchema);