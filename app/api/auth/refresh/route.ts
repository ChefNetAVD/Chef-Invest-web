import { NextRequest, NextResponse } from 'next/server';
import { userService } from '../../../services/auth/userService';
import { verifyRefreshToken, generateAccessToken, generateRefreshToken, generateTokenId } from '../../../utils/auth';
import { AUTH_ERRORS } from '../../../types/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Refresh token is required' 
        },
        { status: 400 }
      );
    }

    // Верифицируем refresh токен
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return NextResponse.json(
        { 
          success: false,
          error: AUTH_ERRORS.INVALID_TOKEN 
        },
        { status: 401 }
      );
    }

    // Получаем пользователя
    const user = userService.getUserById(payload.userId);
    if (!user || !user.isActive) {
      return NextResponse.json(
        { 
          success: false,
          error: AUTH_ERRORS.USER_NOT_FOUND 
        },
        { status: 404 }
      );
    }

    // Генерируем новые токены
    const newAccessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    });
    
    const newTokenId = generateTokenId();
    const newRefreshToken = generateRefreshToken(user.id, newTokenId);

    return NextResponse.json({
      success: true,
      token: newAccessToken,
      refreshToken: newRefreshToken,
      message: 'Tokens refreshed successfully'
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to refresh tokens' 
      },
      { status: 500 }
    );
  }
}
