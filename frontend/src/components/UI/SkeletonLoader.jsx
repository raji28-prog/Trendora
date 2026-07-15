import React from 'react';

export const SkeletonLoader = ({
  className = '',
  variant = 'text', // text, circle, rect, card
  count = 1,
  ...props
}) => {
  const baseClass =
    'relative overflow-hidden rounded-xl';

  const variants = {
    text:   'h-4 w-full rounded-lg',
    circle: 'h-12 w-12 rounded-full',
    rect:   'h-28 w-full rounded-[16px]',
    card:   'h-48 w-full rounded-[20px] p-5 flex flex-col justify-between',
  };

  const items = Array.from({ length: count });

  return (
    <div className="flex flex-col gap-3 w-full">
      {items.map((_, idx) => (
        <div
          key={idx}
          className={`${baseClass} ${variants[variant]} ${className}`}
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
          {...props}
        >
          {/* Neon shimmer overlay */}
          <div
            className="absolute inset-0 -translate-x-full animate-shimmer"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.08) 50%, rgba(168,85,247,0.05) 60%, transparent 100%)',
            }}
          />

          {variant === 'card' && (
            <>
              <div className="flex justify-between items-center w-full">
                <div className="h-10 w-10 rounded-[12px]" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <div className="h-5 w-16 rounded-full"    style={{ background: 'rgba(255,255,255,0.04)' }} />
              </div>
              <div className="flex flex-col gap-2 w-full mt-4">
                <div className="h-4 w-2/3 rounded" style={{ background: 'rgba(255,255,255,0.05)' }} />
                <div className="h-3 w-full rounded" style={{ background: 'rgba(255,255,255,0.04)' }} />
                <div className="h-3 w-5/6 rounded" style={{ background: 'rgba(255,255,255,0.03)' }} />
              </div>
              <div className="h-8 w-full rounded-[10px] mt-auto" style={{ background: 'rgba(255,255,255,0.04)' }} />
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
