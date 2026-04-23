# Firestore Cycle Logging Debug Guide

## Quick Checks

### 1. Check if Firestore Rules are Deployed

Run this command to deploy the rules:
```bash
cd mompulse
firebase deploy --only firestore:rules
```

Or use the batch file:
```bash
deploy-rules.bat
```

### 2. Verify Rules in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Firestore Database** → **Rules**
4. Check if the rules match the content in `firestore.rules`
5. Look for this section:
```
match /users/{userId}/cycles/{cycleId} {
  allow read: if isAuthenticated() && isOwner(userId);
  allow create: if isAuthenticated() && isOwner(userId);
  allow update: if isAuthenticated() && isOwner(userId);
  allow delete: if isAuthenticated() && isOwner(userId);
}
```

### 3. Check Browser Console for Errors

1. Open your app in the browser
2. Press `F12` to open Developer Tools
3. Go to **Console** tab
4. Try to log a cycle
5. Look for any error messages (red text)

Common errors:
- `Permission denied` - Rules not deployed or incorrect
- `Network error` - Firebase not initialized
- `Auth error` - User not logged in

### 4. Verify Firebase Initialization

Check if Firebase is initialized in your app:

1. Open browser console
2. Type: `firebase.apps.length`
3. Should return `1` or more (not `0`)

### 5. Check User Authentication

In browser console:
```javascript
firebase.auth().currentUser
```

Should return user object with `uid`, not `null`

### 6. Test Cycle Save Manually

Open browser console and run:
```javascript
// Get current user
const user = firebase.auth().currentUser;
console.log('User:', user?.uid);

// Try to save a test cycle
const db = firebase.firestore();
db.collection('users').doc(user.uid).collection('cycles').add({
  start_date: '2024-01-01',
  end_date: '2024-01-05',
  symptoms: ['Cramps'],
  flow_intensity: 'medium',
  notes: 'Test cycle',
  userId: user.uid,
  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  updatedAt: firebase.firestore.FieldValue.serverTimestamp()
}).then(docRef => {
  console.log('✅ Cycle saved! ID:', docRef.id);
}).catch(error => {
  console.error('❌ Error:', error);
});
```

### 7. Check Firestore Database

1. Go to Firebase Console
2. Navigate to **Firestore Database**
3. Look for this path:
   ```
   users → {your-user-id} → cycles → {cycle-id}
   ```
4. You should see documents with:
   - start_date
   - end_date
   - symptoms
   - flow_intensity
   - notes
   - createdAt
   - updatedAt

### 8. Check Network Tab

1. Open Developer Tools → **Network** tab
2. Try to log a cycle
3. Look for requests to:
   - Firestore API (firestore.googleapis.com)
   - ML prediction API (/api/ml/period-prediction)
4. Check response status:
   - `200` = Success
   - `403` = Permission denied
   - `500` = Server error

### 9. Enable Firestore Debug Logging

Add this to your `lib/firebase.ts`:
```typescript
import { enableIndexedDbPersistence } from 'firebase/firestore';

// Enable debug logging
if (typeof window !== 'undefined') {
  (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}
```

### 10. Test with Simple Form

Create a test page at `app/test-cycle/page.tsx`:
```typescript
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { saveCycleData } from '@/lib/firestore';
import { useState } from 'react';

export default function TestCyclePage() {
  const { user } = useAuth();
  const [result, setResult] = useState('');

  const testSave = async () => {
    if (!user) {
      setResult('❌ No user logged in');
      return;
    }

    try {
      const cycleId = await saveCycleData(user.uid, {
        start_date: '2024-01-01',
        end_date: '2024-01-05',
        symptoms: ['Cramps', 'Headache'],
        flow_intensity: 'medium',
        notes: 'Test cycle from debug page'
      });
      
      setResult(`✅ Success! Cycle ID: ${cycleId}`);
    } catch (error: any) {
      setResult(`❌ Error: ${error.message}`);
      console.error('Full error:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Cycle Save</h1>
      <button
        onClick={testSave}
        className="px-6 py-3 bg-purple-600 text-white rounded-lg"
      >
        Test Save Cycle
      </button>
      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
}
```

Visit: `http://localhost:3000/test-cycle`

## Common Issues & Solutions

### Issue 1: "Permission Denied"
**Solution:**
1. Deploy Firestore rules: `firebase deploy --only firestore:rules`
2. Check user is logged in
3. Verify userId matches in rules

### Issue 2: "Network Error"
**Solution:**
1. Check internet connection
2. Verify Firebase config in `.env.local`
3. Check Firebase project is active

### Issue 3: Cycles Not Showing
**Solution:**
1. Check Firestore console for data
2. Verify `getUserCycles()` is being called
3. Check component is re-rendering after save

### Issue 4: ML Prediction Not Triggering
**Solution:**
1. This is non-blocking - cycle still saves
2. Check ML backend is running (optional)
3. Fallback prediction should work automatically

## Verification Checklist

- [ ] Firestore rules deployed
- [ ] User is authenticated
- [ ] Firebase initialized
- [ ] No console errors
- [ ] Network requests successful
- [ ] Data appears in Firestore console
- [ ] Cycles display in UI

## Still Not Working?

1. **Check Firebase Console Logs:**
   - Go to Firebase Console
   - Navigate to **Functions** → **Logs** (if using Cloud Functions)

2. **Check Browser Storage:**
   - Open DevTools → **Application** tab
   - Check **IndexedDB** → **firebaseLocalStorage**
   - Should see cached data

3. **Try Incognito Mode:**
   - Sometimes cache issues cause problems
   - Test in incognito/private window

4. **Check Firebase Project:**
   - Verify correct project is selected
   - Check project has Firestore enabled
   - Verify billing is active (if required)

## Contact Support

If still having issues, provide:
1. Browser console errors (screenshot)
2. Network tab showing failed requests
3. Firestore rules from console
4. Firebase config (without sensitive keys)
