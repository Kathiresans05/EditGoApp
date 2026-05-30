import { Request, Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middlewares/auth.middleware';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { uploadToCloudinary } from '../services/cloudinary.service';
import fs from 'fs';
import { notifyAllEditors, sendPushNotification } from '../services/notification.service';

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config – store files in /uploads folder with random name
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
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

    if (!editorId) {
      await notifyAllEditors(
        'New Project Available! 🚀',
        `A new ${category} project was just posted for ₹${price}. Claim it now!`,
        { orderId: order.id }
      );
    }

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

export const uploadRawVideo = [
  upload.single('video'),
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    if (!req.file) return res.status(400).json({ success: false, message: 'No video file uploaded' });
    
    try {
      let cloudinaryUrl = await uploadToCloudinary(req.file.path, 'raw_videos');
      let isLocalFallback = false;
      
      if (!cloudinaryUrl || cloudinaryUrl.includes('test-videos') || cloudinaryUrl.includes('w3schools') || cloudinaryUrl.includes('mixkit')) {
        const protocol = req.protocol;
        const host = req.get('host');
        cloudinaryUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
        isLocalFallback = true;
      }

      const order = await prisma.order.update({
        where: { id: id as string },
        data: { videoUrl: cloudinaryUrl },
      });

      if (!isLocalFallback) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Failed to delete local file:', err);
        });
      }

      res.json({ success: true, order });
    } catch (error: any) {
      console.error('Error uploading to Cloudinary:', error);
      res.status(500).json({ success: false, message: 'Failed to upload video to Cloudinary' });
    }
  },
];

export const getSignedVideo = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const order = await prisma.order.findUnique({ where: { id: id as string } });
    
    let finalVideoUrl = order?.videoUrl || 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4';
    if (finalVideoUrl.includes('w3schools') || finalVideoUrl.includes('mixkit') || finalVideoUrl.includes('googleapis')) {
      finalVideoUrl = 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4';
    }
    
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

export const uploadPreviewVideo = [
  upload.single('video'),
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    if (!req.file) return res.status(400).json({ success: false, message: 'No video file uploaded' });

    try {
      const order = await prisma.order.findUnique({ where: { id: id as string } });
      if (!order) return res.status(404).json({ message: 'Order not found' });
      if (order.previews.length >= 3) return res.status(400).json({ message: 'Maximum 3 previews reached' });

      let cloudinaryUrl = await uploadToCloudinary(req.file.path, 'previews');
      let isLocalFallback = false;
      
      if (!cloudinaryUrl || cloudinaryUrl.includes('test-videos') || cloudinaryUrl.includes('w3schools') || cloudinaryUrl.includes('mixkit')) {
        const protocol = req.protocol;
        const host = req.get('host');
        cloudinaryUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
        isLocalFallback = true;
      }

      const updatedOrder = await prisma.order.update({
        where: { id: id as string },
        data: {
          previews: {
            push: cloudinaryUrl
          }
        }
      });

      if (!isLocalFallback) {
        fs.unlink(req.file.path, (err) => { if (err) console.error('Failed to delete local file:', err); });
      }
      res.json({ success: true, order: updatedOrder });
    } catch (error: any) {
      console.error('Error uploading preview:', error);
      res.status(500).json({ success: false, message: 'Failed to add preview', error: error.message });
    }
  }
];

