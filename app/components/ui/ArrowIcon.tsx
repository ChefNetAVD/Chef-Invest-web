"use client";

import React from 'react';

export interface ArrowIconProps {
  direction?: 'up' | 'down' | 'left' | 'right';
  variant?: 'triangle' | 'line' | 'line-thick' | 'back' | 'back-double';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const ArrowIcon: React.FC<ArrowIconProps> = ({
  direction = 'right',
  variant = 'line',
  size = 'medium',
  className = ''
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  const baseClasses = `inline-block ${sizeClasses[size]} ${className}`;

  // Triangle variant (filled arrows)
  if (variant === 'triangle') {
    return (
      <div className={`${baseClasses} relative`}>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {direction === 'right' && (
            <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          )}
          {direction === 'left' && (
            <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          )}
          {direction === 'up' && (
            <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          )}
          {direction === 'down' && (
            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          )}
        </svg>
      </div>
    );
  }

  // Line variant (simple line arrows)
  if (variant === 'line') {
    return (
      <div className={`${baseClasses} relative`}>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {direction === 'right' && (
            <g>
              <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
              <polyline points="12,5 19,12 12,19" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </g>
          )}
          {direction === 'left' && (
            <g>
              <line x1="19" y1="12" x2="5" y2="12" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
              <polyline points="12,19 5,12 12,5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </g>
          )}
          {direction === 'up' && (
            <g>
              <line x1="12" y1="19" x2="12" y2="5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
              <polyline points="19,12 12,5 5,12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </g>
          )}
          {direction === 'down' && (
            <g>
              <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
              <polyline points="5,12 12,19 19,12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </g>
          )}
        </svg>
      </div>
    );
  }

  // Line thick variant (thicker line arrows)
  if (variant === 'line-thick') {
    return (
      <div className={`${baseClasses} relative`}>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {direction === 'right' && (
            <g>
              <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <polyline points="14,6 20,12 14,18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </g>
          )}
          {direction === 'left' && (
            <g>
              <line x1="20" y1="12" x2="4" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <polyline points="10,18 4,12 10,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </g>
          )}
          {direction === 'up' && (
            <g>
              <line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <polyline points="18,10 12,4 6,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </g>
          )}
          {direction === 'down' && (
            <g>
              <line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <polyline points="6,14 12,20 18,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </g>
          )}
        </svg>
      </div>
    );
  }

  // Back variant (back arrows)
  if (variant === 'back') {
    return (
      <div className={`${baseClasses} relative`}>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {direction === 'left' && (
            <g>
              <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
          )}
          {direction === 'right' && (
            <g>
              <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
          )}
        </svg>
      </div>
    );
  }

  // Back double variant (double back arrows)
  if (variant === 'back-double') {
    return (
      <div className={`${baseClasses} relative`}>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {direction === 'left' && (
            <g>
              <path d="M18 17L13 12L18 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11 17L6 12L11 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
          )}
          {direction === 'right' && (
            <g>
              <path d="M6 7L11 12L6 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13 7L18 12L13 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
          )}
        </svg>
      </div>
    );
  }

  // Default fallback
  return (
    <div className={`${baseClasses} relative`}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}; 