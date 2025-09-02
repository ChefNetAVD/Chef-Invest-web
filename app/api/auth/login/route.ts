import { NextRequest, NextResponse } from 'next/server';
import { userService } from '../../../services/auth/userService';
import { generateAccessToken, generateRefreshToken, generateTokenId } from '../../../utils/auth';
import { LoginCredentials, AUTH_ERRORS } from '../../../types/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Валидация обязательных полей
    if (!email || !password) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields: email, password' 
        },
        { status: 400 }
      );
    }

    const credentials: LoginCredentials = {
      email,
      password,
    };

    // Аутентификация пользователя
    const user = await userService.authenticateUser(credentials);

    // Генерация токенов
    const accessToken = generateAccessToken(user);
    const tokenId = generateTokenId();
    const refreshToken = generateRefreshToken(user.id, tokenId);

    return NextResponse.json({
      success: true,
      user,
      token: accessToken,
      refreshToken,
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Login failed';
    
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage 
      },
      { status: 401 }
    );
  }
}
