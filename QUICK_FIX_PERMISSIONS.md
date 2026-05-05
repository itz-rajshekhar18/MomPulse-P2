# 🚀 QUICK FIX: Permission Errors

## 3-Step Fix (Takes 2 minutes)

### Step 1: Copy Rules
Open `mompulse/firestore.rules` → Select All (Ctrl+A) → Copy (Ctrl+C)

### Step 2: Deploy to Firebase
1. Go to: https://console.firebase.google.com/
2. Select project: **mompulse-5ceb8**
3. Click: **Firestore Database** → **Rules** tab
4. Select all existing rules → Delete
5. Paste new rules (Ctrl+V)
6. Click: **Publish** button

### Step 3: Refresh App
1. Wait 30 seconds
2. Refresh your MomPulse app (F5)
3. ✅ Done!

---

## What This Fixes

✅ "Missing or insufficient permissions" errors  
✅ Admin panel can't load stats  
✅ Users can't read doctors/sessions  
✅ Booking data not accessible  

---

## Still Having Issues?

### Clear Cache & Re-login
1. Press Ctrl+Shift+Delete
2. Clear cache and cookies
3. Logout from app
4. Login again: admin@admin.com / admin123

### Check Index Status
The "index building" error is separate - indexes take 5-10 minutes to build.
Check status: https://console.firebase.google.com/v1/r/project/mompulse-5ceb8/firestore/indexes

---

## Summary

**Problem:** Local rules file not deployed to Firebase  
**Solution:** Copy-paste rules to Firebase Console and publish  
**Time:** 2 minutes  
**Result:** All permission errors fixed ✅
