const express = require('express');
const productController = require('../controllers/productController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', productController.getAllProducts);
router.get('/bestsellers', productController.getBestSellers);
router.get('/deals', productController.getDealsOfDay);
router.get('/recommended', productController.getRecommendedProducts);
router.get('/filter', productController.filterProducts);
router.get('/:id', productController.getProductById);

router.post('/', authMiddleware, adminMiddleware, productController.createProduct);
router.put('/:id', authMiddleware, adminMiddleware, productController.updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, productController.deleteProduct);

module.exports = router;
