import React, { useRef } from 'react';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
  onHover: (course: Course, rect: DOMRect) => void;
  width?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onHover, width = "w-[280px]" }) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      if (cardRef.current) {
        onHover(course, cardRef.current.getBoundingClientRect());
      }
    }, 400); // Wait 400ms before expanding to avoid jitter
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  return (
    <div 
      ref={cardRef}
      className={`relative ${width} flex-none h-[160px] sm:h-[180px] rounded-md transition-all duration-300 cursor-pointer group`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="h-full w-full overflow-hidden rounded-md bg-brand-100 shadow-sm transition-transform duration-300">
         <img 
            src={course.thumbnailUrl} 
            alt={course.title} 
            className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-80"
            loading="lazy"
         />
         <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-900/90 to-transparent p-3 pt-8">
            <h3 className="line-clamp-1 text-xs font-semibold text-brand-50 text-shadow-sm">{course.title}</h3>
         </div>
      </div>
    </div>
  );
};

export default CourseCard;