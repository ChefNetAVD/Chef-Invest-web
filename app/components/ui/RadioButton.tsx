"use client";

import React from 'react';

interface RadioButtonProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  name?: string;
  value?: string;
  className?: string;
}

export const RadioButton: React.FC<RadioButtonProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  name,
  value,
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
          type="radio"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          name={name}
          value={value}
          className="sr-only"
        />
        <div
          className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all duration-200 ${
            disabled ? 'opacity-50' : ''
          }`}
          style={{
            borderColor: styles.borderColor,
            backgroundColor: checked ? styles.backgroundColor : 'transparent'
          }}
        >
          {checked && (
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: 'white' }}
            />
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