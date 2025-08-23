import { PaymentService } from './paymentService';
import { BlockchainService } from '../blockchain/blockchainService';
import { NetworkType, USDTPaymentRequest } from '../../types/usdtPayment';
import { PAYMENT_CONSTANTS } from '../../config/blockchain';

export class TransactionTracker {
  private paymentService: PaymentService;
  private blockchainService: BlockchainService;
  private isRunning: boolean = false;
  private checkInterval: NodeJS.Timeout | null = null;
  private lastCheckedBlocks: Map<NetworkType, number>;

  constructor(paymentService: PaymentService, blockchainService: BlockchainService) {
    this.paymentService = paymentService;
    this.blockchainService = blockchainService;
    this.lastCheckedBlocks = new Map();
  }

  /**
   * Запускает отслеживание транзакций
   */
  start(): void {
    if (this.isRunning) {
      console.log('Transaction tracker is already running');
      return;
    }

    this.isRunning = true;
    console.log('Starting transaction tracker...');

    // Инициализируем последние проверенные блоки
    this.initializeLastCheckedBlocks();

    // Запускаем периодическую проверку
    this.checkInterval = setInterval(() => {
      this.checkNewTransactions();
    }, PAYMENT_CONSTANTS.CHECK_INTERVAL);

    console.log('Transaction tracker started successfully');
  }

  /**
   * Останавливает отслеживание транзакций
   */
  stop(): void {
    if (!this.isRunning) {
      console.log('Transaction tracker is not running');
      return;
    }

    this.isRunning = false;
    
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }

