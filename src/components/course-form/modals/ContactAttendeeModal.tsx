import React, { useState } from 'react';
import { X, Mail, AlertCircle, Check } from 'lucide-react';

interface ContactAttendeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (subject: string, message: string) => void;
}

export default function ContactAttendeeModal({
  isOpen,
  onClose,
  onSend,
}: ContactAttendeeModalProps) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSend = () => {
    if (!subject.trim()) {
      setError('Subject is required');
      return;
    }
    if (!message.trim()) {
      setError('Message is required');
      return;
    }
    if (message.trim().length < 10) {
      setError('Message must be at least 10 characters');
      return;
    }

    onSend(subject, message);
    setSuccess(true);
    setSubject('');
    setMessage('');
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

      <div className="relative bg-white rounded-lg shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
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
          <h2 className="text-2xl font-bold text-gray-900">Contact Attendees</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setError('');
              }}
              placeholder="Email subject..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={success}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setError('');
              }}
              placeholder="Your message here..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none h-32"
              disabled={success}
            />
            <p className="text-xs text-gray-500 mt-1">
              {message.length} characters
            </p>
          </div>

          {error && (
            <div className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {success && (
            <div className="flex gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800">
              <Check className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm font-medium">Message sent to all attendees!</span>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium disabled:opacity-50"
              disabled={success}
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={success}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50"
            >
              {success ? 'Sent!' : 'Send Message'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ContactAttendeeModal;