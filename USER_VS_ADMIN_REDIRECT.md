# User vs Admin Redirect - How It Works

## Current Behavior (By Design)

The system has two types of users with different redirect logic:

### Admin User
- **Email:** `admin@admin.com`
- **Password:** `admin123`
- **After Login:** Redirects to `/admin` panel
- **Dashboard Access:** If admin visits `/dashboard`, redirects to `/admin`
- **Purpose:** Manage doctors, sessions, content, view analytics

### Regular Users
- **Email:** Any email EXCEPT `admin@admin.com`
- **Password:** User's password
- **After Login:** Redirects to `/dashboard`
- **Dashboard Access:** Goes to stage-specific dashboard (period, pregnancy, etc.)
- **Purpose:** Track health, book consultations, use features

## Why This Happens

### Login Page Logic
**File:** `mompulse/app/login/page.tsx`

```typescript
// Check if user is admin and redirect accordingly
if (email === 'admin@admin.com') {
  router.push('/admin');  // Admin goes to admin panel
} else {
  router.push('/dashboard');  // Regular users go to dashboard
}
```

### Dashboard Page Logic
**File:** `mompulse/app/dashboard/page.tsx`

```typescript
// Check if user is admin and redirect to admin panel
if (user.email === 'admin@admin.com') {
  router.push('/admin');
  return;
}
```

This prevents the admin from accidentally accessing the regular user dashboard.

## How to Test as Regular User

### Option 1: Create a New User Account

1. **Logout** from admin account
2. Go to `/signup`
3. Create account with:
   - Email: `test@test.com` (or any email)
   - Password: `test123` (or any password)
4. Complete onboarding
5. Will redirect to `/dashboard` (not `/admin`)

### Option 2: Use Existing Test User

If you already have a test user:
1. **Logout** from admin account
2. Go to `/login`
3. Login with test user credentials
4. Will redirect to `/dashboard`

### Option 3: Temporarily Disable Admin Redirect

If you want to test dashboard features as admin:

**Edit:** `mompulse/app/dashboard/page.tsx`

Comment out the admin redirect:
```typescript
// Check if user is admin and redirect to admin panel
// if (user.email === 'admin@admin.com') {
//   router.push('/admin');
//   return;
// }
```

**Remember to uncomment this after testing!**

## What Each User Sees

### Admin User (`admin@admin.com`)
- ✅ Admin Panel (`/admin`)
  - Stats cards
  - Doctor management
  - Session management
  - Content management
  - User analytics
- ❌ Regular Dashboard (redirects to admin)
- ✅ Can still access:
  - `/consultation` (to see how users see it)
  - `/community`
  - `/booking` (to test booking flow)

### Regular User (any other email)
- ❌ Admin Panel (no access, permission denied)
- ✅ Regular Dashboard (`/dashboard`)
  - Period tracking
  - Pregnancy tracking
  - Postpartum recovery
  - AI assistant
  - Insights
- ✅ Can access:
  - `/consultation` (book consultations)
  - `/community` (create posts)
  - `/booking` (book appointments)
  - `/sanctuary` (wellness content)

## Testing Checklist

### Test as Admin
- [ ] Login as admin@admin.com / admin123
- [ ] Should redirect to `/admin`
- [ ] Admin panel loads with stats
- [ ] Can create doctors and sessions
- [ ] If you visit `/dashboard`, redirects back to `/admin`

### Test as Regular User
- [ ] Logout from admin
- [ ] Create new account or login as test user
- [ ] Should redirect to `/dashboard`
- [ ] Dashboard shows stage-specific content
- [ ] Can access consultation page
- [ ] Can book appointments
- [ ] Can create community posts
- [ ] Cannot access `/admin` (permission denied)

## Common Questions

### Q: Why can't admin access the regular dashboard?
**A:** This is by design to keep admin and user experiences separate. Admin has their own panel with management tools. If you need to test user features, create a test user account.

### Q: Can I have both admin and user access?
**A:** Not with the same email. The system checks if email is `admin@admin.com` to determine access level. You can:
- Use admin account for admin tasks
- Use a separate test account for user testing

### Q: How do I switch between admin and user views?
**A:** Logout and login with different credentials:
- Admin: `admin@admin.com` / `admin123`
- User: Any other email / password

### Q: Can I make another user an admin?
**A:** Currently, admin access is hardcoded to `admin@admin.com`. To add more admins, you would need to:
1. Update Firestore rules to check a `role` field
2. Update login/dashboard logic to check role instead of email
3. Add a way to set user roles in admin panel

## Summary

**Current Behavior:**
- Admin email → Admin panel ✅
- Other emails → User dashboard ✅

**This is correct and by design!**

If you're seeing the admin panel, it's because you're logged in as `admin@admin.com`. To test user features, create a test user account with a different email.

---

**Status:** Working as designed ✅  
**Action:** Create test user account to test dashboard  
**Admin Access:** admin@admin.com / admin123  
**Test User:** Create at /signup
