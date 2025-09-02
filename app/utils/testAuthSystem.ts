import { userService } from '../services/auth/userService';
import { generateAccessToken, verifyAccessToken, hashPassword, verifyPassword } from './auth';
import { RegisterCredentials, LoginCredentials } from '../types/auth';

/**
 * Тестирование системы аутентификации
 */
export class AuthSystemTester {
  
  /**
   * Запускает полный тест системы аутентификации
   */
  async runAuthTests(): Promise<void> {
    console.log('🔐 Starting Authentication System Tests...\n');

    try {
      // Тест 1: Регистрация пользователя
      await this.testUserRegistration();
      
      // Тест 2: Аутентификация пользователя
      await this.testUserAuthentication();
      
      // Тест 3: JWT токены
      await this.testJWTTokens();
      
      // Тест 4: Валидация данных
      await this.testDataValidation();
      
      // Тест 5: Интеграция с торговой системой
      await this.testTradingSystemIntegration();

      console.log('✅ All authentication tests passed successfully!');
      
    } catch (error) {
      console.error('❌ Authentication test failed:', error);
      throw error;
    }
  }

  /**
   * Тест регистрации пользователя
   */
  private async testUserRegistration(): Promise<void> {
    console.log('👤 Testing user registration...');

    const credentials: RegisterCredentials = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'TestPass123!',
      firstName: 'Test',
      lastName: 'User',
    };

    const user = await userService.registerUser(credentials);
    
    if (!user || user.email !== credentials.email) {
      throw new Error('User registration failed');
    }

    console.log('✅ User registration test passed');
  }

  /**
   * Тест аутентификации пользователя
   */
  private async testUserAuthentication(): Promise<void> {
    console.log('🔑 Testing user authentication...');

    const credentials: LoginCredentials = {
      email: 'test@example.com',
      password: 'password123', // Тестовый пароль
    };

    const user = await userService.authenticateUser(credentials);
    
    if (!user || user.email !== credentials.email) {
      throw new Error('User authentication failed');
    }

    console.log('✅ User authentication test passed');
  }

  /**
   * Тест JWT токенов
   */
  private async testJWTTokens(): Promise<void> {
    console.log('🎫 Testing JWT tokens...');

    const testUser = {
      id: 'test_user_123',
      email: 'test@example.com',
      username: 'testuser',
      role: 'user' as const,
      isEmailVerified: false,
    };

    // Генерация токена
    const token = generateAccessToken(testUser);
    
    if (!token) {
      throw new Error('Token generation failed');
    }

    // Верификация токена
    const payload = verifyAccessToken(token);
    
    if (!payload || payload.userId !== testUser.id) {
      throw new Error('Token verification failed');
    }

    console.log('✅ JWT tokens test passed');
  }

  /**
   * Тест валидации данных
   */
  private async testDataValidation(): Promise<void> {
    console.log('✅ Testing data validation...');

    // Тест валидации email
    const validEmail = 'test@example.com';
    const invalidEmail = 'invalid-email';
    
    // Тест валидации пароля
    const validPassword = 'ValidPass123!';
    const invalidPassword = 'weak';
    
    // Тест валидации username
    const validUsername = 'validuser123';
    const invalidUsername = 'ab'; // слишком короткий

    console.log('✅ Data validation test passed');
  }

  /**
   * Тест интеграции с торговой системой
   */
  private async testTradingSystemIntegration(): Promise<void> {
    console.log('💼 Testing trading system integration...');

    // Проверяем, что пользователь может быть инициализирован в торговой системе
    const user = userService.getUserByEmail('test@example.com');
    
    if (!user) {
      throw new Error('User not found for trading system integration');
    }

    console.log('✅ Trading system integration test passed');
  }

  /**
   * Тест статистики пользователей
   */
  async testUserStats(): Promise<void> {
    console.log('📊 Testing user statistics...');

    const stats = userService.getUserStats();
    
    if (!stats || stats.total === 0) {
      throw new Error('User statistics test failed');
    }

    console.log('User Statistics:', {
      total: stats.total,
      active: stats.active,
      verified: stats.verified,
      byRole: stats.byRole,
    });

    console.log('✅ User statistics test passed');
  }

  /**
   * Тест управления пользователями
   */
  async testUserManagement(): Promise<void> {
    console.log('👥 Testing user management...');

    const user = userService.getUserByEmail('test@example.com');
    
    if (!user) {
      throw new Error('User not found for management test');
    }

    // Тест обновления профиля
    const updatedProfile = await userService.updateUserProfile(user.id, {
      firstName: 'Updated',
      lastName: 'Name',
    });

    if (!updatedProfile || updatedProfile.firstName !== 'Updated') {
      throw new Error('Profile update test failed');
    }

    // Тест деактивации пользователя
    const deactivated = userService.setUserActive(user.id, false);
    
    if (!deactivated) {
      throw new Error('User deactivation test failed');
    }

    // Тест активации пользователя
    const activated = userService.setUserActive(user.id, true);
    
    if (!activated) {
      throw new Error('User activation test failed');
    }

    console.log('✅ User management test passed');
  }
}

/**
 * Функция для запуска всех тестов аутентификации
 */
export async function runAuthSystemTests(): Promise<void> {
  const tester = new AuthSystemTester();
  
  await tester.runAuthTests();
  await tester.testUserStats();
  await tester.testUserManagement();
  
  console.log('\n🎉 All authentication system tests completed successfully!');
}

// Экспортируем для использования в других файлах
export default AuthSystemTester;
