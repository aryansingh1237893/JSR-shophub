# ShopHub Mobile App

React Native mobile application for iOS and Android platforms.

## Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn
- Expo CLI: `npm install -g expo-cli`
- iOS: Xcode (Mac only)
- Android: Android SDK & Emulator

### Installation

```bash
cd mobile

# Install dependencies
npm install

# Start development server
npm start

# Options:
# - Press 'a' for Android emulator
# - Press 'i' for iOS simulator
# - Press 'w' for web
# - Scan QR code with Expo Go app on physical device
```

---

## Development Commands

```bash
# Start Expo development server
npm start

# Run on Android emulator
npm run android

# Run on iOS simulator (Mac only)
npm run ios

# Run on web browser
npm run web

# Build APK for Android
eas build --platform android

# Build for iOS
eas build --platform ios

# Build for web
npm run build:web

# Check for issues
expo doctor

# Eject from Expo (not recommended)
npm run eject
```

---

## Project Structure

```
mobile/
├── App.js                    # Main entry point
├── app.json                  # Expo configuration
├── package.json              # Dependencies
├── src/
│   ├── screens/             # App screens (Home, Products, Cart, etc.)
│   ├── components/          # Reusable components
│   ├── services/            # API client & services
│   ├── redux/               # State management (Redux)
│   ├── navigation/          # Navigation setup
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   ├── constants/           # App constants
│   ├── types/               # TypeScript types
│   └── assets/              # Images, icons, fonts
├── .env.example             # Environment template
├── PLAY_STORE_PUBLISHING.md # Android/Play Store guide
├── APP_STORE_PUBLISHING.md  # iOS/App Store guide
└── README.md                # This file
```

---

## Features Implemented

### User Features
- ✅ User authentication (email, phone, OTP)
- ✅ Product browsing & search
- ✅ Shopping cart management
- ✅ Checkout with Stripe payment
- ✅ Order tracking  
- ✅ Wishlist & reviews
- ✅ User profile & addresses
- ✅ Push notifications

### Technical
- ✅ Redux state management
- ✅ Axios API client with interceptors
- ✅ React Navigation (bottom tabs, stacks)
- ✅ AsyncStorage for local persistence
- ✅ Formik + Yup validation
- ✅ Stripe integration
- ✅ Image picker & camera access
- ✅ Push notifications setup

---

## Configuration

### 1. Environment Setup

Create `.env` or `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
REACT_APP_API_URL=http://your-backend-url/api
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_your_key
REACT_APP_ENV=development
```

### 2. App Configuration (app.json)

Key settings:
- **Package ID**: `com.shophub.app` (change to your domain)
- **Icons**: Update paths to your app icons
- **Splash screen**: Customize startup image
- **Permissions**: Camera, location, notifications

Update in `app.json`:
```json
{
  "expo": {
    "name": "ShopHub",
    "slug": "shophub-mobile",
    "ios": { "bundleIdentifier": "com.yourcompany.shophub" },
    "android": { "package": "com.yourcompany.shophub" }
  }
}
```

---

## Building for Production

### Android / Play Store

```bash
# 1. Using EAS Build (Recommended)
eas build --platform android

# 2. Or build locally
expo build:android

# Download APK/AAB and upload to Play Console
```

Full guide: See `PLAY_STORE_PUBLISHING.md`

### iOS / App Store

```bash
# 1. Using EAS Build (Recommended)
eas build --platform ios

# 2. Or build locally (Mac only)
expo build:ios

# Download IPA and upload to App Store Connect
```

Full guide: See `APP_STORE_PUBLISHING.md`

---

## API Integration

### API Service

All API calls go through `src/services/api.js`:

```javascript
import api from './services/api';

// Authenticate
const user = await api.login('email@test.com', 'password');

// Get products
const products = await api.getProducts(page, limit, filters);

// Create order
const order = await api.createOrder(orderData);

// Payment
const payment = await api.initiatePayment(orderId, 'card');
```

**Base URL**: Configured in `.env` → `REACT_APP_API_URL`

### Required Backend Endpoints

Ensure your backend implements all these endpoints (should be already from `/backend`):

```
Authentication:
POST /api/auth/login
POST /api/auth/signup
POST /api/auth/login-phone
POST /api/auth/verify-otp
POST /api/auth/forgot-password

Products:
GET /api/products
GET /api/products/:id
GET /api/products/categories
GET /api/search?query=...

Cart:
GET /api/cart
POST /api/cart
PUT /api/cart/:id
DELETE /api/cart/:id

Orders:
GET /api/orders
POST /api/orders
GET /api/orders/:id
PUT /api/orders/:id

Payments:
POST /api/payments/initiate
POST /api/payments/verify
POST /api/payments/refund/:orderId

User:
GET /api/users/profile
PUT /api/users/profile
GET /api/users/addresses
POST /api/users/addresses
```

