/**
 * Типы для системы аутентификации
 */

export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  referrerId?: string;
}

export type UserRole = 'user' | 'admin' | 'moderator';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  isEmailVerified: boolean;
  role: UserRole;
  createdAt: Date;
  lastLoginAt?: Date;
  referrerId?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  isEmailVerified: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  referrerId?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  token?: string;
  refreshToken?: string;
  message?: string;
  error?: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  username: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export interface RefreshTokenPayload {
  userId: string;
  tokenId: string;
  iat: number;
  exp: number;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordReset {
  token: string;
  newPassword: string;
}

export interface EmailVerification {
  token: string;
}

export interface ChangePassword {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfile {
  firstName?: string;
  lastName?: string;
  username?: string;
  avatar?: string;
}

export interface EmailVerificationRequest {
  email: string;
}

export interface EmailVerificationConfirm {
  token: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

export interface EmailVerificationToken {
  id: string;
  userId: string;
  email: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  isUsed: boolean;
}

export interface PasswordResetToken {
  id: string;
  userId: string;
  email: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  isUsed: boolean;
}

// Константы для аутентификации
export const AUTH_CONSTANTS = {
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  JWT_EXPIRES_IN: '24h',
  REFRESH_TOKEN_EXPIRES_IN: '7d',
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 20,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  USERNAME_REGEX: /^[a-zA-Z0-9_]+$/,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  
  // Email верификация
  EMAIL_VERIFICATION_EXPIRES_IN: '24h', // 24 часа
  EMAIL_VERIFICATION_TOKEN_LENGTH: 6, // 6-значный код
  
  // Восстановление пароля
  PASSWORD_RESET_EXPIRES_IN: '1h', // 1 час
  PASSWORD_RESET_TOKEN_LENGTH: 32, // 32-символьный токен
  
  // Ограничения
  MAX_EMAIL_VERIFICATION_ATTEMPTS: 3, // Максимум попыток верификации
  MAX_PASSWORD_RESET_ATTEMPTS: 3, // Максимум попыток сброса пароля
  EMAIL_VERIFICATION_COOLDOWN: 300000, // 5 минут между запросами
  PASSWORD_RESET_COOLDOWN: 300000, // 5 минут между запросами
} as const;

// Ошибки аутентификации
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_EXISTS: 'User with this email already exists',
  USERNAME_TAKEN: 'Username is already taken',
  INVALID_TOKEN: 'Invalid or expired token',
  TOKEN_EXPIRED: 'Token has expired',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden access',
  EMAIL_NOT_VERIFIED: 'Email address not verified',
  ACCOUNT_DISABLED: 'Account is disabled',
  WEAK_PASSWORD: 'Password does not meet security requirements',
  INVALID_EMAIL: 'Invalid email format',
  INVALID_USERNAME: 'Invalid username format',
  
  // Email верификация
  EMAIL_ALREADY_VERIFIED: 'Email is already verified',
  EMAIL_VERIFICATION_EXPIRED: 'Email verification token has expired',
  EMAIL_VERIFICATION_INVALID: 'Invalid email verification token',
  EMAIL_VERIFICATION_LIMIT_EXCEEDED: 'Too many verification attempts',
  EMAIL_VERIFICATION_COOLDOWN: 'Please wait before requesting another verification email',
  
  // Восстановление пароля
  PASSWORD_RESET_EXPIRED: 'Password reset token has expired',
  PASSWORD_RESET_INVALID: 'Invalid password reset token',
  PASSWORD_RESET_LIMIT_EXCEEDED: 'Too many password reset attempts',
  PASSWORD_RESET_COOLDOWN: 'Please wait before requesting another password reset',
  PASSWORD_RESET_SAME_PASSWORD: 'New password must be different from current password',
} as const;
