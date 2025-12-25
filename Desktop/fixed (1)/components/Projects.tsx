import React from 'react';
import { PROJECTS } from '../constants';
import SprayHeading from './SprayHeading';
import { ExternalLink, Bot, Code, Zap } from 'lucide-react';
import GraffitiDecor from './GraffitiDecor';

const Projects: React.FC = () => {
  return (
    <section id="projects" className="py-20 px-4 bg-black/30 relative">
      <GraffitiDecor variant="scribble" color="text-graffiti-pink" className="w-64 h-40 top-10 right-0 opacity-20 rotate-45" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <SprayHeading text="FEATURED WORK" color="graffiti-cyan" align="center" className="mb-16" />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROJECTS.map((project, index) => (
            <div 
              key={project.id}
              className={`group relative bg-wall-dark border-2 border-white/20 hover:border-${project.color} transition-all duration-300 transform hover:-translate-y-2`}
            >
              {/* Tape Effect */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-300/80 transform rotate-1 z-20 shadow-md"></div>

              <div className={`h-2 w-full bg-${project.color}`}></div>
              
              <div className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-full border border-${project.color} text-${project.color}`}>
                    {project.type === 'AI' ? <Bot size={24} /> : <Code size={24} />}
                  </div>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                      <ExternalLink size={20} />
                    </a>
                  )}
                </div>

                <h3 className="font-rock text-2xl text-white mb-2">{project.title}</h3>
                <p className="font-mono text-gray-400 text-sm mb-6 flex-grow">
                  {project.description}
                </p>

                <div className="space-y-2 mb-6">
                  {project.features.slice(0, 3).map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs font-mono text-gray-300">
                      <Zap size={12} className={`text-${project.color} mt-1 flex-shrink-0`} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center relative">
                   <span className={`text-xs font-bold font-mono text-${project.color} px-2 py-1 border border-${project.color} rounded`}>
                     {project.type}
                   </span>
                   {index === 0 && <GraffitiDecor variant="underline" color="text-graffiti-yellow" className="w-24 h-4 absolute bottom-0 right-0" />}
                   <span className="text-xs text-gray-500 font-mono">2024-25</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;