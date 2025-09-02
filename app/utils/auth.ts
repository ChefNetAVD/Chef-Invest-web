import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { 
  TokenPayload, 
  RefreshTokenPayload, 
  AuthUser,
  AUTH_CONSTANTS,
  AUTH_ERRORS 
} from '../types/auth';

/**
 * Утилиты для работы с аутентификацией
 */

/**
 * Хеширует пароль
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Проверяет пароль
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Генерирует JWT токен
 */
export function generateAccessToken(user: AuthUser): string {
  const payload: Omit<TokenPayload, 'iat' | 'exp'> = {
    userId: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
  };

  return jwt.sign(payload, AUTH_CONSTANTS.JWT_SECRET, {
    expiresIn: AUTH_CONSTANTS.JWT_EXPIRES_IN,
  });
}

/**
 * Генерирует refresh токен
 */
export function generateRefreshToken(userId: string, tokenId: string): string {
  const payload: Omit<RefreshTokenPayload, 'iat' | 'exp'> = {
    userId,
    tokenId,
  };

  return jwt.sign(payload, AUTH_CONSTANTS.JWT_SECRET, {
    expiresIn: AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRES_IN,
  });
}

/**
 * Верифицирует JWT токен
 */
export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, AUTH_CONSTANTS.JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Верифицирует refresh токен
 */
export function verifyRefreshToken(token: string): RefreshTokenPayload | null {
  try {
    const decoded = jwt.verify(token, AUTH_CONSTANTS.JWT_SECRET) as RefreshTokenPayload;
    return decoded;
  } catch (error) {
    console.error('Refresh token verification failed:', error);
    return null;
  }
}

/**
 * Извлекает токен из заголовка Authorization
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
}

/**
 * Валидирует email
 */
export function validateEmail(email: string): boolean {
  return AUTH_CONSTANTS.EMAIL_REGEX.test(email);
}

/**
 * Валидирует username
 */
export function validateUsername(username: string): boolean {
  return (
    username.length >= AUTH_CONSTANTS.USERNAME_MIN_LENGTH &&
    username.length <= AUTH_CONSTANTS.USERNAME_MAX_LENGTH &&
    AUTH_CONSTANTS.USERNAME_REGEX.test(username)
  );
}

/**
 * Валидирует пароль
 */
export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < AUTH_CONSTANTS.PASSWORD_MIN_LENGTH) {
    errors.push(`Password must be at least ${AUTH_CONSTANTS.PASSWORD_MIN_LENGTH} characters long`);
  }

  if (!AUTH_CONSTANTS.PASSWORD_REGEX.test(password)) {
    errors.push('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Генерирует случайный ID для refresh токена
 */
export function generateTokenId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Проверяет, истек ли токен
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as any;
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
}

/**
 * Получает время истечения токена
 */
export function getTokenExpiration(token: string): Date | null {
  try {
    const decoded = jwt.decode(token) as any;
    if (!decoded || !decoded.exp) return null;
    
    return new Date(decoded.exp * 1000);
  } catch {
    return null;
  }
}

/**
 * Создает безопасный объект пользователя для клиента
 */
export function sanitizeUser(user: any): AuthUser {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
  };
}

/**
 * Проверяет права доступа
 */
export function hasPermission(userRole: string, requiredRole: string): boolean {
  const roleHierarchy = {
    user: 0,
    moderator: 1,
    admin: 2,
  };

  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] ?? -1;
  const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] ?? 999;

  return userLevel >= requiredLevel;
}

/**
 * Генерирует случайный код для верификации email
 */
export function generateEmailVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Генерирует токен для сброса пароля
 */
export function generatePasswordResetToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
