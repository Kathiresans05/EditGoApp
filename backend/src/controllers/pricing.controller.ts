import { Request, Response } from 'express';
import prisma from '../prisma';

export const getPricingConfig = async (req: Request, res: Response) => {
  try {
    const config = await prisma.pricingConfig.findMany();
    // Default fallback if empty
    if (config.length === 0) {
      return res.status(200).json({
        success: true,
        data: [
          { category: 'RAPID', basePrice: 40, targetPrice: 69, targetSeconds: 30, baseDeliveryMins: 30, targetDeliveryMins: 55 },
          { category: 'AI_STYLE', basePrice: 40, targetPrice: 69, targetSeconds: 30, baseDeliveryMins: 30, targetDeliveryMins: 55 }
        ]
      });
    }
    return res.status(200).json({ success: true, data: config });
  } catch (error) {
    console.error('Error fetching pricing config:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching pricing' });
  }
};

export const updatePricingConfig = async (req: Request, res: Response) => {
  try {
    const { category, basePrice, targetPrice, targetSeconds, baseDeliveryMins, targetDeliveryMins } = req.body;
    
    if (!category) return res.status(400).json({ success: false, message: 'Category is required' });

    const updated = await prisma.pricingConfig.upsert({
      where: { category },
      update: {
        basePrice: Number(basePrice),
        targetPrice: Number(targetPrice),
        targetSeconds: Number(targetSeconds),
        baseDeliveryMins: Number(baseDeliveryMins),
        targetDeliveryMins: Number(targetDeliveryMins)
      },
      create: {
        category,
        basePrice: Number(basePrice),
        targetPrice: Number(targetPrice),
        targetSeconds: Number(targetSeconds),
        baseDeliveryMins: Number(baseDeliveryMins),
        targetDeliveryMins: Number(targetDeliveryMins)
      }
    });

    return res.status(200).json({ success: true, data: updated, message: 'Pricing config updated successfully' });
  } catch (error) {
    console.error('Error updating pricing config:', error);
    return res.status(500).json({ success: false, message: 'Server error updating pricing' });
  }
};
