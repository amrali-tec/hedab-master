import React from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

export interface NextLinkProps extends Omit<RouterLinkProps, 'to'> {
  href?: string;
  to?: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  [key: string]: any;
}

export const Link: React.FC<NextLinkProps> = ({
  href,
  to,
  children,
  className,
  ...props
}) => {
  const targetPath = to || href || '#';

  // Handle external links or telephone/mailto
  if (
    typeof targetPath === 'string' &&
    (targetPath.startsWith('http://') ||
      targetPath.startsWith('https://') ||
      targetPath.startsWith('tel:') ||
      targetPath.startsWith('mailto:') ||
      targetPath.startsWith('//'))
  ) {
    return (
      <a href={targetPath} className={className} {...props}>
        {children}
      </a>
    );
  }

  return (
    <RouterLink to={targetPath} className={className} {...props}>
      {children}
    </RouterLink>
  );
};

export default Link;
