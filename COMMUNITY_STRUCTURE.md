# Community Structure Documentation

## Overview
The MomPulse community feature is organized by section types to provide targeted support and discussions for users at different stages of their journey.

## Section Types

### 1. **Period Tracking** (`period`)
- For teenagers and women tracking their menstrual cycles
- Topics: cycle patterns, symptoms, period health, PMS management
- Accessed from: Period Tracker dashboard

### 2. **Pre-Pregnancy** (`pre-pregnancy`)
- For women planning to conceive
- Topics: fertility, ovulation tracking, preconception health, trying to conceive
- Accessed from: Pre-Pregnancy dashboard

### 3. **Postpartum** (`postpartum`)
- For new mothers in postpartum recovery
- Topics: recovery, breastfeeding, postpartum depression, baby care
- Accessed from: Postpartum dashboard

### 4. **General** (`general`)
- For general discussions and cross-stage topics
- Topics: wellness, nutrition, mental health, lifestyle
- Accessed from: Any dashboard (default when no section specified)

## Firestore Structure

```
community/
├── period/
│   ├── posts/
│   │   ├── {postId}/
│   │   │   ├── (post data)
│   │   │   ├── comments/
│   │   │   │   └── {commentId}
│   │   │   └── likes/
│   │   │       └── {userId}
│   │   └── ...
│   └── topics/
│       └── {topicId}
├── pre-pregnancy/
│   ├── posts/
│   └── topics/
├── postpartum/
│   ├── posts/
│   └── topics/
└── general/
    ├── posts/
    └── topics/

communityProfiles/
└── {userId}/
    ├── userName
    ├── postsCount
    ├── commentsCount
    ├── reputation
    └── badges
```

## Data Models

### CommunityPost
```typescript
{
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  section: 'period' | 'pre-pregnancy' | 'postpartum' | 'general';
  topics?: string[];
  imageUrl?: string;
  likesCount: number;
  commentsCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### CommunityComment
```typescript
{
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### CommunityProfile
```typescript
{
  userId: string;
  userName: string;
  userAvatar?: string;
  bio?: string;
  postsCount: number;
  commentsCount: number;
  likesReceived: number;
  reputation: number;
  badges: string[];
  joinedAt: Timestamp;
  updatedAt: Timestamp;
}
```

## Security Rules

### Post Rules
- **Read**: All authenticated users can read posts in any section
- **Create**: Authenticated users can create posts with valid data
  - Must include: userId, userName, content, section, createdAt
  - Content length: 1-5000 characters
  - userId must match authenticated user
  - section must match the collection path
- **Update/Delete**: Only post owner can modify or delete their posts

### Comment Rules
- **Read**: All authenticated users can read comments
- **Create**: Authenticated users can create comments with valid data
  - Must include: userId, userName, content, createdAt
  - Content length: 1-2000 characters
  - userId must match authenticated user
- **Update/Delete**: Only comment owner can modify or delete their comments

### Like Rules
- **Read**: All authenticated users can read likes
- **Create/Delete**: Users can only like/unlike with their own userId

### Community Profile Rules
- **Read**: All authenticated users can read community profiles
- **Create/Update**: Users can only create/update their own profile
- **Delete**: Users can only delete their own profile

## Usage Examples

### Creating a Post
```typescript
import { createCommunityPost } from '@/lib/firestore';

const postId = await createCommunityPost('period', {
  userId: user.uid,
  userName: user.displayName,
  userAvatar: user.photoURL,
  content: 'Has anyone experienced irregular cycles after stress?',
  section: 'period',
  topics: ['irregular-cycles', 'stress'],
});
```

### Getting Posts
```typescript
import { getCommunityPosts } from '@/lib/firestore';

// Get posts from period section
const posts = await getCommunityPosts('period', 20);

// Get posts from pre-pregnancy section
const prePregPosts = await getCommunityPosts('pre-pregnancy', 20);
```

### Adding a Comment
```typescript
import { addComment } from '@/lib/firestore';

const commentId = await addComment('period', postId, {
  userId: user.uid,
  userName: user.displayName,
  userAvatar: user.photoURL,
  content: 'I experienced the same thing! Here\'s what helped me...',
});
```

### Liking a Post
```typescript
import { likePost, unlikePost, hasUserLikedPost } from '@/lib/firestore';

// Check if user has liked the post
const hasLiked = await hasUserLikedPost('period', postId, user.uid);

if (hasLiked) {
  await unlikePost('period', postId, user.uid);
} else {
  await likePost('period', postId, user.uid, user.displayName);
}
```

### Getting User's Posts
```typescript
import { getUserPosts } from '@/lib/firestore';

// Get all posts by user across all sections
const allUserPosts = await getUserPosts(user.uid);

// Get user's posts from specific section
const periodPosts = await getUserPosts(user.uid, 'period');
```

### Getting Top Contributors
```typescript
import { getTopContributors } from '@/lib/firestore';

const topUsers = await getTopContributors(5);
```

## Reputation System

Users earn reputation points for community participation:
- **Create a post**: +5 reputation
- **Add a comment**: +2 reputation
- **Delete a post**: -5 reputation
- **Delete a comment**: -2 reputation

Reputation is tracked in the user's community profile and can be used for:
- Displaying top contributors
- Unlocking badges
- Prioritizing content from high-reputation users

## Context-Aware Navigation

The community page uses query parameters to maintain navigation context:

- From Period Tracker: `/community?section=period` → Shows PeriodTrackerHeader
- From Pre-Pregnancy: `/community` → Shows DashboardHeader
- From Postpartum: `/community` → Shows DashboardHeader

This ensures users see consistent navigation when moving between sections.

## Deployment

To deploy the updated Firestore rules:

```bash
cd mompulse
firebase deploy --only firestore:rules
```

Or use the provided batch file:
```bash
./deploy-rules.bat
```

## Future Enhancements

1. **Topics/Tags System**: Predefined topics for each section
2. **Moderation**: Report/flag inappropriate content
3. **Private Messaging**: Direct messages between users
4. **Notifications**: Notify users of replies and mentions
5. **Search**: Full-text search across posts and comments
6. **Trending Posts**: Algorithm to surface popular content
7. **Badges**: Achievement system for active contributors
8. **Media Support**: Image and video uploads for posts
9. **Polls**: Create polls within posts
10. **Bookmarks**: Save favorite posts for later

## Best Practices

1. **Content Validation**: Always validate user input before saving
2. **Error Handling**: Wrap Firestore calls in try-catch blocks
3. **Loading States**: Show loading indicators during data fetches
4. **Optimistic Updates**: Update UI immediately, sync with Firestore in background
5. **Pagination**: Load posts in batches to improve performance
6. **Real-time Updates**: Use Firestore listeners for live updates
7. **Privacy**: Never expose sensitive user data in community posts
8. **Moderation**: Implement content filtering and reporting mechanisms
