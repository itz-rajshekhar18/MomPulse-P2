# Community Firestore Rules & Functions Update

## Summary
Updated Firestore rules and library functions to support section-based community features with proper security and data validation.

## Changes Made

### 1. Firestore Rules (`firestore.rules`)

#### Added Community Post Rules
- **Path**: `/community/{section}/posts/{postId}`
- **Sections**: `period`, `pre-pregnancy`, `postpartum`, `general`
- **Security**:
  - All authenticated users can read posts from any section
  - Users can create posts with validated data (1-5000 chars)
  - Only post owners can update/delete their posts
  - Validates section type and user ownership

#### Added Comment Rules
- **Path**: `/community/{section}/posts/{postId}/comments/{commentId}`
- **Security**:
  - All authenticated users can read comments
  - Users can create comments with validated data (1-2000 chars)
  - Only comment owners can update/delete their comments

#### Added Like Rules
- **Path**: `/community/{section}/posts/{postId}/likes/{likeId}`
- **Security**:
  - All authenticated users can read likes
  - Users can only create/delete their own likes (likeId must match userId)

#### Added Community Profile Rules
- **Path**: `/communityProfiles/{userId}`
- **Security**:
  - All authenticated users can read profiles
  - Users can only create/update/delete their own profile

#### Added Topics Rules
- **Path**: `/community/{section}/topics/{topicId}`
- **Security**:
  - All authenticated users can read topics
  - Write access disabled (admin-only in future)

### 2. Firestore Library (`lib/firestore.ts`)

#### Added Type Definitions
```typescript
- CommunitySection: 'period' | 'pre-pregnancy' | 'postpartum' | 'general'
- CommunityPost: Post data structure
- CommunityComment: Comment data structure
- CommunityLike: Like data structure
- CommunityProfile: User profile data structure
```

#### Added Functions

**Post Management:**
- `createCommunityPost()` - Create a new post in a section
- `getCommunityPosts()` - Get posts from a section (with limit)
- `getCommunityPost()` - Get a single post by ID
- `updateCommunityPost()` - Update post content/topics/image
- `deleteCommunityPost()` - Delete a post
- `getUserPosts()` - Get all posts by a user (optionally filtered by section)

**Comment Management:**
- `addComment()` - Add a comment to a post
- `getPostComments()` - Get all comments for a post
- `deleteComment()` - Delete a comment

**Like Management:**
- `likePost()` - Like a post
- `unlikePost()` - Unlike a post
- `hasUserLikedPost()` - Check if user has liked a post
- `getPostLikes()` - Get all likes for a post

**Profile Management:**
- `getCommunityProfile()` - Get user's community profile
- `createOrUpdateCommunityProfile()` - Create or update profile
- `getTopContributors()` - Get top users by reputation

**Helper Functions (Internal):**
- `incrementUserPostCount()` - Update stats when post created
- `decrementUserPostCount()` - Update stats when post deleted
- `incrementUserCommentCount()` - Update stats when comment created
- `decrementUserCommentCount()` - Update stats when comment deleted

### 3. Reputation System

Users earn reputation points automatically:
- **Create post**: +5 points
- **Add comment**: +2 points
- **Delete post**: -5 points
- **Delete comment**: -2 points

Reputation is tracked in `communityProfiles` collection and used for:
- Displaying top contributors
- Future badge system
- Content prioritization

### 4. Data Validation

**Post Validation:**
- Required fields: userId, userName, content, section, createdAt
- Content length: 1-5000 characters
- userId must match authenticated user
- section must match collection path

**Comment Validation:**
- Required fields: userId, userName, content, createdAt
- Content length: 1-2000 characters
- userId must match authenticated user

**Section Validation:**
- Only allows: 'period', 'pre-pregnancy', 'postpartum', 'general'
- Enforced at Firestore rules level

### 5. Context-Aware Community Page

