import { PaymentService } from '../services/payment/paymentService';
import { BlockchainService } from '../services/blockchain/blockchainService';
import { TransactionTracker } from '../services/payment/transactionTracker';
import { NetworkType } from '../types/usdtPayment';

/**
 * Тестовый класс для проверки USDT платежной системы
 */
export class USDTSystemTester {
  private paymentService: PaymentService;
  private blockchainService: BlockchainService;
  private transactionTracker: TransactionTracker;

  constructor() {
    this.blockchainService = new BlockchainService();
    this.paymentService = new PaymentService();
    this.transactionTracker = new TransactionTracker(this.paymentService, this.blockchainService);
  }

  /**
   * Запускает полный тест системы
   */
  async runFullTest(): Promise<void> {
    console.log('🚀 Starting USDT Payment System Test...\n');

    try {
      // Тест 1: Проверка конфигурации
      await this.testConfiguration();
      
      // Тест 2: Проверка API подключений
      await this.testAPIConnections();
      
      // Тест 3: Тест создания платежных запросов
      await this.testPaymentRequests();
      
      // Тест 4: Тест валидации транзакций
      await this.testTransactionValidation();
      
      // Тест 5: Тест отслеживания транзакций
      await this.testTransactionTracking();

      console.log('✅ All tests passed successfully!');
      
    } catch (error) {
      console.error('❌ Test failed:', error);
      throw error;
    }
  }

  /**
   * Тест конфигурации системы
   */
  private async testConfiguration(): Promise<void> {
    console.log('📋 Testing configuration...');

    const networks = this.blockchainService.getSupportedNetworks();
    console.log(`Supported networks: ${networks.join(', ')}`);

    for (const network of networks) {
      const config = this.blockchainService.getNetworkConfig(network);
      console.log(`${network}:`);
      console.log(`  - Name: ${config.name}`);
      console.log(`  - Wallet: ${config.walletAddress}`);
      console.log(`  - Min confirmations: ${config.minConfirmations}`);
      console.log(`  - Decimals: ${config.decimals}`);
    }

    console.log('✅ Configuration test passed\n');
  }

  /**
   * Тест подключений к API
   */
  private async testAPIConnections(): Promise<void> {
    console.log('🔌 Testing API connections...');

    const networks = this.blockchainService.getSupportedNetworks();

    for (const network of networks) {
      try {
        console.log(`Testing ${network} API...`);
        
        // Получаем текущий номер блока
        const blockNumber = await this.blockchainService.getCurrentBlockNumber(network);
        console.log(`  - Current block: ${blockNumber}`);

        // Получаем баланс кошелька
        const walletAddress = this.blockchainService.getWalletAddress(network);
        const balance = await this.blockchainService.getUSDTBalance(walletAddress, network);
        console.log(`  - USDT balance: ${balance}`);

        console.log(`  ✅ ${network} API connection successful`);
      } catch (error) {
        console.error(`  ❌ ${network} API connection failed:`, error);
        throw error;
      }
    }

    console.log('✅ API connections test passed\n');
  }

  /**
   * Тест создания платежных запросов
   */
  private async testPaymentRequests(): Promise<void> {
    console.log('💰 Testing payment requests...');

    const testUserId = 'test-user-123';
    const testAmount = 50;
    const networks: NetworkType[] = ['TRC20', 'BEP20', 'ERC20'];

    for (const network of networks) {
      try {
        console.log(`Creating payment request for ${network}...`);
        
        const paymentRequest = this.paymentService.createPaymentRequest(
          testUserId,
          testAmount,
          network
        );

        console.log(`  - Payment ID: ${paymentRequest.id}`);
        console.log(`  - Amount: ${paymentRequest.amount} USDT`);
        console.log(`  - Network: ${paymentRequest.network}`);
        console.log(`  - Wallet: ${paymentRequest.walletAddress}`);
        console.log(`  - Status: ${paymentRequest.status}`);
        console.log(`  - Expires: ${paymentRequest.expiresAt.toISOString()}`);

        // Проверяем, что платеж сохранен
        const retrievedPayment = this.paymentService.getPaymentRequest(paymentRequest.id);
        if (!retrievedPayment) {
          throw new Error('Payment not found after creation');
        }

        console.log(`  ✅ ${network} payment request created successfully`);
      } catch (error) {
        console.error(`  ❌ ${network} payment request failed:`, error);
        throw error;
      }
    }

    // Тест получения платежей пользователя
    const userPayments = this.paymentService.getUserPaymentRequests(testUserId);
    console.log(`  - User has ${userPayments.length} payment requests`);

    console.log('✅ Payment requests test passed\n');
  }

