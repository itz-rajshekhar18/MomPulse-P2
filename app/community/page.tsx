'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { getUserProfile, getCommunityPosts, hasUserLikedPost, CommunityPost, CommunitySection } from '@/lib/firestore';
import PeriodTrackerHeader from '@/components/dashboard/PeriodTrackerHeader';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import FloatingLeaves from '@/components/animations/FloatingLeaves';
import CreatePostModal from '@/components/community/CreatePostModal';
import PostCard from '@/components/community/PostCard';
import CommentsModal from '@/components/community/CommentsModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Loader2, Filter, TrendingUp } from 'lucide-react';

export default function CommunityPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userName, setUserName] = useState<string>('');
  const [userAvatar, setUserAvatar] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPostForComments, setSelectedPostForComments] = useState<string | null>(null);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  
  // Determine which header to show based on section parameter
  const sectionParam = searchParams.get('section');
  
  // Validate and set section with proper type checking
  const getValidSection = (param: string | null): CommunitySection => {
    if (param === 'period') return 'period';
    if (param === 'pre-pregnancy') return 'pre-pregnancy';
    if (param === 'postpartum') return 'postpartum';
    return 'general';
  };
  
  const section = getValidSection(sectionParam);
  const usePeriodTracker = section === 'period';

  // Debug logging
  useEffect(() => {
    console.log('Community Page - Section:', section);
    console.log('Community Page - URL Param:', sectionParam);
  }, [section, sectionParam]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const loadUserData = async () => {
      try {
        const profile = await getUserProfile(user.uid);
        if (profile?.displayName) {
          setUserName(profile.displayName.split(' ')[0]);
        } else if (user.email) {
          setUserName(user.email.split('@')[0]);
        }
        if (profile?.photoURL) {
          setUserAvatar(profile.photoURL);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user, router]);

  useEffect(() => {
    if (user) {
      loadPosts();
    }
  }, [user, section]);

  const loadPosts = async () => {
    if (!user) return;

    setIsLoadingPosts(true);
    try {
      const fetchedPosts = await getCommunityPosts(section, 50);
      setPosts(fetchedPosts);

      // Check which posts the user has liked
      const likedSet = new Set<string>();
      await Promise.all(
        fetchedPosts.map(async (post) => {
          const liked = await hasUserLikedPost(section, post.id, user.uid);
          if (liked) {
            likedSet.add(post.id);
          }
        })
      );
      setLikedPosts(likedSet);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const handlePostCreated = () => {
    loadPosts();
  };

  const handleLikeToggle = (postId: string) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
    loadPosts(); // Reload to get updated counts
  };

  const handlePostDeleted = () => {
    loadPosts();
  };

  const getSectionTitle = () => {
    switch (section) {
      case 'period':
        return 'Period Tracking Community';
      case 'pre-pregnancy':
        return 'Pre-Pregnancy Community';
      case 'postpartum':
        return 'Postpartum Community';
      default:
        return 'Community';
    }
  };

  const getSectionDescription = () => {
    switch (section) {
      case 'period':
        return 'Share experiences, ask questions, and connect with others tracking their cycles';
      case 'pre-pregnancy':
        return 'Connect with others planning for pregnancy and share your journey';
      case 'postpartum':
        return 'Support and connect with other new mothers in postpartum recovery';
      default:
        return 'Connect, share, and support each other on this journey';
    }
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <motion.p
            className="mt-4 text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Loading...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 pb-20 md:pb-0 relative overflow-hidden">
      {/* Floating Leaves Animation */}
      <FloatingLeaves />

      {/* Conditional Header based on section */}
      {usePeriodTracker ? (
        <PeriodTrackerHeader userName={userName} />
      ) : (
        <DashboardHeader userName={userName} />
      )}

      {/* Modals */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        section={section}
        userId={user.uid}
        userName={userName}
        userAvatar={userAvatar}
        onPostCreated={handlePostCreated}
      />

      {selectedPostForComments && (
        <CommentsModal
          isOpen={!!selectedPostForComments}
          onClose={() => setSelectedPostForComments(null)}
          postId={selectedPostForComments}
          section={section}
          userId={user.uid}
          userName={userName}
          userAvatar={userAvatar}
        />
      )}

      <main className="max-w-4xl mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 font-serif">
            {getSectionTitle()}
          </h1>
          <p className="text-lg text-gray-600">
            {getSectionDescription()}
          </p>
        </motion.div>

        {/* Create Post Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6"
        >
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all flex items-center gap-4 group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
              {userAvatar ? (
                <img src={userAvatar} alt={userName} className="w-full h-full rounded-full object-cover" />
              ) : (
                userName.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1 text-left">
              <p className="text-gray-500 group-hover:text-gray-700 transition-colors">
                What's on your mind, {userName}?
              </p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center group-hover:shadow-lg transition-all">
              <Plus className="w-6 h-6 text-white" />
            </div>
          </button>
        </motion.div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {isLoadingPosts ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
          ) : posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-12 shadow-sm border border-gray-200 text-center"
            >
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No posts yet</h3>
              <p className="text-gray-600 mb-6">
                Be the first to share something with the community!
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                Create First Post
              </button>
            </motion.div>
          ) : (
            <AnimatePresence>
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  section={section}
                  currentUserId={user.uid}
                  currentUserName={userName}
                  hasLiked={likedPosts.has(post.id)}
                  onLikeToggle={() => handleLikeToggle(post.id)}
                  onDelete={handlePostDeleted}
                  onCommentClick={() => setSelectedPostForComments(post.id)}
                />
              ))}
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}
