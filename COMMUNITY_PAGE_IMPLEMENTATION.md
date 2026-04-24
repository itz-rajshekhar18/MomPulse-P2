# Community Page Implementation

## Overview
Fully functional community page with real Firestore integration, section-based organization, and interactive features.

## Features Implemented

### ✅ Core Features
1. **Section-Based Communities**
   - Period Tracking Community
   - Pre-Pregnancy Community
   - Postpartum Community
   - General Community

2. **Post Management**
   - Create posts with modal interface
   - View posts feed with real-time data
   - Delete own posts
   - Character limit validation (5000 chars)

3. **Engagement Features**
   - Like/unlike posts
   - Comment on posts
   - View comment threads
   - Delete own comments
   - Real-time like and comment counts

4. **User Experience**
   - Context-aware navigation (correct header based on section)
   - Smooth animations with Framer Motion
   - Loading states
   - Empty states
   - Error handling

## Components Created

### 1. CreatePostModal (`components/community/CreatePostModal.tsx`)
**Purpose**: Modal for creating new community posts

**Features**:
- User avatar display
- Section indicator
- Character counter (0/5000)
- Content validation
- Loading state during submission
- Error handling

**Props**:
```typescript
{
  isOpen: boolean;
  onClose: () => void;
  section: CommunitySection;
  userId: string;
  userName: string;
  userAvatar?: string;
  onPostCreated: () => void;
}
```

### 2. PostCard (`components/community/PostCard.tsx`)
**Purpose**: Display individual post with interactions

**Features**:
- User avatar and name
- Time ago display (e.g., "2 hours ago")
- Post content with proper formatting
- Like button with count
- Comment button with count
- Delete button (only for post owner)
- Menu dropdown for actions

**Props**:
```typescript
{
  post: CommunityPost;
  section: CommunitySection;
  currentUserId: string;
  currentUserName: string;
  hasLiked: boolean;
  onLikeToggle: () => void;
  onDelete: () => void;
  onCommentClick: () => void;
}
```

### 3. CommentsModal (`components/community/CommentsModal.tsx`)
**Purpose**: View and add comments to posts

**Features**:
- Comments list with scrolling
- User avatars
- Time ago for each comment
- Add new comment input
- Delete own comments
- Loading states
- Empty state

**Props**:
```typescript
{
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  section: CommunitySection;
  userId: string;
  userName: string;
  userAvatar?: string;
}
```

### 4. Community Page (`app/community/page.tsx`)
**Purpose**: Main community page with posts feed

**Features**:
- Context-aware header (Period Tracker or Dashboard)
- Section-based post filtering
- Create post button
- Posts feed with animations
- Empty state for no posts
- Loading states
- Real-time like status tracking

## Installation Required

### Install date-fns Package
```bash
cd mompulse
npm install date-fns
```

This package is used for formatting timestamps (e.g., "2 hours ago").

## Usage Flow

### 1. Creating a Post
1. User clicks "What's on your mind?" button
2. Modal opens with text area
3. User types content (max 5000 chars)
4. User clicks "Post" button
5. Post is saved to Firestore
6. Feed refreshes with new post

### 2. Liking a Post
1. User clicks heart icon on post
2. Like is saved to Firestore
3. Like count updates
4. Heart icon fills with color
5. Clicking again removes like

### 3. Commenting on a Post
1. User clicks comment icon on post
2. Comments modal opens
3. User sees existing comments
4. User types comment in input
5. User clicks send button
6. Comment is saved to Firestore
7. Comment appears in list
8. Comment count updates on post

### 4. Deleting Content
1. User clicks menu icon (three dots) on own post
2. "Delete Post" option appears
3. User confirms deletion
4. Post is removed from Firestore
5. Feed refreshes

## Section Navigation

### From Period Tracker
- URL: `/community?section=period`
- Header: PeriodTrackerHeader
- Posts: Period tracking community

### From Pre-Pregnancy Dashboard
- URL: `/community` (defaults to general)
- Header: DashboardHeader
- Posts: General community (can be changed to pre-pregnancy)

### From Postpartum Dashboard
- URL: `/community` (defaults to general)
- Header: DashboardHeader
- Posts: General community (can be changed to postpartum)

