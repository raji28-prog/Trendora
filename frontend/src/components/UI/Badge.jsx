import React from 'react';

export const Badge = ({
  children,
  className = '',
  variant = 'neutral', // neutral, primary, secondary, success, warning, danger, accent, gold
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide select-none transition-colors duration-150';

  const variants = {
    neutral:   'bg-white/[0.06] text-textSecondary border border-white/[0.08]',
    primary:   'bg-primary/15 text-purple-300 border border-primary/30',
    secondary: 'bg-secondary/15 text-indigo-300 border border-secondary/30',
    success:   'bg-success/10 text-emerald-400 border border-success/20',
    warning:   'bg-warning/10 text-amber-400 border border-warning/20',
    danger:    'bg-danger/10 text-red-400 border border-danger/20',
    accent:    'bg-accent/12 text-purple-300 border border-accent/25 shadow-[0_0_8px_rgba(168,85,247,0.15)]',
    gold:      'bg-amber-500/10 text-amber-400 border border-amber-500/25',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};

export default Badge;
