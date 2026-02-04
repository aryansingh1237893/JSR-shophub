const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Create review
exports.createReview = async (req, res) => {
  try {
    const { productId, rating, title, comment, images, videos } = req.body;

    // Verify user purchased the product
    const order = await Order.findOne({
      user: req.userId,
      'items.product': productId,
    });

    if (!order) {
      return res.status(403).json({ error: 'You must purchase this product to review' });
    }

    const review = new Review({
      product: productId,
      user: req.userId,
      rating,
      title,
      comment,
      images,
      videos,
      verified: true,
    });

    await review.save();

    // Update product rating
    const reviews = await Review.find({ product: productId, status: 'approved' });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Product.findByIdAndUpdate(productId, {
      rating: avgRating,
      reviewCount: reviews.length,
    });

    res.status(201).json({ message: 'Review created', review });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get product reviews
exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ product: productId, status: 'approved' })
      .populate('user', 'firstName lastName profileImage')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Review.countDocuments({ product: productId, status: 'approved' });

    res.json({
      reviews,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user reviews
exports.getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.userId })
      .populate('product', 'title images')
      .sort('-createdAt');

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update review
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, title, comment, images, videos } = req.body;

    const review = await Review.findById(id);
    if (review.user.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    review.rating = rating;
    review.title = title;
    review.comment = comment;
    review.images = images;
    review.videos = videos;
    review.status = 'pending'; // Need re-moderation

    await review.save();
    res.json({ message: 'Review updated', review });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete review
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);

    if (review.user.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Review.findByIdAndDelete(id);
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark review helpful
exports.markHelpful = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndUpdate(
      id,
      { $inc: { helpful: 1 } },
      { new: true }
    );

    res.json({ message: 'Review marked helpful', review });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
