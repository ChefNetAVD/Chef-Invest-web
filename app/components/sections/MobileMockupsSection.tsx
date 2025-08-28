"use client";

export function MobileMockupsSection() {
  return (
    <section className="section bg-gray-50">
      <div className="container mx-auto">
        <h2 className="section-title">Мобильное приложение</h2>
        <p className="section-subtitle">
          Управляйте своими инвестициями на ходу с помощью нашего мобильного приложения
        </p>
        
        <div className="flex justify-center items-center gap-16 mt-16">
          <div className="mockup-iphone">
            {/* iPhone mockup content will be added here */}
          </div>
          <div className="mockup-samsung">
            {/* Samsung mockup content will be added here */}
          </div>
        </div>
        
        <div className="text-center mt-12">
          <p className="text-lg text-gray-600 mb-6">
            Доступно для iOS и Android
          </p>
          <div className="flex justify-center gap-4">
            <button className="btn-primary">
              Скачать для iOS
            </button>
            <button className="btn-secondary">
              Скачать для Android
            </button>
          </div>
        </div>
      </div>
    </section>
  );
} 