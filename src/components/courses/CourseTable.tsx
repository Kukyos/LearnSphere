import React, { useState } from 'react';
import { Edit, Share2, User } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface Course {
  id: string;
  title: string;
  tags: string[];
  viewsCount: number;
  totalLessons: number;
  totalDuration: string;
  isPublished: boolean;
  instructorName?: string;
}

interface CourseTableProps {
  courses: Course[];
  onEdit: (courseId: string) => void;
  onShare: (courseId: string) => void;
}

export default function CourseTable({ courses, onEdit, onShare }: CourseTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const { theme } = useApp();
  const isDark = theme === 'dark';

  const hasInstructor = courses.some(c => c.instructorName);

  return (
    <div className={`rounded-2xl overflow-hidden shadow-lg border ${
      isDark ? 'border-brand-700 bg-brand-900' : 'border-brand-200 bg-white'
    }`}>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${isDark ? 'bg-brand-800 border-brand-700' : 'bg-brand-50 border-brand-200'}`}>
              <th className={`px-6 py-4 text-left text-sm font-semibold ${isDark ? 'text-white' : 'text-brand-900'}`}>Title</th>
              {hasInstructor && (
                <th className={`px-6 py-4 text-left text-sm font-semibold ${isDark ? 'text-white' : 'text-brand-900'}`}>Instructor</th>
              )}
              <th className={`px-6 py-4 text-left text-sm font-semibold ${isDark ? 'text-white' : 'text-brand-900'}`}>Tags</th>
              <th className={`px-6 py-4 text-left text-sm font-semibold ${isDark ? 'text-white' : 'text-brand-900'}`}>Views</th>
              <th className={`px-6 py-4 text-left text-sm font-semibold ${isDark ? 'text-white' : 'text-brand-900'}`}>Lessons</th>
              <th className={`px-6 py-4 text-left text-sm font-semibold ${isDark ? 'text-white' : 'text-brand-900'}`}>Duration</th>
              <th className={`px-6 py-4 text-left text-sm font-semibold ${isDark ? 'text-white' : 'text-brand-900'}`}>Status</th>
              <th className={`px-6 py-4 text-right text-sm font-semibold ${isDark ? 'text-white' : 'text-brand-900'}`}>Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-brand-700' : 'divide-brand-100'}`}>
            {courses.map((course) => (
              <tr key={course.id} className={`transition ${isDark ? 'hover:bg-brand-800/60' : 'hover:bg-brand-50'}`}>
                <td className="px-6 py-4">
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-brand-900'}`}>{course.title}</p>
                </td>
                {hasInstructor && (
                  <td className="px-6 py-4">
                    {course.instructorName && (
                      <div className={`flex items-center gap-1.5 text-sm ${isDark ? 'text-brand-300' : 'text-brand-600'}`}>
                        <User className="h-3.5 w-3.5" />
                        <span>{course.instructorName}</span>
                      </div>
                    )}
                  </td>
                )}
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {course.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`inline-block px-2 py-1 text-xs rounded-md font-medium ${
                          isDark ? 'bg-brand-800 text-brand-200' : 'bg-brand-100 text-brand-700'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className={`px-6 py-4 text-sm ${isDark ? 'text-brand-300' : 'text-brand-600'}`}>
                  {course.viewsCount.toLocaleString()}
                </td>
                <td className={`px-6 py-4 text-sm ${isDark ? 'text-brand-300' : 'text-brand-600'}`}>
                  {course.totalLessons}
                </td>
                <td className={`px-6 py-4 text-sm ${isDark ? 'text-brand-300' : 'text-brand-600'}`}>
                  {course.totalDuration}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      course.isPublished
                        ? 'bg-green-100 text-green-800'
                        : isDark ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {course.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(course.id)}
                      className={`p-2 rounded-lg transition ${
                        isDark ? 'text-brand-300 hover:bg-brand-700' : 'text-brand-600 hover:bg-brand-100'
                      }`}
                      title="Edit course"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onShare(course.id)}
                      className={`p-2 rounded-lg transition ${
                        isDark ? 'text-brand-300 hover:bg-brand-700' : 'text-brand-600 hover:bg-brand-100'
                      }`}
                      title="Share course"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Table */}
      <div className={`md:hidden divide-y ${isDark ? 'divide-brand-700' : 'divide-brand-100'}`}>
        {courses.map((course) => (
          <div key={course.id} className={`border-b last:border-0 ${isDark ? 'border-brand-700' : 'border-brand-200'}`}>
            {/* Header Row */}
            <div
              className={`p-4 flex justify-between items-start cursor-pointer transition ${
                isDark ? 'hover:bg-brand-800/60' : 'hover:bg-brand-50'
              }`}
              onClick={() =>
                setExpandedRow(expandedRow === course.id ? null : course.id)
              }
            >
              <div className="flex-1">
                <p className={`font-medium ${isDark ? 'text-white' : 'text-brand-900'}`}>{course.title}</p>
                {course.instructorName && (
                  <div className={`flex items-center gap-1 mt-1 text-xs ${isDark ? 'text-brand-400' : 'text-brand-500'}`}>
                    <User className="h-3 w-3" />
                    <span>{course.instructorName}</span>
                  </div>
                )}
                <div className="flex flex-wrap gap-1 mt-2">
                  {course.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className={`inline-block px-2 py-1 text-xs rounded-md font-medium ${
                        isDark ? 'bg-brand-800 text-brand-200' : 'bg-brand-100 text-brand-700'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <span
                className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                  course.isPublished
                    ? 'bg-green-100 text-green-800'
                    : isDark ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {course.isPublished ? 'Published' : 'Draft'}
              </span>
            </div>

            {/* Expanded Details */}
            {expandedRow === course.id && (
              <div className={`px-4 pb-4 ${isDark ? 'bg-brand-800/40' : 'bg-brand-50'}`}>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className={isDark ? 'text-brand-400' : 'text-brand-500'}>Views</p>
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-brand-900'}`}>
                      {course.viewsCount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className={isDark ? 'text-brand-400' : 'text-brand-500'}>Lessons</p>
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-brand-900'}`}>{course.totalLessons}</p>
                  </div>
                  <div>
                    <p className={isDark ? 'text-brand-400' : 'text-brand-500'}>Duration</p>
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-brand-900'}`}>{course.totalDuration}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => onEdit(course.id)}
                    className={`flex-1 px-3 py-2 rounded-lg transition font-medium text-sm flex items-center justify-center gap-2 ${
                      isDark ? 'bg-brand-700 text-brand-200 hover:bg-brand-600' : 'bg-brand-100 text-brand-700 hover:bg-brand-200'
                    }`}
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => onShare(course.id)}
                    className={`flex-1 px-3 py-2 rounded-lg transition font-medium text-sm flex items-center justify-center gap-2 ${
                      isDark ? 'bg-brand-700 text-brand-200 hover:bg-brand-600' : 'bg-brand-100 text-brand-700 hover:bg-brand-200'
                    }`}
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}