import React, { useState } from 'react';
import { MoreVertical, Eye, BookOpen, Clock, Share2, Edit } from 'lucide-react';
import TiltCard from '../../../components/TiltCard';

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

interface CourseCardProps {
  key?: React.Key;
  course: Course;
  onEdit: (courseId: string) => void;
  onShare: (courseId: string) => void;
}

export default function CourseCard({ course, onEdit, onShare }: CourseCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <TiltCard
      className={`bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition border border-brand-200 group ${
        !course.isPublished ? 'opacity-85 hover:opacity-100' : ''
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
              
              {showTooltip && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-brand-900 text-white text-xs rounded px-3 py-2 whitespace-nowrap z-20">
                  Not visible to learners
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-brand-900"></div>
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
                ? 'bg-green-50 text-green-600'
                : 'bg-yellow-50 text-yellow-600'
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
              className="p-2 bg-surface rounded-full shadow-md hover:bg-surface-light transition"
            >
              <MoreVertical className="h-5 w-5 text-brand-600" />
            </button>

            {showMenu && (
              <div className="absolute left-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-brand-200 z-10">
                <button
                  onClick={() => {
                    onEdit(course.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-brand-700 hover:bg-brand-50 flex items-center gap-2 border-b border-brand-200"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    onShare(course.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-brand-700 hover:bg-brand-50 flex items-center gap-2"
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
      <div className={`p-4 ${!course.isPublished ? 'bg-brand-50' : ''}`}>
        <h3 className={`font-semibold mb-2 line-clamp-2 text-base ${
          !course.isPublished ? 'text-brand-500' : 'text-brand-900'
        }`}>
          {course.title}
        </h3>

        <div className="flex flex-wrap gap-1 mb-4">
          {course.tags.map((tag) => (
            <span
              key={tag}
              className={`inline-block px-2 py-1 text-xs rounded font-medium ${
                !course.isPublished
                  ? 'bg-brand-100 text-brand-500'
                  : 'bg-brand-50 text-brand-600'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className={`space-y-2 text-sm ${
          !course.isPublished ? 'text-brand-500' : 'text-brand-600'
        }`}>
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-brand-500" />
            <span>
              {course.viewsCount === 0 
                ? 'No views yet' 
                : `${course.viewsCount.toLocaleString()} views`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-brand-500" />
            <span>{course.totalLessons} lessons</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-brand-500" />
            <span>{course.totalDuration}</span>
          </div>
        </div>

        {!course.isPublished && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-xs text-yellow-700 font-medium">
              ⚠️ This course is not visible to learners. Publish to make it live.
            </p>
          </div>
        )}
      </div>
    </TiltCard>
  );
}
