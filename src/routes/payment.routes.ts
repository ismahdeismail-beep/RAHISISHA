import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validatePayment } from '../middleware/validation.middleware';

const router = Router();
const paymentController = new PaymentController();

router.post('/', authMiddleware, validatePayment, paymentController.processPayment);
router.post('/:id/refund', authMiddleware, paymentController.processRefund);
router.get('/:id/status', authMiddleware, paymentController.getStatus);
router.post('/mpesa/stk-push', authMiddleware, paymentController.initiateStkPush);
router.post('/mpesa/b2c', authMiddleware, paymentController.sendB2C);
router.get('/braintree/client-token', authMiddleware, paymentController.getClientToken);

export default router;