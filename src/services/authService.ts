import { ApiResponse } from '../types/user';
import { api } from './api';
import { LoginCredentials, RegisterData, AuthResponse } from '@/types/auth';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  },

  async me(): Promise<ApiResponse> {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/api/auth/logout');
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await api.post('/api/auth/refresh', { refreshToken });
    return response.data;
  },
};