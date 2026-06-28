import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export const verifyMpesaSignature = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.body || !req.body.Body) { res.status(400).json({ error: 'Invalid M-Pesa payload' }); return; }
  next();
};

export const verifyPesapalSignature = (req: Request, res: Response, next: NextFunction): void => {
  const signature = req.headers['x-pesapal-signature'] as string;
  if (!signature) { res.status(401).json({ error: 'Missing PesaPal signature' }); return; }
  const expectedSignature = crypto.createHmac('sha256', process.env.PESAPAL_CONSUMER_SECRET!).update(JSON.stringify(req.body)).digest('hex');
  if (signature !== expectedSignature) { res.status(401).json({ error: 'Invalid PesaPal signature' }); return; }
  next();
};