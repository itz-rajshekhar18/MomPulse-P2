# Troubleshooting Recovery Page Data Logging

## Issue
Data is not being saved to Firestore when logging recovery information.

## Step-by-Step Debugging

### 1. Deploy Firestore Rules First
```bash
cd mompulse
firebase deploy --only firestore:rules
```

**OR** manually in Firebase Console:
1. Go to https://console.firebase.google.com
2. Select your project
3. Firestore Database → Rules
4. Copy content from `firestore.rules`
5. Click "Publish"

### 2. Check Browser Console
Open browser console (F12) and look for:

#### When Setting Up Delivery Info:
```
✅ Expected logs:
- "Saving delivery info..."
- "User ID: xxx"
- "Delivery Type: vaginal/csection"
- "Delivery Date: 2024-xx-xx"
- "First Time Mom: true/false"
- "Delivery info saved successfully!"

❌ Error logs to watch for:
- "Missing or insufficient permissions" → Rules not deployed
- "User not authenticated" → Need to log in
- "Document not found" → Path issue
```

#### When Logging Daily Check-in:
```
✅ Expected logs:
- "Starting to log daily check-in..."
- "Delivery info: {deliveryType, deliveryDate, ...}"
- "User profile: {age, ...}"
- "Days since delivery: X"
- "Previous logs count: X"
- "Input data: {...}"
- "Recovery score: XX.X"
- "Risk assessment: {level: 'low/medium/high', ...}"
- "Saving to Firestore..."
- "Saved with ID: xxx"

❌ Error logs to watch for:
- "Delivery info: null" → Delivery setup didn't save
- "User profile: null" or "age: undefined" → Age not set in onboarding
- Any Firebase error → Check rules and authentication
```

### 3. Verify Firebase Configuration

Check `lib/firebase.ts`:
```typescript
// Make sure these are set correctly
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

### 4. Check Firestore in Console

Go to Firebase Console → Firestore Database

#### Expected Structure:
```
users/
  {userId}/
    - age: 28
    - email: "user@example.com"
    - displayName: "User Name"
    
    postpartum/
      delivery/
        - deliveryType: "vaginal"
        - deliveryDate: "2024-01-15"
        - firstTimeMom: true
        - complications: []
        - notes: "First-time mother"
        - createdAt: Timestamp
        - updatedAt: Timestamp
    
    recoveryLogs/
      {autoId}/
        - day: 14
        - deliveryType: "vaginal"
        - sleep: 6.5
        - pain: 4
        - bleeding: 2
        - energy: 7
        - activity: 2500
        - mood: 8
        - fever: false
        - age: 28
        - firstTimeMom: true
        - recoveryScore: 72.5
        - riskLevel: "low"
        - createdAt: Timestamp
        - updatedAt: Timestamp
```

### 5. Common Issues and Fixes

#### Issue: "Age information is required"
**Fix:** 
1. Go to onboarding page
2. Enter age (13-60)
3. Complete onboarding
4. Age should be saved to user profile

#### Issue: "Please set up your delivery information first"
**Fix:**
1. Go to /recovery page
2. Click "Set Up Recovery Tracking"
3. Fill in all fields
4. Click "Start Recovery Tracking"
5. Check console for success message

#### Issue: "Missing or insufficient permissions"
**Fix:**
1. Deploy Firestore rules: `firebase deploy --only firestore:rules`
2. Wait 1-2 minutes for rules to propagate
3. Refresh the page
4. Try again

#### Issue: Data saves but doesn't show in components
**Fix:**
1. Check if components are fetching data on mount
2. Add `console.log` in useEffect to see fetched data
3. Verify user is authenticated
4. Check if userId matches in Firestore

### 6. Test Sequence

#### Test 1: Setup Delivery Info
1. Open /recovery page
2. Open browser console (F12)
3. Click "Set Up Recovery Tracking"
4. Fill form and submit
5. Check console for logs
6. Check Firestore for `/users/{userId}/postpartum/delivery`

#### Test 2: Log Daily Check-in
1. Stay on /recovery page
2. Adjust all sliders
3. Click "Log Today"
4. Check console for logs
5. Check Firestore for `/users/{userId}/recoveryLogs/{id}`

#### Test 3: Verify Data Display
1. Refresh /recovery page
2. Check RecoveryTimeline shows correct week
3. Check RecoveryMetrics shows real data
4. Check console for any fetch errors

### 7. Manual Firestore Test

If nothing works, test Firestore directly:

```javascript
// Open browser console on your app
// Run this code:

const { db } = await import('./lib/firebase');
const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
const { auth } = await import('./lib/firebase');

const userId = auth.currentUser.uid;

// Test 1: Save delivery info
await setDoc(doc(db, 'users', userId, 'postpartum', 'delivery'), {
  deliveryType: 'vaginal',
  deliveryDate: '2024-01-15',
  firstTimeMom: true,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
});
console.log('✅ Delivery info saved!');

// Test 2: Save recovery log
const { collection, addDoc } = await import('firebase/firestore');
await addDoc(collection(db, 'users', userId, 'recoveryLogs'), {
  day: 1,
  sleep: 6,
  pain: 4,
  bleeding: 2,
  energy: 7,
  activity: 2000,
  mood: 8,
  fever: false,
  age: 28,
  firstTimeMom: true,
  deliveryType: 'vaginal',
  recoveryScore: 70,
  riskLevel: 'low',
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
});
console.log('✅ Recovery log saved!');
```

### 8. Check Network Tab

1. Open DevTools → Network tab
2. Filter by "firestore"
3. Try to save data
4. Look for failed requests (red)
5. Click on failed request to see error details

### 9. Verify Authentication

```javascript
// In browser console:
const { auth } = await import('./lib/firebase');
console.log('Current user:', auth.currentUser);
console.log('User ID:', auth.currentUser?.uid);
console.log('Email:', auth.currentUser?.email);
```

If null → User not logged in → Log in first

### 10. Last Resort: Clear Everything

1. Log out
2. Clear browser cache
3. Clear local storage
4. Close all tabs
5. Restart browser
6. Log in again
7. Try the flow from scratch

## Contact Points

If still not working, provide:
1. Screenshot of browser console errors
2. Screenshot of Firestore rules in console
3. Screenshot of Firestore data structure
4. Network tab screenshot showing failed requests
5. User ID being used
