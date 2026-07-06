import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Calendar = ({
  selectedDate,
  onDateSelect,
  className = '',
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const totalDays = daysInMonth(currentMonth);
  const offset = firstDayOfMonth(currentMonth);

  const days = Array.from({ length: totalDays }, (_, i) => i + 1);
  const blankDays = Array.from({ length: offset }, (_, i) => i);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleDayClick = (day) => {
    if (onDateSelect) {
      onDateSelect(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
    }
  };

  return (
    <div className={`p-4 border border-border rounded-xl bg-surface shadow-premium w-72 select-none ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-textPrimary">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h4>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1 hover:bg-background rounded-lg border border-border text-textSecondary"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1 hover:bg-background rounded-lg border border-border text-textSecondary"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-textSecondary mb-2">
        <span>Su</span>
        <span>Mo</span>
        <span>Tu</span>
        <span>We</span>
        <span>Th</span>
        <span>Fr</span>
        <span>Sa</span>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {blankDays.map((_, i) => (
          <span key={`blank-${i}`} className="p-1.5" />
        ))}
        {days.map((day) => {
          const isSelected = selectedDate &&
            selectedDate.getDate() === day &&
            selectedDate.getMonth() === currentMonth.getMonth() &&
            selectedDate.getFullYear() === currentMonth.getFullYear();

          return (
            <button
              key={day}
              type="button"
              onClick={() => handleDayClick(day)}
              className={`p-1.5 rounded-lg font-medium transition-colors hover:bg-background ${
                isSelected
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'text-textPrimary'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
