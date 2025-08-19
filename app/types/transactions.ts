// Типы для транзакционной системы
export type TransactionType = 
  | 'deposit'           // Пополнение
  | 'withdrawal'        // Вывод
  | 'share_buy'         // Покупка акций
  | 'share_sell'        // Продажа акций
  | 'partner_commission' // Партнерская комиссия
  | 'dividend'          // Дивиденды
  | 'bonus'             // Бонусы
  | 'fee'               // Комиссии
  | 'refund'            // Возврат
  | 'transfer';         // Перевод

export type TransactionStatus = 
  | 'pending'           // В обработке
  | 'completed'         // Завершена
  | 'failed'            // Ошибка
  | 'cancelled'         // Отменена
  | 'reversed';         // Отменена

// Баланс пользователя
export interface UserBalance {
  userId: string;
  usdBalance: number;
  shareBalance: number;
  totalValue: number;
  lastUpdated: Date;
}

// Транзакция
export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  currency: 'USD' | 'SHARES';
  status: TransactionStatus;
  timestamp: Date;
  description: string;
  referenceId?: string; // ID связанной операции
  metadata?: Record<string, any>; // Дополнительные данные
}

// История транзакций
export interface TransactionHistory {
  transactions: Transaction[];
  totalCount: number;
  hasMore: boolean;
  nextCursor?: string;
}

// Фильтры для истории транзакций
export interface TransactionFilters {
  type?: TransactionType;
  status?: TransactionStatus;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  limit?: number;
  offset?: number;
}

// Статистика транзакций
export interface TransactionStats {
  totalTransactions: number;
  totalVolume: number;
  averageAmount: number;
  successRate: number;
  byType: Record<TransactionType, number>;
  byStatus: Record<TransactionStatus, number>;
}

// Константы для транзакций
export const TRANSACTION_CONSTANTS = {
  MIN_DEPOSIT: 10, // Минимальная сумма пополнения
  MAX_DEPOSIT: 100000, // Максимальная сумма пополнения
  MIN_WITHDRAWAL: 50, // Минимальная сумма вывода
  MAX_WITHDRAWAL: 50000, // Максимальная сумма вывода
  PROCESSING_TIME: {
    deposit: 300000, // 5 минут
    withdrawal: 86400000, // 24 часа
    share_buy: 60000, // 1 минута
    share_sell: 60000, // 1 минута
    partner_commission: 300000, // 5 минут
    default: 300000 // 5 минут
  }
};

// Функции для работы с транзакциями
export function validateTransaction(
  type: TransactionType,
  amount: number,
  currency: 'USD' | 'SHARES'
): { isValid: boolean; error?: string } {
  // Валидация суммы пополнения
  if (type === 'deposit') {
    if (amount < TRANSACTION_CONSTANTS.MIN_DEPOSIT) {
      return {
        isValid: false,
        error: `Минимальная сумма пополнения: $${TRANSACTION_CONSTANTS.MIN_DEPOSIT}`
      };
    }
    if (amount > TRANSACTION_CONSTANTS.MAX_DEPOSIT) {
      return {
        isValid: false,
        error: `Максимальная сумма пополнения: $${TRANSACTION_CONSTANTS.MAX_DEPOSIT}`
      };
    }
  }

  // Валидация суммы вывода
  if (type === 'withdrawal') {
    if (amount < TRANSACTION_CONSTANTS.MIN_WITHDRAWAL) {
      return {
        isValid: false,
        error: `Минимальная сумма вывода: $${TRANSACTION_CONSTANTS.MIN_WITHDRAWAL}`
      };
    }
    if (amount > TRANSACTION_CONSTANTS.MAX_WITHDRAWAL) {
      return {
        isValid: false,
        error: `Максимальная сумма вывода: $${TRANSACTION_CONSTANTS.MAX_WITHDRAWAL}`
      };
    }
  }

  // Общая валидация
  if (amount <= 0) {
    return {
      isValid: false,
      error: 'Сумма должна быть больше нуля'
    };
  }

  return { isValid: true };
}

export function getProcessingTime(type: TransactionType): number {
  const processingTimes = TRANSACTION_CONSTANTS.PROCESSING_TIME as any;
  return processingTimes[type] || TRANSACTION_CONSTANTS.PROCESSING_TIME.default;
}

export function generateTransactionId(): string {
  return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
} 