import { 
  EmailVerificationToken, 
  PasswordResetToken, 
  AUTH_CONSTANTS 
} from '../types/auth';

/**
 * Утилиты для работы с email верификацией и восстановлением пароля
 */

/**
 * Генерирует случайный код для верификации email
 */
export function generateEmailVerificationCode(): string {
  const length = AUTH_CONSTANTS.EMAIL_VERIFICATION_TOKEN_LENGTH;
  let code = '';
  
  for (let i = 0; i < length; i++) {
    code += Math.floor(Math.random() * 10).toString();
  }
  
  return code;
}

/**
 * Генерирует токен для восстановления пароля
 */
export function generatePasswordResetToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = AUTH_CONSTANTS.PASSWORD_RESET_TOKEN_LENGTH;
  let token = '';
  
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return token;
}

/**
 * Создает токен верификации email
 */
export function createEmailVerificationToken(
  userId: string, 
  email: string
): EmailVerificationToken {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 часа
  
  return {
    id: `evt_${Date.now()}_${Math.random().toString(36).substring(2)}`,
    userId,
    email,
    token: generateEmailVerificationCode(),
    expiresAt,
    createdAt: now,
    isUsed: false,
  };
}

/**
 * Создает токен восстановления пароля
 */
export function createPasswordResetToken(
  userId: string, 
  email: string
): PasswordResetToken {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 60 * 60 * 1000); // 1 час
  
  return {
    id: `prt_${Date.now()}_${Math.random().toString(36).substring(2)}`,
    userId,
    email,
    token: generatePasswordResetToken(),
    expiresAt,
    createdAt: now,
    isUsed: false,
  };
}

/**
 * Проверяет, истек ли токен
 */
export function isTokenExpired(token: EmailVerificationToken | PasswordResetToken): boolean {
  return new Date() > token.expiresAt;
}

/**
 * Проверяет, валиден ли токен
 */
export function isValidToken(
  token: EmailVerificationToken | PasswordResetToken
): boolean {
  return !token.isUsed && !isTokenExpired(token);
}

/**
 * Форматирует email для отправки
 */
export function formatEmailForSending(email: string): string {
  return email.toLowerCase().trim();
}

/**
 * Генерирует ссылку для верификации email
 */
export function generateEmailVerificationLink(token: string, baseUrl: string): string {
  return `${baseUrl}/verify-email?token=${token}`;
}

/**
 * Генерирует ссылку для восстановления пароля
 */
export function generatePasswordResetLink(token: string, baseUrl: string): string {
  return `${baseUrl}/reset-password?token=${token}`;
}

/**
 * Создает HTML шаблон для email верификации
 */
export function createEmailVerificationTemplate(
  username: string, 
  verificationCode: string, 
  verificationLink: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Email Verification - ChefInvest</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #D93F29; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .code { font-size: 24px; font-weight: bold; color: #D93F29; text-align: center; padding: 20px; background: white; border: 2px dashed #D93F29; margin: 20px 0; }
        .button { display: inline-block; padding: 12px 24px; background: #D93F29; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🍽️ ChefInvest</h1>
          <h2>Email Verification</h2>
        </div>
        <div class="content">
          <h3>Hello ${username}!</h3>
          <p>Thank you for registering with ChefInvest. To complete your registration, please verify your email address.</p>
          
          <p><strong>Verification Code:</strong></p>
          <div class="code">${verificationCode}</div>
          
          <p>Or click the button below to verify your email:</p>
          <a href="${verificationLink}" class="button">Verify Email</a>
          
          <p>This verification code will expire in 24 hours.</p>
          <p>If you didn't create an account with ChefInvest, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>© 2025 ChefInvest. All rights reserved.</p>
          <p>This is an automated message, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Создает HTML шаблон для восстановления пароля
 */
export function createPasswordResetTemplate(
  username: string, 
  resetLink: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Password Reset - ChefInvest</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #D93F29; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .button { display: inline-block; padding: 12px 24px; background: #D93F29; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🍽️ ChefInvest</h1>
          <h2>Password Reset</h2>
        </div>
        <div class="content">
          <h3>Hello ${username}!</h3>
          <p>We received a request to reset your password for your ChefInvest account.</p>
          
          <p>Click the button below to reset your password:</p>
          <a href="${resetLink}" class="button">Reset Password</a>
          
          <div class="warning">
            <p><strong>Important:</strong></p>
            <ul>
              <li>This link will expire in 1 hour</li>
              <li>If you didn't request this password reset, please ignore this email</li>
              <li>Your password will remain unchanged until you create a new one</li>
            </ul>
          </div>
          
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetLink}</p>
        </div>
        <div class="footer">
          <p>© 2025 ChefInvest. All rights reserved.</p>
          <p>This is an automated message, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Валидирует email адрес
 */
export function validateEmailAddress(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Маскирует email для безопасности
 */
export function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@');
  if (localPart.length <= 2) {
    return `${localPart[0]}*@${domain}`;
  }
  
  const maskedLocal = `${localPart[0]}${'*'.repeat(localPart.length - 2)}${localPart[localPart.length - 1]}`;
  return `${maskedLocal}@${domain}`;
}

/**
 * Проверяет, не слишком ли часто запрашивается верификация
 */
export function canRequestVerification(
  lastRequestTime: Date | null, 
  cooldownMs: number = AUTH_CONSTANTS.EMAIL_VERIFICATION_COOLDOWN
): boolean {
  if (!lastRequestTime) return true;
  
  const now = new Date();
  const timeDiff = now.getTime() - lastRequestTime.getTime();
  
  return timeDiff >= cooldownMs;
}

/**
 * Проверяет, не слишком ли часто запрашивается сброс пароля
 */
export function canRequestPasswordReset(
  lastRequestTime: Date | null, 
  cooldownMs: number = AUTH_CONSTANTS.PASSWORD_RESET_COOLDOWN
): boolean {
  if (!lastRequestTime) return true;
  
  const now = new Date();
  const timeDiff = now.getTime() - lastRequestTime.getTime();
  
  return timeDiff >= cooldownMs;
}
