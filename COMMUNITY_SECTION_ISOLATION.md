# Community Section Isolation

## Overview
Posts in each community section are completely isolated from other sections. A post created in the pre-pregnancy community will NEVER appear in the postpartum or period tracking communities.

## How Section Isolation Works

### 1. Database-Level Isolation
Posts are stored in separate Firestore collections by section:

```
/community/period/posts/{postId}
/community/pre-pregnancy/posts/{postId}
/community/postpartum/posts/{postId}
/community/general/posts/{postId}
```

Each section has its own collection, so posts are physically separated in the database.

### 2. Query-Level Filtering
When loading posts, the app queries only the specific section:

```typescript
// In community page
const section = searchParams.get('section') || 'general';
const posts = await getCommunityPosts(section, 50);

// This queries: /community/{section}/posts/
// Example: /community/pre-pregnancy/posts/
```

### 3. Navigation-Level Routing
Each dashboard section links to its own community:

**Period Tracker:**
- URL: `/community?section=period`
- Shows: Period tracking posts only
- Header: PeriodTrackerHeader

**Pre-Pregnancy:**
- URL: `/community?section=pre-pregnancy`
- Shows: Pre-pregnancy posts only
- Header: DashboardHeader

**Postpartum:**
- URL: `/community?section=postpartum`
- Shows: Postpartum posts only
- Header: DashboardHeader

**General (fallback):**
- URL: `/community` or `/community?section=general`
- Shows: General posts only
- Header: DashboardHeader

### 4. Firestore Rules Enforcement
The Firestore rules validate that posts match their section:

```javascript
// When creating a post
function isValidPost() {
  return request.resource.data.section == section &&
         request.resource.data.userId == request.auth.uid;
}
```

This ensures:
- A post in `/community/period/posts/` MUST have `section: "period"`
- A post in `/community/pre-pregnancy/posts/` MUST have `section: "pre-pregnancy"`
- Mismatched sections are rejected at the database level

## Section Flow Examples

### Example 1: Pre-Pregnancy User
1. User navigates to Pre-Pregnancy dashboard
2. Clicks "Community" button
3. Redirected to `/community?section=pre-pregnancy`
4. App loads posts from `/community/pre-pregnancy/posts/`
5. User creates a post
6. Post saved to `/community/pre-pregnancy/posts/{postId}` with `section: "pre-pregnancy"`
7. Post appears ONLY in pre-pregnancy community

### Example 2: Period Tracker User
1. User navigates to Period Tracker dashboard
2. Clicks "Community" button
3. Redirected to `/community?section=period`
4. App loads posts from `/community/period/posts/`
5. User creates a post
6. Post saved to `/community/period/posts/{postId}` with `section: "period"`
7. Post appears ONLY in period tracking community

### Example 3: Postpartum User
1. User navigates to Postpartum dashboard
2. Clicks "Community" button
3. Redirected to `/community?section=postpartum`
4. App loads posts from `/community/postpartum/posts/`
5. User creates a post
6. Post saved to `/community/postpartum/posts/{postId}` with `section: "postpartum"`
7. Post appears ONLY in postpartum community

## Cross-Section Prevention

### What Prevents Cross-Section Visibility?

1. **Separate Collections**: Each section has its own Firestore collection
2. **Query Filtering**: Queries target specific section collections
3. **URL Parameters**: Section is determined by URL parameter
4. **Data Validation**: Firestore rules validate section matches collection path
5. **No Cross-Section Queries**: No code queries multiple sections simultaneously

### Can Users See Posts from Other Sections?

**NO.** Here's why:

- **Database Structure**: Posts are in separate collections
- **Query Scope**: `getCommunityPosts(section)` only queries one section
- **No Collection Group Queries**: We don't use `collectionGroup('posts')` for listing
- **Navigation Isolation**: Each dashboard links to its own section

### Can Users Post to Wrong Section?

**NO.** Here's why:

- **Section Parameter**: Modal receives section from page context
- **Data Validation**: Post data includes section field
- **Firestore Rules**: Rules reject posts with mismatched sections
- **Client-Side Validation**: Section is set automatically, not user-selectable

## Testing Section Isolation

### Test 1: Create Posts in Different Sections
```
1. Go to Period Tracker → Community
2. Create post "Period Test Post"
3. Go to Pre-Pregnancy → Community
4. Verify "Period Test Post" does NOT appear
5. Create post "Pre-Pregnancy Test Post"
6. Go to Postpartum → Community
7. Verify neither post appears
```

### Test 2: Verify Database Structure
```
1. Open Firebase Console
2. Navigate to Firestore Database
3. Check collections:
   - community/period/posts/ (has period posts)
   - community/pre-pregnancy/posts/ (has pre-pregnancy posts)
   - community/postpartum/posts/ (has postpartum posts)
4. Verify posts are in correct collections
```

### Test 3: Verify URL Parameters
```
1. Period Tracker Community: /community?section=period
2. Pre-Pregnancy Community: /community?section=pre-pregnancy
3. Postpartum Community: /community?section=postpartum
4. Each URL shows different posts
```

## Code References

### Navigation Links
**Period Tracker Header:**
```typescript
href: '/community?section=period'
```

**Dashboard Header (Pre-Pregnancy):**
```typescript
<DashboardHeader userName={userName} section="pre-pregnancy" />
// Links to: /community?section=pre-pregnancy
```

**Dashboard Header (Postpartum):**
```typescript
<DashboardHeader userName={userName} section="postpartum" />
// Links to: /community?section=postpartum
```

### Post Loading
```typescript
// Community page determines section from URL
const section = searchParams.get('section') || 'general';

// Loads posts only from that section
const posts = await getCommunityPosts(section, 50);
```

### Post Creation
```typescript
// Modal receives section from page
<CreatePostModal section={section} ... />

// Post is saved to correct collection
await createCommunityPost(section, {
  userId,
  userName,
  content,
  section, // Must match collection path
});
```

### Firestore Rules
```javascript
match /community/{section}/posts/{postId} {
  function isValidPost() {
    // Ensures post.section matches collection path
    return request.resource.data.section == section;
  }
  
  allow create: if isValidPost();
}
```

## Summary

✅ **Database-Level Isolation**: Separate collections per section
✅ **Query-Level Filtering**: Only queries specific section
✅ **Navigation-Level Routing**: Each dashboard links to its section
✅ **Rules-Level Validation**: Firestore rules enforce section matching
✅ **No Cross-Section Visibility**: Posts stay in their section
✅ **No Cross-Section Posting**: Users can't post to wrong section

**Result**: Complete isolation between community sections. Pre-pregnancy posts will NEVER appear in postpartum or period tracking communities, and vice versa.
