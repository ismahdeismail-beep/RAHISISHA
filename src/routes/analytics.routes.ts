import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { authMiddleware, requireRole } from '../middleware/auth.middleware';

const router = Router();
const analyticsController = new AnalyticsController();

router.get('/dashboard', authMiddleware, analyticsController.getDashboard);
router.get('/transactions', authMiddleware, requireRole(['admin']), analyticsController.getTransactionReport);
router.get('/revenue', authMiddleware, requireRole(['admin']), analyticsController.getRevenueReport);
router.get('/providers', authMiddleware, requireRole(['admin']), analyticsController.getProviderStats);

export default router;
