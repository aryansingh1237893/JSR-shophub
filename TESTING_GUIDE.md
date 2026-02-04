# Testing Guide - ShopHub E-Commerce Platform

## 🧪 Testing the Application

Once you have the application running, follow these steps to test all features.

---

## Prerequisites

1. Backend running on `http://localhost:5000`
2. Frontend running on `http://localhost:3000`
3. MongoDB connection active

---

## 🔐 Authentication Testing

### 1. User Registration
- **URL**: http://localhost:3000/register
- **Test Data**:
  - First Name: John
  - Last Name: Doe
  - Email: john@example.com
  - Phone: 9876543210
  - Password: Test123456
- **Expected**: New user created, redirected to home

### 2. User Login
- **URL**: http://localhost:3000/login
- **Test Data**:
  - Email: john@example.com
  - Password: Test123456
- **Expected**: JWT token stored, user logged in

### 3. OTP Login (Backend Ready)
- Mock OTP flow: Use `/api/auth/login-otp` endpoint
- Verify with: `/api/auth/verify-otp` endpoint

---

## 🛍️ Product Testing

### 1. View Products
- **URL**: http://localhost:3000
- **Expected**: 
  - Best sellers section displays
  - Deals of the day shows
  - Recommended products appear
  - Product cards display correctly

### 2. View Product Details
- Click any product card
- **Expected**:
  - Product image gallery loads
  - Price and discount displays
  - Specifications show
  - Reviews section appears
  - Related products visible

### 3. Search Products
- Enter search term in header search bar
- **Expected**:
  - Results displayed
  - Filter options work
  - Sorting works (if implemented)

### 4. Filter Products
- **URL**: http://localhost:3000?category=electronics
- **Expected**: Products filtered by category

---

## 🛒 Cart Testing

### 1. Add to Cart
- From product page, click "Add to Cart"
- **Expected**: 
  - Item added to cart
  - Cart count increases in header
  - Success notification

### 2. View Cart
- **URL**: http://localhost:3000/cart
- **Expected**: 
  - All items displayed
  - Prices calculated correctly
  - Total amount shown
  - Quantity controls work

### 3. Update Quantity
- Use +/- buttons in cart
- **Expected**: 
  - Quantity updates
  - Total price recalculates
  - Real-time updates

### 4. Remove Items
- Click trash icon
- **Expected**: Item removed from cart

### 5. Clear Cart
- Click clear cart button
- **Expected**: All items removed

---

## 💳 Checkout Testing

### 1. Proceed to Checkout
- From cart page, click "Proceed to Checkout"
- **Expected**: 
  - Redirects to checkout if logged in
  - Redirects to login if not logged in

### 2. Shipping Address
- Enter delivery address
- **Expected**: Address saved for order

### 3. Select Payment Method
- Choose: Card, UPI, Wallet, or COD
- **Expected**: Payment form updates

### 4. Place Order
- Click "Place Order"
- **Expected**: Order created, order confirmation

---

## 📦 Order Management Testing

### 1. View Orders
- **URL**: http://localhost:3000/orders
- **Expected**: List of user's orders displayed

### 2. Order Details
- Click on an order
- **Expected**: 
  - Order number, date shown
  - Items listed
  - Current status displayed
  - Tracking info if available

### 3. Order Tracking
- Check order status
- **Expected**: Status shows (pending, processing, shipped, etc.)

### 4. Cancel Order
- If order is pending, click "Cancel"
- **Expected**: Order status changes to cancelled

### 5. Request Return
- If order delivered, click "Return"
- **Expected**: Return request created

---

## ⭐ Review Testing

### 1. Write Review
- From product page, scroll to reviews
- Click "Write Review"
- **Expected**: Review form appears

### 2. Submit Review
- Fill rating (1-5 stars)
- Add title and comment
- Upload images (optional)
- Click "Submit"
- **Expected**: Review submitted (pending moderation)

### 3. View Reviews
- See existing reviews
- Filter by rating
- Sort by helpful
- **Expected**: Reviews display correctly

---

## 👤 User Profile Testing

### 1. Access Profile
- **URL**: http://localhost:3000/profile
- **Expected**: User info displayed

### 2. Edit Profile
- Click edit button
- Change name or details
- Click save
- **Expected**: Profile updated

### 3. Manage Addresses
- Click "Addresses" tab
- Add new address
- **Expected**: Address saved and listed

### 4. Payment Methods
- Click "Payment Methods" tab
- **Expected**: Saved cards/UPI displayed

### 5. Prime Membership
- Click "Prime" tab
- **Expected**: Membership status shown

---

## 💬 Support Features Testing

### 1. Chatbot (Ready for Integration)
- **Endpoint**: POST /api/notifications/chat
- Send test message
- Expected: Chat system ready

### 2. Live Chat (Ready for Integration)
- **Endpoint**: POST /api/notifications/live-chat
- Test live chat initiation

