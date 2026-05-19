import { Router } from 'express';
import { getCheckoutPage, verifyPayment } from '../controllers/payment.controller';

const router = Router();

// Endpoint to fetch / open the payment checkout page
router.get('/checkout/:orderId', getCheckoutPage);

// Endpoint to verify Razorpay transaction signatures
router.post('/verify', verifyPayment);

export default router;
