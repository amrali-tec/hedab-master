import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass' | 'featured';
  padding?: 'none' | 'compact' | 'normal' | 'spacious';
  interactive?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = 'glass',
      padding = 'normal',
      interactive = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'rounded-2xl transition-all duration-300 relative overflow-hidden';

    const variants = {
      default: 'bg-slate-900/90 border border-slate-800 text-slate-100',
      elevated: 'bg-slate-900 border border-slate-800/80 shadow-2xl text-slate-100',
      outlined: 'bg-transparent border border-slate-700/80 text-slate-100',
      glass:
        'bg-slate-950/75 backdrop-blur-xl border border-slate-800/80 shadow-xl text-slate-100 dark:bg-slate-950/80 dark:border-sky-500/20',
      featured:
        'bg-gradient-to-br from-slate-900 via-[#070B14] to-[#002060]/30 border border-[#00B0F0]/30 shadow-2xl text-white',
    };

    const paddings = {
      none: 'p-0',
      compact: 'p-4 sm:p-5',
      normal: 'p-6 sm:p-8',
      spacious: 'p-8 sm:p-12',
    };

    const interactiveStyle = interactive
      ? 'hover:-translate-y-1 hover:border-[#00B0F0]/50 hover:shadow-2xl hover:shadow-[#00B0F0]/10 cursor-pointer'
      : '';

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${interactiveStyle} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
