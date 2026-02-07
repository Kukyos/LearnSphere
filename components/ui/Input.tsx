import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  icon, 
  type = 'text', 
  className = '', 
  id,
  ...props 
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full space-y-2">
      <label 
        htmlFor={inputId} 
        className="text-xs text-brand-600 font-semibold ml-1 uppercase tracking-wider"
      >
        {label}
      </label>
      <div className="relative group">
        <input
          id={inputId}
          type={inputType}
          className={`
            w-full bg-brand-50 border border-brand-200 px-5 py-3.5 rounded-2xl outline-none transition-all duration-200
            text-brand-900 placeholder:text-brand-400 font-medium
            ${icon ? 'pr-12' : isPassword ? 'pr-12' : ''}
            ${error 
              ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' 
              : 'focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 hover:border-brand-300'
            }
            ${className}
          `}
          {...props}
        />
        
        {/* Right Icon Position */}
        {(icon || isPassword) && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-400">
            {isPassword ? (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:text-brand-600 transition-colors focus:outline-none p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            ) : (
              icon
            )}
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 ml-1 font-medium">{error}</p>
      )}
    </div>
  );
};
