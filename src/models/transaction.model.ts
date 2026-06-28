import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  transactionId: string; providerRef?: string; orderId: string; customerId?: string;
  type: 'payment' | 'payout' | 'refund' | 'wallet_credit' | 'wallet_debit' | 'escrow_hold' | 'escrow_release' | 'subscription';
  provider: string; paymentMethod: string; amount: number; currency: string; status: string;
  phoneNumber?: string; accountReference?: string; description?: string; metadata?: Record<string, any>;
  refunds?: Array<{ refundId: string; amount: number; status: string; createdAt: Date }>;
  createdAt: Date; completedAt?: Date; refundedAt?: Date; settledAt?: Date; failedAt?: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  transactionId: { type: String, required: true, unique: true, index: true },
  providerRef: { type: String, index: true },
  orderId: { type: String, required: true, index: true },
  customerId: { type: String, index: true },
  type: { type: String, required: true, enum: ['payment', 'payout', 'refund', 'wallet_credit', 'wallet_debit', 'escrow_hold', 'escrow_release', 'subscription'] },
  provider: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'KES', uppercase: true, trim: true },
  status: { type: String, required: true, enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled', 'held', 'settled', 'declined', 'disputed'], default: 'pending' },
  phoneNumber: { type: String, trim: true },
  accountReference: { type: String, trim: true },
  description: { type: String, trim: true },
  metadata: { type: Schema.Types.Mixed, default: {} },
  refunds: [{ refundId: { type: String, required: true }, amount: { type: Number, required: true }, status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' }, createdAt: { type: Date, default: Date.now } }],
  createdAt: { type: Date, default: Date.now, index: true },
  completedAt: { type: Date },
  refundedAt: { type: Date },
  settledAt: { type: Date },
  failedAt: { type: Date },
});

TransactionSchema.index({ customerId: 1, createdAt: -1 });
TransactionSchema.index({ provider: 1, status: 1, createdAt: -1 });
TransactionSchema.index({ orderId: 1, provider: 1 });
TransactionSchema.index({ status: 1, createdAt: -1 });
TransactionSchema.index({ phoneNumber: 1, createdAt: -1 });
TransactionSchema.index({ status: 1, createdAt: 1 }, { expireAfterSeconds: 604800, partialFilterExpression: { status: 'pending' } });

export const TransactionModel = mongoose.model<ITransaction>('Transaction', TransactionSchema);