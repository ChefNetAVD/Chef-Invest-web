"use client";

import { Button } from "../ui/Button";

export function HeroSection() {
  return (
    <section className="relative">
      {/* Background */}
      <div className="hero-background"></div>
      
      {/* Content */}
      <div className="hero-content">
        <h1 className="hero-title">
          Инвестируйте в будущее с ChefNet Invest
        </h1>
        <p className="hero-subtitle">
          Современная платформа для безопасных и прибыльных инвестиций в криптовалюты и цифровые активы
        </p>
        <div className="flex gap-6">
          <Button variant="primary" size="big">
            Начать инвестировать
            <span className="ico-arrow-right icon-24x24"></span>
          </Button>
          <Button variant="secondary" size="big">
            Узнать больше
            <span className="ico-arrow-right icon-24x24"></span>
          </Button>
        </div>
      </div>
    </section>
  );
} 