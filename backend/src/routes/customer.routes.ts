import { Router } from 'express';
import { getHomeData, getEditors, addFunds } from '../controllers/customer.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/home', authMiddleware, getHomeData);
router.get('/editors', authMiddleware, getEditors);
router.post('/add-funds', authMiddleware, addFunds);

export default router;
