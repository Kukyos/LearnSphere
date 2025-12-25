import React, { useState, useEffect, useRef } from 'react';

interface SprayHeadingProps {
  text: string;
  color: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

const SprayHeading: React.FC<SprayHeadingProps> = ({ text, color, align = 'left', className = '' }) => {
  const [status, setStatus] = useState<'off' | 'flickering' | 'on'>('off');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && status === 'off') {
            // Start the flicker effect automatically when in view
            setStatus('flickering');
            
            // Transition to fully on after animation
            setTimeout(() => {
              setStatus('on');
            }, 1500);

            // Stop observing once triggered so it doesn't reset or re-trigger
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
          }
        });
      },
      { 
        threshold: 0.4, // Trigger when 40% of the heading is visible
        rootMargin: '0px 0px -50px 0px' // Offset slightly so it triggers well within viewport
      } 
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [status]);

  const alignClass = align === 'center' ? 'text-center items-center' : align === 'right' ? 'text-right items-end' : 'text-left items-start';
  
  return (
    <div ref={containerRef} className={`relative mb-16 flex flex-col ${alignClass} ${className} group select-none`}>
      
      {/* Graffiti Paint Splatter Background (visible but dim when off, bright when on) */}
      <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[200%] -z-10 transition-all duration-1000 ${status === 'off' ? 'opacity-0 scale-90' : 'opacity-60 scale-100'}`}>
         <svg viewBox="0 0 200 200" className={`w-full h-full text-${color} fill-current animate-pulse`} style={{ animationDuration: '4s' }}>
            <path d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,79.6,-46.3C87.4,-33.5,90.1,-17.9,86.9,-3.2C83.7,11.5,74.6,25.3,64.8,37.4C55,49.5,44.5,59.9,32.4,67.6C20.3,75.3,6.6,80.3,-5.6,77.6C-17.8,74.9,-28.5,64.5,-39.7,55.8C-50.9,47.1,-62.6,40.1,-70.5,30.3C-78.4,20.5,-82.5,7.9,-81.2,-4.2C-79.9,-16.3,-73.2,-27.9,-64.1,-37.6C-55,-47.3,-43.5,-55.1,-31.8,-63.9C-20.1,-72.7,-8.2,-82.5,5.1,-84.1C18.4,-85.7,30.5,-79.6,44.7,-76.4Z" transform="translate(100 100)" />
         </svg>
      </div>

      {/* Paint Drips */}
      <div className="absolute top-full left-0 w-full flex justify-center gap-8 -z-5 pointer-events-none opacity-80">
         <div className={`w-3 rounded-b-full transition-all duration-[1000ms] ease-in ${status !== 'off' ? `h-24 bg-${color}` : 'h-0 bg-gray-800'}`}></div>
         <div className={`w-2 rounded-b-full transition-all duration-[1500ms] ease-in delay-100 ${status !== 'off' ? `h-32 bg-${color}` : 'h-0 bg-gray-800'}`}></div>
         <div className={`w-4 rounded-b-full transition-all duration-[1200ms] ease-in delay-75 ${status !== 'off' ? `h-16 bg-${color}` : 'h-0 bg-gray-800'}`}></div>
      </div>

      {/* Main Text */}
      <div className="relative">
        <h2 
          className={`
            font-rock text-4xl md:text-7xl transition-colors duration-200
            ${status === 'off' ? 'neon-off' : ''}
            ${status === 'flickering' ? `text-${color} neon-flicker` : ''}
            ${status === 'on' ? `text-${color} neon-on` : ''}
          `}
        >
          {text}
        </h2>
      </div>

      {/* Underline Splash */}
      <div className={`
        mt-2 h-2 w-3/4 rounded-full transform -rotate-1 transition-all duration-1000
        ${status === 'off' ? 'bg-[#333] w-3/4 shadow-[0_0_2px_#000]' : `bg-${color} opacity-100 shadow-[0_0_15px_currentColor]`}
      `}></div>
    </div>
  );
};

export default SprayHeading;