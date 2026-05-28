import { Router } from 'express';
import { createOrder, getOrderById, updateOrderStatus, getMyOrders, getAvailableOrders, claimOrder, uploadRawVideo, getSignedVideo, uploadPreviewVideo, uploadFinalVideo, submitReview, cancelOrder } from '../controllers/order.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authMiddleware, createOrder);
router.get('/my', authMiddleware, getMyOrders);
router.get('/available', authMiddleware, getAvailableOrders);
router.get('/:id', authMiddleware, getOrderById);
router.patch('/:id/status', authMiddleware, updateOrderStatus);
router.post('/:id/claim', authMiddleware, claimOrder);
router.post('/:id/previews', authMiddleware, uploadPreviewVideo);
router.post('/:id/final', authMiddleware, uploadFinalVideo);
router.post('/:id/video', authMiddleware, uploadRawVideo);
router.get('/:id/video-signed', authMiddleware, getSignedVideo);
router.post('/:id/review', authMiddleware, submitReview);
router.post('/:id/cancel', authMiddleware, cancelOrder);

export default router;
