import React from 'react';
import { SOCIALS } from '../constants';
import { Github, Linkedin, Instagram, ArrowUp, Mail, Briefcase, Code, Music } from 'lucide-react';
import SprayHeading from './SprayHeading';
import GraffitiDecor from './GraffitiDecor';

const Footer: React.FC = () => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Github': return <Github size={28} />;
      case 'Linkedin': return <Linkedin size={28} />;
      case 'Instagram': return <Instagram size={28} />;
      default: return null;
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const myEmail = "dennymathew2930@gmail.com";

  const mailOptions = [
    {
        label: "I WANT TO HIRE YOU",
        icon: <Briefcase size={18} />,
        color: "graffiti-lime",
        subject: "Job Opportunity for Denny Mathew",
        body: "Hi Denny,\n\nI came across your portfolio and I'd like to discuss a potential role at [Company Name].\n\nBest,\n[Your Name]"
    },
    {
        label: "BUILD A WEBSITE",
        icon: <Code size={18} />,
        color: "graffiti-cyan",
        subject: "Web Development Inquiry",
        body: "Hi Denny,\n\nI need a website built for [Brand/Project]. Here are some initial details...\n\nLooking forward to hearing from you."
    },
    {
        label: "MUSIC & SFX DESIGN",
        icon: <Music size={18} />,
        color: "graffiti-pink",
        subject: "Audio Production Inquiry",
        body: "Hi Denny,\n\nI need sound design/music production for my project. Let's make some noise.\n\nCheers,"
    },
    {
        label: "LET'S COLLABORATE",
        icon: <Mail size={18} />,
        color: "graffiti-yellow",
        subject: "Collaboration Request",
        body: "Yo Denny,\n\nI saw your work on AURA/Xnetic and wanted to connect about a project idea.\n\nTalk soon,"
    }
  ];

  return (
    <footer id="contact" className="py-24 px-4 bg-black border-t-8 border-graffiti-pink relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')]"></div>
      <GraffitiDecor variant="splash" color="text-graffiti-purple" className="w-[800px] h-[800px] -top-1/2 left-1/2 -translate-x-1/2 opacity-10 animate-pulse" style={{ animationDuration: '10s' }} />
      <GraffitiDecor variant="x" color="text-graffiti-lime" className="w-32 h-32 bottom-10 left-10 opacity-10 rotate-12" />
      <GraffitiDecor variant="scribble" color="text-graffiti-cyan" className="w-48 h-48 top-10 right-10 opacity-10 -rotate-12" />

      <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center">
        
        <div className="mb-12 relative inline-block transform hover:scale-105 transition-transform duration-300">
             <SprayHeading text="HIT ME UP" color="white" align="center" />
             <GraffitiDecor variant="crown" color="text-graffiti-yellow" className="w-20 h-16 -top-10 -right-10 rotate-12 animate-wiggle" />
        </div>

        {/* Quick Email Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl w-full mb-16">
            {mailOptions.map((opt, idx) => (
                <a 
                    key={idx}
                    href={`mailto:${myEmail}?subject=${encodeURIComponent(opt.subject)}&body=${encodeURIComponent(opt.body)}`}
                    className={`
                        group relative bg-wall-darker border border-gray-700 hover:border-${opt.color} 
                        p-4 flex items-center justify-between transition-all duration-300 hover:bg-white/5
                        hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]
                    `}
                >
                    <div className="flex items-center gap-3">
                        <div className={`text-${opt.color} group-hover:scale-110 transition-transform`}>
                            {opt.icon}
                        </div>
                        <span className={`font-mono text-sm md:text-base font-bold text-gray-300 group-hover:text-${opt.color}`}>
                            {opt.label}
                        </span>
                    </div>
                    <span className="text-gray-600 group-hover:text-white transition-colors">
                        →
                    </span>
                </a>
            ))}
        </div>
        
        <p className="font-mono text-gray-500 mb-10 text-sm">
            Direct Email: <span className="text-white border-b border-graffiti-pink">{myEmail}</span>
        </p>

        <div className="flex justify-center gap-10 mb-20">
          {SOCIALS.map((social) => (
            <a 
              key={social.platform}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
            >
              <div className="absolute inset-0 bg-graffiti-cyan blur-xl opacity-0 group-hover:opacity-70 transition duration-500"></div>
              <div className="relative bg-wall-dark p-6 rounded-full border-2 border-white group-hover:border-graffiti-cyan group-hover:text-graffiti-cyan text-white transition duration-300 transform group-hover:scale-110 group-hover:-rotate-12 shadow-[4px_4px_0px_#333] group-hover:shadow-[6px_6px_0px_#00ffff]">
                {getIcon(social.icon)}
              </div>
            </a>
          ))}
        </div>

        {/* Back to Top Feature */}
        <button 
            onClick={scrollToTop}
            className="group relative flex flex-col items-center gap-2 text-gray-500 hover:text-graffiti-yellow transition-colors mb-12"
        >
            <div className="p-4 border-2 border-current rounded-full group-hover:-translate-y-2 transition-transform duration-300 bg-black">
                <ArrowUp size={24} />
            </div>
            <GraffitiDecor variant="arrow" color="text-graffiti-pink" className="w-16 h-12 absolute -right-12 top-0 rotate-[-45deg] opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="font-marker text-sm tracking-widest">TOP</span>
        </button>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-8"></div>

        <div className="font-mono text-gray-600 text-sm flex flex-col md:flex-row gap-4 items-center justify-center">
            <p>© {new Date().getFullYear()} Denny Mathew. All rights reserved.</p>
            <span className="hidden md:block text-graffiti-pink">•</span>
            <p className="flex items-center gap-1">
                Designed with <span className="text-graffiti-pink animate-pulse">♥</span> & Chaos
            </p>
        </div>
      </div>
      
      {/* Giant Background Watermark */}
      <div className="absolute bottom-[-5%] left-0 w-full overflow-hidden leading-none pointer-events-none select-none opacity-[0.03]">
           <h1 className="font-rock text-[25vw] text-white text-center whitespace-nowrap tracking-tighter">PEACE OUT</h1>
      </div>
    </footer>
  );
};

export default Footer;