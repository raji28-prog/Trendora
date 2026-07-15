import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { removeToast } from '../../store/uiSlice.js';
import { Info, CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';

export const Toast = ({ id, type, message, duration }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeToast(id));
    }, duration || 3500);
    return () => clearTimeout(timer);
  }, [id, duration, dispatch]);

  const icons = {
    info:    Info,
    success: CheckCircle2,
    warning: AlertTriangle,
    error:   XCircle,
  };

  const accentColors = {
    info:    '#7C3AED',
    success: '#10B981',
    warning: '#F59E0B',
    error:   '#EF4444',
  };

  const iconColors = {
    info:    '#8B5CF6',
    success: '#10B981',
    warning: '#F59E0B',
    error:   '#EF4444',
  };

  const glowColors = {
    info:    'rgba(124,58,237,0.2)',
    success: 'rgba(16,185,129,0.2)',
    warning: 'rgba(245,158,11,0.2)',
    error:   'rgba(239,68,68,0.2)',
  };

  const Icon = icons[type] || Info;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.92 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.92, transition: { duration: 0.18 } }}
      className="flex items-center gap-3 px-4 py-3.5 rounded-[14px] w-full max-w-sm overflow-hidden relative"
      style={{
        background: 'rgba(15, 15, 23, 0.95)',
        backdropFilter: 'blur(20px)',
        border: `1px solid rgba(255,255,255,0.08)`,
        borderLeft: `3px solid ${accentColors[type]}`,
        boxShadow: `0 8px 32px -8px rgba(0,0,0,0.6), 0 0 0 1px ${glowColors[type]}`,
      }}
    >
      <Icon className="w-4 h-4 shrink-0" style={{ color: iconColors[type] }} />
      <span className="text-sm font-medium text-white flex-1 leading-snug">{message}</span>
      <button
        type="button"
        onClick={() => dispatch(removeToast(id))}
        className="p-1 text-textSecondary hover:text-white hover:bg-white/[0.08] rounded-full transition-colors shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
};

export const ToastContainer = () => {
  const toasts = useSelector((state) => state.ui.toasts);

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col gap-2 w-full max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
