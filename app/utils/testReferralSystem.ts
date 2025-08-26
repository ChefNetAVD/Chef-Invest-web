import { TradingSystem } from './tradingSystem';
import { 
  generateReferralLink, 
  extractReferrerId, 
  validateReferrerId,
  processReferralRegistration,
  getReferralStats,
  getReferralList,
  isActivePartner
} from './referral';

/**
 * Тестовый класс для проверки реферальной системы
 */
export class ReferralSystemTester {
  private tradingSystem: TradingSystem;

  constructor() {
    this.tradingSystem = new TradingSystem();
  }

  /**
   * Запускает полный тест реферальной системы
   */
  async runReferralTest(): Promise<void> {
    console.log('🎯 Starting Referral System Test...\n');

    try {
      // Тест 1: Генерация реферальных ссылок
      await this.testReferralLinkGeneration();
      
      // Тест 2: Извлечение реферера из URL
      await this.testReferrerExtraction();
      
      // Тест 3: Валидация реферальных ID
      await this.testReferrerValidation();
      
      // Тест 4: Регистрация с рефералом
      await this.testReferralRegistration();
      
      // Тест 5: Реферальная статистика
      await this.testReferralStats();
      
      // Тест 6: Полный цикл рефералов
      await this.testFullReferralCycle();

      console.log('✅ All referral system tests passed successfully!');
      
    } catch (error) {
      console.error('❌ Referral system test failed:', error);
      throw error;
    }
  }

  /**
   * Тест генерации реферальных ссылок
   */
  private async testReferralLinkGeneration(): Promise<void> {
    console.log('🔗 Testing referral link generation...');

    const testUserId = 'test-user-123';
    const referralLink = generateReferralLink(testUserId);
    
    console.log(`  - User ID: ${testUserId}`);
    console.log(`  - Generated link: ${referralLink}`);

    // Проверяем формат ссылки
    if (!referralLink.includes('ref=')) {
      throw new Error('Referral link does not contain ref parameter');
    }

    if (!referralLink.includes(testUserId)) {
      throw new Error('Referral link does not contain user ID');
    }

    console.log('✅ Referral link generation test passed\n');
  }

  /**
   * Тест извлечения реферера из URL
   */
  private async testReferrerExtraction(): Promise<void> {
    console.log('🔍 Testing referrer extraction from URL...');

    const testUrl = 'https://chef-invest.com/register?ref=referrer-456&other=param';
    const extractedId = extractReferrerId(testUrl);
    
    console.log(`  - Test URL: ${testUrl}`);
    console.log(`  - Extracted ID: ${extractedId}`);

    if (extractedId !== 'referrer-456') {
      throw new Error(`Expected referrer ID 'referrer-456', got '${extractedId}'`);
    }

    // Тест с URL без реферера
    const noRefUrl = 'https://chef-invest.com/register?other=param';
    const noRefId = extractReferrerId(noRefUrl);
    
    if (noRefId !== null) {
      throw new Error(`Expected null for URL without ref, got '${noRefId}'`);
    }

    console.log('✅ Referrer extraction test passed\n');
  }

  /**
   * Тест валидации реферальных ID
   */
  private async testReferrerValidation(): Promise<void> {
    console.log('✅ Testing referrer validation...');

    // Создаем тестового пользователя
    const referrerId = 'valid-referrer-789';
    this.tradingSystem.initializeUser(referrerId);

    // Тест валидного реферера
    const isValid = validateReferrerId(referrerId, this.tradingSystem);
    console.log(`  - Valid referrer ${referrerId}: ${isValid}`);

    if (!isValid) {
      throw new Error(`Valid referrer ${referrerId} was marked as invalid`);
    }

    // Тест невалидного реферера
    const invalidId = 'invalid-referrer-999';
    const isInvalid = validateReferrerId(invalidId, this.tradingSystem);
    console.log(`  - Invalid referrer ${invalidId}: ${isInvalid}`);

    if (isInvalid) {
      throw new Error(`Invalid referrer ${invalidId} was marked as valid`);
    }

    console.log('✅ Referrer validation test passed\n');
  }

  /**
   * Тест регистрации с рефералом
   */
  private async testReferralRegistration(): Promise<void> {
    console.log('👥 Testing referral registration...');

    const referrerId = 'referrer-reg-123';
    const newUserId = 'new-user-reg-456';

    // Создаем реферера
    this.tradingSystem.initializeUser(referrerId);

    // Регистрируем нового пользователя с реферером
    const success = processReferralRegistration(newUserId, referrerId, this.tradingSystem);
    console.log(`  - Registration success: ${success}`);

    if (!success) {
      throw new Error('Referral registration failed');
    }

    // Проверяем, что новый пользователь создан
    const newUserBalance = this.tradingSystem.getUserBalance(newUserId);
    if (!newUserBalance) {
      throw new Error('New user was not created');
    }

    // Проверяем, что реферер обновлен
    const referrerNetwork = this.tradingSystem.getPartnerNetwork(referrerId);
    if (!referrerNetwork) {
      throw new Error('Referrer network not found');
    }

    console.log(`  - Referrer total referrals: ${referrerNetwork.totalReferrals}`);
    console.log(`  - Referrer level1 partners: ${referrerNetwork.level1Partners.length}`);

    if (referrerNetwork.totalReferrals !== 1) {
      throw new Error(`Expected 1 referral, got ${referrerNetwork.totalReferrals}`);
    }

    if (!referrerNetwork.level1Partners.includes(newUserId)) {
      throw new Error('New user not found in referrer level1 partners');
    }

    console.log('✅ Referral registration test passed\n');
  }

