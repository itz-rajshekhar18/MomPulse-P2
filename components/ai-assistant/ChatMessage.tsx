interface ChatMessageProps {
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

export default function ChatMessage({ message, isUser, timestamp, isInsight, actionCard }: ChatMessageProps) {
  // Typing indicator
  if (message === 'Typing...') {
    return (
      <div className="flex gap-4 mb-6">
        {/* AI Avatar */}
        <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-lg">💚</span>
        </div>

        <div className="flex-1 max-w-2xl">
          <div className="bg-gray-50 rounded-3xl rounded-tl-md px-6 py-4">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isUser) {
    return (
      <div className="flex justify-end mb-6">
        <div className="max-w-2xl">
          <div className="bg-purple-600 text-white rounded-3xl rounded-tr-md px-6 py-4">
            <p className="text-sm leading-relaxed">{message}</p>
          </div>
          <div className="text-xs text-gray-400 mt-2 text-right">
            YOU • {timestamp}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 mb-6">
      {/* AI Avatar */}
      <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-white text-lg">💚</span>
      </div>

      <div className="flex-1 max-w-2xl">
        {isInsight && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-teal-600 uppercase tracking-wide">
              ● SUPPORTIVE INSIGHT
            </span>
          </div>
        )}
        
        <div className="bg-gray-50 rounded-3xl rounded-tl-md px-6 py-4">
          <p className="text-sm text-gray-800 leading-relaxed">{message}</p>
        </div>

        {actionCard && (
          <div className="mt-4 bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center text-2xl">
              {actionCard.icon}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">{actionCard.title}</h4>
              <p className="text-xs text-gray-600">{actionCard.description}</p>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-400 mt-2">
          MOMPULSE AI • {timestamp}
        </div>
      </div>
    </div>
  );
}
