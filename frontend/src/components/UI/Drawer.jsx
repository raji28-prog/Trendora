import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const Drawer = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'right', // right, left
  className = '',
}) => {
  const panelVariants = {
    right: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
    },
    left: {
      initial: { x: '-100%' },
      animate: { x: 0 },
      exit: { x: '-100%' },
    },
  };

  const borderStyles = position === 'right' ? 'border-l' : 'border-r';
  const positionStyles = position === 'right' ? 'right-0' : 'left-0';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            variants={panelVariants[position]}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
            className={`absolute top-0 bottom-0 w-full max-w-md bg-surface ${borderStyles} border-border shadow-premium flex flex-col z-10 ${positionStyles} ${className}`}
          >
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="text-base font-semibold text-textPrimary">{title}</h3>
              <button
                type="button"
                onClick={onClose}
                className="p-1 text-textSecondary hover:bg-background rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Drawer;
