"use client";

export function Navigation() {
  return (
    <nav className="flex items-center gap-8">
      <a href="#about" className="nav-item">О нас</a>
      <a href="#features" className="nav-item">Особенности</a>
      <a href="#services" className="nav-item">Услуги</a>
      <a href="#contact" className="nav-item">Контакты</a>
      
      {/* Language switcher */}
      <button className="nav-item">RU</button>
      
      {/* Auth buttons */}
      <button className="btn-secondary">Войти</button>
      <button className="btn-primary">Регистрация</button>
    </nav>
  );
} 