---

## Testing

### Manual Testing Checklist

Before submitting to stores:

- [ ] **Auth**: Signup, login, OTP, forgot password work
- [ ] **Products**: Browse, search, filter, sort work
- [ ] **Cart**: Add, remove, update quantity work
- [ ] **Checkout**: Address selection, payment flow work
- [ ] **Payments**: Stripe test cards process  
- [ ] **Orders**: Created, tracked, canceled correctly
- [ ] **UI**: No crashes, responsive on small/large screens
- [ ] **Performance**: App launches in <3s
- [ ] **Offline**: Graceful handling of no internet
- [ ] **Permissions**: Camera, location, notifications requested properly

### Testing Cards (Stripe Test Mode)

- **Success**: 4242 4242 4242 4242 (any expiry, any CVC)
- **Decline**: 4000 0000 0000 0002
- **Require auth**: 4000 0025 0000 3155
- **3D Secure**: 4000 0051 0001 0070

---

## Deployment Checklist

### Before Play Store/App Store

- [ ] Version bumped (`versionCode`/`versionName`)
- [ ] App built successfully (no errors)
- [ ] All screens tested on real device
- [ ] Payment flow tested with test cards
- [ ] Network calls working with backend
- [ ] Permissions all working (camera, location)
- [ ] App icon & screenshots ready
- [ ] Privacy policy linked
- [ ] Release notes written
- [ ] No console errors/warnings
- [ ] Strings localized (if multilingual)
- [ ] Credentials (API keys) in env vars

### Submission Steps

**Android:**
1. `eas build --platform android` → AAB
2. Upload to Play Console
3. Add screenshots & description
4. Submit for review

**iOS:**
1. `eas build --platform ios` → IPA
2. Upload to App Store Connect
3. Add screenshots & artwork
4. Submit for review

---

## Troubleshooting

### App Won't Start
```bash
expo doctor  # Check for issues
npm install  # Reinstall deps
rm -rf node_modules .expo
npm start    # Try again
```

### Build Fails
```bash
# Clear cache
expo start -- --clear

# If using local build
expo download-assets
expo build:android/ios
```

### API Connection Fails
- Verify backend is running
- Check `.env` has correct `REACT_APP_API_URL`
- Ensure CORS enabled on backend
- Check network connectivity

### Payment Not Working
- Verify Stripe public key in `.env`
- Check backend secret key matches
- Test with Stripe test cards
- View API logs for errors

### GPS/Camera Not Working
- Check app has permission in device settings
- Ensure `app.json` has required plugins
- Test on real device (emulator may not support)
- Request permission again if denied

---

## Security Best Practices

1. **Never commit `.env` files** with real keys
2. **Use .gitignore** to exclude sensitive files  
3. **Validate user input** before sending to API
4. **Use HTTPS** only (localhost for dev)
5. **Secure AsyncStorage** for sensitive data:
   ```javascript
   import * as SecureStore from 'expo-secure-store';
   // Store auth token securely
   SecureStore.setItemAsync('authToken', token);
   ```
6. **Implement certificate pinning** for API security
7. **Obfuscate code** in production builds
8. **Monitor for crashes** (Sentry, LogRocket)

---

## Performance Optimization

- Lazy load screens/images
- Use React.memo for expensive components
- Optimize bundle size (`expo doctor output`)
- Use FlatList for long lists
- Implement pagination for large datasets
- Cache images locally

---

## Monitoring & Analytics

### Add Firebase Analytics

```bash
eas build:configure --platform all
```

Then track events:
```javascript
import { Analytics } from 'firebase/analytics';

// Track custom event
logEvent(analytics, 'view_product', {
  product_id: '123',
  price: 999
});
```

### Monitor Crashes

```bash
# Option A: Sentry
npm install @sentry/react-native

# Option B: LogRocket
npm install logrocket
```

---

## Next Steps

1. **Test locally** with `npm start`
2. **Build for Android** with `eas build --platform android`
3. **Build for iOS** with `eas build --platform ios`
4. **Upload to Play Store** (see `PLAY_STORE_PUBLISHING.md`)
5. **Upload to App Store** (see `APP_STORE_PUBLISHING.md`)
6. **Monitor downloads** & user feedback
7. **Push updates** with bug fixes & features

---

## Support

- **Documentation**: See guides in root directory
- **API Integration**: Check `src/services/api.js`
- **State Management**: Redux setup in `src/redux/`
- **Navigation**: React Navigation in `App.js`

For issues or questions, refer to component documentation or check logs: `expo start` shows detailed error messages.

---

## License

© 2026 ShopHub. All rights reserved.
