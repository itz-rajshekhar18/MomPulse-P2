'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { saveOnboardingData, createUserProfile } from '@/lib/firestore';

export default function OnboardingPage() {
  const [selectedStage, setSelectedStage] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user } = useAuth();

  const handleContinue = async () => {
    if (!selectedStage) {
      setError('Please select a stage');
      return;
    }

    if (!user) {
      setError('You must be logged in');
      router.push('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create/update user profile
      await createUserProfile(user.uid, {
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
      });

      // Save onboarding data
      await saveOnboardingData(user.uid, {
        currentStage: selectedStage as 'planning' | 'postpartum' | 'pregnancy' | 'period',
        age: age ? parseInt(age) : undefined,
        completedAt: new Date() as any,
      });

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Error saving onboarding data:', err);
      setError(err.message || 'Failed to save your information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 flex flex-col">
      {/* Header */}
      <header className="w-full px-6 py-6 text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-purple-600">
          <span className="text-2xl font-bold">MomPulse</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-4xl">
          {/* Title Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-serif">
              Let's personalize your journey 💜
            </h1>
            <p className="text-gray-600 text-lg font-light">
              Every mother's rhythm is unique. Tell us where you are so we can tailor your sanctuary.
            </p>
            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm max-w-md mx-auto">
                {error}
              </div>
            )}
          </div>

          {/* Current Stage Section */}
          <div className="mb-12">
            <h2 className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wide mb-8">
              Current Stage
            </h2>

            <div className="relative max-w-4xl mx-auto">
              {/* Cards Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Planning Pregnancy Card */}
                <button
                  onClick={() => setSelectedStage('planning')}
                  className={`relative bg-white rounded-2xl p-6 text-left transition-all hover:shadow-lg ${
                    selectedStage === 'planning'
                      ? 'ring-2 ring-purple-500 shadow-lg'
                      : 'shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-300 to-teal-400 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🌱</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 font-serif">
                        Planning Pregnancy 🌱
                      </h3>
                      <p className="text-sm text-gray-600 font-light">
                        Optimize your wellness for a healthy start.
                      </p>
                    </div>
                  </div>
                </button>

                {/* Postpartum Care Card */}
                <button
                  onClick={() => setSelectedStage('postpartum')}
                  className={`relative bg-white rounded-2xl p-6 text-left transition-all hover:shadow-lg ${
                    selectedStage === 'postpartum'
                      ? 'ring-2 ring-purple-500 shadow-lg'
                      : 'shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-300 to-rose-400 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">👶</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 font-serif">
                        Postpartum Care 👶
                      </h3>
                      <p className="text-sm text-gray-600 font-light">
                        Support for recovery and your new lifestyle.
                      </p>
                    </div>
                  </div>
                </button>

                {/* Pregnancy Tracker Card */}
                <button
                  onClick={() => setSelectedStage('pregnancy')}
                  className={`relative bg-white rounded-2xl p-6 text-left transition-all hover:shadow-lg ${
                    selectedStage === 'pregnancy'
                      ? 'ring-2 ring-purple-500 shadow-lg'
                      : 'shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-300 to-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🤰</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 font-serif">
                        Pregnancy Tracker 🤰
                      </h3>
                      <p className="text-sm text-gray-600 font-light">
                        Track your pregnancy journey week by week.
                      </p>
                    </div>
                  </div>
                </button>

                {/* Period Tracker Card */}
                <button
                  onClick={() => setSelectedStage('period')}
                  className={`relative bg-white rounded-2xl p-6 text-left transition-all hover:shadow-lg ${
                    selectedStage === 'period'
                      ? 'ring-2 ring-purple-500 shadow-lg'
                      : 'shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-300 to-pink-400 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📅</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 font-serif">
                        Period Tracker 📅
                      </h3>
                      <p className="text-sm text-gray-600 font-light">
                        Monitor your cycle and wellness patterns.
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Overlaying Image Card - Positioned to overlap the cards */}
              <div className="hidden lg:block absolute -right-60 top-12 z-10">
                <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden w-72 h-96 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <Image
                    src="/083539af180352d45c1d82f9206b540671268f60.jpg"
                    alt="Mother and child"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white text-sm font-medium leading-relaxed">
                      Guided by experts,<br />
                      Inspired by your pulse.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Age Input Section */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 font-serif">
                    Your Age
                  </h3>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                    Optional Information
                  </p>
                </div>
              </div>

              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 28"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />

              <p className="text-xs text-gray-500 italic mt-3">
                Sharing your age helps us provide more accurate cycle insights and wellness recommendations tailored to your metabolic rhythm.
              </p>
            </div>
          </div>

          {/* Continue Button */}
          <div className="max-w-4xl mx-auto">
            <button
              onClick={handleContinue}
              disabled={!selectedStage || loading}
              className={`w-full py-4 px-6 rounded-full font-medium text-white transition-all flex items-center justify-center gap-2 ${
                selectedStage && !loading
                  ? 'bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  Continue
                  <span>→</span>
                </>
              )}
            </button>

            {/* Privacy Note */}
            <div className="flex items-center justify-center gap-2 mt-6">
              <span className="text-gray-400">🔒</span>
              <p className="text-sm text-gray-500">
                Your data is encrypted & private
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
