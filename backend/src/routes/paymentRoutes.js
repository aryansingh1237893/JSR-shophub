const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

// Webhook (no auth required) - use raw body to verify signature
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);

// Initiate payment (creates a Stripe PaymentIntent)
router.post('/initiate', authMiddleware, paymentController.initiatePayment);

// Verify payment / get payment status
router.post('/verify', authMiddleware, paymentController.verifyPayment);

// Card payment (alias to initiate)
router.post('/card', authMiddleware, paymentController.processCardPayment);

// UPI payment
router.post('/upi', authMiddleware, paymentController.processUPIPayment);

// Wallet payment
router.post('/wallet', authMiddleware, paymentController.processWalletPayment);

// EMI options
router.get('/emi-options', authMiddleware, paymentController.getEMIOptions);

// Initiate refund
router.post('/refund', authMiddleware, paymentController.processRefund);

// Get payment details
router.get('/:paymentIntentId', authMiddleware, paymentController.getPaymentDetails);

module.exports = router;

