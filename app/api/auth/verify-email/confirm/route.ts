import { NextRequest, NextResponse } from 'next/server';
import { userService } from '../../../../services/auth/userService';
import { AUTH_ERRORS } from '../../../../types/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    // Валидация входных данных
    if (!token) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Verification token is required' 
        },
        { status: 400 }
      );
    }

    // Подтверждаем верификацию email
    const success = await userService.confirmEmailVerification(token);

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Email verified successfully'
      });
    } else {
      return NextResponse.json(
        { 
          success: false,
          error: 'Email verification failed' 
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Email verification confirm error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Email verification failed';
    
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage 
      },
      { status: 400 }
    );
  }
}
