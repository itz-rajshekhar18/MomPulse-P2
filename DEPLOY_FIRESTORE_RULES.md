# Deploy Firestore Rules via Console

## The Error
```
FirebaseError: Missing or insufficient permissions
```

This means the Firestore rules haven't been deployed yet, or you're not logged in as the admin user.

## Solution: Deploy Rules via Firebase Console

### Step 1: Copy the Rules

Open the file `firestore.rules` and copy ALL the content.

### Step 2: Deploy via Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **mompulse-5ceb8**
3. Click on **Firestore Database** in the left sidebar
4. Click on the **Rules** tab at the top
5. You'll see a code editor with the current rules
6. **Select all** the existing rules (Ctrl+A or Cmd+A)
7. **Delete** them
8. **Paste** the new rules from `firestore.rules`
9. Click **"Publish"** button at the top right
10. Wait for confirmation message

### Step 3: Verify Admin User Exists

1. In Firebase Console, go to **Authentication** → **Users**
2. Check if `admin@admin.com` exists
3. If NOT, click **"Add User"**:
   - Email: `admin@admin.com`
   - Password: `admin123`
4. Click **"Add User"**

### Step 4: Test the App

1. **Logout** if you're currently logged in
2. Go to `/login`
3. Login with:
   - Email: `admin@admin.com`
   - Password: `admin123`
4. You should be redirected to `/admin`
5. Check browser console - errors should be gone

## Quick Checklist

Before testing, make sure:
- ✅ Firestore rules are published in Firebase Console
- ✅ Admin user (`admin@admin.com`) exists in Firebase Authentication
- ✅ You're logged in as the admin user
- ✅ Indexes are created (from previous step)

## Troubleshooting

### Still getting permission errors?

1. **Check if you're logged in:**
   - Open browser console
   - Look for "Fetching sessions..." or "Fetching doctors..." logs
   - Check if there's a user object logged

2. **Verify rules are deployed:**
   - Go to Firebase Console → Firestore → Rules tab
   - Check if the `isAdmin()` function exists
   - Look for: `request.auth.token.email == 'admin@admin.com'`

3. **Clear browser cache:**
   - Press Ctrl+Shift+Delete (or Cmd+Shift+Delete)
   - Clear cached images and files
   - Reload the page

4. **Check browser console:**
   - Look for the detailed error logs we added
   - It will tell you exactly what's wrong

### Error: "permission-denied"

This means one of these:
- ❌ Not logged in
- ❌ Logged in as wrong user (not admin@admin.com)
- ❌ Firestore rules not deployed
- ❌ Admin user doesn't exist in Firebase Auth

### Error: "index-required"

This means:
- ❌ Indexes not created yet
- Go back to the indexes setup step

## Alternative: Deploy Rules via CLI (If You Have It Set Up)

If you manage to set up Firebase CLI:

```bash
cd mompulse
firebase deploy --only firestore:rules
```

But the console method is easier and doesn't require CLI setup.

---

**Important**: You MUST deploy the rules via Firebase Console for the admin panel to work!
