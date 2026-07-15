import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export const Button = React.forwardRef(({
  children,
  className = '',
  variant = 'primary', // primary, secondary, outline, ghost, danger, success
  size = 'md',         // sm, md, lg
  isLoading = false,
  isDisabled = false,
  icon: Icon,
  iconPosition = 'left',
  type = 'button',
  ...props
}, ref) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold tracking-wide rounded-[10px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background active:scale-95 disabled:pointer-events-none disabled:opacity-40 select-none relative overflow-hidden';

  const variants = {
    primary:
      'bg-neon-gradient text-white shadow-neon-sm hover:shadow-neon focus:ring-primary/50',
    secondary:
      'bg-secondary text-white hover:bg-secondary/90 shadow-neon-sm focus:ring-secondary/40',
    outline:
      'border border-white/10 bg-white/[0.03] text-textPrimary hover:bg-white/[0.07] hover:border-primary/40 hover:shadow-neon-sm focus:ring-primary/30 backdrop-blur-sm',
    ghost:
      'text-textPrimary hover:bg-white/[0.05] focus:ring-primary/20',
    danger:
      'bg-danger/90 text-white hover:bg-danger shadow-lg hover:shadow-danger/30 focus:ring-danger/40',
    success:
      'bg-success/90 text-white hover:bg-success shadow-lg hover:shadow-success/30 focus:ring-success/40',
  };

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };

  const combinedStyles = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <motion.button
      ref={ref}
      type={type}
      className={combinedStyles}
      disabled={isDisabled || isLoading}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      {...props}
    >
      {/* Shimmer overlay on primary */}
      {variant === 'primary' && (
        <span
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
            transform: 'skewX(-20deg)',
          }}
        />
      )}
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {!isLoading && Icon && iconPosition === 'left' && <Icon className="w-4 h-4 mr-2" />}
      {children}
      {!isLoading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4 ml-2" />}
    </motion.button>
  );
});

Button.displayName = 'Button';
export default Button;
