import express from 'express';
import { getOrders, getOrderById } from '../controllers/orderController.js';
import { authMiddleware, policyMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, policyMiddleware('orders:read'), getOrders);
router.get('/:id', authMiddleware, policyMiddleware('orders:read'), getOrderById);

export default router; 