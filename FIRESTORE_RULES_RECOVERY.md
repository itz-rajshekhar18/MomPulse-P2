# Firestore Rules for Recovery Page - Updated

## Rule Enforcement

### 1. **Delivery Information Must Be Set Up First**

The Firestore rules now enforce that users **MUST** set up their delivery information before they can log daily recovery data.

```javascript
// Recovery logs can only be created if delivery info exists
allow create: if isAuthenticated() && isOwner(userId) && 
  exists(/databases/$(database)/documents/users/$(userId)/postpartum/delivery);
```

### 2. **Data Flow Sequence**

#### Step 1: User Sets Up Delivery Info
```
Path: /users/{userId}/postpartum/delivery

Required Fields:
- deliveryType: "vaginal" | "csection"
- deliveryDate: "YYYY-MM-DD"
- firstTimeMom: boolean
- complications: string[] (optional)
- notes: string (optional)

Rule: ✅ Allowed (no prerequisites)
```

#### Step 2: User Logs Daily Recovery Data
```
Path: /users/{userId}/recoveryLogs/{logId}

Required Fields:
- day: number
- deliveryType: string
- sleep: number
- pain: number
- bleeding: number
- energy: number
- activity: number
- mood: number
- fever: boolean
- age: number
- firstTimeMom: boolean
- recoveryScore: number
- riskLevel: string

Rule: ✅ Allowed ONLY if delivery info exists
Rule: ❌ Blocked if delivery info doesn't exist
```

## Security Benefits

1. **Data Integrity**: Ensures recovery logs always have valid delivery context
2. **ML Model Accuracy**: Guarantees all required data for ML predictions exists
3. **User Experience**: Forces proper onboarding flow
4. **Data Consistency**: Prevents orphaned recovery logs without delivery info

## Error Handling

### When User Tries to Log Without Delivery Info:

**Firestore Error:**
```
FirebaseError: Missing or insufficient permissions
```

**App Behavior:**
- DailyCheckIn component checks for delivery info before saving
- Shows user-friendly error: "Please set up your delivery information first"
- Redirects to setup modal or recovery page with blur overlay

## Testing the Rules

### Test 1: Try to Create Recovery Log Without Delivery Info
```javascript
// This will FAIL ❌
await saveRecoveryLog(userId, {
  day: 1,
  sleep: 6,
  // ... other fields
});

// Error: Permission denied (delivery info doesn't exist)
```

### Test 2: Create Delivery Info First, Then Log
```javascript
// Step 1: Create delivery info ✅
await saveDeliveryInfo(userId, {
  deliveryType: 'vaginal',
  deliveryDate: '2024-01-15',
  firstTimeMom: true
});

// Step 2: Now recovery log works ✅
await saveRecoveryLog(userId, {
  day: 1,
  sleep: 6,
  // ... other fields
});
```

## Rule Breakdown

### Postpartum Collection Rules
```javascript
match /users/{userId}/postpartum/{document=**} {
  allow read: if isAuthenticated() && isOwner(userId);
  allow write: if isAuthenticated() && isOwner(userId);
}
```
- ✅ No prerequisites
- ✅ Can be created anytime
- ✅ User must be authenticated and owner

### Recovery Logs Collection Rules
```javascript
match /users/{userId}/recoveryLogs/{logId} {
  allow read: if isAuthenticated() && isOwner(userId);
  
  // CREATE requires delivery info to exist
  allow create: if isAuthenticated() && isOwner(userId) && 
    exists(/databases/$(database)/documents/users/$(userId)/postpartum/delivery);
  
  allow update: if isAuthenticated() && isOwner(userId);
  allow delete: if isAuthenticated() && isOwner(userId);
}
```
- ✅ Read: Anytime (if authenticated and owner)
- ✅ Create: ONLY if delivery info exists
- ✅ Update: Anytime (if authenticated and owner)
- ✅ Delete: Anytime (if authenticated and owner)

## UI Flow

### Recovery Page Load:
1. Check if delivery info exists
2. If NO → Show blur overlay + setup modal
3. If YES → Show full page with daily check-in

### Daily Check-in Submit:
1. User fills out form
2. Clicks "Log Today"
3. App checks delivery info exists (client-side)
4. If NO → Show error message
5. If YES → Save to Firestore (server-side rule validates again)

## Deployment

To deploy these rules:

```bash
cd mompulse
firebase deploy --only firestore:rules
```

Or use the deploy script:
```bash
./deploy-rules.bat
```

## Summary

✅ **Delivery info must be set up first**
✅ **Recovery logs can only be created after delivery setup**
✅ **Rules enforce proper data flow**
✅ **Better data integrity and ML model accuracy**
✅ **Improved user experience with proper onboarding**
