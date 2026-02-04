# Quick Start Guide

## Installation & Setup

### Step 1: Clone and Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Environment Configuration

Create `.env` file in the backend folder:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/shophub
JWT_SECRET=your_secret_key_here
STRIPE_PUBLIC_KEY=your_key
STRIPE_SECRET_KEY=your_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_password
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
FRONTEND_URL=http://localhost:3000
```

### Step 3: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

## Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Build for Production

```bash
# Build backend
cd backend
npm run build

# Build frontend
cd frontend
npm run build
```

## Key Features Implemented

✅ Complete user authentication system
✅ Full product catalog with search
✅ Shopping cart functionality
✅ Order management system
✅ Review and rating system
✅ Multiple payment options
✅ Admin dashboard (routes ready)
✅ Responsive design
✅ Advanced search with spelling correction
✅ Notification system ready

## API Endpoints Summary

### Auth
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/login-otp
- POST /api/auth/verify-otp

### Products
- GET /api/products
- GET /api/products/:id
- GET /api/products/bestsellers
- GET /api/products/deals

### Cart
- GET /api/cart
- POST /api/cart/add
- PUT /api/cart/update
- DELETE /api/cart/remove

### Orders
- POST /api/orders
- GET /api/orders
- GET /api/orders/:id
- PUT /api/orders/:id/cancel

### Reviews
- POST /api/reviews
- GET /api/reviews/product/:productId
- PUT /api/reviews/:id
- DELETE /api/reviews/:id

### Search
- GET /api/search/products
- GET /api/search/suggestions
- GET /api/search/correct-spelling
- GET /api/search/delivery-check

## Folder Structure

```
backend/
├── src/
│   ├── models/        - MongoDB schemas (User, Product, Order, etc)
│   ├── controllers/   - Business logic handlers
│   ├── routes/        - API endpoint definitions
│   ├── middleware/    - Auth & error handling
│   ├── config/        - Database configuration
│   ├── utils/         - Helper functions
│   └── index.js       - Express app entry point
├── package.json
└── .env

frontend/
├── src/
│   ├── components/    - Reusable UI components
│   ├── pages/         - Page components (Home, Product, Cart, etc)
│   ├── services/      - API integration
│   ├── store/         - Redux store & actions
│   ├── styles/        - CSS stylesheets
│   ├── hooks/         - Custom React hooks
│   ├── App.js         - Main app component
│   └── index.js       - React DOM entry point
├── public/
│   └── index.html
└── package.json
```

## Development Tips

1. **Backend**: Uses MongoDB for data storage. Ensure MongoDB is running locally or configure a cloud database URI.

2. **Frontend**: Uses Redux for state management. All cart and auth state is managed globally.

3. **Authentication**: JWT tokens are stored in localStorage. Protected routes require authentication.

4. **Styling**: Uses CSS modules and plain CSS. Tailwind CSS is configured for utility classes.

5. **API Base URL**: Frontend API calls default to `http://localhost:5000/api`. Modify in `frontend/src/services/api.js` if needed.

## Next Steps to Complete

- [ ] Implement payment gateway (Stripe) integration
- [ ] Setup email notifications (Nodemailer)
- [ ] Configure SMS service (Twilio)
- [ ] Deploy to production (Heroku, AWS, etc)
- [ ] Add unit tests for critical functions
- [ ] Setup CI/CD pipeline
- [ ] Configure Redis for caching
- [ ] Implement Elasticsearch for advanced search
- [ ] Add image optimization with Cloudinary
- [ ] Setup admin dashboard fully

## Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB service is running: `mongod`
- Check MONGODB_URI in .env file

**Port Already in Use:**
- Backend: Change PORT in .env file
- Frontend: REACT_APP_PORT environment variable

**CORS Errors:**
- Check FRONTEND_URL in backend .env
- Verify CORS middleware is enabled

**Token Expiry Issues:**
- Clear localStorage and login again
- Check JWT_SECRET matches between registration and login

## Support

For issues or questions, please create an issue in the repository.
