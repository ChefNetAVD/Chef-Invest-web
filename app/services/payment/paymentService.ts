import { v4 as uuidv4 } from 'uuid';
import { BlockchainService } from '../blockchain/blockchainService';
import { TradingSystem } from '../../utils/tradingSystem';
import { 
  USDTPaymentRequest, 
  NetworkType, 
  PaymentStatus, 
  PaymentValidationResult,
  PaymentStats 
} from '../../types/usdtPayment';
import { PAYMENT_CONSTANTS } from '../../config/blockchain';

export class PaymentService {
  private blockchainService: BlockchainService;
  private tradingSystem: TradingSystem | null = null;
  private paymentRequests: Map<string, USDTPaymentRequest>;
  private processingQueue: Set<string>;

  constructor() {
    this.blockchainService = new BlockchainService();
    this.paymentRequests = new Map();
    this.processingQueue = new Set();
  }

  /**
   * Устанавливает экземпляр TradingSystem для интеграции
   */
  setTradingSystem(tradingSystem: TradingSystem): void {
    this.tradingSystem = tradingSystem;
  }

  /**
   * Проверяет, подключен ли TradingSystem
   */
  private isTradingSystemConnected(): boolean {
    return this.tradingSystem !== null;
  }

  /**
   * Создает новый платежный запрос
   */
  createPaymentRequest(
    userId: string, 
    amount: number, 
    network: NetworkType
  ): USDTPaymentRequest {
    // Валидация суммы
    if (amount < PAYMENT_CONSTANTS.MIN_AMOUNT) {
      throw new Error(`Amount must be at least ${PAYMENT_CONSTANTS.MIN_AMOUNT} USDT`);
    }
    
    if (amount > PAYMENT_CONSTANTS.MAX_AMOUNT) {
      throw new Error(`Amount cannot exceed ${PAYMENT_CONSTANTS.MAX_AMOUNT} USDT`);
    }

    // Проверяем поддержку сети
    if (!this.blockchainService.isNetworkSupported(network)) {
      throw new Error(`Unsupported network: ${network}`);
    }

    const id = uuidv4();
    const walletAddress = this.blockchainService.getWalletAddress(network);
    const requiredConfirmations = this.blockchainService.getMinConfirmations(network);
    const expiresAt = new Date(Date.now() + PAYMENT_CONSTANTS.TIMEOUT);

    const paymentRequest: USDTPaymentRequest = {
      id,
      userId,
      amount,
      network,
      walletAddress,
      expectedAmount: amount,
      status: 'pending',
      createdAt: new Date(),
      expiresAt,
      requiredConfirmations,
      metadata: {
        createdBy: 'payment-service',
        version: '1.0'
      }
    };

    this.paymentRequests.set(id, paymentRequest);
    return paymentRequest;
  }

  /**
   * Получает платежный запрос по ID
   */
  getPaymentRequest(id: string): USDTPaymentRequest | null {
    return this.paymentRequests.get(id) || null;
  }

