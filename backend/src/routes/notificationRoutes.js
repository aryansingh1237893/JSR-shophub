const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const {
  sendOrderConfirmationEmail,
  sendOrderConfirmationSMS,
  sendOrderStatusUpdate,
  sendPriceDropAlert,
  sendOTPSMS,
  sendWelcomeEmail,
  sendPasswordResetEmail,
} = require('../controllers/notificationController');

const router = express.Router();

// Get notifications (placeholder for now)
router.get('/', authMiddleware, (req, res) => {
  res.json({ notifications: [], message: 'Notifications feature coming soon' });
});

// Mark notification read (placeholder)
router.put('/:id/read', authMiddleware, (req, res) => {
  res.json({ message: 'Notification marked as read' });
});

// Subscribe to push notifications (placeholder)
router.post('/subscribe', authMiddleware, (req, res) => {
  res.json({ message: 'Subscribed to push notifications' });
});

// Price drop alerts
router.post('/price-alerts', authMiddleware, async (req, res) => {
  const { productId, oldPrice, newPrice } = req.body;
  await sendPriceDropAlert(req.userId, productId, oldPrice, newPrice);
  res.json({ message: 'Price drop alert sent' });
});

// Chatbot support (basic implementation)
router.post('/chat', authMiddleware, (req, res) => {
  const { message } = req.body;
  // Basic chatbot responses
  const responses = {
    'hello': 'Hi! How can I help you with your shopping today?',
    'order': 'You can track your orders in the My Orders section.',
    'return': 'For returns, please go to My Orders and select the return option.',
    'payment': 'We accept cards, UPI, and wallets. All payments are secure.',
    'delivery': 'Standard delivery takes 3-5 business days.',
  };

  const response = responses[message.toLowerCase()] || 'I\'m here to help! Please contact our support team for detailed assistance.';
  res.json({ response, message: 'Chat message processed' });
});

// Live agent chat (placeholder)
router.post('/live-chat', authMiddleware, (req, res) => {
  res.json({ message: 'Live chat feature coming soon. Please use our chatbot or contact support.' });
});

// Call support request (placeholder)
router.post('/call-support', authMiddleware, (req, res) => {
  res.json({ message: 'Call support requested. Our team will contact you within 24 hours.' });
});

// Test notification endpoints (for development)
router.post('/test/email', authMiddleware, async (req, res) => {
  const user = { firstName: 'Test', email: req.body.email };
  await sendWelcomeEmail(user);
  res.json({ message: 'Test email sent' });
});

router.post('/test/sms', authMiddleware, async (req, res) => {
  await sendOTPSMS(req.body.phone, '123456');
  res.json({ message: 'Test SMS sent' });
});

module.exports = router;
