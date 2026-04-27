# Admin Panel Troubleshooting Guide

## Error: "Missing or insufficient permissions"

This error means Firestore is blocking your request. Here's how to fix it:

### ✅ Solution Checklist

Complete these steps IN ORDER:

#### 1. Create Admin User in Firebase Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **mompulse-5ceb8**
3. Go to **Authentication** → **Users** tab
4. Click **"Add User"**
5. Enter:
   - Email: `admin@admin.com`
   - Password: `admin123`
6. Click **"Add User"**

#### 2. Deploy Firestore Rules

1. In Firebase Console, go to **Firestore Database**
2. Click **Rules** tab
3. Copy ALL content from `mompulse/firestore.rules` file
4. Paste into the editor (replace everything)
5. Click **"Publish"** button
6. Wait for "Rules published successfully" message

#### 3. Create Firestore Indexes

You need 3 indexes:

**Index 1: Doctors** (Click this link):
https://console.firebase.google.com/v1/r/project/mompulse-5ceb8/firestore/indexes?create_composite=Ck5wcm9qZWN0cy9tb21wdWxzZS01Y2ViOC9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvZG9jdG9ycy9pbmRleGVzL18QARoKCgZzdGF0dXMfix

**Index 2: Sessions** (Create manually):
- Collection: `sessions`
- Fields: `status` (Ascending), `date` (Ascending)

**Index 3: Content** (Create manually):
- Collection group: `items` ✅
- Fields: `section` (Ascending), `status` (Ascending), `createdAt` (Descending)

#### 4. Login as Admin

1. Go to your app: `/login`
2. Enter:
   - Email: `admin@admin.com`
   - Password: `admin123`
3. Click "Enter the Sanctuary"
4. You should be redirected to `/admin`

#### 5. Check Browser Console

Open browser console (F12) and look for:
- ✅ "Fetching doctors..." - means it's trying
- ✅ "Doctors fetched: [...]" - means it worked
- ❌ "Permission denied" - means rules not deployed or not logged in

---

## Common Issues & Solutions

### Issue 1: "Permission denied" error

**Cause**: Firestore rules not deployed or not logged in as admin

**Solution**:
1. Verify you're logged in as `admin@admin.com` (check top right of admin panel)
2. Deploy Firestore rules via console (see step 2 above)
3. Logout and login again

### Issue 2: "Index required" error

**Cause**: Firestore indexes not created

**Solution**:
1. Click the link in the error message
2. Click "Create Index"
3. Wait 1-2 minutes for it to build
4. Create the other 2 indexes manually

### Issue 3: Admin panel shows "Loading..." forever

**Cause**: Not logged in or wrong user

**Solution**:
1. Check if you're logged in (look at browser console)
2. Make sure you logged in with `admin@admin.com`
3. Try logging out and logging in again

### Issue 4: Redirected to onboarding page

**Cause**: Login page not redirecting admin correctly

**Solution**:
- This should be fixed in the code
- Make sure you're using the latest version
- Clear browser cache and try again

### Issue 5: "User not found" when logging in

**Cause**: Admin user doesn't exist in Firebase Authentication

**Solution**:
1. Go to Firebase Console → Authentication → Users
2. Create the admin user (see step 1 above)

---

## Verification Steps

After completing all steps, verify:

### 1. Check Firebase Console

**Authentication:**
- ✅ User `admin@admin.com` exists

**Firestore Rules:**
- ✅ Rules contain `isAdmin()` function
- ✅ Rules check for `request.auth.token.email == 'admin@admin.com'`

**Indexes:**
- ✅ 3 indexes exist
- ✅ All show status "Enabled" (not "Building")

### 2. Check Your App

**Login:**
- ✅ Can login with `admin@admin.com` / `admin123`
- ✅ Redirected to `/admin` (not `/onboarding`)

**Admin Panel:**
- ✅ No errors in browser console
- ✅ Doctors section loads (even if empty)
- ✅ Sessions section loads (even if empty)
- ✅ Content tab works

### 3. Check Browser Console

Look for these logs:
```
Fetching doctors...
Doctors fetched: []
Fetching sessions...
Sessions fetched: []
```

If you see "Permission denied", go back to step 2 (Deploy Rules).

---

## Still Not Working?

### Debug Checklist

1. **Open browser console** (F12)
2. **Go to Console tab**
3. **Look for error messages**
4. **Check these specific things:**

```javascript
// Should see this when loading admin panel:
"Fetching doctors..."
"Fetching sessions..."

// If you see this, rules aren't deployed:
"Permission denied - check if:"
"1. You are logged in as admin@admin.com"
"2. Firestore rules have been deployed"

// If you see this, indexes aren't created:
"The query requires an index"
```

### Get Help

If still stuck, provide:
1. Screenshot of browser console errors
2. Screenshot of Firebase Console → Firestore → Rules tab
3. Screenshot of Firebase Console → Authentication → Users tab
4. Screenshot of Firebase Console → Firestore → Indexes tab

---

## Quick Reference

**Admin Credentials:**
- Email: `admin@admin.com`
- Password: `admin123`

**Firebase Console:**
- Project: `mompulse-5ceb8`
- URL: https://console.firebase.google.com/

**Required Steps:**
1. ✅ Create admin user in Authentication
2. ✅ Deploy Firestore rules
3. ✅ Create 3 indexes
4. ✅ Login as admin
5. ✅ Verify in browser console

**Files to Check:**
- `firestore.rules` - Security rules
- `firestore.indexes.json` - Index definitions
- `app/admin/page.tsx` - Admin page code

---

**Last Updated**: April 27, 2026  
**Status**: Troubleshooting guide for permission errors
