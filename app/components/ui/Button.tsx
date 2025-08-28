"use client";

import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
  size?: 'small' | 'standard' | 'big';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'standard', 
  className = '',
  onClick,
  type = 'button',
  disabled = false
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-bold transition-all duration-300 cursor-pointer border-none outline-none focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    tertiary: 'bg-transparent text-orange-600 border-2 border-orange-600 hover:bg-orange-600 hover:text-white',
    quaternary: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
  };
  
  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    standard: 'px-6 py-3 text-base',
    big: 'px-8 py-4 text-lg'
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
} 