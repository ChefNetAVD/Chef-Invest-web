import { PaymentService } from '../services/payment/paymentService';
import { TradingSystem } from './tradingSystem';
import { TransactionTracker } from '../services/payment/transactionTracker';
import { BlockchainService } from '../services/blockchain/blockchainService';
import { NetworkType } from '../types/usdtPayment';

/**
 * Тестовый класс для проверки интеграции USDT платежей с TradingSystem
 */
export class USDTIntegrationTester {
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
   * Запускает полный тест интеграции
   */
  async runIntegrationTest(): Promise<void> {
    console.log('🚀 Starting USDT Integration Test...\n');

    try {
      // Тест 1: Проверка подключения TradingSystem
      await this.testTradingSystemConnection();
      
      // Тест 2: Инициализация пользователя
      await this.testUserInitialization();
      
      // Тест 3: Создание USDT платежа
      await this.testUSDTPaymentCreation();
      
      // Тест 4: Симуляция подтверждения платежа
      await this.testPaymentConfirmation();
      
      // Тест 5: Проверка начисления баланса
      await this.testBalanceDeposit();
      
      // Тест 6: Проверка обработки ошибок
      await this.testErrorHandling();

      console.log('✅ All integration tests passed successfully!');
      
    } catch (error) {
      console.error('❌ Integration test failed:', error);
      throw error;
    }
  }

  /**
   * Тест подключения TradingSystem
   */
  private async testTradingSystemConnection(): Promise<void> {
    console.log('🔗 Testing TradingSystem connection...');

    // Проверяем, что PaymentService подключен к TradingSystem
    const payment = this.paymentService.createPaymentRequest('test-user', 50, 'TRC20');
    
    // Симулируем подтверждение
    this.paymentService.updatePaymentStatus(payment.id, 'confirmed');
    
    // Пытаемся обработать без инициализации пользователя (должно быть ошибка)
    const result = await this.paymentService.processConfirmedPayment(payment.id);
    
    if (result) {
      throw new Error('Payment should not be processed without user initialization');
    }

    console.log('✅ TradingSystem connection test passed\n');
  }

  /**
   * Тест инициализации пользователя
   */
  private async testUserInitialization(): Promise<void> {
    console.log('👤 Testing user initialization...');

    const testUserId = 'test-user-integration-123';
    
    // Инициализируем пользователя в торговой системе
    this.tradingSystem.initializeUser(testUserId);
    
    // Проверяем, что пользователь создан
    const balance = this.tradingSystem.getUserBalance(testUserId);
    if (!balance) {
      throw new Error('User not initialized properly');
    }

    console.log(`  - User ${testUserId} initialized`);
    console.log(`  - Initial balance: $${balance.usdBalance}`);
    console.log(`  - Share balance: ${balance.shareBalance}`);
    
    console.log('✅ User initialization test passed\n');
  }

  /**
   * Тест создания USDT платежа
   */
  private async testUSDTPaymentCreation(): Promise<void> {
    console.log('💰 Testing USDT payment creation...');

    const testUserId = 'test-user-integration-123';
    const testAmount = 100;
    const network: NetworkType = 'TRC20';

    // Создаем платежный запрос
    const paymentRequest = this.paymentService.createPaymentRequest(
      testUserId,
      testAmount,
      network
    );

    console.log(`  - Payment ID: ${paymentRequest.id}`);
    console.log(`  - Amount: ${paymentRequest.amount} USDT`);
    console.log(`  - Network: ${paymentRequest.network}`);
    console.log(`  - Status: ${paymentRequest.status}`);
    console.log(`  - Wallet: ${paymentRequest.walletAddress}`);

    // Проверяем, что платеж сохранен
    const retrievedPayment = this.paymentService.getPaymentRequest(paymentRequest.id);
    if (!retrievedPayment) {
      throw new Error('Payment not found after creation');
    }

    console.log('✅ USDT payment creation test passed\n');
  }

  /**
   * Тест симуляции подтверждения платежа
   */
  private async testPaymentConfirmation(): Promise<void> {
    console.log('✅ Testing payment confirmation simulation...');

    const testUserId = 'test-user-integration-123';
    const payments = this.paymentService.getUserPaymentRequests(testUserId);
    
    if (payments.length === 0) {
      throw new Error('No payments found for testing');
    }

    const payment = payments[0];
    
    // Симулируем подтверждение платежа
    this.paymentService.updatePaymentStatus(payment.id, 'confirmed', {
      transactionHash: 'test-tx-hash-123',
      confirmations: 15,
      simulatedAt: new Date()
    });

    console.log(`  - Payment ${payment.id} marked as confirmed`);
    console.log(`  - Transaction hash: test-tx-hash-123`);
    console.log(`  - Confirmations: 15`);

    // Проверяем статус
    const updatedPayment = this.paymentService.getPaymentRequest(payment.id);
    if (updatedPayment?.status !== 'confirmed') {
      throw new Error('Payment status not updated to confirmed');
    }

    console.log('✅ Payment confirmation test passed\n');
  }

