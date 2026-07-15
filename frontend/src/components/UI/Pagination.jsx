import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button.jsx';

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-between gap-4 py-4 ${className}`}>
      <span className="text-xs text-textSecondary font-medium">
        Page <span className="text-textPrimary font-semibold">{currentPage}</span> of{' '}
        <span className="text-textPrimary font-semibold">{totalPages}</span>
      </span>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          isDisabled={currentPage <= 1}
          className="rounded-[10px]"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {/* Page number pills */}
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
          .reduce((acc, p, i, arr) => {
            if (i > 0 && p - arr[i - 1] > 1) acc.push('...');
            acc.push(p);
            return acc;
          }, [])
          .map((p, i) =>
            p === '...' ? (
              <span key={`ellipsis-${i}`} className="text-xs text-textSecondary px-1">…</span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`w-8 h-8 rounded-[10px] text-xs font-semibold transition-all duration-150 ${
                  p === currentPage
                    ? 'bg-primary text-[#FEFCF8] shadow-warm'
                    : 'bg-surface border border-border text-textPrimary hover:bg-sectionBackground'
                }`}
              >
                {p}
              </button>
            )
          )
        }

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          isDisabled={currentPage >= totalPages}
          className="rounded-[10px]"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
