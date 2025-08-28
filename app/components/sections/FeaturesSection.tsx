"use client";

export function FeaturesSection() {
  const features = [
    {
      icon: "ico-calculator",
      title: "Калькулятор инвестиций",
      description: "Рассчитайте потенциальную прибыль от ваших инвестиций с помощью нашего точного калькулятора"
    },
    {
      icon: "ico-fire",
      title: "Быстрые транзакции",
      description: "Мгновенные переводы и обмены криптовалют без задержек и скрытых комиссий"
    },
    {
      icon: "ico-heart",
      title: "Безопасность",
      description: "Многоуровневая защита ваших активов с использованием передовых технологий шифрования"
    }
  ];

  return (
    <section id="features" className="section">
      <div className="container mx-auto">
        <h2 className="section-title">Особенности платформы</h2>
        <p className="section-subtitle">
          Все необходимые инструменты для успешного инвестирования в одном месте
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {features.map((feature, index) => (
            <div key={index} className="card card-feature">
              <div className={`${feature.icon} icon-80x80`}></div>
              <h3 className="card-feature-title">{feature.title}</h3>
              <p className="card-feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 