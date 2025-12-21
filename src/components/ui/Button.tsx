import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  isLoading = false,
  className = '',
  disabled,
  ...props 
}) => {
  const baseStyle = "px-6 py-4 rounded-2xl font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
  
  const variants = {
    primary: "bg-gradient-to-r from-emerald-600 to-green-500 text-white shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:-translate-y-0.5",
    secondary: "bg-white text-gray-800 shadow-lg shadow-gray-200/50 hover:bg-gray-50 border border-gray-100",
    outline: "border-2 border-gray-200 text-gray-600 hover:border-emerald-500 hover:text-emerald-600 bg-transparent",
    danger: "bg-red-50 text-red-500 hover:bg-red-100",
    ghost: "bg-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100/50"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Đang xử lý...</span>
        </div>
      ) : children}
    </button>
  );
};