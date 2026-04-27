'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAllArticles, getAllVideos, Article, Video } from '@/lib/firestore';
import CreateArticleModal from './CreateArticleModal';
import CreateVideoModal from './CreateVideoModal';

export default function ContentManagement() {
  const [activeTab, setActiveTab] = useState<'articles' | 'videos'>('articles');
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const [articlesData, videosData] = await Promise.all([
        getAllArticles(),
        getAllVideos()
      ]);
      setArticles(articlesData);
      setVideos(videosData);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleArticleCreated = () => {
    setIsArticleModalOpen(false);
    fetchContent(); // Refresh the list
  };

  const handleVideoCreated = () => {
    setIsVideoModalOpen(false);
    fetchContent(); // Refresh the list
  };

  const filteredContents = activeTab === 'articles' ? articles : videos;

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Content Management</h2>
          <p className="text-sm text-gray-600 mt-1">Create and manage articles and videos for users</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsArticleModalOpen(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Article
          </button>
          <button
            onClick={() => setIsVideoModalOpen(true)}
            className="px-4 py-2 bg-pink-600 text-white rounded-xl font-medium hover:bg-pink-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            New Video
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('articles')}
          className={`pb-3 px-4 font-semibold transition-colors relative ${
            activeTab === 'articles' ? 'text-purple-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Articles
          {activeTab === 'articles' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab('videos')}
          className={`pb-3 px-4 font-semibold transition-colors relative ${
            activeTab === 'videos' ? 'text-purple-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Videos
          {activeTab === 'videos' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"
            />
          )}
        </button>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 rounded-xl mb-2 text-sm font-semibold text-gray-600 uppercase tracking-wide">
        <div className="col-span-4">Title</div>
        <div className="col-span-2">Category</div>
        <div className="col-span-2">Section</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-1">Views</div>
        <div className="col-span-1">Actions</div>
      </div>

      {/* Content List */}
      <div className="space-y-2">
        {filteredContents.length > 0 ? (
          filteredContents.map((content, index) => {
            const isArticle = activeTab === 'articles';
            const item = content as Article | Video;
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="grid grid-cols-12 gap-4 px-4 py-4 hover:bg-gray-50 rounded-xl transition-colors"
              >
                {/* Title */}
                <div className="col-span-4 flex items-center gap-3">
                  <div className={`w-10 h-10 ${isArticle ? 'bg-purple-100' : 'bg-pink-100'} rounded-lg flex items-center justify-center`}>
                    {isArticle ? (
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-500">
                      {item.createdAt && typeof item.createdAt === 'object' && 'toDate' in item.createdAt
                        ? item.createdAt.toDate().toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Category */}
                <div className="col-span-2 flex items-center">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {item.category.replace('-', ' ')}
                  </span>
                </div>

                {/* Section */}
                <div className="col-span-2 flex items-center">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    {item.section.replace('-', ' ')}
                  </span>
                </div>

                {/* Status */}
                <div className="col-span-2 flex items-center">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {item.status === 'published' ? '✓ Published' : '📝 Draft'}
                  </span>
                </div>

                {/* Views */}
                <div className="col-span-1 flex items-center">
                  <p className="text-gray-700 font-medium">{item.views.toLocaleString()}</p>
                </div>

                {/* Actions */}
                <div className="col-span-1 flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500">
            No {activeTab} found. Create your first {activeTab === 'articles' ? 'article' : 'video'} to get started.
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateArticleModal 
        isOpen={isArticleModalOpen} 
        onClose={() => setIsArticleModalOpen(false)}
        onSuccess={handleArticleCreated}
      />
      <CreateVideoModal 
        isOpen={isVideoModalOpen} 
        onClose={() => setIsVideoModalOpen(false)}
        onSuccess={handleVideoCreated}
      />
    </motion.div>
  );
}
