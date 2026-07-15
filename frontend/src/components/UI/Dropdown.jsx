import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Dropdown = ({
  trigger,
  children,
  align = 'right', // left, right
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alignments = {
    left:  'left-0 origin-top-left',
    right: 'right-0 origin-top-right',
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={{ duration: 0.14, ease: 'easeOut' }}
            className={`absolute mt-2 w-52 rounded-[16px] overflow-hidden z-40 ${alignments[align]} ${className}`}
            style={{
              background: 'rgba(15, 15, 23, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 16px 48px -8px rgba(0,0,0,0.7), 0 0 0 1px rgba(124,58,237,0.08)',
            }}
            onClick={() => setIsOpen(false)}
          >
            {/* Neon top line */}
            <div
              className="absolute top-0 left-0 right-0 h-[1px]"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.5) 50%, transparent 100%)',
              }}
            />
            <div className="py-1.5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const DropdownItem = ({ children, onClick, className = '', ...props }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full text-left px-4 py-2.5 text-sm text-textPrimary hover:bg-white/[0.06] hover:text-white transition-colors duration-100 flex items-center gap-2.5 font-medium ${className}`}
    {...props}
  >
    {children}
  </button>
);

Dropdown.Item = DropdownItem;

export default Dropdown;
