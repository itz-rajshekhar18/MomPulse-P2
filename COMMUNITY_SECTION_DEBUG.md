# Community Section Isolation - Debugging Guide

## Problem
Posts from one section (e.g., pre-pregnancy) are appearing in another section (e.g., postpartum or period).

## Changes Made to Debug

### 1. Added Console Logging
Added detailed logging to track section handling:

**Community Page (`app/community/page.tsx`):**
- Logs the section parameter from URL
- Logs the validated section value

**getCommunityPosts (`lib/firestore.ts`):**
- Logs which section is being queried
- Logs the collection path
- Logs each post found with its section value
- Logs total posts count

**createCommunityPost (`lib/firestore.ts`):**
- Logs the section parameter
- Logs the post data section
- Logs the collection path
- Validates section match before saving
- Logs the created post ID

### 2. Added Section Validation
**In `createCommunityPost`:**
```typescript
if (postData.section !== section) {
  throw new Error(`Section mismatch: postData.section !== section parameter`);
}
```

This ensures posts can't be saved to the wrong section.

## How to Test Section Isolation

### Step 1: Open Browser Console
1. Open your app in browser
2. Press F12 to open Developer Tools
3. Go to Console tab

### Step 2: Test Pre-Pregnancy Section
1. Navigate to Pre-Pregnancy Dashboard
2. Click "Community" button
3. Check console logs:
   ```
   Community Page - Section: pre-pregnancy
   Community Page - URL Param: pre-pregnancy
   getCommunityPosts - Querying section: pre-pregnancy
   getCommunityPosts - Collection path: community/pre-pregnancy/posts
   ```

4. Create a test post: "Pre-Pregnancy Test Post"
5. Check console logs:
   ```
   createCommunityPost - Creating post in section: pre-pregnancy
   createCommunityPost - Post data section: pre-pregnancy
   createCommunityPost - Collection path: community/pre-pregnancy/posts
   createCommunityPost - Post created with ID: [some-id]
   ```

6. Verify the post appears in the feed

### Step 3: Test Postpartum Section
1. Navigate to Postpartum Dashboard
2. Click "Community" button
3. Check console logs:
   ```
   Community Page - Section: postpartum
   Community Page - URL Param: postpartum
   getCommunityPosts - Querying section: postpartum
   getCommunityPosts - Collection path: community/postpartum/posts
   ```

4. **IMPORTANT**: Check if "Pre-Pregnancy Test Post" appears here
   - If it does, check the console logs for each post
   - Look for: `getCommunityPosts - Found post: { section: '...' }`
   - This will show which section each post belongs to

5. Create a test post: "Postpartum Test Post"
6. Verify only postpartum posts appear

### Step 4: Test Period Tracking Section
1. Navigate to Period Tracker Dashboard
2. Click "Community" button
3. Check console logs:
   ```
   Community Page - Section: period
   Community Page - URL Param: period
   getCommunityPosts - Querying section: period
   getCommunityPosts - Collection path: community/period/posts
   ```

4. Verify neither pre-pregnancy nor postpartum posts appear
5. Create a test post: "Period Tracking Test Post"
6. Verify only period posts appear

### Step 5: Verify in Firebase Console
1. Go to Firebase Console
2. Navigate to Firestore Database
3. Check the structure:
   ```
   community/
   ├── period/
   │   └── posts/
   │       └── [post-id] (section: "period")
   ├── pre-pregnancy/
   │   └── posts/
   │       └── [post-id] (section: "pre-pregnancy")
   └── postpartum/
       └── posts/
           └── [post-id] (section: "postpartum")
   ```

4. Verify each post is in the correct collection
5. Verify each post has the correct `section` field

## What to Look For

### If Posts Are Appearing in Wrong Section

**Check Console Logs:**
1. What section is being queried?
2. What posts are being returned?
3. What is the `section` field value for each post?

**Possible Issues:**

**Issue 1: Wrong Collection Being Queried**
```
getCommunityPosts - Querying section: pre-pregnancy
getCommunityPosts - Found post: { section: "postpartum" }
```
This means posts are in the wrong collection in Firestore.

**Solution**: Delete the misplaced posts from Firebase Console and recreate them.

**Issue 2: Section Parameter Not Being Passed**
```
Community Page - Section: general
Community Page - URL Param: null
```
This means the URL doesn't have the section parameter.

**Solution**: Check that dashboard headers are passing the correct section:
- Pre-Pregnancy: `<DashboardHeader section="pre-pregnancy" />`
- Postpartum: `<DashboardHeader section="postpartum" />`

**Issue 3: Multiple Sections Being Queried**
If you see multiple collection paths being queried, there might be a bug in the code.

**Solution**: Check the `loadPosts` function in community page.

## Expected Console Output

### Pre-Pregnancy Community
```
Community Page - Section: pre-pregnancy
Community Page - URL Param: pre-pregnancy
getCommunityPosts - Querying section: pre-pregnancy
getCommunityPosts - Collection path: community/pre-pregnancy/posts
getCommunityPosts - Found post: { id: "abc123", section: "pre-pregnancy", content: "..." }
getCommunityPosts - Total posts found: 1
```

### Postpartum Community
```
Community Page - Section: postpartum
Community Page - URL Param: postpartum
getCommunityPosts - Querying section: postpartum
getCommunityPosts - Collection path: community/postpartum/posts
getCommunityPosts - Found post: { id: "def456", section: "postpartum", content: "..." }
getCommunityPosts - Total posts found: 1
```

### Period Tracking Community
```
Community Page - Section: period
Community Page - URL Param: period
getCommunityPosts - Querying section: period
getCommunityPosts - Collection path: community/period/posts
getCommunityPosts - Found post: { id: "ghi789", section: "period", content: "..." }
getCommunityPosts - Total posts found: 1
```

## Clean Up Test Data

After testing, you can delete test posts:
1. Go to Firebase Console
2. Navigate to Firestore Database
3. Delete test posts from each section

## Remove Debug Logging (Production)

Once you've verified section isolation works, remove the console.log statements:

**Files to clean:**
- `app/community/page.tsx` - Remove useEffect with console.log
- `lib/firestore.ts` - Remove console.log from getCommunityPosts
- `lib/firestore.ts` - Remove console.log from createCommunityPost

Keep the validation in `createCommunityPost` - it's a good safety check.

## Summary

The code is designed to enforce section isolation at multiple levels:
1. **Database Structure**: Separate collections per section
2. **Query Filtering**: Only queries specific section
3. **Data Validation**: Validates section matches before saving
4. **URL Routing**: Each dashboard links to its section

If posts are appearing in wrong sections, the console logs will help identify where the issue is occurring.
