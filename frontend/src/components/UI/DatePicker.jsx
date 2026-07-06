import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import Input from './Input.jsx';

export const DatePicker = React.forwardRef(({
  label,
  error,
  className = '',
  ...props
}, ref) => {
  return (
    <Input
      ref={ref}
      type="date"
      label={label}
      error={error}
      icon={CalendarIcon}
      className={`cursor-pointer ${className}`}
      {...props}
    />
  );
});

DatePicker.displayName = 'DatePicker';
export default DatePicker;
