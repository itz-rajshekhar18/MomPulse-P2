'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getUserProfile } from '@/lib/firestore';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ProfileHeader from '@/components/profile/ProfileHeader';
import StageSelector from '@/components/profile/StageSelector';
import PersonalInformation from '@/components/profile/PersonalInformation';
import Preferences from '@/components/profile/Preferences';
import LogoutButton from '@/components/profile/LogoutButton';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const loadProfile = async () => {
      try {
        const userProfile = await getUserProfile(user.uid);
        setProfile(userProfile);
        
        // Set user name for header
        if (userProfile?.displayName) {
          setUserName(userProfile.displayName.split(' ')[0]);
        } else if (user.email) {
          setUserName(user.email.split('@')[0]);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
      {/* Dashboard Header - Same as other pages */}
      <DashboardHeader userName={userName} />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <ProfileHeader
          name={profile?.displayName || user?.email?.split('@')[0] || 'User'}
          location="San Francisco, CA"
          isPremium={true}
          photoURL={profile?.photoURL || user?.photoURL}
        />

        {/* Stage Selector */}
        <StageSelector currentStage={profile?.currentStage || 'planning'} />

        {/* Personal Information */}
        <PersonalInformation
          fullName={profile?.displayName || ''}
          email={user?.email || ''}
          phone="+1 (555) 902-3412"
        />

        {/* Preferences */}
        <Preferences />

        {/* Logout Button */}
        <LogoutButton onLogout={handleLogout} />

        {/* App Version */}
        <p className="text-center text-xs text-gray-400 mt-6">APP VERSION 2.4.1 (812)</p>
      </main>
    </div>
  );
}
