// Типы для системы акций
export interface SharePrice {
  price: number; // Цена в USD
  timestamp: Date;
  change24h: number; // Изменение за 24 часа в %
  volume24h: number; // Объем торгов за 24 часа
}

// Портфель пользователя
export interface UserPortfolio {
  userId: string;
  totalShares: number;
  averagePrice: number;
  totalValue: number;
  profitLoss: number;
  profitLossPercentage: number;
}

// Ордер на покупку/продажу
export interface ShareOrder {
  id: string;
  userId: string;
  type: 'buy' | 'sell';
  shares: number;
  price: number;
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled' | 'failed';
  timestamp: Date;
  transactionId?: string;
}

// Транзакция с акциями
export interface ShareTransaction {
  id: string;
  userId: string;
  type: 'buy' | 'sell' | 'dividend' | 'bonus';
  shares: number;
  price: number;
  totalAmount: number;
  timestamp: Date;
  description: string;
  orderId?: string;
}

// Константы для акций
export const SHARE_CONSTANTS = {
  CURRENT_PRICE: 0.01, // $0.01 за акцию
  MIN_ORDER_SIZE: 100, // Минимальный размер заказа
  MAX_ORDER_SIZE: 1000000, // Максимальный размер заказа
  TRADING_FEE: 0.001, // 0.1% комиссия за сделку
  PRICE_DECIMALS: 4, // Количество знаков после запятой для цены
  SHARE_DECIMALS: 0 // Количество знаков после запятой для количества акций
};

// Функции для работы с акциями
export function calculateOrderTotal(shares: number, price: number): number {
  const subtotal = shares * price;
  const fee = subtotal * SHARE_CONSTANTS.TRADING_FEE;
  return subtotal + fee;
}

export function calculateSharesFromAmount(amount: number, price: number): number {
  const fee = amount * SHARE_CONSTANTS.TRADING_FEE;
  const availableForShares = amount - fee;
  return Math.floor(availableForShares / price);
}

export function validateOrder(shares: number, price: number): {
  isValid: boolean;
  error?: string;
} {
  if (shares < SHARE_CONSTANTS.MIN_ORDER_SIZE) {
    return {
      isValid: false,
      error: `Минимальный размер заказа: ${SHARE_CONSTANTS.MIN_ORDER_SIZE} акций`
    };
  }

  if (shares > SHARE_CONSTANTS.MAX_ORDER_SIZE) {
    return {
      isValid: false,
      error: `Максимальный размер заказа: ${SHARE_CONSTANTS.MAX_ORDER_SIZE} акций`
    };
  }

  if (price <= 0) {
    return {
      isValid: false,
      error: 'Цена должна быть больше нуля'
    };
  }

  return { isValid: true };
} 