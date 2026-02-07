import React from 'react';
import { Users, Award, BookOpen, Smile } from 'lucide-react';
import { REVIEWS_SNIPPETS } from '../constants';

const StatsSection: React.FC = () => {
  return (
    <section className="bg-nature-card py-24 dark:bg-brand-900 border-t border-brand-200 dark:border-brand-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4 pb-20">
          <div className="flex flex-col items-center text-center group">
            <div className="mb-4 text-brand-600 dark:text-brand-400 transform transition-transform group-hover:scale-110">
              <Users size={32} />
            </div>
            <h3 className="text-4xl font-extrabold text-brand-900 dark:text-white mb-1">250k+</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-500">Active Learners</p>
          </div>
          <div className="flex flex-col items-center text-center group">
             <div className="mb-4 text-brand-600 dark:text-brand-400 transform transition-transform group-hover:scale-110">
              <BookOpen size={32} />
            </div>
            <h3 className="text-4xl font-extrabold text-brand-900 dark:text-white mb-1">1.2k+</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-500">Premium Courses</p>
          </div>
          <div className="flex flex-col items-center text-center group">
             <div className="mb-4 text-brand-600 dark:text-brand-400 transform transition-transform group-hover:scale-110">
              <Award size={32} />
            </div>
            <h3 className="text-4xl font-extrabold text-brand-900 dark:text-white mb-1">94%</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-500">Completion Rate</p>
          </div>
          <div className="flex flex-col items-center text-center group">
             <div className="mb-4 text-brand-600 dark:text-brand-400 transform transition-transform group-hover:scale-110">
              <Smile size={32} />
            </div>
            <h3 className="text-4xl font-extrabold text-brand-900 dark:text-white mb-1">4.9</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-500">Average Rating</p>
          </div>
        </div>

        {/* Reviews */}
        <div className="pt-10 border-t border-brand-200 dark:border-brand-800">
          <div className="grid gap-6 md:grid-cols-3">
            {REVIEWS_SNIPPETS.map((review) => (
              <div key={review.id} className="relative rounded-xl bg-white p-8 transition-all hover:bg-white hover:shadow-xl hover:shadow-brand-900/5 dark:bg-brand-800 dark:hover:bg-brand-700">
                <div className="mb-6 flex items-center gap-4">
                  <img src={review.avatar} alt={review.user} className="h-10 w-10 rounded-full object-cover ring-2 ring-nature-light dark:ring-brand-600 grayscale hover:grayscale-0 transition-all" />
                  <div>
                    <h4 className="font-bold text-brand-900 dark:text-white">{review.user}</h4>
                    <p className="text-xs font-medium text-brand-500 dark:text-brand-400">{review.role}</p>
                  </div>
                </div>
                <p className="italic text-brand-600 dark:text-brand-300 leading-relaxed text-sm">"{review.text}"</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default StatsSection;