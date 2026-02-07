import React, { useEffect, useState } from 'react';
import { PlayCircle, Plus, ThumbsUp, ChevronDown } from 'lucide-react';
import { Course } from '../types';

interface ExpandedCourseCardProps {
  course: Course;
  rect: DOMRect;
  onLeave: () => void;
  onPlay: (course: Course) => void;
}

const ExpandedCourseCard: React.FC<ExpandedCourseCardProps> = ({ course, rect, onLeave, onPlay }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Small delay to allow enter animation
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  // Calculate position: Center the expansion over the original card, but slightly larger
  // We need to account for scroll position since rect is viewport relative
  const width = 320;
  const scale = 1.1; // Scale factor
  // Center horizontally relative to original rect
  const left = rect.left + rect.width / 2 - width / 2;
  // Position vertically: shift up slightly to make room for content
  const top = rect.top - 20; 

  // Check collision with right edge of screen
  const safeLeft = Math.min(Math.max(16, left), window.innerWidth - width - 16);

  return (
    <div 
      className="fixed z-[1000] pointer-events-auto"
      style={{
        left: safeLeft,
        top: top,
        width: width,
      }}
      onMouseLeave={onLeave}
    >
      <div 
        className={`w-full overflow-hidden rounded-lg bg-nature-card shadow-2xl ring-1 ring-brand-900/5 transition-all duration-300 ease-out origin-center
          ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}
        `}
      >
        {/* Expanded Image Area */}
        <div className="relative aspect-video w-full overflow-hidden bg-brand-200">
             <img 
                src={course.thumbnailUrl} 
                alt={course.title} 
                className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                 <button 
                    onClick={() => onPlay(course)}
                    className="rounded-full bg-white/20 p-3 backdrop-blur-sm transition hover:bg-white/40 hover:scale-105"
                 >
                    <PlayCircle className="text-white" size={40} fill="currentColor" fillOpacity={0.2} />
                 </button>
            </div>
        </div>

        {/* Expanded Info Area */}
        <div className="p-4 bg-nature-card dark:bg-brand-900">
            {/* Actions Bar */}
            <div className="flex items-center gap-3 mb-3">
                <button 
                    onClick={() => onPlay(course)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white hover:bg-brand-700 transition-colors shadow-sm"
                >
                    <PlayCircle size={20} fill="currentColor" />
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-300 text-brand-600 hover:border-brand-600 hover:text-brand-800 dark:text-brand-200 dark:border-brand-600 dark:hover:text-white transition-colors">
                    <Plus size={16} />
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-300 text-brand-600 hover:border-brand-600 hover:text-brand-800 dark:text-brand-200 dark:border-brand-600 dark:hover:text-white transition-colors">
                    <ThumbsUp size={16} />
                </button>
                <div className="ml-auto">
                    <button 
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-300 text-brand-600 hover:border-brand-600 hover:text-brand-800 dark:text-brand-200 dark:border-brand-600 dark:hover:text-white transition-colors"
                    >
                        <ChevronDown size={16} />
                    </button>
                </div>
            </div>

            {/* Metadata Line */}
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 dark:text-brand-300 mb-2">
                <span className="text-green-600 dark:text-green-400">98% Match</span>
                <span className="border border-brand-300 px-1 rounded text-[10px] text-brand-500 dark:text-brand-400 uppercase">{course.difficulty}</span>
                <span className="text-brand-500 dark:text-brand-400">{course.duration}</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 text-[10px] text-brand-500 dark:text-brand-300 mb-2">
                {course.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="flex items-center gap-1">
                       <span className="w-1.5 h-1.5 rounded-full bg-brand-400"></span> {tag}
                    </span>
                ))}
            </div>

            <h4 className="font-bold text-brand-900 dark:text-white text-sm mb-1">{course.title}</h4>
            <p className="text-[11px] text-brand-600 dark:text-brand-400 line-clamp-2 leading-relaxed">
                {course.description}
            </p>
        </div>
      </div>
    </div>
  );
};

export default ExpandedCourseCard;