import React from 'react';
import Sticker from './Sticker';
import { ArrowDown } from 'lucide-react';
import GraffitiDecor from './GraffitiDecor';

const Hero: React.FC = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden px-4 pt-20">
      
      {/* Background Splatters (Simulated with CSS blobs) */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-graffiti-pink rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-graffiti-cyan rounded-full mix-blend-screen filter blur-3xl opacity-20"></div>

      <GraffitiDecor variant="x" color="text-graffiti-lime" className="w-16 h-16 top-32 right-10 rotate-12" />
      <GraffitiDecor variant="swirl" color="text-graffiti-pink" className="w-32 h-32 bottom-32 left-10 -rotate-12 opacity-30" />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <div className="mb-4 flex justify-center gap-4 flex-wrap">
           <Sticker rotate="-rotate-3" color="bg-graffiti-yellow">Developer</Sticker>
           <Sticker rotate="rotate-2" color="bg-graffiti-cyan">Producer</Sticker>
           <Sticker rotate="-rotate-1" color="bg-graffiti-lime">AI Enthusiast</Sticker>
        </div>

        <div className="relative inline-block group cursor-none">
          <GraffitiDecor variant="crown" color="text-graffiti-yellow" className="w-20 h-16 -top-12 -left-6 -rotate-12 transition-transform group-hover:rotate-0" />
          
          {/* Cool Music Graffiti Paint */}
          <GraffitiDecor variant="music" color="text-graffiti-pink" className="w-20 h-20 -top-10 -right-16 rotate-12 animate-bounce" style={{ animationDuration: '3s' }} />
          <GraffitiDecor variant="music" color="text-graffiti-lime" className="w-12 h-12 top-20 -left-12 -rotate-12 opacity-80" />
          <GraffitiDecor variant="splash" color="text-graffiti-cyan" className="w-64 h-64 -top-10 left-1/2 -translate-x-1/2 -z-10 opacity-30" />

          {/* Glitch Container */}
          <div className="relative">
              <h1 className="font-marker text-7xl md:text-9xl text-white mb-2 leading-tight tracking-tighter relative z-10" style={{ textShadow: '5px 5px 0px #ff00ff' }}>
                DENNY<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-graffiti-cyan to-graffiti-lime">MATHEW</span>
              </h1>
              
              {/* Glitch Layers (Visible on Hover) */}
              <h1 className="font-marker text-7xl md:text-9xl text-graffiti-cyan absolute top-0 left-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-none animate-pulse z-0" style={{ clipPath: 'inset(40% 0 61% 0)' }}>
                DENNY<br/>MATHEW
              </h1>
               <h1 className="font-marker text-7xl md:text-9xl text-graffiti-pink absolute top-0 left-0 opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 group-hover:translate-y-1 transition-none animate-pulse delay-75 z-0" style={{ clipPath: 'inset(10% 0 85% 0)' }}>
                DENNY<br/>MATHEW
              </h1>
          </div>
        </div>

        <p className="font-mono text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mt-6 bg-black/50 p-4 border-l-4 border-graffiti-pink relative backdrop-blur-sm hover:bg-black/70 transition-colors">
          <GraffitiDecor variant="scribble" color="text-graffiti-cyan" className="w-full h-full top-0 left-0 opacity-10" />
          Full-Stack Engineering Student @ Karunya University.<br/>
          Making the web <span className="text-graffiti-lime font-bold">LOUD</span>, <span className="text-graffiti-cyan font-bold">SMART</span>, and <span className="text-graffiti-pink font-bold">INTERACTIVE</span>.
        </p>

        <div className="mt-12 flex justify-center relative">
            <GraffitiDecor variant="arrow" color="text-white" className="w-24 h-12 -left-28 top-2 rotate-12 hidden md:block" />
            <a 
              href="#projects"
              className="group relative inline-block focus:outline-none focus:ring"
            >
              <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-graffiti-yellow transition-transform group-hover:translate-y-0 group-hover:translate-x-0"></span>

              <span className="relative inline-block border-2 border-current px-8 py-3 text-sm font-bold uppercase tracking-widest text-black group-active:text-opacity-75 bg-white">
                View My Stash
              </span>
            </a>
        </div>
      </div>

      <div className="absolute bottom-10 animate-bounce text-graffiti-cyan">
        <ArrowDown size={40} strokeWidth={3} />
      </div>
    </section>
  );
};

export default Hero;