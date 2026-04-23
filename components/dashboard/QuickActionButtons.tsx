'use client';

import { FileText, Smile, MessageCircle, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function QuickActionButtons() {
  const router = useRouter();

  const actions = [
    {
      icon: FileText,
      label: 'Log Feels',
      color: 'bg-purple-50',
      iconColor: 'text-purple-600',
      onClick: () => router.push('/insights')
    },
    {
      icon: Smile,
      label: 'Mood Check',
      color: 'bg-pink-50',
      iconColor: 'text-pink-600',
      onClick: () => router.push('/insights')
    },
    {
      icon: MessageCircle,
      label: 'Chat with AI',
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
      onClick: () => router.push('/ai-assistant')
    },
    {
      icon: Calendar,
      label: 'Full View',
      color: 'bg-teal-50',
      iconColor: 'text-teal-600',
      onClick: () => router.push('/insights')
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          className={`${action.color} rounded-2xl p-6 flex flex-col items-center justify-center space-y-3 hover:shadow-md transition-all group`}
        >
          <div className={`p-3 bg-white rounded-xl ${action.iconColor} group-hover:scale-110 transition-transform`}>
            <action.icon className="w-6 h-6" />
          </div>
          <span className="text-sm font-semibold text-gray-900">{action.label}</span>
        </button>
      ))}
    </div>
  );
}
