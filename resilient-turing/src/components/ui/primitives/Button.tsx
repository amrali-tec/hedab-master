import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

    const variants = {
      primary:
        'bg-[#00B0F0] hover:bg-[#0090C8] text-slate-950 font-semibold shadow-lg shadow-[#00B0F0]/20 focus-visible:ring-[#00B0F0]',
      secondary:
        'bg-[#002060] hover:bg-[#001845] text-white font-semibold border border-[#00B0F0]/30 focus-visible:ring-[#002060]',
      outline:
        'border border-slate-700 hover:border-slate-500 text-slate-200 bg-slate-900/50 hover:bg-slate-800/80 focus-visible:ring-slate-400',
      ghost:
        'text-slate-300 hover:text-white hover:bg-slate-800/60 focus-visible:ring-slate-400',
      destructive:
        'bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-lg shadow-rose-600/20 focus-visible:ring-rose-500',
      link:
        'text-[#00B0F0] hover:underline p-0 h-auto bg-transparent focus-visible:ring-0',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5 min-h-[36px]',
      md: 'text-sm px-4 py-2.5 gap-2 min-h-[44px]',
      lg: 'text-base px-6 py-3.5 gap-2.5 min-h-[52px]',
    };

    const widthStyle = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : leftIcon ? (
          <span className="inline-flex shrink-0">{leftIcon}</span>
        ) : null}

        <span>{children}</span>

        {!isLoading && rightIcon ? (
          <span className="inline-flex shrink-0">{rightIcon}</span>
        ) : null}
      </button>
    );
  }
);

Button.displayName = 'Button';
