import React from 'react';
import { EXPERIENCE } from '../constants';
import SprayHeading from './SprayHeading';
import GraffitiDecor from './GraffitiDecor';
import { ExternalLink } from 'lucide-react';

const Experience: React.FC = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <GraffitiDecor variant="x" color="text-graffiti-lime" className="w-32 h-32 top-1/4 -left-10 opacity-10 rotate-12" />
      <div className="max-w-4xl mx-auto">
        <SprayHeading text="GRIND & HUSTLE" color="graffiti-pink" align="right" />

        <div className="relative space-y-12">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-white/20 transform md:-translate-x-1/2"></div>

          {EXPERIENCE.map((job, index) => (
            <div key={job.id} className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
              
              {/* Timeline Dot */}
              <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-white rounded-full transform -translate-x-1.5 md:-translate-x-1/2 mt-6 border-4 border-graffiti-pink z-10"></div>

              {/* Content Card */}
              <div className="ml-12 md:ml-0 md:w-1/2 relative">
                <div 
                  className={`bg-wall-darker border-2 border-${job.color} p-6 shadow-[8px_8px_0px_#333] transform transition hover:scale-105 duration-300 ${index % 2 === 0 ? 'md:mr-8 md:rotate-1' : 'md:ml-8 md:-rotate-1'}`}
                >
                  <h3 className="font-marker text-2xl text-white mb-1">{job.role}</h3>
                  <h4 className={`font-mono font-bold text-${job.color} mb-4`}>{job.company}</h4>
                  
                  <ul className="list-disc list-inside space-y-2 font-mono text-sm text-gray-400 marker:text-white">
                    {job.responsibilities.map((resp, i) => (
                      <li key={i}>{resp}</li>
                    ))}
                  </ul>

                  {job.link && (
                    <a 
                      href={job.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`mt-4 inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-${job.color} hover:text-white transition-colors border-b border-${job.color} pb-1`}
                    >
                      View Certificate <ExternalLink size={12} />
                    </a>
                  )}

                  <div className="absolute -top-3 -right-3 bg-white text-black font-bold px-3 py-1 font-mono text-xs transform rotate-3">
                    {job.duration}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;