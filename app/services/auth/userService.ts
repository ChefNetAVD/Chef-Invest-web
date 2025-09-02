import { 
  User, 
  UserProfile, 
  AuthUser, 
  LoginCredentials, 
  RegisterCredentials,
  EmailVerificationToken,
  PasswordResetToken,
  AUTH_ERRORS 
} from '../../types/auth';
import { 
  hashPassword, 
  verifyPassword, 
  validateEmail, 
  validateUsername, 
  validatePassword,
  sanitizeUser 
} from '../../utils/auth';
import { 
  createEmailVerificationToken,
  createPasswordResetToken,
  isValidToken,
  isTokenExpired,
  canRequestVerification,
  canRequestPasswordReset
} from '../../utils/email';

/**
 * In-memory сервис для управления пользователями
 * В будущем будет заменен на реальную БД
 */
export class UserService {
  private users: Map<string, User> = new Map();
  private usersByEmail: Map<string, string> = new Map();
  private usersByUsername: Map<string, string> = new Map();
  
  // Хранилища для токенов
  private emailVerificationTokens: Map<string, EmailVerificationToken> = new Map();
  private passwordResetTokens: Map<string, PasswordResetToken> = new Map();
  
  // Отслеживание последних запросов
  private lastVerificationRequests: Map<string, Date> = new Map();
  private lastPasswordResetRequests: Map<string, Date> = new Map();

  /**
   * Регистрирует нового пользователя
   */
  async registerUser(credentials: RegisterCredentials): Promise<AuthUser> {
    // Валидация входных данных
    if (!validateEmail(credentials.email)) {
      throw new Error(AUTH_ERRORS.INVALID_EMAIL);
    }

    if (!validateUsername(credentials.username)) {
      throw new Error(AUTH_ERRORS.INVALID_USERNAME);
    }

    const passwordValidation = validatePassword(credentials.password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors.join(', '));
    }

    // Проверка на существование пользователя
    if (this.usersByEmail.has(credentials.email.toLowerCase())) {
      throw new Error(AUTH_ERRORS.USER_ALREADY_EXISTS);
    }

    if (this.usersByUsername.has(credentials.username.toLowerCase())) {
      throw new Error(AUTH_ERRORS.USERNAME_TAKEN);
    }

    // Создание нового пользователя
    const userId = this.generateUserId();
    const hashedPassword = await hashPassword(credentials.password);
    
    const newUser: User = {
      id: userId,
      email: credentials.email.toLowerCase(),
      username: credentials.username,
      firstName: credentials.firstName,
      lastName: credentials.lastName,
      isEmailVerified: false,
      isActive: true,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
      referrerId: credentials.referrerId,
    };

    // Сохранение пользователя
    this.users.set(userId, newUser);
    this.usersByEmail.set(credentials.email.toLowerCase(), userId);
    this.usersByUsername.set(credentials.username.toLowerCase(), userId);

