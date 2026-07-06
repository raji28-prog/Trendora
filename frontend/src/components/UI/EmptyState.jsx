import React from 'react';
import { HelpCircle } from 'lucide-react';
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
    <div className={`flex flex-col items-center justify-center text-center p-8 border border-dashed border-border rounded-xl bg-surface/50 ${className}`}>
      <div className="p-3 bg-background rounded-full text-textSecondary mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-textPrimary mb-1">{title}</h3>
      <p className="text-xs text-textSecondary max-w-sm mb-5 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
