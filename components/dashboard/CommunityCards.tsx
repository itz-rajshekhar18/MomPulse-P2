'use client';

import { ArrowRight, Flame } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CommunityCards() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Hot Topic Card */}
      <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-3xl p-8 relative overflow-hidden">
        <div className="flex items-center space-x-2 mb-4">
          <Flame className="w-5 h-5 text-pink-600" />
          <span className="text-xs font-bold text-pink-600 uppercase tracking-wide">
            HOT TOPIC 🔥
          </span>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
          Managing your cycle at school: The ultimate survival guide.
        </h3>

        <button
          onClick={() => router.push('/sanctuary')}
          className="px-6 py-3 bg-white text-pink-600 rounded-xl font-semibold hover:shadow-lg transition-all inline-flex items-center space-x-2"
        >
          <span>Read Guide</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Community Card */}
      <div className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
          <div className="text-6xl">🌿</div>
        </div>
        
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-white mb-2">
            The Glow Club
          </h3>
          <p className="text-gray-300 text-sm mb-6">
            Join the chat with others in their Glow Phase!
          </p>

          <button
            onClick={() => router.push('/community')}
            className="px-6 py-3 bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-900 rounded-xl font-semibold hover:shadow-lg transition-all inline-flex items-center space-x-2"
          >
            <span>Join Chat</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-4 right-4 flex items-center space-x-2">
          <div className="w-12 h-16 bg-teal-500/20 rounded-lg"></div>
          <div className="w-12 h-20 bg-green-500/20 rounded-lg"></div>
          <div className="w-16 h-24 bg-orange-500/20 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}
