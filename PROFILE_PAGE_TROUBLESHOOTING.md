# Profile Page Troubleshooting Guide

## Issue: Can't Access Profile Page

If you're unable to navigate to the profile page, follow these steps:

### Step 1: Clear Next.js Cache
```bash
# Stop the dev server (Ctrl+C)

# Delete .next folder
Remove-Item -Recurse -Force .next

# Restart dev server
npm run dev
```

### Step 2: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for any errors
4. Common errors:
   - Module not found
   - Import errors
   - Syntax errors

### Step 3: Verify Files Exist
```bash
# Check if profile page exists
Test-Path app/profile/page.tsx

# Check if components exist
Test-Path components/profile/ProfileHeader.tsx
Test-Path components/profile/StageSelector.tsx
Test-Path components/profile/PersonalInformation.tsx
Test-Path components/profile/Preferences.tsx
Test-Path components/profile/LogoutButton.tsx
```

### Step 4: Test Direct Navigation
Try accessing the profile page directly:
```
http://localhost:3000/profile
```

### Step 5: Check Authentication
The profile page requires authentication. Make sure:
1. You're logged in
2. User session is active
3. AuthContext is working

### Step 6: Verify Bottom Navigation
Check if the PROFILE button appears in bottom navigation:
1. Look at the bottom of the screen
2. You should see: HOME | INSIGHTS | COMMUNITY | PROFILE
3. Click the PROFILE button

### Step 7: Check for TypeScript Errors
```bash
# Run TypeScript check
npx tsc --noEmit
```

### Step 8: Rebuild the Project
```bash
# Stop dev server
# Clean install
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .next
npm install
npm run dev
```

## Common Issues and Solutions

### Issue 1: "Module not found" Error
**Solution:** Check import paths in profile page
```typescript
// Make sure these imports work:
import { useAuth } from '@/contexts/AuthContext';
import ProfileHeader from '@/components/profile/ProfileHeader';
```

### Issue 2: Bottom Navigation Not Showing Profile
**Solution:** Check if BottomNavigation is updated
- Profile tab should be 4th item
- href should be '/profile'
- currentPage prop should be passed

### Issue 3: Page Shows Loading Forever
**Solution:** Check AuthContext
- Make sure user is authenticated
- Check if getUserProfile function works
- Verify Firestore connection

### Issue 4: 404 Not Found
**Solution:** Verify file structure
```
app/
  profile/
    page.tsx  ← Must be named exactly "page.tsx"
```

### Issue 5: Blank White Screen
**Solution:** Check browser console for errors
- Look for component import errors
- Check for missing dependencies
- Verify all components render correctly

## Quick Test

Create a simple test page to verify routing works:

```typescript
// app/profile/page.tsx (simplified)
'use client';

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold">Profile Page Works!</h1>
    </div>
  );
}
```

If this works, gradually add back components one by one to find the issue.

## Verification Checklist

- [ ] Dev server is running (`npm run dev`)
- [ ] No errors in terminal
- [ ] No errors in browser console
- [ ] User is logged in
- [ ] Bottom navigation shows PROFILE button
- [ ] Clicking PROFILE button navigates to /profile
- [ ] Profile page loads without errors
- [ ] All components render correctly

## Still Not Working?

If none of the above works, please provide:
1. Error message from browser console
2. Error message from terminal
3. Screenshot of the issue
4. Which step you're stuck on

## Manual Navigation Test

Try navigating manually in the browser:
1. Go to: `http://localhost:3000/profile`
2. If you see a 404, the route isn't registered
3. If you see errors, check browser console
4. If you see loading forever, check authentication
