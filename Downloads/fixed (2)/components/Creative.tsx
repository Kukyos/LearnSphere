import React, { useEffect, useRef, useState } from 'react';
import { CREATIVE } from '../constants';
import SprayHeading from './SprayHeading';
import { Music, Mic2, Sliders, Mic, MicOff, Activity } from 'lucide-react';
import GraffitiDecor from './GraffitiDecor';

const AudioVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isListening, setIsListening] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number>();
  const [error, setError] = useState('');

  const toggleMic = async () => {
    if (isListening) {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      setIsListening(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);
      
      source.connect(analyser);
      analyser.fftSize = 64; // Low bin count for chunky bars
      analyser.smoothingTimeConstant = 0.8;
      
      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;
      setIsListening(true);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Mic blocked');
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas resolution
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const draw = () => {
      const width = rect.width;
      const height = rect.height;
      ctx.clearRect(0, 0, width, height);

      let dataArray: Uint8Array;
      let bufferLength: number;

      if (isListening && analyserRef.current) {
        bufferLength = analyserRef.current.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);
      } else {
        // Simulation Mode (Organic wave when idle)
        bufferLength = 16;
        dataArray = new Uint8Array(bufferLength);
        const time = Date.now() / 200;
        for (let i = 0; i < bufferLength; i++) {
           // Simulating a "breathing" waveform
           const noise = Math.sin(i * 0.8 + time) * 0.5 + 0.5; // 0 to 1
           const beat = Math.pow(Math.sin(time * 2), 40) * 0.5; // Occasional beat spike
           const value = (noise + beat) * 150 + 50; 
           dataArray[i] = Math.min(255, value);
        }
      }

      // Draw bars
      const barWidth = (width / bufferLength);
      
      for (let i = 0; i < bufferLength; i++) {
        const percent = dataArray[i] / 255;
        const barHeight = percent * height * 0.8; // Max 80% height

        // Dynamic Color based on height/intensity
        let color = '#00ffff'; // Low: Cyan
        if (percent > 0.4) color = '#39ff14'; // Mid: Lime
        if (percent > 0.7) color = '#ff00ff'; // High: Pink

        // Draw Bar
        ctx.fillStyle = color;
        // Rounded top using path
        ctx.beginPath();
        const x = i * barWidth + 2;
        const y = height - barHeight;
        const w = barWidth - 4;
        
        ctx.roundRect(x, y, w, barHeight + 10, 4); // +10 to ensure it covers bottom
        ctx.fill();

        // Add glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset for next elements
      }
      
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isListening]);

  return (
    <div className="absolute inset-0 z-0 flex flex-col justify-end">
       <canvas ref={canvasRef} className="w-full h-full absolute inset-0 opacity-60 mix-blend-screen" />
       
       {/* Controls Overlay */}
       <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
          <button 
            onClick={toggleMic}
            className={`
                group flex items-center gap-2 px-3 py-1.5 rounded-full font-mono text-xs border-2 transition-all
                ${isListening 
                    ? 'bg-graffiti-pink text-white border-white animate-pulse shadow-[0_0_15px_#ff00ff]' 
                    : 'bg-black/50 text-graffiti-cyan border-graffiti-cyan hover:bg-graffiti-cyan hover:text-black'}
            `}
          >
             {isListening ? <Mic size={14} /> : <MicOff size={14} />}
             {isListening ? 'LIVE INPUT' : 'ENABLE MIC'}
          </button>
          {error && <span className="text-red-500 font-marker text-xs bg-black px-2">{error}</span>}
       </div>

       {/* Status Text */}
       <div className="absolute bottom-2 right-4 font-mono text-[10px] text-gray-500">
           {isListening ? 'ANALYZING FREQUENCIES...' : 'SIMULATION MODE'}
       </div>
    </div>
  );
};

