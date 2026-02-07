import React, { useState } from 'react';
import { X, Mail, AlertCircle, Check } from 'lucide-react';

interface AddAttendeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (email: string) => void;
}

export default function AddAttendeeModal({
  isOpen,
  onClose,
  onInvite,
}: AddAttendeeModalProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleInvite = () => {
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!validateEmail(email)) {
      setError('Invalid email address');
      return;
    }

    onInvite(email);
    setSuccess(true);
    setEmail('');
    setError('');

    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-lg shadow-2xl p-6 w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Mail className="h-6 w-6 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Add Attendee</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="attendee@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleInvite()}
              autoFocus
              disabled={success}
            />
            {error && (
              <div className="mt-2 flex gap-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}
          </div>

          {success && (
            <div className="flex gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800">
              <Check className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm font-medium">Invitation sent successfully!</span>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
              disabled={success}
            >
              Cancel
            </button>
            <button
              onClick={handleInvite}
              disabled={success}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50"
            >
              {success ? 'Sent!' : 'Send Invite'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AddAttendeeModal;