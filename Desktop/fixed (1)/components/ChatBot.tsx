import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import Sticker from './Sticker';

type Message = {
  id: number;
  text: string;
  sender: 'bot' | 'user';
};

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Yo 👋 I’m Denny’s digital voice. Ask me anything about his work, projects, or skills.", sender: 'bot' }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate thinking delay
    setTimeout(() => {
      const botResponse = getBotResponse(userMsg.text);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, sender: 'bot' }]);
      setIsTyping(false);
    }, 1000);
  };

  // 🧠 THE BRAIN: Rule-based logic
  const getBotResponse = (text: string): string => {
    const lower = text.toLowerCase();

    // 1. GREETINGS
    if (lower.match(/\b(hi|hello|yo|hey|sup|greetings)\b/)) {
      return "Yo 👋 I’m Denny’s digital voice — web dev, AI builder, and music producer from Kerala. Ask me anything.";
    }
    if (lower.includes('who are you')) {
      return "I’m a custom chatbot built to represent Denny Mathew. Think of me as his portfolio, but with attitude 🎧💻";
    }

    // 2. ABOUT DENNY
    if (lower.includes('about') || lower.includes('who is denny')) {
      return "Denny Mathew is a Computer Science student at Karunya University, a web developer, AI builder, and music/SFX producer from Ernakulam, Kerala. Code + Sound = Life.";
    }
    if (lower.includes('from') || lower.includes('location') || lower.includes('where')) {
      return "Ernakulam, Kerala 🌴 currently studying in Coimbatore, building things for everywhere.";
    }
    if (lower.match(/\b(do|does|job|work)\b/)) {
      return "He builds modern websites, AI-powered systems, and sound experiences. Web, AI, music — all connected.";
    }

    // 3. TECH SKILLS
    if (lower.includes('tech') || lower.includes('stack') || lower.includes('skill')) {
      return "Frontend: HTML, CSS, JS, React. AI: Gemini, Agentic workflows. Tools: GitHub, Vercel, Logic Pro.";
    }
    if (lower.includes('frontend') || lower.includes('backend')) {
      return "Frontend-focused, but thinks full-stack. He cares about UI, performance, and real-world use.";
    }
    if (lower.includes('business') || lower.includes('site') || lower.includes('freelance')) {
      return "Yes. Clean, fast, modern, and scalable sites. Especially good for brands, cafes, portfolios, and startups.";
    }

    // 4. PROJECTS (AI & CLIENT)
    if (lower.includes('xnetic')) {
      return "Xnetic AI is a legal assistant that explains complex contracts. It summarizes docs, flags risks, and answers Q&A using Google Gemini 2.0 Flash.";
    }
    if (lower.includes('aura')) {
      return "AURA (Autonomous Unified Repair Agent) predicts car failures and books service automatically. Basically — a car that fixes itself 🚗🤖";
    }
    if (lower.includes('cake') || lower.includes('delicious')) {
      return "Delicious Cake is a pro e-commerce site for an international brand in Kuwait. Modern UI/UX to showcase products.";
    }
    if (lower.includes('live')) {
      return "Some demos are live, others are in dev. Quality > Rushing.";
    }

    // 5. MUSIC
    if (lower.includes('music') || lower.includes('band') || lower.includes('piano') || lower.includes('sfx')) {
      return "Yes 🎹 He performs live, plays keys, and produces music & SFX. His band won 1st place at Musicorum 5.0.";
    }

    // 6. CONTACT
    if (lower.includes('contact') || lower.includes('email') || lower.includes('hire') || lower.includes('reach')) {
      return "Instagram, LinkedIn, or GitHub — links are on the page. If your idea is solid, he’ll reply.";
    }
    if (lower.includes('open to work')) {
      return "Always open to interesting projects, collaborations, and real impact work.";
    }

    // 7. ABUSE HANDLING
    if (lower.match(/\b(stupid|suck|idiot|dumb|hate|f\*ck|shit)\b/)) {
      return "I’m here to build, not beef. If you’ve got a real question, let’s talk 🤝";
    }

    // 8. RANDOM / UNKNOWN
    if (lower.includes('homework')) return "Nah 😅 But Denny can help you build something way cooler.";
    if (lower.includes('real ai') || lower.includes('chatgpt')) return "I’m not ChatGPT. I’m crafted, just like the portfolio you’re exploring.";

    // Fallback
    return "I didn’t catch that fully. Try asking about projects, AI, music, or web work.";
  };

  return (
    <>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 bg-black border-2 border-graffiti-lime shadow-[4px_4px_0px_#39ff14] rounded-full transition-all duration-300 hover:scale-110 group ${isOpen ? 'hidden' : 'block'}`}
      >
        <div className="absolute inset-0 bg-graffiti-lime rounded-full opacity-20 animate-ping"></div>
        <Bot size={32} className="text-white group-hover:text-graffiti-lime transition-colors" />
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full border border-black animate-pulse"></div>
      </button>

      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-[90vw] md:w-[350px] max-h-[80vh] flex flex-col animate-pop-in">
           {/* Header */}
           <div className="bg-black p-4 border-2 border-graffiti-lime border-b-0 flex justify-between items-center relative overflow-hidden">
             {/* Decorative Splash */}
             <div className="absolute -left-4 -top-4 w-20 h-20 bg-graffiti-pink blur-xl opacity-30"></div>
             
             <div className="flex items-center gap-3 relative z-10">
               <div className="w-3 h-3 bg-graffiti-lime rounded-full shadow-[0_0_10px_#39ff14] animate-pulse"></div>
               <h3 className="font-rock text-xl text-transparent bg-clip-text bg-gradient-to-r from-graffiti-cyan to-graffiti-lime">DENNY MODE</h3>
             </div>
             
             <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors relative z-10">
               <X size={24} />
             </button>
           </div>

           {/* Message Area */}
           <div className="flex-1 bg-wall-darker border-2 border-graffiti-lime p-4 overflow-y-auto min-h-[300px] max-h-[400px] space-y-4 font-mono text-sm relative">
             <div className="absolute inset-0 bg-wall-texture opacity-10 pointer-events-none"></div>

             {messages.map((msg) => (
               <div 
                 key={msg.id} 
                 className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
               >
                 {msg.sender === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-black border border-graffiti-lime flex items-center justify-center mr-2 flex-shrink-0">
                        <Bot size={16} className="text-graffiti-lime" />
                    </div>
                 )}
                 
                 <div className={`
                   max-w-[80%] p-3 shadow-md relative
                   ${msg.sender === 'user' 
                     ? 'bg-graffiti-cyan text-black rounded-l-lg rounded-br-lg transform rotate-1' 
                     : 'bg-black text-gray-200 border border-graffiti-lime rounded-r-lg rounded-bl-lg transform -rotate-1 shadow-[0_0_10px_rgba(57,255,20,0.1)]'
                   }
                 `}>
                   {msg.text}
                 </div>
               </div>
             ))}
             
             {isTyping && (
               <div className="flex justify-start">
                  <div className="w-8 h-8 rounded-full bg-black border border-graffiti-lime flex items-center justify-center mr-2">
                        <Bot size={16} className="text-graffiti-lime" />
                  </div>
                  <div className="bg-black border border-graffiti-lime px-4 py-2 rounded-r-lg rounded-bl-lg flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-graffiti-lime rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-graffiti-lime rounded-full animate-bounce delay-100"></span>
                    <span className="w-1.5 h-1.5 bg-graffiti-lime rounded-full animate-bounce delay-200"></span>
                  </div>
               </div>
             )}
             <div ref={messagesEndRef} />
           </div>

           {/* Input Area */}
           <form onSubmit={handleSend} className="bg-black p-3 border-2 border-graffiti-lime border-t-0 flex gap-2">
             <input 
               type="text" 
               value={input}
               onChange={(e) => setInput(e.target.value)}
               placeholder="Ask about AI, music, or projects..."
               className="flex-1 bg-wall-darker border border-gray-700 text-white font-mono px-3 py-2 focus:outline-none focus:border-graffiti-cyan transition-colors placeholder-gray-600"
             />
             <button 
               type="submit"
               className="bg-graffiti-lime text-black p-2 hover:bg-white transition-colors flex items-center justify-center"
             >
               <Send size={20} />
             </button>
           </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;