import React, { useState, useMemo } from 'react';
import { Search, Plus, LayoutGrid, LayoutList, MoreVertical } from 'lucide-react';
import CourseCard from '../components/courses/CourseCard';
import CourseTable from '../components/courses/CourseTable';
import CreateCourseModal from '../components/courses/CreateCourseModal';

// Types
interface Course {
  id: string;
  title: string;
  tags: string[];
  viewsCount: number;
  totalLessons: number;
  totalDuration: string;
  isPublished: boolean;
  coverImage?: string;
}

type ViewType = 'kanban' | 'list';

// Mock Data
const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: 'Introduction to React',
    tags: ['Frontend', 'JavaScript', 'Beginner'],
    viewsCount: 1240,
    totalLessons: 24,
    totalDuration: '6h 30m',
    isPublished: true,
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&h=250&fit=crop',
  },
  {
    id: '2',
    title: 'Advanced TypeScript Patterns',
    tags: ['Backend', 'TypeScript', 'Advanced'],
    viewsCount: 856,
    totalLessons: 18,
    totalDuration: '4h 15m',
    isPublished: true,
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop',
  },
  {
    id: '3',
    title: 'Web Design Fundamentals',
    tags: ['Design', 'CSS', 'UI/UX'],
    viewsCount: 2150,
    totalLessons: 32,
    totalDuration: '8h 45m',
    isPublished: true,
    coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop',
  },
  {
    id: '4',
    title: 'Full Stack Development with Node.js',
    tags: ['Backend', 'Node.js', 'Database'],
    viewsCount: 0,
    totalLessons: 28,
    totalDuration: '7h 20m',
    isPublished: false,
    coverImage: 'https://images.unsplash.com/photo-1516534775068-bb57ad1ea270?w=400&h=250&fit=crop',
  },
  {
    id: '5',
    title: 'React Hooks Deep Dive',
    tags: ['Frontend', 'React', 'Intermediate'],
    viewsCount: 1580,
    totalLessons: 20,
    totalDuration: '5h 10m',
    isPublished: true,
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&h=250&fit=crop',
  },
  {
    id: '6',
    title: 'Database Design with PostgreSQL',
    tags: ['Database', 'SQL', 'Backend'],
    viewsCount: 920,
    totalLessons: 22,
    totalDuration: '6h 00m',
    isPublished: false,
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f70504b8e?w=400&h=250&fit=crop',
  },
  {
    id: '7',
    title: 'Mobile App Development with React Native',
    tags: ['Mobile', 'React', 'Advanced'],
    viewsCount: 1340,
    totalLessons: 30,
    totalDuration: '8h 30m',
    isPublished: true,
    coverImage: 'https://images.unsplash.com/photo-1516534775068-bb57ad1ea270?w=400&h=250&fit=crop',
  },
  {
    id: '8',
    title: 'CSS Grid and Flexbox Mastery',
    tags: ['Frontend', 'CSS', 'Beginner'],
    viewsCount: 1760,
    totalLessons: 16,
    totalDuration: '3h 45m',
    isPublished: true,
    coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop',
  },
];

export default function CoursesDashboard() {
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [view, setView] = useState<ViewType>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter courses based on search query
  const filteredCourses = useMemo(() => {
    return courses.filter((course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [courses, searchQuery]);

  // Handle create course
  const handleCreateCourse = (courseName: string) => {
    const newCourse: Course = {
      id: String(courses.length + 1),
      title: courseName,
      tags: ['New'],
      viewsCount: 0,
      totalLessons: 0,
      totalDuration: '0h 0m',
      isPublished: false,
      coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&h=250&fit=crop',
    };
    setCourses([...courses, newCourse]);
    setIsModalOpen(false);
  };

  // Handle edit course
  const handleEditCourse = (courseId: string) => {
    console.log('Edit course:', courseId);
    // Implement edit functionality
  };

  // Handle share course
  const handleShareCourse = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    if (course) {
      const courseLink = `${window.location.origin}?course=${courseId}`;
      navigator.clipboard.writeText(courseLink);
      alert(`Course link copied: ${courseLink}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold text-gray-900">Courses Dashboard</h1>
            
            {/* Topbar Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                />
              </div>

              {/* View Toggle and Create Button */}
              <div className="flex gap-3 items-center">
                {/* View Toggle */}
                <div className="inline-flex rounded-lg border border-gray-300 bg-white">
                  <button
                    onClick={() => setView('kanban')}
                    className={`px-4 py-2 flex items-center gap-2 transition ${
                      view === 'kanban'
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <LayoutGrid className="h-5 w-5" />
                    <span className="hidden sm:inline">Kanban</span>
                  </button>
                  <button
                    onClick={() => setView('list')}
                    className={`px-4 py-2 flex items-center gap-2 transition border-l border-gray-300 ${
                      view === 'list'
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <LayoutList className="h-5 w-5" />
                    <span className="hidden sm:inline">List</span>
                  </button>
                </div>

                {/* Create Course Button */}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                  <Plus className="h-5 w-5" />
                  <span className="hidden sm:inline">Create Course</span>
                  <span className="sm:hidden">Create</span>
                </button>
              </div>
            </div>

            {/* Results Count */}
            <p className="text-sm text-gray-600">
              Showing {filteredCourses.length} of {courses.length} courses
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No courses found matching your search.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Clear search
            </button>
          </div>
        ) : view === 'kanban' ? (
          // Kanban View
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
          // List View
          <CourseTable
            courses={filteredCourses}
            onEdit={handleEditCourse}
            onShare={handleShareCourse}
          />
        )}
      </main>

      {/* Create Course Modal */}
      <CreateCourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateCourse}
      />
    </div>
  );
}