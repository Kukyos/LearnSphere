import React, { useEffect, useState } from 'react';

const ScrollProgress = () => {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            setWidth(scrolled);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div 
            className="fixed top-0 left-0 h-1 z-[100] transition-all duration-100 ease-out shadow-[0_0_10px_currentColor] bg-gradient-to-r from-graffiti-pink via-graffiti-purple to-graffiti-cyan" 
            style={{ width: `${width}%` }}
        ></div>
    );
};
export default ScrollProgress;