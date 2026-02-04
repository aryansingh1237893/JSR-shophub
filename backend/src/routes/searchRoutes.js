const express = require('express');
const searchController = require('../controllers/searchController');

const router = express.Router();

router.get('/products', searchController.searchProducts);
router.get('/suggestions', searchController.searchSuggestions);
router.get('/correct-spelling', searchController.correctSpelling);
router.get('/delivery-check', searchController.checkDelivery);
router.get('/location-delivery', searchController.getLocationDelivery);

module.exports = router;
