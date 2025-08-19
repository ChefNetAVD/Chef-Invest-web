// Типы для партнерской программы
export interface PartnerLevel {
  level: 1 | 2 | 3;
  commissionRate: number; // Процент комиссии
  description: string;
}

// Структура партнерской сети
export interface PartnerNetwork {
  userId: string;
  referrerId: string | null; // Кто пригласил
  level1Partners: string[]; // Прямые партнеры
  level2Partners: string[]; // Партнеры партнеров
  level3Partners: string[]; // Партнеры 3-го уровня
  totalReferrals: number;
  totalEarnings: number;
}

// Партнерская комиссия
export interface PartnerCommission {
  id: string;
  userId: string;
  referrerId: string;
  level: 1 | 2 | 3;
  amount: number;
  percentage: number;
  transactionId: string;
  timestamp: Date;
  status: 'pending' | 'paid' | 'cancelled';
}

// Константы партнерской программы
export const PARTNER_LEVELS: PartnerLevel[] = [
  {
    level: 1,
    commissionRate: 0.10, // 10% от прямых продаж
    description: 'Прямые продажи'
  },
  {
    level: 2,
    commissionRate: 0.05, // 5% от продаж 2-го уровня
    description: 'Продажи партнеров'
  },
  {
    level: 3,
    commissionRate: 0.02, // 2% от продаж 3-го уровня
    description: 'Продажи партнеров партнеров'
  }
];

// Функции для работы с партнерской программой
export function getCommissionRate(level: 1 | 2 | 3): number {
  const partnerLevel = PARTNER_LEVELS.find(l => l.level === level);
  return partnerLevel?.commissionRate || 0;
}

export function calculateCommission(amount: number, level: 1 | 2 | 3): number {
  const rate = getCommissionRate(level);
  return amount * rate;
} 