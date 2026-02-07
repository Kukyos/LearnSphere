import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const ChatbotIcon: React.FC = () => {
  const { theme } = useApp();

  return (
    <button
      onClick={() => alert('Chatbot feature coming soon!')}
      className={`fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-2xl transition-all hover:scale-110 ${
        theme === 'dark'
          ? 'bg-brand-600 hover:bg-brand-500'
          : 'bg-brand-500 hover:bg-brand-600'
      }`}
      title="Chat with us"
    >
      <MessageCircle className="text-white" size={28} />
    </button>
  );
};

export default ChatbotIcon;