## Data Flow

### Loading Posts
```typescript
1. User navigates to community page
2. Section determined from URL parameter
3. getCommunityPosts(section, 50) called
4. Posts fetched from Firestore
5. For each post, check if user has liked it
6. Posts displayed in feed
```

### Creating Post
```typescript
1. User submits post form
2. createCommunityPost(section, postData) called
3. Post saved to /community/{section}/posts/
4. User's community profile updated (+5 reputation)
5. Feed refreshed
6. Modal closed
```

### Adding Comment
```typescript
1. User submits comment form
2. addComment(section, postId, commentData) called
3. Comment saved to /community/{section}/posts/{postId}/comments/
4. Post's commentsCount incremented
5. User's community profile updated (+2 reputation)
6. Comments list refreshed
```

## Firestore Collections Used

### Posts
- Path: `/community/{section}/posts/{postId}`
- Fields: userId, userName, content, section, likesCount, commentsCount, createdAt

### Comments
- Path: `/community/{section}/posts/{postId}/comments/{commentId}`
- Fields: userId, userName, content, createdAt

### Likes
- Path: `/community/{section}/posts/{postId}/likes/{userId}`
- Fields: userId, userName, createdAt

### Community Profiles
- Path: `/communityProfiles/{userId}`
- Fields: userName, postsCount, commentsCount, reputation, badges

## Styling

### Color Scheme
- Primary: Purple (#9333EA)
- Secondary: Pink (#EC4899)
- Gradients: Purple to Pink
- Background: Purple/Pink gradient (from-purple-50 via-pink-50 to-purple-50)

### Components
- Rounded corners: 2xl (16px) for cards
- Shadows: Subtle on cards, stronger on hover
- Animations: Smooth transitions with Framer Motion
- Icons: Lucide React

## Security

### Firestore Rules Enforce
- Users can only create posts with their own userId
- Users can only delete their own posts
- Users can only delete their own comments
- Content length limits enforced
- Section validation enforced

### Client-Side Validation
- Content length checked before submission
- Empty content prevented
- User authentication required
- Error messages displayed

## Performance Optimizations

1. **Pagination**: Posts limited to 50 per load
2. **Lazy Loading**: Comments loaded only when modal opens
3. **Optimistic Updates**: UI updates immediately, syncs with Firestore
4. **Efficient Queries**: Firestore queries optimized with indexes
5. **State Management**: Minimal re-renders with proper state updates

## Future Enhancements

1. **Infinite Scroll**: Load more posts as user scrolls
2. **Image Uploads**: Allow images in posts
3. **Rich Text**: Markdown or rich text formatting
4. **Mentions**: @mention other users
5. **Hashtags**: #hashtag support with filtering
6. **Search**: Search posts by content or user
7. **Notifications**: Real-time notifications for replies
8. **Moderation**: Report/flag inappropriate content
9. **Pinned Posts**: Pin important posts to top
10. **User Profiles**: View user's post history

## Testing Checklist

- [ ] Create a post in period section
- [ ] Create a post in pre-pregnancy section
- [ ] Create a post in postpartum section
- [ ] Like a post
- [ ] Unlike a post
- [ ] Add a comment
- [ ] Delete own comment
- [ ] Delete own post
- [ ] Verify character limits
- [ ] Test empty states
- [ ] Test loading states
- [ ] Verify correct header shows based on section
- [ ] Test navigation between sections
- [ ] Verify reputation points are awarded

## Troubleshooting

### Posts Not Loading
- Check Firestore rules are deployed
- Verify user is authenticated
- Check browser console for errors
- Ensure section parameter is valid

### Can't Create Post
- Verify content is not empty
- Check content length (max 5000)
- Ensure user is authenticated
- Check Firestore rules allow creation

### Likes Not Working
- Verify Firestore rules allow like creation
- Check user is authenticated
- Ensure likeId matches userId in rules

### Comments Not Showing
- Check CommentsModal is opening
- Verify postId is correct
- Check Firestore rules allow comment reads
- Ensure comments collection exists

## Support

For issues or questions:
1. Check browser console for errors
2. Verify Firestore rules are deployed
3. Check network tab for failed requests
4. Review COMMUNITY_STRUCTURE.md for API details
