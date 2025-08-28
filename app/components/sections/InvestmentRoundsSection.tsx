"use client";

export function InvestmentRoundsSection() {
  const rounds = [
    {
      title: "Раунд A",
      amount: "$2,000,000",
      description: "Начальный раунд инвестиций для развития платформы",
      status: "Завершен"
    },
    {
      title: "Раунд B",
      amount: "$5,000,000",
      description: "Расширение функциональности и выход на новые рынки",
      status: "Активен"
    },
    {
      title: "Раунд C",
      amount: "$10,000,000",
      description: "Глобальная экспансия и приобретение конкурентов",
      status: "Планируется"
    }
  ];

  return (
    <section className="section">
      <div className="container mx-auto">
        <h2 className="section-title">Инвестиционные раунды</h2>
        <p className="section-subtitle">
          Присоединяйтесь к нашему росту и станьте частью успешной истории
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {rounds.map((round, index) => (
            <div key={index} className="investment-round">
              <div className="investment-round-content">
                <h3 className="text-2xl font-bold mb-4">{round.title}</h3>
                <div className="text-4xl font-bold mb-4">{round.amount}</div>
                <p className="text-lg mb-6 opacity-90">{round.description}</p>
                <div className="inline-block px-4 py-2 bg-white bg-opacity-20 rounded-full text-sm font-bold">
                  {round.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 