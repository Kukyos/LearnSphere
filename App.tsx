import React from 'react';
import { AuthForm } from './components/auth/AuthForm';
import { WorldGlobe } from './components/visuals/WorldGlobe';
import { motion } from 'framer-motion';

const App: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans bg-nature-light selection:bg-brand-300/40 text-brand-900">
      
      {/* Background gradient */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-nature-card via-nature-light to-nature-muted"></div>

      {/* Main Content Container - Split Screen */}
      <div className="relative z-10 w-full min-h-screen flex flex-col lg:flex-row">
        
        {/* LEFT SIDE: Auth Form */}
        <div className="w-full lg:w-[45%] flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12 lg:py-0 relative z-20">
            
            {/* Logo area */}
            <div className="absolute top-8 left-8 lg:left-12 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-700 flex items-center justify-center shadow-lg shadow-brand-900/15">
                <div className="w-4 h-4 bg-brand-50 rounded-full"></div>
              </div>
              <span className="text-xl font-display font-bold text-brand-900 tracking-wide">LearnSphere</span>
            </div>

            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full max-w-md mx-auto lg:ml-0 lg:mr-auto mt-16 lg:mt-0"
            >
              {/* Card */}
              <div className="bg-nature-card/90 backdrop-blur-xl border border-brand-200/60 rounded-[2rem] p-8 sm:p-10 shadow-2xl shadow-brand-900/8 relative overflow-hidden">
                 {/* Subtle ambient glow */}
                 <div className="absolute -top-32 -right-32 w-64 h-64 bg-brand-300/30 rounded-full blur-[80px]"></div>
                 
                 <AuthForm />
              </div>
              
              <div className="mt-8 text-center lg:text-left text-xs text-brand-500 font-medium">
                &copy; 2026 LearnSphere Inc. &bull; <a href="#" className="hover:text-brand-700 transition-colors">Privacy</a> &bull; <a href="#" className="hover:text-brand-700 transition-colors">Terms</a>
              </div>
            </motion.div>
        </div>

        {/* RIGHT SIDE: Interactive Globe */}
        <div className="hidden lg:flex w-full lg:w-[55%] h-screen relative items-center justify-center overflow-hidden">
           {/* Fade in animation for the globe */}
           <motion.div
             className="w-full h-full absolute inset-0"
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
           >
              <WorldGlobe />
           </motion.div>
           
           {/* Vignette overlay */}
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_30%,_var(--tw-gradient-to))] to-nature-light pointer-events-none"></div>

           {/* Seamless transition gradient */}
           <div className="absolute top-0 bottom-0 left-0 w-64 bg-gradient-to-r from-nature-light via-nature-light/70 to-transparent z-10 pointer-events-none"></div>
        </div>

      </div>

    </div>
  );
};

export default App;