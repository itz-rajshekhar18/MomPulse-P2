'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserProfile, getOnboardingData, OnboardingData } from '@/lib/firestore';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Load user's onboarding data and redirect to appropriate dashboard
    const loadUserData = async () => {
      try {
        const data = await getOnboardingData(user.uid);
        
        if (data) {
          // Redirect based on selected stage
          switch (data.currentStage) {
            case 'planning':
              router.push('/dashboard/pre-pregnancy');
              break;
            case 'pregnancy':
              router.push('/dashboard/pregnancy');
              break;
            case 'postpartum':
              router.push('/dashboard/postpartum');
              break;
            case 'period':
              router.push('/dashboard/period');
              break;
            default:
              // Stay on main dashboard if no stage selected
              setLoading(false);
          }
        } else {
          // No onboarding data, redirect to onboarding
          router.push('/onboarding');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setLoading(false);
      }
    };

    loadUserData();
  }, [user, router]);

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Fallback dashboard (shouldn't normally reach here)
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-purple-600 font-serif">MomPulse</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user.displayName || user.email}</span>
            <button
              onClick={async () => {
                await logout();
                router.push('/');
              }}
              className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-4 font-serif">Welcome to MomPulse</h2>
          <p className="text-gray-600 mb-6">
            Complete your onboarding to access your personalized dashboard.
          </p>
          <button
            onClick={() => router.push('/onboarding')}
            className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-colors"
          >
            Complete Onboarding
          </button>
        </div>
      </main>
    </div>
  );
}
