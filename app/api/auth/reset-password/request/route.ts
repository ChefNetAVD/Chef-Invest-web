import { NextRequest, NextResponse } from 'next/server';
import { userService } from '../../../../services/auth/userService';
import { 
  generatePasswordResetLink, 
  createPasswordResetTemplate,
  maskEmail 
} from '../../../../utils/email';
import { AUTH_ERRORS } from '../../../../types/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Валидация входных данных
    if (!email) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Email is required' 
        },
        { status: 400 }
      );
    }

    // Запрашиваем сброс пароля
    const resetToken = await userService.requestPasswordReset(email);

    // В реальном приложении здесь будет отправка email
    // Для демонстрации просто логируем
    console.log('🔑 Password reset requested:', {
      email: maskEmail(email),
      token: resetToken.token,
      expiresAt: resetToken.expiresAt,
    });

    // Генерируем ссылку для сброса пароля
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const resetLink = generatePasswordResetLink(resetToken.token, baseUrl);

    // Создаем HTML шаблон (для демонстрации)
    const user = userService.getUserByEmail(email);
    const emailTemplate = createPasswordResetTemplate(
      user?.username || 'User',
      resetLink
    );

    // В реальном приложении здесь будет отправка email через SMTP/SendGrid/etc.
    // await sendEmail({
    //   to: email,
    //   subject: 'Reset your password - ChefInvest',
    //   html: emailTemplate
    // });

    return NextResponse.json({
      success: true,
      message: 'If an account with this email exists, a password reset link has been sent.',
      // В development режиме возвращаем токен для тестирования
      ...(process.env.NODE_ENV === 'development' && {
        resetToken: resetToken.token,
        resetLink,
      }),
    });

  } catch (error) {
    console.error('Password reset request error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to send password reset email';
    
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage 
      },
      { status: 400 }
    );
  }
}
