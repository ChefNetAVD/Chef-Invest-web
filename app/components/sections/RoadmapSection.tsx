"use client";

export function RoadmapSection() {
  const milestones = [
    {
      phase: "Q1 2024",
      title: "Запуск платформы",
      description: "Базовый функционал для торговли криптовалютами и управления портфелем"
    },
    {
      phase: "Q2 2024",
      title: "Мобильное приложение",
      description: "iOS и Android приложения с полным функционалом платформы"
    },
    {
      phase: "Q3 2024",
      title: "Расширение активов",
      description: "Добавление новых криптовалют, токенов и DeFi протоколов"
    },
    {
      phase: "Q4 2024",
      title: "Глобальная экспансия",
      description: "Выход на международные рынки и партнерства с крупными игроками"
    }
  ];

  return (
    <section className="section bg-gray-50">
      <div className="container mx-auto">
        <h2 className="section-title">Дорожная карта</h2>
        <p className="section-subtitle">
          Наши планы развития и достижения на пути к лидерству в индустрии
        </p>
        
        <div className="mt-16 max-w-4xl mx-auto">
          {milestones.map((milestone, index) => (
            <div key={index} className="roadmap-item">
              <div className="roadmap-icon">
                {index + 1}
              </div>
              <div className="roadmap-content">
                <div className="text-sm font-bold text-orange-600 mb-2">
                  {milestone.phase}
                </div>
                <h3 className="roadmap-title">{milestone.title}</h3>
                <p className="roadmap-description">{milestone.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 