    // Возвращаем безопасную версию пользователя
    return sanitizeUser(newUser);
  }

  /**
   * Аутентифицирует пользователя
   */
  async authenticateUser(credentials: LoginCredentials): Promise<AuthUser> {
    const user = this.getUserByEmail(credentials.email);
    
    if (!user) {
      throw new Error(AUTH_ERRORS.INVALID_CREDENTIALS);
    }

    if (!user.isActive) {
      throw new Error(AUTH_ERRORS.ACCOUNT_DISABLED);
    }

    // В реальной БД пароль будет храниться отдельно
    // Здесь для демонстрации проверяем простой пароль
    const isValidPassword = credentials.password === 'password123' || 
                           await this.verifyUserPassword(user.id, credentials.password);

    if (!isValidPassword) {
      throw new Error(AUTH_ERRORS.INVALID_CREDENTIALS);
    }

    // Обновляем время последнего входа
    user.lastLoginAt = new Date();
    user.updatedAt = new Date();
    this.users.set(user.id, user);

    return sanitizeUser(user);
  }

  /**
   * Получает пользователя по ID
   */
  getUserById(userId: string): User | null {
    return this.users.get(userId) || null;
  }

  /**
   * Получает пользователя по email
   */
  getUserByEmail(email: string): User | null {
    const userId = this.usersByEmail.get(email.toLowerCase());
    if (!userId) return null;
    return this.users.get(userId) || null;
  }

  /**
   * Получает пользователя по username
   */
  getUserByUsername(username: string): User | null {
    const userId = this.usersByUsername.get(username.toLowerCase());
    if (!userId) return null;
    return this.users.get(userId) || null;
  }

  /**
   * Получает профиль пользователя
   */
  getUserProfile(userId: string): UserProfile | null {
    const user = this.getUserById(userId);
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      isEmailVerified: user.isEmailVerified,
      role: user.role,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
      referrerId: user.referrerId,
    };
  }

  /**
   * Обновляет профиль пользователя
   */
  async updateUserProfile(userId: string, updates: Partial<User>): Promise<UserProfile | null> {
    const user = this.getUserById(userId);
    if (!user) return null;

    // Обновляем поля
    Object.assign(user, updates, { updatedAt: new Date() });
    this.users.set(userId, user);

    return this.getUserProfile(userId);
  }

  /**
   * Проверяет пароль пользователя (заглушка для демонстрации)
   */
  private async verifyUserPassword(userId: string, password: string): Promise<boolean> {
    // В реальной БД здесь будет проверка хешированного пароля
    // Для демонстрации используем простую проверку
    return password === 'password123';
  }

  /**
   * Генерирует уникальный ID пользователя
   */
  private generateUserId(): string {
    return 'user_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  /**
   * Получает всех пользователей (для админки)
   */
  getAllUsers(): UserProfile[] {
    return Array.from(this.users.values()).map(user => this.getUserProfile(user.id)!);
  }

  /**
   * Активирует/деактивирует пользователя
   */
  setUserActive(userId: string, isActive: boolean): boolean {
    const user = this.getUserById(userId);
    if (!user) return false;

    user.isActive = isActive;
    user.updatedAt = new Date();
    this.users.set(userId, user);
    return true;
  }

  /**
   * Удаляет пользователя
   */
  deleteUser(userId: string): boolean {
    const user = this.getUserById(userId);
    if (!user) return false;

    this.users.delete(userId);
    this.usersByEmail.delete(user.email);
    this.usersByUsername.delete(user.username);
    return true;
  }

  /**
   * Получает статистику пользователей
   */
  getUserStats() {
    const users = Array.from(this.users.values());
    return {
      total: users.length,
      active: users.filter(u => u.isActive).length,
      verified: users.filter(u => u.isEmailVerified).length,
      byRole: users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }

  /**
   * Запрашивает верификацию email
   */
  async requestEmailVerification(email: string): Promise<EmailVerificationToken> {
    const user = this.getUserByEmail(email);
    if (!user) {
      throw new Error(AUTH_ERRORS.USER_NOT_FOUND);
    }

    if (user.isEmailVerified) {
      throw new Error(AUTH_ERRORS.EMAIL_ALREADY_VERIFIED);
    }

    // Проверяем cooldown
    const lastRequest = this.lastVerificationRequests.get(email);
    if (!canRequestVerification(lastRequest)) {
      throw new Error(AUTH_ERRORS.EMAIL_VERIFICATION_COOLDOWN);
    }

    // Создаем новый токен
    const token = createEmailVerificationToken(user.id, email);
    this.emailVerificationTokens.set(token.id, token);
    this.lastVerificationRequests.set(email, new Date());

    return token;
  }

  /**
   * Подтверждает верификацию email
   */
  async confirmEmailVerification(token: string): Promise<boolean> {
    // Ищем токен по значению
    const verificationToken = Array.from(this.emailVerificationTokens.values())
      .find(t => t.token === token && !t.isUsed);

    if (!verificationToken) {
      throw new Error(AUTH_ERRORS.EMAIL_VERIFICATION_INVALID);
    }

    if (isTokenExpired(verificationToken)) {
      throw new Error(AUTH_ERRORS.EMAIL_VERIFICATION_EXPIRED);
    }

    // Обновляем пользователя
    const user = this.getUserById(verificationToken.userId);
    if (!user) {
      throw new Error(AUTH_ERRORS.USER_NOT_FOUND);
    }

    user.isEmailVerified = true;
    user.updatedAt = new Date();
    this.users.set(user.id, user);

    // Помечаем токен как использованный
    verificationToken.isUsed = true;
    this.emailVerificationTokens.set(verificationToken.id, verificationToken);

    return true;
  }

  /**
   * Запрашивает сброс пароля
   */
  async requestPasswordReset(email: string): Promise<PasswordResetToken> {
    const user = this.getUserByEmail(email);
    if (!user) {
      // Не раскрываем, существует ли пользователь
      throw new Error('If an account with this email exists, a password reset link has been sent.');
    }

    // Проверяем cooldown
    const lastRequest = this.lastPasswordResetRequests.get(email);
    if (!canRequestPasswordReset(lastRequest)) {
      throw new Error(AUTH_ERRORS.PASSWORD_RESET_COOLDOWN);
    }

    // Создаем новый токен
    const token = createPasswordResetToken(user.id, email);
    this.passwordResetTokens.set(token.id, token);
    this.lastPasswordResetRequests.set(email, new Date());

    return token;
  }

  /**
   * Подтверждает сброс пароля
   */
  async confirmPasswordReset(token: string, newPassword: string): Promise<boolean> {
    // Ищем токен по значению
    const resetToken = Array.from(this.passwordResetTokens.values())
      .find(t => t.token === token && !t.isUsed);

    if (!resetToken) {
      throw new Error(AUTH_ERRORS.PASSWORD_RESET_INVALID);
    }

    if (isTokenExpired(resetToken)) {
      throw new Error(AUTH_ERRORS.PASSWORD_RESET_EXPIRED);
    }

    // Валидируем новый пароль
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors.join(', '));
    }

    // Обновляем пользователя
    const user = this.getUserById(resetToken.userId);
    if (!user) {
      throw new Error(AUTH_ERRORS.USER_NOT_FOUND);
    }

    // В реальной БД здесь будет хеширование пароля
    // user.passwordHash = await hashPassword(newPassword);
    user.updatedAt = new Date();
    this.users.set(user.id, user);

    // Помечаем токен как использованный
    resetToken.isUsed = true;
    this.passwordResetTokens.set(resetToken.id, resetToken);

    return true;
  }

  /**
   * Получает токен верификации email по ID
   */
  getEmailVerificationToken(tokenId: string): EmailVerificationToken | null {
    return this.emailVerificationTokens.get(tokenId) || null;
  }

  /**
   * Получает токен сброса пароля по ID
   */
  getPasswordResetToken(tokenId: string): PasswordResetToken | null {
    return this.passwordResetTokens.get(tokenId) || null;
  }

  /**
   * Очищает истекшие токены
   */
  cleanupExpiredTokens(): void {
    const now = new Date();

    // Очищаем истекшие токены верификации email
    for (const [id, token] of this.emailVerificationTokens.entries()) {
      if (isTokenExpired(token)) {
        this.emailVerificationTokens.delete(id);
      }
    }

    // Очищаем истекшие токены сброса пароля
    for (const [id, token] of this.passwordResetTokens.entries()) {
      if (isTokenExpired(token)) {
        this.passwordResetTokens.delete(id);
      }
    }
  }

  /**
   * Получает статистику токенов
   */
  getTokenStats() {
    return {
      emailVerificationTokens: this.emailVerificationTokens.size,
      passwordResetTokens: this.passwordResetTokens.size,
      activeEmailVerifications: Array.from(this.emailVerificationTokens.values())
        .filter(t => !t.isUsed && !isTokenExpired(t)).length,
      activePasswordResets: Array.from(this.passwordResetTokens.values())
        .filter(t => !t.isUsed && !isTokenExpired(t)).length,
    };
  }
}

// Создаем единственный экземпляр сервиса
export const userService = new UserService();
