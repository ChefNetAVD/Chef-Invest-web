import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
  size?: 'big' | 'standard' | 'small';
  state?: 'default' | 'pressed' | 'active' | 'disabled' | 'loading';
  type?: 'text' | 'ico' | 'ico-text' | 'text-ico' | 'ico-text-ico';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'standard',
  state = 'default',
  type = 'text',
  onClick,
  className = '',
  disabled = false
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer border-0';
  
  const sizeStyles = {
    big: 'h-14 px-8 py-6 text-lg',
    standard: 'h-12 px-7 py-5 text-base',
    small: 'h-10 px-6 py-4 text-sm'
  };
  
  const variantStyles = {
    primary: {
      default: 'bg-orange-600 text-white hover:bg-orange-700',
      pressed: 'bg-orange-700 text-white',
      active: 'bg-gray-800 text-white',
      disabled: 'bg-gray-100 text-gray-400 cursor-not-allowed',
      loading: 'bg-gray-50 text-gray-300 cursor-wait'
    },
    secondary: {
      default: 'bg-gray-50 text-orange-600 hover:bg-gray-100',
      pressed: 'bg-gray-100 text-orange-600',
      active: 'bg-gray-800 text-white',
      disabled: 'bg-gray-50 text-gray-400 cursor-not-allowed',
      loading: 'bg-gray-50 text-gray-300 cursor-wait'
    },
    tertiary: {
      default: 'bg-transparent text-orange-600 border border-orange-600 hover:bg-orange-50',
      pressed: 'bg-orange-50 text-orange-600 border border-orange-600',
      active: 'bg-gray-800 text-white border border-gray-800',
      disabled: 'bg-transparent text-gray-400 border border-gray-300 cursor-not-allowed',
      loading: 'bg-transparent text-gray-300 border border-gray-200 cursor-wait'
    },
    quaternary: {
      default: 'bg-transparent text-gray-50 hover:text-white',
      pressed: 'bg-transparent text-gray-50',
      active: 'bg-transparent text-gray-50',
      disabled: 'bg-transparent text-gray-400 cursor-not-allowed',
      loading: 'bg-transparent text-gray-300 cursor-wait'
    }
  };

  const typeStyles = {
    text: 'rounded-full',
    ico: 'rounded-full w-12 h-12 p-0',
    'ico-text': 'rounded-full gap-2',
    'text-ico': 'rounded-full gap-2',
    'ico-text-ico': 'rounded-full gap-2'
  };

  const currentState = disabled ? 'disabled' : state;
  const currentVariant = variantStyles[variant][currentState];
  const currentSize = sizeStyles[size];
  const currentType = typeStyles[type];

  return (
    <button
      className={`${baseStyles} ${currentSize} ${currentVariant} ${currentType} ${className}`}
      onClick={onClick}
      disabled={disabled || state === 'disabled' || state === 'loading'}
    >
      {type === 'ico-text-ico' && (
        <>
          <span className="w-4 h-4">←</span>
          {children}
          <span className="w-4 h-4">→</span>
        </>
      )}
      {type === 'ico-text' && (
        <>
          <span className="w-4 h-4">←</span>
          {children}
        </>
      )}
      {type === 'text-ico' && (
        <>
          {children}
          <span className="w-4 h-4">→</span>
        </>
      )}
      {type === 'ico' && (
        <span className="w-4 h-4">•</span>
      )}
      {type === 'text' && children}
      
      {state === 'loading' && (
        <div className="ml-2 w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
      )}
    </button>
  );
}; 