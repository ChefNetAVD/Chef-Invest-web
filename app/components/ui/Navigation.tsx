import React from 'react';
import { NAVIGATION_ITEMS } from '../../lib/constants';

interface NavigationProps {
  className?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ className = '' }) => {
  return (
    <nav className={`hidden md:flex items-center gap-6 ${className}`}>
      {NAVIGATION_ITEMS.map((item, index) => (
        <a
          key={index}
          href={`#${item.toLowerCase().replace(/\s+/g, '-').replace(/[?]/g, '')}`}
          className="transition-colors duration-200 text-sm font-normal hover:text-orange-600"
          style={{ color: 'var(--color-text)' }}
        >
          {item}
        </a>
      ))}
    </nav>
  );
}; 