import { NextRequest, NextResponse } from 'next/server';
import { userService } from '../../../../services/auth/userService';
import { 
  generateEmailVerificationLink, 
  createEmailVerificationTemplate,
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

    // Запрашиваем верификацию email
    const verificationToken = await userService.requestEmailVerification(email);

    // В реальном приложении здесь будет отправка email
    // Для демонстрации просто логируем
    console.log('📧 Email verification requested:', {
      email: maskEmail(email),
      token: verificationToken.token,
      expiresAt: verificationToken.expiresAt,
    });

    // Генерируем ссылку для верификации
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const verificationLink = generateEmailVerificationLink(verificationToken.token, baseUrl);

    // Создаем HTML шаблон (для демонстрации)
    const user = userService.getUserByEmail(email);
    const emailTemplate = createEmailVerificationTemplate(
      user?.username || 'User',
      verificationToken.token,
      verificationLink
    );

    // В реальном приложении здесь будет отправка email через SMTP/SendGrid/etc.
    // await sendEmail({
    //   to: email,
    //   subject: 'Verify your email - ChefInvest',
    //   html: emailTemplate
    // });

    return NextResponse.json({
      success: true,
      message: 'Verification email sent successfully',
      // В development режиме возвращаем токен для тестирования
      ...(process.env.NODE_ENV === 'development' && {
        verificationToken: verificationToken.token,
        verificationLink,
      }),
    });

  } catch (error) {
    console.error('Email verification request error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to send verification email';
    
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage 
      },
      { status: 400 }
    );
  }
}
