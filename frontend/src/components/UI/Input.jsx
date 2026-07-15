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
      <div className="relative flex items-center w-full">
        <input
          id={id}
          ref={ref}
          type={inputType}
          placeholder={props.placeholder || " "}
          className={`peer w-full h-14 px-4 pt-5 pb-1.5 text-sm rounded-[14px]
            border border-white/10
            bg-[#0B0B12]/60
            text-white
            placeholder-transparent
            focus:placeholder-textSecondary/40
            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50
            hover:border-white/20 hover:bg-[#0F0F17]/80
            transition-all duration-300
            backdrop-blur-md
            ${Icon ? 'pl-11' : 'pl-4'}
            ${isPassword ? 'pr-11' : 'pr-4'}
            ${error ? 'border-danger/40 focus:ring-danger/20 focus:border-danger/50' : ''}
            ${className}`}
          {...props}
        />
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary/50 pointer-events-none z-10 transition-colors duration-300 peer-focus:text-primary">
            <Icon className="w-4.5 h-4.5" />
          </div>
        )}
        {label && (
          <label
            htmlFor={id}
            className={`absolute text-[10px] font-bold text-textSecondary/60 select-none transition-all duration-300
              transform -translate-y-3.5 scale-90 top-[18px] origin-[0] pointer-events-none
              peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
              peer-focus:-translate-y-3.5 peer-focus:scale-90 peer-focus:top-[18px] peer-focus:text-primary
              uppercase tracking-widest
              ${Icon ? 'left-11' : 'left-4'}
              ${error ? 'peer-focus:text-danger' : ''}`}
          >
            {label}
          </label>
        )}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-textSecondary/50 hover:text-white transition-colors z-10 peer-focus:text-primary"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
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
