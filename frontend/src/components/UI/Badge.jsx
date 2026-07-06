import React from 'react';

export const Badge = ({
  children,
  className = '',
  variant = 'neutral', // neutral, primary, secondary, success, warning, danger, accent
  ...props
}) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold select-none transition-colors duration-150';

  const variants = {
    neutral: 'bg-background text-textSecondary border border-border',
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-danger/10 text-danger',
    accent: 'bg-accent/10 text-accent',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};

export default Badge;
