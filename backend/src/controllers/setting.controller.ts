import { Request, Response } from 'express';
import prisma from '../prisma';

export const getSettings = async (req: Request, res: Response) => {
  try {
    const settings = await prisma.systemSetting.findMany();
    // Convert array to key-value object
    const settingsObj = settings.reduce((acc: any, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    
    // Default fallback if not set
    if (!settingsObj['REFERRAL_REWARD']) {
      settingsObj['REFERRAL_REWARD'] = '20';
    }
    if (!settingsObj['PLATFORM_COMMISSION']) {
      settingsObj['PLATFORM_COMMISSION'] = '20';
    }

    return res.status(200).json({ success: true, data: settingsObj });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching settings' });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const { settings } = req.body; // Expecting { settings: { REFERRAL_REWARD: "50" } }
    
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid settings format' });
    }

    for (const [key, value] of Object.entries(settings)) {
      await prisma.systemSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) }
      });
    }

    return res.status(200).json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    return res.status(500).json({ success: false, message: 'Server error updating settings' });
  }
};
