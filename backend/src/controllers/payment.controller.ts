import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Initialize Razorpay
// Note: In production, use environment variables for keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mockkey12345',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'mocksecret1234567890',
});

export const createPaymentOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;
    // Assuming authMiddleware attaches user
    const customerId = (req as any).user.id; 

    // 1. Fetch the Order from Database
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.customerId !== customerId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    if (order.isPaid) {
      return res.status(400).json({ success: false, message: 'Order is already paid' });
    }

    // 2. Create Razorpay Order
    const options = {
      amount: Math.round(order.price * 100), // Amount in smallest unit (paise)
      currency: "INR",
      receipt: `receipt_order_${order.id.slice(-6)}`,
      notes: {
        orderId: order.id,
        customerId: customerId,
      }
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      data: {
        id: razorpayOrder.id,
        currency: razorpayOrder.currency,
        amount: razorpayOrder.amount,
        key: process.env.RAZORPAY_KEY_ID || 'rzp_test_mockkey12345',
      }
    });

  } catch (error: any) {
    console.error('Error creating payment order:', error);
    res.status(500).json({ success: false, message: 'Error initiating payment', error: error.message });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      internal_order_id
    } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET || 'mocksecret1234567890';
    
    // Verify signature
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    // Update the Order status in the database
    const updatedOrder = await prisma.order.update({
      where: { id: internal_order_id },
      data: {
        isPaid: true,
        paymentId: razorpay_payment_id,
        status: 'SEARCHING', // Move to searching for editors once paid
      }
    });

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: updatedOrder
    });

  } catch (error: any) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, message: 'Payment verification failed', error: error.message });
  }
};