  /**
   * Тест реферальной статистики
   */
  private async testReferralStats(): Promise<void> {
    console.log('📊 Testing referral statistics...');

    const referrerId = 'stats-referrer-123';
    const partnerId = 'stats-partner-456';

    // Создаем реферера и партнера
    this.tradingSystem.initializeUser(referrerId);
    processReferralRegistration(partnerId, referrerId, this.tradingSystem);

    // Симулируем покупку акций партнером (для комиссий)
    this.tradingSystem.buyShares(partnerId, 1000, 0.10); // $100 покупка

    // Получаем статистику реферера
    const stats = getReferralStats(referrerId, this.tradingSystem);
    console.log(`  - Referrer stats:`, stats);

    if (!stats) {
      throw new Error('Referral stats not found');
    }

    // Проверяем статистику
    if (stats.totalReferrals !== 1) {
      throw new Error(`Expected 1 referral, got ${stats.totalReferrals}`);
    }

    if (stats.totalPartners !== 1) {
      throw new Error(`Expected 1 partner, got ${stats.totalPartners}`);
    }

    if (stats.totalEarnings < 10) { // 10% от $100 = $10
      throw new Error(`Expected earnings >= $10, got $${stats.totalEarnings}`);
    }

    if (!stats.referralLink.includes(referrerId)) {
      throw new Error('Referral link does not contain referrer ID');
    }

    console.log('✅ Referral statistics test passed\n');
  }

  /**
   * Тест полного цикла рефералов
   */
  private async testFullReferralCycle(): Promise<void> {
    console.log('🔄 Testing full referral cycle...');

    // 1. Создаем реферера
    const referrerId = 'cycle-referrer-123';
    this.tradingSystem.initializeUser(referrerId);
    console.log(`  - Created referrer: ${referrerId}`);

    // 2. Генерируем реферальную ссылку
    const referralLink = generateReferralLink(referrerId);
    console.log(`  - Generated link: ${referralLink}`);

    // 3. Извлекаем реферера из ссылки
    const extractedId = extractReferrerId(referralLink);
    console.log(`  - Extracted ID: ${extractedId}`);

    if (extractedId !== referrerId) {
      throw new Error(`Extracted ID mismatch: expected ${referrerId}, got ${extractedId}`);
    }

    // 4. Валидируем реферера
    const isValid = validateReferrerId(extractedId, this.tradingSystem);
    console.log(`  - Validated referrer: ${isValid}`);

    if (!isValid) {
      throw new Error('Referrer validation failed');
    }

    // 5. Регистрируем партнера
    const partnerId = 'cycle-partner-456';
    const success = processReferralRegistration(partnerId, referrerId, this.tradingSystem);
    console.log(`  - Partner registration: ${success}`);

    if (!success) {
      throw new Error('Partner registration failed');
    }

    // 6. Партнер покупает акции
    this.tradingSystem.buyShares(partnerId, 500, 0.10); // $50 покупка
    console.log(`  - Partner bought shares for $50`);

    // 7. Проверяем комиссии реферера
    const referrerBalance = this.tradingSystem.getUserBalance(referrerId);
    const referrerStats = getReferralStats(referrerId, this.tradingSystem);
    
    console.log(`  - Referrer balance: $${referrerBalance?.usdBalance}`);
    console.log(`  - Referrer earnings: $${referrerStats?.totalEarnings}`);

    if (referrerStats?.totalEarnings < 5) { // 10% от $50 = $5
      throw new Error(`Expected earnings >= $5, got $${referrerStats?.totalEarnings}`);
    }

    // 8. Проверяем активность партнера
    const isActive = isActivePartner(referrerId, this.tradingSystem);
    console.log(`  - Referrer is active: ${isActive}`);

    if (!isActive) {
      throw new Error('Referrer should be active');
    }

    console.log('✅ Full referral cycle test passed\n');
  }
}

/**
 * Функция для запуска тестов реферальной системы
 */
export async function runReferralSystemTests(): Promise<void> {
  const tester = new ReferralSystemTester();
  await tester.runReferralTest();
}

// Экспортируем для использования в других файлах
export default ReferralSystemTester; 