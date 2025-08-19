import { InvestmentRound, CalculationResult, INVESTMENT_ROUNDS } from '../types/investment';

/**
 * Рассчитывает потенциальный доход от инвестиции
 */
export function calculateInvestmentReturn(
  amount: number, 
  roundId: string
): number {
  const round = INVESTMENT_ROUNDS[roundId];
  if (!round) return 0;
  
  return amount * round.multiplier;
}

/**
 * Рассчитывает реферальный бонус
 */
export function calculateReferralBonus(referralAmount: number): number {
  const REFERRAL_RATE = 0.05; // 5%
  return referralAmount * REFERRAL_RATE;
}

/**
 * Рассчитывает общий доход
 */
export function calculateTotalIncome(
  investmentReturn: number, 
  referralBonus: number
): number {
  return investmentReturn + referralBonus;
}

/**
 * Полный расчет инвестиции
 */
export function calculateInvestment(
  investmentAmount: number,
  selectedRound: string,
  referralAmount: number
): CalculationResult {
  const roundInfo = INVESTMENT_ROUNDS[selectedRound];
  if (!roundInfo) {
    throw new Error(`Invalid round: ${selectedRound}`);
  }

  const investmentReturn = calculateInvestmentReturn(investmentAmount, selectedRound);
  const referralBonus = calculateReferralBonus(referralAmount);
  const totalIncome = calculateTotalIncome(investmentReturn, referralBonus);

  return {
    investmentReturn,
    referralBonus,
    totalIncome,
    riskLevel: roundInfo.riskLevel,
    roundInfo
  };
}

/**
 * Валидирует сумму инвестиции для выбранного раунда
 */
export function validateInvestmentAmount(
  amount: number, 
  roundId: string
): { isValid: boolean; error?: string } {
  const round = INVESTMENT_ROUNDS[roundId];
  if (!round) {
    return { isValid: false, error: 'Неверный раунд инвестиции' };
  }

  if (amount < round.minAmount) {
    return { 
      isValid: false, 
      error: `Минимальная сумма для ${round.name}: $${round.minAmount.toLocaleString()}` 
    };
  }

  if (amount > round.maxAmount) {
    return { 
      isValid: false, 
      error: `Максимальная сумма для ${round.name}: $${round.maxAmount.toLocaleString()}` 
    };
  }

  return { isValid: true };
}

/**
 * Получает все доступные раунды инвестиций
 */
export function getAvailableRounds(): InvestmentRound[] {
  return Object.values(INVESTMENT_ROUNDS);
}

/**
 * Получает информацию о раунде по ID
 */
export function getRoundInfo(roundId: string): InvestmentRound | null {
  return INVESTMENT_ROUNDS[roundId] || null;
} 