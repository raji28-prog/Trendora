import React from 'react';

export const LoadingSkeleton = ({
  className = '',
  variant = 'text', // text, circle, rect
  ...props
}) => {
  const variants = {
    text:   'h-4 w-full rounded-lg',
    circle: 'h-10 w-10 rounded-full',
    rect:   'h-24 w-full rounded-xl',
  };

  return (
    <div
      className={`relative overflow-hidden ${variants[variant]} ${className}`}
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.05)',
      }}
      {...props}
    >
      <div
        className="absolute inset-0 -translate-x-full animate-shimmer"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.1) 50%, transparent 100%)',
        }}
      />
    </div>
  );
};

export default LoadingSkeleton;
