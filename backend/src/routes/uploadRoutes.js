const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const {
  uploadSingle,
  uploadMultiple,
  uploadProductImages,
  uploadReviewImages,
  uploadProfileImage,
  deleteImage,
} = require('../controllers/uploadController');

const router = express.Router();

// Upload product images (admin only)
router.post('/products', authMiddleware, uploadMultiple, uploadProductImages);

// Upload review images
router.post('/reviews', authMiddleware, uploadMultiple, uploadReviewImages);

// Upload profile image
router.post('/profile', authMiddleware, uploadSingle, uploadProfileImage);

// Delete image
router.delete('/:publicId', authMiddleware, deleteImage);

module.exports = router;
