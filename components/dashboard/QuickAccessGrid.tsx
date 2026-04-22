'use client';

import { MessageCircle, Calendar, BookOpen, Users } from 'lucide-react';
import Link from 'next/link';

export default function QuickAccessGrid() {
  const quickActions = [
    {
      icon: MessageCircle,
      label: 'Ask AI',
      href: '/ai-assistant',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Calendar,
      label: 'Book Specialist',
      href: '/consultation',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    },
    {
      icon: BookOpen,
      label: 'Library',
      href: '/sanctuary',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Users,
      label: 'Community',
      href: '/community',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {quickActions.map((action, index) => (
        <Link
          key={index}
          href={action.href}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:scale-105 transition-all duration-200 flex flex-col items-center justify-center space-y-3 group"
        >
          <div className={`p-4 ${action.bgColor} rounded-xl group-hover:scale-110 transition-transform`}>
            <action.icon className={`w-6 h-6 ${action.color}`} />
          </div>
          <span className="text-gray-900 font-semibold text-center">{action.label}</span>
        </Link>
      ))}
    </div>
  );
}
