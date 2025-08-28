import React from 'react';
import { Logo } from '../ui/Logo';
import { Navigation } from '../ui/Navigation';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        height: 'var(--header-height)',
        background: 'rgba(57, 16, 0, 0.3)',
        backdropFilter: 'blur(16px)',
        padding: 'var(--header-padding-y) var(--header-padding-x)'
      }}
    >
      <div className="container mx-auto h-full">
        <div className="flex items-center justify-between h-full">
          {/* Логотип */}
          <Logo />
          
          {/* Центральная навигация */}
          <Navigation />
          
          {/* Правая часть - toolbar */}
          <div 
            className="flex items-center"
            style={{
              width: 'var(--toolbar-width)',
              height: 'var(--toolbar-height)',
              gap: 'var(--toolbar-gap)'
            }}
          >
            {/* Языковой переключатель */}
            <button 
              className="text-gray-50 text-sm font-normal hover:text-orange-300 transition-colors duration-200"
              style={{ color: 'var(--color-text)' }}
            >
              RU
            </button>
            
            {/* Кнопки авторизации */}
            <Button variant="quaternary" size="small">
              Войти
            </Button>
            <Button variant="primary" size="small">
              Регистрация
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}; 