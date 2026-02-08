# ShopHub Mobile App - Play Store Publishing Guide

Complete step-by-step guide to publish ShopHub mobile app on Google Play Store.

## Prerequisites

- Google Play Developer Account ($25 one-time fee)
- Expo CLI or React Native CLI
- Android SDK / Xcode
- App signing keys (generated or existing)
- App Store Graphics (screenshots, icons, promotional banner)

---

## Step 1: Prepare Google Play Developer Account

### 1.1 Create Google Play Developer Account
1. Go to https://play.google.com/console
2. Click "Create account"
3. Fill in business details and accept terms
4. Pay $25 one-time registration fee
5. Wait for account activation (usually instant)

### 1.2 Create New App in Play Console
1. Go to Play Console → Create app
2. Fill app details:
   - **App name**: ShopHub
   - **Language**: English
   - **App or game**: App
   - **Free or paid**: Free (can set in-app purchases later)
   - **Default language**: English

---

## Step 2: Generate Signing Key (Important!)

### Option A: Using EAS Build (Recommended - Easiest)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# You'll be prompted to create a new credential
# EAS will manage signing keys for you automatically
```

### Option B: Manual Signing Key

This is optional if using EAS Build - skip if you used Option A.

Create Android keystore:
```bash
keytool -genkey -v -keystore ~/shophub-release-key.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias shophub-key -storepass your_keystore_password \
  -keypass your_key_password
```

**Important:** Save the keystore file and passwords safely!

---

## Step 3: Configure App in Play Console

### 3.1 Fill App Details

1. **App info** → Add descriptions:
   - **Short description** (80 chars): "Shop online for everything – electronics, fashion, home & more"
   - **Full description**: Add detailed description of ShopHub features
   - **Category**: Shopping
   - **Content rating**: Submit questionnaire (usually Generic/All ages)

2. **Graphics & Images**:
   - **App icon** (512x512 PNG): Create in Figma or use Canva
   - **Feature graphic** (1024x500 PNG): Promotional banner
   - **Screenshots** (minimum 2, up to 8):
     - Home screen
     - Product browsing
     - Cart & checkout
     - Orders page
     - Profile section
   - **Video (optional)**: YouTube link to app demo

3. **Content rating**:
   - Go to "Content rating"
   - Fill questionnaire
   - Save rating

### 3.2 Target Audience & Content

- **Target audience**: General audience
- **Content rating**: Add if app has ads or in-app purchases
- **Ads**: Yes (if monetizing)
- **Age range**: Everyone

---

## Step 4: Prepare App Build

### 4.1 Build APK/AAB Using EAS Build (Recommended)

```bash
cd /workspaces/JSR-shophub/mobile

# Configure EAS build
eas build:configure

# Build for Android
eas build --platform android

# After build completes, download the AAB (Android App Bundle)
# It will be in the Expo Build dashboard
```

### 4.2 Build Locally (Alternative)

If not using EAS:

```bash
cd /workspaces/JSR-shophub/mobile

# Install dependencies
npm install

# Build APK
expo build:android

# Or if using bare React Native
npm run build:android
```

**Note:** You'll need Android SDK and proper configuration. Using EAS Build is simpler and recommended.

---

## Step 5: Upload to Play Console

### 5.1 Create Release

1. Go to Play Console → Your app → Release
2. Select "Production" or "Internal testing" (recommend internal first)
3. Click "Create new release"

### 5.2 Upload Build File

1. Download AAB (Android App Bundle) from Expo Build or generated locally
2. In Play Console release editor, scroll to "APKs and app bundles"
3. Click "Browse files" → Select your `.aab` file
4. Upload the file (file size should be ~50-100 MB)

### 5.3 Add Release Notes

Add in release notes section:
```
Version 1.0.0 - Initial Release

Features:
✅ Browse & search products
✅ Secure shopping cart
✅ One-click checkout with Stripe
✅ Real-time order tracking
✅ User authentication with OTP
✅ Wishlist & reviews
✅ Multiple payment options
```

---

## Step 6: Complete All Questionnaires

Before publishing, complete:

1. **Ads & monetization**
   - Does app contain ads? No/Yes
   - Does app have in-app purchases? No/Yes (can be added later)

2. **Data & privacy**
   - Review privacy policy
   - Add link to privacy policy: `https://yoursite.com/privacy`
   - Declare data collected (user account, payment info, location for delivery)
   - Data sharing: Not shared with third parties

3. **Permissions**
   - Review all permissions required by app
   - Justify each permission

4. **Content rating**
   - Complete IAMAI questionnaire (if applicable)

---

## Step 7: Submit for Review

### 7.1 Final Review Checklist

- [ ] App name, description complete
- [ ] Screenshots & graphics uploaded (min 2)
- [ ] App icon (192x192 & 512x512)
- [ ] Version code incremented (1, 2, 3...)
- [ ] Version name set (1.0.0, 1.0.1...)
- [ ] AAB/APK uploaded successfully
- [ ] Release notes added
- [ ] All questionnaires completed
- [ ] Privacy policy linked
- [ ] Content rating completed
- [ ] App size < 100 MB (if using traditional APK)

