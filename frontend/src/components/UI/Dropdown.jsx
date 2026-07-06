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
    left: 'left-0 origin-top-left',
    right: 'right-0 origin-top-right',
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">{trigger}</div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.15 }}
            className={`absolute mt-2 w-56 rounded-lg border border-border bg-surface shadow-premium ring-1 ring-black/5 z-40 focus:outline-none overflow-hidden ${alignments[align]} ${className}`}
            onClick={() => setIsOpen(false)}
          >
            {children}
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
    className={`w-full text-left px-4 py-2.5 text-sm text-textPrimary hover:bg-background transition-colors flex items-center gap-2 ${className}`}
    {...props}
  >
    {children}
  </button>
);

Dropdown.Item = DropdownItem;

export default Dropdown;
