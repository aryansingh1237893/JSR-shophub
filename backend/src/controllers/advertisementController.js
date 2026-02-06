const Advertisement = require('../models/Advertisement');
const Product = require('../models/Product');

// Create advertisement/promotion
exports.createAdvertisement = async (req, res) => {
  try {
    const { title, description, type, discount, startDate, endDate, productsIds } = req.body;

    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Only admins can create advertisements' });
    }

    const advertisement = new Advertisement({
      title,
      description,
      type, // 'flash_sale', 'seasonal', 'coupon', 'bundle'
      discount,
      startDate,
      endDate,
      products: productsIds,
      isActive: true,
    });

    await advertisement.save();
    res.status(201).json({ message: 'Advertisement created', advertisement });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get active promotions
exports.getActivePromotions = async (req, res) => {
  try {
    const currentDate = new Date();

    const promotions = await Advertisement.find({
      isActive: true,
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
    }).populate('products');

    res.json(promotions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get promotion by ID
exports.getPromotionById = async (req, res) => {
  try {
    const promotion = await Advertisement.findById(req.params.id).populate('products');
    
    if (!promotion) {
      return res.status(404).json({ error: 'Promotion not found' });
    }

    res.json(promotion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update advertisement
exports.updateAdvertisement = async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Only admins can update advertisements' });
    }

    const advertisement = await Advertisement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ message: 'Advertisement updated', advertisement });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete advertisement
exports.deleteAdvertisement = async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Only admins can delete advertisements' });
    }

    await Advertisement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Advertisement deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get banner promotions (for homepage)
exports.getBannerPromotions = async (req, res) => {
  try {
    const currentDate = new Date();

    const banners = await Advertisement.find({
      isActive: true,
      type: 'banner',
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
    }).limit(5);

    res.json(banners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get flash sales
exports.getFlashSales = async (req, res) => {
  try {
    const currentDate = new Date();

    const flashSales = await Advertisement.find({
      isActive: true,
      type: 'flash_sale',
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
    }).populate('products');

    res.json(flashSales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Apply coupon code
exports.applyCouponCode = async (req, res) => {
  try {
    const { couponCode, orderTotal } = req.body;

    const promotion = await Advertisement.findOne({
      title: couponCode,
      type: 'coupon',
      isActive: true,
    });

    if (!promotion) {
      return res.status(404).json({ error: 'Invalid coupon code' });
    }

    const currentDate = new Date();
    if (promotion.startDate > currentDate || promotion.endDate < currentDate) {
      return res.status(400).json({ error: 'Coupon code expired' });
    }

    const discountAmount = (orderTotal * promotion.discount) / 100;
    const finalAmount = orderTotal - discountAmount;

    res.json({
      success: true,
      discountPercentage: promotion.discount,
      discountAmount: discountAmount.toFixed(2),
      finalAmount: finalAmount.toFixed(2),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get seasonal offers
exports.getSeasonalOffers = async (req, res) => {
  try {
    const currentDate = new Date();

    const offers = await Advertisement.find({
      isActive: true,
      type: 'seasonal',
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
    }).populate('products');

    res.json(offers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get bundle offers
exports.getBundleOffers = async (req, res) => {
  try {
    const currentDate = new Date();

    const bundles = await Advertisement.find({
      isActive: true,
      type: 'bundle',
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
    }).populate('products');

    res.json(bundles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Track promotion performance
exports.getPromotionAnalytics = async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Only admins can view analytics' });
    }

    const promotionId = req.params.id;
    const promotion = await Advertisement.findById(promotionId);

    res.json({
      promotionId,
      title: promotion.title,
      type: promotion.type,
      discount: promotion.discount,
      productsCount: promotion.products.length,
      totalViews: promotion.views || 0,
      totalClicks: promotion.clicks || 0,
      conversionRate: ((promotion.conversions || 0) / (promotion.clicks || 1) * 100).toFixed(2) + '%',
      revenue: promotion.revenue || 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
