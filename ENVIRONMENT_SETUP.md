# Environment Variables Setup

## Overview
MomPulse uses environment variables to securely store Firebase configuration and API keys.

## Setup Instructions

### 1. Create `.env` file
Copy the example file and add your credentials:

```bash
cp .env.local.example .env
```

### 2. Required Environment Variables

Your `.env` file should contain:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id_here

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### 3. Current Configuration

✅ Your `.env` file is already configured with:
- Firebase API credentials
- Google OAuth Client ID
- All necessary environment variables

### 4. Security Notes

⚠️ **Important**:
- `.env` file is in `.gitignore` and will NOT be committed to Git
- Never share your `.env` file publicly
- Use `.env.local.example` as a template for team members
- For production deployment, set environment variables in your hosting platform

### 5. Deployment

When deploying to production (Vercel, Netlify, etc.):

1. Go to your hosting platform's environment variables settings
2. Add all `NEXT_PUBLIC_*` variables from your `.env` file
3. Save and redeploy

#### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel Dashboard:
# Project Settings → Environment Variables
```

#### Netlify Deployment
```bash
# Add environment variables in Netlify Dashboard:
# Site Settings → Build & Deploy → Environment
```

### 6. Verify Setup

To verify your environment variables are loaded correctly:

```typescript
// In any component
console.log('Firebase configured:', !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
```

### 7. Troubleshooting

**Problem**: Firebase not initializing
- **Solution**: Make sure all `NEXT_PUBLIC_*` variables are set in `.env`
- Restart your development server after changing `.env`

**Problem**: Google Sign-In not working
- **Solution**: Verify `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is correct
- Check Firebase Console → Authentication → Sign-in method → Google is enabled

**Problem**: Environment variables undefined
- **Solution**: Environment variables must start with `NEXT_PUBLIC_` to be accessible in the browser
- Restart dev server: `npm run dev`

## Development Workflow

```bash
# 1. Install dependencies
npm install

# 2. Create .env file (if not exists)
cp .env.local.example .env

# 3. Add your Firebase credentials to .env

# 4. Start development server
npm run dev

# 5. Open http://localhost:3000
```

## Team Setup

When a new team member joins:

1. Share `.env.local.example` (already in repo)
2. They create their own `.env` file
3. Provide them with the Firebase credentials (securely)
4. They run `npm install` and `npm run dev`

## Status

✅ Environment variables configured
✅ Firebase using environment variables
✅ `.env` file in `.gitignore`
✅ `.env.local.example` template available
✅ Ready for development and deployment
