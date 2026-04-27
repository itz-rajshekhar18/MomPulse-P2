# Firestore Indexes Setup Guide

## What are Firestore Indexes?

Firestore requires composite indexes when you query with multiple conditions (e.g., filtering by `status` AND ordering by `rating`). These indexes optimize query performance.

## Error Message

If you see an error like:
```
The query requires an index. You can create it here: https://console.firebase.google.com/...
```

This means Firestore needs an index to perform your query.

## Quick Fix: Use the Link (Easiest Method)

1. **Click the link** in the error message
2. It will open Firebase Console with the index pre-configured
3. Click **"Create Index"**
4. Wait 1-2 minutes for the index to build
5. Refresh your app - the error should be gone

## Method 1: Create Indexes via Firebase Console

### For Doctors Collection
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `mompulse-5ceb8`
3. Navigate to **Firestore Database** → **Indexes**
4. Click **Create Index**
5. Configure:
   - **Collection ID**: `doctors`
   - **Fields to index**:
     - Field: `status`, Order: `Ascending`
     - Field: `rating`, Order: `Descending`
   - **Query scope**: `Collection`
6. Click **Create**

### For Sessions Collection
1. Click **Create Index**
2. Configure:
   - **Collection ID**: `sessions`
   - **Fields to index**:
     - Field: `status`, Order: `Ascending`
     - Field: `date`, Order: `Ascending`
   - **Query scope**: `Collection`
3. Click **Create**

### For Content (Articles/Videos)
1. Click **Create Index**
2. Configure:
   - **Collection ID**: `items`
   - **Collection group**: Yes (enable)
   - **Fields to index**:
     - Field: `section`, Order: `Ascending`
     - Field: `status`, Order: `Ascending`
     - Field: `createdAt`, Order: `Descending`
   - **Query scope**: `Collection group`
3. Click **Create**

## Method 2: Deploy Indexes via CLI

We've created a `firestore.indexes.json` file with all required indexes.

### Deploy Indexes

```bash
cd mompulse
firebase deploy --only firestore:indexes
```

### Check Index Status

```bash
firebase firestore:indexes
```

## Required Indexes for MomPulse

### 1. Doctors Index
**Purpose**: Fetch active doctors ordered by rating

```json
{
  "collectionGroup": "doctors",
  "fields": [
    { "fieldPath": "status", "order": "ASCENDING" },
    { "fieldPath": "rating", "order": "DESCENDING" }
  ]
}
```

**Used in**: 
- `getAllDoctors()` function
- Admin panel - Doctor Management
- Consultation page - Specialists list

### 2. Sessions Index
**Purpose**: Fetch upcoming sessions ordered by date

```json
{
  "collectionGroup": "sessions",
  "fields": [
    { "fieldPath": "status", "order": "ASCENDING" },
    { "fieldPath": "date", "order": "ASCENDING" }
  ]
}
```

**Used in**:
- `getUpcomingSessions()` function
- Admin panel - Upcoming Consultations
- Consultation page - Sessions list

### 3. Content Index (Articles & Videos)
**Purpose**: Fetch published content by section, ordered by creation date

```json
{
  "collectionGroup": "items",
  "fields": [
    { "fieldPath": "section", "order": "ASCENDING" },
    { "fieldPath": "status", "order": "ASCENDING" },
    { "fieldPath": "createdAt", "order": "DESCENDING" }
  ]
}
```

**Used in**:
- `getArticlesBySection()` function
- `getVideosBySection()` function
- Sanctuary page - Articles and Videos

## Index Building Time

- **Small collections** (< 100 documents): 1-2 minutes
- **Medium collections** (100-1000 documents): 5-10 minutes
- **Large collections** (> 1000 documents): 15-30 minutes

You can check the status in Firebase Console → Firestore → Indexes tab.

## Troubleshooting

### Issue: Index creation failed
**Solution**: 
- Check that field names match exactly (case-sensitive)
- Verify collection names are correct
- Try creating via Firebase Console instead of CLI

### Issue: Query still fails after creating index
**Solution**:
- Wait a few more minutes - indexes can take time to build
- Check index status in Firebase Console
- Verify the index status shows "Enabled" (not "Building")

### Issue: "Index already exists" error
**Solution**:
- The index is already created
- Check Firebase Console → Indexes to see existing indexes
- If the query still fails, the index might still be building

## Verification

After creating indexes, test these pages:

1. **Admin Panel** (`/admin`)
   - Should load doctors without errors
   - Should show upcoming sessions

2. **Consultation Page** (`/consultation`)
   - Should display specialists
   - Should show upcoming sessions

3. **Sanctuary Page** (`/sanctuary`)
   - Should load articles
   - Should load videos

## Files

- `firestore.indexes.json` - Index configuration file
- Can be deployed with: `firebase deploy --only firestore:indexes`

## Quick Commands

```bash
# Deploy all Firestore configurations
firebase deploy --only firestore

# Deploy only indexes
firebase deploy --only firestore:indexes

# Deploy only rules
firebase deploy --only firestore:rules

# List current indexes
firebase firestore:indexes

# Check deployment status
firebase deploy:status
```

---

**Status**: Indexes defined in `firestore.indexes.json`  
**Deployment**: Run `firebase deploy --only firestore:indexes`  
**Alternative**: Click the link in the error message to create via console
