import { NextRequest, NextResponse } from 'next/server';
import { userService } from '../../../services/auth/userService';
import { isValidToken, isTokenExpired } from '../../../utils/email';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const type = searchParams.get('type'); // 'email-verification' or 'password-reset'

    if (!token || !type) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Token and type are required' 
        },
        { status: 400 }
      );
    }

    let tokenData = null;
    let isValid = false;
    let isExpired = false;

    if (type === 'email-verification') {
      // Ищем токен верификации email
      const verificationTokens = Array.from(userService['emailVerificationTokens'].values());
      tokenData = verificationTokens.find(t => t.token === token);
      
      if (tokenData) {
        isValid = isValidToken(tokenData);
        isExpired = isTokenExpired(tokenData);
      }
    } else if (type === 'password-reset') {
      // Ищем токен сброса пароля
      const resetTokens = Array.from(userService['passwordResetTokens'].values());
      tokenData = resetTokens.find(t => t.token === token);
      
      if (tokenData) {
        isValid = isValidToken(tokenData);
        isExpired = isTokenExpired(tokenData);
      }
    } else {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid token type. Use "email-verification" or "password-reset"' 
        },
        { status: 400 }
      );
    }

    if (!tokenData) {
      return NextResponse.json({
        success: true,
        exists: false,
        valid: false,
        expired: false,
        used: false,
      });
    }

    return NextResponse.json({
      success: true,
      exists: true,
      valid: isValid,
      expired: isExpired,
      used: tokenData.isUsed,
      expiresAt: tokenData.expiresAt,
      createdAt: tokenData.createdAt,
    });

  } catch (error) {
    console.error('Token status check error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to check token status' 
      },
      { status: 500 }
    );
  }
}
