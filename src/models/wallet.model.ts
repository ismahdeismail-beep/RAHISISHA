import mongoose, { Schema, Document } from 'mongoose';

export interface IWallet extends Document {
  userId: string; currency: string; balance: number; heldBalance: number;
  totalDeposited: number; totalWithdrawn: number; status: 'active' | 'frozen' | 'closed';
  lastActivityAt: Date; createdAt: Date; updatedAt: Date;
}

const WalletSchema = new Schema<IWallet>({
  userId: { type: String, required: true, index: true },
  currency: { type: String, default: 'KES', uppercase: true, trim: true },
  balance: { type: Number, default: 0, min: 0 },
  heldBalance: { type: Number, default: 0, min: 0 },
  totalDeposited: { type: Number, default: 0, min: 0 },
  totalWithdrawn: { type: Number, default: 0, min: 0 },
  status: { type: String, enum: ['active', 'frozen', 'closed'], default: 'active' },
  lastActivityAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

WalletSchema.index({ userId: 1, currency: 1 }, { unique: true });
WalletSchema.index({ status: 1, lastActivityAt: -1 });
WalletSchema.virtual('availableBalance').get(function() { return this.balance - this.heldBalance; });
WalletSchema.pre('save', function(next) { this.updatedAt = new Date(); next(); });

export const WalletModel = mongoose.model<IWallet>('Wallet', WalletSchema);