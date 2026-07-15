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
    info:    Info,
    success: CheckCircle2,
    warning: AlertTriangle,
    error:   XCircle,
  };

  const variants = {
    info: {
      container: 'border-l-[#7C3AED]',
      bg: 'rgba(124,58,237,0.06)',
      border: 'rgba(124,58,237,0.2)',
      iconColor: '#8B5CF6',
      titleColor: '#C4B5FD',
    },
    success: {
      container: 'border-l-[#10B981]',
      bg: 'rgba(16,185,129,0.06)',
      border: 'rgba(16,185,129,0.2)',
      iconColor: '#10B981',
      titleColor: '#6EE7B7',
    },
    warning: {
      container: 'border-l-[#F59E0B]',
      bg: 'rgba(245,158,11,0.06)',
      border: 'rgba(245,158,11,0.2)',
      iconColor: '#F59E0B',
      titleColor: '#FCD34D',
    },
    error: {
      container: 'border-l-[#EF4444]',
      bg: 'rgba(239,68,68,0.06)',
      border: 'rgba(239,68,68,0.2)',
      iconColor: '#EF4444',
      titleColor: '#FCA5A5',
    },
  };

  const v = variants[variant];
  const Icon = icons[variant];

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-[12px] text-sm border-l-4 ${v.container} ${className}`}
      style={{
        background: v.bg,
        border: `1px solid ${v.border}`,
        borderLeftColor: v.iconColor,
        borderLeftWidth: '3px',
      }}
      {...props}
    >
      <Icon className="w-4 h-4 shrink-0 mt-0.5" style={{ color: v.iconColor }} />
      <div className="flex-1 flex flex-col gap-0.5">
        {title && <span className="font-bold text-white text-sm">{title}</span>}
        <div className="text-sm text-textSecondary opacity-90">{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="p-0.5 rounded-[6px] transition-colors text-textSecondary hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
