import { Router } from 'express';
import { createOrder, getOrderById, updateOrderStatus, getMyOrders, addPreview, getAvailableOrders, claimOrder } from '../controllers/order.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authMiddleware, createOrder);
router.get('/my', authMiddleware, getMyOrders);
router.get('/available', getAvailableOrders);
router.get('/:id', authMiddleware, getOrderById);
router.patch('/:id/status', authMiddleware, updateOrderStatus);
router.post('/:id/previews', authMiddleware, addPreview);
router.post('/:id/claim', authMiddleware, claimOrder);

export default router;
