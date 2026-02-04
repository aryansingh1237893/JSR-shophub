import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

// Product Reducer
const productReducer = (state = { products: [], loading: false }, action) => {
  switch (action.type) {
    case 'FETCH_PRODUCTS_START':
      return { ...state, loading: true };
    case 'FETCH_PRODUCTS_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_PRODUCTS_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

// Cart Reducer
const cartReducer = (state = { items: [], total: 0 }, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
              : item
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
    case 'REMOVE_FROM_CART':
      return { ...state, items: state.items.filter(item => item.id !== action.payload) };
    case 'UPDATE_CART_ITEM':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
        ),
      };
    case 'CLEAR_CART':
      return { items: [], total: 0 };
    default:
      return state;
  }
};

// Auth Reducer
const authReducer = (state = { isLoggedIn: false, user: null, token: null }, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        isLoggedIn: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    case 'LOGOUT':
      return { isLoggedIn: false, user: null, token: null };
    default:
      return state;
  }
};

// UI Reducer
const uiReducer = (state = { theme: 'light', notifications: [] }, action) => {
  switch (action.type) {
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.payload] };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  products: productReducer,
  cart: cartReducer,
  auth: authReducer,
  ui: uiReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
