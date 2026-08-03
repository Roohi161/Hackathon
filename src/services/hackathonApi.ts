import apiClient from './apiClient';
import type { Hackathon } from '../types/hackathon';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export const hackathonApi = {
  getAll: async (params?: { skip?: number; take?: number; search?: string; category?: string; status?: string }): Promise<Hackathon[]> => {
    const res = await apiClient.get<ApiResponse<Hackathon[]>>('/hackathons', { params });
    return res.data.data;
  },

  getById: async (id: string): Promise<Hackathon> => {
    const res = await apiClient.get<ApiResponse<Hackathon>>(`/hackathons/${id}`);
    return res.data.data;
  },

  create: async (data: Partial<Hackathon>): Promise<Hackathon> => {
    const res = await apiClient.post<ApiResponse<Hackathon>>('/hackathons', data);
    return res.data.data;
  },

  update: async (id: string, data: Partial<Hackathon>): Promise<Hackathon> => {
    const res = await apiClient.patch<ApiResponse<Hackathon>>(`/hackathons/${id}`, data);
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/hackathons/${id}`);
  },

  clone: async (id: string): Promise<Hackathon> => {
    const res = await apiClient.post<ApiResponse<Hackathon>>(`/hackathons/${id}/clone`);
    return res.data.data;
  },
};
