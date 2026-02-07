import React from 'react';
import { Search, Sparkles, ArrowRight } from 'lucide-react';
import PixelBlast from './PixelBlast';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

const Hero: React.FC<HeroProps> = ({ searchQuery, onSearchChange, onSearchSubmit }) => {
  return (
    <div className="relative overflow-hidden pt-40 pb-20 sm:pt-48 sm:pb-32 bg-nature-light">
      
      {/* 3D Background Effect */}
      <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
         <PixelBlast 
            variant="square"
            color="#5c7f4c" 
            speed={0.6}
            enableRipples
         />
      </div>
      
      {/* Gradient Overlay for bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-nature-light to-transparent z-0"></div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6">
        <div className="mb-8 flex justify-center animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-300 bg-nature-card/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-700 shadow-sm backdrop-blur-md">
                <Sparkles size={12} className="text-brand-500" /> 
                <span>Start your journey</span>
            </span>
        </div>
        
        <h1 className="mb-8 text-6xl font-extrabold tracking-tight text-brand-900 sm:text-7xl md:text-8xl animate-fade-in [animation-delay:100ms] drop-shadow-sm">
          Grow <span className="italic font-serif font-light text-brand-600">naturally</span> <br className="hidden sm:block" />
          at your own pace.
        </h1>
        
        <p className="mx-auto mb-12 max-w-xl text-lg font-medium text-brand-700 animate-fade-in [animation-delay:200ms] leading-relaxed">
           Discover a calming, distraction-free environment to master new skills. From creative arts to mindful leadership.
        </p>

        {/* Search Bar - Visual only as per request */}
        <form onSubmit={onSearchSubmit} className="relative mx-auto max-w-lg animate-fade-in [animation-delay:300ms]">
          <div className="group relative">
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-brand-400 opacity-20 blur-xl transition-opacity duration-300 group-hover:opacity-40"></div>
            
            <div className="relative flex items-center rounded-full border border-brand-200 bg-nature-card p-2 shadow-xl shadow-brand-900/5 transition-all focus-within:ring-4 focus-within:ring-brand-200">
                <Search className="ml-4 text-brand-500" size={20} />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Find your path..."
                    className="flex-1 border-none bg-transparent px-4 py-2 text-base text-brand-900 placeholder-brand-400 focus:outline-none focus:ring-0"
                />
                <button 
                    type="submit"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-700 text-white transition-transform hover:scale-105 hover:bg-brand-600"
                >
                    <ArrowRight size={18} />
                </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Hero;