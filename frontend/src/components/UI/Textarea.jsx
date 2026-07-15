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
        <label className="text-[10px] font-semibold text-textSecondary select-none uppercase tracking-widest">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`w-full px-4 py-3 text-sm rounded-[12px] text-white
          placeholder:text-textSecondary/40
          focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50
          hover:border-white/20 transition-all duration-200 resize-none
          ${error ? 'border-danger/50 focus:ring-danger/30' : ''}
          ${className}`}
        style={{
          background: 'rgba(15, 15, 23, 0.8)',
          border: error
            ? '1px solid rgba(239,68,68,0.4)'
            : '1px solid rgba(255,255,255,0.10)',
          backdropFilter: 'blur(8px)',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'rgba(124,58,237,0.5)';
          e.target.style.background = 'rgba(20,20,32,0.9)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.1)';
          e.target.style.background = 'rgba(15,15,23,0.8)';
        }}
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
