import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  isLoading,
  variant = 'primary',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-300 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-brand-700 hover:bg-brand-800 text-brand-50 shadow-lg shadow-brand-900/15",
    secondary: "bg-brand-50 hover:bg-brand-100 text-brand-800 border border-brand-200",
    outline: "bg-transparent border border-brand-300 text-brand-700 hover:border-brand-400 hover:bg-brand-50",
    ghost: "bg-transparent hover:bg-brand-100 text-brand-600 hover:text-brand-800"
  };

  const sizes = "py-3.5 px-8 text-sm tracking-wide";

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};
