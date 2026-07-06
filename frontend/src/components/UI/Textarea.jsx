import React from 'react';

export const Textarea = React.forwardRef(({
  label,
  error,
  className = '',
  rows = 4,
  ...props
}, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-textSecondary select-none">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`w-full px-3 py-2 text-sm rounded-lg border border-border bg-surface text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 resize-none ${
          error ? 'border-danger focus:ring-danger/20 focus:border-danger' : ''
        } ${className}`}
        {...props}
      />
      {error && (
        <span className="text-xs text-danger font-medium mt-0.5">
          {error.message || error}
        </span>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';
export default Textarea;
