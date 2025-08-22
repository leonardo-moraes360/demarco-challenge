import { api } from './api';
import type { User } from '@/common/types/auth';

export interface CreateUserRequest {
  fullName: string;
  email: string;
  password: string;
  cpf: string;
  position: string;
  birthDate: string;
}

export interface UpdateUserRequest {
  fullName?: string;
  email?: string;
  position?: string;
  birthDate?: string;
  status?: 'active' | 'inactive';
}

export interface UsersResponse {
  data: User[];
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface UsersQueryParams {
  page?: number;
  page_size?: number;
  name?: string;
  cpf?: string;
  status?: 'active' | 'inactive';
}

export class UsersService {
  static async getUsers(params?: UsersQueryParams): Promise<UsersResponse> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
    }
    
    const queryString = searchParams.toString();
    const url = queryString ? `users?${queryString}` : 'users';
    
    return api.get(url).json<UsersResponse>();
  }

  static async getUser(id: string): Promise<User> {
    return api.get(`users/${id}`).json<User>();
  }

  static async createUser(data: CreateUserRequest): Promise<User> {
    return api.post('users', { json: data }).json<User>();
  }

  static async updateUser(id: string, data: UpdateUserRequest): Promise<User> {
    return api.patch(`users/${id}`, { json: data }).json<User>();
  }

  static async deleteUser(id: string): Promise<void> {
    return api.delete(`users/${id}`).json<void>();
  }
}
