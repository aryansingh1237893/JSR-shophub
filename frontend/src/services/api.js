import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Auth Service
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  loginWithOTP: (phone) => api.post('/auth/login-otp', { phone }),
  verifyOTP: (phone, otp) => api.post('/auth/verify-otp', { phone, otp }),
};

// Product Service
export const productService = {
  getProducts: (page = 1, limit = 20) => api.get('/products', { params: { page, limit } }),
  getProductById: (id) => api.get(`/products/${id}`),
  getBestSellers: () => api.get('/products/bestsellers'),
  getDealsOfDay: () => api.get('/products/deals'),
  getRecommended: () => api.get('/products/recommended'),
  filterProducts: (filters) => api.get('/products/filter', { params: filters }),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

// Search Service
export const searchService = {
  search: (query) => api.get('/search/products', { params: { query } }),
  getSuggestions: (query) => api.get('/search/suggestions', { params: { query } }),
  correctSpelling: (query) => api.get('/search/correct-spelling', { params: { query } }),
  checkDelivery: (pincode, productId) =>
    api.get('/search/delivery-check', { params: { pincode, productId } }),
  getLocationDelivery: (latitude, longitude) =>
    api.get('/search/location-delivery', { params: { latitude, longitude } }),
};

// Cart Service
export const cartService = {
  getCart: () => api.get('/cart'),
  addToCart: (productId, quantity) =>
    api.post('/cart/add', { productId, quantity }),
  updateCart: (productId, quantity) =>
    api.put('/cart/update', { productId, quantity }),
  removeFromCart: (productId) =>
    api.delete('/cart/remove', { data: { productId } }),
  clearCart: () => api.delete('/cart/clear'),
};

// Order Service
export const orderService = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
  requestReturn: (id, reason) =>
    api.post(`/orders/${id}/return`, { reason }),
  downloadInvoice: (id) => api.get(`/orders/${id}/invoice`),
};

// Review Service
export const reviewService = {
  createReview: (reviewData) => api.post('/reviews', reviewData),
  getProductReviews: (productId) =>
    api.get(`/reviews/product/${productId}`),
  getUserReviews: () => api.get('/reviews/user'),
  updateReview: (id, data) => api.put(`/reviews/${id}`, data),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
  markHelpful: (id) => api.post(`/reviews/${id}/helpful`),
};

// User Service
export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getAddresses: () => api.get('/users/addresses'),
  addAddress: (address) => api.post('/users/addresses', address),
  updateAddress: (id, address) => api.put(`/users/addresses/${id}`, address),
  deleteAddress: (id) => api.delete(`/users/addresses/${id}`),
  getWishlist: () => api.get('/users/wishlist'),
  addToWishlist: (productId) => api.post('/users/wishlist', { productId }),
  removeFromWishlist: (productId) =>
    api.delete(`/users/wishlist/${productId}`),
};

// Payment Service
export const paymentService = {
  initiatePayment: (data) => api.post('/payments/initiate', data),
  verifyPayment: (data) => api.post('/payments/verify', data),
  cardPayment: (data) => api.post('/payments/card', data),
  upiPayment: (data) => api.post('/payments/upi', data),
  walletPayment: (data) => api.post('/payments/wallet', data),
  getEMIOptions: () => api.get('/payments/emi-options'),
};

// Notification Service
export const notificationService = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  subscribeToNotifications: (data) =>
    api.post('/notifications/subscribe', data),
  setPriceAlerts: (productId, targetPrice) =>
    api.post('/notifications/price-alerts', { productId, targetPrice }),
};

export default api;
