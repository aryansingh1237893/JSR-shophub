const express = require('express');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get notifications
router.get('/', authMiddleware, (req, res) => {
  res.json({ message: 'Notifications endpoint' });
});

// Mark notification read
router.put('/:id/read', authMiddleware, (req, res) => {
  res.json({ message: 'Notification marked as read' });
});

// Subscribe to push notifications
router.post('/subscribe', authMiddleware, (req, res) => {
  res.json({ message: 'Subscribed to push notifications' });
});

// Price drop alerts
router.post('/price-alerts', authMiddleware, (req, res) => {
  res.json({ message: 'Price drop alert set' });
});

// Chatbot support
router.post('/chat', authMiddleware, (req, res) => {
  res.json({ message: 'Chat message sent' });
});

// Live agent chat
router.post('/live-chat', authMiddleware, (req, res) => {
  res.json({ message: 'Live chat started' });
});

// Call support request
router.post('/call-support', authMiddleware, (req, res) => {
  res.json({ message: 'Call support requested' });
});

module.exports = router;
