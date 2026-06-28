import { Router } from 'express';
import { WebhookController } from '../controllers/webhook.controller';
import { verifyMpesaSignature, verifyPesapalSignature } from '../middleware/webhook.middleware';

const router = Router();
const webhookController = new WebhookController();

router.post('/mpesa/stk', verifyMpesaSignature, webhookController.handleMpesaStkCallback);
router.post('/mpesa/confirmation', verifyMpesaSignature, webhookController.handleMpesaC2BConfirmation);
router.post('/mpesa/validation', verifyMpesaSignature, webhookController.handleMpesaC2BValidation);
router.post('/mpesa/b2c-result', verifyMpesaSignature, webhookController.handleMpesaB2CResult);
router.post('/mpesa/b2c-timeout', verifyMpesaSignature, webhookController.handleMpesaB2CTimeout);
router.post('/braintree', webhookController.handleBraintreeWebhook);
router.post('/pesapal', verifyPesapalSignature, webhookController.handlePesapalCallback);

export default router;