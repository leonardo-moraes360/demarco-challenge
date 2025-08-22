import { authApi } from './api';
import type { LoginRequest, AuthResponse, RefreshTokenRequest } from '../types/auth';

export class AuthService {
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    console.log('AuthService.login - Iniciando login com:', credentials);
    console.log('AuthService.login - URL da API:', import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1');
    
    try {
      const response = await authApi.post('auth/login', {
        json: credentials
      }).json<AuthResponse>();

      console.log('AuthService.login - Login bem-sucedido:', response);

      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));

      return response;
    } catch (error) {
      console.error('AuthService.login - Erro no login:', error);
      throw error;
    }
  }

  static async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('Refresh token não encontrado');
    }

    const response = await authApi.post('auth/refresh', {
      json: { refreshToken } as RefreshTokenRequest
    }).json<AuthResponse>();

    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.user));

    return response;
  }

  static async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (refreshToken) {
      try {
        await authApi.delete('auth/logout', {
          json: { refreshToken }
        });
      } catch (error) {
        console.error('Erro ao fazer logout no servidor:', error);
      }
    }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  static async logoutAllSessions(): Promise<void> {
    try {
      await authApi.delete('auth/logout-all');
    } catch (error) {
      console.error('Erro ao fazer logout de todas as sessões:', error);
    }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  static getCurrentUser(): any {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  static isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }
}
