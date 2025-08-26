import { 
  ShareOrder, 
  ShareTransaction, 
  UserPortfolio,
  SHARE_CONSTANTS 
} from '../types/shares';
import { 
  Transaction, 
  TransactionType, 
  UserBalance,
  generateTransactionId 
} from '../types/transactions';
import { 
  PartnerNetwork, 
  PartnerCommission 
} from '../types/partner';
import { 
  createBuyOrder, 
  createSellOrder, 
  executeOrder,
  createUserPortfolio,
  canAffordPurchase,
  canAffordSale 
} from './shares';
import { 
  calculatePartnerCommissions 
} from './partner';
import { 
  validateTransaction 
} from '../types/transactions';

/**
 * Централизованная система торговли
 */
export class TradingSystem {
  private userBalances: Map<string, UserBalance> = new Map();
  private userPortfolios: Map<string, UserPortfolio> = new Map();
  private partnerNetworks: Map<string, PartnerNetwork> = new Map();
  private transactions: Transaction[] = [];
  private shareTransactions: ShareTransaction[] = [];
  private partnerCommissions: PartnerCommission[] = [];

  /**
   * Инициализирует пользователя в системе
   */
  initializeUser(userId: string, referrerId?: string): void {
    // Создаем баланс пользователя
    this.userBalances.set(userId, {
      userId,
      usdBalance: 0,
      shareBalance: 0,
      totalValue: 0,
      lastUpdated: new Date()
    });

    // Создаем портфель пользователя
    this.userPortfolios.set(userId, createUserPortfolio(userId));

    // Создаем партнерскую сеть
    const partnerNetwork = {
      userId,
      referrerId: referrerId || null,
      level1Partners: [],
      totalReferrals: 0,
      totalEarnings: 0
    };
    this.partnerNetworks.set(userId, partnerNetwork);

    // Обновляем сеть реферера, если он указан
    if (referrerId) {
      this.updateReferrerNetwork(referrerId, userId);
    }
  }

  /**
   * Обновляет сеть реферера при добавлении нового партнера
   */
  private updateReferrerNetwork(referrerId: string, newPartnerId: string): void {
    const referrerNetwork = this.partnerNetworks.get(referrerId);
    if (!referrerNetwork) {
      console.error(`Referrer network not found: ${referrerId}`);
      return;
    }

    // Добавляем нового партнера в список прямых рефералов
    if (!referrerNetwork.level1Partners.includes(newPartnerId)) {
      referrerNetwork.level1Partners.push(newPartnerId);
      referrerNetwork.totalReferrals++;
      
      console.log(`📈 Updated referrer network: ${referrerId} now has ${referrerNetwork.totalReferrals} referrals`);
    }
  }

  /**
   * Пополняет баланс пользователя
   */
  deposit(userId: string, amount: number): Transaction {
    const validation = validateTransaction('deposit', amount, 'USD');
    if (!validation.isValid) {
      throw new Error(validation.error || 'Ошибка валидации');
    }

    const balance = this.userBalances.get(userId);
    if (!balance) {
      throw new Error('Пользователь не найден');
    }

    // Обновляем баланс
    const updatedBalance: UserBalance = {
      ...balance,
      usdBalance: balance.usdBalance + amount,
      totalValue: (balance.usdBalance + amount) + (balance.shareBalance * SHARE_CONSTANTS.CURRENT_PRICE),
      lastUpdated: new Date()
    };
    this.userBalances.set(userId, updatedBalance);

    // Создаем транзакцию
    const transaction: Transaction = {
      id: generateTransactionId(),
      userId,
      type: 'deposit',
      amount,
      currency: 'USD',
      status: 'completed',
      timestamp: new Date(),
      description: `Пополнение баланса на $${amount}`
    };
    this.transactions.push(transaction);

    return transaction;
  }

  /**
   * Покупает акции
   */
  buyShares(userId: string, shares: number, price: number): {
    order: ShareOrder;
    transaction: Transaction;
    shareTransaction: ShareTransaction;
    commissions: PartnerCommission[];
  } {
    const balance = this.userBalances.get(userId);
    const portfolio = this.userPortfolios.get(userId);
    const partnerNetwork = this.partnerNetworks.get(userId);

    if (!balance || !portfolio || !partnerNetwork) {
      throw new Error('Пользователь не найден');
    }

    // Проверяем, достаточно ли средств
    if (!canAffordPurchase(balance.usdBalance, shares, price)) {
      throw new Error('Недостаточно средств для покупки');
    }

    // Создаем ордер
    const order = createBuyOrder(userId, shares, price);

    // Выполняем ордер
    const { updatedOrder, updatedPortfolio, transaction: shareTransaction } = executeOrder(order, portfolio);

    // Обновляем портфель
    this.userPortfolios.set(userId, updatedPortfolio);

    // Обновляем баланс
    const updatedBalance: UserBalance = {
      ...balance,
      usdBalance: balance.usdBalance - order.totalAmount,
      shareBalance: updatedPortfolio.totalShares,
      totalValue: (balance.usdBalance - order.totalAmount) + (updatedPortfolio.totalShares * SHARE_CONSTANTS.CURRENT_PRICE),
      lastUpdated: new Date()
    };
    this.userBalances.set(userId, updatedBalance);

    // Создаем транзакцию
    const transaction: Transaction = {
      id: generateTransactionId(),
      userId,
      type: 'share_buy',
      amount: order.totalAmount,
      currency: 'USD',
      status: 'completed',
      timestamp: new Date(),
      description: `Покупка ${shares} акций по цене $${price}`,
      referenceId: order.id
    };
    this.transactions.push(transaction);
    this.shareTransactions.push(shareTransaction);

    // Рассчитываем партнерские комиссии
    const commissions = calculatePartnerCommissions(order.totalAmount, userId, partnerNetwork);
    this.partnerCommissions.push(...commissions);

    // Начисляем комиссии партнерам
    this.processPartnerCommissions(commissions);

    return {
      order: updatedOrder,
      transaction,
      shareTransaction,
      commissions
    };
  }

