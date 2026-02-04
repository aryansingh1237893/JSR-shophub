const express = require('express');
const orderController = require('../controllers/orderController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, orderController.createOrder);
router.get('/', authMiddleware, orderController.getUserOrders);
router.get('/:id', authMiddleware, orderController.getOrderById);
router.put('/:id/status', authMiddleware, orderController.updateOrderStatus);
router.put('/:id/cancel', authMiddleware, orderController.cancelOrder);
router.post('/:id/return', authMiddleware, orderController.requestReturn);
router.get('/:id/invoice', authMiddleware, orderController.downloadInvoice);

module.exports = router;
