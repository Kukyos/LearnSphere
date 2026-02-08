import React, { useState, useEffect } from 'react';
import { Users, Award, BookOpen, Smile, Star } from 'lucide-react';
import { isBackendAvailable, apiGetReporting } from '../services/api';
import { useApp } from '../src/contexts/AppContext';

const StatsSection: React.FC = () => {
  const { courses, reviews } = useApp();
  const [stats, setStats] = useState({
    learners: 0,
    courseCount: 0,
    completionRate: 0,
    avgRating: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const online = await isBackendAvailable();
      if (online) {
        const res = await apiGetReporting();
        if (res.success && res.data) {
          const total = res.data.totalParticipants || 0;
          const completed = res.data.completed || 0;
          setStats({
            learners: total,
            courseCount: res.data.publishedCourses || 0,
            completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
            avgRating: res.data.averageRating || 0,
          });
          return;
        }
      }
      // Fallback: derive from local state
      setStats({
        learners: 0,
        courseCount: courses.filter(c => c.published).length,
        completionRate: 0,
        avgRating: courses.length > 0
          ? Math.round((courses.reduce((s, c) => s + c.rating, 0) / courses.length) * 10) / 10
          : 0,
      });
    };
    fetchStats();
  }, [courses]);

  return (
    <section className="bg-white py-24 border-t border-brand-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4 pb-20">
          <div className="flex flex-col items-center text-center group">
            <div className="mb-4 text-brand-400 transform transition-transform group-hover:scale-110">
              <Users size={32} />
            </div>
            <h3 className="text-4xl font-extrabold text-brand-900 mb-1">{stats.learners > 0 ? stats.learners.toLocaleString() : '�'}</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-500">Active Learners</p>
          </div>
          <div className="flex flex-col items-center text-center group">
             <div className="mb-4 text-brand-400 transform transition-transform group-hover:scale-110">
              <BookOpen size={32} />
            </div>
            <h3 className="text-4xl font-extrabold text-brand-900 mb-1">{stats.courseCount > 0 ? stats.courseCount.toLocaleString() : '�'}</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-500">Courses</p>
          </div>
          <div className="flex flex-col items-center text-center group">
             <div className="mb-4 text-brand-400 transform transition-transform group-hover:scale-110">
              <Award size={32} />
            </div>
            <h3 className="text-4xl font-extrabold text-brand-900 mb-1">{stats.completionRate > 0 ? `${stats.completionRate}%` : '�'}</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-500">Completion Rate</p>
          </div>
          <div className="flex flex-col items-center text-center group">
             <div className="mb-4 text-brand-400 transform transition-transform group-hover:scale-110">
              <Smile size={32} />
            </div>
            <h3 className="text-4xl font-extrabold text-brand-900 mb-1">{stats.avgRating > 0 ? stats.avgRating.toFixed(1) : '�'}</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-500">Average Rating</p>
          </div>
        </div>

        {/* Reviews � only show if there are real reviews */}
        {reviews.length > 0 && (
          <div className="pt-10 border-t border-brand-200">
            <div className="grid gap-6 md:grid-cols-3">
              {reviews.slice(0, 3).map((review) => (
                <div key={review.id} className="relative rounded-xl bg-brand-50 p-8 transition-all hover:bg-white hover:shadow-xl hover:shadow-brand-900/5">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-brand-200 ring-2 ring-brand-200 flex items-center justify-center text-brand-700 font-bold text-sm">
                      {review.userName?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-900">{review.userName}</h4>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className={i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-brand-300'} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="italic text-brand-600 leading-relaxed text-sm">"{review.text}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default StatsSection;