  /**
   * Продает акции
   */
  sellShares(userId: string, shares: number, price: number): {
    order: ShareOrder;
    transaction: Transaction;
    shareTransaction: ShareTransaction;
  } {
    const balance = this.userBalances.get(userId);
    const portfolio = this.userPortfolios.get(userId);

    if (!balance || !portfolio) {
      throw new Error('Пользователь не найден');
    }

    // Проверяем, достаточно ли акций
    if (!canAffordSale(portfolio, shares)) {
      throw new Error('Недостаточно акций для продажи');
    }

    // Создаем ордер
    const order = createSellOrder(userId, shares, price);

    // Выполняем ордер
    const { updatedOrder, updatedPortfolio, transaction: shareTransaction } = executeOrder(order, portfolio);

    // Обновляем портфель
    this.userPortfolios.set(userId, updatedPortfolio);

    // Обновляем баланс
    const updatedBalance: UserBalance = {
      ...balance,
      usdBalance: balance.usdBalance + order.totalAmount,
      shareBalance: updatedPortfolio.totalShares,
      totalValue: (balance.usdBalance + order.totalAmount) + (updatedPortfolio.totalShares * SHARE_CONSTANTS.CURRENT_PRICE),
      lastUpdated: new Date()
    };
    this.userBalances.set(userId, updatedBalance);

    // Создаем транзакцию
    const transaction: Transaction = {
      id: generateTransactionId(),
      userId,
      type: 'share_sell',
      amount: order.totalAmount,
      currency: 'USD',
      status: 'completed',
      timestamp: new Date(),
      description: `Продажа ${shares} акций по цене $${price}`,
      referenceId: order.id
    };
    this.transactions.push(transaction);
    this.shareTransactions.push(shareTransaction);

    return {
      order: updatedOrder,
      transaction,
      shareTransaction
    };
  }

  /**
   * Обрабатывает партнерские комиссии
   */
  private processPartnerCommissions(commissions: PartnerCommission[]): void {
    commissions.forEach(commission => {
      const balance = this.userBalances.get(commission.userId);
      if (balance) {
        // Обновляем баланс партнера
        const updatedBalance: UserBalance = {
          ...balance,
          usdBalance: balance.usdBalance + commission.amount,
          totalValue: (balance.usdBalance + commission.amount) + (balance.shareBalance * SHARE_CONSTANTS.CURRENT_PRICE),
          lastUpdated: new Date()
        };
        this.userBalances.set(commission.userId, updatedBalance);

        // Создаем транзакцию комиссии
        const transaction: Transaction = {
          id: generateTransactionId(),
          userId: commission.userId,
          type: 'partner_commission',
          amount: commission.amount,
          currency: 'USD',
          status: 'completed',
          timestamp: new Date(),
          description: `Партнерская комиссия ${commission.level} уровня: $${commission.amount}`,
          referenceId: commission.transactionId
        };
        this.transactions.push(transaction);

        // Обновляем статистику партнера
        const partnerNetwork = this.partnerNetworks.get(commission.userId);
        if (partnerNetwork) {
          partnerNetwork.totalEarnings += commission.amount;
        }
      }
    });
  }

  /**
   * Получает баланс пользователя
   */
  getUserBalance(userId: string): UserBalance | null {
    return this.userBalances.get(userId) || null;
  }

  /**
   * Получает портфель пользователя
   */
  getUserPortfolio(userId: string): UserPortfolio | null {
    return this.userPortfolios.get(userId) || null;
  }

  /**
   * Получает партнерскую сеть пользователя
   */
  getPartnerNetwork(userId: string): PartnerNetwork | null {
    return this.partnerNetworks.get(userId) || null;
  }

  /**
   * Получает историю транзакций пользователя
   */
  getUserTransactions(userId: string): Transaction[] {
    return this.transactions.filter(t => t.userId === userId);
  }

  /**
   * Получает статистику системы
   */
  getSystemStats() {
    return {
      totalUsers: this.userBalances.size,
      totalTransactions: this.transactions.length,
      totalShareTransactions: this.shareTransactions.length,
      totalCommissions: this.partnerCommissions.length,
      totalVolume: this.transactions
        .filter(t => t.type === 'share_buy' || t.type === 'share_sell')
        .reduce((sum, t) => sum + t.amount, 0)
    };
  }
} 