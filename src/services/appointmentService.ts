import { api } from './api';
import {
  Appointment,
  CreateAppointmentData,
  UpdateAppointmentData,
  AppointmentFilters,
  AppointmentStats,
} from '@/types/appointment';
import { ApiResponse, PaginatedResponse } from '../types/user';

interface ListAppointmentsParams extends AppointmentFilters {
  page?: number;
  limit?: number;
}

export const appointmentService = {
  async list(params: ListAppointmentsParams = {
    date: ''
  }): Promise<PaginatedResponse<Appointment>> {
    const response = await api.get('/api/appointments', { params });
    return response.data;
  },

  async getById(id: string): Promise<ApiResponse<Appointment>> {
    const response = await api.get(`/api/appointments/${id}`);
    return response.data;
  },

  async create(data: CreateAppointmentData): Promise<ApiResponse<Appointment>> {
    const response = await api.post('/api/appointments', data);
    return response.data;
  },

  async update(id: string, data: UpdateAppointmentData): Promise<ApiResponse<Appointment>> {
    const response = await api.put(`/api/appointments/${id}`, data);
    return response.data;
  },

  async cancel(id: string): Promise<ApiResponse> {
    const response = await api.patch(`/api/appointments/${id}/cancel`);
    return response.data;
  },

  async confirm(id: string): Promise<ApiResponse<Appointment>> {
    const response = await api.patch(`/api/appointments/${id}/confirm`);
    return response.data;
  },

  async delete(id: string): Promise<ApiResponse> {
    const response = await api.delete(`/api/appointments/${id}`);
    return response.data;
  },

  async getMyAppointments(params: { page?: number; limit?: number; status?: string } = {}): Promise<PaginatedResponse<Appointment>> {
    const response = await api.get('/api/appointments/my-appointments', { params });
    return response.data;
  },

  async getByDate(date: string): Promise<ApiResponse<Appointment[]>> {
    const response = await api.get(`/api/appointments/by-date/${date}`);
    return response.data;
  },

  async getByRoom(room: string, params: { dateFrom?: string; dateTo?: string } = {}): Promise<ApiResponse<Appointment[]>> {
    const response = await api.get(`/api/appointments/by-room/${room}`, { params });
    return response.data;
  },

  async getStats(): Promise<ApiResponse<AppointmentStats>> {
    const response = await api.get('/api/appointments/stats');
    return response.data;
  },

  async getRooms(): Promise<ApiResponse<string[]>> {
    const response = await api.get('/api/appointments/rooms');
    return response.data;
  },
}