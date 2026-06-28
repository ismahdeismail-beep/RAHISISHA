import { EscrowModel } from '../models';
import { WalletService } from './wallet.service';
import { PaymentService } from './payment.service';
import { logger } from '../utils/logger';

export class EscrowService {
  private walletService: WalletService;
  private paymentService: PaymentService;

  constructor() { this.walletService = new WalletService(); this.paymentService = new PaymentService(); }

  async createEscrow(request: { buyerId: string; sellerId: string; amount: number; currency?: string; description: string; milestones?: Array<{ description: string; amount: number; dueDate?: Date }>; inspectionPeriod?: number }): Promise<any> {
    const escrow = await EscrowModel.create({ escrowId: `ESC-${Date.now()}`, buyerId: request.buyerId, sellerId: request.sellerId, amount: request.amount, currency: request.currency || 'KES', description: request.description, status: 'created', milestones: request.milestones || [{ description: 'Full payment', amount: request.amount, status: 'pending' }], inspectionPeriod: request.inspectionPeriod || 3, createdAt: new Date() });
    return escrow;
  }

  async fundEscrow(escrowId: string, paymentMethod: string, paymentDetails: any): Promise<any> {
    const escrow = await EscrowModel.findOne({ escrowId });
    if (!escrow) throw new Error('Escrow not found');
    if (escrow.status !== 'created') throw new Error('Escrow already funded or closed');
    let paymentResult;
    if (paymentMethod === 'wallet') paymentResult = await this.walletService.holdFunds(escrow.buyerId, escrow.amount, escrow.currency, escrowId);
    else paymentResult = await this.paymentService.processPayment({ ...paymentDetails, amount: escrow.amount, currency: escrow.currency, orderId: escrowId });
    await EscrowModel.updateOne({ escrowId }, { $set: { status: 'funded', paymentMethod, paymentTransactionId: paymentResult.transactionId, fundedAt: new Date() } });
    return { success: true, escrowId, status: 'funded', paymentResult };
  }

  async releaseMilestone(escrowId: string, milestoneIndex: number = 0): Promise<any> {
    const escrow = await EscrowModel.findOne({ escrowId });
    if (!escrow) throw new Error('Escrow not found');
    if (escrow.status !== 'funded' && escrow.status !== 'in_progress') throw new Error('Escrow not funded');
    const milestone = escrow.milestones[milestoneIndex];
    if (!milestone) throw new Error('Milestone not found');
    if (milestone.status === 'released') throw new Error('Milestone already released');
    const releaseResult = await this.walletService.releaseHeldFunds(escrow.buyerId, milestone.amount, escrow.currency, escrowId, escrow.sellerId);
    escrow.milestones[milestoneIndex].status = 'released';
    escrow.milestones[milestoneIndex].releasedAt = new Date();
    escrow.milestones[milestoneIndex].releaseTransactionId = releaseResult.transactionId;
    const allReleased = escrow.milestones.every(m => m.status === 'released');
    await EscrowModel.updateOne({ escrowId }, { $set: { status: allReleased ? 'completed' : 'in_progress', milestones: escrow.milestones, completedAt: allReleased ? new Date() : null } });
    return { success: true, escrowId, milestoneIndex, status: allReleased ? 'completed' : 'in_progress', releaseResult };
  }

  async refundBuyer(escrowId: string, reason: string): Promise<any> {
    const escrow = await EscrowModel.findOne({ escrowId });
    if (!escrow) throw new Error('Escrow not found');
    if (escrow.status === 'completed') throw new Error('Escrow already completed');
    let refundResult;
    if (escrow.paymentMethod === 'wallet') refundResult = await this.walletService.releaseHeldFunds(escrow.buyerId, escrow.amount, escrow.currency, escrowId);
    else refundResult = await this.paymentService.processRefund(escrow.paymentTransactionId!, escrow.paymentMethod!, escrow.amount);
    await EscrowModel.updateOne({ escrowId }, { $set: { status: 'refunded', refundedAt: new Date(), refundReason: reason, refundTransactionId: refundResult.transactionId } });
    return { success: true, escrowId, status: 'refunded', refundResult };
  }

  async disputeEscrow(escrowId: string, reason: string, evidence?: string[]): Promise<any> {
    await EscrowModel.updateOne({ escrowId }, { $set: { status: 'disputed', disputeReason: reason, disputeEvidence: evidence || [], disputedAt: new Date() } });
    logger.warn(`Dispute raised for escrow ${escrowId}: ${reason}`);
    return { success: true, escrowId, status: 'disputed' };
  }

  async getEscrow(escrowId: string): Promise<any> {
    return EscrowModel.findOne({ escrowId });
  }
}