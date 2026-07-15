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
      exit:    { x: '100%' },
    },
    left: {
      initial: { x: '-100%' },
      animate: { x: 0 },
      exit:    { x: '-100%' },
    },
  };

  const positionStyles = position === 'right' ? 'right-0' : 'left-0';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Dark neon backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 backdrop-blur-md"
            style={{ background: 'rgba(6,6,10,0.75)' }}
          />

          <motion.div
            variants={panelVariants[position]}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'tween', ease: 'easeInOut', duration: 0.28 }}
            className={`absolute top-0 bottom-0 w-full max-w-md flex flex-col z-10 ${positionStyles} ${className}`}
            style={{
              background: 'rgba(11, 11, 18, 0.96)',
              backdropFilter: 'blur(24px)',
              borderLeft: position === 'right' ? '1px solid rgba(255,255,255,0.07)' : 'none',
              borderRight: position === 'left' ? '1px solid rgba(255,255,255,0.07)' : 'none',
              boxShadow: position === 'right'
                ? '-16px 0 48px rgba(0,0,0,0.5)'
                : '16px 0 48px rgba(0,0,0,0.5)',
            }}
          >
            {/* Neon top accent */}
            <div
              className="absolute top-0 left-0 right-0 h-[1px]"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.6) 50%, transparent 100%)',
              }}
            />

            <div
              className="flex items-center justify-between p-5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-textSecondary hover:text-white hover:bg-white/[0.08] rounded-[10px] transition-all duration-150"
              >
                <X className="w-4 h-4" />
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
