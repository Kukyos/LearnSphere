import React, { useState, useEffect } from 'react';
import GraffitiDecor, { Variant } from './GraffitiDecor';

interface Tag {
    id: number;
    x: number;
    y: number;
    variant: Variant;
    color: string;
    rotation: number;
    scale: number;
}

const VARIANTS: Variant[] = ['crown', 'x', 'scribble', 'swirl', 'splash', 'star', 'lightning', 'heart'];
const COLORS = ['text-graffiti-pink', 'text-graffiti-cyan', 'text-graffiti-lime', 'text-graffiti-yellow', 'text-white'];

const GraffitiWall: React.FC = () => {
    const [tags, setTags] = useState<Tag[]>([]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            // Do not tag if clicking on interactive elements or chatbot
            const target = e.target as HTMLElement;
            if (
                target.closest('a, button, input, textarea, .no-tag') ||
                target.closest('form')
            ) return;

            const newTag: Tag = {
                id: Date.now(),
                x: e.pageX,
                y: e.pageY,
                variant: VARIANTS[Math.floor(Math.random() * VARIANTS.length)],
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                rotation: Math.random() * 360,
                scale: 0.5 + Math.random() * 1.5
            };

            setTags(prev => {
                const newTags = [...prev, newTag];
                if (newTags.length > 20) return newTags.slice(1);
                return newTags;
            });
        };

        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {tags.map(tag => (
                <div 
                    key={tag.id}
                    className="absolute animate-drip"
                    style={{
                        left: tag.x,
                        top: tag.y,
                        transform: `translate(-50%, -50%) rotate(${tag.rotation}deg) scale(${tag.scale})`
                    }}
                >
                    <GraffitiDecor variant={tag.variant} color={tag.color} className="w-20 h-20 opacity-90 drop-shadow-md" />
                </div>
            ))}
        </div>
    );
};
export default GraffitiWall;