import apiClient from './apiClient';
import type { Hackathon } from '../types/hackathon';

export const hackathonApi = {
  getAll: async (params?: { skip?: number; take?: number; search?: string; category?: string; status?: string }): Promise<Hackathon[]> => {
    const res: any = await apiClient.get('/hackathons', { params });
    return res.data || res;
  },

  getById: async (id: string): Promise<Hackathon> => {
    const res: any = await apiClient.get(`/hackathons/${id}`);
    return res.data || res;
  },

  create: async (data: Partial<Hackathon>): Promise<Hackathon> => {
    const res: any = await apiClient.post('/hackathons', data);
    return res.data || res;
  },

  update: async (id: string, data: Partial<Hackathon>): Promise<Hackathon> => {
    const res: any = await apiClient.patch(`/hackathons/${id}`, data);
    return res.data || res;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/hackathons/${id}`);
  },

  clone: async (id: string): Promise<Hackathon> => {
    const res: any = await apiClient.post(`/hackathons/${id}/clone`);
    return res.data || res;
  },
};