export const uploadFinalVideo = [
  upload.single('video'),
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    if (!req.file) return res.status(400).json({ success: false, message: 'No video file uploaded' });
    
    try {
      let cloudinaryUrl = await uploadToCloudinary(req.file.path, 'final_videos');
      let isLocalFallback = false;
      
      if (!cloudinaryUrl || cloudinaryUrl.includes('test-videos') || cloudinaryUrl.includes('w3schools') || cloudinaryUrl.includes('mixkit')) {
        const protocol = req.protocol;
        const host = req.get('host');
        cloudinaryUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
        isLocalFallback = true;
      }

      const currentOrder = await prisma.order.findUnique({ where: { id: id as string } });
      const acceptedAt = currentOrder?.acceptedAt ? new Date(currentOrder.acceptedAt).getTime() : Date.now();
      const initialETAMins = currentOrder?.initialETAMins || 45;
      const elapsedMins = (Date.now() - acceptedAt) / 60000;
      const isLate = elapsedMins > initialETAMins;

      const updatedOrder = await prisma.order.update({
        where: { id: id as string },
        data: {
          finalUrl: cloudinaryUrl,
          status: 'COMPLETED',
          progress: 100,
          isLate
        }
      });

      if (updatedOrder.editorId) {
        await updateEditorSuccessRate(updatedOrder.editorId);
        
        // Earning Split Logic: 20% Platform, 80% Editor
        // Only credit the editor if the order wasn't ALREADY completed (prevents double payment on re-uploads)
        if (currentOrder?.status !== 'COMPLETED') {
          const orderPrice = currentOrder?.price || 0;
          const editorEarning = orderPrice * 0.8; // 80% going to Editor
          
          if (editorEarning > 0) {
            await prisma.editor.update({
              where: { id: updatedOrder.editorId },
              data: {
                balance: { increment: editorEarning },
                totalEarnings: { increment: editorEarning }
              }
            });
          }
        }
      }

      if (currentOrder?.customerId) {
        await sendPushNotification(
          currentOrder.customerId,
          'Final Video Delivered! 🎉',
          'Your editor has uploaded the final HD video. Check it out now!',
          { orderId: updatedOrder.id }
        );
      }

      if (!isLocalFallback) {
        fs.unlink(req.file.path, (err) => { if (err) console.error('Failed to delete local file:', err); });
      }
      res.json({ success: true, order: updatedOrder });
    } catch (error: any) {
      console.error('Error uploading final video:', error);
      res.status(500).json({ success: false, message: 'Failed to upload final video', error: error.message });
    }
  }
];

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
      editor = await prisma.editor.create({ data: { userId } });
    }

    const order = await prisma.order.update({
      where: { id: id as string },
      data: { 
        editorId: editor.id,
        status: 'ACCEPTED',
        progress: 10,
        privacyAgreementSigned: privacyAgreementSigned === true,
        acceptedAt: new Date()
      }
    });

    res.json({ success: true, order });
  } catch (error: any) {
    console.error('[claimOrder] Prisma error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to claim order' });
  }
};

export const submitReview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const customerId = req.user.id;

    const order = await prisma.order.findUnique({ where: { id: id as string } });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!order.editorId) return res.status(400).json({ message: 'Order has no editor' });

    const existingReview = await prisma.review.findUnique({ where: { orderId: order.id } });
    if (existingReview) return res.status(400).json({ message: 'Review already submitted' });

    const review = await prisma.review.create({
      data: {
        orderId: order.id,
        editorId: order.editorId,
        customerId,
        rating: parseInt(rating),
        comment: comment || '',
      }
    });

    const editor = await prisma.editor.findUnique({ where: { id: order.editorId } });
    if (editor) {
      const allReviews = await prisma.review.findMany({ where: { editorId: editor.id } });
      const totalOrders = allReviews.length;
      const sumRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
      const newAvg = totalOrders > 0 ? (sumRating / totalOrders) : rating;

      await prisma.editor.update({
        where: { id: editor.id },
        data: {
          rating: newAvg,
          totalOrders: { increment: 1 }
        }
      });
    }

    res.json({ success: true, review });
  } catch (error: any) {
    console.error('[submitReview] Error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit review', error: error.message });
  }
};

async function updateEditorSuccessRate(editorId: string) {
  try {
    const completed = await prisma.order.count({ where: { editorId, status: 'COMPLETED', isLate: false } });
    const late = await prisma.order.count({ where: { editorId, status: 'COMPLETED', isLate: true } });
    const cancelled = await prisma.order.count({ where: { editorId, status: 'CANCELLED' } });
    
    // Total orders handled (completed on time + completed late + cancelled)
    const total = completed + late + cancelled;

    const successRate = total === 0 ? 100 : (completed / total) * 100;

    await prisma.editor.update({
      where: { id: editorId },
      data: { successRate: parseFloat(successRate.toFixed(1)) }
    });
  } catch (error) {
    console.error('Error updating success rate:', error);
  }
};

export const cancelOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const order = await prisma.order.findUnique({ where: { id: id as string } });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    
    const updatedOrder = await prisma.order.update({
      where: { id: id as string },
      data: { status: 'CANCELLED' }
    });

    if (updatedOrder.editorId) {
      await updateEditorSuccessRate(updatedOrder.editorId);
    }

    res.json({ success: true, message: 'Order cancelled successfully', order: updatedOrder });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel order' });
  }
};
