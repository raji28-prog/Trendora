import React from 'react';
import { Filter as FilterIcon } from 'lucide-react';
import Dropdown from './Dropdown.jsx';
import Button from './Button.jsx';

export const Filter = ({
  options = [],
  selectedValues = [],
  onSelect,
  label = 'Filter',
  className = '',
}) => {
  return (
    <Dropdown
      trigger={
        <Button variant="outline" size="sm" icon={FilterIcon} className={className}>
          {label} {selectedValues.length > 0 && `(${selectedValues.length})`}
        </Button>
      }
    >
      <div className="p-2 flex flex-col gap-1 select-none">
        {options.map((opt) => {
          const isSelected = selectedValues.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSelect(opt.value)}
              className={`flex items-center justify-between w-full px-3 py-1.5 rounded text-xs text-left transition-colors ${
                isSelected
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'hover:bg-background text-textPrimary'
              }`}
            >
              <span>{opt.label}</span>
              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
            </button>
          );
        })}
      </div>
    </Dropdown>
  );
};

export default Filter;
