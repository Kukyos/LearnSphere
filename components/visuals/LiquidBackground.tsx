import React from 'react';
import { motion } from 'framer-motion';

export const LiquidBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-slate-950">
      {/* 
        This simulates the swirling liquid effect using multiple overlapping gradients 
        and SVG filters, but optimized with simple CSS animations for performance.
      */}
      
      {/* Base Dark Layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#1e1b4b] to-black opacity-90 z-0" />

      {/* Animated Blobs */}
      <div className="absolute inset-0 opacity-60 z-0">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-liquid-primary rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-liquid-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-96 h-96 bg-liquid-accent rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        
        {/* Extra turbulence layers for that 'Balatro' swirly feel */}
        <motion.div 
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] rounded-full bg-[conic-gradient(at_center,_var(--tw-gradient-stops))] from-indigo-500 via-purple-500 to-teal-500 opacity-20 blur-3xl"
        />
      </div>

      {/* Noise Texture Overlay for graininess */}
      <div className="absolute inset-0 opacity-[0.03] z-[1] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
    </div>
  );
};