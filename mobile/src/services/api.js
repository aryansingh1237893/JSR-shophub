import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class APIService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
    });

    // Add request interceptor to include auth token
    this.client.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Handle response errors
    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (error.response?.status === 401) {
          AsyncStorage.removeItem('authToken');
          // Emit logout event to navigation
        }
        return Promise.reject(error.response?.data || error.message);
      }
    );
  }

  // Auth endpoints
  signup(data) {
    return this.client.post('/auth/signup', data);
  }

  login(email, password) {
    return this.client.post('/auth/login', { email, password });
  }

  loginWithPhone(phone) {
    return this.client.post('/auth/login-phone', { phone });
  }

  verifyOTP(phone, otp) {
    return this.client.post('/auth/verify-otp', { phone, otp });
  }

  forgotPassword(email) {
    return this.client.post('/auth/forgot-password', { email });
  }

  resetPassword(token, newPassword) {
    return this.client.post('/auth/reset-password', { token, newPassword });
  }

  // Product endpoints
  getProducts(page = 1, limit = 20, filters = {}) {
    return this.client.get('/products', {
      params: { page, limit, ...filters },
    });
  }

  getProductById(id) {
    return this.client.get(`/products/${id}`);
  }

  searchProducts(query) {
    return this.client.get('/search', {
      params: { query },
    });
  }

  getCategories() {
    return this.client.get('/products/categories');
  }

  // Cart endpoints
  getCart() {
    return this.client.get('/cart');
  }

  addToCart(productId, quantity) {
    return this.client.post('/cart', { productId, quantity });
  }

  updateCartItem(cartItemId, quantity) {
    return this.client.put(`/cart/${cartItemId}`, { quantity });
  }

  removeFromCart(cartItemId) {
    return this.client.delete(`/cart/${cartItemId}`);
  }

  clearCart() {
    return this.client.delete('/cart');
  }

  // Order endpoints
  createOrder(orderData) {
    return this.client.post('/orders', orderData);
  }

  getOrders(page = 1, limit = 10) {
    return this.client.get('/orders', {
      params: { page, limit },
    });
  }

  getOrderById(id) {
    return this.client.get(`/orders/${id}`);
  }

  updateOrderStatus(id, status) {
    return this.client.put(`/orders/${id}`, { status });
  }

  trackOrder(orderId) {
    return this.client.get(`/orders/${orderId}/track`);
  }

  cancelOrder(orderId, reason) {
    return this.client.post(`/orders/${orderId}/cancel`, { reason });
  }

  // Payment endpoints
  initiatePayment(orderId, paymentMethod) {
    return this.client.post('/payments/initiate', { orderId, paymentMethod });
  }

  verifyPayment(paymentIntentId) {
    return this.client.post('/payments/verify', { paymentIntentId });
  }

  processRefund(orderId, reason) {
    return this.client.post(`/payments/refund/${orderId}`, { reason });
  }

  // User/Profile endpoints
  getProfile() {
    return this.client.get('/users/profile');
  }

  updateProfile(data) {
    return this.client.put('/users/profile', data);
  }

  addAddress(addressData) {
    return this.client.post('/users/addresses', addressData);
  }

  getAddresses() {
    return this.client.get('/users/addresses');
  }

  updateAddress(addressId, data) {
    return this.client.put(`/users/addresses/${addressId}`, data);
  }

  deleteAddress(addressId) {
    return this.client.delete(`/users/addresses/${addressId}`);
  }

  // Wishlist endpoints
  getWishlist() {
    return this.client.get('/users/wishlist');
  }

  addToWishlist(productId) {
    return this.client.post('/users/wishlist', { productId });
  }

  removeFromWishlist(productId) {
    return this.client.delete(`/users/wishlist/${productId}`);
  }

  // Review endpoints
  addReview(productId, review) {
    return this.client.post(`/products/${productId}/reviews`, review);
  }

  getReviews(productId) {
    return this.client.get(`/products/${productId}/reviews`);
  }

  // Notification endpoints
  getNotifications() {
    return this.client.get('/notifications');
  }

  markNotificationRead(notificationId) {
    return this.client.put(`/notifications/${notificationId}`, { read: true });
  }

  // Upload endpoints
  uploadImage(formData) {
    return this.client.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
}

export default new APIService();
