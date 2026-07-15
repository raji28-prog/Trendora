import React from 'react';
import { HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from './Button.jsx';

export const EmptyState = ({
  icon: Icon = HelpCircle,
  title = 'No results found',
  description = 'Try adjusting your search or filters to find what you are looking for.',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`flex flex-col items-center justify-center text-center p-12 rounded-[20px] ${className}`}
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px dashed rgba(124, 58, 237, 0.2)',
      }}
    >
      {/* Glowing icon ring */}
      <div
        className="p-5 rounded-full mb-6"
        style={{
          background: 'rgba(124, 58, 237, 0.08)',
          border: '1px solid rgba(124, 58, 237, 0.2)',
          boxShadow: '0 0 24px rgba(124, 58, 237, 0.12)',
        }}
      >
        <Icon className="w-7 h-7" style={{ color: '#8B5CF6' }} />
      </div>
      <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
        {title}
      </h3>
      <p className="text-sm text-textSecondary max-w-xs mb-7 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;
