const Product = require('../models/Product');

// Advanced search with autocomplete
exports.searchProducts = async (req, res) => {
  try {
    const { query, limit = 20 } = req.query;

    if (!query || query.length < 2) {
      return res.json([]);
    }

    // Text search with MongoDB
    const products = await Product.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(Number(limit));

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Live search suggestions
exports.searchSuggestions = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 2) {
      return res.json([]);
    }

    const suggestions = await Product.find(
      { title: { $regex: query, $options: 'i' } },
      { title: 1 }
    )
      .limit(10)
      .distinct('title');

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Spelling correction (simple Levenshtein distance)
const levenshteinDistance = (str1, str2) => {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix = Array(len2 + 1).fill(null).map(() => Array(len1 + 1).fill(0));

  for (let i = 0; i <= len1; i++) matrix[0][i] = i;
  for (let j = 0; j <= len2; j++) matrix[j][0] = j;

  for (let j = 1; j <= len2; j++) {
    for (let i = 1; i <= len1; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }

  return matrix[len2][len1];
};

exports.correctSpelling = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.json({ correctedQuery: '' });
    }

    const allProducts = await Product.find({}, { title: 1 }).limit(1000);
    const titles = [...new Set(allProducts.map(p => p.title.toLowerCase()))];

    let bestMatch = query;
    let minDistance = Infinity;

    for (const title of titles) {
      const distance = levenshteinDistance(query.toLowerCase(), title);
      if (distance < minDistance && distance <= 2) {
        minDistance = distance;
        bestMatch = title;
      }
    }

    res.json({ correctedQuery: bestMatch, original: query });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Pincode delivery check
exports.checkDelivery = async (req, res) => {
  try {
    const { pincode, productId } = req.query;

    // TODO: Integrate with courier API for real pincode validation
    const isAvailable = pincode.length === 6;

    res.json({
      available: isAvailable,
      estimatedDays: isAvailable ? 3 : null,
      message: isAvailable ? 'Delivery available' : 'Delivery not available',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Location-based delivery
exports.getLocationDelivery = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    // TODO: Integrate with maps API for location-based warehouse finding
    res.json({
      warehouse: 'Warehouse 1',
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      distance: '12.5 km',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
