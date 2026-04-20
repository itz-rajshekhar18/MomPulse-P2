# Firebase Authentication Setup

## Overview
MomPulse uses Firebase Authentication for user management with support for:
- Email/Password authentication
- Google Sign-In
- Firestore database for user data

## Configuration

### Firebase Project Details
- **Project ID**: mompulse-5ceb8
- **Auth Domain**: mompulse-5ceb8.firebaseapp.com
- **Google Client ID**: 687365807902-oepohfh5udq3lp8nmfkd307sjlkj5jiu.apps.googleusercontent.com

### Files Structure
```
mompulse/
├── lib/
│   └── firebase.ts              # Firebase initialization & config
├── contexts/
│   └── AuthContext.tsx          # Authentication context & hooks
├── app/
│   ├── login/page.tsx           # Login page with Firebase auth
│   ├── signup/page.tsx          # Signup page with Firebase auth
│   ├── onboarding/page.tsx      # Post-signup onboarding
│   └── dashboard/page.tsx       # Protected dashboard
```

## Features Implemented

### 1. Authentication Methods
- ✅ Email/Password Sign Up
- ✅ Email/Password Sign In
- ✅ Google Sign-In (OAuth)
- ✅ Sign Out
- ⏳ Apple Sign-In (UI ready, needs configuration)

### 2. User Flow
1. **New User**: Sign Up → Onboarding → Dashboard
2. **Returning User**: Login → Dashboard
3. **Google Sign-In**: Auto-creates account → Onboarding/Dashboard

### 3. Protected Routes
- Dashboard requires authentication
- Automatic redirect to login if not authenticated

## Usage

### Using Authentication in Components

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, signIn, signUp, signInWithGoogle, logout } = useAuth();
  
  // Check if user is logged in
  if (user) {
    return <div>Welcome {user.email}</div>;
  }
  
  return <div>Please log in</div>;
}
```

### Sign Up with Email/Password
```typescript
const { signUp } = useAuth();

try {
  await signUp(email, password);
  // User is now signed in
} catch (error) {
  console.error(error);
}
```

### Sign In with Google
```typescript
const { signInWithGoogle } = useAuth();

try {
  await signInWithGoogle();
  // User is now signed in
} catch (error) {
  console.error(error);
}
```

### Sign Out
```typescript
const { logout } = useAuth();

try {
  await logout();
  // User is now signed out
} catch (error) {
  console.error(error);
}
```

## Firebase Console Setup

### Enable Authentication Methods
1. Go to Firebase Console → Authentication → Sign-in method
2. Enable **Email/Password**
3. Enable **Google** (already configured with your Client ID)

### Authorized Domains
Make sure these domains are authorized in Firebase Console:
- `localhost` (for development)
- Your production domain (when deployed)

### Google OAuth Configuration
The Google OAuth is configured with:
- Client ID: `687365807902-oepohfh5udq3lp8nmfkd307sjlkj5jiu.apps.googleusercontent.com`
- Authorized redirect URIs should include:
  - `http://localhost:3000` (development)
  - Your production URL

## Security Notes

⚠️ **Important**: The Firebase API keys are currently hardcoded in `lib/firebase.ts`. For production:
1. Move sensitive keys to environment variables
2. Use `.env.local` for local development
3. Configure environment variables in your hosting platform
4. Never commit `.env.local` to version control

## Firestore Database

The Firestore database is initialized and ready to use. You can store user profiles, tracking data, and other information.

### Example: Saving User Profile
```typescript
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

async function saveUserProfile(userId: string, data: any) {
  await setDoc(doc(db, 'users', userId), data);
}
```

## Testing

### Test Accounts
You can create test accounts using:
- Email/Password signup
- Google Sign-In with any Google account

### Development
```bash
npm run dev
```

Then navigate to:
- `/signup` - Create new account
- `/login` - Sign in
- `/dashboard` - View dashboard (requires auth)

## Troubleshooting

### "Firebase: Error (auth/popup-blocked)"
- Allow popups in your browser for Google Sign-In

### "Firebase: Error (auth/unauthorized-domain)"
- Add your domain to authorized domains in Firebase Console

### "Firebase: Error (auth/weak-password)"
- Password must be at least 6 characters

### User not persisting after refresh
- Check that AuthProvider is wrapping your app in layout.tsx
- Verify Firebase is properly initialized

## Next Steps

1. ✅ Basic authentication working
2. ⏳ Add user profile storage in Firestore
3. ⏳ Implement password reset functionality
4. ⏳ Add email verification
5. ⏳ Configure Apple Sign-In
6. ⏳ Add user profile management
7. ⏳ Implement protected routes middleware