    console.log('Transaction tracker stopped');
  }

  /**
   * Инициализирует последние проверенные блоки для каждой сети
   */
  private async initializeLastCheckedBlocks(): Promise<void> {
    const networks = this.blockchainService.getSupportedNetworks();
    
    for (const network of networks) {
      try {
        const currentBlock = await this.blockchainService.getCurrentBlockNumber(network);
        this.lastCheckedBlocks.set(network, currentBlock);
        console.log(`Initialized ${network} last checked block: ${currentBlock}`);
      } catch (error) {
        console.error(`Error initializing last checked block for ${network}:`, error);
        this.lastCheckedBlocks.set(network, 0);
      }
    }
  }

  /**
   * Проверяет новые транзакции для всех сетей
   */
  private async checkNewTransactions(): Promise<void> {
    const networks = this.blockchainService.getSupportedNetworks();
    
    for (const network of networks) {
      try {
        await this.checkNetworkTransactions(network);
      } catch (error) {
        console.error(`Error checking transactions for ${network}:`, error);
      }
    }

    // Очищаем истекшие платежи
    this.paymentService.cleanupExpiredPayments();
  }

  /**
   * Проверяет новые транзакции для конкретной сети
   */
  private async checkNetworkTransactions(network: NetworkType): Promise<void> {
    const lastCheckedBlock = this.lastCheckedBlocks.get(network) || 0;
    const currentBlock = await this.blockchainService.getCurrentBlockNumber(network);
    
    if (currentBlock <= lastCheckedBlock) {
      return; // Нет новых блоков
    }

    console.log(`Checking ${network} transactions from block ${lastCheckedBlock + 1} to ${currentBlock}`);

    // Получаем адрес кошелька для этой сети
    const walletAddress = this.blockchainService.getWalletAddress(network);
    
    // Получаем новые транзакции
    const transactions = await this.blockchainService.getUSDTTokenTransfers(
      walletAddress,
      network,
      50 // Проверяем последние 50 транзакций
    );

    // Фильтруем только новые транзакции
    const newTransactions = transactions.filter(tx => 
      tx.blockNumber > lastCheckedBlock && 
      tx.status === 'success'
    );

    console.log(`Found ${newTransactions.length} new transactions for ${network}`);

    // Обрабатываем каждую новую транзакцию
    for (const transaction of newTransactions) {
      await this.processNewTransaction(transaction, network);
    }

    // Обновляем последний проверенный блок
    this.lastCheckedBlocks.set(network, currentBlock);
  }

  /**
   * Обрабатывает новую транзакцию
   */
  private async processNewTransaction(transaction: any, network: NetworkType): Promise<void> {
    try {
      console.log(`Processing transaction ${transaction.hash} on ${network}`);

      // Ищем подходящий платежный запрос
      const pendingPayments = this.getPendingPaymentsForNetwork(network);
      
      for (const payment of pendingPayments) {
        const amount = parseFloat(transaction.value) / Math.pow(10, this.getDecimals(network));
        const tolerance = 0.01;

        // Проверяем, подходит ли сумма
        if (Math.abs(amount - payment.expectedAmount) <= tolerance) {
          console.log(`Found matching payment ${payment.id} for transaction ${transaction.hash}`);

          // Валидируем платеж
          const validation = await this.blockchainService.validatePayment(
            transaction.hash,
            payment.expectedAmount,
            payment.walletAddress,
            network
          );

          if (validation.isValid) {
            // Платеж подтвержден
            this.paymentService.updatePaymentStatus(payment.id, 'confirmed', {
              transactionHash: transaction.hash,
              confirmations: validation.confirmations,
              processedAt: new Date(),
              blockNumber: transaction.blockNumber
            });

            console.log(`Payment ${payment.id} confirmed with ${validation.confirmations} confirmations`);
            
            // Уведомляем систему о завершении платежа
            await this.onPaymentConfirmed(payment, validation);
          } else if (validation.confirmations && validation.confirmations > 0) {
            // Есть подтверждения, но недостаточно
            this.paymentService.updatePaymentStatus(payment.id, 'processing', {
              transactionHash: transaction.hash,
              confirmations: validation.confirmations,
              blockNumber: transaction.blockNumber
            });

            console.log(`Payment ${payment.id} processing with ${validation.confirmations} confirmations`);
          }
        }
      }
    } catch (error) {
      console.error(`Error processing transaction ${transaction.hash}:`, error);
    }
  }

  /**
   * Получает ожидающие платежи для конкретной сети
   */
  private getPendingPaymentsForNetwork(network: NetworkType): USDTPaymentRequest[] {
    // Здесь нужно получить доступ к pending платежам из PaymentService
    // Пока возвращаем пустой массив, в реальной реализации нужно добавить метод
    return [];
  }

  /**
   * Обработчик подтверждения платежа
   */
  private async onPaymentConfirmed(payment: USDTPaymentRequest, validation: any): Promise<void> {
    try {
      // Здесь можно добавить логику для:
      // - Начисления средств пользователю
      // - Отправки уведомлений
      // - Логирования
      // - Интеграции с торговой системой
      
      console.log(`Payment ${payment.id} completed successfully`);
      
      // Обновляем статус на завершенный
      this.paymentService.updatePaymentStatus(payment.id, 'completed', {
        confirmedAt: new Date(),
        finalConfirmations: validation.confirmations
      });

    } catch (error) {
      console.error(`Error processing confirmed payment ${payment.id}:`, error);
    }
  }

  /**
   * Получает количество десятичных знаков для сети
   */
  private getDecimals(network: NetworkType): number {
    const config = this.blockchainService.getNetworkConfig(network);
    return config.decimals;
  }

  /**
   * Получает статус отслеживания
   */
  getStatus(): { isRunning: boolean; lastCheckedBlocks: Record<string, number> } {
    const lastCheckedBlocks: Record<string, number> = {};
    
    for (const [network, block] of this.lastCheckedBlocks.entries()) {
      lastCheckedBlocks[network] = block;
    }

    return {
      isRunning: this.isRunning,
      lastCheckedBlocks
    };
  }

  /**
   * Принудительно проверяет все ожидающие платежи
   */
  async forceCheck(): Promise<void> {
    console.log('Force checking all pending payments...');
    await this.paymentService.checkPendingPayments();
  }
} 