'use client';

export default function DailyCareTip() {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-6 shadow-lg text-white">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold mb-3 uppercase tracking-wide">
            ✨ Today's Care Tip
          </div>
          <p className="text-lg italic leading-relaxed mb-2">
            "It's important to rest and stay hydrated during early recovery."
          </p>
          <p className="text-sm text-purple-100">
            Your body is working hard to heal. Prioritize sleep and drink plenty of water.
          </p>
        </div>
        <button className="ml-4 px-4 py-2 bg-white text-purple-600 rounded-full text-sm font-semibold hover:bg-purple-50 transition-colors whitespace-nowrap">
          Read Full Guide
        </button>
      </div>
    </div>
  );
}
