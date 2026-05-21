import { Router } from 'express';
import { 
  getMyProfile, 
  getPublicProfile, 
  addPortfolioItem, 
  deletePortfolioItem, 
  rateEditor,
  getKycStatus,
  submitKyc
} from '../controllers/editor.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Private Editor Routes (Requires Editor Auth)
router.get('/profile', authMiddleware, getMyProfile);
router.get('/kyc-status', authMiddleware, getKycStatus);
router.post('/kyc', authMiddleware, submitKyc);
router.post('/portfolio', authMiddleware, addPortfolioItem);
router.delete('/portfolio/:id', authMiddleware, deletePortfolioItem);

// Public / Customer Routes
router.get('/:id', getPublicProfile);
router.post('/:editorId/rate', authMiddleware, rateEditor);

export default router;
