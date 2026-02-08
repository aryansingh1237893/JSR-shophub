# ShopHub Mobile App - App Store Publishing Guide (iOS)

Complete step-by-step guide to publish ShopHub on Apple App Store.

## Prerequisites

- Apple Developer Account ($99/year)
- Mac computer with Xcode (for local builds)
- App signing certificates & provisioning profiles
- App Store Connect access
- App graphics (screenshots, icons, promotional banner)

---

## Step 1: Setup Apple Developer Account

### 1.1 Create Apple Developer Account
1. Go to https://developer.apple.com
2. Click "Account" → "Join the Apple Developer Program"
3. Pay $99/year
4. Enroll in Apple Developer Program
5. Wait for approval (usually 24-48 hours)

### 1.2 Create App ID in App Store Connect
1. Go to https://appstoreconnect.apple.com
2. Sign in with Apple ID
3. Go to "My Apps" → "Create new app"
4. Fill details:
   - **Platform**: iOS
   - **App name**: ShopHub
   - **Primary language**: English
   - **Bundle ID**: com.shophub.app (must match app.json)
   - **SKU**: any unique identifier

---

## Step 2: Configure App Details in App Store Connect

### 2.1 General Information

1. **App Information**:
   - **Name**: ShopHub
   - **Subtitle**: Online Shopping Platform
   - **Category**: Shopping
   - **Secondary category**: Lifestyle (optional)

2. **Pricing and Availability**:
   - **Price**: Free
   - **Availability**: All countries
   - **Age rating**: 4+ (commerce app, no adult content)

### 2.2 Privacy Policy

1. Create privacy policy (use template or service like Termly)
2. Host on your website: `https://yoursite.com/privacy`
3. In App Store Connect → Privacy Policy → Add URL

### 2.3 App Description

Add in "Localization" section:
```
ShopHub - Your Online Shopping Destination

Browse thousands of products from electronics, fashion, home & beauty.

Features:
✅ Fast, secure checkout with Stripe
✅ Real-time order tracking & notifications
✅ Wishlist & product reviews
✅ Multiple payment methods
✅ Secure user authentication
✅ Easy returns & refunds

Download ShopHub and start shopping today!
```

---

## Step 3: Prepare App Resources

### 3.1 Create App Icons

