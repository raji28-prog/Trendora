import React from 'react';

export const Avatar = ({
  src,
  name = '',
  size = 'md', // sm, md, lg, xl
  className = '',
  ...props
}) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-14 h-14 text-lg font-semibold',
    xl: 'w-20 h-20 text-2xl font-bold',
  };

  const getInitials = (n) =>
    n.split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);

  return (
    <div
      className={`relative flex items-center justify-center rounded-full overflow-hidden
        shrink-0 select-none font-bold ${sizes[size]} ${className}`}
      style={{
        background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
        boxShadow: '0 0 12px rgba(124, 58, 237, 0.35)',
        fontFamily: "'Space Grotesk', sans-serif",
      }}
      {...props}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span className="text-white">{getInitials(name)}</span>
      )}
    </div>
  );
};

export default Avatar;
