'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ChatMessage from '@/components/ai-assistant/ChatMessage';
import SuggestedPrompts from '@/components/ai-assistant/SuggestedPrompts';
import ChatInput from '@/components/ai-assistant/ChatInput';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { getOnboardingData, getUserProfile } from '@/lib/firestore';

interface Message {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: string;
  isInsight?: boolean;
  actionCard?: {
    title: string;
    description: string;
    icon: string;
  };
}

export default function AIAssistantPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStage, setCurrentStage] = useState<string>('Pre-Pregnancy');
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const loadUserData = async () => {
      try {
        const [profile, onboardingData] = await Promise.all([
          getUserProfile(user.uid),
          getOnboardingData(user.uid)
        ]);

        // Set user name
        if (profile?.displayName) {
          setUserName(profile.displayName.split(' ')[0]);
        } else if (user.email) {
          setUserName(user.email.split('@')[0]);
        }

        // Set current stage
        if (onboardingData) {
          const stageLabels: Record<string, string> = {
            planning: 'Pre-Pregnancy',
            pregnancy: 'Pregnancy',
            postpartum: 'Postpartum',
            period: 'Period Tracker',
          };
          setCurrentStage(stageLabels[onboardingData.currentStage] || 'Pre-Pregnancy');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();

    // Initial welcome message
    setMessages([
      {
        id: '1',
        message: "Hello, Mama. How are you feeling today? Remember, it's perfectly okay to take a moment just for yourself. I'm here if you want to talk about your symptoms, track your progress, or just share what's on your mind.",
        isUser: false,
        timestamp: '10:24 AM',
      },
    ]);
  }, [user, router]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      message,
      isUser: true,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        message: "Absolutely, fatigue is one of the most common signs in the first trimester. Your body is doing incredible work creating a life support system for your baby!",
        isUser: false,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        isInsight: true,
        actionCard: {
          title: 'Try a 15-min rest',
          description: 'Small breaks help manage progesterone surges',
          icon: '😴',
        },
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handlePromptClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const suggestedPrompts = [
    'How can I improve my sleep?',
    'What are early pregnancy symptoms?',
    'Safe exercises',
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 flex flex-col">
      {/* Use Dashboard Header */}
      <DashboardHeader userName={userName} />

      {/* AI Assistant Info */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 font-serif">AI Assistant</h2>
              <p className="text-sm text-gray-600">Always here to support your journey</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-medium">
                {currentStage}
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
                Switch Stage
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} {...msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggested Prompts */}
      <div className="px-6 pb-4">
        <div className="max-w-4xl mx-auto">
          <SuggestedPrompts prompts={suggestedPrompts} onPromptClick={handlePromptClick} />
        </div>
      </div>

      {/* Chat Input */}
      <ChatInput onSend={handleSendMessage} />
    </div>
  );
}
