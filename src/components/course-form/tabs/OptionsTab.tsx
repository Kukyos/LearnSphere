import React from 'react';
import { Eye, Lock, DollarSign, Users, Mail, UserCheck } from 'lucide-react';

interface CourseOptions {
  visibility: 'Everyone' | 'Signed In';
  access: 'Open' | 'On Invitation' | 'On Payment';
  price: string;
  courseAdmin: string;
}

interface OptionsTabProps {
  options: CourseOptions;
  onChange: (options: CourseOptions) => void;
}

export default function OptionsTab({ options, onChange }: OptionsTabProps) {
  return (
    <div className="space-y-8">
      <h3 className="text-lg font-bold text-brand-900">Course Options</h3>

      {/* Visibility */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-brand-700 flex items-center gap-2">
          <Eye size={16} /> Show course to (Visibility)
        </label>
        <div className="grid grid-cols-2 gap-3">
          {(['Everyone', 'Signed In'] as const).map(vis => (
            <button
              key={vis}
              onClick={() => onChange({ ...options, visibility: vis })}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                options.visibility === vis
                  ? 'border-brand-500 bg-brand-50'
                  : 'border-brand-200 hover:border-brand-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {vis === 'Everyone' ? <Users size={18} className="text-brand-500" /> : <Lock size={18} className="text-orange-500" />}
                <span className="font-semibold text-brand-900">{vis}</span>
              </div>
              <p className="text-xs text-brand-500">
                {vis === 'Everyone' ? 'Anyone can see this course' : 'Only signed-in users can see this course'}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Access Rule */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-brand-700 flex items-center gap-2">
          <Lock size={16} /> Access Rule
        </label>
        <div className="grid grid-cols-3 gap-3">
          {([
            { value: 'Open' as const, icon: <Users size={18} className="text-green-500" />, desc: 'Anyone can start learning' },
            { value: 'On Invitation' as const, icon: <Mail size={18} className="text-blue-500" />, desc: 'Only invited/enrolled users' },
            { value: 'On Payment' as const, icon: <DollarSign size={18} className="text-amber-500" />, desc: 'Users must pay to access' },
          ]).map(acc => (
            <button
              key={acc.value}
              onClick={() => onChange({ ...options, access: acc.value })}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                options.access === acc.value
                  ? 'border-brand-500 bg-brand-50'
                  : 'border-brand-200 hover:border-brand-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {acc.icon}
                <span className="font-semibold text-brand-900 text-sm">{acc.value}</span>
              </div>
              <p className="text-xs text-brand-500">{acc.desc}</p>
            </button>
          ))}
        </div>

        {options.access === 'On Payment' && (
          <div className="mt-3">
            <label className="text-sm font-semibold text-brand-700 block mb-1">Price (USD)</label>
            <div className="relative">
              <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400" />
              <input
                type="number"
                value={options.price}
                onChange={e => onChange({ ...options, price: e.target.value })}
                className="w-full pl-9 pr-4 py-2.5 border border-brand-300 rounded-lg bg-white text-brand-900"
                placeholder="49.99"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        )}
      </div>

      {/* Course Admin */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-brand-700 flex items-center gap-2">
          <UserCheck size={16} /> Course Admin / Responsible
        </label>
        <input
          type="text"
          value={options.courseAdmin || ''}
          onChange={e => onChange({ ...options, courseAdmin: e.target.value })}
          className="w-full px-4 py-2.5 border border-brand-300 rounded-lg bg-white text-brand-900"
          placeholder="Select or type course admin name..."
        />
      </div>
    </div>
  );
}
