import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'brand' | 'neutral' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'brand',
  size = 'md',
  icon,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center gap-1.5 font-medium rounded-full border transition-colors';

  const variants = {
    brand: 'bg-[#002060]/40 border-[#00B0F0]/30 text-[#00B0F0]',
    neutral: 'bg-slate-800/60 border-slate-700 text-slate-300',
    success: 'bg-emerald-950/50 border-emerald-500/30 text-emerald-400',
    warning: 'bg-amber-950/50 border-amber-500/30 text-amber-400',
    danger: 'bg-rose-950/50 border-rose-500/30 text-rose-400',
    info: 'bg-sky-950/50 border-sky-500/30 text-sky-400',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-3 py-1',
    lg: 'text-sm px-4 py-1.5',
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </div>
  );
};
