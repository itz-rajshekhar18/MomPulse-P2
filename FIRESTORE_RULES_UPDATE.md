# Firestore Rules Update Guide

## Overview
Updated Firestore security rules to include proper permissions for all collections including the new bookings feature.

## What's Included

### ✅ User Data Collections
- **users**: Users can read/write their own data, admins can read all
- **users/{userId}/profile**: User-specific profile data
- **users/{userId}/onboarding**: Onboarding information
- **users/{userId}/tracking**: Pregnancy, period tracking data
- **users/{userId}/conversations**: AI chat conversations
- **users/{userId}/cycles**: Period cycle data
- **users/{userId}/predictions**: ML predictions
- **users/{userId}/recoveryLogs**: Postpartum recovery logs
- **users/{userId}/postpartum**: Postpartum data

### ✅ Community Collections
- **community/{section}/posts**: Posts categorized by section (period, pre-pregnancy, postpartum, general)
- **community/{section}/posts/{postId}/comments**: Comments on posts
- **community/{section}/posts/{postId}/likes**: Likes on posts
- **communityProfiles**: User community profiles with reputation/badges

### ✅ Content Collections
- **content/articles/items**: Educational articles
- **content/videos/items**: Educational videos
- **content/doctors/items**: Doctor profiles
- **content/sessions/items**: Group sessions/workshops

### ✅ Booking & Consultation
- **bookings**: Consultation bookings
  - Users can create and read their own bookings
  - Admins can read/update/delete all bookings

### ✅ Analytics
- **analytics**: Admin-only analytics data

## Key Features

### 1. **Helper Functions**
```javascript
isAuthenticated() // Check if user is logged in
isOwner(userId)   // Check if user owns the document
isAdmin()         // Check if user is admin (admin@admin.com)
```

### 2. **Validation Functions**
- `isValidPost()` - Validates community post data
- `isValidComment()` - Validates comment data
- `isValidArticle()` - Validates article data
- `isValidVideo()` - Validates video data
- `isValidDoctor()` - Validates doctor profile data

### 3. **Security Features**
- ✅ Users can only access their own data
- ✅ Admin has full access to all collections
- ✅ Content length validation (prevents spam)
- ✅ Field validation (ensures required fields exist)
- ✅ Type validation (ensures correct data types)
- ✅ Status validation (published/draft for content)

## Deployment Instructions

### Option 1: Firebase Console (Recommended)

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Select your project

2. **Navigate to Firestore Rules**
   - Click "Firestore Database" in left sidebar
   - Click "Rules" tab at the top

3. **Copy and Paste Rules**
   - Open `mompulse/firestore.rules`
   - Copy the entire content
   - Paste into the Firebase Console editor

4. **Publish Rules**
   - Click "Publish" button
   - Wait for confirmation

### Option 2: Firebase CLI

```bash
# Install Firebase CLI (if not installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (if not done)
firebase init firestore

# Deploy rules
firebase deploy --only firestore:rules
```

## Testing the Rules

### Test User Permissions:
1. **Login as regular user**
   - Try to create a booking ✅ Should work
   - Try to read own bookings ✅ Should work
   - Try to read other user's bookings ❌ Should fail
   - Try to delete a booking ❌ Should fail

2. **Login as admin (admin@admin.com)**
   - Try to read all bookings ✅ Should work
   - Try to create/update/delete content ✅ Should work
   - Try to manage doctors ✅ Should work

### Test Booking Flow:
```javascript
// User creates booking
const booking = {
  userId: currentUser.uid,
  userEmail: currentUser.email,
  doctorId: 'doctor123',
  doctorName: 'Dr. Smith',
  date: '2024-01-15',
  time: '10:00 AM',
  status: 'pending'
};

await addDoc(collection(db, 'bookings'), booking);
// ✅ Should succeed
```

## Common Issues & Solutions

### Issue 1: "Missing or insufficient permissions"
**Solution:** 
- Ensure user is logged in
- Check that userId matches authenticated user
- Verify rules are deployed

### Issue 2: "Document doesn't exist"
**Solution:**
- Create the document first
- Check collection path is correct
- Verify document ID

### Issue 3: "Admin can't access data"
**Solution:**
- Ensure admin email is exactly `admin@admin.com`
- Check Firebase Authentication email
- Re-login as admin

## Rule Structure

```
firestore.rules
├── Helper Functions
│   ├── isAuthenticated()
│   ├── isOwner(userId)
│   └── isAdmin()
│
├── User Collections
│   ├── users/{userId}
│   ├── users/{userId}/profile
│   ├── users/{userId}/cycles
│   └── users/{userId}/predictions
│
├── Community Collections
│   ├── community/{section}/posts
│   ├── community/{section}/posts/{postId}/comments
│   └── communityProfiles
│
├── Content Collections
│   ├── content/articles/items
│   ├── content/videos/items
│   ├── content/doctors/items
│   └── content/sessions/items
│
├── Booking & Consultation
│   └── bookings
│
└── Analytics
    └── analytics
```

## Validation Rules

### Post Validation:
- ✅ Required fields: userId, userName, content, section, createdAt
- ✅ Content length: 1-5000 characters
- ✅ Valid sections: period, pre-pregnancy, postpartum, general
- ✅ User must own the post

### Comment Validation:
- ✅ Required fields: userId, userName, content, createdAt
- ✅ Content length: 1-2000 characters
- ✅ User must own the comment

### Article Validation:
- ✅ Required fields: title, category, section, content, status
- ✅ Title length: 1-200 characters
- ✅ Valid categories: nutrition, mental-health, sleep, movement, recovery, health, mindfulness
- ✅ Valid status: published, draft
- ✅ Admin only

### Doctor Validation:
- ✅ Required fields: name, title, specialty, experience, rating
- ✅ Rating: 0-5
- ✅ Admin only

### Booking Validation:
- ✅ User must be authenticated
- ✅ userId must match authenticated user
- ✅ User can only read/update own bookings
- ✅ Admin can read/update/delete all bookings

## Security Best Practices

1. ✅ **Never expose sensitive data**
   - User data is private by default
   - Only owner can access their data

2. ✅ **Validate all inputs**
   - Check field types
   - Validate field lengths
   - Ensure required fields exist

3. ✅ **Use helper functions**
   - Reusable security checks
   - Consistent validation logic

4. ✅ **Admin-only operations**
   - Content management
   - User management
   - Analytics access

5. ✅ **Deny by default**
   - Last rule denies all access
   - Explicit allow rules only

## Next Steps

1. **Deploy the rules** using Firebase Console or CLI
2. **Test the booking flow** with a regular user
3. **Test admin access** with admin@admin.com
4. **Monitor Firestore usage** in Firebase Console
5. **Check for permission errors** in browser console

## Support

If you encounter issues:
1. Check browser console for error messages
2. Verify user is authenticated
3. Confirm rules are deployed
4. Test with Firebase Console simulator
5. Check Firestore logs in Firebase Console

---

**Status:** ✅ Rules updated and ready to deploy
**Last Updated:** 2024
**Admin Email:** admin@admin.com
