import React from 'react';
import { Info, CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';

export const Alert = ({
  children,
  className = '',
  variant = 'info', // info, success, warning, error
  title,
  onClose,
  ...props
}) => {
  const icons = {
    info: Info,
    success: CheckCircle2,
    warning: AlertTriangle,
    error: XCircle,
  };

  const variants = {
    info: 'bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800/30',
    success: 'bg-success/5 text-success border-success/20',
    warning: 'bg-warning/5 text-warning border-warning/20',
    error: 'bg-danger/5 text-danger border-danger/20',
  };

  const Icon = icons[variant];

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border text-sm transition-all duration-200 ${variants[variant]} ${className}`}
      {...props}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <div className="flex-1 flex flex-col gap-0.5">
        {title && <span className="font-semibold">{title}</span>}
        <div className="text-sm opacity-90">{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="p-0.5 hover:bg-black/5 dark:hover:bg-white/5 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
