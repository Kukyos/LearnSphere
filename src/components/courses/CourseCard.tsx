import React, { useState } from 'react';
import { MoreVertical, Eye, BookOpen, Clock, Share2, Edit, User } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface Course {
  id: string;
  title: string;
  tags: string[];
  viewsCount: number;
  totalLessons: number;
  totalDuration: string;
  isPublished: boolean;
  coverImage?: string;
  instructorName?: string;
}

interface CourseCardProps {
  course: Course;
  onEdit: (courseId: string) => void;
  onShare: (courseId: string) => void;
}

export default function CourseCard({ course, onEdit, onShare }: CourseCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const { theme } = useApp();
  const isDark = theme === 'dark';

  return (
    <div 
      className={`rounded-2xl overflow-hidden shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 border group ${
        isDark
          ? `bg-brand-900 border-brand-700 ${!course.isPublished ? 'opacity-85 hover:opacity-100' : ''}`
          : `bg-white border-brand-200 ${!course.isPublished ? 'opacity-85 hover:opacity-100' : ''}`
      }`}
    >
      {/* Cover Image */}
      <div 
        className={`relative h-40 bg-gradient-to-br from-brand-400 to-brand-600 overflow-hidden ${
          !course.isPublished ? 'grayscale hover:grayscale-0 transition-all duration-300' : ''
        }`}
      >
        {course.coverImage ? (
          <img
            src={course.coverImage}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-white opacity-50" />
          </div>
        )}

        {/* "Not Visible to Learners" Overlay (Draft Courses) */}
        {!course.isPublished && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/40 to-transparent">
            <div className="relative">
              <span 
                className="text-white text-sm font-semibold bg-black/70 px-4 py-2 rounded-lg backdrop-blur-sm cursor-help"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                🔒 Draft
              </span>
              
              {/* Tooltip */}
              {showTooltip && (
                <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 text-white text-xs rounded px-3 py-2 whitespace-nowrap z-20 ${
                  isDark ? 'bg-brand-700' : 'bg-brand-900'
                }`}>
                  Not visible to learners
                  <div className={`absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent ${
                    isDark ? 'border-t-brand-700' : 'border-t-brand-900'
                  }`}></div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
              course.isPublished
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {course.isPublished ? '✓ Published' : 'Draft'}
          </span>
        </div>

        {/* Menu Button */}
        <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition">
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={`p-2 rounded-full shadow-md transition ${
                isDark ? 'bg-brand-800 hover:bg-brand-700 text-brand-200' : 'bg-white hover:bg-brand-50 text-brand-700'
              }`}
            >
              <MoreVertical className="h-5 w-5" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className={`absolute left-0 mt-1 w-40 rounded-xl shadow-lg border z-10 ${
                isDark ? 'bg-brand-800 border-brand-600' : 'bg-white border-brand-200'
              }`}>
                <button
                  onClick={() => {
                    onEdit(course.id);
                    setShowMenu(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 border-b rounded-t-xl ${
                    isDark
                      ? 'text-brand-200 hover:bg-brand-700 border-brand-600'
                      : 'text-brand-700 hover:bg-brand-50 border-brand-100'
                  }`}
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    onShare(course.id);
                    setShowMenu(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 rounded-b-xl ${
                    isDark ? 'text-brand-200 hover:bg-brand-700' : 'text-brand-700 hover:bg-brand-50'
                  }`}
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className={`p-4 ${!course.isPublished ? (isDark ? 'bg-brand-900/50' : 'bg-brand-50/50') : ''}`}>
        {/* Title */}
        <h3 className={`font-semibold mb-2 line-clamp-2 text-base ${
          isDark
            ? (course.isPublished ? 'text-white' : 'text-brand-300')
            : (course.isPublished ? 'text-brand-900' : 'text-brand-700')
        }`}>
          {course.title}
        </h3>

        {/* Instructor Name (for admin view) */}
        {course.instructorName && (
          <div className={`flex items-center gap-1.5 mb-2 text-xs ${isDark ? 'text-brand-400' : 'text-brand-500'}`}>
            <User className="h-3.5 w-3.5" />
            <span>{course.instructorName}</span>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {course.tags.map((tag) => (
            <span
              key={tag}
              className={`inline-block px-2 py-1 text-xs rounded-md font-medium ${
                !course.isPublished
                  ? isDark ? 'bg-brand-800 text-brand-400' : 'bg-brand-100 text-brand-500'
                  : isDark ? 'bg-brand-800 text-brand-200' : 'bg-brand-100 text-brand-700'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className={`space-y-2 text-sm ${
          isDark
            ? (course.isPublished ? 'text-brand-300' : 'text-brand-400')
            : (course.isPublished ? 'text-brand-600' : 'text-brand-500')
        }`}>
          <div className="flex items-center gap-2">
            <Eye className={`h-4 w-4 ${isDark ? 'text-brand-500' : 'text-brand-400'}`} />
            <span>
              {course.viewsCount === 0 
                ? 'No views yet' 
                : `${course.viewsCount.toLocaleString()} views`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className={`h-4 w-4 ${isDark ? 'text-brand-500' : 'text-brand-400'}`} />
            <span>{course.totalLessons} lessons</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className={`h-4 w-4 ${isDark ? 'text-brand-500' : 'text-brand-400'}`} />
            <span>{course.totalDuration}</span>
          </div>
        </div>

        {/* Draft State Message */}
        {!course.isPublished && (
          <div className={`mt-4 p-3 rounded-lg border ${
            isDark ? 'bg-yellow-900/20 border-yellow-700/30' : 'bg-yellow-50 border-yellow-200'
          }`}>
            <p className={`text-xs font-medium ${isDark ? 'text-yellow-300' : 'text-yellow-800'}`}>
              ⚠️ This course is not visible to learners. Publish to make it live.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}