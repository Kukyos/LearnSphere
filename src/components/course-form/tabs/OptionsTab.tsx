import React from 'react';
import { Eye, Lock, DollarSign, Users } from 'lucide-react';

interface CourseOptions {
  visibility: 'Everyone' | 'Signed In';
  access: 'Free' | 'Paid';
  price: string;
}

interface OptionsTabProps {
  options: CourseOptions;
  onChange: (options: CourseOptions) => void;
}

export default function OptionsTab({ options, onChange }: OptionsTabProps) {
  return (
    <div className="space-y-8">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Course Options</h3>

      {/* Visibility */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Eye size={16} /> Visibility
        </label>
        <div className="grid grid-cols-2 gap-3">
          {(['Everyone', 'Signed In'] as const).map(vis => (
            <button
              key={vis}
              onClick={() => onChange({ ...options, visibility: vis })}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                options.visibility === vis
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/30'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {vis === 'Everyone' ? <Users size={18} className="text-brand-500" /> : <Lock size={18} className="text-orange-500" />}
                <span className="font-semibold text-gray-900 dark:text-white">{vis}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {vis === 'Everyone' ? 'Anyone can see and access this course' : 'Only signed-in users can access'}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Access */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <DollarSign size={16} /> Access & Pricing
        </label>
        <div className="grid grid-cols-2 gap-3">
          {(['Free', 'Paid'] as const).map(acc => (
            <button
              key={acc}
              onClick={() => onChange({ ...options, access: acc })}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                options.access === acc
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/30'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <span className="font-semibold text-gray-900 dark:text-white">{acc}</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {acc === 'Free' ? 'No charge for enrollment' : 'Set a price for this course'}
              </p>
            </button>
          ))}
        </div>

        {options.access === 'Paid' && (
          <div className="mt-3">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1">Price (USD)</label>
            <div className="relative">
              <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                value={options.price}
                onChange={e => onChange({ ...options, price: e.target.value })}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="49.99"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
