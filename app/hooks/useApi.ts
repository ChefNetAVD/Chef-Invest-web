import { useCallback } from 'react';
import { useAuth } from './useAuth';

/**
 * Хук для выполнения защищенных API запросов
 */
export function useApi() {
  const { refreshToken, logout } = useAuth();

  /**
   * Выполняет API запрос с автоматическим обновлением токена
   */
  const apiRequest = useCallback(async (
    url: string, 
    options: RequestInit = {}
  ): Promise<Response> => {
    const token = localStorage.getItem('auth_token');
    
    // Добавляем токен в заголовки
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let response = await fetch(url, {
      ...options,
      headers,
    });

    // Если получили 401, пробуем обновить токен
    if (response.status === 401 && token) {
      const refreshed = await refreshToken();
      
      if (refreshed) {
        // Повторяем запрос с новым токеном
        const newToken = localStorage.getItem('auth_token');
        headers['Authorization'] = `Bearer ${newToken}`;
        
        response = await fetch(url, {
          ...options,
          headers,
        });
      } else {
        // Если не удалось обновить токен, выходим
        logout();
        throw new Error('Authentication failed');
      }
    }

    return response;
  }, [refreshToken, logout]);

  /**
   * GET запрос
   */
  const get = useCallback(async (url: string, options: RequestInit = {}) => {
    return apiRequest(url, { ...options, method: 'GET' });
  }, [apiRequest]);

  /**
   * POST запрос
   */
  const post = useCallback(async (url: string, data?: any, options: RequestInit = {}) => {
    return apiRequest(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }, [apiRequest]);

  /**
   * PUT запрос
   */
  const put = useCallback(async (url: string, data?: any, options: RequestInit = {}) => {
    return apiRequest(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }, [apiRequest]);

  /**
   * DELETE запрос
   */
  const del = useCallback(async (url: string, options: RequestInit = {}) => {
    return apiRequest(url, { ...options, method: 'DELETE' });
  }, [apiRequest]);

  /**
   * PATCH запрос
   */
  const patch = useCallback(async (url: string, data?: any, options: RequestInit = {}) => {
    return apiRequest(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }, [apiRequest]);

  return {
    request: apiRequest,
    get,
    post,
    put,
    delete: del,
    patch,
  };
}
