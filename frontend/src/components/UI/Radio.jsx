import React from 'react';

export const Radio = React.forwardRef(({
  label,
  error,
  className = '',
  id,
  ...props
}, ref) => {
  const radioId = id || `radio-${Math.random().toString(36).substring(2, 11)}`;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          type="radio"
          id={radioId}
          className={`w-4 h-4 text-primary border-border bg-surface focus:ring-primary/20 transition duration-150 cursor-pointer ${
            error ? 'border-danger focus:ring-danger/20' : ''
          } ${className}`}
          {...props}
        />
        {label && (
          <label htmlFor={radioId} className="text-sm font-medium text-textPrimary cursor-pointer select-none">
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

Radio.displayName = 'Radio';
export default Radio;
