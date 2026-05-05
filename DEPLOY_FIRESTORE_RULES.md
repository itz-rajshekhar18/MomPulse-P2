# Deploy Firestore Rules - Fix Permission Errors

## Issue
Getting "Missing or insufficient permissions" errors in the console.

## Root Cause
The Firestore security rules in your local `firestore.rules` file need to be deployed to Firebase Console.

## Solution: Deploy Rules via Firebase Console

### Step 1: Copy the Rules
1. Open the file `mompulse/firestore.rules` in your editor
2. Select ALL the content (Ctrl+A / Cmd+A)
3. Copy it (Ctrl+C / Cmd+C)

### Step 2: Open Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **mompulse-5ceb8**
3. Click on **Firestore Database** in the left sidebar
4. Click on the **Rules** tab at the top

### Step 3: Replace the Rules
1. You'll see the current rules in the editor
2. Select ALL the existing rules (Ctrl+A / Cmd+A)
3. Delete them
4. Paste the new rules from `firestore.rules` (Ctrl+V / Cmd+V)
5. Click the **Publish** button

### Step 4: Verify
1. Wait 10-30 seconds for rules to propagate
2. Refresh your MomPulse application
3. The permission errors should be gone

## What Changed in the Rules

### ✅ Fixed Admin Queries
- Added `allow list: if isAdmin()` for users collection
- Added `allow list: if isAdmin()` for bookings collection
- This allows admin panel to query all users and bookings for analytics

### ✅ Added Missing Collections
- Added rules for top-level `doctors` collection
- Added rules for top-level `sessions` collection
- These are used by the consultation page

### ✅ Separated Read Operations
- Changed `allow read` to `allow get` and `allow list` where needed
- This provides more granular control over permissions

## Key Rules Summary

| Collection | Users | Admins |
|------------|-------|--------|
| `users` | Read/write own data | Read all, list all |
| `doctors` | Read all | Full access |
| `sessions` | Read all | Full access |
| `bookings` | Read/write own | Full access, list all |
| `community` | Read/write posts | Full access |

## Troubleshooting

### If you still get permission errors after deploying:

1. **Clear browser cache and cookies**
   - Press Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
   - Clear cached images and files
   - Clear cookies

2. **Sign out and sign back in**
   - This refreshes your authentication token
   - Go to your app and click logout
   - Sign in again with admin@admin.com / admin123

3. **Check Firebase Console**
   - Go to Firestore Database → Rules
   - Verify the rules were published successfully
   - Check the "Published" timestamp

4. **Wait for propagation**
   - Sometimes it takes 1-2 minutes for rules to fully propagate
   - Be patient and refresh after a minute

### If specific collections still have errors:

Check that the collection exists in Firestore:
1. Go to Firestore Database → Data tab
2. Look for these collections:
   - `users`
   - `doctors`
   - `sessions`
   - `bookings`
   - `community`

If any are missing, they'll be created automatically when you first add data to them.

## Alternative: Use Firebase CLI (Advanced)

If you have Firebase CLI installed:

```bash
cd mompulse
firebase deploy --only firestore:rules
```

But since you mentioned Firebase CLI is not set up, use the Console method above instead.

## Next Steps After Deploying Rules

1. ✅ Rules deployed
2. ⏳ Wait for Firebase indexes to finish building (see FIREBASE_INDEX_FIX.md)
3. ✅ Refresh admin panel
4. ✅ Test all features

## Need Help?

If you continue to see permission errors after following these steps:
1. Take a screenshot of the exact error message
2. Check the browser console for the full error details
3. Verify you're logged in as admin@admin.com
