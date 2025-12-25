import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Creative from './components/Creative';
import Footer from './components/Footer';
import GraffitiDecor from './components/GraffitiDecor';
import ChatBot from './components/ChatBot';
import ScrollProgress from './components/ScrollProgress';
import CustomCursor from './components/CustomCursor';
import GraffitiWall from './components/GraffitiWall';

function App() {
  return (
    <div className="min-h-screen bg-wall-darker text-white font-sans selection:bg-graffiti-pink selection:text-white overflow-x-hidden relative md:cursor-none">
      <ScrollProgress />
      <CustomCursor />
      <GraffitiWall />

      {/* Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/concrete-wall.png")' }}></div>
      
      {/* Global Graffiti Accents */}
      <GraffitiDecor variant="x" color="text-graffiti-cyan" className="fixed top-1/4 left-5 w-24 h-24 opacity-5 pointer-events-none -rotate-12 z-0" />
      <GraffitiDecor variant="scribble" color="text-graffiti-yellow" className="fixed bottom-1/4 right-5 w-40 h-32 opacity-5 pointer-events-none rotate-12 z-0" />

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Creative />
        <Footer />
        <ChatBot />
      </div>
    </div>
  );
}

export default App;