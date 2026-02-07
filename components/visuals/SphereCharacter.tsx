import React from 'react';
import { motion } from 'framer-motion';

/**
 * An abstract "Sphere" character that represents knowledge/learning.
 * It's geometric, modern, and floats/breathes.
 */
export const SphereCharacter: React.FC = () => {
  return (
    <div className="relative w-80 h-80 md:w-96 md:h-96 flex items-center justify-center perspective-1000">
      
      {/* Outer Glow */}
      <motion.div 
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.8, 1.1, 0.8] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-brand-500/30 rounded-full blur-[60px]"
      />

      {/* Core Sphere */}
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-48 h-48 md:w-64 md:h-64"
      >
        {/* Ring 1 - Vertical Rotation */}
        <motion.div 
            className="absolute inset-0 border-[6px] border-cyan-400/80 rounded-full"
            style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }}
            animate={{ 
                rotateZ: 360,
                rotateX: [0, 45, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Ring 2 - Horizontal Rotation */}
        <motion.div 
            className="absolute inset-2 border-[4px] border-pink-500/80 rounded-full"
            style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}
            animate={{ 
                rotateZ: -360,
                rotateY: [0, 45, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />

        {/* Ring 3 - Diagonal */}
        <motion.div 
            className="absolute inset-6 border-[2px] border-indigo-400/90 rounded-full dashed"
            style={{ borderRadius: '50%' }}
            animate={{ 
                rotate: 360,
                scale: [0.9, 1.1, 0.9]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
            <div className="w-3 h-3 bg-white rounded-full absolute -top-1.5 left-1/2 -translate-x-1/2 shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
        </motion.div>

        {/* Central Core */}
        <motion.div 
            className="absolute inset-0 m-auto w-16 h-16 bg-gradient-to-tr from-cyan-300 to-blue-600 rounded-full shadow-[0_0_30px_rgba(59,130,246,0.6)]"
            animate={{ 
                scale: [1, 1.2, 1],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
             <div className="absolute inset-0 bg-white/30 rounded-full blur-sm" />
        </motion.div>

        {/* Floating Particles */}
        {[...Array(5)].map((_, i) => (
            <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full opacity-60"
                initial={{ x: 0, y: 0 }}
                animate={{
                    x: Math.cos(i * 72) * 100,
                    y: Math.sin(i * 72) * 100,
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0]
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeInOut"
                }}
                style={{ top: '50%', left: '50%' }}
            />
        ))}

      </motion.div>
    </div>
  );
};