import React from 'react';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: 'full' | 'wide' | 'standard' | 'narrow';
  cleanPadding?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  width = 'standard',
  cleanPadding = false,
  className = '',
  ...props
}) => {
  const widths = {
    full: 'w-full',
    wide: 'max-w-[1920px] mx-auto',
    standard: 'max-w-7xl mx-auto',
    narrow: 'max-w-4xl mx-auto',
  };

  const paddingStyle = cleanPadding ? '' : 'px-4 sm:px-6 md:px-10';

  return (
    <div className={`${widths[width]} ${paddingStyle} ${className}`} {...props}>
      {children}
    </div>
  );
};
