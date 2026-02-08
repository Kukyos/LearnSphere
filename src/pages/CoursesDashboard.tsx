import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, LayoutGrid, LayoutList, BarChart3, Trash2 } from 'lucide-react';
import { useApp, Course } from '../contexts/AppContext';
import CourseCard from '../components/courses/CourseCard';
import CourseTable from '../components/courses/CourseTable';
import CreateCourseModal from '../components/courses/CreateCourseModal';

type ViewType = 'kanban' | 'list';

export default function CoursesDashboard() {
  const { courses, createCourse, deleteCourse } = useApp();
  const [view, setView] = useState<ViewType>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dashCourses = useMemo(() =>
    courses.map(c => ({
      id: c.id,
      title: c.title,
      tags: c.tags,
      viewsCount: c.viewsCount ?? 0,
      totalLessons: c.lessons.length,
      totalDuration: c.totalDuration ?? '0h 0m',
      isPublished: c.published,
      coverImage: c.coverImage,
    })), [courses]);

  const filteredCourses = useMemo(() => {
    return dashCourses.filter((course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [dashCourses, searchQuery]);

  const handleCreateCourse = (courseName: string) => {
    const newCourse = createCourse(courseName);
    setIsModalOpen(false);
    nav(`/course-form/${newCourse.id}`);
  };

  const nav = useNavigate();

  const handleEditCourse = (courseId: string) => {
    nav(`/course-form/${courseId}`);
  };

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleShareCourse = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    if (course) {
      const courseLink = `${window.location.origin}/#/course/${courseId}`;
      navigator.clipboard.writeText(courseLink);
      setCopiedId(courseId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleDeleteCourse = (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      deleteCourse(courseId);
    }
  };

  return (
    <div className="min-h-screen bg-nature-light/60 pt-24 transition-colors">
      {/* Header */}
      <header className="bg-white/60 backdrop-blur-md border-b border-brand-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-brand-900">Courses Dashboard</h1>
              <button
                onClick={() => nav('/reporting')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-brand-200 text-brand-600 hover:bg-brand-50 transition font-medium text-sm"
              >
                <BarChart3 className="h-4 w-4" />
                Reporting
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-5 w-5 text-brand-400" />
                <input
                  type="text"
                  placeholder="Search courses by name or tag..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-brand-200 bg-white text-brand-900 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition placeholder:text-brand-400"
                />
              </div>

              <div className="flex gap-3 items-center">
                <div className="inline-flex rounded-lg border border-brand-200 overflow-hidden">
                  <button
                    onClick={() => setView('kanban')}
                    className={`px-4 py-2 flex items-center gap-2 transition text-sm ${
                      view === 'kanban'
                        ? 'bg-brand-700 text-white'
                        : 'bg-white text-brand-600 hover:bg-brand-50'
                    }`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                    <span className="hidden sm:inline">Kanban</span>
                  </button>
                  <button
                    onClick={() => setView('list')}
                    className={`px-4 py-2 flex items-center gap-2 transition border-l border-brand-200 text-sm ${
                      view === 'list'
                        ? 'bg-brand-700 text-white'
                        : 'bg-white text-brand-600 hover:bg-brand-50'
                    }`}
                  >
                    <LayoutList className="h-4 w-4" />
                    <span className="hidden sm:inline">List</span>
                  </button>
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-700 text-white rounded-lg hover:bg-brand-800 transition font-medium text-sm shadow-md"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Create Course</span>
                  <span className="sm:hidden">Create</span>
                </button>
              </div>
            </div>

            <p className="text-sm text-brand-500">
              Showing {filteredCourses.length} of {dashCourses.length} courses
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-brand-500 text-lg">No courses found matching your search.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 text-brand-600 hover:text-brand-800 font-medium"
            >
              Clear search
            </button>
          </div>
        ) : view === 'kanban' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onEdit={handleEditCourse}
                onShare={handleShareCourse}
              />
            ))}
          </div>
        ) : (
          <CourseTable
            courses={filteredCourses}
            onEdit={handleEditCourse}
            onShare={handleShareCourse}
          />
        )}
      </main>

      <CreateCourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateCourse}
      />

      {/* Copied toast */}
      {copiedId && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-brand-700 text-white rounded-lg shadow-lg text-sm font-medium animate-fade-in">
          Course link copied to clipboard!
        </div>
      )}
    </div>
  );
}
