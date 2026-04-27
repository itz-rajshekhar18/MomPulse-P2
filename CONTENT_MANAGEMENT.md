# Content Management System Documentation

## Overview

The Content Management System (CMS) allows administrators to create, manage, and publish articles and videos for MomPulse users. Content can be targeted to specific sections (Period Tracker, Pre-Pregnancy, Pregnancy, Postpartum, or General).

## 🎯 Features

### Article Management
- **Create Articles**: Rich text articles with titles, content, excerpts
- **Categorization**: Nutrition, Mental Health, Sleep, Movement, Recovery, Health
- **Section Targeting**: Choose which user section sees the article
- **Draft/Publish**: Save as draft or publish immediately
- **Metadata**: Read time, author, tags, featured images
- **Analytics**: Track views and engagement

### Video Management
- **Add Videos**: YouTube, Vimeo, or direct video URLs
- **Categorization**: Same categories as articles plus Mindfulness
- **Section Targeting**: Target specific user groups
- **Metadata**: Duration, instructor, thumbnails, descriptions
- **Analytics**: Track views and engagement

## 📁 File Structure

```
components/
  admin/
    ContentManagement.tsx          # Main content management component
    CreateArticleModal.tsx         # Article creation modal
    CreateVideoModal.tsx           # Video creation modal

lib/
  firestore.ts                     # Content CRUD functions
```

## 🗂️ Data Structure

### Firestore Collections

```
content/
  articles/
    items/
      {articleId}/
        - title: string
        - category: ContentCategory
        - section: ContentSection
        - content: string
        - excerpt?: string
        - readTime?: number
        - author?: string
        - tags?: string[]
        - featuredImage?: string
        - status: 'published' | 'draft'
        - views: number
        - likes: number
        - createdAt: Timestamp
        - updatedAt: Timestamp

  videos/
    items/
      {videoId}/
        - title: string
        - category: ContentCategory
        - section: ContentSection
        - description?: string
        - videoUrl: string
        - thumbnailUrl?: string
        - duration?: string
        - instructor?: string
        - tags?: string[]
        - status: 'published' | 'draft'
        - views: number
        - likes: number
        - createdAt: Timestamp
        - updatedAt: Timestamp
```

### TypeScript Interfaces

```typescript
export type ContentSection = 'period' | 'pre-pregnancy' | 'pregnancy' | 'postpartum' | 'general';
export type ContentCategory = 'nutrition' | 'mental-health' | 'sleep' | 'movement' | 'recovery' | 'health' | 'mindfulness';

export interface Article {
  id: string;
  title: string;
  category: ContentCategory;
  section: ContentSection;
  content: string;
  excerpt?: string;
  readTime?: number;
  author?: string;
  tags?: string[];
  featuredImage?: string;
  status: 'published' | 'draft';
  views: number;
  likes: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Video {
  id: string;
  title: string;
  category: ContentCategory;
  section: ContentSection;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: string;
  instructor?: string;
  tags?: string[];
  status: 'published' | 'draft';
  views: number;
  likes: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## 🚀 Usage

### Creating an Article

1. Navigate to Admin Panel → Content
2. Click "New Article" button
3. Fill in the form:
   - **Title**: Article headline
   - **Category**: Select from dropdown
   - **Section**: Choose target audience
   - **Excerpt**: Brief description (optional)
   - **Content**: Full article text
   - **Read Time**: Estimated minutes
   - **Author**: Writer's name
   - **Tags**: Comma-separated keywords
   - **Featured Image**: URL to image
   - **Status**: Draft or Published
4. Click "Publish Article" or "Save Draft"

### Creating a Video

1. Navigate to Admin Panel → Content
2. Click "New Video" button
3. Fill in the form:
   - **Title**: Video title
   - **Category**: Select from dropdown
   - **Section**: Choose target audience
   - **Description**: Brief overview
   - **Video URL**: YouTube/Vimeo/Direct link
   - **Thumbnail**: URL to thumbnail image
   - **Duration**: Format MM:SS
   - **Instructor**: Creator's name
   - **Tags**: Comma-separated keywords
   - **Status**: Draft or Published
4. Click "Publish Video" or "Save Draft"

## 📊 Available Functions

### Article Functions

```typescript
// Create article
const articleId = await createArticle({
  title: 'Article Title',
  category: 'nutrition',
  section: 'pre-pregnancy',
  content: 'Article content...',
  status: 'published',
  // ... other fields
});

// Get articles by section
const articles = await getArticlesBySection('pre-pregnancy', 20);

// Get all articles (admin)
const allArticles = await getAllArticles();

// Update article
await updateArticle(articleId, {
  title: 'Updated Title',
  status: 'published',
});

