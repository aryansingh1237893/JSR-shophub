const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const sharp = require('sharp');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer configuration for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// Upload single image
exports.uploadSingle = upload.single('image');

// Upload multiple images
exports.uploadMultiple = upload.array('images', 10);

// Process and upload to Cloudinary
exports.uploadToCloudinary = async (buffer, options = {}) => {
  try {
    // Resize and optimize image
    const optimizedBuffer = await sharp(buffer)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: options.folder || 'shophub',
          public_id: options.publicId || `img_${Date.now()}`,
          transformation: [
            { width: 800, height: 800, crop: 'limit' },
            { quality: 'auto' },
          ],
          ...options,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(optimizedBuffer);
    });
  } catch (error) {
    throw error;
  }
};

// Upload product images
exports.uploadProductImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadPromises = req.files.map(file =>
      this.uploadToCloudinary(file.buffer, {
        folder: 'shophub/products',
        public_id: `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      })
    );

    const results = await Promise.all(uploadPromises);

    const imageUrls = results.map(result => ({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    }));

    res.json({
      success: true,
      images: imageUrls,
      message: `${imageUrls.length} image(s) uploaded successfully`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Upload review images
exports.uploadReviewImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadPromises = req.files.map(file =>
      this.uploadToCloudinary(file.buffer, {
        folder: 'shophub/reviews',
        public_id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      })
    );

    const results = await Promise.all(uploadPromises);

    const imageUrls = results.map(result => result.secure_url);

    res.json({
      success: true,
      images: imageUrls,
      message: `${imageUrls.length} review image(s) uploaded successfully`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Upload user profile image
exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = await this.uploadToCloudinary(req.file.buffer, {
      folder: 'shophub/profiles',
      public_id: `profile_${req.userId}_${Date.now()}`,
      transformation: [
        { width: 300, height: 300, crop: 'fill', gravity: 'face' },
        { quality: 'auto' },
      ],
    });

    // Update user profile
    const User = require('../models/User');
    await User.findByIdAndUpdate(req.userId, {
      profileImage: result.secure_url,
    });

    res.json({
      success: true,
      imageUrl: result.secure_url,
      message: 'Profile image uploaded successfully',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete image from Cloudinary
exports.deleteImage = async (req, res) => {
  try {
    const { publicId } = req.params;

    await cloudinary.uploader.destroy(publicId);

    res.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get image URL (for resizing on the fly)
exports.getImageUrl = (publicId, options = {}) => {
  return cloudinary.url(publicId, {
    width: options.width || 400,
    height: options.height || 400,
    crop: options.crop || 'fill',
    quality: options.quality || 'auto',
    format: 'jpg',
  });
};
