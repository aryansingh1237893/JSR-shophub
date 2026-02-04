# 🚀 ShopHub Deployment Guide

## ✅ Pre-Deployment Checklist

- [x] Backend API (Express.js) fully implemented
- [x] Frontend (React 18) fully implemented
- [x] 50+ API endpoints working
- [x] 9 pages with complete functionality
- [x] Database models configured (8 collections)
- [x] All dependencies installed
- [x] Code pushed to GitHub

---

## 📋 Step-by-Step Deployment

### **Option 1: Deploy to Vercel (Recommended - Fastest)**

#### Frontend Deployment

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy Frontend**
```bash
cd frontend
vercel
```

4. **Configure Environment Variables in Vercel Dashboard**
   - Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your project
   - Go to **Settings → Environment Variables**
   - Add:
     ```
     REACT_APP_API_URL=https://your-backend-url.com/api
     ```

#### Backend Deployment (Heroku or Railway)

**Option 1A: Deploy Backend to Heroku**

1. **Install Heroku CLI**
```bash
curl https://cli-assets.heroku.com/install.sh | sh
```

2. **Login to Heroku**
```bash
heroku login
```

3. **Create Heroku App**
```bash
cd backend
heroku create your-shophub-api
```

4. **Set Environment Variables on Heroku**
```bash
heroku config:set -a your-shophub-api \
  MONGODB_URI="your_mongodb_atlas_uri" \
  JWT_SECRET="your_jwt_secret" \
  STRIPE_PUBLIC_KEY="your_stripe_public_key" \
  STRIPE_SECRET_KEY="your_stripe_secret_key" \
  NODE_ENV="production" \
  PORT=5000
```

5. **Add Procfile** (already exists in backend/)
```
web: node src/index.js
```

6. **Deploy to Heroku**
```bash
git push heroku main
```

**Option 1B: Deploy Backend to Railway.app**

