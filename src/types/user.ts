import { User } from "./auth";

export interface UserProfile extends User {
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserData {
  name?: string;
  surname?: string;
  email?: string;
  password?: string;
  cep?: string;
  address?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
}

// src/types/api.ts
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  timestamp?: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  message: string;
  data: {
    data: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: any;
}