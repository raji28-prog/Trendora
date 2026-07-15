import React from 'react';

export const Card = ({
  children,
  className = '',
  glow = false,
  ...props
}) => {
  return (
    <div
      className={`glass-card ${glow ? 'glass-card-glow' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => (
  <div
    className={`px-6 py-5 border-b border-white/[0.06] flex items-center justify-between ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardTitle = ({ children, className = '', ...props }) => (
  <h3
    className={`text-lg font-bold text-white leading-tight tracking-tight ${className}`}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription = ({ children, className = '', ...props }) => (
  <p className={`text-xs text-textSecondary leading-relaxed ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent = ({ children, className = '', ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', ...props }) => (
  <div
    className={`px-6 py-4 border-t border-white/[0.06] bg-white/[0.02] rounded-b-[20px] flex items-center justify-end gap-3 ${className}`}
    {...props}
  >
    {children}
  </div>
);

Card.Header      = CardHeader;
Card.Title       = CardTitle;
Card.Description = CardDescription;
Card.Content     = CardContent;
Card.Footer      = CardFooter;

export default Card;