1. **Go to** [https://railway.app](https://railway.app)
2. **Connect GitHub Repository**
3. **Add Environment Variables**
4. **Deploy** (automatic on push)

---

### **Option 2: Deploy on AWS**

#### Using AWS Elastic Beanstalk

1. **Install AWS CLI**
```bash
pip install awsebcli --upgrade --user
```

2. **Initialize Elastic Beanstalk**
```bash
cd backend
eb init -p node.js-18 shophub-api --region us-east-1
eb create shophub-api-env
```

3. **Set Environment Variables**
```bash
eb setenv MONGODB_URI="your_mongodb_uri" JWT_SECRET="your_secret"
```

4. **Deploy**
```bash
eb deploy
```

---

### **Option 3: Docker + Kubernetes (Advanced)**

#### Create Docker Image for Backend

1. **Create Dockerfile** (in backend/)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

2. **Build Docker Image**
```bash
docker build -t shophub-api:1.0.0 .
```

3. **Push to Docker Hub**
```bash
docker login
docker push yourusername/shophub-api:1.0.0
```

4. **Deploy to Kubernetes** (if using K8s)
```bash
kubectl apply -f deployment.yaml
```

---

## 🔧 Environment Variables Setup

### Backend `.env` Template

Create `backend/.env` with these values:

```env
# Server Config
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shophub

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here-min-32-chars
JWT_EXPIRE=7d

# Payment Gateway (Stripe)
STRIPE_PUBLIC_KEY=pk_live_xxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Email Service (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@shophub.com

# SMS Service (Twilio)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Search Engine (Elasticsearch)
ELASTICSEARCH_HOST=https://your-elasticsearch-domain
ELASTICSEARCH_USER=elastic
ELASTICSEARCH_PASSWORD=your-password

# Cache (Redis)
REDIS_URL=redis://username:password@hostname:port

# Cloud Storage (Cloudinary)
CLOUDINARY_NAME=your-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# CORS Origins (comma-separated)
CORS_ORIGINS=https://your-frontend-url.com,http://localhost:3000

# Session
SESSION_SECRET=your-session-secret-key
```

### Frontend `.env` Template

Create `frontend/.env.local` with:

```env
REACT_APP_API_URL=https://your-backend-api.com/api
REACT_APP_STRIPE_PUBLIC_KEY=pk_live_xxxxxxxxxxxxx
REACT_APP_GOOGLE_MAPS_KEY=your-google-maps-api-key
REACT_APP_ENVIRONMENT=production
```

---

## 📦 Required External Services

### 1. **MongoDB Atlas** (Database)
- [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Create cluster, get connection URI
- Add to `.env` as `MONGODB_URI`

### 2. **Stripe** (Payments)
- [https://stripe.com](https://stripe.com)
- Create account, get API keys
- Add `STRIPE_PUBLIC_KEY` and `STRIPE_SECRET_KEY`

### 3. **Twilio** (SMS)
- [https://www.twilio.com](https://www.twilio.com)
- Get Account SID, Auth Token, Phone Number
- Add to `.env`

### 4. **Nodemailer** (Email)
- Gmail: Enable 2FA, generate [App Password](https://myaccount.google.com/apppasswords)
- Or use SendGrid/AWS SES

### 5. **Elasticsearch** (Search)
- Self-hosted or [Elastic Cloud](https://cloud.elastic.co)
- Optional but recommended for advanced search

### 6. **Redis** (Caching)
- [Redis Cloud](https://redis.com/try-free/) - Free tier available
- Optional but improves performance

### 7. **Cloudinary** (Image/Video Storage)
- [https://cloudinary.com](https://cloudinary.com)
- Get API credentials for media uploads

---

## 🔐 Security Checklist

Before deploying to production:

- [ ] Change all default API keys and secrets
- [ ] Enable HTTPS/SSL certificates
- [ ] Set `NODE_ENV=production`
- [ ] Enable CORS with specific origins only
- [ ] Use strong `JWT_SECRET` (min 32 characters)
- [ ] Enable rate limiting on API endpoints
- [ ] Set secure cookies (httpOnly, secure, sameSite)
- [ ] Add firewall rules to database
- [ ] Enable MongoDB IP whitelist
- [ ] Use environment variables (never hardcode secrets)
- [ ] Enable authentication on all protected routes
- [ ] Add request validation on all endpoints
- [ ] Monitor API logs and errors
- [ ] Regular security audits

---

## 📊 Monitoring & Logging

### Vercel Frontend Monitoring
- Dashboard: [https://vercel.com/dashboard](https://vercel.com/dashboard)
- Logs: Deployments → Logs tab

### Heroku Backend Monitoring
```bash
# View logs
heroku logs -a your-shophub-api --tail

# Monitor dyno
heroku ps -a your-shophub-api
```

### MongoDB Monitoring
- Atlas Dashboard: [https://cloud.mongodb.com](https://cloud.mongodb.com)
- Monitor: Performance, replication, backups

### Error Tracking (Optional)
- [Sentry.io](https://sentry.io) - Error tracking
- [LogRocket](https://logrocket.com) - Frontend monitoring
- [NewRelic](https://newrelic.com) - APM

---

## 📈 Performance Optimization

### Frontend Optimization
- [ ] Enable gzip compression
- [ ] Minify CSS/JS (done by build)
- [ ] Optimize images (use Cloudinary)
- [ ] Lazy load pages with React.lazy()
- [ ] Enable service worker for caching
- [ ] Use CDN for static assets

### Backend Optimization
- [ ] Enable Redis caching
- [ ] Add database indexes
- [ ] Implement pagination
- [ ] Use connection pooling
- [ ] Enable gzip compression
- [ ] Implement rate limiting

---

## 🚨 Troubleshooting

### Frontend Not Loading
```bash
# Check build errors
npm run build

# Clear cache and rebuild
rm -rf build node_modules
npm install
npm run build
```

### Backend Connection Issues
```bash
# Test MongoDB connection
node -e "require('./backend/src/config/database.js')"

# Check environment variables
heroku config -a your-app-name
```

### CORS Errors
- Add your frontend URL to `CORS_ORIGINS` in backend `.env`
- Verify `Access-Control-Allow-Origin` headers

### Payment Gateway Errors
- Verify Stripe API keys are correct
- Check test vs. live keys
- Review Stripe Dashboard for error logs

---

## 🎯 Deployment URLs

Once deployed, update your links:

- **Frontend URL**: `https://your-frontend.vercel.app`
- **Backend API**: `https://your-backend-api.heroku.com/api`
- **MongoDB**: `mongodb+srv://...` (from Atlas)
- **Admin Panel**: `https://your-frontend.vercel.app/admin`

---

## 🔄 CI/CD Pipeline (Optional)

### GitHub Actions for Automatic Deployment

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy ShopHub

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: vercel --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

---

## 📞 Support & Debugging

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Build fails on Vercel | Check Node version, ensure `package.json` is valid |
| Backend not starting | Verify `.env` variables, check logs with `heroku logs` |
| Database connection error | Verify MongoDB URI, check IP whitelist in Atlas |
| Payment integration error | Check API keys, verify test vs. live mode |
| CORS error | Add frontend URL to backend `CORS_ORIGINS` |
| Image upload fails | Verify Cloudinary credentials, check file size limits |

---

## ✅ Final Verification

After deployment, test:

```bash
# Test Backend API
curl https://your-backend-api.com/api/health

# Test Frontend
Open https://your-frontend.vercel.app

# Test Payments (Stripe)
Use test card: 4242 4242 4242 4242

# Test User Auth
Try login/register on frontend

# Monitor
Check Vercel & Heroku dashboards for errors
```

---

## 🎉 Deployment Complete!

Your ShopHub e-commerce platform is now **LIVE** and ready for users! 🚀

**Next Steps:**
1. Monitor performance and user feedback
2. Set up analytics (Google Analytics)
3. Implement user support systems
4. Plan feature updates
5. Optimize based on usage patterns

---

**Happy deploying!** 🎊
