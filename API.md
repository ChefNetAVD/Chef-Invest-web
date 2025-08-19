# ChefInvest API Documentation

## 📋 Обзор

ChefInvest предоставляет централизованную систему для управления инвестициями, торговлей акциями и партнерской программой.

## 🏗️ Архитектура

### TradingSystem
Основной класс для управления всеми операциями:

```typescript
class TradingSystem {
  // Инициализация пользователя
  initializeUser(userId: string, referrerId?: string): void
  
  // Операции с балансом
  deposit(userId: string, amount: number): Transaction
  
  // Торговля акциями
  buyShares(userId: string, shares: number, price: number): OrderResult
  sellShares(userId: string, shares: number, price: number): OrderResult
  
  // Получение данных
  getUserBalance(userId: string): UserBalance | null
  getUserPortfolio(userId: string): UserPortfolio | null
  getPartnerNetwork(userId: string): PartnerNetwork | null
  getUserTransactions(userId: string): Transaction[]
  getSystemStats(): SystemStats
}
```

## 💰 Партнерская программа

### Уровни комиссий
- **1 уровень (прямые продажи)**: 10%
- **2 уровень (косвенные продажи)**: 5%
- **3 уровень (косвенные продажи)**: 2%

### Структура сети
```typescript
interface PartnerNetwork {
  userId: string;
  referrerId: string | null;
  level1Partners: string[];  // Прямые партнеры
  level2Partners: string[];  // Партнеры 2-го уровня
  level3Partners: string[];  // Партнеры 3-го уровня
  totalCommissions: number;
  level1Commissions: number;
  level2Commissions: number;
  level3Commissions: number;
}
```

### Функции
```typescript
// Создание партнерской сети
createPartnerNetwork(userId: string, referrerId?: string): PartnerNetwork

// Добавление партнера
addPartnerToNetwork(network: PartnerNetwork, newPartnerId: string): PartnerNetwork

// Расчет комиссий
calculatePartnerCommissions(amount: number, network: PartnerNetwork): PartnerCommission[]
```

## 📈 Торговля акциями

### Константы
```typescript
const SHARE_CONSTANTS = {
  CURRENT_PRICE: 0.01,        // $0.01 за акцию
  MIN_ORDER_SIZE: 1,          // Минимум 1 акция
  MAX_ORDER_SIZE: 1000000,    // Максимум 1M акций
  DECIMAL_PLACES: 2           // 2 знака после запятой
};
```

### Портфель пользователя
```typescript
interface UserPortfolio {
  userId: string;
  totalShares: number;
  averagePrice: number;
  totalInvested: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercentage: number;
  lastUpdated: Date;
}
```

### Операции
```typescript
// Покупка акций
buyShares(userId: string, shares: number, price: number): OrderResult

// Продажа акций
sellShares(userId: string, shares: number, price: number): OrderResult

// Расчет стоимости
calculateOrderTotal(shares: number, price: number): number
calculateSharesFromAmount(amount: number, price: number): number
```

## 💳 Транзакционная система

### Типы транзакций
```typescript
type TransactionType = 
  | 'deposit'      // Пополнение
  | 'withdrawal'   // Вывод
  | 'buy_shares'   // Покупка акций
  | 'sell_shares'  // Продажа акций
  | 'commission'   // Партнерская комиссия
  | 'dividend'     // Дивиденды
  | 'bonus';       // Бонусы
```

### Статусы транзакций
```typescript
type TransactionStatus = 
  | 'pending'      // Ожидает обработки
  | 'processing'   // Обрабатывается
  | 'completed'    // Завершена
  | 'failed'       // Ошибка
  | 'cancelled';   // Отменена
```

### Структура транзакции
```typescript
interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  currency: 'USD' | 'SHARES';
  status: TransactionStatus;
  description: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  processedAt?: Date;
}
```

## 🎯 React Hooks

### useTradingSystem
Основной хук для работы с торговой системой:

```typescript
function useTradingSystem(userId: string) {
  // Состояние
  const [balance, setBalance] = useState<UserBalance | null>(null);
  const [portfolio, setPortfolio] = useState<UserPortfolio | null>(null);
  const [partnerNetwork, setPartnerNetwork] = useState<PartnerNetwork | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Методы
  const deposit = useCallback(async (amount: number) => { /* ... */ }, []);
  const buyShares = useCallback(async (shares: number, price?: number) => { /* ... */ }, []);
  const sellShares = useCallback(async (shares: number, price?: number) => { /* ... */ }, []);
  const refreshData = useCallback(() => { /* ... */ }, []);

  // Вычисляемые значения
  const formattedBalance = useMemo(() => { /* ... */ }, [balance]);
  const formattedPortfolio = useMemo(() => { /* ... */ }, [portfolio]);
  const partnerStats = useMemo(() => { /* ... */ }, [partnerNetwork]);
  const recentTransactions = useMemo(() => { /* ... */ }, [transactions]);

  return {
    // Состояние
    balance,
    portfolio,
    partnerNetwork,
    transactions,
    isLoading,
    error,
    
    // Методы
    deposit,
    buyShares,
    sellShares,
    refreshData,
    clearError,
    
    // Вычисляемые значения
    formattedBalance,
    formattedPortfolio,
    partnerStats,
    recentTransactions,
    canBuyShares,
    canSellShares
  };
}
```

