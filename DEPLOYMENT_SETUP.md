# ShopHub Deployment & Production Setup Guide

Complete step-by-step guide to deploy ShopHub to production.

## Prerequisites

- GitHub account with repo access
- Vercel account (for frontend)
- Railway/Heroku/Render account (for backend)
- MongoDB Atlas account (for database)
- Stripe account (for payments)
- Cloudinary account (for media storage)
- Twilio account (for SMS)
- Email provider credentials (Gmail, SendGrid, etc.)

---

## Step 1: Prepare Environment Variables

### 1.1 Get Your API Keys

**MongoDB Atlas:**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster if not exists
3. Create database user with username & strong password
4. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/shophub?retryWrites=true&w=majority`

**Stripe:**
1. Go to https://dashboard.stripe.com
2. Switch to "Test mode" (left sidebar)
3. Find API Keys section
4. Copy Publishable Key (pk_test_...) and Secret Key (sk_test_...)
5. Create webhook endpoint → Copy webhook secret (whsec_...)

**Cloudinary:**
1. Go to https://cloudinary.com
2. Sign up free
3. Dashboard → Copy Cloud Name, API Key, API Secret

**Twilio:**
1. Go to https://www.twilio.com/console
2. Copy Account SID, Auth Token, Phone Number

**Email Provider (choose one):**
- Gmail: Enable 2FA, create App Password
- SendGrid: Create API key
- Ethereal (test-only): https://ethereal.email (generate test credentials)

---

## Step 2: Deploy to Vercel (Frontend)

### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend directory
cd frontend

# Deploy
vercel --prod
```

### Option B: Using GitHub Integration (Recommended)

1. Go to https://vercel.com/import
2. Select "JSR-shophub" repo
3. Set Project Name: `shophub-frontend`
4. Set Framework: React
5. Under Environment Variables, add:
   - `REACT_APP_API_URL`: `https://shophub-api.railway.app/api` (or your backend URL)
   - `REACT_APP_STRIPE_PUBLIC_KEY`: Your Stripe test publishable key
6. Click Deploy

**Vercel will now auto-deploy on every `main` branch push.**

---

## Step 3: Deploy to Railway (Backend)

### Option A: Using Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
cd backend
railway init

# Set environment variables
railway variable set MONGODB_URI "your-atlas-uri"
railway variable set JWT_SECRET "your-strong-secret"
railway variable set NODE_ENV "production"
railway variable set PORT "5000"
# ... add all other env vars (Stripe, Email, Twilio, Cloudinary)

# Deploy
railway up
```

### Option B: Using Railway UI (Recommended)

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select `JSR-shophub` repo
4. Select `backend` directory
5. Add Service: MongoDB (Railway's free tier)
6. Configure environment variables in Railway dashboard:
   ```
   MONGODB_URI: (auto-filled if using Railway MongoDB)
   JWT_SECRET: your-strong-random-secret
   NODE_ENV: production
   PORT: 5000
   STRIPE_SECRET_KEY: sk_live_...
   STRIPE_PUBLIC_KEY: pk_live_...
   STRIPE_WEBHOOK_SECRET: whsec_...
   EMAIL_HOST: smtp.gmail.com (or your provider)
   EMAIL_PORT: 587
   EMAIL_USER: your-email@gmail.com
   EMAIL_PASSWORD: your-app-password
   TWILIO_ACCOUNT_SID: AC...
   TWILIO_AUTH_TOKEN: ...
   TWILIO_PHONE_NUMBER: +1...
   CLOUDINARY_CLOUD_NAME: ...
   CLOUDINARY_API_KEY: ...
   CLOUDINARY_API_SECRET: ...
   REDIS_URL: redis://... (if using Railway Redis)
   ```
7. Click "Deploy"

**Railway will auto-deploy when you push to `main`.**

Your backend URL will be something like: `https://shophub-api.railway.app`

---

## Step 4: Configure Stripe Webhook (Important!)

1. In Stripe Dashboard → Webhooks
2. Add Endpoint:
   - URL: `https://your-backend-url.railway.app/api/payments/webhook`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
3. Copy the webhook secret (whsec_...)
4. Add to your backend environment: `STRIPE_WEBHOOK_SECRET=whsec_...`

---

## Step 5: Setup GitHub Secrets (for CI/CD)

1. Go to GitHub Repo → Settings → Secrets and variables → Actions
2. Add these secrets:
   - `VERCEL_TOKEN`: Get from Vercel account settings
   - `VERCEL_PROJECT_ID`: Found in Vercel dashboard under project settings
   - `VERCEL_ORG_ID`: Your Vercel organization ID
   - `RAILWAY_TOKEN`: Get from Railway account settings
   - `STRIPE_SECRET_KEY`: Your test/live Stripe secret
   - `REACT_APP_STRIPE_PUBLIC_KEY`: Your test/live Stripe publishable key
   - `REACT_APP_API_URL_TEST`: `http://localhost:5000/api` (or production backend URL)

