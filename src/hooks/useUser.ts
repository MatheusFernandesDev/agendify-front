import { useState, useCallback } from 'react';
import { userService } from '@/services/userService';
import { UserProfile, UpdateUserData } from '@/types/user';
import { User } from '@/types/auth';
import { toast } from 'sonner';

interface ListClientsParams {
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

interface UseUserReturn {
  // Estados de perfil do usuário logado
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  
  // Métodos de perfil do usuário logado
  fetchProfile: () => Promise<void>;
  updateProfile: (data: UpdateUserData) => Promise<boolean>;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
  
  // Estados para gerenciamento de clientes (Admin)
  clients: User[];
  pagination: any;
  
  // Métodos para gerenciamento de clientes (Admin)
  fetchClients: (params?: ListClientsParams) => Promise<void>;
  refreshClients: () => Promise<void>;
  createClient: (data: CreateUserData) => Promise<boolean>;
  updateClient: (id: string, data: Partial<UpdateUserData>) => Promise<boolean>;
  toggleClientStatus: (id: string) => Promise<boolean>;
  updateClientPermissions: (id: string, permissions: { appointments: boolean; logs: boolean }) => Promise<boolean>;
  deleteClient: (id: string) => Promise<boolean>;
}

export function useUser(): UseUserReturn {
  // Estados do perfil do usuário logado
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para lista de clientes (Admin)
  const [clients, setClients] = useState<User[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [lastParams, setLastParams] = useState<any>({});

  // ========== MÉTODOS DE PERFIL DO USUÁRIO LOGADO ==========

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await userService.getProfile();
      setProfile(response.data || null);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao buscar perfil';
      setError(message);
      toast.error(message, { position: "top-right" });
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: UpdateUserData) => {
    try {
      setLoading(true);
      const response = await userService.updateProfile(data);
      toast.success(response.message || 'Conta atualizada com sucesso');
      
      await fetchProfile();
      
      return true;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Erro ao atualizar perfil';
      toast.error(message, { position: "top-right" });
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchProfile]);

  const updatePassword = useCallback(async (oldPassword: string, newPassword: string) => {
    try {
      setLoading(true);
      const response = await userService.updatePassword(oldPassword, newPassword);
      toast.success(response.message || 'Senha atualizada com sucesso');
      return true;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Erro ao atualizar senha';
      toast.error(message, { position: "top-right" });
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // ========== MÉTODOS DE GERENCIAMENTO DE CLIENTES (ADMIN) ==========

  const fetchClients = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      setLastParams(params);

      const response = await userService.list(params);
      setClients(response.data.data);
      setPagination(response.data.pagination);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao buscar clientes';
      setError(message);
      toast.error(message, { position: "top-right" });
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshClients = useCallback(async () => {
    await fetchClients(lastParams);
  }, [fetchClients, lastParams]);

  const createClient = useCallback(async (data: CreateUserData) => {
    try {
      setLoading(true);
      const response = await userService.create(data);
      toast.success(response.message || 'Cliente criado com sucesso');
      
      await refreshClients();
      
      return true;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Erro ao criar cliente';
      toast.error(message, { position: "top-right" });
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshClients]);

  const updateClient = useCallback(async (id: string, data: Partial<UpdateUserData>) => {
    try {
      setLoading(true);
      const response = await userService.update(id, data);
      toast.success(response.message || 'Cliente atualizado com sucesso');
      
      // Atualiza o cliente na lista local
      setClients(prev => 
        prev.map(client => client.id === id && response.data ? response.data : client)
      );
      
      return true;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Erro ao atualizar cliente';
      toast.error(message, { position: "top-right" });
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleClientStatus = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const response = await userService.toggleStatus(id);
      toast.success(response.message || 'Status do cliente atualizado');
      
      // Atualiza o status do cliente na lista local
      setClients(prev =>
        prev.map(client => client.id === id && response.data ? response.data : client)
      );
      
      return true;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Erro ao atualizar status';
      toast.error(message, { position: "top-right" });
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateClientPermissions = useCallback(async (
    id: string, 
    permissions: { appointments: boolean; logs: boolean }
  ) => {
    try {
      setLoading(true);
      const response = await userService.updatePermissions(id, permissions);
      toast.success(response.message || 'Permissões atualizadas com sucesso');
      
      // Atualiza as permissões do cliente na lista local
      setClients(prev =>
        prev.map(client => client.id === id && response.data ? response.data : client)
      );
      
      return true;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Erro ao atualizar permissões';
      toast.error(message, { position: "top-right" });
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteClient = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const response = await userService.delete(id);
      toast.success(response.message || 'Cliente deletado com sucesso');
      
      // Remove o cliente da lista local
      setClients(prev => prev.filter(client => client.id !== id));
      
      return true;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Erro ao deletar cliente';
      toast.error(message, { position: "top-right" });
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // Perfil do usuário logado
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    updatePassword,
    
    // Gerenciamento de clientes (Admin)
    clients,
    pagination,
    fetchClients,
    refreshClients,
    createClient,
    updateClient,
    toggleClientStatus,
    updateClientPermissions,
    deleteClient,
  };
}