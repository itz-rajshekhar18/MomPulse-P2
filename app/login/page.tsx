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
      router.push('/dashboard'); // Redirect to dashboard after login
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
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-xl">🔍</span>
              <span className="font-medium text-gray-700">Google</span>
            </button>
            <button
              type="button"
              disabled
              className="flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-xl bg-gray-50 opacity-50 cursor-not-allowed"
            >
              <span className="text-xl">🍎</span>
              <span className="font-medium text-gray-700">Apple</span>
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