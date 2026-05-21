import { Router } from 'express';
import { createPaymentOrder, verifyPayment } from '../controllers/payment.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Create a razorpay order to initiate checkout
router.post('/create-order', authMiddleware, createPaymentOrder);

// Verify payment signature after successful client transaction
router.post('/verify', authMiddleware, verifyPayment);

export default router;
