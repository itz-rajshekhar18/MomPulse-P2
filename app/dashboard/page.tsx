'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-purple-600 font-serif">MomPulse</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user.email}</span>
            <button
              onClick={handleLogout}
              className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-4 font-serif">Dashboard</h2>
          <p className="text-gray-600 mb-6">
            Welcome to your MomPulse dashboard! This is where your personalized journey begins.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-2 font-serif">Your Profile</h3>
              <p className="text-sm text-gray-700">Complete your profile to get personalized recommendations</p>
            </div>
            
            <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-2 font-serif">Tracking</h3>
              <p className="text-sm text-gray-700">Start tracking your journey and milestones</p>
            </div>
            
            <div className="bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-2 font-serif">Community</h3>
              <p className="text-sm text-gray-700">Connect with other mothers in our community</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
