import express from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { authMiddleware, policyMiddleware } from '../middleware/auth.js';

const router = express.Router();

// router.get('/', authMiddleware, policyMiddleware('products:read'), getProducts);
// router.post('/', authMiddleware, policyMiddleware('products:write'), createProduct);
// router.put('/:id', authMiddleware, policyMiddleware('products:write'), updateProduct);
// router.delete('/:id', authMiddleware, policyMiddleware('products:write'), deleteProduct);

router.get('/',   getProducts);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router; 