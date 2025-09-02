import { NextRequest, NextResponse } from 'next/server';
import { userService } from '../../../services/auth/userService';
import { generateAccessToken, generateRefreshToken, generateTokenId } from '../../../utils/auth';
import { RegisterCredentials, AUTH_ERRORS } from '../../../types/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, username, password, firstName, lastName, referrerId } = body;

    // Валидация обязательных полей
    if (!email || !username || !password) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields: email, username, password' 
        },
        { status: 400 }
      );
    }

    const credentials: RegisterCredentials = {
      email,
      username,
      password,
      firstName,
      lastName,
      referrerId,
    };

    // Регистрация пользователя
    const user = await userService.registerUser(credentials);

    // Генерация токенов
    const accessToken = generateAccessToken(user);
    const tokenId = generateTokenId();
    const refreshToken = generateRefreshToken(user.id, tokenId);

    // В реальном приложении здесь можно:
    // 1. Отправить email для верификации
    // 2. Инициализировать пользователя в торговой системе
    // 3. Создать реферальную связь

    return NextResponse.json({
      success: true,
      user,
      token: accessToken,
      refreshToken,
      message: 'User registered successfully'
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Registration failed';
    
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage 
      },
      { status: 400 }
    );
  }
}
