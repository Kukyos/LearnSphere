import React from 'react';
import { motion } from 'framer-motion';
import { SphereCharacter } from './SphereCharacter';
import { CheckCircle2, Flame, Trophy, Zap, MessageCircle } from 'lucide-react';

const FloatingCard = ({ delay, x, y, children, className, scale = 1 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.9 }}
    animate={{ 
      opacity: 1, 
      y: [0, -15, 0],
      scale: scale,
    }}
    transition={{ 
      opacity: { duration: 0.8, delay },
      y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: delay * 2 },
      scale: { duration: 0.5, delay }
    }}
    className={`absolute backdrop-blur-xl bg-slate-800/40 border border-white/10 shadow-2xl rounded-2xl p-4 flex items-center gap-4 ${className}`}
    style={{ left: x, top: y }}
  >
    {children}
  </motion.div>
);

export const HeroVisuals: React.FC = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center perspective-1000">
      
      {/* Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse delay-1000" />

      {/* Central Character */}
      <div className="relative z-10 scale-110 lg:scale-125 transform-gpu">
        <SphereCharacter />
      </div>

      {/* Floating UI Elements - Making it look like a busy, alive dashboard/ecosystem */}
      
      {/* Top Right - Streak Card */}
      <FloatingCard delay={0.2} x="60%" y="15%" className="z-20 hidden lg:flex border-l-4 border-l-orange-500">
        <div className="bg-orange-500/20 p-2.5 rounded-xl text-orange-400 shadow-inner shadow-orange-500/10">
          <Flame size={24} fill="currentColor" className="drop-shadow-lg" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Daily Streak</p>
          <div className="flex items-baseline gap-1">
             <p className="text-lg text-white font-bold font-display">24 Days</p>
             <span className="text-xs text-green-400 font-bold">+2</span>
          </div>
        </div>
      </FloatingCard>

      {/* Bottom Left - Course Completion */}
      <FloatingCard delay={0.5} x="10%" y="65%" className="z-20 hidden lg:flex border-l-4 border-l-green-500">
        <div className="bg-green-500/20 p-2.5 rounded-xl text-green-400 shadow-inner shadow-green-500/10">
          <CheckCircle2 size={24} className="drop-shadow-lg" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Just Completed</p>
          <p className="text-lg text-white font-bold font-display">UX Design Masterclass</p>
        </div>
      </FloatingCard>

      {/* Top Left - Community Active */}
      <FloatingCard delay={0.8} x="15%" y="25%" scale={0.9} className="z-0 hidden lg:flex blur-[0.5px] opacity-60">
         <div className="flex -space-x-3 overflow-hidden pl-1">
            {[1,2,3,4].map(i => (
                <img key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-[#0B0F19] object-cover" src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${i*55}`} alt=""/>
            ))}
         </div>
         <div className="text-xs text-slate-300 font-medium pl-2">
            <span className="text-blue-400 font-bold block text-sm">Active Now</span>
            <span className="opacity-70">1,234 learners online</span>
         </div>
      </FloatingCard>

       {/* Bottom Right - Skill Badge */}
       <FloatingCard delay={1.1} x="65%" y="75%" scale={0.85} className="z-0 hidden lg:flex blur-[0.5px] opacity-60">
        <div className="bg-indigo-500/20 p-2 rounded-xl text-indigo-400">
          <Trophy size={20} />
        </div>
        <div className="pr-2">
           <p className="text-xs text-slate-400">New Badge Earned</p>
           <p className="text-sm text-white font-bold">System Architect</p>
        </div>
      </FloatingCard>

      {/* Tiny particles/icons floating in background for depth */}
      <motion.div 
        animate={{ y: [0, -40, 0], opacity: [0, 0.5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 1 }}
        className="absolute left-[30%] top-[40%] text-blue-300/20"
      >
        <Zap size={24} />
      </motion.div>
      <motion.div 
        animate={{ y: [0, -60, 0], opacity: [0, 0.5, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "linear", delay: 2.5 }}
        className="absolute right-[20%] top-[60%] text-pink-300/20"
      >
        <MessageCircle size={32} />
      </motion.div>

    </div>
  );
};
