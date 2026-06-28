import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/payment.service';
import { successResponse } from '../utils/response-handler';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class PaymentController {
  private paymentService: PaymentService;
  constructor() { this.paymentService = new PaymentService(); }

  processPayment = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try { const result = await this.paymentService.processPayment(req.body); successResponse(res, result, result.status === 'completed' ? 200 : 202); }
    catch (error) { next(error); }
  };

  processRefund = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try { const { id } = req.params; const { amount } = req.body; const result = await this.paymentService.processRefund(id, req.body.provider, amount); successResponse(res, result); }
    catch (error) { next(error); }
  };

  getStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try { const { id } = req.params; const { provider } = req.query; const result = await this.paymentService.getTransactionStatus(id, provider as string); successResponse(res, result); }
    catch (error) { next(error); }
  };

  initiateStkPush = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try { const result = await this.paymentService.processPayment({ ...req.body, provider: 'mpesa', paymentMethod: 'stk_push' }); successResponse(res, result, 202); }
    catch (error) { next(error); }
  };

  sendB2C = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try { const result = await this.paymentService.processPayment({ ...req.body, provider: 'mpesa', paymentMethod: 'b2c' }); successResponse(res, result, 202); }
    catch (error) { next(error); }
  };

  getClientToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try { const { customerId } = req.query; const token = await this.paymentService.generateBraintreeClientToken(customerId as string); successResponse(res, { clientToken: token }); }
    catch (error) { next(error); }
  };
}