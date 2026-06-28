import { Request, Response, NextFunction } from 'express';
import { WalletService } from '../services/wallet.service';
import { successResponse } from '../utils/response-handler';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class WalletController {
  private walletService: WalletService;
  constructor() { this.walletService = new WalletService(); }

  getBalance = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try { const { currency } = req.query; const balance = await this.walletService.getBalance(req.user!.id, currency as string); successResponse(res, { balance, currency: currency || 'KES' }); }
    catch (error) { next(error); }
  };

  fundWallet = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try { const { amount, currency, paymentMethod, phoneNumber } = req.body; const result = await this.walletService.fundWallet(req.user!.id, amount, currency, paymentMethod, phoneNumber); successResponse(res, result, 202); }
    catch (error) { next(error); }
  };

  withdraw = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try { const { amount, currency, destination } = req.body; const result = await this.walletService.withdraw(req.user!.id, amount, currency, destination); successResponse(res, result); }
    catch (error) { next(error); }
  };

  transfer = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try { const { toUserId, amount, currency, reference } = req.body; const result = await this.walletService.transferBetweenWallets(req.user!.id, toUserId, amount, currency, reference); successResponse(res, result); }
    catch (error) { next(error); }
  };
}