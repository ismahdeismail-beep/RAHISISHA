import { Request, Response, NextFunction } from 'express';
import { SubscriptionService } from '../services/subscription.service';
import { successResponse } from '../utils/response-handler';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class SubscriptionController {
  private subscriptionService: SubscriptionService;

  constructor() {
    this.subscriptionService = new SubscriptionService();
  }

  createPlan = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const plan = await this.subscriptionService.createPlan(req.body);
      successResponse(res, plan, 201);
    } catch (error) {
      next(error);
    }
  };

  getPlans = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Implementation would fetch plans
      successResponse(res, []);
    } catch (error) {
      next(error);
    }
  };

  subscribe = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const subscription = await this.subscriptionService.subscribe({
        ...req.body,
        customerId: req.user!.id,
      });
      successResponse(res, subscription, 201);
    } catch (error) {
      next(error);
    }
  };

  getSubscriptions = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Implementation would fetch user subscriptions
      successResponse(res, []);
    } catch (error) {
      next(error);
    }
  };

  cancelSubscription = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const result = await this.subscriptionService.cancelSubscription(id, reason);
      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  };

  pauseSubscription = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      // Implementation would pause subscription
      successResponse(res, { subscriptionId: id, status: 'paused' });
    } catch (error) {
      next(error);
    }
  };

  resumeSubscription = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      // Implementation would resume subscription
      successResponse(res, { subscriptionId: id, status: 'active' });
    } catch (error) {
      next(error);
    }
  };
}