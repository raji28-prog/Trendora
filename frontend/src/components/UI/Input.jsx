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
          <div className="absolute left-3.5 text-textSecondary pointer-events-none z-10">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={id}
          ref={ref}
          type={inputType}
          {...props}
          placeholder=" "
          className={`peer w-full px-4 pt-5 pb-1.5 text-sm rounded-[12px]
            border border-white/10
            bg-white/[0.04]
            text-white
            placeholder-transparent
            focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50
            focus:bg-white/[0.06]
            hover:border-white/20
            transition-all duration-200
            backdrop-blur-sm
            ${Icon ? 'pl-10' : ''}
            ${isPassword ? 'pr-10' : ''}
            ${error ? 'border-danger/50 focus:ring-danger/30 focus:border-danger/60' : ''}
            ${className}`}
        />
        {label && (
          <label
            htmlFor={id}
            className={`absolute text-[10px] font-semibold text-textSecondary select-none transition-all duration-200
              transform -translate-y-2.5 scale-90 top-4 origin-[0] pointer-events-none
              peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-3.5
              peer-focus:-translate-y-2.5 peer-focus:scale-90 peer-focus:top-4 peer-focus:text-neon
              uppercase tracking-widest
              ${Icon ? 'left-10' : 'left-4'}
              ${error ? 'peer-focus:text-danger' : ''}`}
          >
            {label}
          </label>
        )}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 text-textSecondary hover:text-white transition-colors z-10"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && (
        <span className="text-xs text-danger font-medium mt-0.5 flex items-center gap-1">
          {error.message || error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
