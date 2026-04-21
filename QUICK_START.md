# MomPulse - Quick Start Guide

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Your `.env` file is already configured with Firebase credentials.

### 3. Deploy Firestore Rules

**Option A: Firebase Console (Easiest)**
1. Go to https://console.firebase.google.com
2. Select project: `mompulse-5ceb8`
3. Navigate to: Firestore Database → Rules
4. Copy content from `firestore.rules` file
5. Paste into console and click "Publish"

**Option B: Firebase CLI**
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize (first time only)
firebase init firestore

# Deploy rules
firebase deploy --only firestore:rules
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Open in Browser
```
http://localhost:3000
```

## 📋 User Flow

### New User Journey
1. **Landing Page** (`/`) → Click "Sign Up"
2. **Sign Up** (`/signup`) → Create account or use Google Sign-In
3. **Onboarding** (`/onboarding`) → Select stage and enter age
4. **Dashboard** (`/dashboard`) → View personalized dashboard

### Returning User Journey
1. **Landing Page** (`/`) → Click "Login"
2. **Login** (`/login`) → Sign in with email/password or Google
3. **Dashboard** (`/dashboard`) → Continue journey

## 🔑 Key Features

### Authentication
- ✅ Email/Password signup and login
- ✅ Google Sign-In (OAuth)
- ✅ Protected routes
- ✅ Persistent sessions

### Onboarding
- ✅ 4 stage options:
  - Planning Pregnancy 🌱
  - Postpartum Care 👶
  - Pregnancy Tracker 🤰
  - Period Tracker 📅
- ✅ Optional age input
- ✅ Data saved to Firestore

### Dashboard
- ✅ Displays user's selected stage
- ✅ Shows age (if provided)
- ✅ Logout functionality
- ✅ Personalized greeting

## 📁 Project Structure

```
mompulse/
├── app/
│   ├── page.tsx              # Landing page
│   ├── login/page.tsx        # Login page
│   ├── signup/page.tsx       # Signup page
│   ├── onboarding/page.tsx   # Onboarding flow
│   └── dashboard/page.tsx    # User dashboard
├── components/               # Reusable components
├── contexts/
│   └── AuthContext.tsx       # Authentication context
├── lib/
│   ├── firebase.ts           # Firebase config
│   └── firestore.ts          # Firestore functions
├── firestore.rules           # Security rules
└── .env                      # Environment variables
```

## 🔒 Firestore Security

### Rules Overview
- Users can only read/write their own data
- Authentication required for all operations
- Subcollections for profile, onboarding, tracking

### Data Saved on Onboarding
```typescript
{
  currentStage: 'planning' | 'postpartum' | 'pregnancy' | 'period',
  age: number (optional),
  completedAt: Timestamp
}
```

## 🧪 Testing

### Test Authentication
1. Go to `/signup`
2. Create account with email/password
3. Verify redirect to onboarding
4. Check Firebase Console → Authentication

### Test Google Sign-In
1. Click "Google" button on login/signup
2. Select Google account
3. Verify redirect to onboarding/dashboard

### Test Onboarding
1. Select a stage (e.g., "Pregnancy Tracker")
2. Enter age (optional)
3. Click "Continue"
4. Verify redirect to dashboard
5. Check Firebase Console → Firestore Database

### Test Dashboard
1. Verify selected stage is displayed
2. Verify age is shown (if provided)
3. Test logout button
4. Verify redirect to home page

## 🐛 Troubleshooting

### Firebase Not Initializing
- Check `.env` file exists and has all variables
- Restart dev server: `npm run dev`
- Verify environment variables start with `NEXT_PUBLIC_`

### Google Sign-In Not Working
- Check Firebase Console → Authentication → Sign-in method
- Verify Google is enabled
- Check authorized domains include `localhost`

### Permission Denied Errors
- Deploy Firestore rules (see step 3 above)
- Verify user is authenticated
- Check browser console for detailed errors

### Data Not Saving
- Check Firestore rules are deployed
- Verify user is authenticated
- Check browser console for errors
- Verify Firebase project ID matches

## 📊 Firebase Console Checks

### Authentication
- Go to: Authentication → Users
- Verify new users appear after signup

### Firestore Database
- Go to: Firestore Database → Data
- Check `users` collection
- Verify user documents are created
- Check `onboarding` subcollection

### Rules
- Go to: Firestore Database → Rules
- Verify rules are published
- Use Rules Playground to test

## 🎨 Customization

### Update Branding
- Edit `app/layout.tsx` for metadata
- Update colors in component files
- Modify fonts in `app/globals.css`

### Add New Stages
1. Update `OnboardingData` interface in `lib/firestore.ts`
2. Add new card in `app/onboarding/page.tsx`
3. Update `getStageLabel` in `app/dashboard/page.tsx`

### Add New Features
1. Create new components in `components/`
2. Add new pages in `app/`
3. Update Firestore rules if needed
4. Add new Firestore functions in `lib/firestore.ts`

## 📝 Environment Variables

Required in `.env`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
NEXT_PUBLIC_GOOGLE_CLIENT_ID
```

## 🚢 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel Dashboard
```

### Other Platforms
- Add all `NEXT_PUBLIC_*` variables
- Deploy Firestore rules separately
- Update authorized domains in Firebase Console

## ✅ Checklist

Before going live:
- [ ] Deploy Firestore rules
- [ ] Test all authentication flows
- [ ] Test onboarding data saving
- [ ] Verify dashboard displays data
- [ ] Test on mobile devices
- [ ] Add production domain to Firebase authorized domains
- [ ] Set up environment variables on hosting platform
- [ ] Enable Firebase Analytics (optional)
- [ ] Set up error monitoring (optional)

## 📚 Documentation

- `FIREBASE_SETUP.md` - Firebase authentication setup
- `FIRESTORE_RULES_DEPLOYMENT.md` - Firestore rules guide
- `ENVIRONMENT_SETUP.md` - Environment variables guide
- `PROJECT_STRUCTURE.md` - Project architecture

## 🆘 Support

If you need help:
1. Check documentation files
2. Review Firebase Console for errors
3. Check browser console for client errors
4. Verify all environment variables are set
5. Ensure Firestore rules are deployed

## 🎉 You're Ready!

Your MomPulse app is fully configured and ready to use. Start the dev server and begin testing!

```bash
npm run dev
```

Visit: http://localhost:3000
