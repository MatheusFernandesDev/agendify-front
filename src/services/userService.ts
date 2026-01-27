import { api } from './api';
import { User } from '../types/auth';
import { UpdateUserData, UserProfile, ApiResponse, PaginatedResponse } from '@/types/user';

interface ListUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
}

interface CreateUserData {
  name: string;
  surname: string;
  email: string;
  password: string;
  phone?: string;
  address: string;
  role?: string;
  permissions?: {
    appointments: boolean;
    logs: boolean;
  };
}

interface UpdateUserPermissions {
  appointments: boolean;
  logs: boolean;
}

export const userService = {
  // ========== ROTAS DE USUÁRIO COMUM ==========
  
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  async updateProfile(data: UpdateUserData): Promise<ApiResponse<User>> {
    const response = await api.put('/api/users/profile', data);
    return response.data;
  },

  async updatePassword(oldPassword: string, newPassword: string): Promise<ApiResponse> {
    const response = await api.put('/api/users/password', {
      oldPassword,
      newPassword,
    });
    return response.data;
  },

  // ========== ROTAS DE ADMIN ==========

  /**
   * Lista todos os clientes com paginação e filtros
   */
  async list(params: ListUsersParams = {}): Promise<PaginatedResponse<User>> {
    const response = await api.get('/api/users', { params });
    return response.data;
  },

  /**
   * Busca cliente por ID
   */
  async getById(id: string): Promise<ApiResponse<User>> {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  },

  /**
   * Cria novo cliente
   */
  async create(data: CreateUserData): Promise<ApiResponse<User>> {
    const response = await api.post('/api/users', data);
    return response.data;
  },

  /**
   * Atualiza cliente (por admin)
   */
  async update(id: string, data: Partial<UpdateUserData>): Promise<ApiResponse<User>> {
    const response = await api.put(`/api/users/${id}`, data);
    return response.data;
  },

  /**
   * Ativa/Desativa cliente
   */
  async toggleStatus(id: string): Promise<ApiResponse<User>> {
    const response = await api.patch(`/api/users/${id}/toggle-status`);
    return response.data;
  },

  /**
   * Atualiza permissões do cliente
   */
  async updatePermissions(id: string, permissions: UpdateUserPermissions): Promise<ApiResponse<User>> {
    const response = await api.patch(`/api/users/${id}/permissions`, { permissions });
    return response.data;
  },

  /**
   * Deleta cliente
   */
  async delete(id: string): Promise<ApiResponse> {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
  },
};