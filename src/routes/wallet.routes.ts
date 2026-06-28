import { Router } from 'express';
import { WalletController } from '../controllers/wallet.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const walletController = new WalletController();

router.get('/balance', authMiddleware, walletController.getBalance);
router.post('/fund', authMiddleware, walletController.fundWallet);
router.post('/withdraw', authMiddleware, walletController.withdraw);
router.post('/transfer', authMiddleware, walletController.transfer);

export default router;