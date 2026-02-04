const Product = require('../models/Product');
const Category = require('../models/Category');
const slugify = require('slugify');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, sort = '-createdAt' } = req.query;
    const products = await Product.find({ isActive: true })
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Product.countDocuments({ isActive: true });
    res.json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('reviews');
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create product (Admin only)
exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, category, ...rest } = req.body;

    const product = new Product({
      title,
      slug: slugify(title, { lower: true }),
      description,
      price,
      category,
      ...rest,
    });

    await product.save();
    res.status(201).json({ message: 'Product created', product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update product (Admin only)
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ message: 'Product updated', product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete product (Admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get best sellers
exports.getBestSellers = async (req, res) => {
  try {
    const products = await Product.find({ isBestSeller: true }).limit(20);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get deals of the day
exports.getDealsOfDay = async (req, res) => {
  try {
    const products = await Product.find({ isDealOfDay: true }).limit(20);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get recommended products
exports.getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.find({ rating: { $gte: 4 } }).limit(10);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Filter products
exports.filterProducts = async (req, res) => {
  try {
    const { minPrice, maxPrice, brand, rating, category } = req.query;
    const filter = { isActive: true };

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (brand) filter.brand = brand;
    if (rating) filter.rating = { $gte: Number(rating) };
    if (category) filter.category = category;

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
