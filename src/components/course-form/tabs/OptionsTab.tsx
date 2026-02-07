import React from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';

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
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
}

interface OptionsTabProps {
  course: Course;
  onCourseChange: (course: Course) => void;
  adminUsers: AdminUser[];
}

export default function OptionsTab({
  course,
  onCourseChange,
  adminUsers,
}: OptionsTabProps) {
  const handleVisibilityChange = (visibility: 'everyone' | 'signed_in') => {
    onCourseChange({ ...course, visibility });
  };

  const handleAccessRuleChange = (accessRule: 'open' | 'invitation' | 'payment') => {
    onCourseChange({ 
      ...course, 
      accessRule,
      // Reset price if not payment
      price: accessRule === 'payment' ? course.price : undefined,
    });
  };

  const handlePriceChange = (price: string) => {
    const numPrice = parseFloat(price);
    onCourseChange({
      ...course,
      price: isNaN(numPrice) ? undefined : numPrice,
    });
  };

  const handleAdminChange = (adminId: string) => {
    onCourseChange({ ...course, adminId });
  };

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Visibility Section */}
      <div className="border-b border-gray-200 pb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          Visibility Settings
        </h3>
        <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
          <label className="flex items-center gap-4 cursor-pointer p-3 hover:bg-white rounded transition">
            <input
              type="radio"
              name="visibility"
              value="everyone"
              checked={course.visibility === 'everyone'}
              onChange={(e) => handleVisibilityChange(e.target.value as 'everyone' | 'signed_in')}
              className="w-4 h-4 text-indigo-600 cursor-pointer"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900">Everyone</p>
              <p className="text-sm text-gray-500">Visible to anyone, including anonymous users</p>
            </div>
          </label>

          <label className="flex items-center gap-4 cursor-pointer p-3 hover:bg-white rounded transition">
            <input
              type="radio"
              name="visibility"
              value="signed_in"
              checked={course.visibility === 'signed_in'}
              onChange={(e) => handleVisibilityChange(e.target.value as 'everyone' | 'signed_in')}
              className="w-4 h-4 text-indigo-600 cursor-pointer"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900">Signed In</p>
              <p className="text-sm text-gray-500">Only visible to authenticated users</p>
            </div>
          </label>
        </div>
      </div>

      {/* Access Rule Section */}
      <div className="border-b border-gray-200 pb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Access Rule</h3>
        <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
          <label className="flex items-center gap-4 cursor-pointer p-3 hover:bg-white rounded transition">
            <input
              type="radio"
              name="accessRule"
              value="open"
              checked={course.accessRule === 'open'}
              onChange={(e) => handleAccessRuleChange(e.target.value as 'open' | 'invitation' | 'payment')}
              className="w-4 h-4 text-indigo-600 cursor-pointer"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900">Open</p>
              <p className="text-sm text-gray-500">Anyone can enroll without restrictions</p>
            </div>
          </label>

          <label className="flex items-center gap-4 cursor-pointer p-3 hover:bg-white rounded transition">
            <input
              type="radio"
              name="accessRule"
              value="invitation"
              checked={course.accessRule === 'invitation'}
              onChange={(e) => handleAccessRuleChange(e.target.value as 'open' | 'invitation' | 'payment')}
              className="w-4 h-4 text-indigo-600 cursor-pointer"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900">On Invitation</p>
              <p className="text-sm text-gray-500">Only invited users can enroll</p>
            </div>
          </label>

          <label className="flex items-center gap-4 cursor-pointer p-3 hover:bg-white rounded transition">
            <input
              type="radio"
              name="accessRule"
              value="payment"
              checked={course.accessRule === 'payment'}
              onChange={(e) => handleAccessRuleChange(e.target.value as 'open' | 'invitation' | 'payment')}
              className="w-4 h-4 text-indigo-600 cursor-pointer"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900">On Payment</p>
              <p className="text-sm text-gray-500">Users must pay to access the course</p>
            </div>
          </label>
        </div>
      </div>

      {/* Conditional Price Field - ONLY SHOW IF "On Payment" IS SELECTED */}
      {course.accessRule === 'payment' && (
        <div className="border-b border-gray-200 pb-8 animate-in fade-in duration-300">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>Pricing</span>
            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded">
              Required
            </span>
          </h3>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4 flex gap-3">
            <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-orange-800">
              This course requires payment. Set a price to enable enrollment.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-lg">
            <span className="text-2xl font-semibold text-gray-900">$</span>
            <input
              type="number"
              value={course.price || ''}
              onChange={(e) => handlePriceChange(e.target.value)}
              placeholder="0.00"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
              min="0"
              step="0.01"
            />
            <span className="text-gray-600 font-medium">USD</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Set the price in USD. Enter 0 for free access.
          </p>
        </div>
      )}

      {/* Course Responsible / Admin Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Administrator</h3>
        <div className="relative">
          <select
            value={course.adminId || ''}
            onChange={(e) => handleAdminChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white cursor-pointer text-gray-900"
          >
            <option value="">Select an admin...</option>
            {adminUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Select the admin responsible for managing this course content and attendees.
        </p>

        {/* Current Admin Info */}
        {course.adminId && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            {(() => {
              const admin = adminUsers.find((u) => u.id === course.adminId);
              return admin ? (
                <div>
                  <p className="font-medium text-blue-900">{admin.name}</p>
                  <p className="text-sm text-blue-700">{admin.email}</p>
                </div>
              ) : null;
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
export default OptionsTab;