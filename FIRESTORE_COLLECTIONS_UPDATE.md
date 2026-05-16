# Firestore Collections Update

## Summary
Updated the application to fetch articles, videos, and sessions from the new Firestore collections with approval status filtering.

## Changes Made

### 1. Articles and Videos Collection
**Old Collection Structure:**
- `content/articles/items` - for articles
- `content/videos/items` - for videos
- Status field: `published`

**New Collection Structure:**
- `doctorContent` - for both articles and videos
- Status field: `approved` (only approved content is shown)
- Type field: `article` or `video` (to differentiate content types)

### 2. Sessions Collection
**Old Collection:**
- `sessions` - with status filter for `upcoming`

**New Collection:**
- `doctorSessions` - with status filter for `approved`
- Additional `sessionStatus` field for session state (upcoming, ongoing, completed, cancelled)

## Updated Functions in `lib/firestore.ts`

### Articles Functions
1. **`getArticlesBySection(section, limitCount)`**
   - Now fetches from `doctorContent` collection
   - Filters by `status === 'approved'`
   - Filters by `section` matching user's stage
   - Excludes video type content

2. **`getAllArticles()`**
   - Fetches all articles from `doctorContent`
   - Filters out video type content
   - Used for admin purposes

3. **`updateArticle(articleId, updates)`**
   - Updates documents in `doctorContent` collection

4. **`deleteArticle(articleId)`**
   - Deletes documents from `doctorContent` collection

5. **`incrementArticleViews(articleId)`**
   - Increments view count in `doctorContent` collection

### Videos Functions
1. **`getVideosBySection(section, limitCount)`**
   - Now fetches from `doctorContent` collection
   - Filters by `status === 'approved'`
   - Filters by `type === 'video'`
   - Filters by `section` matching user's stage

2. **`getAllVideos()`**
   - Fetches all videos from `doctorContent`
   - Filters by `type === 'video'`
   - Used for admin purposes

3. **`updateVideo(videoId, updates)`**
   - Updates documents in `doctorContent` collection

4. **`deleteVideo(videoId)`**
   - Deletes documents from `doctorContent` collection

5. **`incrementVideoViews(videoId)`**
   - Increments view count in `doctorContent` collection

### Sessions Functions
1. **`getUpcomingSessions(limitCount)`**
   - Now fetches from `doctorSessions` collection
   - Filters by `status === 'approved'`
   - Maps `sessionStatus` field to `status` for display
   - Sorts by date (earliest first)

2. **`getAllSessions()`** (NEW)
   - Fetches all sessions from `doctorSessions`
   - No status filtering (for admin purposes)
   - Sorts by date (most recent first)

## Firestore Document Structure

### doctorContent Collection
```javascript
{
  id: string,
  title: string,
  excerpt: string,
  content: string,
  author: string,
  category: string,
  section: 'period' | 'pre-pregnancy' | 'pregnancy' | 'postpartum' | 'general',
  status: 'approved' | 'pending' | 'rejected',
  type: 'article' | 'video', // Differentiates content type
  imageUrl?: string,
  thumbnailUrl?: string, // For videos
  videoUrl?: string, // For videos
  duration?: string, // For videos
  readTime?: number, // For articles
  views: number,
  likes: number,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### doctorSessions Collection
```javascript
{
  id: string,
  title: string,
  description?: string,
  date: string,
  time: string,
  duration?: number,
  attendees: number,
  maxAttendees?: number,
  instructor?: string,
  category: string,
  color: 'pink' | 'green' | 'purple' | 'blue' | 'teal',
  status: 'approved' | 'pending' | 'rejected', // Approval status
  sessionStatus: 'upcoming' | 'ongoing' | 'completed' | 'cancelled', // Session state
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## Pages Affected
1. **`/sanctuary`** - Displays approved articles and videos
2. **`/dashboard/pregnancy/sessions`** - Displays approved sessions
3. Any admin pages that manage content

## Testing Checklist
- [ ] Verify articles are fetched from `doctorContent` with `status === 'approved'`
- [ ] Verify videos are fetched from `doctorContent` with `status === 'approved'` and `type === 'video'`
- [ ] Verify sessions are fetched from `doctorSessions` with `status === 'approved'`
- [ ] Verify content is filtered by user's section/stage
- [ ] Verify admin functions can access all content regardless of approval status
- [ ] Test article/video view increment functionality
- [ ] Test update and delete operations

## Migration Notes
If you have existing data in the old collections (`content/articles/items`, `content/videos/items`, `sessions`), you'll need to:
1. Migrate data to new collections (`doctorContent`, `doctorSessions`)
2. Add `status: 'approved'` field to all existing documents
3. Add `type: 'article'` or `type: 'video'` field to content documents
4. For sessions, rename `status` to `sessionStatus` and add new `status: 'approved'` field
