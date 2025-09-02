import { NextRequest, NextResponse } from 'next/server';
import { extractTokenFromHeader, verifyAccessToken } from '../utils/auth';
import { AUTH_ERRORS } from '../types/auth';

/**
 * Middleware для проверки аутентификации
 */
export function requireAuth(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
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

      // Добавляем информацию о пользователе в request
      (request as any).user = payload;

      // Вызываем оригинальный handler
      return await handler(request, ...args);

    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        { 
          success: false,
          error: 'Authentication failed' 
        },
        { status: 401 }
      );
    }
  };
}

/**
 * Middleware для проверки ролей
 */
export function requireRole(requiredRole: string) {
  return function(handler: Function) {
    return async (request: NextRequest, ...args: any[]) => {
      try {
        const user = (request as any).user;
        
        if (!user) {
          return NextResponse.json(
            { 
              success: false,
              error: AUTH_ERRORS.UNAUTHORIZED 
            },
            { status: 401 }
          );
        }

        // Проверяем роль пользователя
        const roleHierarchy = {
          user: 0,
          moderator: 1,
          admin: 2,
        };

        const userLevel = roleHierarchy[user.role as keyof typeof roleHierarchy] ?? -1;
        const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] ?? 999;

        if (userLevel < requiredLevel) {
          return NextResponse.json(
            { 
              success: false,
              error: AUTH_ERRORS.FORBIDDEN 
            },
            { status: 403 }
          );
        }

        return await handler(request, ...args);

      } catch (error) {
        console.error('Role middleware error:', error);
        return NextResponse.json(
          { 
            success: false,
            error: 'Authorization failed' 
          },
          { status: 403 }
        );
      }
    };
  };
}

/**
 * Middleware для проверки верификации email
 */
export function requireEmailVerification(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
    try {
      const user = (request as any).user;
      
      if (!user) {
        return NextResponse.json(
          { 
            success: false,
            error: AUTH_ERRORS.UNAUTHORIZED 
          },
          { status: 401 }
        );
      }

      if (!user.isEmailVerified) {
        return NextResponse.json(
          { 
            success: false,
            error: AUTH_ERRORS.EMAIL_NOT_VERIFIED 
          },
          { status: 403 }
        );
      }

      return await handler(request, ...args);

    } catch (error) {
      console.error('Email verification middleware error:', error);
      return NextResponse.json(
        { 
          success: false,
          error: 'Email verification required' 
        },
        { status: 403 }
      );
    }
  };
}

/**
 * Утилита для получения пользователя из request
 */
export function getUserFromRequest(request: NextRequest) {
  return (request as any).user || null;
}