  /**
   * Получает все платежные запросы пользователя
   */
  getUserPaymentRequests(userId: string): USDTPaymentRequest[] {
    return Array.from(this.paymentRequests.values())
      .filter(request => request.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Получает ожидающие платежи для конкретной сети
   */
  getPendingPaymentsForNetwork(network: NetworkType): USDTPaymentRequest[] {
    return Array.from(this.paymentRequests.values())
      .filter(request => 
        request.network === network && 
        request.status === 'pending' &&
        request.expiresAt > new Date()
      );
  }

  /**
   * Получает все ожидающие платежи
   */
  getAllPendingPayments(): USDTPaymentRequest[] {
    return Array.from(this.paymentRequests.values())
      .filter(request => 
        request.status === 'pending' &&
        request.expiresAt > new Date()
      );
  }

  /**
   * Обновляет статус платежного запроса
   */
  updatePaymentStatus(id: string, status: PaymentStatus, metadata?: Record<string, any>): boolean {
    const request = this.paymentRequests.get(id);
    if (!request) {
      return false;
    }

    request.status = status;
    request.metadata = { ...request.metadata, ...metadata };

    if (status === 'completed' || status === 'failed' || status === 'expired') {
      request.completedAt = new Date();
    }

    return true;
  }

  /**
   * Проверяет и обрабатывает платеж по хешу транзакции
   */
  async processPaymentByHash(txHash: string, network: NetworkType): Promise<PaymentValidationResult> {
    // Ищем ожидающие платежи для этой сети
    const pendingPayments = Array.from(this.paymentRequests.values())
      .filter(request => 
        request.network === network && 
        request.status === 'pending' &&
        request.expiresAt > new Date()
      );

    if (pendingPayments.length === 0) {
      return {
        isValid: false,
        error: 'No pending payments found for this network'
      };
    }

    // Проверяем каждый ожидающий платеж
    for (const payment of pendingPayments) {
      const validation = await this.blockchainService.validatePayment(
        txHash,
        payment.expectedAmount,
        payment.walletAddress,
        network
      );

      if (validation.isValid) {
        // Нашли подходящий платеж
        this.updatePaymentStatus(payment.id, 'confirmed', {
          transactionHash: txHash,
          confirmations: validation.confirmations,
          processedAt: new Date()
        });

        return {
          ...validation,
          metadata: { paymentId: payment.id }
        };
      }
    }

    return {
      isValid: false,
      error: 'No matching payment found for this transaction'
    };
  }

  /**
   * Проверяет все ожидающие платежи
   */
  async checkPendingPayments(): Promise<void> {
    const pendingPayments = this.getAllPendingPayments();

    for (const payment of pendingPayments) {
      if (this.processingQueue.has(payment.id)) {
        continue; // Уже обрабатывается
      }

      this.processingQueue.add(payment.id);

      try {
        await this.checkPaymentStatus(payment.id);
      } catch (error) {
        console.error(`Error checking payment ${payment.id}:`, error);
      } finally {
        this.processingQueue.delete(payment.id);
      }
    }
  }

  /**
   * Проверяет статус конкретного платежа
   */
  private async checkPaymentStatus(paymentId: string): Promise<void> {
    const payment = this.paymentRequests.get(paymentId);
    if (!payment || payment.status !== 'pending') {
      return;
    }

    // Проверяем, не истек ли платеж
    if (payment.expiresAt <= new Date()) {
      this.updatePaymentStatus(paymentId, 'expired');
      return;
    }

    // Получаем последние транзакции для адреса
    try {
      const transactions = await this.blockchainService.getUSDTTokenTransfers(
        payment.walletAddress,
        payment.network,
        10
      );

      // Ищем подходящую транзакцию
      for (const tx of transactions) {
        if (tx.timestamp < payment.createdAt.getTime()) {
          continue; // Транзакция старше платежа
        }

        const amount = parseFloat(tx.value) / Math.pow(10, this.getDecimals(payment.network));
        const tolerance = 0.01;

        if (Math.abs(amount - payment.expectedAmount) <= tolerance) {
          // Нашли подходящую транзакцию
          const validation = await this.blockchainService.validatePayment(
            tx.hash,
            payment.expectedAmount,
            payment.walletAddress,
            payment.network
          );

          if (validation.isValid) {
            this.updatePaymentStatus(paymentId, 'confirmed', {
              transactionHash: tx.hash,
              confirmations: validation.confirmations,
              processedAt: new Date()
            });
          } else if (validation.confirmations && validation.confirmations > 0) {
            // Есть подтверждения, но недостаточно
            this.updatePaymentStatus(paymentId, 'processing', {
              transactionHash: tx.hash,
              confirmations: validation.confirmations
            });
          }
        }
      }
    } catch (error) {
      console.error(`Error checking payment status for ${paymentId}:`, error);
    }
  }

  /**
   * Получает статистику платежей
   */
  getPaymentStats(): PaymentStats {
    const payments = Array.from(this.paymentRequests.values());
    const totalPayments = payments.length;
    const completedPayments = payments.filter(p => p.status === 'completed');
    const totalAmount = completedPayments.reduce((sum, p) => sum + p.amount, 0);
    const successRate = totalPayments > 0 ? (completedPayments.length / totalPayments) * 100 : 0;
    const averageAmount = completedPayments.length > 0 ? totalAmount / completedPayments.length : 0;

    const byNetwork: Record<NetworkType, { count: number; amount: number; successRate: number }> = {
      TRC20: { count: 0, amount: 0, successRate: 0 },
      BEP20: { count: 0, amount: 0, successRate: 0 },
      ERC20: { count: 0, amount: 0, successRate: 0 }
    };

    // Рассчитываем статистику по сетям
    for (const network of ['TRC20', 'BEP20', 'ERC20'] as NetworkType[]) {
      const networkPayments = payments.filter(p => p.network === network);
      const networkCompleted = networkPayments.filter(p => p.status === 'completed');
      
      byNetwork[network] = {
        count: networkPayments.length,
        amount: networkCompleted.reduce((sum, p) => sum + p.amount, 0),
        successRate: networkPayments.length > 0 ? (networkCompleted.length / networkPayments.length) * 100 : 0
      };
    }

    return {
      totalPayments,
      totalAmount,
      successRate,
      averageAmount,
      byNetwork
    };
  }

  /**
   * Очищает истекшие платежи
   */
  cleanupExpiredPayments(): void {
    const now = new Date();
    for (const [id, payment] of this.paymentRequests.entries()) {
      if (payment.status === 'pending' && payment.expiresAt <= now) {
        this.updatePaymentStatus(id, 'expired');
      }
    }
  }

  /**
   * Обрабатывает подтвержденный платеж и начисляет баланс
   */
  async processConfirmedPayment(paymentId: string): Promise<boolean> {
    const payment = this.paymentRequests.get(paymentId);
    if (!payment || payment.status !== 'confirmed') {
      return false;
    }

    try {
      // Проверяем подключение к торговой системе
      if (!this.isTradingSystemConnected()) {
        console.error(`Trading system not connected for payment ${paymentId}`);
        this.updatePaymentStatus(paymentId, 'failed', {
          error: 'Trading system not connected',
          processedAt: new Date()
        });
        return false;
      }

      // Проверяем, что пользователь существует в торговой системе
      const userBalance = this.tradingSystem!.getUserBalance(payment.userId);
      if (!userBalance) {
        console.error(`User ${payment.userId} not found in trading system`);
        this.updatePaymentStatus(paymentId, 'failed', {
          error: 'User not found in trading system',
          processedAt: new Date()
        });
        return false;
      }

      // Начисляем баланс через торговую систему
      const depositTransaction = this.tradingSystem!.deposit(payment.userId, payment.amount);

      // Логируем успешное начисление
      console.log(`✅ SUCCESS: Payment ${paymentId} processed successfully`);
      console.log(`   User: ${payment.userId}`);
      console.log(`   Amount: ${payment.amount} USDT → $${payment.amount} USD`);
      console.log(`   Network: ${payment.network}`);
      console.log(`   Transaction ID: ${depositTransaction.id}`);
      console.log(`   Balance before: $${userBalance.usdBalance}`);
      console.log(`   Balance after: $${userBalance.usdBalance + payment.amount}`);

      // Обновляем статус платежа на завершенный
      this.updatePaymentStatus(paymentId, 'completed', {
        internalTransactionId: depositTransaction.id,
        processedAt: new Date(),
        balanceBefore: userBalance.usdBalance,
        balanceAfter: userBalance.usdBalance + payment.amount,
        success: true
      });

      return true;

    } catch (error) {
      console.error(`❌ ERROR: Failed to process payment ${paymentId}:`, error);
      
      // Отменяем платеж при ошибке
      this.updatePaymentStatus(paymentId, 'failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        processedAt: new Date(),
        success: false
      });
      
      return false;
    }
  }

  /**
   * Автоматически обрабатывает все подтвержденные платежи
   */
  async processAllConfirmedPayments(): Promise<number> {
    const confirmedPayments = Array.from(this.paymentRequests.values())
      .filter(payment => payment.status === 'confirmed');

    let processedCount = 0;
    
    for (const payment of confirmedPayments) {
      const success = await this.processConfirmedPayment(payment.id);
      if (success) {
        processedCount++;
      }
    }

    console.log(`Processed ${processedCount} confirmed payments`);
    return processedCount;
  }

  /**
   * Получает количество десятичных знаков для сети
   */
  private getDecimals(network: NetworkType): number {
    const config = this.blockchainService.getNetworkConfig(network);
    return config.decimals;
  }
} 