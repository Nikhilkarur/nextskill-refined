# 🚂 Railway Deployment Guide - NextSkill

## Quick Deploy Steps

### 1. Go to Railway
- Visit: [railway.app](https://railway.app)
- Click **"Login"** → **"Sign in with GitHub"**

### 2. Create New Project  
- Click **"Start a New Project"**
- Choose **"Deploy from GitHub repo"** 
- Select your **"nextskill-refined"** repository

### 3. Railway Auto-Configuration
- Railway will detect `railway.json` automatically
- All environment variables already configured:
  ✅ Neon PostgreSQL connection
  ✅ CORS settings for Netlify
  ✅ JWT secret
  ✅ Production profile

### 4. Build Process
- Build time: ~2-3 minutes
- Railway runs: `./mvnw clean package -DskipTests`
- Starts with: `java -jar target/backend-0.0.1-SNAPSHOT.jar`

### 5. Get Your URL
- After deployment, you'll get a URL like:
  `https://nextskill-backend-production-xxxx.up.railway.app`
- Copy this URL for the next step

### 6. Update Netlify Proxy (After Railway Deploy)
Update `netlify.toml` with your actual Railway URL:
```toml
from = "/api/*"
to = "https://your-actual-railway-url.up.railway.app/api/:splat"
```

## Free Tier Limits
- ✅ **500 hours/month** (16+ hours/day)
- ✅ **No sleeping** - stays awake 24/7
- ✅ **1GB RAM, 1 vCPU**
- ✅ **Auto SSL certificates**

## What Gets Deployed
```
Your Railway App:
├── Spring Boot backend
├── Connected to Neon PostgreSQL
├── JWT authentication
├── Resume processing API
├── Learning path generation
└── CORS configured for Netlify
```

## Testing After Deploy
1. Visit your Railway URL directly → Should see "Whitelabel Error Page"
2. Visit your Netlify site → Should work normally
3. Test authentication flow
4. Try resume upload and learning path generation

## Troubleshooting
- **Build fails:** Check Railway logs for Maven errors
- **App crashes:** Check environment variables are set
- **CORS errors:** Verify Netlify proxy URL is correct
- **Database errors:** Verify Neon connection string

---

**You're all set! Railway deployment is the easiest! 🎉**