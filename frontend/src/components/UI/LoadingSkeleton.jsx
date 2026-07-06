import React from 'react';

export const LoadingSkeleton = ({
  className = '',
  variant = 'text', // text, circle, rect
  ...props
}) => {
  const variants = {
    text: 'h-4 w-full rounded',
    circle: 'h-10 w-10 rounded-full',
    rect: 'h-24 w-full rounded-xl',
  };

  return (
    <div
      className={`animate-pulse bg-textSecondary/10 ${variants[variant]} ${className}`}
      {...props}
    />
  );
};

export default LoadingSkeleton;
