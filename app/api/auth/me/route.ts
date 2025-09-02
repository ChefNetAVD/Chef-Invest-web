import { NextRequest, NextResponse } from 'next/server';
import { userService } from '../../../services/auth/userService';
import { extractTokenFromHeader, verifyAccessToken } from '../../../utils/auth';
import { AUTH_ERRORS } from '../../../types/auth';

export async function GET(request: NextRequest) {
  try {
    // Извлекаем токен из заголовка
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { 
          success: false,
          error: AUTH_ERRORS.UNAUTHORIZED 
        },
        { status: 401 }
      );
    }

    // Верифицируем токен
    const payload = verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json(
        { 
          success: false,
          error: AUTH_ERRORS.INVALID_TOKEN 
        },
        { status: 401 }
      );
    }

    // Получаем профиль пользователя
    const userProfile = userService.getUserProfile(payload.userId);
    if (!userProfile) {
      return NextResponse.json(
        { 
          success: false,
          error: AUTH_ERRORS.USER_NOT_FOUND 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: userProfile
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to get user profile' 
      },
      { status: 500 }
    );
  }
}
