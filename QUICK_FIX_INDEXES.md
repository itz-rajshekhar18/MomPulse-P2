# 🚀 Quick Fix: Firestore Index Error

## The Error
```
The query requires an index. You can create it here: https://console.firebase.google.com/...
```

## ⚡ Fastest Solution (30 seconds)

1. **Click the link** in your error message
2. Click **"Create Index"** button
3. Wait 1-2 minutes
4. ✅ Done! Refresh your app

## 🔧 Alternative: Deploy via CLI

```bash
cd mompulse
firebase deploy --only firestore:indexes
```

Wait 1-2 minutes for indexes to build.

## 📋 What Indexes Are Needed?

We've created `firestore.indexes.json` with these indexes:

### 1. Doctors Index
- Filter by: `status = 'active'`
- Order by: `rating` (descending)
- **Used in**: Admin panel, Consultation page

### 2. Sessions Index
- Filter by: `status = 'upcoming'`
- Order by: `date` (ascending)
- **Used in**: Admin panel, Consultation page

### 3. Content Index (Articles/Videos)
- Filter by: `section` and `status = 'published'`
- Order by: `createdAt` (descending)
- **Used in**: Sanctuary page

## ✅ Verify It's Working

After creating indexes, check:
- ✅ Admin panel loads without errors
- ✅ Consultation page shows doctors and sessions
- ✅ Sanctuary page shows articles and videos

## ⏱️ How Long Does It Take?

- Small data: **1-2 minutes**
- Medium data: **5-10 minutes**
- Large data: **15-30 minutes**

Check status: Firebase Console → Firestore → Indexes

---

**Quick Tip**: Always use the link in the error message - it's pre-configured and fastest! 🎯
