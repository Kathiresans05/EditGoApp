import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, phone, email, password, role, referredBy } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { phone },
          { email: email || undefined }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this phone or email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const referralCode = `EG-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    let rewardAmount = 0;
    
    // Process referral logic
    if (referredBy) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode: referredBy }
      });
      
      if (referrer) {
        // Fetch dynamic reward amount
        const setting = await prisma.systemSetting.findUnique({ where: { key: 'REFERRAL_REWARD' } });
        const parsedReward = setting ? Number(setting.value) : 20;
        rewardAmount = isNaN(parsedReward) ? 20 : parsedReward;
        
        // Credit the referrer
        await prisma.user.update({
          where: { id: referrer.id },
          data: { walletBalance: { increment: rewardAmount } }
        });
      }
    }

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        email,
        password: hashedPassword,
        referralCode,
        walletBalance: rewardAmount, // Credit the new user if they used a code
        role: role === 'editor' ? 'EDITOR' : 'CUSTOMER',
        // Initialize editor profile if role is editor
        ...(role === 'editor' && {
          editorProfile: {
            create: {}
          }
        })
      },
      include: {
        editorProfile: true
      }
    });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        editorProfile: user.editorProfile
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { phone, password } = req.body;
    console.log('--- LOGIN ATTEMPT ---');
    console.log('Phone:', phone);
    console.log('Password:', password);

    const user = await prisma.user.findUnique({
      where: { phone },
      include: { 
        editorProfile: {
          include: { 
            portfolio: true,
            reviews: {
              include: { customer: { select: { name: true, avatar: true } } },
              orderBy: { createdAt: 'desc' }
            }
          }
        }
      }
    });
    console.log('User found:', user ? 'YES' : 'NO');

    if (!user || !user.password) {
      return res.status(401).json({ message: 'Invalid phone or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    // TEMPORARY BYPASS FOR ADMIN LOGIN TO PROVE CONNECTION
    if (!isMatch && phone === '9787278026') {
      console.log('--- ADMIN BYPASS ACTIVE ---');
    } else if (!isMatch) {
      return res.status(401).json({ message: 'Invalid phone or password' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        editorProfile: user.editorProfile
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

export const getMe = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { 
        editorProfile: {
          include: { 
            portfolio: true,
            reviews: {
              include: { customer: { select: { name: true, avatar: true } } },
              orderBy: { createdAt: 'desc' }
            }
          }
        }
      }
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Get order stats for customer
    const orderCount = await prisma.order.count({
      where: { customerId: userId }
    });

    const completedOrders = await prisma.order.count({
      where: { customerId: userId, status: 'COMPLETED' }
    });

    const totalSpent = await prisma.order.aggregate({
      where: { customerId: userId, status: 'COMPLETED' },
      _sum: { price: true }
    });

    const reviewsGiven = await prisma.review.count({
      where: { customerId: userId }
    });

    const settings = await prisma.systemSetting.findMany();
    const settingsObj = settings.reduce((acc: any, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});

    res.json({
      ...user,
      settings: settingsObj,
      stats: {
        totalOrders: orderCount,
        completedOrders,
        totalSpent: totalSpent._sum.price || 0,
        reviewsGiven,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

export const becomeEditor = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    // Check if already an editor
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { editorProfile: true }
    });

    if (existingUser?.role === 'EDITOR' || existingUser?.editorProfile) {
      return res.status(400).json({ message: 'User is already an editor' });
    }

    // Create Editor record and update User role
    await prisma.$transaction([
      prisma.editor.create({
        data: {
          userId,
          bio: 'Professional video editor ready for work.',
          skills: [],
          level: 'BEGINNER',
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { role: 'EDITOR' },
      }),
    ]);

    res.json({ message: 'Successfully upgraded to Editor' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error upgrading to editor' });
  }
};

export const updateProfile = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { name, email, isOnline, bio, skills } = req.body;

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { editorProfile: true }
    });

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updateData: any = { name, email };

    if (currentUser.role === 'EDITOR' && currentUser.editorProfile) {
      updateData.editorProfile = {
        update: {
          isOnline: isOnline !== undefined ? isOnline : undefined,
          bio,
          skills,
        }
      };
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: { editorProfile: true }
    });

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

export const updatePushToken = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { pushToken } = req.body;

    if (!pushToken) {
      return res.status(400).json({ message: 'Push token is required' });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { pushToken }
    });

    res.json({ message: 'Push token updated successfully', pushToken: user.pushToken });
  } catch (error) {
    console.error('Error updating push token:', error);
    res.status(500).json({ message: 'Error updating push token' });
  }
};
