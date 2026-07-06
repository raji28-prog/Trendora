import React from 'react';

export const Input = React.forwardRef(({
  label,
  error,
  type = 'text',
  className = '',
  icon: Icon,
  ...props
}, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-textSecondary select-none">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 text-textSecondary pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`w-full px-3 py-2 text-sm rounded-lg border border-border bg-surface text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 ${
            Icon ? 'pl-10' : ''
          } ${error ? 'border-danger focus:ring-danger/20 focus:border-danger' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <span className="text-xs text-danger font-medium mt-0.5">
          {error.message || error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
