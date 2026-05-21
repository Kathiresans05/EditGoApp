import { Router } from 'express';
import { createOrder, getOrderById, updateOrderStatus, getMyOrders, addPreview, getAvailableOrders, claimOrder, uploadRawVideo, getSignedVideo } from '../controllers/order.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authMiddleware, createOrder);
router.get('/my', authMiddleware, getMyOrders);
router.get('/available', authMiddleware, getAvailableOrders);
router.get('/:id', authMiddleware, getOrderById);
router.patch('/:id/status', authMiddleware, updateOrderStatus);
router.post('/:id/claim', authMiddleware, claimOrder);
router.post('/:id/previews', authMiddleware, addPreview);
router.post('/:id/video', authMiddleware, uploadRawVideo);
router.get('/:id/video-signed', authMiddleware, getSignedVideo);

export default router;
