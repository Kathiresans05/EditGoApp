import { Request, Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { title, category, price, videoUrl } = req.body;
    const customerId = req.user.id;

    const order = await prisma.order.create({
      data: {
        customerId,
        title: title || `Edit for ${category}`,
        category,
        price: parseFloat(price),
        videoUrl,
        status: 'SEARCHING',
      },
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to create order' });
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
    const { status, progress } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: { status, progress: progress ? parseInt(progress) : undefined },
    });

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update order' });
  }
};
