import React from 'react';
import { X, Star, BookOpen, Clock } from 'lucide-react';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: {
    title: string;
    description: string;
    coverImage: string;
    tags: string[];
    lessons: { id: string; title: string; type: string }[];
    access: string;
    price?: string;
  };
}

export default function PreviewModal({ isOpen, onClose, course }: PreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[85vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Course Preview</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500">
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[calc(85vh-70px)]">
          {/* Cover Image */}
          {course.coverImage && (
            <div className="relative h-48 overflow-hidden">
              <img src={course.coverImage} alt={course.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${course.access === 'Free' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                  {course.access === 'Free' ? 'Free' : `$${course.price || '0'}`}
                </span>
              </div>
            </div>
          )}

          <div className="p-5 space-y-4">
            {/* Title & Tags */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{course.title || 'Untitled Course'}</h2>
              <div className="flex flex-wrap gap-1.5">
                {course.tags.filter(Boolean).map(tag => (
                  <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            {course.description && (
              <div>
                <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Description</h4>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{course.description}</p>
              </div>
            )}

            {/* Stats */}
            <div className="flex gap-4 py-3 border-t border-b border-gray-200 dark:border-gray-700">
              <span className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                <BookOpen size={16} /> {course.lessons.length} lessons
              </span>
              <span className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                <Star size={16} className="text-yellow-500" /> New course
              </span>
            </div>

            {/* Lesson List */}
            {course.lessons.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Course Content</h4>
                <div className="space-y-2">
                  {course.lessons.map((lesson, i) => (
                    <div key={lesson.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <span className="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center text-xs font-bold text-brand-700 dark:text-brand-300">
                        {i + 1}
                      </span>
                      <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{lesson.title}</span>
                      <span className="text-xs text-gray-400 capitalize">{lesson.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
