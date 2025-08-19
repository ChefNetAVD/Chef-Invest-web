import { useState, useCallback, useMemo, useEffect } from 'react';
import { TradingSystem } from '../utils/tradingSystem';
import { formatCurrency, formatLargeNumber } from '../utils/formatters';
import { SHARE_CONSTANTS } from '../types/shares';

// Создаем глобальный экземпляр торговой системы
const tradingSystem = new TradingSystem();

export function useTradingSystem(userId: string) {
  // Состояние
  const [balance, setBalance] = useState(tradingSystem.getUserBalance(userId));
  const [portfolio, setPortfolio] = useState(tradingSystem.getUserPortfolio(userId));
  const [partnerNetwork, setPartnerNetwork] = useState(tradingSystem.getPartnerNetwork(userId));
  const [transactions, setTransactions] = useState(tradingSystem.getUserTransactions(userId));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Инициализация пользователя при первом использовании
  useEffect(() => {
    if (!balance && !portfolio && !partnerNetwork) {
      tradingSystem.initializeUser(userId);
      setBalance(tradingSystem.getUserBalance(userId));
      setPortfolio(tradingSystem.getUserPortfolio(userId));
      setPartnerNetwork(tradingSystem.getPartnerNetwork(userId));
    }
  }, [userId, balance, portfolio, partnerNetwork]);

  // Обновление данных
  const refreshData = useCallback(() => {
    setBalance(tradingSystem.getUserBalance(userId));
    setPortfolio(tradingSystem.getUserPortfolio(userId));
    setPartnerNetwork(tradingSystem.getPartnerNetwork(userId));
    setTransactions(tradingSystem.getUserTransactions(userId));
  }, [userId]);

  // Пополнение баланса
  const deposit = useCallback(async (amount: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const transaction = tradingSystem.deposit(userId, amount);
      refreshData();
      return transaction;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка пополнения';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId, refreshData]);

  // Покупка акций
  const buyShares = useCallback(async (shares: number, price: number = SHARE_CONSTANTS.CURRENT_PRICE) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = tradingSystem.buyShares(userId, shares, price);
      refreshData();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка покупки акций';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId, refreshData]);

  // Продажа акций
  const sellShares = useCallback(async (shares: number, price: number = SHARE_CONSTANTS.CURRENT_PRICE) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = tradingSystem.sellShares(userId, shares, price);
      refreshData();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка продажи акций';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId, refreshData]);

  // Вычисляемые значения
  const formattedBalance = useMemo(() => {
    if (!balance) return null;
    
    return {
      usdBalance: formatCurrency(balance.usdBalance),
      shareBalance: formatLargeNumber(balance.shareBalance),
      totalValue: formatCurrency(balance.totalValue)
    };
  }, [balance]);

  const formattedPortfolio = useMemo(() => {
    if (!portfolio) return null;
    
    return {
      totalShares: formatLargeNumber(portfolio.totalShares),
      averagePrice: formatCurrency(portfolio.averagePrice),
      totalValue: formatCurrency(portfolio.totalValue),
      profitLoss: formatCurrency(portfolio.profitLoss),
      profitLossPercentage: `${portfolio.profitLossPercentage.toFixed(2)}%`
    };
  }, [portfolio]);

  const partnerStats = useMemo(() => {
    if (!partnerNetwork) return null;
    
    return {
      totalReferrals: partnerNetwork.totalReferrals,
      level1Partners: partnerNetwork.level1Partners.length,
      level2Partners: partnerNetwork.level2Partners.length,
      level3Partners: partnerNetwork.level3Partners.length,
      totalEarnings: formatCurrency(partnerNetwork.totalEarnings)
    };
  }, [partnerNetwork]);

  const recentTransactions = useMemo(() => {
    return transactions
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);
  }, [transactions]);

  const canBuyShares = useMemo(() => {
    if (!balance || !portfolio) return false;
    const minOrderCost = SHARE_CONSTANTS.MIN_ORDER_SIZE * SHARE_CONSTANTS.CURRENT_PRICE;
    return balance.usdBalance >= minOrderCost;
  }, [balance, portfolio]);

  const canSellShares = useMemo(() => {
    if (!portfolio) return false;
    return portfolio.totalShares >= SHARE_CONSTANTS.MIN_ORDER_SIZE;
  }, [portfolio]);

  // Очистка ошибки
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Состояние
    balance,
    portfolio,
    partnerNetwork,
    transactions,
    isLoading,
    error,
    
    // Форматированные данные
    formattedBalance,
    formattedPortfolio,
    partnerStats,
    recentTransactions,
    
    // Проверки
    canBuyShares,
    canSellShares,
    
    // Действия
    deposit,
    buyShares,
    sellShares,
    refreshData,
    clearError
  };
} 