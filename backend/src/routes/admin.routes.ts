import { Router } from 'express';
import { 
  getDashboardStats, getAllUsers, getAllEditors, getAllOrders, getRevenueData,
  getPendingKYC, updateKYCStatus, getViolations, updateViolationStatus, getFileAccessLogs,
  getAllWithdrawals, updateWithdrawalStatus
} from '../controllers/admin.controller';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Core
router.get('/stats', authMiddleware, adminMiddleware, getDashboardStats);
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);
router.get('/editors', authMiddleware, adminMiddleware, getAllEditors);
router.get('/orders', authMiddleware, adminMiddleware, getAllOrders);
router.get('/revenue', authMiddleware, adminMiddleware, getRevenueData);

// Security & Trust
router.get('/kyc', authMiddleware, adminMiddleware, getPendingKYC);
router.patch('/kyc/:id', authMiddleware, adminMiddleware, updateKYCStatus);
router.get('/violations', authMiddleware, adminMiddleware, getViolations);
router.patch('/violations/:id', authMiddleware, adminMiddleware, updateViolationStatus);
router.get('/logs', authMiddleware, adminMiddleware, getFileAccessLogs);

// Payouts & Withdrawals
router.get('/withdrawals', authMiddleware, adminMiddleware, getAllWithdrawals);
router.patch('/withdrawals/:id', authMiddleware, adminMiddleware, updateWithdrawalStatus);

export default router;
