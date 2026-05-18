import { Request, Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { title, category, price, videoUrl, editorId, deliverySpeed, initialETAMins } = req.body;
    const customerId = req.user.id;

    console.log('[Order] Creating order:', { title, category, price, editorId, deliverySpeed, initialETAMins });

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
      where: { id },
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
      where: { id },
      data: updateData,
    });

    res.json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update order', error: error.message });
  }
};

export const addPreview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { previewUrl } = req.body;

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.previews.length >= 3) {
      return res.status(400).json({ message: 'Maximum 3 previews reached' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
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

export const getAvailableOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: { status: 'SEARCHING', editorId: null },
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

    // Find the editor profile for this user
    const editor = await prisma.editor.findUnique({ where: { userId } });
    if (!editor) return res.status(403).json({ message: 'You are not registered as an editor' });

    const order = await prisma.order.update({
      where: { id },
      data: { 
        editorId: editor.id,
        status: 'ACCEPTED',
        progress: 10
      }
    });

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to claim order' });
  }
};
