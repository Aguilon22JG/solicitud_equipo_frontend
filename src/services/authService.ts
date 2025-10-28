import { apiService } from './apiService';
import { API_ENDPOINTS } from '../constants';
import { LoginCredentials, AuthResponse, User } from '../types';

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    return response;
  }

  async logout(): Promise<void> {
    try {
      await apiService.post(API_ENDPOINTS.AUTH.LOGOUT, {});
    } catch (error) {
      // Even if logout fails on server, clear local auth
      console.error('Logout error:', error);
    }
  }

  async refreshToken(refreshToken: string): Promise<{token: string; refreshToken: string}> {
    const response = await apiService.post<{token: string; refreshToken: string}>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    );
    return response;
  }

  async getCurrentUser(): Promise<User> {
    // Para obtener el usuario actual, podemos usar la información del token
    // Por ahora retornamos null ya que la API no tiene un endpoint /auth/me
    throw new Error('getCurrentUser not implemented - use stored user data');
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    // Necesitaríamos un endpoint específico para actualizar perfil
    throw new Error('updateProfile not implemented in current API');
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    // Necesitaríamos un endpoint específico para cambiar contraseña
    throw new Error('changePassword not implemented in current API');
  }
}

export const authService = new AuthService();