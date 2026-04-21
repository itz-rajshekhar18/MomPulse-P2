# Firestore Security Rules Deployment Guide

## Overview
This guide explains how to deploy the Firestore security rules to your Firebase project.

## Security Rules File
The rules are defined in `firestore.rules` at the root of the project.

## Deployment Methods

### Method 1: Firebase Console (Recommended for First Time)

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com
   - Select your project: `mompulse-5ceb8`

2. **Navigate to Firestore Database**
   - Click on "Firestore Database" in the left sidebar
   - Click on the "Rules" tab

3. **Copy and Paste Rules**
   - Open the `firestore.rules` file in your project
   - Copy all the content
   - Paste it into the Firebase Console rules editor
   - Click "Publish"

### Method 2: Firebase CLI (Recommended for Updates)

1. **Install Firebase CLI** (if not already installed)
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase in Your Project** (first time only)
   ```bash
   firebase init firestore
   ```
   - Select your project: `mompulse-5ceb8`
   - Accept default file names (firestore.rules, firestore.indexes.json)

4. **Deploy Rules**
   ```bash
   firebase deploy --only firestore:rules
   ```

## Security Rules Explanation

### User Data Protection
```javascript
match /users/{userId} {
  allow read, write: if request.auth.uid == userId;
}
```
- Users can only access their own data
- Authentication is required
- No user can read another user's data

### Subcollections
- `/users/{userId}/profile/*` - User profile data
- `/users/{userId}/onboarding/*` - Onboarding selections
- `/users/{userId}/tracking/*` - Pregnancy/period tracking data

### Community Posts
```javascript
match /posts/{postId} {
  allow read: if isAuthenticated();
  allow create: if isAuthenticated();
  allow update, delete: if resource.data.userId == request.auth.uid;
}
```
- All authenticated users can read posts
- Only post owners can update/delete their posts

## Data Structure

### User Document (`/users/{userId}`)
```typescript
{
  uid: string,
  email: string,
  displayName?: string,
  photoURL?: string,
  currentStage: 'planning' | 'postpartum' | 'pregnancy' | 'period',
  age?: number,
  onboardingCompleted: boolean,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Onboarding Document (`/users/{userId}/onboarding/initial`)
```typescript
{
  currentStage: 'planning' | 'postpartum' | 'pregnancy' | 'period',
  age?: number,
  completedAt: Timestamp
}
```

## Testing Rules

### Test in Firebase Console
1. Go to Firestore Database → Rules
2. Click on "Rules Playground"
3. Test different scenarios:
   - Authenticated user reading their own data ✅
   - Authenticated user reading another user's data ❌
   - Unauthenticated user reading data ❌

### Test in Your App
```typescript
// This should work (user reading their own data)
const userDoc = await getDoc(doc(db, 'users', currentUser.uid));

// This should fail (user reading another user's data)
const otherUserDoc = await getDoc(doc(db, 'users', 'someOtherUserId'));
```

## Common Issues

### Issue: "Missing or insufficient permissions"
**Solution**: 
- Make sure the user is authenticated
- Verify the user is accessing their own data (userId matches auth.uid)
- Check that rules are deployed

### Issue: Rules not updating
**Solution**:
- Wait a few minutes for rules to propagate
- Clear browser cache
- Redeploy rules: `firebase deploy --only firestore:rules`

### Issue: "PERMISSION_DENIED"
**Solution**:
- Check if user is logged in
- Verify the document path matches the rules
- Ensure userId in path matches authenticated user's uid

## Security Best Practices

✅ **DO:**
- Always require authentication for sensitive data
- Use `request.auth.uid` to verify ownership
- Test rules thoroughly before production
- Use subcollections for related data
- Keep rules simple and readable

❌ **DON'T:**
- Allow public read/write access to user data
- Trust client-side validation alone
- Store sensitive data without encryption
- Use overly complex rule logic
- Forget to deploy rule updates

## Monitoring

### Check Rule Usage
1. Go to Firebase Console → Firestore Database
2. Click on "Usage" tab
3. Monitor:
   - Read/Write operations
   - Denied requests (indicates rule violations)
   - Storage usage

### Enable Audit Logs (Optional)
For production, enable Cloud Audit Logs to track:
- Who accessed what data
- When access occurred
- Which rules were triggered

## Current Status

✅ Rules file created: `firestore.rules`
✅ Firestore service functions created: `lib/firestore.ts`
✅ Onboarding page saves data to Firestore
✅ Dashboard displays user's saved data
⏳ Rules need to be deployed to Firebase Console

## Next Steps

1. Deploy rules to Firebase Console (Method 1 or 2 above)
2. Test authentication and data saving
3. Verify rules are working correctly
4. Monitor for any permission errors
5. Update rules as needed for new features

## Support

If you encounter issues:
1. Check Firebase Console → Firestore Database → Rules
2. Review error messages in browser console
3. Test rules in Firebase Rules Playground
4. Verify authentication is working
5. Check that environment variables are set correctly
