import { PaymentService } from '../services/payment/paymentService';
import { TradingSystem } from './tradingSystem';
import { TransactionTracker } from '../services/payment/transactionTracker';
import { BlockchainService } from '../services/blockchain/blockchainService';
import { NetworkType } from '../types/usdtPayment';

/**
 * Тестовый класс для проверки мониторинга пополнений
 */
export class MonitoringTester {
  private tradingSystem: TradingSystem;
  private paymentService: PaymentService;
  private blockchainService: BlockchainService;
  private transactionTracker: TransactionTracker;

  constructor() {
    this.tradingSystem = new TradingSystem();
    this.paymentService = new PaymentService();
    this.blockchainService = new BlockchainService();
    this.paymentService.setTradingSystem(this.tradingSystem);
    this.transactionTracker = new TransactionTracker(this.paymentService, this.blockchainService);
  }

  /**
   * Запускает полный тест мониторинга
   */
  async runMonitoringTest(): Promise<void> {
    console.log('🔍 Starting Monitoring Test...\n');

    try {
      // Тест 1: Проверка создания платежей
      await this.testPaymentCreation();
      
      // Тест 2: Проверка получения pending платежей
      await this.testPendingPaymentsRetrieval();
      
      // Тест 3: Проверка мониторинга по сетям
      await this.testNetworkMonitoring();
      
      // Тест 4: Симуляция полного цикла
      await this.testFullMonitoringCycle();

      console.log('✅ All monitoring tests passed successfully!');
      
    } catch (error) {
      console.error('❌ Monitoring test failed:', error);
      throw error;
    }
  }

  /**
   * Тест создания платежей
   */
  private async testPaymentCreation(): Promise<void> {
    console.log('💰 Testing payment creation...');

    const testUserId = 'test-monitoring-user-123';
    
    // Инициализируем пользователя
    this.tradingSystem.initializeUser(testUserId);

    // Создаем платежи для разных сетей
    const payments = [
      this.paymentService.createPaymentRequest(testUserId, 50, 'TRC20'),
      this.paymentService.createPaymentRequest(testUserId, 75, 'BEP20'),
      this.paymentService.createPaymentRequest(testUserId, 100, 'ERC20')
    ];

    console.log(`  - Created ${payments.length} payments`);
    
    for (const payment of payments) {
      console.log(`    ${payment.network}: ${payment.amount} USDT (${payment.id})`);
    }

    // Проверяем, что платежи сохранены
    const userPayments = this.paymentService.getUserPaymentRequests(testUserId);
    if (userPayments.length !== payments.length) {
      throw new Error(`Expected ${payments.length} payments, got ${userPayments.length}`);
    }

    console.log('✅ Payment creation test passed\n');
  }

  /**
   * Тест получения pending платежей
   */
  private async testPendingPaymentsRetrieval(): Promise<void> {
    console.log('📋 Testing pending payments retrieval...');

    // Проверяем pending платежи по сетям
    const trc20Pending = this.paymentService.getPendingPaymentsForNetwork('TRC20');
    const bep20Pending = this.paymentService.getPendingPaymentsForNetwork('BEP20');
    const erc20Pending = this.paymentService.getPendingPaymentsForNetwork('ERC20');
    const allPending = this.paymentService.getAllPendingPayments();

    console.log(`  - TRC20 pending: ${trc20Pending.length}`);
    console.log(`  - BEP20 pending: ${bep20Pending.length}`);
    console.log(`  - ERC20 pending: ${erc20Pending.length}`);
    console.log(`  - Total pending: ${allPending.length}`);

    // Проверяем, что все pending платежи найдены
    if (allPending.length !== 3) {
      throw new Error(`Expected 3 pending payments, got ${allPending.length}`);
    }

    // Проверяем, что каждый сеть имеет по одному pending платежу
    if (trc20Pending.length !== 1 || bep20Pending.length !== 1 || erc20Pending.length !== 1) {
      throw new Error('Each network should have exactly 1 pending payment');
    }

    console.log('✅ Pending payments retrieval test passed\n');
  }

  /**
   * Тест мониторинга по сетям
   */
  private async testNetworkMonitoring(): Promise<void> {
    console.log('🌐 Testing network monitoring...');

    const networks: NetworkType[] = ['TRC20', 'BEP20', 'ERC20'];

    for (const network of networks) {
      console.log(`  Testing ${network} monitoring...`);
      
      // Получаем pending платежи для сети
      const pendingPayments = this.paymentService.getPendingPaymentsForNetwork(network);
      
      if (pendingPayments.length === 0) {
        throw new Error(`No pending payments found for ${network}`);
      }

      const payment = pendingPayments[0];
      console.log(`    - Found pending payment: ${payment.id}`);
      console.log(`    - Amount: ${payment.amount} USDT`);
      console.log(`    - Wallet: ${payment.walletAddress}`);
      console.log(`    - Status: ${payment.status}`);
      console.log(`    - Expires: ${payment.expiresAt.toISOString()}`);

      // Проверяем, что платеж не истек
      if (payment.expiresAt <= new Date()) {
        throw new Error(`Payment ${payment.id} has expired`);
      }
    }

    console.log('✅ Network monitoring test passed\n');
  }

