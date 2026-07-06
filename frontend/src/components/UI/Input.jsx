import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const Input = React.forwardRef(({
  label,
  error,
  type = 'text',
  className = '',
  icon: Icon,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
  const id = React.useId();

  return (
    <div className="w-full flex flex-col gap-1.5">
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 text-textSecondary pointer-events-none z-10">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={id}
          ref={ref}
          type={inputType}
          {...props}
          placeholder=" "
          className={`peer w-full px-3 pt-5 pb-1.5 text-sm rounded-lg border border-border bg-surface text-textPrimary placeholder-transparent focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 ${
            Icon ? 'pl-9' : ''
          } ${
            isPassword ? 'pr-10' : ''
          } ${
            error ? 'border-danger focus:ring-danger/20 focus:border-danger' : ''
          } ${className}`}
        />
        {label && (
          <label
            htmlFor={id}
            className={`absolute text-[10px] font-semibold text-textSecondary select-none transition-all duration-200 transform -translate-y-2.5 scale-90 top-4 origin-[0] pointer-events-none
              peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-3.5
              peer-focus:-translate-y-2.5 peer-focus:scale-90 peer-focus:top-4 peer-focus:text-primary
              ${Icon ? 'left-9' : 'left-3'} ${error ? 'peer-focus:text-danger' : ''}`}
          >
            {label}
          </label>
        )}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-textSecondary hover:text-textPrimary transition-colors z-10"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
          </button>
        )}
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