### 7.2 Submit Release

1. Click "Review release"
2. Verify all info is correct
3. Click "Start rollout to Production"
4. Confirm submission

**Typical review time:** 24-72 hours

---

## Step 8: Monitor & Manage App

### 8.1 Check Review Status

1. Go to Play Console → Your app → Release
2. Check "Production" tab for status:
   - **In review**: Waiting for Google approval
   - **Rejected**: Fix issues and resubmit
   - **Published**: Live on Play Store

### 8.2 View Real-time Data

In Play Console, check:
- **Installs & downloads**: Real-time download stats
- **Crashes & ANRs**: Monitor app stability
- **Reviews & ratings**: User feedback
- **User acquisition**: How users find your app
- **Retention**: How many return daily/weekly

### 8.3 Update App

To publish a new version:
1. Increment `versionCode` in `app.json` (previous + 1)
2. Increment `versionName` (e.g., 1.0.1)
3. Build new AAB using `eas build:android`
4. Upload to Play Console → Create new release
5. Submit for review (typically 4-24 hours faster for updates)

---

## Step 9: Optimization & Growth

### 9.1 App Store Optimization (ASO)

- **Keywords**: Add high-volume, low-competition keywords in short description
- **Title**: Include main keyword (e.g., "ShopHub - Online Shopping")
- **Screenshots**: Show key features visually
- **Ratings**: Encourage 5-star reviews (ask happy users)

### 9.2 Growth Strategies

- **Push notifications**: Send deals & order updates
- **Referral program**: Offer discount code for inviting friends
- **Social proof**: Add reviews & ratings to app page
- **Marketing**: Link from website, social media, ads

```
Example Play Store URL:
https://play.google.com/store/apps/details?id=com.shophub.app
```

---

## Common Issues & Solutions

### Issue: "App not optimized for tablets"
**Solution**: In `app.json`, add:
```json
{
  "android": {
    "supportsRtl": true,
    "supportsSmallScreens": true,
    "supportsNormalScreens": true,
    "supportsLargeScreens": true,
    "supportsExtraLargeScreens": true
  }
}
```

### Issue: "Crashes on Android 10/11"
**Solution**: Make sure target Android API is 33+. Update `app.json`:
```json
{
  "android": {
    "compileSdkVersion": 34,
    "targetSdkVersion": 34
  }
}
```

### Issue: "Rejected due to permission misuse"
**Solution**: Only request permissions you actually use. Remove unused permissions from `AndroidManifest.xml`.

### Issue: Build fails with "Unknown issue"
**Solution**: Check EAS Build logs or run locally:
```bash
expo build:android --local
```

### Issue: "APK/AAB too large"
**Solution**: Enable code splitting and minification:
```json
{
  "android": {
    "useNextNotificationApi": true
  }
}
```

---

## Testing Before Release

### 9.1 Test on Real Device

```bash
# Build and install on Android phone
eas build --platform android --profile preview

# Or using local APK
# 1. Transfer APK to phone via USB
# 2. Install: Settings → Apps & notifications → Install unknown apps
# 3. Test all flows: Auth, Products, Cart, Checkout, Orders
```

### 9.2 Internal Testing Track

Before going to production:
1. Create "Internal testing" release in Play Console
2. Add test users (Google accounts)
3. Share test link: Play Console → Testers → Copy link
4. Send to 10-20 users
5. Wait for feedback (24-48 hours)
6. Fix bugs if any
7. Then move to Production

---

## Post-Launch: Revenue & Analytics

### 10.1 Monetization Options

1. **In-app purchases** (premium features, coins, etc.)
2. **Ads** (Google AdMob)
3. **Subscription** (VIP membership)
4. **Commission on sales** (if marketplace)

### 10.2 Analytics Setup

Add Firebase to `app.json`:
```json
{
  "plugins": [
    ["@react-native-firebase/app"],
    ["@react-native-firebase/analytics"]
  ]
}
```

Then rebuild and submit new version.

---

## Support & Updates

- **User support**: Add email in app → Reply to reviews in Play Console
- **Updates**: Push updates every 2-4 weeks with bug fixes & features
- **Ratings**: Aim for 4.5+ stars (ask satisfied users to rate)
- **Community**: Engage with reviews and user feedback

---

## Checklist Summary

✅ Google Play Developer account created  
✅ App name & description ready  
✅ Graphics & screenshots prepared  
✅ Signing key generated (via EAS)  
✅ AAB built using EAS or locally  
✅ App uploaded to Play Console  
✅ All questionnaires completed  
✅ Submitted for review  
✅ Monitoring dashboard set up  
✅ Update strategy planned  

**Next:** Repeat for iOS (App Store) following `APP_STORE_PUBLISHING.md`

---

## Helpful Links

- Google Play Console: https://play.google.com/console
- Expo Build: https://docs.expo.dev/eas-update/introduction/
- Android Guidelines: https://developer.android.com/docs
- Play Store ASO Guide: https://support.google.com/googleplay/android-developer/answer/7158438
- Revenue Tracking: https://play.google.com/console/u/0/developer (check Earnings)

Happy launches! 🚀
