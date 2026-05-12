import { Router } from 'express';
import { createOrder, getOrderById, updateOrderStatus, getMyOrders } from '../controllers/order.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authMiddleware, createOrder);
router.get('/my', authMiddleware, getMyOrders);
router.get('/:id', authMiddleware, getOrderById);
router.patch('/:id/status', authMiddleware, updateOrderStatus);

export default router;
