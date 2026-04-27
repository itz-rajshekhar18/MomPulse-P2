# Admin Login Redirect Fix

## Problem
When logging in with admin credentials (`admin@admin.com`), the user was being redirected to the onboarding page instead of the admin panel.

## Root Cause
1. Login page was redirecting all users to `/dashboard` after successful login
2. Dashboard page checks for onboarding data
3. If no onboarding data exists, it redirects to `/onboarding`
4. Admin user doesn't have (and doesn't need) onboarding data

## Solution

### 1. Updated Login Page (`app/login/page.tsx`)
Added admin email check to redirect admin users directly to `/admin`:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    await signIn(email, password);
    
    // Check if user is admin and redirect accordingly
    if (email === 'admin@admin.com') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  } catch (err: any) {
    setError(err.message || 'Failed to sign in');
  } finally {
    setLoading(false);
  }
};
```

### 2. Updated Dashboard Page (`app/dashboard/page.tsx`)
Added admin check at the beginning of the useEffect to prevent admin users from being redirected to onboarding:

```typescript
useEffect(() => {
  if (!user) {
    router.push('/login');
    return;
  }

  // Check if user is admin and redirect to admin panel
  if (user.email === 'admin@admin.com') {
    router.push('/admin');
    return;
  }

  // ... rest of the onboarding check logic
}, [user, router]);
```

## User Flow After Fix

### Admin User Login Flow
```
Login Page (admin@admin.com)
  ↓
Check email === 'admin@admin.com'
  ↓
Redirect to /admin
  ↓
Admin Panel (no onboarding required)
```

### Regular User Login Flow
```
Login Page (user@example.com)
  ↓
Check email !== 'admin@admin.com'
  ↓
Redirect to /dashboard
  ↓
Check onboarding data
  ↓
If exists: Redirect to stage-specific dashboard
If not exists: Redirect to /onboarding
```

## Testing

### Test Admin Login
1. Navigate to `/login`
2. Enter:
   - Email: `admin@admin.com`
   - Password: `admin123`
3. Click "Enter the Sanctuary"
4. **Expected**: Redirected directly to `/admin` panel
5. **Verify**: Can see admin dashboard with stats, doctors, and content management

### Test Regular User Login
1. Navigate to `/login`
2. Enter regular user credentials
3. Click "Enter the Sanctuary"
4. **Expected**: 
   - If onboarding completed: Redirected to stage-specific dashboard
   - If onboarding not completed: Redirected to `/onboarding`

### Test Admin Accessing Dashboard
1. Login as admin
2. Manually navigate to `/dashboard`
3. **Expected**: Automatically redirected to `/admin`

## Files Modified
1. `app/login/page.tsx` - Added admin email check for redirect
2. `app/dashboard/page.tsx` - Added admin check to prevent onboarding redirect

## Build Status
✅ Build successful - All TypeScript checks passed

---

**Issue**: Admin redirected to onboarding instead of admin panel  
**Status**: ✅ Fixed  
**Date**: April 27, 2026