const Creative: React.FC = () => {
  return (
    <section id="creative" className="py-24 px-4 bg-wall-darker relative overflow-hidden">
      {/* Background Graffiti */}
      <GraffitiDecor variant="waveform" color="text-graffiti-lime" className="w-[120%] h-32 top-10 -left-10 opacity-10" />
      <GraffitiDecor variant="splash" color="text-graffiti-pink" className="w-96 h-96 -bottom-20 -right-20 opacity-10 rotate-180" />

      <div className="max-w-6xl mx-auto relative z-10">
        <SprayHeading text="AUDIO LAB" color="graffiti-lime" align="center" className="mb-20" />

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Side: Hanging Board Visual */}
          <div className="relative h-[500px] w-full flex justify-center md:justify-start md:pl-20 pt-10">
            
            {/* The Pivot Point (Ceiling/Wall fixture) */}
            <div className="absolute top-0 left-1/2 md:left-28 -translate-x-1/2 w-20 h-4 bg-gray-800 z-0 shadow-lg rounded-sm border-b-2 border-gray-600">
                <div className="absolute top-1 left-2 w-2 h-2 rounded-full bg-black/60 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]"></div>
                <div className="absolute top-1 right-2 w-2 h-2 rounded-full bg-black/60 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]"></div>
            </div>

            {/* The Chain/Wire */}
            <div className="absolute top-4 left-1/2 md:left-28 -translate-x-1/2 w-1.5 h-24 bg-gradient-to-b from-gray-700 via-gray-500 to-gray-800 z-0 origin-top animate-swing shadow-xl">
                 {/* Chain links pattern */}
                 <div className="w-full h-full opacity-50 bg-[repeating-linear-gradient(transparent,transparent_4px,black_5px)]"></div>
            </div>

            {/* The Swinging Wrapper - pivots from the end of the chain */}
            <div className="relative mt-20 ml-2 md:ml-0 z-10 animate-swing origin-top" style={{ animationDuration: '4s' }}>
                
                {/* The Board Itself - Rotated to look like it's falling */}
                <div className="relative bg-[#1a1a1a] border-8 border-gray-800 w-[340px] h-[280px] shadow-[20px_40px_60px_rgba(0,0,0,0.9)] flex flex-col p-0 overflow-hidden transform rotate-12 origin-top-left group">
                    
                    {/* Texture overlay */}
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] pointer-events-none z-10"></div>
                    
                    {/* The Screw holding it (Top Left Corner) */}
                    <div className="absolute top-3 left-3 w-8 h-8 bg-gray-400 rounded-full border-2 border-gray-600 shadow-[inset_0_2px_5px_rgba(255,255,255,0.3),0_4px_6px_rgba(0,0,0,0.5)] flex items-center justify-center z-30 animate-wiggle">
                        <div className="w-full h-1 bg-gray-800 rotate-45 absolute shadow-[0_1px_0_rgba(255,255,255,0.2)]"></div>
                        <div className="w-full h-1 bg-gray-800 -rotate-45 absolute shadow-[0_1px_0_rgba(255,255,255,0.2)]"></div>
                    </div>

                    {/* Content on Board */}
                    <div className="relative z-20 w-full p-6 pb-0 flex flex-col items-start">
                        <div className="flex items-center gap-2 mb-2">
                             <Activity className="text-graffiti-pink animate-pulse" size={24} />
                             <span className="font-mono text-xs text-gray-400 tracking-widest">REALTIME_MONITOR</span>
                        </div>
                        
                        <div className="flex flex-col gap-0 w-full">
                             <h3 className="font-rock text-5xl text-white leading-none neon-on tracking-tighter mix-blend-overlay">
                                SOUND
                             </h3>
                             <h3 className="font-rock text-5xl text-graffiti-cyan leading-none self-end mr-4 neon-flicker tracking-tighter">
                                WAVES
                             </h3>
                        </div>
                    </div>

                    {/* DYNAMIC VISUALIZER COMPONENT */}
                    <AudioVisualizer />

                    {/* Scratches/Grime */}
                    <div className="absolute inset-0 border-4 border-white/5 pointer-events-none z-30"></div>
                </div>
            </div>
          </div>

          {/* Right Side: Content */}
          <div className="space-y-8 mt-10 lg:mt-0">
            <div className="bg-black/40 p-6 border-l-4 border-graffiti-pink backdrop-blur-sm shadow-lg">
                <p className="font-mono text-lg md:text-xl text-gray-200 leading-relaxed">
                <span className="text-graffiti-pink font-bold text-2xl mr-2">///</span> 
                In addition to tech, I engineer SFX and produce music, blending raw sound with immersive digital experiences. The visualizer on the left reacts to your mic input!
                </p>
            </div>

            <div className="grid gap-6">
              {CREATIVE.map((work, index) => (
                <div 
                    key={index} 
                    className="relative bg-wall-dark p-6 group hover:-translate-y-1 transition-transform duration-300 border border-white/10 hover:border-graffiti-lime/50"
                >
                  {/* Hover Glow */}
                  <div className="absolute inset-0 bg-graffiti-lime/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Decorative number */}
                  <div className="absolute top-4 right-4 font-marker text-5xl text-white/5 group-hover:text-white/10 transition-colors select-none">
                      0{index + 1}
                  </div>

                  <div className="flex items-start gap-5 relative z-10">
                    <div className="bg-black p-4 border-2 border-graffiti-lime shadow-[4px_4px_0px_#39ff14] group-hover:shadow-[2px_2px_0px_#39ff14] group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all">
                      {index === 0 ? <Mic2 className="text-white" size={28} /> : <Sliders className="text-white" size={28} />}
                    </div>
                    
                    <div className="flex-1 pr-12">
                      <h4 className="font-rock text-2xl text-white mb-2 group-hover:text-graffiti-lime transition-colors">
                          {work.title}
                      </h4>
                      <p className="text-gray-400 font-mono text-sm mb-4 leading-relaxed">
                          {work.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {work.tags.map(tag => (
                          <span key={tag} className="text-xs bg-graffiti-cyan/10 text-graffiti-cyan px-2 py-1 rounded-sm font-mono uppercase border border-graffiti-cyan/20">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Extra Graffiti Decor below list */}
            <div className="relative h-16 w-full mt-8 flex justify-end">
                <GraffitiDecor variant="music" color="text-graffiti-yellow" className="w-16 h-16 animate-bounce opacity-80" style={{ animationDuration: '2.5s' }} />
                <GraffitiDecor variant="underline" color="text-graffiti-pink" className="w-40 h-8 mt-12 -ml-8 rotate-3" />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Creative;