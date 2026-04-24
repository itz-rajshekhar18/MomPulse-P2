# Community Feature Setup Guide

## Quick Setup (5 minutes)

### Step 1: Install Required Package
```bash
cd mompulse
npm install date-fns
```

### Step 2: Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

Or use the batch file:
```bash
./deploy-rules.bat
```

### Step 3: Start Development Server
```bash
npm run dev
```

### Step 4: Test the Community Feature

1. **Navigate to Community Page**
   - From Period Tracker: Click "Community" in navbar
   - From Pre-Pregnancy: Click "Community" in navbar
   - From Postpartum: Click "Community" in navbar

2. **Create Your First Post**
   - Click "What's on your mind?" button
   - Type your message (max 5000 characters)
   - Click "Post" button
   - Your post appears in the feed!

3. **Interact with Posts**
   - Click ❤️ to like a post
   - Click 💬 to view/add comments
   - Click ⋮ menu on your own posts to delete

## What's Included

### ✅ Components
- `CreatePostModal.tsx` - Create new posts
- `PostCard.tsx` - Display posts with interactions
- `CommentsModal.tsx` - View and add comments
- Updated `community/page.tsx` - Main community page

### ✅ Features
- Section-based communities (period, pre-pregnancy, postpartum, general)
- Create, read, delete posts
- Like/unlike posts
- Comment on posts
- Real-time updates
- Context-aware navigation
- Reputation system

### ✅ Security
- Firestore rules enforce user ownership
- Content length validation
- Section validation
- Authentication required

## File Structure

```
mompulse/
├── app/
│   └── community/
│       └── page.tsx (✅ Updated)
├── components/
│   └── community/
│       ├── CreatePostModal.tsx (✅ New)
│       ├── PostCard.tsx (✅ New)
│       └── CommentsModal.tsx (✅ New)
├── lib/
│   └── firestore.ts (✅ Updated with community functions)
├── firestore.rules (✅ Updated with community rules)
└── Documentation/
    ├── COMMUNITY_STRUCTURE.md
    ├── COMMUNITY_FIRESTORE_UPDATE.md
    └── COMMUNITY_PAGE_IMPLEMENTATION.md
```

## Verification Steps

### 1. Check Firestore Rules Deployed
1. Go to Firebase Console
2. Navigate to Firestore Database → Rules
3. Verify you see community rules with sections

### 2. Test Post Creation
1. Navigate to `/community?section=period`
2. Click "What's on your mind?"
3. Type a test message
4. Click "Post"
5. Post should appear in feed

### 3. Test Interactions
1. Click heart icon on a post → Like count increases
2. Click comment icon → Comments modal opens
3. Type a comment and send → Comment appears
4. Click heart again → Like removed

### 4. Test Permissions
1. Try to delete someone else's post → Should not see delete option
2. Delete your own post → Should work
3. Try to comment without authentication → Should redirect to login

## Common Issues & Solutions

### Issue: "date-fns not found"
**Solution**: Run `npm install date-fns`

### Issue: "Permission denied" when creating post
**Solution**: 
1. Deploy Firestore rules: `firebase deploy --only firestore:rules`
2. Verify you're logged in
3. Check browser console for specific error

### Issue: Posts not loading
**Solution**:
1. Check Firestore rules are deployed
2. Verify user is authenticated
3. Check section parameter in URL
4. Open browser console for errors

### Issue: Can't see delete button on own posts
**Solution**:
1. Verify userId matches between post and current user
2. Check that post.userId is correctly set
3. Refresh the page

### Issue: Comments not showing
**Solution**:
1. Check that comments modal is opening
2. Verify postId is correct
3. Check Firestore rules allow comment reads
4. Look for errors in browser console

## Testing Different Sections

### Period Tracking Community
```
URL: /community?section=period
Header: Period Tracker Navigation
Posts: Period-related discussions
```

### Pre-Pregnancy Community
```
URL: /community?section=pre-pregnancy
Header: Dashboard Navigation
Posts: Pre-pregnancy discussions
```

### Postpartum Community
```
URL: /community?section=postpartum
Header: Dashboard Navigation
Posts: Postpartum discussions
```

### General Community
```
URL: /community (no section parameter)
Header: Dashboard Navigation
Posts: General discussions
```

## Next Steps

### Immediate
1. ✅ Install date-fns package
2. ✅ Deploy Firestore rules
3. ✅ Test creating posts
4. ✅ Test likes and comments

### Short Term
- Add image upload support
- Implement search functionality
- Add user profiles
- Create notification system

### Long Term
- Add moderation tools
- Implement trending algorithm
- Add private messaging
- Create badge system

## Support & Documentation

- **Full API Reference**: See `COMMUNITY_STRUCTURE.md`
- **Implementation Details**: See `COMMUNITY_PAGE_IMPLEMENTATION.md`
- **Firestore Updates**: See `COMMUNITY_FIRESTORE_UPDATE.md`

## Quick Commands Reference

```bash
# Install dependencies
npm install date-fns

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Success Indicators

✅ Community page loads without errors
✅ Can create posts in different sections
✅ Can like/unlike posts
✅ Can add comments
✅ Can delete own posts/comments
✅ Correct header shows based on section
✅ Real-time counts update (likes, comments)
✅ Reputation points are awarded

## Congratulations! 🎉

Your community feature is now fully functional with:
- ✅ Real Firestore integration
- ✅ Section-based organization
- ✅ Interactive features (posts, likes, comments)
- ✅ Secure permissions
- ✅ Beautiful UI with animations
- ✅ Context-aware navigation

Users can now connect, share experiences, and support each other on their journey!
