import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Breadcrumb = ({ items = [], className = '' }) => {
  return (
    <nav className={`flex items-center gap-1.5 text-xs text-textSecondary ${className}`}>
      <Link to="/" className="hover:text-textPrimary transition-colors flex items-center gap-1">
        <Home className="w-3.5 h-3.5" />
      </Link>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          {item.to ? (
            <Link to={item.to} className="hover:text-textPrimary transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-textPrimary font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
