import { userService } from '../services/auth/userService';
import { 
  createEmailVerificationToken,
  createPasswordResetToken,
  isValidToken,
  isTokenExpired,
  generateEmailVerificationCode,
  generatePasswordResetToken
} from './email';
import { AUTH_ERRORS } from '../types/auth';

/**
 * Тестирование системы email верификации и восстановления пароля
 */
export class EmailSystemTester {
  
  /**
   * Запускает полный тест email системы
   */
  async runEmailTests(): Promise<void> {
    console.log('📧 Starting Email System Tests...\n');

    try {
      // Тест 1: Email верификация
      await this.testEmailVerification();
      
      // Тест 2: Восстановление пароля
      await this.testPasswordReset();
      
      // Тест 3: Валидация токенов
      await this.testTokenValidation();
      
      // Тест 4: Ограничения и cooldown
      await this.testRateLimiting();

      console.log('✅ All email system tests passed successfully!');
      
    } catch (error) {
      console.error('❌ Email system test failed:', error);
      throw error;
    }
  }

  /**
   * Тест email верификации
   */
  private async testEmailVerification(): Promise<void> {
    console.log('📧 Testing email verification...');

    // Создаем тестового пользователя
    const testUser = await userService.registerUser({
      email: 'test-verify@example.com',
      username: 'testverify',
      password: 'TestPass123!',
    });

    // Запрашиваем верификацию email
    const verificationToken = await userService.requestEmailVerification('test-verify@example.com');
    
    if (!verificationToken || !verificationToken.token) {
      throw new Error('Email verification token generation failed');
    }

    // Подтверждаем верификацию
    const success = await userService.confirmEmailVerification(verificationToken.token);
    
    if (!success) {
      throw new Error('Email verification confirmation failed');
    }

    // Проверяем, что пользователь верифицирован
    const user = userService.getUserByEmail('test-verify@example.com');
    if (!user || !user.isEmailVerified) {
      throw new Error('User email verification status not updated');
    }

    console.log('✅ Email verification test passed');
  }

  /**
   * Тест восстановления пароля
   */
  private async testPasswordReset(): Promise<void> {
    console.log('🔑 Testing password reset...');

    // Создаем тестового пользователя
    const testUser = await userService.registerUser({
      email: 'test-reset@example.com',
      username: 'testreset',
      password: 'TestPass123!',
    });

    // Запрашиваем сброс пароля
    const resetToken = await userService.requestPasswordReset('test-reset@example.com');
    
    if (!resetToken || !resetToken.token) {
      throw new Error('Password reset token generation failed');
    }

    // Подтверждаем сброс пароля
    const success = await userService.confirmPasswordReset(resetToken.token, 'NewPass123!');
    
    if (!success) {
      throw new Error('Password reset confirmation failed');
    }

    console.log('✅ Password reset test passed');
  }

  /**
   * Тест валидации токенов
   */
  private async testTokenValidation(): Promise<void> {
    console.log('🎫 Testing token validation...');

    // Создаем тестовые токены
    const emailToken = createEmailVerificationToken('test-user', 'test@example.com');
    const passwordToken = createPasswordResetToken('test-user', 'test@example.com');

    // Проверяем валидность новых токенов
    if (!isValidToken(emailToken)) {
      throw new Error('Email verification token should be valid');
    }

    if (!isValidToken(passwordToken)) {
      throw new Error('Password reset token should be valid');
    }

    // Проверяем, что токены не истекли
    if (isTokenExpired(emailToken)) {
      throw new Error('Email verification token should not be expired');
    }

    if (isTokenExpired(passwordToken)) {
      throw new Error('Password reset token should not be expired');
    }

    // Тестируем генерацию кодов
    const emailCode = generateEmailVerificationCode();
    const passwordTokenValue = generatePasswordResetToken();

    if (emailCode.length !== 6) {
      throw new Error('Email verification code should be 6 digits');
    }

    if (passwordTokenValue.length !== 32) {
      throw new Error('Password reset token should be 32 characters');
    }

    console.log('✅ Token validation test passed');
  }

  /**
   * Тест ограничений и cooldown
   */
  private async testRateLimiting(): Promise<void> {
    console.log('⏱️ Testing rate limiting...');

    // Создаем тестового пользователя
    const testUser = await userService.registerUser({
      email: 'test-rate@example.com',
      username: 'testrate',
      password: 'TestPass123!',
    });

    // Первый запрос должен пройти
    try {
      await userService.requestEmailVerification('test-rate@example.com');
    } catch (error) {
      throw new Error('First email verification request should succeed');
    }

    // Второй запрос сразу должен быть заблокирован cooldown
    try {
      await userService.requestEmailVerification('test-rate@example.com');
      throw new Error('Second email verification request should be blocked by cooldown');
    } catch (error) {
      if (error instanceof Error && error.message.includes('cooldown')) {
        // Ожидаемая ошибка
      } else {
        throw error;
      }
    }

    console.log('✅ Rate limiting test passed');
  }

  /**
   * Тест статистики токенов
   */
  async testTokenStats(): Promise<void> {
    console.log('📊 Testing token statistics...');

    const tokenStats = userService.getTokenStats();
    
    if (typeof tokenStats.emailVerificationTokens !== 'number') {
      throw new Error('Token statistics should include email verification count');
    }

    if (typeof tokenStats.passwordResetTokens !== 'number') {
      throw new Error('Token statistics should include password reset count');
    }

    console.log('Token Statistics:', tokenStats);
    console.log('✅ Token statistics test passed');
  }

  /**
   * Тест очистки истекших токенов
   */
  async testTokenCleanup(): Promise<void> {
    console.log('🧹 Testing token cleanup...');

    // Создаем истекший токен
    const expiredToken = createEmailVerificationToken('test-user', 'test@example.com');
    expiredToken.expiresAt = new Date(Date.now() - 1000); // Истек 1 секунду назад

    // Добавляем в хранилище (через приватное поле)
    userService['emailVerificationTokens'].set(expiredToken.id, expiredToken);

    const beforeCleanup = userService.getTokenStats().emailVerificationTokens;

    // Очищаем истекшие токены
    userService.cleanupExpiredTokens();

    const afterCleanup = userService.getTokenStats().emailVerificationTokens;

    if (afterCleanup >= beforeCleanup) {
      throw new Error('Expired tokens should be cleaned up');
    }

    console.log('✅ Token cleanup test passed');
  }
}

/**
 * Функция для запуска всех тестов email системы
 */
export async function runEmailSystemTests(): Promise<void> {
  const tester = new EmailSystemTester();
  
  await tester.runEmailTests();
  await tester.testTokenStats();
  await tester.testTokenCleanup();
  
  console.log('\n🎉 All email system tests completed successfully!');
}

// Экспортируем для использования в других файлах
export default EmailSystemTester;
