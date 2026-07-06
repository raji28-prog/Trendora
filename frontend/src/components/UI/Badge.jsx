import React from 'react';

export const Badge = ({
  children,
  className = '',
  variant = 'neutral', // neutral, primary, secondary, success, warning, danger, accent
  ...props
}) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide select-none transition-colors duration-150';

  const variants = {
    neutral: 'bg-sectionBackground text-textSecondary border border-border',
    primary: 'bg-primary/10 text-primary border border-primary/20 dark:bg-primary/20',
    secondary: 'bg-secondary/10 text-secondary border border-secondary/20 dark:bg-secondary/20',
    success: 'bg-success/10 text-success border border-success/20 dark:bg-success/20',
    warning: 'bg-warning/10 text-warning border border-warning/20 dark:bg-warning/20',
    danger: 'bg-danger/10 text-danger border border-danger/20 dark:bg-danger/20',
    accent: 'bg-accent/10 text-accent border border-accent/20 dark:bg-accent/20',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};

export default Badge;
