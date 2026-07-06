import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export const Button = React.forwardRef(({
  children,
  className = '',
  variant = 'primary', // primary, secondary, outline, ghost, danger, success
  size = 'md', // sm, md, lg
  isLoading = false,
  isDisabled = false,
  icon: Icon,
  iconPosition = 'left',
  type = 'button',
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 disabled:pointer-events-none disabled:opacity-50';

  const variants = {
    primary: 'bg-primary text-white hover:opacity-90 focus:ring-primary',
    secondary: 'bg-secondary text-white hover:opacity-90 focus:ring-secondary',
    outline: 'border border-border bg-surface text-textPrimary hover:bg-background focus:ring-primary',
    ghost: 'text-textPrimary hover:bg-background focus:ring-primary',
    danger: 'bg-danger text-white hover:opacity-90 focus:ring-danger',
    success: 'bg-success text-white hover:opacity-90 focus:ring-success',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const combinedStyles = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <motion.button
      ref={ref}
      type={type}
      className={combinedStyles}
      disabled={isDisabled || isLoading}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {!isLoading && Icon && iconPosition === 'left' && <Icon className="w-4 h-4 mr-2" />}
      {children}
      {!isLoading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4 ml-2" />}
    </motion.button>
  );
});

Button.displayName = 'Button';
export default Button;
