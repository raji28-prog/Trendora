import React from 'react';

export const Select = React.forwardRef(({
  label,
  error,
  options = [],
  className = '',
  placeholder,
  ...props
}, ref) => {
  const id = React.useId();
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-[10px] font-semibold text-textSecondary select-none uppercase tracking-widest"
        >
          {label}
        </label>
      )}
      <select
        id={id}
        ref={ref}
        className={`w-full px-4 py-3 text-sm rounded-[12px] text-white
          focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50
          hover:border-white/20 transition-all duration-150 cursor-pointer
          appearance-none
          ${error ? 'border-danger/50 focus:ring-danger/30 focus:border-danger/60' : ''}
          ${className}`}
        style={{
          background: 'rgba(15, 15, 23, 0.8)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(8px)',
          WebkitAppearance: 'none',
        }}
        {...props}
      >
        {placeholder && (
          <option value="" disabled style={{ background: '#0F0F17', color: '#A1A1AA' }}>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} style={{ background: '#0F0F17', color: '#FFFFFF' }}>
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
