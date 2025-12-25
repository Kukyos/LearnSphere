import React, { useEffect, useState } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    // Only run on non-touch devices
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (
            target.tagName.toLowerCase() === 'a' ||
            target.tagName.toLowerCase() === 'button' ||
            target.tagName.toLowerCase() === 'input' ||
            target.tagName.toLowerCase() === 'textarea' ||
            target.closest('a') ||
            target.closest('button') ||
            target.classList.contains('cursor-pointer')
        ) {
            setIsHovering(true);
        } else {
            setIsHovering(false);
        }
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <div 
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block mix-blend-difference"
        style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
    >
        {/* Main Crosshair */}
        <div className={`
            absolute -translate-x-1/2 -translate-y-1/2 border-2 border-white rounded-full transition-all duration-150 ease-out
            ${isHovering ? 'w-12 h-12 bg-white/10 border-graffiti-cyan' : 'w-6 h-6 border-white'}
            ${isClicking ? 'scale-75 border-graffiti-pink' : 'scale-100'}
        `}>
            {/* Crosshair lines */}
            {!isHovering && (
                <>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-full bg-white/50"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-0.5 bg-white/50"></div>
                </>
            )}
        </div>
        
        {/* Center Dot */}
        <div className={`
            absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-75
            ${isClicking ? 'w-2 h-2 bg-graffiti-pink' : 'w-1 h-1 bg-graffiti-lime'}
        `}></div>
    </div>
  );
};

export default CustomCursor;