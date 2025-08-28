"use client";

import React from 'react';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  className = ''
}) => {
  const getStateStyles = () => {
    if (disabled) {
      return {
        borderColor: 'var(--checkbox-disabled)',
        textColor: 'var(--checkbox-text-disabled)'
      };
    }
    
    if (checked) {
      return {
        borderColor: 'var(--checkbox-active)',
        backgroundColor: 'var(--checkbox-active)',
        textColor: 'var(--checkbox-text-active)'
      };
    }
    
    return {
      borderColor: 'var(--checkbox-default)',
      textColor: 'var(--checkbox-text-default)'
    };
  };

  const styles = getStateStyles();

  return (
    <label className={`flex items-center gap-3 cursor-pointer ${disabled ? 'cursor-not-allowed' : ''} ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all duration-200 ${
            disabled ? 'opacity-50' : ''
          }`}
          style={{
            borderColor: styles.borderColor,
            backgroundColor: checked ? styles.backgroundColor : 'transparent'
          }}
        >
          {checked && (
            <svg
              className="w-3 h-3 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>
      {label && (
        <span
          className="text-sm font-medium"
          style={{ color: styles.textColor }}
        >
          {label}
        </span>
      )}
    </label>
  );
}; 