### 3. Call Support (Ready for Integration)
- **Endpoint**: POST /api/notifications/call-support
- Request callback

---

## 🔍 Search Features Testing

### 1. Full-Text Search
```bash
curl http://localhost:5000/api/search/products?query=iphone
```
- **Expected**: Products matching "iphone" returned

### 2. Search Suggestions
```bash
curl http://localhost:5000/api/search/suggestions?query=iph
```
- **Expected**: Suggestions like "iphone" returned

### 3. Spelling Correction
```bash
curl http://localhost:5000/api/search/correct-spelling?query=iphon
```
- **Expected**: Corrected to "iphone"

### 4. Delivery Check
```bash
curl http://localhost:5000/api/search/delivery-check?pincode=110001
```
- **Expected**: Delivery availability returned

---

## 🔗 API Endpoint Testing

### Using Postman or cURL:

#### 1. Test Authentication
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "9876543210",
    "password": "Test123456"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456"
  }'
```

#### 2. Get Products
```bash
curl http://localhost:5000/api/products
curl http://localhost:5000/api/products/bestsellers
curl http://localhost:5000/api/products/deals
```

#### 3. Create Order (with token)
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "shippingAddress": "123 Main St",
    "billingAddress": "123 Main St",
    "paymentMethod": "card"
  }'
```

---

## 📊 Performance Testing

### 1. Page Load Time
- Use browser DevTools (F12)
- Check Network tab
- Expected: < 3 seconds for homepage

### 2. API Response Time
- Monitor Network tab for API calls
- Expected: < 500ms for most endpoints

### 3. Image Loading
- Check if images load without delay
- Expected: Optimized images < 200KB

---

## 🐛 Bug Testing

### Common Issues to Check:

1. **Form Validation**
   - Try submitting empty forms
   - Try invalid email formats
   - Try weak passwords

2. **Error Handling**
   - Try non-existent product ID
   - Try without authentication token
   - Check error messages display

3. **State Management**
   - Refresh page during checkout
   - Check cart persists
   - Check authentication persists

4. **Responsive Design**
   - Test on different screen sizes
   - Check mobile navigation
   - Verify layout on tablets

---

## ✅ Testing Checklist

### Frontend
- [ ] Registration works
- [ ] Login works
- [ ] Products display
- [ ] Search works
- [ ] Filters work
- [ ] Add to cart works
- [ ] Checkout works
- [ ] Orders display
- [ ] Profile works
- [ ] Responsive design works

### Backend
- [ ] Register endpoint works
- [ ] Login endpoint works
- [ ] Get products works
- [ ] Search endpoint works
- [ ] Cart endpoints work
- [ ] Order creation works
- [ ] Authentication middleware works
- [ ] Error handling works
- [ ] Database saves data
- [ ] API returns correct format

---

## 🚀 Integration Testing

Once basic features work, test integrations:

1. **Payment Gateway** (when integrated)
   - Test card payment flow
   - Test payment verification

2. **Email Service** (when integrated)
   - Verify order confirmation email
   - Verify password reset email

3. **SMS Service** (when integrated)
   - Test OTP delivery
   - Test order notifications

4. **File Storage** (when integrated)
   - Test image upload
   - Test video upload

---

## 📋 Test Results Template

```
Date: ____
Tester: ____
Environment: Local/Staging/Production

Feature: _____
Status: ✅ Pass / ❌ Fail
Notes: _____

Feature: _____
Status: ✅ Pass / ❌ Fail
Notes: _____
```

---

## 🔧 Debugging Tips

1. **Check Browser Console** (F12)
   - Look for JS errors
   - Check network errors

2. **Check Network Tab**
   - Monitor API calls
   - Check response status
   - Verify request headers

3. **Check Backend Logs**
   - Watch terminal for errors
   - Monitor database queries
   - Check middleware logs

4. **Use Redux DevTools**
   - Monitor state changes
   - Check action dispatch
   - Verify reducer updates

---

## 📝 Common Test Cases

### Registration
- ✅ Valid email and password
- ✅ Duplicate email
- ✅ Invalid email format
- ✅ Weak password
- ✅ Missing required fields

### Product Browsing
- ✅ Load products
- ✅ Filter by category
- ✅ Filter by price
- ✅ Sort by rating
- ✅ Search products

### Shopping
- ✅ Add single item
- ✅ Add multiple items
- ✅ Update quantity
- ✅ Remove item
- ✅ Clear cart

### Checkout
- ✅ Enter address
- ✅ Select payment method
- ✅ Place order
- ✅ View confirmation

---

## 🎯 Success Criteria

✅ All authentication flows work
✅ All CRUD operations work
✅ No console errors
✅ All API endpoints respond
✅ Data persists in database
✅ Responsive design works
✅ Performance acceptable
✅ User experience smooth

---

**Happy Testing! 🚀**