  /**
   * Тест начисления баланса
   */
  private async testBalanceDeposit(): Promise<void> {
    console.log('💳 Testing balance deposit...');

    const testUserId = 'test-user-integration-123';
    
    // Получаем баланс до начисления
    const balanceBefore = this.tradingSystem.getUserBalance(testUserId);
    if (!balanceBefore) {
      throw new Error('User balance not found');
    }

    console.log(`  - Balance before: $${balanceBefore.usdBalance}`);

    // Обрабатываем подтвержденные платежи
    const processedCount = await this.paymentService.processAllConfirmedPayments();
    console.log(`  - Processed ${processedCount} confirmed payments`);

    // Получаем баланс после начисления
    const balanceAfter = this.tradingSystem.getUserBalance(testUserId);
    if (!balanceAfter) {
      throw new Error('User balance not found after processing');
    }

    console.log(`  - Balance after: $${balanceAfter.usdBalance}`);
    console.log(`  - Balance increase: $${balanceAfter.usdBalance - balanceBefore.usdBalance}`);

    // Проверяем, что баланс увеличился
    if (balanceAfter.usdBalance <= balanceBefore.usdBalance) {
      throw new Error('Balance did not increase after payment processing');
    }

    console.log('✅ Balance deposit test passed\n');
  }

  /**
   * Тест обработки ошибок
   */
  private async testErrorHandling(): Promise<void> {
    console.log('⚠️ Testing error handling...');

    // Создаем платеж для несуществующего пользователя
    const payment = this.paymentService.createPaymentRequest('non-existent-user', 50, 'TRC20');
    
    // Симулируем подтверждение
    this.paymentService.updatePaymentStatus(payment.id, 'confirmed');
    
    // Пытаемся обработать (должно быть ошибка)
    const result = await this.paymentService.processConfirmedPayment(payment.id);
    
    if (result) {
      throw new Error('Payment should not be processed for non-existent user');
    }

    // Проверяем, что статус изменился на 'failed'
    const failedPayment = this.paymentService.getPaymentRequest(payment.id);
    if (failedPayment?.status !== 'failed') {
      throw new Error('Payment status should be failed for non-existent user');
    }

    console.log('✅ Error handling test passed\n');
  }

  /**
   * Тест полного цикла
   */
  async testFullCycle(): Promise<void> {
    console.log('🔄 Testing full USDT payment cycle...\n');

    const testUserId = 'test-user-full-cycle-456';
    const testAmount = 50;
    const network: NetworkType = 'BEP20';

    // 1. Инициализируем пользователя
    this.tradingSystem.initializeUser(testUserId);
    const initialBalance = this.tradingSystem.getUserBalance(testUserId);
    console.log(`Initial balance: $${initialBalance?.usdBalance}`);

    // 2. Создаем платеж
    const payment = this.paymentService.createPaymentRequest(testUserId, testAmount, network);
    console.log(`Created payment: ${payment.id}`);

    // 3. Симулируем подтверждение
    this.paymentService.updatePaymentStatus(payment.id, 'confirmed', {
      transactionHash: 'full-cycle-tx-123',
      confirmations: 20
    });

    // 4. Обрабатываем платеж
    const success = await this.paymentService.processConfirmedPayment(payment.id);
    console.log(`Payment processed: ${success}`);

    // 5. Проверяем результат
    const finalBalance = this.tradingSystem.getUserBalance(testUserId);
    const transactions = this.tradingSystem.getUserTransactions(testUserId);
    
    console.log(`Final balance: $${finalBalance?.usdBalance}`);
    console.log(`Total transactions: ${transactions.length}`);
    console.log(`Balance increase: $${(finalBalance?.usdBalance || 0) - (initialBalance?.usdBalance || 0)}`);

    if ((finalBalance?.usdBalance || 0) !== (initialBalance?.usdBalance || 0) + testAmount) {
      throw new Error('Full cycle test failed - incorrect balance');
    }

    console.log('✅ Full cycle test passed!\n');
  }
}

/**
 * Функция для запуска тестов интеграции
 */
export async function runUSDTIntegrationTests(): Promise<void> {
  const tester = new USDTIntegrationTester();
  await tester.runIntegrationTest();
  await tester.testFullCycle();
}

// Экспортируем для использования в других файлах
export default USDTIntegrationTester; 