"use client";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <a href="#about" className="footer-link">О нас</a>
          <a href="#features" className="footer-link">Особенности</a>
          <a href="#services" className="footer-link">Услуги</a>
          <a href="#contact" className="footer-link">Контакты</a>
          <a href="/privacy" className="footer-link">Политика конфиденциальности</a>
          <a href="/terms" className="footer-link">Условия использования</a>
        </div>
        
        <div className="footer-copyright">
          © 2024 ChefNet Invest. Все права защищены.
        </div>
      </div>
    </footer>
  );
} 