**Navigation Updates:**
- Period Tracker → Community: `/community?section=period` (shows PeriodTrackerHeader)
- Pre-Pregnancy → Community: `/community` (shows DashboardHeader)
- Postpartum → Community: `/community` (shows DashboardHeader)

**Files Modified:**
- `components/dashboard/PeriodTrackerHeader.tsx` - Added `?section=period` to Community link
- `app/community/page.tsx` - Conditional header based on section parameter

## Database Structure

```
Firestore Database
│
├── community/
│   ├── period/
│   │   ├── posts/
│   │   │   └── {postId}/
│   │   │       ├── userId: string
│   │   │       ├── userName: string
│   │   │       ├── content: string
│   │   │       ├── section: "period"
│   │   │       ├── likesCount: number
│   │   │       ├── commentsCount: number
│   │   │       ├── comments/
│   │   │       │   └── {commentId}/
│   │   │       └── likes/
│   │   │           └── {userId}/
│   │   └── topics/
│   │       └── {topicId}/
│   │
│   ├── pre-pregnancy/
│   │   ├── posts/
│   │   └── topics/
│   │
│   ├── postpartum/
│   │   ├── posts/
│   │   └── topics/
│   │
│   └── general/
│       ├── posts/
│       └── topics/
│
└── communityProfiles/
    └── {userId}/
        ├── userName: string
        ├── postsCount: number
        ├── commentsCount: number
        ├── reputation: number
        ├── badges: string[]
        └── joinedAt: Timestamp
```

## Deployment Instructions

### Deploy Firestore Rules
```bash
cd mompulse
firebase deploy --only firestore:rules
```

Or use the batch file:
```bash
./deploy-rules.bat
```

### Verify Deployment
1. Check Firebase Console → Firestore → Rules
2. Verify rules version and timestamp
3. Test creating a post from the app
4. Verify security rules are enforced

## Testing Checklist

- [ ] Create a post in period section
- [ ] Create a post in pre-pregnancy section
- [ ] Create a post in postpartum section
- [ ] Add comments to posts
- [ ] Like/unlike posts
- [ ] Verify only post owner can delete their post
- [ ] Verify only comment owner can delete their comment
- [ ] Check reputation points are awarded correctly
- [ ] Verify section validation (invalid sections rejected)
- [ ] Test content length validation (max 5000 chars for posts)
- [ ] Test navigation context (correct header shows on community page)
- [ ] Verify getUserPosts returns correct posts
- [ ] Test getTopContributors returns users by reputation

## Security Features

✅ **Authentication Required**: All operations require authenticated user
✅ **Owner Validation**: Users can only modify their own content
✅ **Content Length Limits**: Prevents spam and abuse
✅ **Section Validation**: Only valid sections allowed
✅ **Data Integrity**: Required fields enforced at rules level
✅ **Like Protection**: Users can only like with their own userId

## Future Enhancements

1. **Moderation System**: Report/flag inappropriate content
2. **Media Uploads**: Support images and videos in posts
3. **Rich Text**: Markdown or rich text formatting
4. **Mentions**: @mention other users
5. **Notifications**: Real-time notifications for replies
6. **Search**: Full-text search across posts
7. **Trending Algorithm**: Surface popular content
8. **Badge System**: Achievement badges for contributors
9. **Private Messaging**: DM between users
10. **Content Filtering**: Profanity filter and content moderation

## Documentation

- **Full Documentation**: See `COMMUNITY_STRUCTURE.md`
- **Usage Examples**: See `COMMUNITY_STRUCTURE.md` → Usage Examples
- **API Reference**: See `lib/firestore.ts` for function signatures

## Notes

- Community profiles are created automatically when users create their first post or comment
- Reputation system is automatic and doesn't require manual updates
- All timestamps use Firestore serverTimestamp() for consistency
- Posts and comments are soft-deleted (can be recovered if needed)
- Section-based organization allows for targeted content and moderation
- Context-aware navigation maintains user experience across sections
