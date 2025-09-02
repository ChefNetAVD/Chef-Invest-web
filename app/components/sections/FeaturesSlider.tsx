import React, { useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const cards = [
  {
    title: "Личный кабинет инвестора",
    description: "Портфель, история транзакций и реферальные начисления — всё под контролем.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="22" stroke="#D93F29" strokeWidth="4"/><rect x="14" y="18" width="20" height="14" rx="4" fill="#D93F29"/><circle cx="24" cy="25" r="3" fill="#F5EAE1"/></svg>
    ),
  },
  {
    title: "Пул коллективных инвестиций",
    description: "Вход с небольшой суммы, алгоритмическое распределение долей.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><path d="M24 6L44 18L24 30L4 18L24 6Z" stroke="#D93F29" strokeWidth="4"/><path d="M24 30V42" stroke="#D93F29" strokeWidth="4"/><circle cx="24" cy="42" r="4" fill="#D93F29"/></svg>
    ),
  },
  {
    title: "Прозрачная аналитика",
    description: "Дашборды в реальном времени: динамика дохода и метрики проектов.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect x="8" y="8" width="32" height="32" rx="8" stroke="#D93F29" strokeWidth="4"/><path d="M16 32L24 24L32 32" stroke="#D93F29" strokeWidth="4"/><circle cx="24" cy="24" r="4" fill="#D93F29"/></svg>
    ),
  },
  {
    title: "NFT-сертификаты долей",
    description: "Цифровое подтверждение инвестиций с возможностью перепродажи.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect x="8" y="8" width="32" height="32" rx="8" stroke="#D93F29" strokeWidth="4"/><rect x="16" y="16" width="16" height="16" rx="4" fill="#D93F29"/><circle cx="24" cy="24" r="4" fill="#F5EAE1"/></svg>
    ),
  },
  {
    title: "AI-ассистент инвестора",
    description: "Умные подсказки по управлению портфелем и снижению рисков.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect x="8" y="8" width="32" height="32" rx="8" stroke="#D93F29" strokeWidth="4"/><rect x="16" y="16" width="16" height="16" rx="4" fill="#D93F29"/><circle cx="24" cy="24" r="4" fill="#F5EAE1"/></svg>
    ),
  },
];

export default function FeaturesSlider() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!sliderRef.current) return;
    const scrollAmount = 324; // card width + gap
    sliderRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full flex flex-col items-center mt-12">
      <div className="relative w-full max-w-[1600px] flex items-center justify-center">
        <button
          className="absolute left-0 z-10 bg-white rounded-full shadow p-2 hover:bg-[#F5EAE1] transition"
          onClick={() => scroll("left")}
          aria-label="Назад"
        >
          <ChevronLeftIcon className="w-8 h-8 text-[#D93F29]" />
        </button>
        <div
          ref={sliderRef}
          className="flex overflow-x-auto gap-[24px] px-[60px] scrollbar-hide"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 bg-[#F5EAE1] rounded-[20px] w-[300px] h-[308px] p-[40px_20px] flex flex-col items-start gap-4 shadow"
              style={{ scrollSnapAlign: "center" }}
            >
              <div className="mb-6">{card.icon}</div>
              <div className="font-bold text-[24px] leading-[28px] text-[#54403A] mb-2" style={{ fontFamily: 'Arial, sans-serif' }}>{card.title}</div>
              <div className="text-[18px] leading-[24px] text-[#54403A]" style={{ fontFamily: 'Arial, sans-serif' }}>{card.description}</div>
            </div>
          ))}
        </div>
        <button
          className="absolute right-0 z-10 bg-white rounded-full shadow p-2 hover:bg-[#F5EAE1] transition"
          onClick={() => scroll("right")}
          aria-label="Вперёд"
        >
          <ChevronRightIcon className="w-8 h-8 text-[#D93F29]" />
        </button>
      </div>
    </div>
  );
}
