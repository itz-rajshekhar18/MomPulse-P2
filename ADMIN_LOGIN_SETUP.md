# Admin Panel Login Setup

## Admin Credentials

The admin panel has a fixed admin account with the following credentials:

- **Email**: `admin@admin.com`
- **Password**: `admin123`

## Setup Instructions

### 1. Create Admin Account in Firebase

You need to create this admin user in Firebase Authentication:

**Option A: Using Firebase Console**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Authentication** → **Users**
4. Click **Add User**
5. Enter:
   - Email: `admin@admin.com`
   - Password: `admin123`
6. Click **Add User**

**Option B: Using Firebase CLI**
```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Create the admin user (you'll need to use Firebase Admin SDK or do this via console)
```

**Option C: Using Firebase Admin SDK (Node.js script)**
```javascript
const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

// Create admin user
admin.auth().createUser({
  email: 'admin@admin.com',
  password: 'admin123',
  displayName: 'Admin'
})
.then((userRecord) => {
  console.log('Successfully created admin user:', userRecord.uid);
})
.catch((error) => {
  console.log('Error creating admin user:', error);
});
```

### 2. Deploy Firestore Rules

The Firestore rules have been updated to recognize `admin@admin.com` as the admin user.

Deploy the updated rules:

```bash
cd mompulse
firebase deploy --only firestore:rules
```

### 3. Access Admin Panel

1. Navigate to your app: `https://mom-pulse-p2.vercel.app/login`
2. Login with:
   - Email: `admin@admin.com`
   - Password: `admin123`
3. After login, navigate to `/admin` or click on the admin link

## Security Implementation

### Frontend Protection
- The admin page (`/app/admin/page.tsx`) checks if the logged-in user's email is `admin@admin.com`
- If not, the user is redirected to the dashboard
- This prevents unauthorized access at the UI level

### Backend Protection (Firestore Rules)
- The Firestore rules have an `isAdmin()` helper function that checks:
  ```javascript
  function isAdmin() {
    return isAuthenticated() && request.auth.token.email == 'admin@admin.com';
  }
  ```
- This ensures that only the admin email can:
  - Create, update, and delete articles and videos
  - Create, update, and delete doctors
  - Create, update, and delete sessions
  - Access analytics data
  - Manage all consultations and bookings

## Admin Capabilities

The admin user (`admin@admin.com`) has access to:

### Content Management
- ✅ Create articles for different sections (period, pre-pregnancy, pregnancy, postpartum, general)
- ✅ Create videos for different sections
- ✅ Update existing articles and videos
- ✅ Delete articles and videos
- ✅ View all content (published and draft)

### Doctor Management
- ✅ View all doctors
- ✅ Create new doctor profiles
- ✅ Update doctor information
- ✅ Delete doctors

### Session Management
- ✅ View all upcoming sessions
- ✅ Create new group sessions/workshops
- ✅ Update session details
- ✅ Delete sessions

### User Management
- ✅ View user statistics
- ✅ Access analytics data
- ✅ Manage consultations and bookings

## Important Notes

### Security Considerations

⚠️ **For Production Use:**
1. **Change the password** after initial setup
2. Consider implementing **2FA (Two-Factor Authentication)**
3. Use a **stronger password** (minimum 12 characters with special characters)
4. **Monitor admin access logs** regularly
5. Consider using **Firebase Admin SDK** for more secure admin operations

### Password Change

To change the admin password:

1. **Via Firebase Console:**
   - Go to Authentication → Users
   - Find `admin@admin.com`
   - Click the three dots → Reset password
   - Enter new password

2. **Via Firebase Auth API:**
   ```javascript
   import { getAuth, updatePassword } from 'firebase/auth';
   
   const auth = getAuth();
   const user = auth.currentUser;
   
   updatePassword(user, 'newSecurePassword123!')
     .then(() => {
       console.log('Password updated successfully');
     })
     .catch((error) => {
       console.error('Error updating password:', error);
     });
   ```

### Multiple Admins

If you need multiple admin users in the future:

1. Update the `isAdmin()` function in `firestore.rules`:
   ```javascript
   function isAdmin() {
     return isAuthenticated() && 
            (request.auth.token.email == 'admin@admin.com' ||
             request.auth.token.email == 'admin2@admin.com');
   }
   ```

2. Update the admin page check in `app/admin/page.tsx`:
   ```typescript
   const adminEmails = ['admin@admin.com', 'admin2@admin.com'];
   if (!adminEmails.includes(user.email || '')) {
     router.push('/dashboard');
     return;
   }
   ```

## Troubleshooting

### Issue: Cannot access admin panel
**Solution:**
1. Verify you're logged in with `admin@admin.com`
2. Check browser console for errors
3. Verify Firestore rules are deployed

### Issue: Cannot create content
**Solution:**
1. Verify Firestore rules are deployed: `firebase deploy --only firestore:rules`
2. Check that the admin user exists in Firebase Authentication
3. Verify the email matches exactly: `admin@admin.com`

### Issue: Redirected to dashboard
**Solution:**
- You're not logged in with the admin account
- Login with `admin@admin.com` and `admin123`

## Testing

To test admin functionality:

1. **Login as Admin:**
   ```
   Email: admin@admin.com
   Password: admin123
   ```

2. **Test Content Creation:**
   - Go to Admin Panel → Content tab
   - Click "New Article" or "New Video"
   - Fill form and submit
   - Verify content appears in the list

3. **Test User View:**
   - Login as a regular user
   - Navigate to `/sanctuary`
   - Verify you can see the published content
   - Verify you cannot access `/admin`

## Files Modified

1. `app/admin/page.tsx` - Added email-based admin check
2. `firestore.rules` - Updated `isAdmin()` function to check email
3. `firestore.rules` - Added `/sessions` collection rules

---

**Last Updated**: April 27, 2026
**Status**: ✅ Implemented
