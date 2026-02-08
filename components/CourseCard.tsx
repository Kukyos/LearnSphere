import React, { useState, useRef } from 'react';
import { Star, PlayCircle, Plus, ThumbsUp, ChevronDown } from 'lucide-react';
import { Course } from '../types';
import TiltCard from './TiltCard';

interface CourseCardProps {
  course: Course;
  onPreview: (course: Course) => void;
  width?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onPreview, width = "w-[280px]" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 500); // 500ms delay before popping out
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsHovered(false);
  };

  return (
    <div 
      className={`relative ${width} flex-none h-[220px] transition-all duration-300`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      aria-label={`Open course: ${course.title}`}
      data-course-title={course.title}
      tabIndex={0}
    >
      {/* Placeholder Base Card (Visible when not hovered/popped) */}
      <TiltCard tiltMaxX={8} tiltMaxY={8} scale={1.02} glareEnabled className={`h-full w-full overflow-hidden rounded-md bg-brand-100 transition-opacity duration-300 cursor-pointer ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
        <div onClick={() => onPreview(course)} className="h-full w-full">
         <img 
            src={course.thumbnailUrl} 
            alt={course.title} 
            className="h-full w-full object-cover opacity-90 transition-opacity hover:opacity-100"
         />
         <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-900 via-brand-900/60 to-transparent p-4 pt-12">
            <h3 className="line-clamp-1 text-sm font-semibold text-brand-50 text-shadow-sm">{course.title}</h3>
         </div>
        </div>
      </TiltCard>

      {/* Pop-out Card Overlay */}
      <div 
        className={`absolute top-0 left-0 z-50 w-full rounded-lg bg-white shadow-2xl transition-all duration-300 ease-out origin-center
            ${isHovered ? 'scale-125 -translate-y-12 opacity-100 visible' : 'scale-100 opacity-0 invisible pointer-events-none'}
        `}
        style={{ width: '100%', minWidth: '320px', left: '-20px' }} // Slightly wider expansion
      >
        {/* Expanded Image Area */}
        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-brand-900">
             <img 
                src={course.thumbnailUrl} 
                alt={course.title} 
                className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                 <button 
                    onClick={() => onPreview(course)}
                    className="rounded-full bg-white/20 p-3 backdrop-blur-sm transition hover:bg-white/40 hover:scale-105"
                 >
                    <PlayCircle className="text-white" size={40} fill="currentColor" fillOpacity={0.2} />
                 </button>
            </div>
        </div>

        {/* Expanded Info Area */}
        <div className="p-4 bg-white rounded-b-lg shadow-2xl ring-1 ring-brand-200">
            {/* Actions Bar */}
            <div className="flex items-center gap-3 mb-3">
                <button 
                    onClick={() => onPreview(course)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand-900 hover:bg-brand-50 transition-colors"
                >
                    <PlayCircle size={20} fill="currentColor" />
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-200 text-brand-600 hover:border-brand-400 hover:text-brand-800 transition-colors">
                    <Plus size={16} />
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-200 text-brand-600 hover:border-brand-400 hover:text-brand-800 transition-colors">
                    <ThumbsUp size={16} />
                </button>
                <div className="ml-auto">
                    <button 
                        onClick={() => onPreview(course)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-200 text-brand-600 hover:border-brand-400 hover:text-brand-800 transition-colors"
                    >
                        <ChevronDown size={16} />
                    </button>
                </div>
            </div>

            {/* Metadata Line */}
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-900 mb-2">
                <span className="border border-brand-200 px-1 rounded text-[10px] text-brand-600 uppercase">{course.difficulty}</span>
                <span className="text-brand-500">{course.duration}</span>
                {course.rating > 0 && <span className="text-brand-500">★ {course.rating}</span>}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 text-[10px] text-brand-600 mb-2">
                {course.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="flex items-center gap-1">
                       <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span> {tag}
                    </span>
                ))}
            </div>

            <h4 className="font-bold text-brand-900 text-sm mb-1">{course.title}</h4>
            <p className="text-[11px] text-brand-500 line-clamp-2 leading-relaxed">
                {course.description}
            </p>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;