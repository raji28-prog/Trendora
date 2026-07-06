import React from 'react';

export const Checkbox = React.forwardRef(({
  label,
  error,
  className = '',
  id,
  ...props
}, ref) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substring(2, 11)}`;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          className={`w-4 h-4 rounded border-border text-primary bg-surface focus:ring-primary/20 transition duration-150 cursor-pointer ${
            error ? 'border-danger focus:ring-danger/20' : ''
          } ${className}`}
          {...props}
        />
        {label && (
          <label htmlFor={checkboxId} className="text-sm font-medium text-textPrimary cursor-pointer select-none">
            {label}
          </label>
        )}
      </div>
      {error && (
        <span className="text-xs text-danger font-medium ml-6">
          {error.message || error}
        </span>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';
export default Checkbox;
