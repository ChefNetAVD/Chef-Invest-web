import { useState, useCallback, useMemo } from 'react';
import { 
  calculateInvestment, 
  validateInvestmentAmount, 
  getAvailableRounds,
  getRoundInfo 
} from '../utils/calculations';
import { formatLargeNumber } from '../utils/formatters';
import { InvestmentCalculation, CalculationResult } from '../types/investment';

export function useInvestmentCalculator() {
  // Состояние
  const [investmentAmount, setInvestmentAmount] = useState(1000);
  const [selectedRound, setSelectedRound] = useState('pre-seed');
  const [referralAmount, setReferralAmount] = useState(10000);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Доступные раунды
  const availableRounds = useMemo(() => getAvailableRounds(), []);

  // Текущая информация о раунде
  const currentRoundInfo = useMemo(() => 
    getRoundInfo(selectedRound), [selectedRound]
  );

  // Расчет результатов
  const calculationResult = useMemo((): CalculationResult | null => {
    try {
      return calculateInvestment(investmentAmount, selectedRound, referralAmount);
    } catch (error) {
      console.error('Calculation error:', error);
      return null;
    }
  }, [investmentAmount, selectedRound, referralAmount]);

  // Валидация
  const validation = useMemo(() => 
    validateInvestmentAmount(investmentAmount, selectedRound), 
    [investmentAmount, selectedRound]
  );

  // Обработчики
  const handleInvestmentAmountChange = useCallback((amount: number) => {
    setInvestmentAmount(amount);
    setValidationError(null);
  }, []);

  const handleRoundChange = useCallback((roundId: string) => {
    setSelectedRound(roundId);
    setValidationError(null);
  }, []);

  const handleReferralAmountChange = useCallback((amount: number) => {
    setReferralAmount(amount);
  }, []);

  // Валидация при изменении
  const validateCurrentInput = useCallback(() => {
    const validation = validateInvestmentAmount(investmentAmount, selectedRound);
    if (!validation.isValid) {
      setValidationError(validation.error || 'Неверная сумма инвестиции');
    } else {
      setValidationError(null);
    }
    return validation.isValid;
  }, [investmentAmount, selectedRound]);

  // Форматированные значения для отображения
  const formattedValues = useMemo(() => {
    if (!calculationResult) return null;

    return {
      investmentReturn: formatLargeNumber(calculationResult.investmentReturn),
      referralBonus: formatLargeNumber(calculationResult.referralBonus),
      totalIncome: formatLargeNumber(calculationResult.totalIncome),
      investmentAmount: formatLargeNumber(investmentAmount),
      referralAmount: formatLargeNumber(referralAmount)
    };
  }, [calculationResult, investmentAmount, referralAmount]);

  // Проверка, можно ли инвестировать
  const canInvest = useMemo(() => {
    return validation.isValid && calculationResult !== null;
  }, [validation.isValid, calculationResult]);

  return {
    // Состояние
    investmentAmount,
    selectedRound,
    referralAmount,
    validationError,
    
    // Данные
    availableRounds,
    currentRoundInfo,
    calculationResult,
    formattedValues,
    
    // Валидация
    validation,
    canInvest,
    
    // Обработчики
    handleInvestmentAmountChange,
    handleRoundChange,
    handleReferralAmountChange,
    validateCurrentInput
  };
} 