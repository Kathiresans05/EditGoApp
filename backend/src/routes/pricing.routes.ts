import { Router } from 'express';
import { getPricingConfig, updatePricingConfig } from '../controllers/pricing.controller';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Publicly readable so the app can fetch it without strict auth
router.get('/', getPricingConfig);

// Only ADMIN can update prices
router.post('/update', authMiddleware, adminMiddleware, updatePricingConfig);

export default router;
