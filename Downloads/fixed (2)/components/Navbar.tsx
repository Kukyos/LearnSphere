import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'ABOUT', href: '#about' },
    { name: 'PROJECTS', href: '#projects' },
    { name: 'CREATIVE', href: '#creative' },
    { name: 'CONTACT', href: '#contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 pointer-events-none">
      {/* Desktop Tape */}
      <div className="hidden md:flex justify-between items-center w-full px-8 py-4 pointer-events-auto">
        <div className="transform -rotate-2 bg-black text-white px-4 py-2 font-marker text-xl border-2 border-graffiti-cyan shadow-[4px_4px_0px_#00ffff]">
          DENNY.DEV
        </div>
        <div className="flex gap-6 bg-graffiti-yellow text-black px-6 py-2 transform rotate-1 font-mono font-bold border-2 border-black shadow-[4px_4px_0px_#000]">
          {navItems.map((item) => (
            <a 
              key={item.name} 
              href={item.href} 
              className="hover:underline decoration-wavy decoration-black"
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center p-4 pointer-events-auto bg-black/80 backdrop-blur-sm border-b-2 border-graffiti-pink">
         <div className="font-marker text-graffiti-cyan text-xl">DENNY.DEV</div>
         <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            {isOpen ? <X size={32} /> : <Menu size={32} />}
         </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-wall-dark z-40 flex flex-col items-center justify-center gap-8 pointer-events-auto">
           {navItems.map((item) => (
            <a 
              key={item.name} 
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="font-rock text-3xl text-graffiti-lime hover:text-white"
            >
              {item.name}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;