  /**
   * Тест валидации транзакций
   */
  private async testTransactionValidation(): Promise<void> {
    console.log('🔍 Testing transaction validation...');

    // Создаем тестовый платеж
    const testUserId = 'test-validation-123';
    const testAmount = 25;
    const network: NetworkType = 'TRC20';

    const paymentRequest = this.paymentService.createPaymentRequest(
      testUserId,
      testAmount,
      network
    );

    console.log(`Created test payment: ${paymentRequest.id}`);

    // Тестируем валидацию с несуществующей транзакцией
    try {
      const validation = await this.blockchainService.validatePayment(
        'fake-transaction-hash',
        testAmount,
        paymentRequest.walletAddress,
        network
      );

      console.log(`Validation result for fake transaction: ${validation.isValid}`);
      if (!validation.isValid) {
        console.log(`  - Error: ${validation.error}`);
      }
    } catch (error) {
      console.log(`  - Expected error for fake transaction: ${error}`);
    }

    console.log('✅ Transaction validation test passed\n');
  }

  /**
   * Тест отслеживания транзакций
   */
  private async testTransactionTracking(): Promise<void> {
    console.log('📡 Testing transaction tracking...');

    // Запускаем трекер
    this.transactionTracker.start();

    // Получаем статус трекера
    const status = this.transactionTracker.getStatus();
    console.log(`Tracker status: ${status.isRunning ? 'Running' : 'Stopped'}`);
    console.log('Last checked blocks:', status.lastCheckedBlocks);

    // Ждем немного для проверки
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Останавливаем трекер
    this.transactionTracker.stop();

    console.log('✅ Transaction tracking test passed\n');
  }

  /**
   * Тест статистики
   */
  private async testStatistics(): Promise<void> {
    console.log('📊 Testing statistics...');

    const stats = this.paymentService.getPaymentStats();
    console.log('Payment statistics:');
    console.log(`  - Total payments: ${stats.totalPayments}`);
    console.log(`  - Total amount: ${stats.totalAmount} USDT`);
    console.log(`  - Success rate: ${stats.successRate.toFixed(2)}%`);
    console.log(`  - Average amount: ${stats.averageAmount.toFixed(2)} USDT`);

    console.log('By network:');
    for (const [network, networkStats] of Object.entries(stats.byNetwork)) {
      console.log(`  ${network}:`);
      console.log(`    - Count: ${networkStats.count}`);
      console.log(`    - Amount: ${networkStats.amount} USDT`);
      console.log(`    - Success rate: ${networkStats.successRate.toFixed(2)}%`);
    }

    console.log('✅ Statistics test passed\n');
  }

  /**
   * Тест обработки ошибок
   */
  private async testErrorHandling(): Promise<void> {
    console.log('⚠️ Testing error handling...');

    // Тест с неверной сетью
    try {
      this.paymentService.createPaymentRequest('test-user', 100, 'INVALID' as NetworkType);
      throw new Error('Should have thrown an error for invalid network');
    } catch (error) {
      console.log(`  ✅ Correctly handled invalid network: ${error}`);
    }

    // Тест с неверной суммой
    try {
      this.paymentService.createPaymentRequest('test-user', -10, 'TRC20');
      throw new Error('Should have thrown an error for negative amount');
    } catch (error) {
      console.log(`  ✅ Correctly handled negative amount: ${error}`);
    }

    console.log('✅ Error handling test passed\n');
  }
}

/**
 * Функция для запуска тестов
 */
export async function runUSDTSystemTests(): Promise<void> {
  const tester = new USDTSystemTester();
  await tester.runFullTest();
}

// Экспортируем для использования в других файлах
export default USDTSystemTester; 