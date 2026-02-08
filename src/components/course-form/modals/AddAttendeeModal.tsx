import React, { useState } from 'react';
import { X, Mail } from 'lucide-react';
import { apiInviteToCourse } from '../../../../services/api';

interface AddAttendeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId?: string;
}

export default function AddAttendeeModal({ isOpen, onClose, courseId }: AddAttendeeModalProps) {
  const [emails, setEmails] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!courseId) { setError('No course selected.'); return; }
    const list = emails.split(/[\n,]+/).map(e => e.trim()).filter(Boolean);
    if (list.length === 0) return;
    setSending(true);
    setError('');
    try {
      const res = await apiInviteToCourse(courseId, list);
      if (res.success) {
        setSent(true);
        setTimeout(() => { setSent(false); setEmails(''); onClose(); }, 1500);
      } else {
        setError(res.message || 'Failed to send invitations.');
      }
    } catch {
      setError('Network error. Try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Mail size={20} className="text-brand-500" /> Add Attendees
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500">
            <X size={20} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Enter email addresses to invite attendees to this course.</p>
          <textarea
            value={emails}
            onChange={e => setEmails(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm resize-none"
            placeholder="Enter email addresses, one per line..."
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-2 justify-end">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg text-sm font-semibold">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={!emails.trim() || sent || sending} className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 disabled:opacity-50">
              {sent ? 'Sent!' : sending ? 'Sending...' : 'Send Invitations'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
