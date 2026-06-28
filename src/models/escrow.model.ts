import mongoose, { Schema, Document } from 'mongoose';

export interface IEscrow extends Document {
  escrowId: string; buyerId: string; sellerId: string; amount: number; currency: string;
  description: string; status: 'created' | 'funded' | 'in_progress' | 'completed' | 'refunded' | 'disputed' | 'cancelled';
  paymentMethod?: string; paymentTransactionId?: string;
  milestones: Array<{ milestoneId: string; description: string; amount: number; status: 'pending' | 'released' | 'disputed'; releasedAt?: Date; releaseTransactionId?: string; releasedBy?: string }>;
  inspectionPeriod: number; fundedAt?: Date; completedAt?: Date; refundedAt?: Date;
  refundReason?: string; refundTransactionId?: string; disputedAt?: Date;
  disputeReason?: string; disputeEvidence?: string[]; disputeResolution?: string;
  createdAt: Date; updatedAt: Date;
}

const EscrowSchema = new Schema<IEscrow>({
  escrowId: { type: String, required: true, unique: true, index: true },
  buyerId: { type: String, required: true, index: true },
  sellerId: { type: String, required: true, index: true },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'KES', uppercase: true },
  description: { type: String, required: true, trim: true },
  status: { type: String, enum: ['created', 'funded', 'in_progress', 'completed', 'refunded', 'disputed', 'cancelled'], default: 'created', index: true },
  paymentMethod: { type: String },
  paymentTransactionId: { type: String, index: true },
  milestones: [{
    milestoneId: { type: String, required: true, default: () => `MIL-${Date.now()}-${Math.random().toString(36).substring(2, 6)}` },
    description: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['pending', 'released', 'disputed'], default: 'pending' },
    releasedAt: { type: Date },
    releaseTransactionId: { type: String },
    releasedBy: { type: String }
  }],
  inspectionPeriod: { type: Number, default: 3, min: 1, max: 30 },
  fundedAt: { type: Date },
  completedAt: { type: Date },
  refundedAt: { type: Date },
  refundReason: { type: String },
  refundTransactionId: { type: String },
  disputedAt: { type: Date },
  disputeReason: { type: String },
  disputeEvidence: [{ type: String }],
  disputeResolution: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

EscrowSchema.index({ buyerId: 1, status: 1, createdAt: -1 });
EscrowSchema.index({ sellerId: 1, status: 1, createdAt: -1 });
EscrowSchema.index({ status: 1, fundedAt: -1 });
EscrowSchema.pre('save', function(next) { this.updatedAt = new Date(); next(); });

export const EscrowModel = mongoose.model<IEscrow>('Escrow', EscrowSchema);