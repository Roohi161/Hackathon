import apiClient from './apiClient';
import type { LoginRequest, RegisterRequest, AuthResponse, User } from '../types/auth';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const res: any = await apiClient.post('/auth/login', credentials);
    return res.data || res;
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const res: any = await apiClient.post('/auth/register', userData);
    return res.data || res;
  },

  refreshToken: async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
    const res: any = await apiClient.post('/auth/refresh', { refreshToken });
    return res.data || res;
  },

  getProfile: async (): Promise<User> => {
    const res: any = await apiClient.get('/users/me');
    return res.data || res;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const res: any = await apiClient.patch('/users/me', data);
    return res.data || res;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },
};
