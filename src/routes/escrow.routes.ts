import { Router } from 'express';
import { EscrowController } from '../controllers/escrow.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateEscrow } from '../middleware/validation.middleware';

const router = Router();
const escrowController = new EscrowController();

router.post('/', authMiddleware, validateEscrow, escrowController.createEscrow);
router.post('/:id/fund', authMiddleware, escrowController.fundEscrow);
router.post('/:id/release', authMiddleware, escrowController.releaseMilestone);
router.post('/:id/refund', authMiddleware, escrowController.refundBuyer);
router.post('/:id/dispute', authMiddleware, escrowController.disputeEscrow);
router.get('/:id', authMiddleware, escrowController.getEscrow);

export default router;