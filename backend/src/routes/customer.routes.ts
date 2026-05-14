import { Router } from 'express';
import { getHomeData, getEditors } from '../controllers/customer.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/home', authMiddleware, getHomeData);
router.get('/editors', authMiddleware, getEditors);

export default router;
