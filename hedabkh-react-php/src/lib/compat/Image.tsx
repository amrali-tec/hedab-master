import React from 'react';
import { getSafeImageUrl, handleImageError } from '../imageFallback';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string | any;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  quality?: number | string;
  placeholder?: string;
  blurDataURL?: string;
  unoptimized?: boolean;
  sizes?: string;
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  fill,
  className = '',
  style = {},
  priority,
  quality,
  placeholder,
  blurDataURL,
  unoptimized,
  sizes,
  ...props
}) => {
  const safeSrc = typeof src === 'string' ? getSafeImageUrl(src) : src?.src || '';

  const mergedStyle: React.CSSProperties = fill
    ? {
        position: 'absolute',
        height: '100%',
        width: '100%',
        inset: 0,
        objectFit: 'cover',
        ...style,
      }
    : style;

  return (
    <img
      src={safeSrc}
      alt={alt || ''}
      className={className}
      style={mergedStyle}
      onError={handleImageError}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      {...props}
    />
  );
};

export default Image;
