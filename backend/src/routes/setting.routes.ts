import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/setting.controller';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Publicly readable so the app can fetch it without strict auth
router.get('/', getSettings);

// Only ADMIN can update settings
router.post('/update', authMiddleware, adminMiddleware, updateSettings);

export default router;
