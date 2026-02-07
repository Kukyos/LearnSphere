import React from 'react';
import { FilterState, Difficulty } from '../types';
import { CATEGORIES } from '../constants';
import { SlidersHorizontal, Check, Star } from 'lucide-react';

interface FilterPanelProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  className?: string;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onChange, className = "" }) => {
  
  const toggleCategory = (cat: string) => {
    const newCats = filters.categories.includes(cat)
      ? filters.categories.filter(c => c !== cat)
      : [...filters.categories, cat];
    onChange({ ...filters, categories: newCats });
  };

  const toggleDifficulty = (diff: Difficulty) => {
    const newDiffs = filters.difficulties.includes(diff)
      ? filters.difficulties.filter(d => d !== diff)
      : [...filters.difficulties, diff];
    onChange({ ...filters, difficulties: newDiffs });
  };

  return (
    <div className={`flex flex-col gap-8 ${className}`}>
      <div className="flex items-center gap-2 pb-4 border-b border-brand-200">
        <SlidersHorizontal size={20} className="text-brand-900" />
        <h3 className="text-lg font-bold text-brand-900">Filters</h3>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold uppercase tracking-wider text-brand-500">Categories</h4>
        <div className="space-y-2">
          {CATEGORIES.map(cat => (
            <label key={cat} className="flex cursor-pointer items-center gap-3 group">
              <div className={`flex h-5 w-5 items-center justify-center rounded border transition-all ${
                filters.categories.includes(cat) 
                  ? 'border-brand-600 bg-brand-600 text-white' 
                  : 'border-brand-300 bg-white group-hover:border-brand-400'
              }`}>
                {filters.categories.includes(cat) && <Check size={12} strokeWidth={3} />}
              </div>
              <input 
                type="checkbox" 
                className="hidden" 
                checked={filters.categories.includes(cat)}
                onChange={() => toggleCategory(cat)}
              />
              <span className={`text-sm ${filters.categories.includes(cat) ? 'font-medium text-brand-900' : 'text-brand-600'}`}>
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold uppercase tracking-wider text-brand-500">Level</h4>
        <div className="space-y-2">
          {['Beginner', 'Intermediate', 'Advanced'].map((diff) => (
             <label key={diff} className="flex cursor-pointer items-center gap-3 group">
             <div className={`flex h-5 w-5 items-center justify-center rounded border transition-all ${
               filters.difficulties.includes(diff as Difficulty) 
                 ? 'border-brand-600 bg-brand-600 text-white' 
                 : 'border-brand-300 bg-white group-hover:border-brand-400'
             }`}>
               {filters.difficulties.includes(diff as Difficulty) && <Check size={12} strokeWidth={3} />}
             </div>
             <input 
               type="checkbox" 
               className="hidden" 
               checked={filters.difficulties.includes(diff as Difficulty)}
               onChange={() => toggleDifficulty(diff as Difficulty)}
             />
             <span className={`text-sm ${filters.difficulties.includes(diff as Difficulty) ? 'font-medium text-brand-900' : 'text-brand-600'}`}>
               {diff}
             </span>
           </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold uppercase tracking-wider text-brand-500">Price</h4>
        <div className="flex rounded-lg border border-brand-200 p-1 bg-brand-50">
            {[
                { label: 'All', value: 'all' },
                { label: 'Free', value: 'free' },
                { label: 'Paid', value: 'paid' }
            ].map((option) => (
                <button
                    key={option.value}
                    onClick={() => onChange({...filters, priceRange: option.value as any})}
                    className={`flex-1 rounded py-1.5 text-xs font-semibold transition-all ${
                        filters.priceRange === option.value
                            ? 'bg-white text-brand-900 shadow-sm'
                            : 'text-brand-500 hover:text-brand-700'
                    }`}
                >
                    {option.label}
                </button>
            ))}
        </div>
      </div>

       {/* Rating */}
       <div className="space-y-3">
        <h4 className="text-sm font-bold uppercase tracking-wider text-brand-500">Rating</h4>
        <div className="space-y-2">
            {[4.5, 4.0, 3.5].map((rating) => (
                <label key={rating} className="flex cursor-pointer items-center gap-2 group">
                    <input 
                        type="radio"
                        name="rating"
                        className="peer hidden"
                        checked={filters.minRating === rating}
                        onChange={() => onChange({...filters, minRating: filters.minRating === rating ? null : rating})}
                    />
                     <div className="h-4 w-4 rounded-full border border-brand-300 bg-white peer-checked:border-brand-600 peer-checked:bg-brand-600 transition-all flex items-center justify-center">
                        <div className="h-1.5 w-1.5 rounded-full bg-white opacity-0 peer-checked:opacity-100"></div>
                     </div>
                    <span className="text-sm text-brand-600 group-hover:text-brand-900 flex items-center gap-1">
                        {rating}+ <Star size={12} className="text-amber-400 fill-amber-400" />
                    </span>
                </label>
            ))}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;