1. Design 1024x1024 PNG icon
2. Use tool (https://appicon.co) to generate all sizes
3. Download icon set

### 3.2 Create Screenshots

Create 5-8 screenshots showing:
- Home screen with products
- Product browsing & filtering
- Cart view
- Checkout screen
- Order tracking
- Profile/account
- (iPhone 12/13 dimensions: 1170x2532 or 1284x2778)

Tools: Screenshot on iPhone, edit in Figma or Photoshop

### 3.3 Create App Preview Video (Optional)

- 15-30 second video showing app walkthrough
- Dimensions: 1242x2208 or 1080x1920
- Upload MP4 to App Store Connect

---

## Step 4: Generate Build for iOS

### Option A: Using EAS Build (Recommended)

```bash
cd /workspaces/JSR-shophub/mobile

# If not already configured
eas build:configure

# Build for iOS
eas build --platform ios

# Download IPA (iOS App Package) from Expo dashboard
```

### Option B: Build Locally with Xcode

```bash
cd /workspaces/JSR-shophub/mobile

# Create Xcode project (if ejected)
npm run eject

# Or using Expo
expo prebuild --platform ios

# Then in Xcode
open ios/ShopHub.xcworkspace

# Select Product → Archive
# Follow Xcode export wizard to create IPA
```

---

## Step 5: Submit to App Store

### 5.1 Upload Build via App Store Connect

**Method A: Using Xcode Organizer (Easiest)**

1. Open Xcode Organizer (Window → Organizer)
2. Select your app's latest build
3. Click "Distribute App"
4. Select "App Store Connect"
5. Follow wizard to upload

**Method B: Using Transporter App**

1. Download "Transporter" from App Store
2. Authenticate with Apple ID
3. Drag & drop IPA file
4. Click "Deliver"

### 5.2 Add Version Details in App Store Connect

1. Go to "App Store" → "Prepare for Submission"
2. Select version (e.g., 1.0)
3. Fill version release notes:
```
Version 1.0 - Launch

🎉 Initial Release

Features:
✅ Browse & search millions of products
✅ Secure checkout with multiple payment methods
✅ Real-time order tracking
✅ Personalized recommendations
✅ Wishlist & reviews
✅ Fast customer support
```

---

## Step 6: Add App Resources

### 6.1 Upload Screenshots & Preview

1. In App Store Connect → "Screenshots"
2. For each device type (iPhone 6.5", 5.5", 4.7"):
   - Upload 2-8 screenshots
   - Add captions if desired
3. Upload app preview video (optional)

### 6.2 Upload App Icon

1. Select app icon (1024x1024 PNG)
2. Upload in "App Icon" section

### 6.3 Add Marketing Assets

1. **Keywords** (100 characters total):
   ```
   shopping, ecommerce, store, deals, products, shopping app
   ```
2. **Support URL**:
   ```
   https://yoursite.com/support
   ```
3. **Support Email**:
   ```
   support@shophub.com
   ```
4. **Privacy Policy URL**:
   ```
   https://yoursite.com/privacy
   ```

---

## Step 7: Complete Required Sections

Before submission, verify all are complete:

- [ ] App preview or screenshots
- [ ] Description
- [ ] Keywords
- [ ] Support URL
- [ ] Privacy policy
- [ ] Age rating
- [ ] Contact info
- [ ] Build uploaded
- [ ] App icon
- [ ] Version release notes

---

## Step 8: Set App Review Information

In "App Review Information":

1. **Sign in details** (if required):
   - Email: `test@demo.local`
   - Password: `Test@12345`
   - Leave blank if no login needed

2. **Notes for Reviewer**:
   ```
   This is an e-commerce shopping app with:
   - User authentication
   - Product browsing
   - Stripe payment integration
   - Order tracking
   
   Test account available if needed.
   ```

3. **Permissions**:
   - Camera: "For uploading product review photos"
   - Location: "For delivery location estimation"
   - Notifications: "For order updates"

---

## Step 9: Submit for Review

### 9.1 Final Checklist

- [ ] No crashes or bugs found in testing
- [ ] App complies with Apple Guidelines (no copy-pasted UI, proper branding)
- [ ] No external links to payment outside app
- [ ] No misleading marketing
- [ ] Appropriate for all ages (or correct age rating)
- [ ] All features work as advertised

### 9.2 Submit

1. Click "Add for Review" (version section)
2. Confirm all details
3. Click "Submit for Review"
4. Wait for Apple's decision (typically 24-48 hours)

**Note:** Apps are reviewed manually by Apple reviewers. Be patient.

---

## Step 10: Handle Review Decisions

### If Approved ✅

🎉 Your app is live! Monitor in:
- App Store Connect dashboard
- Review ratings & comments
- Download analytics

### If Rejected ❌

1. Read rejection reason from Apple
2. Fix issues listed
3. Increment build version
4. Rebuild and resubmit

**Common rejections:**
- **"Unclear or misleading description"** → Fix app description
- **"Crashes on launch"** → Debug and rebuild
- **"Duplicate or spam app"** → Ensure unique content
- **"External payment links"** → Use only in-app purchases
- **"Impersonation"** → Clarify trademark ownership

---

## Step 11: Post-Launch Management

### 11.1 Monitor App Performance

In App Store Connect:
- **Sales & Trends**: Downloads, revenue, refunds
- **Crashes**: Monitor for crashes and ANRs
- **Ratings & Reviews**: Read user feedback
- **Trends**: See peak download times

### 11.2 Push Updates

To release a new version:

1. Update `version` in `app.json` (e.g., 1.0.1)
2. Build new IPA: `eas build --platform ios`
3. Upload to App Store Connect
4. Add release notes
5. Submit for review (usually 24-48 hours)
6. Once approved, click "Release This Version"

### 11.3 Respond to Reviews

In App Store Connect, reply to user reviews:
- Thank 5-star reviewers
- Address concerns in negative reviews
- Offer fixes/assistance
- Build community goodwill

---

## Optimization Tips

### ASO (App Store Optimization)

1. **Keywords**: Use high-volume, relevant keywords
2. **Subtitle**: Should highlight key feature
3. **Description**: First 2-3 lines are most important
4. **Screenshots**: Show benefits, not just features
5. **Rating**: Keep ≥ 4.5 stars (reply to reviews, fix bugs)

### Growth Strategies

1. **Soft launch**: Submit to a single country first, gather feedback
2. **Referral program**: Offer discount code for invites
3. **Press release**: Email tech blogs & local news
4. **Social media**: Hint at launch on Instagram, Twitter, TikTok
5. **Paid ads**: App Store ads or Google Ads linking to store page

---

## Troubleshooting

### Build Issues

```bash
# If Xcode build fails
cd /workspaces/JSR-shophub/mobile
expo doctor  # Check for issues

# Clear build cache
rm -rf .expo
rm -rf ios
eas build:configure
eas build --platform ios
```

### App Store Connect Issues

**"Invalid IPA"**
- Ensure IPA matches bundle ID in app.json
- Rebuild with correct certificate

**"Build timed out"**
- Try EAS Build instead of local build
- Check network connection

**"Code signing issue"**
- In Xcode: Signing & Capabilities → Team account
- Ensure certificate is valid in Apple Developer portal

---

## Helpful Resources

- App Store Connect: https://appstoreconnect.apple.com
- Apple Developer Guidelines: https://developer.apple.com/app-store/review/guidelines/
- TestFlight (Beta testing): https://testflight.apple.com
- Xcode: https://developer.apple.com/xcode/
- EAS Build: https://docs.expo.dev/eas-update/introduction/

---

## Summary

1. Apple Developer Account ($99/year) ✅
2. Design app icon & screenshots ✅
3. Build and test app thoroughly ✅
4. Upload build (IPA) to App Store Connect ✅
5. Fill all app details & resources ✅
6. Submit for review ✅
7. Wait for approval (24-48 hours) ✅
8. Launch on App Store ✅
9. Monitor downloads & ratings ✅
10. Push updates regularly ✅

**Estimated time to launch:** 1-2 weeks (including testing & review)

---

**Next:** Deploy backend + frontend alongside mobile app launch for maximum impact! 🚀
