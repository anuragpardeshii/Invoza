import express from 'express';
import { createBill, getBills } from '../controllers/billController.js';
import { authMiddleware, policyMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, policyMiddleware('billing:read'), getBills);
router.post('/', authMiddleware, policyMiddleware('billing:write'), createBill);

export default router; 