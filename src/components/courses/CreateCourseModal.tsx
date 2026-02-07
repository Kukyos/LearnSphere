import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (courseName: string) => void;
}

export default function CreateCourseModal({
  isOpen,
  onClose,
  onCreate,
}: CreateCourseModalProps) {
  const [courseName, setCourseName] = useState('');
  const [error, setError] = useState('');

  const handleCreate = () => {
    if (!courseName.trim()) {
      setError('Course name is required');
      return;
    }

    onCreate(courseName.trim());
    setCourseName('');
    setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreate();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-brand-500 hover:text-brand-700 transition"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Content */}
        <div>
          <h2 className="text-2xl font-bold text-brand-900 mb-4">Create New Course</h2>

          {/* Course Name Input */}
          <div className="mb-6">
            <label htmlFor="courseName" className="block text-sm font-medium text-brand-700 mb-2">
              Course Name
            </label>
            <input
              id="courseName"
              type="text"
              value={courseName}
              onChange={(e) => {
                setCourseName(e.target.value);
                setError('');
              }}
              onKeyPress={handleKeyPress}
              placeholder="Enter course name..."
              className="w-full px-4 py-2 border border-brand-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition"
              autoFocus
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-brand-300 rounded-lg text-brand-700 font-medium hover:bg-brand-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}