const express = require('express');
const reviewController = require('../controllers/reviewController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, reviewController.createReview);
router.get('/product/:productId', reviewController.getProductReviews);
router.get('/user', authMiddleware, reviewController.getUserReviews);
router.put('/:id', authMiddleware, reviewController.updateReview);
router.delete('/:id', authMiddleware, reviewController.deleteReview);
router.post('/:id/helpful', authMiddleware, reviewController.markHelpful);

module.exports = router;
