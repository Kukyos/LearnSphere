import React from 'react';
import { MessageCircle } from 'lucide-react';

const ChatbotIcon: React.FC = () => {
  return (
    <button
      onClick={() => alert('Chatbot feature coming soon!')}
      className="fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-2xl transition-all hover:scale-110 bg-brand-600 hover:bg-brand-500"
      title="Chat with us"
    >
      <MessageCircle className="text-white" size={28} />
    </button>
  );
};

export default ChatbotIcon;