// Delete article
await deleteArticle(articleId);

// Increment views
await incrementArticleViews(articleId);
```

### Video Functions

```typescript
// Create video
const videoId = await createVideo({
  title: 'Video Title',
  category: 'movement',
  section: 'pregnancy',
  videoUrl: 'https://youtube.com/watch?v=...',
  status: 'published',
  // ... other fields
});

// Get videos by section
const videos = await getVideosBySection('pregnancy', 20);

// Get all videos (admin)
const allVideos = await getAllVideos();

// Update video
await updateVideo(videoId, {
  title: 'Updated Title',
  status: 'published',
});

// Delete video
await deleteVideo(videoId);

// Increment views
await incrementVideoViews(videoId);
```

## 🎨 Categories

### Available Categories
- **Nutrition**: Diet, recipes, supplements
- **Mental Health**: Stress, anxiety, depression
- **Sleep**: Sleep hygiene, rest, recovery
- **Movement**: Exercise, yoga, stretching
- **Recovery**: Postpartum healing, rehabilitation
- **Health**: General health topics
- **Mindfulness**: Meditation, breathing, relaxation

## 📍 Sections/Pages

### Target Audiences
- **Period Tracker**: For users tracking menstrual cycles
- **Pre-Pregnancy**: For users planning to conceive
- **Pregnancy**: For pregnant users
- **Postpartum**: For new mothers
- **General**: For all users

## 🔒 Content Filtering

Content is automatically filtered based on user's current stage:

```typescript
// In Sanctuary page or content display
const userStage = profile?.currentStage; // 'period', 'planning', 'pregnancy', 'postpartum'

// Map to content section
const sectionMap = {
  period: 'period',
  planning: 'pre-pregnancy',
  pregnancy: 'pregnancy',
  postpartum: 'postpartum',
};

const section = sectionMap[userStage] || 'general';

// Fetch relevant content
const articles = await getArticlesBySection(section);
const videos = await getVideosBySection(section);
```

## 📈 Analytics

### Tracking Metrics
- **Views**: Automatically incremented when content is viewed
- **Likes**: User engagement metric
- **Status**: Published vs Draft count
- **Category Distribution**: Content breakdown by category
- **Section Distribution**: Content breakdown by target audience

### Viewing Analytics

```typescript
// Get content statistics
const articles = await getAllArticles();
const totalViews = articles.reduce((sum, article) => sum + article.views, 0);
const publishedCount = articles.filter(a => a.status === 'published').length;
const draftCount = articles.filter(a => a.status === 'draft').length;
```

## 🎯 Best Practices

### Article Writing
1. **Clear Titles**: Use descriptive, engaging titles
2. **Proper Categorization**: Choose the most relevant category
3. **Target Audience**: Select appropriate section
4. **Read Time**: Estimate accurately (250 words/minute)
5. **Tags**: Use 3-5 relevant tags
6. **Images**: Use high-quality featured images
7. **Content**: Write clear, helpful, evidence-based content

### Video Management
1. **Quality**: Use high-quality video sources
2. **Duration**: Keep videos focused (5-15 minutes ideal)
3. **Thumbnails**: Use clear, attractive thumbnails
4. **Descriptions**: Write helpful descriptions
5. **Instructor**: Credit content creators
6. **Accessibility**: Consider adding captions

## 🔄 Workflow

### Content Creation Workflow
1. **Draft**: Create content and save as draft
2. **Review**: Review content for accuracy and quality
3. **Edit**: Make necessary revisions
4. **Publish**: Change status to published
5. **Monitor**: Track views and engagement
6. **Update**: Revise content as needed

### Content Lifecycle
```
Draft → Review → Published → Monitor → Update → Archive
```

## 🚧 Future Enhancements

### Planned Features
- [ ] Rich text editor for articles
- [ ] Image upload functionality
- [ ] Video upload to Firebase Storage
- [ ] Content scheduling
- [ ] Version history
- [ ] Content approval workflow
- [ ] SEO optimization fields
- [ ] Related content suggestions
- [ ] User comments on content
- [ ] Content ratings
- [ ] Export/Import functionality
- [ ] Bulk operations
- [ ] Advanced search and filtering

## 🐛 Troubleshooting

### Common Issues

**Issue**: Content not showing for users
**Solution**: Check that status is 'published' and section matches user's stage

**Issue**: Video not playing
**Solution**: Verify video URL is correct and accessible

**Issue**: Images not loading
**Solution**: Check image URLs are valid and publicly accessible

## 📞 Support

For content management issues:
- Email: content@mompulse.com
- Documentation: See this file
- Admin Panel: Access at `/admin` → Content tab

---

Built with ❤️ for MomPulse content creators
