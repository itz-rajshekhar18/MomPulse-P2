# Firebase Admin SDK Setup

The Firebase Admin SDK is required for server-side operations (API routes) to access Firestore without permission errors.

## Setup Instructions

### Option 1: Using Service Account Key (Recommended for Production)

1. **Generate Service Account Key:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Click the gear icon ⚙️ → Project Settings
   - Go to "Service Accounts" tab
   - Click "Generate New Private Key"
   - Download the JSON file

2. **Add to Environment Variables:**
   
   Add to your `.env.local` file:
   ```env
   FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"your-project-id",...}'
   ```
   
   **Important:** Copy the entire JSON content as a single-line string.

### Option 2: Using Individual Environment Variables

Add these to your `.env.local` file:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
```

**Note:** The private key must include `\n` for line breaks.

### Option 3: Development Mode (Local Only)

For local development, you can use Firebase CLI authentication:

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login:
   ```bash
   firebase login
   ```

3. The app will use Application Default Credentials automatically.

## Security Best Practices

### ⚠️ NEVER commit service account keys to Git!

1. **Add to `.gitignore`:**
   ```
   .env.local
   serviceAccountKey.json
   ```

2. **For Production (Vercel/Netlify):**
   - Add environment variables in your hosting platform's dashboard
   - Use the "Service Account Key" option
   - Paste the entire JSON as a single-line string

3. **Verify `.gitignore`:**
   ```bash
   git status
   ```
   Make sure `.env.local` is not listed.

## Testing

After setup, restart your development server:

```bash
npm run dev
```

The API routes should now work without permission errors.

## Troubleshooting

### Error: "Missing or insufficient permissions"
- ✅ Check that environment variables are set correctly
- ✅ Restart your development server after adding env variables
- ✅ Verify the service account has Firestore permissions

### Error: "Invalid service account"
- ✅ Make sure the JSON is properly formatted (single line, escaped quotes)
- ✅ Verify you downloaded the key from the correct Firebase project

### Error: "Private key must be a string"
- ✅ Ensure `FIREBASE_PRIVATE_KEY` includes `\n` for line breaks
- ✅ Wrap the value in double quotes in `.env.local`

## Current Status

✅ Firebase Admin SDK installed
✅ Admin helper functions created (`lib/firebaseAdmin.ts`)
✅ API routes updated to use Admin SDK
⏳ **Action Required:** Add service account credentials to `.env.local`

## Next Steps

1. Generate service account key from Firebase Console
2. Add credentials to `.env.local`
3. Restart development server
4. Test API routes (period prediction, etc.)
