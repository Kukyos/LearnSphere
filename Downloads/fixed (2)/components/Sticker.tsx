import React from 'react';

interface StickerProps {
  children: React.ReactNode;
  rotate?: string;
  color?: string;
  className?: string;
}

const Sticker: React.FC<StickerProps> = ({ children, rotate = 'rotate-2', color = 'bg-white', className = '' }) => {
  return (
    <div className={`inline-block transform ${rotate} p-2 shadow-lg border-2 border-black ${color} ${className}`}>
      <div className="font-marker uppercase tracking-widest text-black text-sm md:text-base text-center border border-dashed border-black/50 p-1">
        {children}
      </div>
    </div>
  );
};

export default Sticker;