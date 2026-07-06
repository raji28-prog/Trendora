import React from 'react';

export const Select = React.forwardRef(({
  label,
  error,
  options = [],
  className = '',
  placeholder,
  ...props
}, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-textSecondary select-none">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`w-full px-3 py-2 text-sm rounded-lg border border-border bg-surface text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 ${
          error ? 'border-danger focus:ring-danger/20 focus:border-danger' : ''
        } ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span className="text-xs text-danger font-medium mt-0.5">
          {error.message || error}
        </span>
      )}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
