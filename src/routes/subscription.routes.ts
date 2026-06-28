import { Router } from 'express';
import { SubscriptionController } from '../controllers/subscription.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const subscriptionController = new SubscriptionController();

router.post('/plans', authMiddleware, subscriptionController.createPlan);
router.get('/plans', authMiddleware, subscriptionController.getPlans);
router.post('/', authMiddleware, subscriptionController.subscribe);
router.get('/', authMiddleware, subscriptionController.getSubscriptions);
router.delete('/:id', authMiddleware, subscriptionController.cancelSubscription);
router.post('/:id/pause', authMiddleware, subscriptionController.pauseSubscription);
router.post('/:id/resume', authMiddleware, subscriptionController.resumeSubscription);

export default router;