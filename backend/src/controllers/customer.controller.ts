import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth.middleware';

const prisma = new PrismaClient();

export const getHomeData = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        editorProfile: true,
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get active order (the latest one that is not completed)
    const activeOrder = await prisma.order.findFirst({
      where: {
        customerId: userId,
        status: { not: 'COMPLETED' }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Categories (keeping them in backend for now)
    const categories = [
      { id: '1', title: 'Insta Reels', icon: '📱', price: '79', trend: true },
      { id: '2', title: 'YT Shorts', icon: '🎥', price: '149' },
      { id: '3', title: 'Cinematic', icon: '🎬', price: '299', trend: true },
      { id: '4', title: 'Thumbnails', icon: '🖼️', price: '79' },
      { id: '5', title: 'AI Style', icon: '🤖', price: '199' },
      { id: '6', title: 'Slow Motion', icon: '❄️', price: '129' },
    ];

    res.status(200).json({
      user: {
        name: user.name || 'Creator',
        plan: user.plan,
        level: user.editorProfile?.level || 'Beginner Creator',
        walletBalance: user.walletBalance,
      },
      activeOrder: activeOrder ? {
        id: activeOrder.id,
        title: activeOrder.title,
        status: activeOrder.status,
        progress: activeOrder.progress,
        timeRemaining: '12 mins left', // Mock for now
      } : null,
      categories
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching home data', error: error.message });
  }
};

export const getEditors = async (req: Request, res: Response) => {
  try {
    const editors = await prisma.editor.findMany({
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
          }
        },
        portfolio: {
          take: 1
        }
      },
      orderBy: {
        rating: 'desc'
      }
    });

    const formattedEditors = editors.map(editor => ({
      id: editor.id,
      name: editor.user.name || 'Pro Editor',
      image: editor.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(editor.user.name || 'E')}&background=8B5CF6&color=fff`,
      rating: editor.rating.toFixed(1),
      level: editor.level,
      skill: editor.skills[0] || 'Video Expert',
      price: editor.level === 'MASTER' ? '₹499' : '₹199', // Dynamic based on level
      speed: editor.responseSpeed || '2 hours',
      reviews: editor.totalOrders.toString(),
      isOnline: editor.isOnline
    }));

    res.status(200).json({
      editors: formattedEditors,
      totalCount: editors.length
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching editors', error: error.message });
  }
};

export const addFunds = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { amount } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount specification' });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        walletBalance: {
          increment: Number(amount)
        }
      }
    });

    res.status(200).json({
      message: `Successfully loaded ₹${amount} into your wallet!`,
      walletBalance: user.walletBalance
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error adding funds to wallet', error: error.message });
  }
};
