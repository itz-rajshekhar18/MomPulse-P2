'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserProfile, getUpcomingSessions, Session } from '@/lib/firestore';
import PregnancyHeader from '@/components/pregnancy/PregnancyHeader';
import SessionCard from '@/components/pregnancy/SessionCard';
import FloatingLeaves from '@/components/animations/FloatingLeaves';
import { motion } from 'framer-motion';
import { Calendar, Filter, Search, Video } from 'lucide-react';

export default function SessionsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const loadUserData = async () => {
      try {
        const profile = await getUserProfile(user.uid);
        
        // Access control
        if (profile?.currentStage && profile.currentStage !== 'pregnancy') {
          router.push('/dashboard');
          return;
        }
        
        if (profile?.displayName) {
          setUserName(profile.displayName.split(' ')[0]);
        } else if (user.email) {
          setUserName(user.email.split('@')[0]);
        }

        // Load sessions
        const sessionsData = await getUpcomingSessions(20);
        setSessions(sessionsData);
        setFilteredSessions(sessionsData);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user, router]);

  // Filter sessions based on category and search
  useEffect(() => {
    let filtered = sessions;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (session) => session.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (session) =>
          session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          session.instructor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          session.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredSessions(filtered);
  }, [selectedCategory, searchQuery, sessions]);

  const handleJoinSession = (sessionId: string) => {
    alert(`Joining session ${sessionId}. Video call integration coming soon!`);
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sessions...</p>
        </div>
      </div>
    );
  }

  const categories = [
    { id: 'all', label: 'All Sessions', icon: '📅' },
    { id: 'prenatal yoga', label: 'Prenatal Yoga', icon: '🧘‍♀️' },
    { id: 'nutrition workshop', label: 'Nutrition', icon: '🥗' },
    { id: 'mindfulness', label: 'Mindfulness', icon: '🧠' },
    { id: 'birthing class', label: 'Birthing Class', icon: '👶' },
    { id: 'fitness', label: 'Fitness', icon: '💪' },
  ];

  // Group sessions by status
  const liveSessions = filteredSessions.filter((s) => s.status === 'ongoing');
  const upcomingSessions = filteredSessions.filter((s) => s.status === 'upcoming');
  const completedSessions = filteredSessions.filter((s) => s.status === 'completed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 relative overflow-hidden">
      <FloatingLeaves />
      <PregnancyHeader userName={userName} />

      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-serif">
            Group Sessions 🌸
          </h1>
          <p className="text-gray-600">
            Join live sessions with experts and connect with other expecting mothers in a supportive community.
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search sessions, instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Live Sessions */}
        {liveSessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <h2 className="text-2xl font-bold text-gray-900 font-serif">Live Now</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveSessions.map((session) => (
                <SessionCard
                  key={session.id}
                  id={session.id}
                  title={session.title}
                  instructor={session.instructor || 'Expert Instructor'}
                  date={session.date}
                  time={session.time}
                  duration={`${session.duration || 60} min`}
                  attendees={session.attendees}
                  maxAttendees={session.maxAttendees || 50}
                  category={session.category}
                  color={session.color}
                  status={session.status}
                  onJoin={() => handleJoinSession(session.id)}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Upcoming Sessions */}
        {upcomingSessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900 font-serif">Upcoming Sessions</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingSessions.map((session) => (
                <SessionCard
                  key={session.id}
                  id={session.id}
                  title={session.title}
                  instructor={session.instructor || 'Expert Instructor'}
                  date={session.date}
                  time={session.time}
                  duration={`${session.duration || 60} min`}
                  attendees={session.attendees}
                  maxAttendees={session.maxAttendees || 50}
                  category={session.category}
                  color={session.color}
                  status={session.status}
                  onJoin={() => handleJoinSession(session.id)}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Completed Sessions */}
        {completedSessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <Video className="w-6 h-6 text-gray-600" />
              <h2 className="text-2xl font-bold text-gray-900 font-serif">Past Sessions</h2>
              <span className="text-sm text-gray-500">(Recordings Available)</span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedSessions.map((session) => (
                <SessionCard
                  key={session.id}
                  id={session.id}
                  title={session.title}
                  instructor={session.instructor || 'Expert Instructor'}
                  date={session.date}
                  time={session.time}
                  duration={`${session.duration || 60} min`}
                  attendees={session.attendees}
                  maxAttendees={session.maxAttendees || 50}
                  category={session.category}
                  color={session.color}
                  status={session.status}
                  onJoin={() => handleJoinSession(session.id)}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {filteredSessions.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100"
          >
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2 font-serif">
              No Sessions Found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || selectedCategory !== 'all'
                ? 'Try adjusting your filters or search query.'
                : 'Check back soon for upcoming group sessions and workshops.'}
            </p>
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Clear Filters
              </button>
            )}
          </motion.div>
        )}

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl p-6 border-2 border-purple-200"
        >
          <div className="flex items-start gap-4">
            <div className="text-4xl">💡</div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 font-serif">
                Why Join Group Sessions?
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>Learn from certified experts in prenatal care, nutrition, and wellness</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>Connect with other expecting mothers and build a supportive community</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>Access recordings anytime to revisit important information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>Ask questions in real-time during live sessions</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
