import { useState, useEffect, useCallback, useMemo } from 'react';
import { AuthUser, UserProfile, LoginCredentials, RegisterCredentials, AuthResponse } from '../types/auth';

/**
 * Хук для управления аутентификацией
 */
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Проверяем, есть ли сохраненный токен при загрузке
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          await fetchUserProfile();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Очищаем невалидный токен
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Получает профиль пользователя
   */
  const fetchUserProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUserProfile(data.user);
          setUser({
            id: data.user.id,
            email: data.user.email,
            username: data.user.username,
            role: data.user.role,
            isEmailVerified: data.user.isEmailVerified,
          });
        }
      } else {
        // Токен невалидный, пробуем обновить
        await refreshToken();
      }
    } catch (error) {
      console.error('Fetch user profile error:', error);
      setError('Failed to fetch user profile');
    }
  }, []);

  /**
   * Обновляет токен
   */
  const refreshToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          localStorage.setItem('auth_token', data.token);
          localStorage.setItem('refresh_token', data.refreshToken);
          await fetchUserProfile();
          return true;
        }
      }

      // Если обновление не удалось, выходим
      logout();
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
      return false;
    }
  }, [fetchUserProfile]);

  /**
   * Вход в систему
   */
  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data: AuthResponse = await response.json();

      if (data.success && data.user && data.token) {
        // Сохраняем токены
        localStorage.setItem('auth_token', data.token);
        if (data.refreshToken) {
          localStorage.setItem('refresh_token', data.refreshToken);
        }

        // Устанавливаем пользователя
        setUser(data.user);
        setUserProfile({
          id: data.user.id,
          email: data.user.email,
          username: data.user.username,
          isEmailVerified: data.user.isEmailVerified,
          role: data.user.role,
          createdAt: new Date(),
        });

        return true;
      } else {
        setError(data.error || 'Login failed');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Регистрация
   */
  const register = useCallback(async (credentials: RegisterCredentials): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data: AuthResponse = await response.json();

      if (data.success && data.user && data.token) {
        // Сохраняем токены
        localStorage.setItem('auth_token', data.token);
        if (data.refreshToken) {
          localStorage.setItem('refresh_token', data.refreshToken);
        }

        // Устанавливаем пользователя
        setUser(data.user);
        setUserProfile({
          id: data.user.id,
          email: data.user.email,
          username: data.user.username,
          firstName: credentials.firstName,
          lastName: credentials.lastName,
          isEmailVerified: data.user.isEmailVerified,
          role: data.user.role,
          createdAt: new Date(),
        });

        return true;
      } else {
        setError(data.error || 'Registration failed');
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Выход из системы
   */
  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setUserProfile(null);
    setError(null);
  }, []);

  /**
   * Запрашивает верификацию email
   */
  const requestEmailVerification = useCallback(async (email: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/auth/verify-email/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        return true;
      } else {
        setError(data.error || 'Failed to send verification email');
        return false;
      }
    } catch (error) {
      console.error('Email verification request error:', error);
      setError('Failed to send verification email');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Подтверждает верификацию email
   */
  const confirmEmailVerification = useCallback(async (token: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/auth/verify-email/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (data.success) {
        // Обновляем профиль пользователя
        await fetchUserProfile();
        return true;
      } else {
        setError(data.error || 'Email verification failed');
        return false;
      }
    } catch (error) {
      console.error('Email verification confirm error:', error);
      setError('Email verification failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchUserProfile]);

  /**
   * Запрашивает сброс пароля
   */
  const requestPasswordReset = useCallback(async (email: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/auth/reset-password/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        return true;
      } else {
        setError(data.error || 'Failed to send password reset email');
        return false;
      }
    } catch (error) {
      console.error('Password reset request error:', error);
      setError('Failed to send password reset email');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Подтверждает сброс пароля
   */
  const confirmPasswordReset = useCallback(async (token: string, newPassword: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/auth/reset-password/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (data.success) {
        return true;
      } else {
        setError(data.error || 'Password reset failed');
        return false;
      }
    } catch (error) {
      console.error('Password reset confirm error:', error);
      setError('Password reset failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Проверяет статус токена
   */
  const checkTokenStatus = useCallback(async (token: string, type: 'email-verification' | 'password-reset') => {
    try {
      const response = await fetch(`/api/auth/token-status?token=${token}&type=${type}`);
      const data = await response.json();

      if (data.success) {
        return data;
      } else {
        throw new Error(data.error || 'Failed to check token status');
      }
    } catch (error) {
      console.error('Token status check error:', error);
      return null;
    }
  }, []);

  /**
   * Очищает ошибку
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Вычисляемые значения
  const isAuthenticated = useMemo(() => !!user, [user]);
  const isAdmin = useMemo(() => user?.role === 'admin', [user]);
  const isModerator = useMemo(() => user?.role === 'moderator' || user?.role === 'admin', [user]);
  const isEmailVerified = useMemo(() => user?.isEmailVerified, [user]);

  return {
    // Состояние
    user,
    userProfile,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    isModerator,
    isEmailVerified,

    // Методы аутентификации
    login,
    register,
    logout,
    refreshToken,
    fetchUserProfile,
    clearError,

    // Email верификация
    requestEmailVerification,
    confirmEmailVerification,

    // Восстановление пароля
    requestPasswordReset,
    confirmPasswordReset,

    // Утилиты
    checkTokenStatus,
  };
}
