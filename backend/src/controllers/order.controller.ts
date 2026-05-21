import { Request, Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middlewares/auth.middleware';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

// Multer config – store files in /uploads folder with random name
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = crypto.randomBytes(12).toString('hex') + ext;
    cb(null, name);
  },
});
const upload = multer({ storage });

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { title, category, price, videoUrl, editorId, deliverySpeed, initialETAMins, contentSensitivity } = req.body;
    const customerId = req.user.id;

    console.log('[Order] Creating order:', { title, category, price, editorId, deliverySpeed, initialETAMins, contentSensitivity });

    const order = await prisma.order.create({
      data: {
        customerId,
        editorId: editorId || null,
        title: title || `Edit for ${category}`,
        category,
        price: parseFloat(price),
        videoUrl: videoUrl || '',
        status: editorId ? 'ACCEPTED' : 'SEARCHING',
        progress: editorId ? 10 : 0,
        deliverySpeed,
        initialETAMins: initialETAMins ? parseInt(initialETAMins) : null,
        contentSensitivity: contentSensitivity || 'PRIVATE',
      },
    });

    res.status(201).json({ success: true, order });
  } catch (error: any) {
    console.error('[Order] Creation Error:', error);
    res.status(500).json({ success: false, message: 'Failed to create order', error: error.message });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { customerId: req.user.id },
          { editor: { userId: req.user.id } }
        ]
      },
      include: {
        customer: { select: { name: true, avatar: true } },
        editor: { include: { user: { select: { name: true, avatar: true } } } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id: id as string },
      include: { customer: true, editor: { include: { user: true } } },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, progress, finalUrl, isPaid, paymentId } = req.body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (progress !== undefined) updateData.progress = parseInt(progress);
    if (finalUrl !== undefined) updateData.finalUrl = finalUrl;
    if (isPaid !== undefined) updateData.isPaid = isPaid;
    if (paymentId !== undefined) updateData.paymentId = paymentId;

    const order = await prisma.order.update({
      where: { id: id as string },
      data: updateData,
    });

    res.json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update order', error: error.message });
  }
};

// ------------------------------------------------------------
// 1) Upload raw footage from customer (store and save URL)
export const uploadRawVideo = [
  upload.single('video'),
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params; // order id
    if (!req.file) return res.status(400).json({ success: false, message: 'No video file uploaded' });
    const videoUrl = `${process.env.BASE_URL?.replace('/api','')}/uploads/${req.file.filename}`;
    const order = await prisma.order.update({
      where: { id: id as string },
      data: { videoUrl },
    });
    res.json({ success: true, order });
  },
];

// 2) Generate a temporary signed URL for editor to stream raw video
export const getSignedVideo = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const order = await prisma.order.findUnique({ where: { id: id as string } });
    
    // For demo purposes, if videoUrl is missing, we use a fallback demo video
    const finalVideoUrl = order?.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4';
    
    const editor = await prisma.editor.findUnique({ where: { userId } });
    if (editor && order) {
      await prisma.fileAccessLog.create({
        data: {
          editorId: editor.id,
          orderId: order.id,
          fileType: 'ORIGINAL',
          action: 'DOWNLOAD',
          ipAddress: req.ip || '',
          userAgent: req.headers['user-agent'] || '',
        }
      });
    }

    res.json({ success: true, signedUrl: finalVideoUrl });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to generate signed URL' });
  }
};

export const addPreview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { previewUrl } = req.body;

    const order = await prisma.order.findUnique({ where: { id: id as string } });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.previews.length >= 3) {
      return res.status(400).json({ message: 'Maximum 3 previews reached' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: id as string },
      data: {
        previews: {
          push: previewUrl
        }
      }
    });

    res.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to add preview', error: error.message });
  }
};

export const getAvailableOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    let trustLevel = 'BRONZE';

    if (userId) {
      const editor = await prisma.editor.findUnique({ where: { userId } });
      if (editor) {
        trustLevel = editor.trustLevel;
      }
    }

    const allowedSensitivities = ['PUBLIC', 'PRIVATE'];
    if (['GOLD', 'PLATINUM', 'ELITE'].includes(trustLevel)) {
      allowedSensitivities.push('SENSITIVE');
    }

    const orders = await prisma.order.findMany({
      where: { 
        status: 'SEARCHING', 
        editorId: null,
        contentSensitivity: { in: allowedSensitivities as any }
      },
      include: { customer: { select: { name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch available orders' });
  }
};

export const claimOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { privacyAgreementSigned } = req.body || {};

    let editor = await prisma.editor.findUnique({ where: { userId } });
    if (!editor) {
      // Auto-create editor profile if they don't have one
      editor = await prisma.editor.create({ data: { userId } });
    }

    // if (editor.verificationStatus !== 'APPROVED') {
    //   return res.status(403).json({ message: 'Your account is pending verification or suspended.' });
    // }

    const order = await prisma.order.update({
      where: { id: id as string },
      data: { 
        editorId: editor.id,
        status: 'ACCEPTED',
        progress: 10,
        privacyAgreementSigned: privacyAgreementSigned === true
      }
    });

    res.json({ success: true, order });
  } catch (error: any) {
    console.error('[claimOrder] Prisma error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to claim order' });
  }
};
