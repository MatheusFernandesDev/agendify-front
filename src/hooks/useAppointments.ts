import { useState, useCallback } from 'react';
import { appointmentService } from '@/services/appointmentService';
import {
  Appointment,
  CreateAppointmentData,
  UpdateAppointmentData,
  AppointmentFilters,
} from '@/types/appointment';
import { toast } from 'sonner';

interface UseAppointmentsReturn {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  fetchAppointments: (params?: AppointmentFilters & { page?: number; limit?: number }) => Promise<void>;
  createAppointment: (data: CreateAppointmentData) => Promise<Appointment | null>;
  updateAppointment: (id: string, data: UpdateAppointmentData) => Promise<Appointment | null>;
  cancelAppointment: (id: string) => Promise<boolean>;
  confirmAppointment: (id: string) => Promise<Appointment | null>;
  deleteAppointment: (id: string) => Promise<boolean>;
  refreshAppointments: () => Promise<void>;
}

export function useAppointments(): UseAppointmentsReturn {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [lastParams, setLastParams] = useState<any>({});

  const fetchAppointments = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      setLastParams(params);

      const response = await appointmentService.list(params);

      setAppointments(response.data.data);
      setPagination(response.data.pagination);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao buscar agendamentos';
      setError(message);
      toast.error(message, { position: 'top-right' });
    } finally {
      setLoading(false);
    }
  }, []);

  const createAppointment = useCallback(async (data: CreateAppointmentData): Promise<Appointment | null> => {
    try {
      setLoading(true);
      const response = await appointmentService.create(data);
      toast.success(response.message || 'Agendamento criado com sucesso', { position: 'top-right' });
      
      // Recarrega a lista
      await fetchAppointments(lastParams);
      
      // Garanta que seja Appointment | null (cast seguro, assumindo que response.data é Appointment em sucesso)
      return response.data as Appointment;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao criar agendamento';
      toast.error(message, { position: 'top-right' });
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchAppointments, lastParams]);

  const updateAppointment = useCallback(async (id: string, data: UpdateAppointmentData): Promise<Appointment | null> => {
    try {
      setLoading(true);
      const response = await appointmentService.update(id, data);
      toast.success(response.message || 'Agendamento atualizado com sucesso', { position: 'top-right' });
      
      await fetchAppointments(lastParams);
      
      return response.data as Appointment;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao atualizar agendamento';
      toast.error(message, { position: 'top-right' });
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchAppointments, lastParams]);

  const cancelAppointment = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      await appointmentService.cancel(id);
      toast.success('Agendamento cancelado com sucesso', { position: 'top-right' });
      
      await fetchAppointments(lastParams);
      
      return true;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao cancelar agendamento';
      toast.error(message, { position: 'top-right' });
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchAppointments, lastParams]);

  const confirmAppointment = useCallback(async (id: string): Promise<Appointment | null> => {
    try {
      setLoading(true);
      const response = await appointmentService.confirm(id);
      toast.success(response.message || 'Agendamento confirmado com sucesso', { position: 'top-right' });
      
      await fetchAppointments(lastParams);
      
      return response.data as Appointment;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao confirmar agendamento';
      toast.error(message, { position: 'top-right' });
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchAppointments, lastParams]);

  const deleteAppointment = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      await appointmentService.delete(id);
      toast.success('Agendamento deletado com sucesso', { position: 'top-right' });
      
      await fetchAppointments(lastParams);
      
      return true;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao deletar agendamento';
      toast.error(message, { position: 'top-right' });
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchAppointments, lastParams]);

  const refreshAppointments = useCallback(async (): Promise<void> => {
    await fetchAppointments(lastParams);
  }, [fetchAppointments, lastParams]);

  return {
    appointments,
    loading,
    error,
    pagination,
    fetchAppointments,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    confirmAppointment,
    deleteAppointment,
    refreshAppointments,
  };
}