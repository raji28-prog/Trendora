import React from 'react';
import { Search as SearchIcon } from 'lucide-react';
import Input from './Input.jsx';

export const Search = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
  ...props
}) => {
  return (
    <Input
      icon={SearchIcon}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      {...props}
    />
  );
};

export default Search;
