// Типы для инвестиционных раундов
export interface InvestmentRound {
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  multiplier: number;
  riskLevel: 'high' | 'medium' | 'low';
  description: string;
}

// Типы для расчета инвестиций
export interface InvestmentCalculation {
  investmentAmount: number;
  selectedRound: string;
  referralAmount: number;
  potentialReturn: number;
  referralBonus: number;
  totalIncome: number;
  riskLevel: string;
}

// Типы для результатов расчета
export interface CalculationResult {
  investmentReturn: number;
  referralBonus: number;
  totalIncome: number;
  riskLevel: string;
  roundInfo: InvestmentRound;
}

// Константы для инвестиционных раундов
export const INVESTMENT_ROUNDS: Record<string, InvestmentRound> = {
  'pre-seed': {
    id: 'pre-seed',
    name: 'Pre-Seed',
    minAmount: 1000,
    maxAmount: 10000,
    multiplier: 35,
    riskLevel: 'high',
    description: 'Старт идеи - высокий риск, высокая доходность'
  },
  'seed': {
    id: 'seed',
    name: 'Seed',
    minAmount: 5000,
    maxAmount: 50000,
    multiplier: 15,
    riskLevel: 'medium',
    description: 'Первые шаги - проверенная команда'
  },
  'private': {
    id: 'private',
    name: 'Private',
    minAmount: 10000,
    maxAmount: 100000,
    multiplier: 8,
    riskLevel: 'medium',
    description: 'Масштабирование - стабильный рост'
  },
  'public': {
    id: 'public',
    name: 'Public',
    minAmount: 5000,
    maxAmount: 50000,
    multiplier: 3,
    riskLevel: 'low',
    description: 'Зрелость - доказанная модель'
  }
}; 