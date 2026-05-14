import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [totalUsers, totalEditors, totalOrders, totalRevenueData] = await Promise.all([
      prisma.user.count(),
      prisma.editor.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: {
          price: true,
        },
        where: {
          status: 'COMPLETED',
        },
      }),
    ]);

    const totalRevenue = totalRevenueData._sum.price || 0;
    const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Get recent activity
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        customer: {
          select: {
            name: true,
          },
        },
      },
    });

    // Mock chart data for now based on actual count, or group by day if possible
    // For now, let's just return real counts and some derived trends
    
    res.status(200).json({
      stats: {
        grossVolume: `₹${totalRevenue.toLocaleString()}`,
        creators: totalEditors.toLocaleString(),
        workflows: totalOrders.toLocaleString(),
        avgTicket: `₹${Math.round(avgTicket).toLocaleString()}`,
        trends: {
          revenue: "+15.5%", // These could be calculated by comparing with last month
          creators: "+8.2%",
          workflows: "+12.4%",
          avgTicket: "+5.1%",
        }
      },
      recentActivity: recentOrders.map(order => ({
        id: order.id,
        title: 'Transaction Processing',
        desc: `Order #${order.id.slice(-6).toUpperCase()} finalized by ${order.customer?.name || 'Customer'}`,
        time: 'JUST NOW',
        status: order.status,
      }))
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      include: {
        customerOrders: {
          select: { price: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name || 'Anonymous',
      email: user.email || user.phone,
      plan: user.plan,
      status: 'Active', // Status could be derived from a field if added
      spending: `₹${user.customerOrders.reduce((sum, order) => sum + order.price, 0).toLocaleString()}`
    }));

    res.status(200).json({
      users: formattedUsers,
      totalCount: users.length
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

export const getAllEditors = async (req: Request, res: Response) => {
  try {
    const editors = await prisma.editor.findMany({
      include: {
        user: {
          select: { name: true, email: true, phone: true }
        }
      },
      orderBy: { level: 'desc' }
    });

    const formattedEditors = editors.map(editor => ({
      id: editor.id,
      name: editor.user.name || 'Anonymous',
      email: editor.user.email || editor.user.phone,
      level: editor.level,
      rating: editor.rating,
      earnings: `₹${editor.totalEarnings.toLocaleString()}`,
      status: editor.isOnline ? 'Online' : 'Offline'
    }));

    res.status(200).json({
      editors: formattedEditors,
      totalCount: editors.length
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching editors', error: error.message });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: { select: { name: true } },
        editor: { include: { user: { select: { name: true } } } }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedOrders = orders.map(order => ({
      id: order.id,
      title: order.title,
      customer: order.customer.name || 'Unknown',
      editor: order.editor?.user.name || 'Unassigned',
      status: order.status,
      price: `₹${order.price.toLocaleString()}`,
      time: 'RECENT' // In a real app, use date-fns to format order.createdAt
    }));

    res.status(200).json({
      orders: formattedOrders,
      totalCount: orders.length
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

export const getRevenueData = async (req: Request, res: Response) => {
  try {
    const totalVolume = await prisma.order.aggregate({
      _sum: { price: true }
    });

    const platformRevenue = (totalVolume._sum.price || 0) * 0.2; // 20% commission mock
    const creatorPayouts = (totalVolume._sum.price || 0) * 0.8; // 80% to editors

    const recentTransactions = await prisma.order.findMany({
      take: 5,
      orderBy: { updatedAt: 'desc' },
      where: { status: 'COMPLETED' },
      include: {
        customer: { select: { name: true } },
        editor: { include: { user: { select: { name: true } } } }
      }
    });

    const formattedLedger = recentTransactions.map(t => ({
      id: t.id,
      type: 'Platform Fee',
      user: t.customer.name || 'Client',
      amount: `+₹${(t.price * 0.2).toLocaleString()}`,
      status: 'SUCCESS',
      color: '#10B981'
    }));

    res.status(200).json({
      overview: {
        marketplaceVolume: `₹${(totalVolume._sum.price || 0).toLocaleString()}`,
        platformRevenue: `₹${platformRevenue.toLocaleString()}`,
        creatorPayouts: `₹${creatorPayouts.toLocaleString()}`,
        processingFees: `₹${((totalVolume._sum.price || 0) * 0.02).toLocaleString()}`,
        liquidity: `₹${(platformRevenue * 0.5).toLocaleString()}`
      },
      ledger: formattedLedger,
      chartData: [
        { name: 'Day 1', amount: 40 },
        { name: 'Day 2', amount: 60 },
        { name: 'Day 3', amount: 45 },
        { name: 'Day 4', amount: 90 },
        { name: 'Day 5', amount: 75 }
      ]
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching revenue data', error: error.message });
  }
};
