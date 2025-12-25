import React from 'react';

export type Variant = 'crown' | 'arrow' | 'scribble' | 'x' | 'swirl' | 'underline' | 'music' | 'splash' | 'waveform' | 'star' | 'lightning' | 'heart';

interface GraffitiDecorProps {
  variant: Variant;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

const GraffitiDecor: React.FC<GraffitiDecorProps> = ({ variant, color = 'text-graffiti-pink', className = '', style }) => {
  const getPath = () => {
    switch (variant) {
      case 'crown':
        return (
          <path d="M5 25 L15 5 L25 25 L35 5 L45 25 L45 35 L5 35 Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round"/>
        );
      case 'arrow':
        return (
          <path d="M10 25 Q30 10 50 25 T90 25 M80 15 L90 25 L80 35" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"/>
        );
      case 'scribble':
        return (
          <path d="M10 50 Q30 20 50 50 T90 50 Q110 20 130 50" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round"/>
        );
      case 'x':
        return (
          <path d="M10 10 L40 40 M40 10 L10 40" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round"/>
        );
      case 'swirl':
        return (
          <path d="M50 50 m-40 0 a 40 40 0 1 0 80 0 a 40 40 0 1 0 -80 0" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" fill="none"/>
        );
      case 'underline':
        return (
           <path d="M5 15 Q 50 5, 95 15 T 185 15" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
        );
      case 'music':
        return (
          <>
             {/* Beamed eighth notes */}
             <path d="M15 45 a 6 6 0 1 1 -12 0 a 6 6 0 1 1 12 0 v -35 h 25 v 35 a 6 6 0 1 1 -12 0 a 6 6 0 1 1 12 0" stroke="currentColor" strokeWidth="3" fill="none" />
             <path d="M18 10 h 25" stroke="currentColor" strokeWidth="5" />
          </>
        );
      case 'splash':
        return (
           <path d="M50 25 Q 65 5, 85 25 T 90 60 Q 75 85, 50 75 T 10 60 Q 15 25, 50 25" stroke="none" fill="currentColor" opacity="0.4" />
        );
      case 'waveform':
        return (
            <path d="M0 50 L10 30 L20 70 L30 20 L40 80 L50 10 L60 90 L70 40 L80 60 L90 50 L100 50" stroke="currentColor" strokeWidth="3" fill="none" strokeLinejoin="round" />
        );
      case 'star':
        return (
            <path d="M25 2 L32 18 L50 18 L36 29 L41 46 L25 36 L9 46 L14 29 L0 18 L18 18 Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
        );
      case 'lightning':
        return (
            <path d="M30 0 L0 30 L20 30 L10 60 L40 30 L20 30 L30 0 Z" stroke="currentColor" strokeWidth="2" fill="currentColor" strokeLinejoin="round" />
        );
      case 'heart':
        return (
            <path d="M10 30 A 20 20 0 0 1 50 30 A 20 20 0 0 1 90 30 Q 90 60 50 90 Q 10 60 10 30 Z" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
        );
      default:
        return null;
    }
  };

  const getViewBox = () => {
    switch(variant) {
      case 'crown': return "0 0 50 40";
      case 'arrow': return "0 0 100 50";
      case 'scribble': return "0 0 140 100";
      case 'x': return "0 0 50 50";
      case 'swirl': return "0 0 100 100";
      case 'underline': return "0 0 200 30";
      case 'music': return "0 0 60 60";
      case 'splash': return "0 0 100 100";
      case 'waveform': return "0 0 100 100";
      case 'star': return "0 0 50 50";
      case 'lightning': return "0 0 40 60";
      case 'heart': return "0 0 100 100";
      default: return "0 0 100 100";
    }
  };

  return (
    <svg 
      viewBox={getViewBox()} 
      className={`absolute pointer-events-none opacity-80 ${color} ${className}`} 
      style={style}
      xmlns="http://www.w3.org/2000/svg"
    >
      {getPath()}
    </svg>
  );
};

export default GraffitiDecor;