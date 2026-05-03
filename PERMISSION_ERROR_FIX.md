# Firebase Permission Error - FIXED ✅

## Problem
```
7 PERMISSION_DENIED: Missing or insufficient permissions
```

This error occurred because API routes were using the **client-side Firebase SDK** instead of the **server-side Firebase Admin SDK**.

## Root Cause
- Client SDK requires user authentication and Firestore security rules
- API routes run on the server and need Admin SDK with elevated permissions
- Admin SDK bypasses security rules and has full database access

## Solution Implemented

### 1. ✅ Installed Firebase Admin SDK
```bash
npm install firebase-admin
```

### 2. ✅ Created Admin Configuration
**File:** `lib/firebaseAdmin.ts`
- Initializes Firebase Admin SDK
- Exports `adminDb` and `adminAuth` for server-side use
- Includes helper function `savePeriodPredictionAdmin()`

### 3. ✅ Updated API Routes
**File:** `app/api/ml/period-prediction/route.ts`
- Changed from `savePeriodPrediction()` (client SDK)
- To `savePeriodPredictionAdmin()` (admin SDK)

## What You Need to Do

### Step 1: Get Service Account Key

1. Go to [Firebase Console](https://console.firebase.com)
2. Select your project
3. Click ⚙️ → **Project Settings**
4. Go to **Service Accounts** tab
5. Click **"Generate New Private Key"**
6. Download the JSON file

### Step 2: Add to Environment Variables

Open `mompulse/.env.local` and add:

```env
# Firebase Admin SDK (for API routes)
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"your-project-id","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}'
```

**Important:** 
- Copy the ENTIRE JSON content
- Make it a single line (no line breaks)
- Wrap in single quotes

### Step 3: Restart Server

```bash
# Stop the server (Ctrl+C)
npm run dev
```

## Alternative: Individual Environment Variables

If you prefer, you can use individual variables instead:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
```

## Security Warning ⚠️

**NEVER commit service account keys to Git!**

1. Verify `.env.local` is in `.gitignore`
2. Never share your service account key
3. For production, add env variables in Vercel/Netlify dashboard

## Testing

After adding credentials and restarting:

1. Go to your app
2. Try using period prediction feature
3. Error should be gone! ✅

## Files Modified

- ✅ `lib/firebaseAdmin.ts` (new)
- ✅ `app/api/ml/period-prediction/route.ts` (updated)
- ✅ `package.json` (firebase-admin added)
- ✅ `FIREBASE_ADMIN_SETUP.md` (documentation)

## Need Help?

See detailed instructions in `FIREBASE_ADMIN_SETUP.md`
