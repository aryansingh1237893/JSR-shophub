const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const {
  createAdvertisement,
  getActivePromotions,
  getPromotionById,
  updateAdvertisement,
  deleteAdvertisement,
  getBannerPromotions,
  getFlashSales,
  applyCouponCode,
  getSeasonalOffers,
  getBundleOffers,
  getPromotionAnalytics,
} = require('../controllers/advertisementController');

const router = express.Router();

// Public routes - Get active promotions
router.get('/active', getActivePromotions);
router.get('/banners', getBannerPromotions);
router.get('/flash-sales', getFlashSales);
router.get('/seasonal', getSeasonalOffers);
router.get('/bundles', getBundleOffers);
router.get('/:id', getPromotionById);

// Apply coupon
router.post('/coupon/apply', applyCouponCode);

// Admin routes
router.post('/', authMiddleware, createAdvertisement);
router.put('/:id', authMiddleware, updateAdvertisement);
router.delete('/:id', authMiddleware, deleteAdvertisement);
router.get('/:id/analytics', authMiddleware, getPromotionAnalytics);

module.exports = router;
