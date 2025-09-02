import { NextRequest, NextResponse } from 'next/server';
import { userService } from '../../../../services/auth/userService';
import { AUTH_ERRORS } from '../../../../types/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, newPassword } = body;

    // Валидация входных данных
    if (!token || !newPassword) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Token and new password are required' 
        },
        { status: 400 }
      );
    }

    // Подтверждаем сброс пароля
    const success = await userService.confirmPasswordReset(token, newPassword);

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Password reset successfully'
      });
    } else {
      return NextResponse.json(
        { 
          success: false,
          error: 'Password reset failed' 
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Password reset confirm error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
    
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage 
      },
      { status: 400 }
    );
  }
}
