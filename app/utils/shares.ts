import { 
  SharePrice, 
  UserPortfolio, 
  ShareOrder, 
  ShareTransaction,
  SHARE_CONSTANTS,
  calculateOrderTotal,
  calculateSharesFromAmount,
  validateOrder 
} from '../types/shares';
import { generateTransactionId } from '../types/transactions';

/**
 * Создает новый портфель пользователя
 */
export function createUserPortfolio(userId: string): UserPortfolio {
  return {
    userId,
    totalShares: 0,
    averagePrice: 0,
    totalValue: 0,
    profitLoss: 0,
    profitLossPercentage: 0
  };
}

/**
 * Обновляет портфель после покупки акций
 */
export function updatePortfolioAfterBuy(
  portfolio: UserPortfolio,
  shares: number,
  price: number
): UserPortfolio {
  const totalCost = shares * price;
  const newTotalShares = portfolio.totalShares + shares;
  const newTotalCost = portfolio.totalShares * portfolio.averagePrice + totalCost;
  const newAveragePrice = newTotalShares > 0 ? newTotalCost / newTotalShares : 0;
  const newTotalValue = newTotalShares * SHARE_CONSTANTS.CURRENT_PRICE;
  const newProfitLoss = newTotalValue - newTotalCost;
  const newProfitLossPercentage = newTotalCost > 0 ? (newProfitLoss / newTotalCost) * 100 : 0;

  return {
    ...portfolio,
    totalShares: newTotalShares,
    averagePrice: newAveragePrice,
    totalValue: newTotalValue,
    profitLoss: newProfitLoss,
    profitLossPercentage: newProfitLossPercentage
  };
}

/**
 * Обновляет портфель после продажи акций
 */
export function updatePortfolioAfterSell(
  portfolio: UserPortfolio,
  shares: number,
  price: number
): UserPortfolio {
  if (shares > portfolio.totalShares) {
    throw new Error('Недостаточно акций для продажи');
  }

  const remainingShares = portfolio.totalShares - shares;
  const soldValue = shares * price;
  const remainingCost = remainingShares * portfolio.averagePrice;
  const newTotalValue = remainingShares * SHARE_CONSTANTS.CURRENT_PRICE;
  const newProfitLoss = newTotalValue - remainingCost;
  const newProfitLossPercentage = remainingCost > 0 ? (newProfitLoss / remainingCost) * 100 : 0;

  return {
    ...portfolio,
    totalShares: remainingShares,
    totalValue: newTotalValue,
    profitLoss: newProfitLoss,
    profitLossPercentage: newProfitLossPercentage
  };
}

/**
 * Создает ордер на покупку акций
 */
export function createBuyOrder(
  userId: string,
  shares: number,
  price: number
): ShareOrder {
  const validation = validateOrder(shares, price);
  if (!validation.isValid) {
    throw new Error(validation.error || 'Неверные параметры ордера');
  }

  const totalAmount = calculateOrderTotal(shares, price);

  return {
    id: generateTransactionId(),
    userId,
    type: 'buy',
    shares,
    price,
    totalAmount,
    status: 'pending',
    timestamp: new Date()
  };
}

/**
 * Создает ордер на продажу акций
 */
export function createSellOrder(
  userId: string,
  shares: number,
  price: number
): ShareOrder {
  const validation = validateOrder(shares, price);
  if (!validation.isValid) {
    throw new Error(validation.error || 'Неверные параметры ордера');
  }

  const totalAmount = calculateOrderTotal(shares, price);

  return {
    id: generateTransactionId(),
    userId,
    type: 'sell',
    shares,
    price,
    totalAmount,
    status: 'pending',
    timestamp: new Date()
  };
}

/**
 * Выполняет ордер
 */
export function executeOrder(
  order: ShareOrder,
  portfolio: UserPortfolio
): { updatedOrder: ShareOrder; updatedPortfolio: UserPortfolio; transaction: ShareTransaction } {
  const updatedOrder = { ...order, status: 'completed' as const };
  
  let updatedPortfolio: UserPortfolio;
  let transaction: ShareTransaction;

  if (order.type === 'buy') {
    updatedPortfolio = updatePortfolioAfterBuy(portfolio, order.shares, order.price);
    transaction = createShareTransaction(
      order.userId,
      'buy',
      order.shares,
      order.price,
      order.totalAmount,
      `Покупка ${order.shares} акций по цене $${order.price}`
    );
  } else {
    updatedPortfolio = updatePortfolioAfterSell(portfolio, order.shares, order.price);
    transaction = createShareTransaction(
      order.userId,
      'sell',
      order.shares,
      order.price,
      order.totalAmount,
      `Продажа ${order.shares} акций по цене $${order.price}`
    );
  }

  return { updatedOrder, updatedPortfolio, transaction };
}

/**
 * Создает транзакцию с акциями
 */
export function createShareTransaction(
  userId: string,
  type: 'buy' | 'sell' | 'dividend' | 'bonus',
  shares: number,
  price: number,
  totalAmount: number,
  description: string,
  orderId?: string
): ShareTransaction {
  return {
    id: generateTransactionId(),
    userId,
    type,
    shares,
    price,
    totalAmount,
    timestamp: new Date(),
    description,
    orderId
  };
}

/**
 * Рассчитывает количество акций, которые можно купить на определенную сумму
 */
export function calculateSharesForAmount(amount: number, price: number): number {
  return calculateSharesFromAmount(amount, price);
}

/**
 * Рассчитывает стоимость портфеля по текущей цене
 */
export function calculatePortfolioValue(portfolio: UserPortfolio, currentPrice: number): number {
  return portfolio.totalShares * currentPrice;
}

/**
 * Получает текущую цену акций
 */
export function getCurrentSharePrice(): SharePrice {
  return {
    price: SHARE_CONSTANTS.CURRENT_PRICE,
    timestamp: new Date(),
    change24h: 0, // В реальной системе это будет динамически
    volume24h: 0  // В реальной системе это будет динамически
  };
}

/**
 * Проверяет, достаточно ли средств для покупки
 */
export function canAffordPurchase(
  userBalance: number,
  shares: number,
  price: number
): boolean {
  const totalCost = calculateOrderTotal(shares, price);
  return userBalance >= totalCost;
}

/**
 * Проверяет, достаточно ли акций для продажи
 */
export function canAffordSale(
  portfolio: UserPortfolio,
  shares: number
): boolean {
  return portfolio.totalShares >= shares;
} 