import React from 'react';
import { Loader2 } from 'lucide-react';

export const Spinner = ({
  size = 'md', // sm, md, lg
  className = '',
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-7 h-7',
    lg: 'w-11 h-11',
  };

  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <Loader2
        className={`animate-spin ${sizes[size]}`}
        style={{ color: '#8B5CF6', filter: 'drop-shadow(0 0 8px rgba(139,92,246,0.6))' }}
      />
    </div>
  );
};

export default Spinner;
