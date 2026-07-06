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
    }, duration || 3000);
    return () => clearTimeout(timer);
  }, [id, duration, dispatch]);

  const icons = {
    info: Info,
    success: CheckCircle2,
    warning: AlertTriangle,
    error: XCircle,
  };

  const colors = {
    info: 'bg-surface border-blue-500/30 text-textPrimary',
    success: 'bg-surface border-success/30 text-textPrimary',
    warning: 'bg-surface border-warning/30 text-textPrimary',
    error: 'bg-surface border-danger/30 text-textPrimary',
  };

  const iconColors = {
    info: 'text-blue-500',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-danger',
  };

  const Icon = icons[type] || Info;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9, transition: { duration: 0.2 } }}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-premium w-full max-w-sm ${colors[type]}`}
    >
      <Icon className={`w-5 h-5 shrink-0 ${iconColors[type]}`} />
      <span className="text-sm font-medium flex-1">{message}</span>
      <button
        type="button"
        onClick={() => dispatch(removeToast(id))}
        className="p-1 text-textSecondary hover:bg-background rounded-full transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export const ToastContainer = () => {
  const toasts = useSelector((state) => state.ui.toasts);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 w-full max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
