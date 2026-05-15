'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signIn, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      
      // Check if user is admin and redirect accordingly
      if (email === 'admin@admin.com') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      await signInWithGoogle();
      router.push('/dashboard'); // Redirect to dashboard after login
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Artistic Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Image */}
        <Image
          src="/2e68df0da10de744b685748017e549a8d71ea88b.jpg"
          alt="Motherhood journey"
          fill
          className="object-cover"
          priority
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-pink-900/20"></div>
        
        {/* Content overlay */}
        <div className="relative z-10 flex items-center justify-center p-12 w-full">
          <div className="max-w-md">
            {/* Main card */}
            <div className="relative bg-white/40 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-300 to-teal-400 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl">🌱</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-4 font-serif">
                A sanctuary for your most precious moments.
              </h3>
              
              <p className="text-gray-600 mb-6 font-light">
                Experience a personalized wellness journey designed to support you through every beat of motherhood.
              </p>
              
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-300 to-pink-400 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-300 to-purple-400 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-300 to-blue-400 border-2 border-white"></div>
                </div>
                <span className="text-sm text-gray-600 font-medium">+20k Moms Joined</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and Header */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-purple-600 mb-8">
              <span className="text-2xl">💜</span>
              <span className="text-2xl font-bold">MomPulse</span>
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 font-serif">
              Start your motherhood journey 💜
            </h1>
            
            <p className="text-gray-600 mb-8 font-light">
              Join our community of mindful mothers.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-gray-100 rounded-full p-1 mb-8">
            <button className="flex-1 py-3 px-6 rounded-full bg-white text-purple-600 font-medium shadow-sm transition-all">
              Login
            </button>
            <Link 
              href="/signup"
              className="flex-1 py-3 px-6 rounded-full text-gray-600 font-medium text-center hover:text-gray-900 transition-all"
            >
              Sign Up
            </Link>
          </div>

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900"
                placeholder="hello@mompulse.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 uppercase tracking-wide">
                  Password
                </label>
                <Link href="#" className="text-sm text-purple-600 hover:text-purple-700">
                  Forgot?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 rounded-xl font-medium text-white transition-all flex items-center justify-center gap-2 ${
                loading
                  ? 'bg-purple-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2'
              }`}
            >
              {loading ? 'Signing in...' : 'Enter the Sanctuary'}
              {!loading && <span>→</span>}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 uppercase tracking-wide">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md group"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="font-medium text-gray-700 group-hover:text-gray-900">Continue with Google</span>
            </button>
            <button
              type="button"
              disabled
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 border border-gray-300 rounded-xl bg-gray-50 opacity-50 cursor-not-allowed"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" fill="#000000"/>
              </svg>
              <span className="font-medium text-gray-700">Continue with Apple</span>
            </button>
          </div>

          {/* Terms */}
          <p className="text-center text-xs text-gray-500 mt-8">
            By continuing, you agree to our{' '}
            <Link href="#" className="text-purple-600 hover:text-purple-700">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="#" className="text-purple-600 hover:text-purple-700">
              Privacy Policy
            </Link>
            .
          </p>

          {/* Footer Links */}
          <div className="flex justify-center gap-6 text-xs text-gray-400 mt-8">
            <Link href="#" className="hover:text-gray-600">Privacy Policy</Link>
            <Link href="#" className="hover:text-gray-600">Terms of Service</Link>
            <Link href="#" className="hover:text-gray-600">Support</Link>
          </div>
        </div>
      </div>
    </div>
  );
}