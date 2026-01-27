import { api } from './api';
import { Log, LogFilters } from '@/types/log';
import { PaginatedResponse } from '../types/user';

interface ListLogsParams extends LogFilters {
  page?: number;
  limit?: number;
}

export const logService = {
  async list(params: ListLogsParams = {}): Promise<PaginatedResponse<Log>> {
    const response = await api.get('/api/logs', { params });
    return response.data;
  },

  async getById(id: string): Promise<any> {
    const response = await api.get(`/api/logs/${id}`);
    return response.data;
  },

  async getByUser(userId: string, params: { page?: number; limit?: number } = {}): Promise<any> {
    const response = await api.get(`/api/logs/user/${userId}`, { params });
    return response.data;
  },

  async getStats(params: { startDate?: string; endDate?: string } = {}): Promise<any> {
    const response = await api.get('/api/logs/stats', { params });
    return response.data;
  },
};