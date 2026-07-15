import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md', // sm, md, lg, xl
  className = '',
}) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Dark neon backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 backdrop-blur-md"
            style={{ background: 'rgba(6,6,10,0.75)' }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className={`relative w-full rounded-[24px] overflow-hidden z-10 flex flex-col ${sizes[size]} ${className}`}
            style={{
              background: 'rgba(15, 15, 23, 0.92)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 24px 60px -12px rgba(0,0,0,0.7), 0 0 0 1px rgba(124,58,237,0.1)',
            }}
          >
            {/* Neon top line accent */}
            <div
              className="absolute top-0 left-0 right-0 h-[1px]"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.6) 50%, transparent 100%)',
              }}
            />

            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              <h3 className="text-lg font-bold text-white leading-tight tracking-tight">
                {title}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-textSecondary hover:text-white hover:bg-white/[0.08] rounded-[10px] transition-all duration-150"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[72vh]">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
