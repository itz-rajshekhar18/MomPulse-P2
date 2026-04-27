'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getUserProfile } from '@/lib/firestore';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import StatsCards from '@/components/admin/StatsCards';
import DoctorManagement from '@/components/admin/DoctorManagement';
import UpcomingConsultations from '@/components/admin/UpcomingConsultations';
import ContentManagement from '@/components/admin/ContentManagement';
import CreateDoctorModal from '@/components/admin/CreateDoctorModal';
import CreateSessionModal from '@/components/admin/CreateSessionModal';

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const loadAdminData = async () => {
      try {
        // Check if user is the admin
        if (user.email !== 'admin@admin.com') {
          console.warn('Unauthorized access attempt to admin panel');
          router.push('/dashboard');
          return;
        }

        const profile = await getUserProfile(user.uid);
        
        if (profile?.displayName) {
          setAdminName(profile.displayName.split(' ')[0]);
        } else if (user.email) {
          setAdminName(user.email.split('@')[0]);
        }
      } catch (error) {
        console.error('Error loading admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, [user, router]);

  const handleDoctorCreated = () => {
    setIsDoctorModalOpen(false);
    setRefreshKey(prev => prev + 1); // Trigger refresh
  };

  const handleSessionCreated = () => {
    setIsSessionModalOpen(false);
    setRefreshKey(prev => prev + 1); // Trigger refresh
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <AdminHeader adminName={adminName} />

        {/* Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome back, {adminName}.
            </h1>
            <p className="text-gray-600">
              Your sanctuary for motherhood health management. Here is what's happening today in the MomPulse ecosystem.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-8">
            <button 
              onClick={() => setIsSessionModalOpen(true)}
              className="px-6 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Schedule Session
            </button>
            <button 
              onClick={() => setIsDoctorModalOpen(true)}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Doctor
            </button>
          </div>

          {/* Stats Cards */}
          <StatsCards />

          {/* Content based on active tab */}
          {activeTab === 'overview' && (
            <>
              {/* Doctor Management & Consultations */}
              <div className="grid lg:grid-cols-3 gap-8 mt-8">
                <div className="lg:col-span-2">
                  <DoctorManagement key={`doctors-${refreshKey}`} />
                </div>
                <div>
                  <UpcomingConsultations key={`sessions-${refreshKey}`} />
                </div>
              </div>
            </>
          )}

          {activeTab === 'content' && (
            <div className="mt-8">
              <ContentManagement />
            </div>
          )}

          {activeTab === 'doctors' && (
            <div className="mt-8">
              <DoctorManagement key={`doctors-tab-${refreshKey}`} />
            </div>
          )}
        </main>

        {/* Modals */}
        <CreateDoctorModal 
          isOpen={isDoctorModalOpen} 
          onClose={() => setIsDoctorModalOpen(false)}
          onSuccess={handleDoctorCreated}
        />
        <CreateSessionModal 
          isOpen={isSessionModalOpen} 
          onClose={() => setIsSessionModalOpen(false)}
          onSuccess={handleSessionCreated}
        />
      </div>
    </div>
  );
}
