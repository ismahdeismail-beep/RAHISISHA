import { Request, Response, NextFunction } from 'express';
import { EscrowService } from '../services/escrow.service';
import { successResponse } from '../utils/response-handler';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class EscrowController {
  private escrowService: EscrowService;

  constructor() {
    this.escrowService = new EscrowService();
  }

  createEscrow = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const escrow = await this.escrowService.createEscrow({
        ...req.body,
        buyerId: req.user!.id,
      });
      successResponse(res, escrow, 201);
    } catch (error) {
      next(error);
    }
  };

  fundEscrow = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.escrowService.fundEscrow(id, req.body.paymentMethod, req.body.paymentDetails);
      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  };

  releaseMilestone = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { milestoneIndex } = req.body;
      const result = await this.escrowService.releaseMilestone(id, milestoneIndex);
      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  };

  refundBuyer = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const result = await this.escrowService.refundBuyer(id, reason);
      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  };

  disputeEscrow = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { reason, evidence } = req.body;
      const result = await this.escrowService.disputeEscrow(id, reason, evidence);
      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  };

  getEscrow = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      // Implementation would fetch escrow details
      successResponse(res, { escrowId: id });
    } catch (error) {
      next(error);
    }
  };
}