import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import { uploadToCloudinary } from '../services/cloudinary.service';

const prisma = new PrismaClient();

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, crypto.randomBytes(12).toString('hex') + ext);
  },
});
const upload = multer({ storage });

// Get Editor Profile (For Editor Dashboard)
export const getMyProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    let editor = await prisma.editor.findUnique({
      where: { userId },
      include: {
        user: { select: { name: true, email: true, avatar: true } },
        portfolio: true
      }
    });

    if (!editor) {
      // Auto-create editor profile if it doesn't exist
      await prisma.editor.create({ data: { userId } });
      
      // Fetch again to get the included relations (user)
      editor = await prisma.editor.findUnique({
        where: { userId },
        include: {
          user: { select: { name: true, email: true, avatar: true } },
          portfolio: true
        }
      });
    }

    res.status(200).json({ success: true, editor });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error fetching profile', error: error.message });
  }
};

// Get KYC Status
export const getKycStatus = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    let editor = await prisma.editor.findUnique({ where: { userId } });
    
    // Auto-create editor profile if it doesn't exist
    if (!editor) {
      editor = await prisma.editor.create({
        data: { userId }
      });
    }

    res.status(200).json({ success: true, status: editor.verificationStatus });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error fetching KYC status', error: error.message });
  }
};

// Submit KYC
export const submitKyc = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { aadhaar, pan, bankAccount, idDocumentUrl, selfieUrl } = req.body;

    const editor = await prisma.editor.update({
      where: { userId },
      data: {
        aadhaarNumber: aadhaar,
        panNumber: pan,
        bankAccount,
        idDocumentUrl,
        selfieUrl,
        verificationStatus: 'PENDING'
      }
    });

    res.status(200).json({ success: true, message: 'KYC submitted successfully', editor });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error submitting KYC', error: error.message });
  }
};

// Get Public Profile (For Customers)
export const getPublicProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const editor = await prisma.editor.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, avatar: true } },
        portfolio: {
          orderBy: { likes: 'desc' }
        },
        reviews: {
          include: { customer: { select: { name: true, avatar: true } } },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!editor) {
      return res.status(404).json({ success: false, message: 'Editor not found' });
    }

    // Omit sensitive data like Aadhaar/Bank details for public view
    const { aadhaarNumber, panNumber, bankAccount, ...publicData } = editor;

    res.status(200).json({ success: true, editor: publicData });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error fetching public profile', error: error.message });
  }
};

export const addPortfolioItem = [
  upload.single('video'),
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const { title, category } = req.body;

      if (!req.file) return res.status(400).json({ success: false, message: 'No video file uploaded' });

      const editor = await prisma.editor.findUnique({ where: { userId } });
      if (!editor) return res.status(404).json({ success: false, message: 'Editor not found' });

      let cloudinaryUrl = await uploadToCloudinary(req.file.path, 'portfolio');
      let isLocalFallback = false;
      
      if (!cloudinaryUrl || cloudinaryUrl.includes('test-videos')) {
        const protocol = req.protocol;
        const host = req.get('host');
        cloudinaryUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
        isLocalFallback = true;
      }

      const portfolioItem = await prisma.portfolioItem.create({
        data: {
          editorId: editor.id,
          title,
          category,
          videoUrl: cloudinaryUrl,
          thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=400', // Dummy thumbnail for now
        }
      });

      if (!isLocalFallback) {
        fs.unlink(req.file.path, (err) => { if (err) console.error(err); });
      }

      res.status(201).json({ success: true, data: portfolioItem });
    } catch (error: any) {
      console.error('Error adding portfolio item:', error);
      res.status(500).json({ success: false, message: 'Error adding portfolio item', error: error.message });
    }
  }
];

// Delete Portfolio Item
export const deletePortfolioItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    const editor = await prisma.editor.findUnique({ where: { userId } });
    
    if (!editor) return res.status(404).json({ success: false, message: 'Editor not found' });

    // Ensure item belongs to this editor
    await prisma.portfolioItem.deleteMany({
      where: {
        id,
        editorId: editor.id
      }
    });

    res.status(200).json({ success: true, message: 'Item deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error deleting portfolio item', error: error.message });
  }
};

// Submit Rating (Customer to Editor)
export const rateEditor = async (req: Request, res: Response) => {
  try {
    const { editorId } = req.params;
    const { rating } = req.body; // 1 to 5
    const customerId = (req as any).user.id;

    // Optional: verify if customer actually had an order with this editor
    const orderExists = await prisma.order.findFirst({
      where: { customerId, editorId, status: 'COMPLETED' }
    });

    if (!orderExists) {
      return res.status(403).json({ success: false, message: 'You can only rate editors you have worked with.' });
    }

    // Simplified moving average for demo purposes
    // Real implementation would have a Reviews table to aggregate
    const editor = await prisma.editor.findUnique({ where: { id: editorId } });
    
    if (!editor) return res.status(404).json({ success: false, message: 'Editor not found' });

    const currentRating = editor.rating || 5.0;
    const totalOrders = editor.totalOrders || 1;
    
    const newRating = ((currentRating * totalOrders) + rating) / (totalOrders + 1);

    await prisma.editor.update({
      where: { id: editorId },
      data: { rating: parseFloat(newRating.toFixed(1)) }
    });

    res.status(200).json({ success: true, message: 'Rating submitted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error submitting rating', error: error.message });
  }
};
