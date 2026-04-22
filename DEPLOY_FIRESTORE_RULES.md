# Deploy Firestore Rules for Cycle Tracking

## ✅ Rules Already Updated!

The Firestore rules have been updated to include cycle data storage. Here's what's included:

### Cycle Data Rules (Lines 66-72)
```javascript
// Period cycles subcollection - users can only access their own cycle data
match /users/{userId}/cycles/{cycleId} {
  allow read: if isAuthenticated() && isOwner(userId);
  allow create: if isAuthenticated() && isOwner(userId);
  allow update: if isAuthenticated() && isOwner(userId);
  allow delete: if isAuthenticated() && isOwner(userId);
}
```

### What This Means:
- ✅ Users can **create** their own cycle data
- ✅ Users can **read** their own cycle data
- ✅ Users can **update** their own cycle data
- ✅ Users can **delete** their own cycle data
- ❌ Users **cannot** access other users' cycle data
- ❌ Unauthenticated users **cannot** access any cycle data

## 🚀 Deploy the Rules

### Method 1: Firebase Console (Web UI)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **mompulse-5ceb8**
3. Click **Firestore Database** in the left menu
4. Click the **Rules** tab at the top
5. Copy the entire content from `firestore.rules` file
6. Paste it into the editor
7. Click **Publish**

### Method 2: Firebase CLI (Command Line)

```bash
# 1. Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# 2. Login to Firebase
firebase login

# 3. Initialize Firebase in your project (if not already done)
cd mompulse
firebase init firestore
# Select: Use an existing project
# Choose: mompulse-5ceb8
# Firestore rules file: firestore.rules (press Enter)
# Firestore indexes file: firestore.indexes.json (press Enter)

# 4. Deploy the rules
firebase deploy --only firestore:rules
```

### Method 3: Quick Deploy (If Already Initialized)

```bash
cd mompulse
firebase deploy --only firestore:rules
```

## 📊 Data Structure

When a user logs a cycle, it's stored as:

```
users/{userId}/cycles/{cycleId}
  ├── start_date: "2024-01-01"
  ├── end_date: "2024-01-05"
  ├── symptoms: ["Cramps", "Fatigue"]
  ├── flow_intensity: "medium"
  ├── notes: "Normal cycle"
  ├── createdAt: Timestamp
  └── updatedAt: Timestamp
```

### Example Document Path:
```
users/abc123xyz/cycles/cycle_001
```

## 🔒 Security Features

### 1. Authentication Required
```javascript
function isAuthenticated() {
  return request.auth != null;
}
```
Only logged-in users can access cycle data.

### 2. Owner Verification
```javascript
function isOwner(userId) {
  return request.auth.uid == userId;
}
```
Users can only access their own data.

### 3. Combined Protection
```javascript
allow read: if isAuthenticated() && isOwner(userId);
```
Both conditions must be true.

## ✅ Testing the Rules

### Test 1: Create Cycle (Should Work)
```javascript
// User is authenticated and creating their own cycle
const userId = auth.currentUser.uid;
await addDoc(collection(db, 'users', userId, 'cycles'), {
  start_date: '2024-01-01',
  end_date: '2024-01-05',
  symptoms: ['Cramps'],
  flow_intensity: 'medium',
  notes: '',
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
});
// ✅ SUCCESS
```

### Test 2: Read Own Cycles (Should Work)
```javascript
// User is authenticated and reading their own cycles
const userId = auth.currentUser.uid;
const cycles = await getDocs(collection(db, 'users', userId, 'cycles'));
// ✅ SUCCESS
```

### Test 3: Read Other User's Cycles (Should Fail)
```javascript
// User is authenticated but trying to read another user's cycles
const otherUserId = 'different-user-id';
const cycles = await getDocs(collection(db, 'users', otherUserId, 'cycles'));
// ❌ PERMISSION DENIED
```

### Test 4: Unauthenticated Access (Should Fail)
```javascript
// User is not logged in
await signOut(auth);
const cycles = await getDocs(collection(db, 'users', 'any-user-id', 'cycles'));
// ❌ PERMISSION DENIED
```

## 🧪 Test in Firebase Console

1. Go to Firebase Console → Firestore Database
2. Click **Rules** tab
3. Click **Rules Playground** button
4. Test different scenarios:

**Test Read:**
```
Location: /users/USER_ID/cycles/CYCLE_ID
Authenticated: Yes
Auth UID: USER_ID
Operation: get
Result: ✅ Allowed
```

**Test Write:**
```
Location: /users/USER_ID/cycles/CYCLE_ID
Authenticated: Yes
Auth UID: USER_ID
Operation: create
Result: ✅ Allowed
```

## 📝 Verification Checklist

After deploying, verify:

- [ ] Rules deployed successfully (no errors)
- [ ] Users can log cycles through the app
- [ ] Cycles appear in Firestore Database
- [ ] Users can view their own cycles
- [ ] Users cannot view other users' cycles
- [ ] ML predictions work with stored data
- [ ] Insights page shows predictions

## 🔄 How Data Flows

```
User logs cycle in UI
         ↓
CycleLogModal component
         ↓
saveCycleData() function
         ↓
Firestore Security Rules Check
         ↓
✅ Authenticated? → ✅ Owner? → ✅ Allow
         ↓
Data saved to Firestore
         ↓
users/{userId}/cycles/{cycleId}
         ↓
getUserCycles() fetches data
         ↓
ML Backend receives data
         ↓
Predictions generated
         ↓
Displayed in UI
```

## 🚨 Common Issues

### Issue 1: Permission Denied
**Error:** `Missing or insufficient permissions`

**Solution:**
- Check if user is logged in
- Verify rules are deployed
- Check userId matches auth.currentUser.uid

### Issue 2: Rules Not Updating
**Error:** Old rules still active

**Solution:**
```bash
firebase deploy --only firestore:rules --force
```

### Issue 3: Can't Deploy Rules
**Error:** `Firebase CLI not initialized`

**Solution:**
```bash
cd mompulse
firebase init firestore
firebase deploy --only firestore:rules
```

## 📚 Additional Resources

- [Firestore Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Rules Testing Guide](https://firebase.google.com/docs/firestore/security/test-rules-emulator)
- [Common Security Patterns](https://firebase.google.com/docs/firestore/security/rules-conditions)

## ✅ Success!

Once deployed, your cycle tracking system is fully secured and ready to use! Users can:
- ✅ Log their period cycles
- ✅ View their cycle history
- ✅ Get ML-powered predictions
- ✅ Track fertility windows
- ✅ Receive personalized insights

All data is private and secure! 🔒
