import React, { useState } from 'react';
import { MoreVertical, Edit, Share2 } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  tags: string[];
  viewsCount: number;
  totalLessons: number;
  totalDuration: string;
  isPublished: boolean;
}

interface CourseTableProps {
  courses: Course[];
  onEdit: (courseId: string) => void;
  onShare: (courseId: string) => void;
}

export default function CourseTable({ courses, onEdit, onShare }: CourseTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Title</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tags</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Views</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Lessons</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Duration</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {courses.map((course) => (
              <tr key={course.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{course.title}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {course.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {course.viewsCount.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {course.totalLessons}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {course.totalDuration}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      course.isPublished
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {course.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(course.id)}
                      className="p-2 text-gray-600 hover:bg-indigo-50 rounded-md transition"
                      title="Edit course"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onShare(course.id)}
                      className="p-2 text-gray-600 hover:bg-indigo-50 rounded-md transition"
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
      <div className="md:hidden divide-y divide-gray-200">
        {courses.map((course) => (
          <div key={course.id} className="border-b border-gray-200 last:border-0">
            {/* Header Row */}
            <div
              className="p-4 flex justify-between items-start cursor-pointer hover:bg-gray-50"
              onClick={() =>
                setExpandedRow(expandedRow === course.id ? null : course.id)
              }
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900">{course.title}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {course.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="inline-block px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded font-medium"
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
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {course.isPublished ? 'Published' : 'Draft'}
              </span>
            </div>

            {/* Expanded Details */}
            {expandedRow === course.id && (
              <div className="px-4 pb-4 bg-gray-50">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Views</p>
                    <p className="font-medium text-gray-900">
                      {course.viewsCount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Lessons</p>
                    <p className="font-medium text-gray-900">{course.totalLessons}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Duration</p>
                    <p className="font-medium text-gray-900">{course.totalDuration}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => onEdit(course.id)}
                    className="flex-1 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 transition font-medium text-sm flex items-center justify-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => onShare(course.id)}
                    className="flex-1 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 transition font-medium text-sm flex items-center justify-center gap-2"
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