GitHub Actions will now auto-test and deploy on every push to `main`.

---

## Step 6: Test Locally First (Recommended)

Before deploying, test locally with Docker:

```bash
# Go to repo root
cd /path/to/JSR-shophub

# Copy test env file
cp backend/.env.test backend/.env
cp frontend/.env.test frontend/.env.local

# Update .env files with your actual keys

# Run docker-compose
docker-compose up -d --build

# Check logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Access:
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# MongoDB: localhost:27017

# Test Stripe webhook locally
stripe listen --forward-to localhost:5000/api/payments/webhook
```

---

## Step 7: Production Checklist

- [ ] All environment variables set in Railway dashboard
- [ ] Stripe webhook registered and secret configured
- [ ] MongoDB Atlas backup enabled
- [ ] CORS configured to your frontend domain
- [ ] SSL/HTTPS enabled (auto with Vercel & Railway)
- [ ] JWT_SECRET is strong & random (32+ characters)
- [ ] Test authentication flow (login/signup/OTP)
- [ ] Test payment flow with Stripe test cards:
  - Success: `4242 4242 4242 4242` (any expiry, any CVC)
  - Decline: `4000 0000 0000 0002` (any expiry, any CVC)
- [ ] Test email notifications (check your email account)
- [ ] Test SMS notifications (check your phone)
- [ ] Test image uploads (Cloudinary or local)
- [ ] Test order creation and status updates
- [ ] Monitor logs in Railway dashboard
- [ ] Set up error monitoring (optional: Sentry, LogRocket)

---

## Step 8: Switch to Live Keys (When Ready)

When app is stable and tested:

1. Get Stripe LIVE keys from Stripe Dashboard (switch from Test mode)
2. Update Railway environment:
   - `STRIPE_SECRET_KEY`: `sk_live_...`
   - `STRIPE_PUBLIC_KEY`: `pk_live_...`
   - `STRIPE_WEBHOOK_SECRET`: Live webhook secret (re-register webhook)
3. Vercel frontend will auto-update on next deploy
4. Test with small real payment (if required)

---

## Step 9: Monitoring & Maintenance

### Check Backend Logs:
```bash
railway logs
```

### Check Deployed App:
- Frontend: `https://shophub.vercel.app` (or your domain)
- Backend API: `https://shophub-api.railway.app/` (or your domain)
- Health Check: `https://shophub-api.railway.app/api/health`

### Restart Services:
```bash
# Railway
railway service restart

# Vercel (auto on push)
```

### View Metrics:
- Railway Dashboard: Memory, CPU, Requests
- Vercel Dashboard: Deployments, Analytics, Edge Function usage

---

## Troubleshooting

### "Cannot find module" errors on deploy
- Run `npm install` before push
- Ensure `node_modules/` is in `.gitignore`

### Stripe webhook not working
- Verify webhook secret is set correctly
- Check Railway logs for webhook requests
- Re-register webhook in Stripe dashboard

### Build fails on Vercel
- Check build logs in Vercel dashboard
- Ensure `REACT_APP_*` env vars are set
- Clear cache & redeploy: Vercel Dashboard → Settings → Clear cache

### Database connection fails
- Verify `MONGODB_URI` is correct and accessible from Railway IP
- Check MongoDB Atlas network access: whitelist `0.0.0.0/0` (or add Railway IP)
- Test connection locally first

### Payment flow hangs
- Check if `STRIPE_SECRET_KEY` is correct
- Verify backend is receiving requests (check logs)
- Test with Stripe test keys first

---

## Optional Enhancements

### 1. Add Domain Names
- Vercel: Add domain in Project Settings
- Railway: Custom domain in TCP/HTTP settings

### 2. Setup Email Monitoring
- Add `EMAIL_LOGGING=true` in backend .env
- Store logs in database or external service

### 3. Enable Search with Elasticsearch
- Deploy Elasticsearch on Railway or AWS
- Set `ELASTICSEARCH_URL` in backend .env
- Rebuild product index: `POST /api/admin/reindex-search`

### 4. Redis Caching
- Deploy Redis on Railway
- Set `REDIS_URL` in backend .env
- Features auto-enabled: product caching, session management

### 5. Monitoring & Alerts
- Sentry: Automatic error tracking
- LogRocket: Session replay & errors
- Railway Alerts: Set thresholds for CPU/Memory

---

## Support & Next Steps

- Frontend live: Check Vercel logs if issues
- Backend live: Check Railway logs if issues
- Payment issues: Check Stripe Dashboard webhooks & logs
- Database issues: Check MongoDB Atlas logs

For more details, see `DEPLOYMENT_GUIDE.md` and `PRODUCTION_CHECKLIST.md`.

**Happy shipping! 🚀**
