import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';
import { useApi } from './useApi';
import { TradingSystem } from '../utils/tradingSystem';
import { UserBalance, UserPortfolio, PartnerNetwork, Transaction } from '../types/transactions';
import { formatCurrency, formatLargeNumber } from '../utils/formatters';

/**
 * Хук для торговой системы с аутентификацией
 */
export function useAuthenticatedTrading() {
  const { user, isAuthenticated } = useAuth();
  const api = useApi();
  const [tradingSystem] = useState(() => new TradingSystem());
  
  // Состояние торговой системы
  const [balance, setBalance] = useState<UserBalance | null>(null);
  const [portfolio, setPortfolio] = useState<UserPortfolio | null>(null);
  const [partnerNetwork, setPartnerNetwork] = useState<PartnerNetwork | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Инициализация пользователя в торговой системе
  useEffect(() => {
    if (isAuthenticated && user) {
      initializeUser();
    } else {
      // Очищаем данные при выходе
      setBalance(null);
      setPortfolio(null);
      setPartnerNetwork(null);
      setTransactions([]);
    }
  }, [isAuthenticated, user]);

  /**
   * Инициализирует пользователя в торговой системе
   */
  const initializeUser = useCallback(async () => {
    if (!user) return;

    try {
      // Инициализируем пользователя в торговой системе
      tradingSystem.initializeUser(user.id);
      
      // Загружаем данные
      await refreshData();
    } catch (error) {
      console.error('Failed to initialize user:', error);
      setError('Failed to initialize trading account');
    }
  }, [user, tradingSystem]);

  /**
   * Обновляет все данные
   */
  const refreshData = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      // Получаем данные из торговой системы
      const userBalance = tradingSystem.getUserBalance(user.id);
      const userPortfolio = tradingSystem.getUserPortfolio(user.id);
      const userPartnerNetwork = tradingSystem.getPartnerNetwork(user.id);
      const userTransactions = tradingSystem.getUserTransactions(user.id);

      setBalance(userBalance);
      setPortfolio(userPortfolio);
      setPartnerNetwork(userPartnerNetwork);
      setTransactions(userTransactions);

    } catch (error) {
      console.error('Failed to refresh data:', error);
      setError('Failed to load trading data');
    } finally {
      setIsLoading(false);
    }
  }, [user, tradingSystem]);

  /**
   * Пополнение баланса через USDT
   */
  const deposit = useCallback(async (amount: number, network: string) => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Создаем платежный запрос
      const response = await api.post('/api/usdt-payments', {
        amount,
        network,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Обновляем данные
          await refreshData();
          return true;
        } else {
          setError(data.error || 'Payment request failed');
          return false;
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Payment request failed');
        return false;
      }
    } catch (error) {
      console.error('Deposit error:', error);
      setError('Deposit failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, api, refreshData]);

  /**
   * Покупка акций
   */
  const buyShares = useCallback(async (shares: number, price?: number) => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = tradingSystem.buyShares(user.id, shares, price);
      
      if (result.success) {
        // Обновляем данные
        await refreshData();
        return true;
      } else {
        setError(result.error || 'Failed to buy shares');
        return false;
      }
    } catch (error) {
      console.error('Buy shares error:', error);
      setError('Failed to buy shares');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, tradingSystem, refreshData]);

  /**
   * Продажа акций
   */
  const sellShares = useCallback(async (shares: number, price?: number) => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = tradingSystem.sellShares(user.id, shares, price);
      
      if (result.success) {
        // Обновляем данные
        await refreshData();
        return true;
      } else {
        setError(result.error || 'Failed to sell shares');
        return false;
      }
    } catch (error) {
      console.error('Sell shares error:', error);
      setError('Failed to sell shares');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, tradingSystem, refreshData]);

  /**
   * Получение реферальной статистики
   */
  const getReferralStats = useCallback(async () => {
    if (!user) return null;

    try {
      const response = await api.get('/api/referrals?action=stats');
      if (response.ok) {
        const data = await response.json();
        return data.stats;
      }
    } catch (error) {
      console.error('Failed to get referral stats:', error);
    }
    return null;
  }, [user, api]);

  /**
   * Генерация реферальной ссылки
   */
  const getReferralLink = useCallback(async () => {
    if (!user) return null;

    try {
      const response = await api.get('/api/referrals?action=link');
      if (response.ok) {
        const data = await response.json();
        return data.referralLink;
      }
    } catch (error) {
      console.error('Failed to get referral link:', error);
    }
    return null;
  }, [user, api]);

  /**
   * Очищает ошибку
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

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
      totalEarnings: formatCurrency(partnerNetwork.totalEarnings)
    };
  }, [partnerNetwork]);

  const recentTransactions = useMemo(() => {
    return transactions
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
  }, [transactions]);

  const canBuyShares = useMemo(() => {
    if (!balance || !portfolio) return false;
    const minOrderCost = 1 * 0.10; // 1 акция по $0.10
    return balance.usdBalance >= minOrderCost;
  }, [balance, portfolio]);

  const canSellShares = useMemo(() => {
    if (!portfolio) return false;
    return portfolio.totalShares >= 1;
  }, [portfolio]);

  return {
    // Состояние аутентификации
    isAuthenticated,
    user,
    
    // Состояние торговой системы
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
    
    // Методы
    deposit,
    buyShares,
    sellShares,
    refreshData,
    getReferralStats,
    getReferralLink,
    clearError,
  };
}
