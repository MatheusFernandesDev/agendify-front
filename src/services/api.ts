import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@Agendify:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isPasswordRoute = error.config.url.includes('/users/password')

    if (error.response?.status === 401) {
      if (isPasswordRoute) {
        return Promise.reject(error);
      }
      localStorage.removeItem('@Agendify:token');
      localStorage.removeItem('@Agendify:user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);