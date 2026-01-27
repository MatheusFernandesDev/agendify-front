import { useState, useCallback } from 'react';
import { logService } from '@/services/logService';
import { Log, LogFilters } from '@/types/log';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

interface UseLogsReturn {
  logs: Log[];
  loading: boolean;
  error: string | null;
  pagination: any;
  fetchLogs: (params?: LogFilters & { page?: number; limit?: number }) => Promise<void>;
  refreshLogs: () => Promise<void>;
}

export function useLogs(): UseLogsReturn {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [lastParams, setLastParams] = useState<any>({});

  const { user } = useAuth();

  const fetchLogs = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      setLastParams(params);
      console.log(user);

      if(user?.role !== 'ADMIN') {
        console.log(user?.id);
        const response = await logService.getByUser(user?.id as string, params);
        setLogs(response.data.data);
        setPagination(response.data.pagination);
        return;
      }
      const response = await logService.list(params);

      setLogs(response.data.data);
      setPagination(response.data.pagination);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao buscar logs';
      setError(message);
      toast.error(message, { position: 'top-right' });
    } finally {
      setLoading(false);
    }
  }, [user]);

  const refreshLogs = useCallback(async () => {
    await fetchLogs(lastParams);
  }, [fetchLogs, lastParams]);

  return {
    logs,
    loading,
    error,
    pagination,
    fetchLogs,
    refreshLogs,
  };
}