# JSR ShopHub - Complete E-Commerce Platform

ShopHub is a full-stack e-commerce application built with modern technologies, featuring a comprehensive set of features for both users and administrators.

## 🚀 Features

### Frontend Features (User Side)
- **Product Discovery**: Home page with carousels, categories, best sellers, deals of the day
- **Advanced Search**: Full-text search, live suggestions, spelling correction, voice search support
- **Product Details**: Image gallery with zoom, video demos, specifications, reviews, Q&A
- **Shopping**: Add to cart, buy now, wishlist, quantity management with auto price updates
- **Authentication**: Email/phone login, OTP verification, forgot password, 2FA
- **User Account**: Profile management, address book, payment methods, wishlist
- **Orders**: Order history, tracking (shipped → out for delivery → delivered), returns, refunds
- **Payments**: Multiple options (cards, UPI, wallet, EMI, cash on delivery)
- **Reviews & Ratings**: 5-star rating system, photo/video uploads, helpful votes
- **Support**: Customer support chatbot, live agent chat, call request
- **Notifications**: Push notifications, price drop alerts, order updates
- **Prime Membership**: Membership management and settings

### Backend Features (Technical Side)
- **Authentication**: JWT, OAuth, session management, 2FA
- **Product Management**: Add, edit, delete products with stock management
- **Search & Indexing**: Elasticsearch integration, auto-correction, ranking algorithm
- **Cart & Orders**: User-based cart, order creation, automatic status updates
- **Payments**: Stripe integration, payment verification, refund system
- **Inventory**: Real-time stock updates, warehouse location matching, low-stock alerts
- **Notifications**: Email, SMS (Twilio), push notifications
- **Reviews**: Review moderation, fake review detection, media storage
- **Admin Dashboard**: User management, product management, analytics, sales reports
- **Courier Integration**: Automatic tracking updates, delivery date calculation

## 📁 Project Structure

```
JSR-shophub/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── models/         # MongoDB schemas
│   │   ├── controllers/    # Business logic
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Auth, validation
│   │   ├── config/         # Configuration
│   │   └── utils/          # Utilities
│   ├── package.json
│   └── .env
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── store/          # Redux store
│   │   ├── styles/         # CSS files
│   │   └── hooks/          # Custom hooks
│   ├── public/
│   └── package.json
└── README.md
```

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT, bcryptjs
- **Payments**: Stripe
- **Search**: Elasticsearch
- **Cache**: Redis
- **File Storage**: Cloudinary
- **SMS**: Twilio
- **Email**: Nodemailer

### Frontend
- **Library**: React 18
- **State Management**: Redux
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Form Validation**: Formik & Yup
- **HTTP Client**: Axios
- **UI Components**: React Icons

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configurations
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend will run on `http://localhost:3000` and backend on `http://localhost:5000`

## 📝 API Documentation

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/login-otp` - Login with OTP
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/forgot-password` - Request password reset

### Products
- `GET /api/products` - Get all products with pagination
- `GET /api/products/:id` - Get product details
- `GET /api/products/bestsellers` - Get best sellers
- `GET /api/products/deals` - Get deals of the day
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Search
- `GET /api/search/products?query=` - Full-text search
- `GET /api/search/suggestions?query=` - Search suggestions
- `GET /api/search/correct-spelling?query=` - Spelling correction
- `GET /api/search/delivery-check?pincode=` - Check delivery availability

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove` - Remove from cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/cancel` - Cancel order
- `POST /api/orders/:id/return` - Request return

### Payments
- `POST /api/payments/initiate` - Initiate payment
- `POST /api/payments/verify` - Verify payment
- `POST /api/payments/card` - Process card payment
- `POST /api/payments/upi` - Process UPI payment

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/product/:productId` - Get product reviews
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

## 🔐 Security Features

- JWT-based authentication with expiration
- Password hashing with bcryptjs
- CORS protection
- Helmet.js for security headers
- Rate limiting
- Input validation with Yup
- SQL injection prevention via MongoDB

## 📊 Database Schema

### User
- Personal information (name, email, phone)
- Password (hashed)
- Addresses
- Payment methods
- Wishlist
- Prime membership status

### Product
- Title, description, price
- Images and video
- Specifications
- Stock and warehouse info
- Rating and reviews
- Category and tags

### Order
- User reference
- Items list
- Shipping/billing address
- Payment method and status
- Order status tracking
- Return information

### Review
- Product and user reference
- Rating (1-5 stars)
- Title and comment
- Images/videos
- Moderation status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License

## 👨‍💻 Developer

Created with ❤️ by the JSR ShopHub team