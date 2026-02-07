import React, { useState } from 'react';
import { X, Mail } from 'lucide-react';

interface AddAttendeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddAttendeeModal({ isOpen, onClose }: AddAttendeeModalProps) {
  const [emails, setEmails] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    alert(`Invitations sent to: ${emails}`);
    setEmails('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Mail size={20} className="text-brand-500" /> Add Attendees
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
            <X size={20} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-sm text-gray-500">Enter email addresses to invite attendees to this course.</p>
          <textarea
            value={emails}
            onChange={e => setEmails(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm resize-none"
            placeholder="Enter email addresses, one per line..."
          />
          <div className="flex gap-2 justify-end">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={!emails.trim()} className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 disabled:opacity-50">
              Send Invitations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
