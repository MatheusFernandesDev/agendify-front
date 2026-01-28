export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: 'cliente' | 'admin';
  cep?: string;
  address?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  createdAt: string;
    permissions: {
    appointments: boolean;
    logs: boolean;
  };
  isActive: boolean
 
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  surname: string;
  email: string;
  password: string;
  cep: string;
  address?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
}