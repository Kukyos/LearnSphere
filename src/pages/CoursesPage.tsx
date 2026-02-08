import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Search, Star, BookOpen } from 'lucide-react';
import TiltCard from '../../components/TiltCard';

const CoursesPage: React.FC = () => {
  const { courses } = useApp();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQ);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    courses.forEach(c => c.tags.forEach(t => tags.add(t)));
    return Array.from(tags);
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      if (!c.published) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = c.title.toLowerCase().includes(q);
        const matchesDesc = c.shortDescription.toLowerCase().includes(q);
        const matchesTags = c.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesTags) return false;
      }
      if (selectedTag && !c.tags.includes(selectedTag)) return false;
      return true;
    });
  }, [courses, searchQuery, selectedTag]);

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 sm:px-8 bg-nature-light/60">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-bold mb-2 text-brand-900">Explore Courses</h1>
        <p className="text-brand-500">Discover courses to advance your skills</p>
      </div>

      {/* Search & Filter */}
      <div className="max-w-6xl mx-auto mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search courses..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border bg-white border-brand-200 text-brand-900 placeholder-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
              !selectedTag
                ? 'bg-brand-600 text-white'
                : 'bg-brand-50 text-brand-600 hover:bg-brand-100'
            }`}
          >
            All
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                selectedTag === tag
                  ? 'bg-brand-600 text-white'
                  : 'bg-brand-50 text-brand-600 hover:bg-brand-100'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => (
          <TiltCard
            key={course.id}
            className="cursor-pointer rounded-2xl overflow-hidden shadow-lg bg-white border border-brand-100"
            onClick={() => navigate(`/course/${course.id}`)}
          >
            <div className="relative h-48 overflow-hidden">
              <img src={course.coverImage} alt={course.title} className="w-full h-full object-cover transition-transform hover:scale-105" />
              <div className="absolute top-3 right-3 flex gap-2">
                {course.access === 'Open' && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white">Free</span>
                )}
                {course.access === 'On Payment' && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-500 text-white">${course.price}</span>
                )}
                {course.access === 'On Invitation' && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-600 text-white">Invite Only</span>
                )}
              </div>
            </div>
            <div className="p-5">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {course.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded text-xs font-semibold bg-brand-50 text-brand-600">
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="text-lg font-bold mb-2 text-brand-900">{course.title}</h3>
              <p className="text-sm mb-4 line-clamp-2 text-brand-500">{course.shortDescription}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="text-yellow-500" size={16} fill="currentColor" />
                  <span className="text-sm font-semibold text-brand-700">{course.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <BookOpen size={14} className="text-brand-400" />
                  <span className="text-brand-500">{course.lessons.length} lessons</span>
                </div>
              </div>
            </div>
          </TiltCard>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="max-w-6xl mx-auto py-16 text-center">
          <BookOpen className="mx-auto mb-4 text-brand-600" size={64} />
          <p className="text-brand-400">No courses found. Try adjusting your search.</p>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