## 🔧 Утилиты

### Форматирование
```typescript
// Форматирование чисел
formatNumber(value: number, decimals?: number): string
formatCurrency(amount: number, currency?: string): string
formatPercentage(value: number, decimals?: number): string
formatLargeNumber(value: number): string

// Форматирование дат
formatDate(date: Date): string
formatDateTime(date: Date): string
formatRelativeTime(date: Date): string
```

### Валидация
```typescript
// Валидация инвестиций
validateInvestmentAmount(amount: number): ValidationResult

// Валидация криптоадресов
validateCryptoAddress(address: string, network: string): ValidationResult

// Валидация ордеров
validateOrder(shares: number, price: number): ValidationResult

// Валидация транзакций
validateTransaction(type: TransactionType, amount: number, currency: string): ValidationResult
```

### Криптовалюты
```typescript
// Получение кошельков
getAvailableWallets(): CryptoWallet[]
getWalletById(id: string): CryptoWallet | null

// Операции с адресами
copyToClipboard(text: string): Promise<boolean>
formatAddress(address: string, network: string): string
getNetworkByAddress(address: string): string | null

// Транзакции
calculateTransactionFee(network: string, amount: number): number
checkTransactionStatus(txHash: string, network: string): Promise<TransactionStatus>
```

## 📊 Инвестиционные раунды

### Структура раунда
```typescript
interface InvestmentRound {
  id: string;
  name: string;
  minInvestment: number;
  maxInvestment: number;
  expectedReturn: number;
  riskLevel: 'low' | 'medium' | 'high';
  duration: number; // в месяцах
  description: string;
  isActive: boolean;
}
```

### Доступные раунды
```typescript
const INVESTMENT_ROUNDS = {
  'pre-seed': {
    id: 'pre-seed',
    name: 'Pre-Seed',
    minInvestment: 200000,
    maxInvestment: 1000000,
    expectedReturn: 0.15,
    riskLevel: 'high',
    duration: 18,
    description: 'Старт идеи и MVP',
    isActive: true
  },
  'seed': {
    id: 'seed',
    name: 'Seed',
    minInvestment: 1000000,
    maxInvestment: 7000000,
    expectedReturn: 0.25,
    riskLevel: 'medium',
    duration: 24,
    description: 'Запуск продукта',
    isActive: true
  },
  // ... другие раунды
};
```

## 🔒 Безопасность

### Валидация входных данных
- Все числовые значения проверяются на положительность
- Строки проверяются на длину и формат
- Даты валидируются на корректность
- ID пользователей проверяются на уникальность

### Защита от двойных транзакций
- Каждая транзакция имеет уникальный ID
- Проверка статуса перед выполнением
- Блокировка операций при обработке

### Логирование
- Все операции логируются
- Подозрительная активность отмечается
- Ошибки записываются с контекстом

## 🚀 Примеры использования

### Инициализация пользователя
```typescript
const tradingSystem = new TradingSystem();
tradingSystem.initializeUser('user123', 'referrer456');
```

### Покупка акций
```typescript
const { order, transaction, shareTransaction, commissions } = 
  tradingSystem.buyShares('user123', 1000, 0.01);
```

### Получение статистики
```typescript
const stats = tradingSystem.getSystemStats();
console.log(`Всего пользователей: ${stats.totalUsers}`);
console.log(`Общий объем торгов: $${stats.totalVolume}`);
```

### Использование хука
```typescript
function InvestmentPage() {
  const {
    balance,
    portfolio,
    buyShares,
    sellShares,
    isLoading,
    error
  } = useTradingSystem('user123');

  const handleBuy = async () => {
    await buyShares(1000, 0.01);
  };

  return (
    <div>
      <p>Баланс: {balance?.usd || 0}</p>
      <p>Акции: {portfolio?.totalShares || 0}</p>
      <button onClick={handleBuy} disabled={isLoading}>
        Купить 1000 акций
      </button>
    </div>
  );
}
```

## 📞 Поддержка

Для технических вопросов:
- Email: dev@chefinvest.com
- Telegram: @chefinvest_dev
- GitHub Issues: [repository-url]/issues
