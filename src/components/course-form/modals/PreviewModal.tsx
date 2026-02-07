import React from 'react';
import { X, Globe, Lock, DollarSign, Users } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  isPublished: boolean;
  coverImage?: string;
  visibility: 'everyone' | 'signed_in';
  accessRule: 'open' | 'invitation' | 'payment';
  price?: number;
  adminId?: string;
  attendeesCount?: number;
}

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
}

export default function PreviewModal({
  isOpen,
  onClose,
  course,
}: PreviewModalProps) {
  if (!isOpen) return null;

  const getAccessRuleLabel = (rule: string) => {
    const labels: Record<string, string> = {
      open: 'Open to anyone',
      invitation: 'Invitation only',
      payment: 'Paid course',
    };
    return labels[rule] || rule;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="sticky top-0 right-0 p-4 text-gray-500 hover:text-gray-700 transition float-right z-10 bg-white"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Course Preview */}
        <div className="p-8">
          {/* Cover Image */}
          {course.coverImage && (
            <img
              src={course.coverImage}
              alt={course.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{course.title}</h1>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                course.isPublished
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {course.isPublished ? '✓ Published' : '✏️ Draft'}
            </span>
            <span className="px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              {course.visibility === 'everyone' ? 'Public' : 'Members Only'}
            </span>
            <span className="px-4 py-2 rounded-full text-sm font-semibold bg-purple-100 text-purple-800 flex items-center gap-2">
              {course.accessRule === 'payment' ? (
                <>
                  <DollarSign className="h-4 w-4" />
                  Paid
                </>
              ) : course.accessRule === 'invitation' ? (
                <>
                  <Lock className="h-4 w-4" />
                  Invitation
                </>
              ) : (
                'Open'
              )}
            </span>
          </div>

          {/* Attendees */}
          {course.attendeesCount && (
            <div className="flex items-center gap-2 text-gray-600 mb-6">
              <Users className="h-5 w-5" />
              <span>{course.attendeesCount} attendees</span>
            </div>
          )}

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Access Information */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Access Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Access Rule</p>
                <p className="font-medium text-gray-900">{getAccessRuleLabel(course.accessRule)}</p>
              </div>
              {course.accessRule === 'payment' && course.price !== undefined && (
                <div>
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="font-medium text-gray-900">${course.price.toFixed(2)} USD</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Visibility</p>
                <p className="font-medium text-gray-900">
                  {course.visibility === 'everyone' ? 'Everyone' : 'Signed In Users'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default PreviewModal;