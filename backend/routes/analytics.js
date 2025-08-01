import express from 'express';
import { getTopSellers, getSalesStats } from '../controllers/analyticsController.js';
import { authMiddleware, policyMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/top-sellers', authMiddleware, policyMiddleware('analytics:read'), getTopSellers);
router.get('/sales-stats', authMiddleware, policyMiddleware('analytics:read'), getSalesStats);

export default router; 