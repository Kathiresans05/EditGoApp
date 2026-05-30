import { Router } from 'express';
import { register, login, getMe, becomeEditor, updateProfile, updatePushToken } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);
router.post('/become-editor', authMiddleware, becomeEditor);
router.post('/update-profile', authMiddleware, updateProfile);
router.put('/push-token', authMiddleware, updatePushToken);

export default router;
