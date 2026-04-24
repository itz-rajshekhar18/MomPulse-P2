'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Trash2, MoreVertical } from 'lucide-react';
import { CommunityPost, CommunitySection, likePost, unlikePost, deleteCommunityPost } from '@/lib/firestore';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: CommunityPost;
  section: CommunitySection;
  currentUserId: string;
  currentUserName: string;
  hasLiked: boolean;
  onLikeToggle: () => void;
  onDelete: () => void;
  onCommentClick: () => void;
}

export default function PostCard({
  post,
  section,
  currentUserId,
  currentUserName,
  hasLiked,
  onLikeToggle,
  onDelete,
  onCommentClick,
}: PostCardProps) {
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const isOwnPost = post.userId === currentUserId;

  const handleLikeToggle = async () => {
    if (isLiking) return;

    setIsLiking(true);
    try {
      if (hasLiked) {
        await unlikePost(section, post.id, currentUserId);
      } else {
        await likePost(section, post.id, currentUserId, currentUserName);
      }
      onLikeToggle();
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    setIsDeleting(true);
    try {
      await deleteCommunityPost(section, post.id, currentUserId);
      onDelete();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const getTimeAgo = () => {
    try {
      if (post.createdAt && typeof post.createdAt.toDate === 'function') {
        return formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true });
      }
      return 'Just now';
    } catch {
      return 'Just now';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
            {post.userAvatar ? (
              <img src={post.userAvatar} alt={post.userName} className="w-full h-full rounded-full object-cover" />
            ) : (
              post.userName.charAt(0).toUpperCase()
            )}
          </div>

          {/* User Info */}
          <div>
            <h3 className="font-semibold text-gray-900">{post.userName}</h3>
            <p className="text-sm text-gray-500">{getTimeAgo()}</p>
          </div>
        </div>

        {/* Menu */}
        {isOwnPost && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              disabled={isDeleting}
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  {isDeleting ? 'Deleting...' : 'Delete Post'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{post.content}</p>
      </div>

      {/* Topics */}
      {post.topics && post.topics.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.topics.map((topic, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm font-medium"
            >
              #{topic}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
        {/* Like Button */}
        <button
          onClick={handleLikeToggle}
          disabled={isLiking}
          className={`flex items-center gap-2 transition-colors ${
            hasLiked
              ? 'text-pink-600'
              : 'text-gray-600 hover:text-pink-600'
          } disabled:opacity-50`}
        >
          <Heart
            className={`w-5 h-5 ${hasLiked ? 'fill-current' : ''}`}
          />
          <span className="font-medium">{post.likesCount || 0}</span>
        </button>

        {/* Comment Button */}
        <button
          onClick={onCommentClick}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium">{post.commentsCount || 0}</span>
        </button>
      </div>
    </motion.div>
  );
}
