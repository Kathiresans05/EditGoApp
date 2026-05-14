import { Router } from 'express';
import { getDashboardStats, getAllUsers, getAllEditors, getAllOrders, getRevenueData } from '../controllers/admin.controller';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/stats', authMiddleware, adminMiddleware, getDashboardStats);
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);
router.get('/editors', authMiddleware, adminMiddleware, getAllEditors);
router.get('/orders', authMiddleware, adminMiddleware, getAllOrders);
router.get('/revenue', authMiddleware, adminMiddleware, getRevenueData);

export default router;
