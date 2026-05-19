import { Request, Response } from 'express';
import crypto from 'crypto';
import prisma from '../prisma';
import { createRazorpayOrder } from '../services/razorpay.service';

/**
 * Serves a beautiful web checkout page that loads the Razorpay Standard SDK overlay.
 */
export const getCheckoutPage = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { customer: true },
    });

    if (!order) {
      return res.status(404).send('<h1>Order not found</h1>');
    }

    // 1. Create a Razorpay Order
    let razorpayOrder;
    try {
      razorpayOrder = await createRazorpayOrder(order.price);
    } catch (rzpErr: any) {
      console.error('[Razorpay] Order creation failed:', rzpErr);
      return res.status(500).send(`<h1>Razorpay Initialization Failed</h1><p>${rzpErr.message}</p>`);
    }

    const keyId = process.env.RAZORPAY_KEY_ID || '';
    const amountInPaise = Math.round(order.price * 100);

    // 2. Render a gorgeous HTML Checkout overlay page
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>EditGo Secure Payment</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Outfit', sans-serif; }
        </style>
      </head>
      <body class="bg-slate-900 text-slate-100 flex flex-col items-center justify-center min-h-screen px-4">
        
        <div class="w-full max-w-md bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-3xl p-8 shadow-2xl text-center flex flex-col items-center">
          
          <!-- Brand Logo -->
          <div class="w-16 h-16 bg-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/20 mb-6">
            <span class="text-2xl font-extrabold text-white tracking-wider">EG</span>
          </div>

          <h2 class="text-2xl font-extrabold tracking-tight mb-1 text-white">Secure Checkout</h2>
          <p class="text-slate-400 text-sm mb-6">Preparing secure payment gateway...</p>

          <!-- Order Summary Card -->
          <div class="w-full bg-slate-900/50 border border-slate-700/30 rounded-2xl p-5 mb-8 text-left">
            <span class="text-[10px] uppercase tracking-widest font-bold text-slate-500">Order ID</span>
            <div class="text-xs font-semibold text-slate-300 mb-3">#${order.id.slice(-8).toUpperCase()}</div>

            <span class="text-[10px] uppercase tracking-widest font-bold text-slate-500">Project</span>
            <div class="text-sm font-semibold text-slate-200 mb-4">${order.title}</div>

            <div class="h-px bg-slate-700/30 w-full mb-4"></div>

            <div class="flex justify-between items-center">
              <span class="text-xs font-semibold text-slate-400">Total Amount</span>
              <span class="text-2xl font-extrabold text-violet-400">₹${order.price}</span>
            </div>
          </div>

          <!-- Action Button -->
          <button id="pay-button" class="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-violet-600/20 transition-all duration-300 transform active:scale-95 mb-4">
            Pay with Razorpay
          </button>
          
          <div class="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            128-bit SSL Secured Connection
          </div>
        </div>

        <script>
          const options = {
            key: "${keyId}",
            amount: ${amountInPaise},
            currency: "INR",
            name: "EditGo Studio",
            description: "Payment for Order #${order.id.slice(-6).toUpperCase()}",
            order_id: "${razorpayOrder.id}",
            prefill: {
              name: "${order.customer.name || ''}",
              email: "${order.customer.email || ''}",
              contact: "${order.customer.phone || ''}"
            },
            theme: {
              color: "#7C3AED"
            },
            handler: function (response) {
              // Send signature verification to backend
              fetch('/api/payments/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  orderId: "${order.id}",
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                })
              })
              .then(res => res.json())
              .then(data => {
                if (data.success) {
                  // Redirect to Mobile app scheme
                  window.location.href = "editgo://payment-success?status=success&orderId=${order.id}&paymentId=" + response.razorpay_payment_id;
                } else {
                  window.location.href = "editgo://payment-success?status=failed&orderId=${order.id}";
                }
              })
              .catch(err => {
                window.location.href = "editgo://payment-success?status=failed&orderId=${order.id}";
              });
            },
            modal: {
              ondismiss: function() {
                window.location.href = "editgo://payment-success?status=cancel&orderId=${order.id}";
              }
            }
          };

          const rzp = new Razorpay(options);

          document.getElementById('pay-button').onclick = function(e) {
            rzp.open();
            e.preventDefault();
          };

          // Auto-trigger Razorpay checkout modal instantly on page load
          window.onload = function() {
            setTimeout(() => {
              rzp.open();
            }, 800);
          };
        </script>
      </body>
      </html>
    `;

    res.send(htmlContent);
  } catch (error: any) {
    res.status(500).send(`<h1>Server Error</h1><p>${error.message}</p>`);
  }
};

/**
 * Verifies Razorpay payment signature and updates the order status in DB.
 */
export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET || '';

    // Verify HMAC SHA256 Signature
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpay_signature) {
      console.error('[Razorpay] Signature mismatch!');
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    console.log('[Razorpay] Payment Signature Verified! Updating order database status...');

    // Update order status in DB
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paymentId: razorpay_payment_id,
      },
    });

    res.status(200).json({ success: true, message: 'Payment verified successfully!', order: updatedOrder });
  } catch (error: any) {
    console.error('[Razorpay] Verification Server Error:', error);
    res.status(500).json({ success: false, message: 'Server verification failed', error: error.message });
  }
};
