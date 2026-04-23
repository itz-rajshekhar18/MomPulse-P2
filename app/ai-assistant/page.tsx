'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ChatMessage from '@/components/ai-assistant/ChatMessage';
import SuggestedPrompts from '@/components/ai-assistant/SuggestedPrompts';
import ChatInput from '@/components/ai-assistant/ChatInput';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import PeriodTrackerHeader from '@/components/dashboard/PeriodTrackerHeader';
import { getUserProfile, getCurrentConversation, getConversationMessages, saveMessage, getOnboardingData } from '@/lib/firestore';

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
  const [showStageSelector, setShowStageSelector] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const [isPeriodTracker, setIsPeriodTracker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const stages = ['Pre-Pregnancy', 'Pregnancy', 'Postpartum', 'Period Tracker'];

  const handleStageChange = async (newStage: string) => {
    if (!user) return;

    setCurrentStage(newStage);
    setShowStageSelector(false);
    
    // Get or create conversation for new stage
    const newConvId = await getCurrentConversation(user.uid, newStage);
    setConversationId(newConvId);

    // Try to load from session storage first
    const sessionKey = `conversation_${user.uid}_${newConvId}`;
    const cachedMessages = sessionStorage.getItem(sessionKey);

    if (cachedMessages) {
      // Load from session storage (faster)
      console.log('Loading stage conversation from session storage');
      setMessages(JSON.parse(cachedMessages));
    } else {
      // Load from Firestore
      console.log('Loading stage conversation from Firestore');
      const stageMessages = await getConversationMessages(user.uid, newConvId);
      
      if (stageMessages.length > 0) {
        setMessages(stageMessages);
        // Cache in session storage
        sessionStorage.setItem(sessionKey, JSON.stringify(stageMessages));
      } else {
        // Create welcome message for new stage
        const welcomeMessage: Message = {
          id: Date.now().toString(),
          message: `Switched to ${newStage} mode. How can I help you today?`,
          isUser: false,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        };
        setMessages([welcomeMessage]);
        await saveMessage(user.uid, newConvId, welcomeMessage);
        // Cache in session storage
        sessionStorage.setItem(sessionKey, JSON.stringify([welcomeMessage]));
      }
    }
  };

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const loadUserData = async () => {
      try {
        const profile = await getUserProfile(user.uid);

        // Set user name
        if (profile?.displayName) {
          setUserName(profile.displayName.split(' ')[0]);
        } else if (user.email) {
          setUserName(user.email.split('@')[0]);
        }

        // Check if user is in period tracker mode
        const onboardingData = await getOnboardingData(user.uid);
        setIsPeriodTracker(onboardingData?.currentStage === 'period');

        // Determine current stage
        let stage = 'Pre-Pregnancy';
        if (profile?.currentStage) {
          const stageLabels: Record<string, string> = {
            planning: 'Pre-Pregnancy',
            pregnancy: 'Pregnancy',
            postpartum: 'Postpartum',
            period: 'Period Tracker',
          };
          stage = stageLabels[profile.currentStage] || 'Pre-Pregnancy';
        }
        setCurrentStage(stage);

        // Get or create conversation for this stage
        const convId = await getCurrentConversation(user.uid, stage);
        setConversationId(convId);

        // Try to load from session storage first
        const sessionKey = `conversation_${user.uid}_${convId}`;
        const cachedMessages = sessionStorage.getItem(sessionKey);

        if (cachedMessages) {
          // Load from session storage (faster)
          console.log('Loading conversation from session storage');
          setMessages(JSON.parse(cachedMessages));
        } else {
          // Load from Firestore
          console.log('Loading conversation from Firestore');
          const existingMessages = await getConversationMessages(user.uid, convId);
          
          if (existingMessages.length > 0) {
            setMessages(existingMessages);
            // Cache in session storage
            sessionStorage.setItem(sessionKey, JSON.stringify(existingMessages));
          } else {
            // Create initial welcome message
            const welcomeMessage: Message = {
              id: '1',
              message: "Hello, Mama! Welcome to MomPulse AI Assistant. 🌸 I'm here to support you 24/7 with personalized guidance on your journey. Whether you need help tracking your cycle, understanding symptoms, or just want to talk, I'm here for you. MomPulse brings together everything you need - fertility tracking, health insights, expert consultations, and a supportive community - all in one place. How can I help you today?",
              isUser: false,
              timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            };
            
            setMessages([welcomeMessage]);
            
            // Save welcome message to Firestore
            await saveMessage(user.uid, convId, welcomeMessage);
            
            // Cache in session storage
            sessionStorage.setItem(sessionKey, JSON.stringify([welcomeMessage]));
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();

    // Clear session storage when page is unloaded (browser/tab closed)
    const handleBeforeUnload = () => {
      console.log('Clearing session storage on page unload');
      // Clear all conversation data from session storage
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('conversation_')) {
          sessionStorage.removeItem(key);
        }
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user, router]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (!user || !conversationId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      message,
      isUser: true,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Save user message to Firestore
    await saveMessage(user.uid, conversationId, userMessage);

    // Update session storage with user message
    const sessionKey = `conversation_${user.uid}_${conversationId}`;
    const updatedMessages = [...messages, userMessage];
    sessionStorage.setItem(sessionKey, JSON.stringify(updatedMessages));

    // Add typing indicator
    const typingMessage: Message = {
      id: 'typing',
      message: 'Typing...',
      isUser: false,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, typingMessage]);

    try {
      // Call OpenRouter API through our backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          stage: currentStage,
        }),
      });

      // Remove typing indicator
      setMessages((prev) => prev.filter((msg) => msg.id !== 'typing'));

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        message: data.message,
        isUser: false,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        isInsight: true,
      };

      setMessages((prev) => [...prev, aiResponse]);

      // Save AI response to Firestore
      await saveMessage(user.uid, conversationId, aiResponse);

      // Update session storage with AI response
      const finalMessages = [...updatedMessages, aiResponse];
      sessionStorage.setItem(sessionKey, JSON.stringify(finalMessages));
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Remove typing indicator
      setMessages((prev) => prev.filter((msg) => msg.id !== 'typing'));

      // Show error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        message: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);

      // Save error message to Firestore
      await saveMessage(user.uid, conversationId, errorMessage);

      // Update session storage with error message
      const finalMessages = [...updatedMessages, errorMessage];
      sessionStorage.setItem(sessionKey, JSON.stringify(finalMessages));
    }
  };

  const handlePromptClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const suggestedPrompts = currentStage === 'Pre-Pregnancy' 
    ? [
        'How does MomPulse help track ovulation?',
        'What MomPulse features support conception?',
        'Show me fertility tracking tools',
      ]
    : currentStage === 'Pregnancy'
    ? [
        'How can MomPulse help during pregnancy?',
        'What pregnancy tracking features are available?',
        'Tell me about prenatal support in MomPulse',
      ]
    : currentStage === 'Postpartum'
    ? [
        'How does MomPulse support postpartum recovery?',
        'What features help with breastfeeding?',
        'Tell me about postpartum resources',
      ]
    : [
        'How does MomPulse track my cycle?',
        'What period tracking features are available?',
        'Show me menstrual health tools',
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
      {/* Use Period Tracker Header if in period mode */}
      {isPeriodTracker ? (
        <PeriodTrackerHeader userName={userName} />
      ) : (
        <DashboardHeader userName={userName} />
      )}

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
              <div className="relative">
                <button 
                  onClick={() => setShowStageSelector(!showStageSelector)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Switch Stage
                </button>
                
                {showStageSelector && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    {stages.map((stage) => (
                      <button
                        key={stage}
                        onClick={() => handleStageChange(stage)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-purple-50 transition-colors ${
                          currentStage === stage ? 'bg-purple-100 text-purple-700 font-medium' : 'text-gray-700'
                        }`}
                      >
                        {stage}
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
