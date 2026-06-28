import { Request, Response } from 'express';
import { TransactionModel, SubscriptionModel } from '../models';
import { logger } from '../utils/logger';

export class WebhookController {
  async handleMpesaStkCallback(req: Request, res: Response): Promise<void> {
    try {
      const { Body } = req.body; const result = Body.stkCallback;
      const checkoutRequestId = result.CheckoutRequestID; const resultCode = result.ResultCode;
      if (resultCode === 0) {
        const metadata = result.CallbackMetadata.Item;
        const amount = metadata.find((item: any) => item.Name === 'Amount')?.Value;
        const mpesaReceiptNumber = metadata.find((item: any) => item.Name === 'MpesaReceiptNumber')?.Value;
        const transactionDate = metadata.find((item: any) => item.Name === 'TransactionDate')?.Value;
        const phoneNumber = metadata.find((item: any) => item.Name === 'PhoneNumber')?.Value;
        await TransactionModel.updateOne({ transactionId: checkoutRequestId }, { $set: { status: 'completed', providerRef: mpesaReceiptNumber, completedAt: new Date(), 'metadata.mpesaReceiptNumber': mpesaReceiptNumber, 'metadata.transactionDate': transactionDate, 'metadata.phoneNumber': phoneNumber } });
      } else { await TransactionModel.updateOne({ transactionId: checkoutRequestId }, { $set: { status: 'failed', errorCode: resultCode, errorMessage: result.ResultDesc } } ); }
      res.status(200).json({ ResultCode: 0, ResultDesc: 'Success' });
    } catch (error) { logger.error('M-Pesa STK webhook error:', error); res.status(500).json({ ResultCode: 1, ResultDesc: 'Error' }); }
  }

  async handleMpesaC2BConfirmation(req: Request, res: Response): Promise<void> {
    try {
      const { TransID, TransTime, TransAmount, MSISDN, FirstName, LastName, BillRefNumber } = req.body;
      await TransactionModel.create({ transactionId: TransID, providerRef: req.body.ThirdPartyTransID, type: 'payment', provider: 'mpesa', paymentMethod: 'c2b', amount: parseFloat(TransAmount), currency: 'KES', status: 'completed', phoneNumber: MSISDN, accountReference: BillRefNumber, description: `C2B from ${FirstName} ${LastName}`, metadata: { transTime: TransTime, businessShortCode: req.body.BusinessShortCode }, createdAt: new Date() });
      res.status(200).json({ ResultCode: 0, ResultDesc: 'Success' });
    } catch (error) { logger.error('C2B confirmation error:', error); res.status(500).json({ ResultCode: 1, ResultDesc: 'Error' }); }
  }

  async handleMpesaC2BValidation(req: Request, res: Response): Promise<void> {
    const { TransAmount } = req.body;
    if (parseFloat(TransAmount) < 10) { res.status(200).json({ ResultCode: 1, ResultDesc: 'Rejected' }); return; }
    res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
  }

  async handleMpesaB2CResult(req: Request, res: Response): Promise<void> {
    try {
      const { Result } = req.body; const conversationId = Result.ConversationID; const resultCode = Result.ResultCode;
      const transactionParams = Result.ResultParameters?.ResultParameter || [];
      const transactionId = transactionParams.find((p: any) => p.Key === 'TransactionID')?.Value;
      await TransactionModel.updateOne({ transactionId: conversationId }, { $set: { status: resultCode === 0 ? 'completed' : 'failed', providerRef: transactionId, completedAt: new Date(), 'metadata.resultDesc': Result.ResultDesc, 'metadata.transactionId': transactionId } });
      res.status(200).json({ ResultCode: 0, ResultDesc: 'Success' });
    } catch (error) { logger.error('B2C result error:', error); res.status(500).json({ ResultCode: 1, ResultDesc: 'Error' }); }
  }

  async handleBraintreeWebhook(req: Request, res: Response): Promise<void> {
    try {
      const { bt_signature, bt_payload } = req.body;
      logger.info('Braintree webhook received:', { type: bt_payload?.kind });
      res.status(200).send('OK');
    } catch (error) { logger.error('Braintree webhook error:', error); res.status(500).send('Error'); }
  }

  async handlePesapalCallback(req: Request, res: Response): Promise<void> {
    try {
      const { OrderTrackingId, OrderMerchantReference } = req.body;
      await TransactionModel.updateOne({ transactionId: OrderTrackingId }, { $set: { status: 'completed', completedAt: new Date() } });
      res.status(200).json({ status: 'success' });
    } catch (error) { logger.error('PesaPal callback error:', error); res.status(500).json({ status: 'error' }); }
  }

  async handleMpesaB2CTimeout(req: Request, res: Response): Promise<void> {
    try { const { Result } = req.body; await TransactionModel.updateOne({ transactionId: Result.ConversationID }, { $set: { status: 'failed', errorMessage: 'B2C timeout' } }); res.status(200).json({ ResultCode: 0, ResultDesc: 'Success' }); }
    catch (error) { logger.error('B2C timeout error:', error); res.status(500).json({ ResultCode: 1, ResultDesc: 'Error' }); }
  }
}