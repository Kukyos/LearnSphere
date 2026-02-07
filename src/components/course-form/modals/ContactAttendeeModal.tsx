import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

interface ContactAttendeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactAttendeeModal({ isOpen, onClose }: ContactAttendeeModalProps) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSend = () => {
    alert(`Message sent to all attendees!\nSubject: ${subject}`);
    setSubject('');
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Send size={20} className="text-brand-500" /> Contact Attendees
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
            <X size={20} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Subject</label>
            <input
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
              placeholder="Message subject..."
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Message</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm resize-none"
              placeholder="Write your message..."
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold">
              Cancel
            </button>
            <button onClick={handleSend} disabled={!subject.trim() || !message.trim()} className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 disabled:opacity-50 flex items-center gap-1.5">
              <Send size={14} /> Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
