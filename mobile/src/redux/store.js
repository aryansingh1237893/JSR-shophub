import { createSlice, configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    loginRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      AsyncStorage.removeItem('authToken');
    },
  },
});

// Cart Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    total: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.items.find((i) => i.productId === item.productId);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        state.items.push(item);
      }
      state.total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      state.total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    },
    updateCartItem: (state, action) => {
      const item = state.items.find((i) => i.productId === action.payload.productId);
      if (item) {
        item.quantity = action.payload.quantity;
      }
      state.total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
    setCart: (state, action) => {
      state.items = action.payload.items;
      state.total = action.payload.total;
    },
  },
});

// Products Slice
const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    selectedProduct: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    setProducts: (state, action) => {
      state.items = action.payload;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

// Orders Slice
const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],
    selectedOrder: null,
    isLoading: false,
  },
  reducers: {
    setOrders: (state, action) => {
      state.items = action.payload;
    },
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
    addOrder: (state, action) => {
      state.items.unshift(action.payload);
    },
  },
});

// Create Store
const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    cart: cartSlice.reducer,
    products: productsSlice.reducer,
    orders: ordersSlice.reducer,
  },
});

export const { loginRequest, loginSuccess, loginFailure, logout } = authSlice.actions;
export const { addToCart, removeFromCart, updateCartItem, clearCart, setCart } = cartSlice.actions;
export const { setProducts, setSelectedProduct, setLoading, setError } = productsSlice.actions;
export const { setOrders, setSelectedOrder, addOrder } = ordersSlice.actions;

export default store;