  /**
   * Тест полного цикла мониторинга
   */
  private async testFullMonitoringCycle(): Promise<void> {
    console.log('🔄 Testing full monitoring cycle...');

    const testUserId = 'test-full-cycle-456';
    
    // Инициализируем пользователя
    this.tradingSystem.initializeUser(testUserId);
    const initialBalance = this.tradingSystem.getUserBalance(testUserId);

    // Создаем платеж
    const payment = this.paymentService.createPaymentRequest(testUserId, 25, 'TRC20');
    console.log(`  - Created payment: ${payment.id}`);

    // Проверяем, что платеж в pending
    const pendingPayments = this.paymentService.getPendingPaymentsForNetwork('TRC20');
    if (pendingPayments.length === 0) {
      throw new Error('Payment not found in pending payments');
    }

    console.log(`  - Payment found in pending: ${pendingPayments[0].id}`);

    // Симулируем подтверждение платежа
    this.paymentService.updatePaymentStatus(payment.id, 'confirmed', {
      transactionHash: 'test-monitoring-tx-123',
      confirmations: 15
    });

    console.log(`  - Payment status updated to confirmed`);

    // Обрабатываем подтвержденный платеж
    const success = await this.paymentService.processConfirmedPayment(payment.id);
    if (!success) {
      throw new Error('Failed to process confirmed payment');
    }

    console.log(`  - Payment processed successfully`);

    // Проверяем, что баланс увеличился
    const finalBalance = this.tradingSystem.getUserBalance(testUserId);
    const balanceIncrease = (finalBalance?.usdBalance || 0) - (initialBalance?.usdBalance || 0);

    console.log(`  - Balance increase: $${balanceIncrease}`);
    console.log(`  - Expected: $25`);

    if (balanceIncrease !== 25) {
      throw new Error(`Expected balance increase of $25, got $${balanceIncrease}`);
    }

    // Проверяем, что платеж завершен
    const completedPayment = this.paymentService.getPaymentRequest(payment.id);
    if (completedPayment?.status !== 'completed') {
      throw new Error(`Payment status should be completed, got ${completedPayment?.status}`);
    }

    console.log('✅ Full monitoring cycle test passed\n');
  }

  /**
   * Тест статуса мониторинга
   */
  async testMonitoringStatus(): Promise<void> {
    console.log('📊 Testing monitoring status...');

    // Получаем статус трекера
    const status = this.transactionTracker.getStatus();
    
    console.log(`  - Is running: ${status.isRunning}`);
    console.log(`  - Last checked blocks:`, status.lastCheckedBlocks);

    // Запускаем трекер
    this.transactionTracker.start();
    
    // Ждем немного
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Получаем обновленный статус
    const updatedStatus = this.transactionTracker.getStatus();
    console.log(`  - After start - Is running: ${updatedStatus.isRunning}`);
    
    // Останавливаем трекер
    this.transactionTracker.stop();
    
    const finalStatus = this.transactionTracker.getStatus();
    console.log(`  - After stop - Is running: ${finalStatus.isRunning}`);

    console.log('✅ Monitoring status test passed\n');
  }

  /**
   * Тест обработки ошибок мониторинга
   */
  async testMonitoringErrorHandling(): Promise<void> {
    console.log('⚠️ Testing monitoring error handling...');

    // Создаем платеж для несуществующего пользователя
    const payment = this.paymentService.createPaymentRequest('non-existent-user', 10, 'TRC20');
    
    // Симулируем подтверждение
    this.paymentService.updatePaymentStatus(payment.id, 'confirmed');
    
    // Пытаемся обработать (должно быть ошибка)
    const success = await this.paymentService.processConfirmedPayment(payment.id);
    
    if (success) {
      throw new Error('Payment should not be processed for non-existent user');
    }

    // Проверяем, что статус изменился на 'failed'
    const failedPayment = this.paymentService.getPaymentRequest(payment.id);
    if (failedPayment?.status !== 'failed') {
      throw new Error('Payment status should be failed for non-existent user');
    }

    console.log('✅ Monitoring error handling test passed\n');
  }
}

/**
 * Функция для запуска тестов мониторинга
 */
export async function runMonitoringTests(): Promise<void> {
  const tester = new MonitoringTester();
  await tester.runMonitoringTest();
  await tester.testMonitoringStatus();
  await tester.testMonitoringErrorHandling();
}

// Экспортируем для использования в других файлах
export default MonitoringTester; 