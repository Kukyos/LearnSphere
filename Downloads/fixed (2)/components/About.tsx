import React from 'react';
import { ABOUT_TEXT, PROFILE_IMAGES } from '../constants';
import SprayHeading from './SprayHeading';
import GraffitiDecor from './GraffitiDecor';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 px-4 relative">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Image Area - Graffiti Photo Stack */}
          <div className="relative h-[450px] w-full flex items-center justify-center md:block">
            
            {/* Graffiti Backdrop for Photos */}
            <GraffitiDecor variant="swirl" color="text-graffiti-lime" className="w-64 h-64 top-0 left-10 opacity-20 animate-spin-slow" style={{ animationDuration: '20s' }} />

            {/* Photo 1: Keyboard/Piano (Bottom Layer) */}
            <div className="absolute top-0 left-0 md:left-4 w-64 md:w-72 transform -rotate-6 transition-all duration-300 hover:scale-105 hover:z-30 hover:rotate-0 z-10 group cursor-pointer">
                {/* Tape */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/20 backdrop-blur-sm rotate-2 shadow-sm z-20"></div>
                
                <div className="bg-white p-3 pb-12 shadow-[0_10px_20px_rgba(0,0,0,0.5)] transform transition-transform group-hover:shadow-[0_20px_40px_rgba(255,0,255,0.3)]">
                    <div className="overflow-hidden border border-gray-200">
                        <img 
                            src={PROFILE_IMAGES.keyboard} 
                            alt="Playing Keys" 
                            className="w-full h-48 object-cover grayscale contrast-125 hover:grayscale-0 transition duration-500"
                        />
                    </div>
                    <div className="absolute bottom-2 left-0 w-full text-center font-marker text-black text-xl rotate-1">
                        KEYBOARD_FLOW
                    </div>
                </div>
            </div>

            {/* Photo 2: Band/Stage (Top Layer) */}
            <div className="absolute top-24 left-12 md:left-32 w-64 md:w-72 transform rotate-3 transition-all duration-300 hover:scale-105 hover:z-30 hover:rotate-0 z-20 group cursor-pointer">
                {/* Tape */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/20 backdrop-blur-sm -rotate-3 shadow-sm z-20"></div>
                
                {/* Music Note Decoration popping out */}
                <GraffitiDecor variant="music" color="text-graffiti-cyan" className="w-16 h-16 -top-10 -right-8 rotate-12 z-30 drop-shadow-lg" />

                <div className="bg-white p-3 pb-12 shadow-[0_10px_20px_rgba(0,0,0,0.5)] transform transition-transform group-hover:shadow-[0_20px_40px_rgba(0,255,255,0.3)]">
                     <div className="overflow-hidden border border-gray-200">
                        <img 
                            src={PROFILE_IMAGES.stage} 
                            alt="Live on Stage" 
                            className="w-full h-48 object-cover grayscale contrast-125 hover:grayscale-0 transition duration-500"
                        />
                    </div>
                    <div className="absolute bottom-2 left-0 w-full text-center font-marker text-black text-xl -rotate-1">
                        ON_STAGE
                    </div>
                </div>
            </div>
            
            {/* Decorative Graffiti Behind */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 pointer-events-none">
                <svg viewBox="0 0 200 200" className="w-full h-full text-graffiti-pink opacity-20 animate-pulse">
                    <path fill="currentColor" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,79.6,-46.3C87.4,-33.5,90.1,-17.9,86.9,-3.2C83.7,11.5,74.6,25.3,64.8,37.4C55,49.5,44.5,59.9,32.4,67.6C20.3,75.3,6.6,80.3,-5.6,77.6C-17.8,74.9,-28.5,64.5,-39.7,55.8C-50.9,47.1,-62.6,40.1,-70.5,30.3C-78.4,20.5,-82.5,7.9,-81.2,-4.2C-79.9,-16.3,-73.2,-27.9,-64.1,-37.6C-55,-47.3,-43.5,-55.1,-31.8,-63.9C-20.1,-72.7,-8.2,-82.5,5.1,-84.1C18.4,-85.7,30.5,-79.6,44.7,-76.4Z" transform="translate(100 100)" />
                </svg>
            </div>

          </div>

          {/* Text Content */}
          <div className="relative z-10">
            <SprayHeading text="WHO AM I?" color="graffiti-yellow" />
            
            <div className="bg-white/5 backdrop-blur-sm p-6 border-l-8 border-graffiti-lime shadow-[0_0_20px_rgba(57,255,20,0.1)] relative">
              {/* Corner Tape */}
              <div className="absolute -top-3 -right-3 w-16 h-8 bg-graffiti-pink/80 transform rotate-45"></div>

              <p className="font-mono text-gray-300 mb-6 leading-relaxed">
                {ABOUT_TEXT.intro}
              </p>
              <p className="font-mono text-gray-400 mb-6 text-sm">
                {ABOUT_TEXT.details}
              </p>
              
              <h3 className="font-rock text-xl text-white mb-4 mt-8">PASSIONATE ABOUT:</h3>
              <ul className="space-y-3">
                {ABOUT_TEXT.passions.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 font-mono text-sm md:text-base text-gray-300 group">
                    <span className="text-graffiti-pink group-hover:text-graffiti-cyan transition-colors">⚡</span>
                    <span className="group-hover:text-white transition-colors">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;