import apiClient from './apiClient';

export const registrationApi = {
  getAll: async (): Promise<any[]> => {
    const res: any = await apiClient.get('/registrations');
    return Array.isArray(res) ? res : (res?.data?.data || res?.data || []);
  },

  create: async (data: any): Promise<any> => {
    const res: any = await apiClient.post('/registrations', data);
    return res?.data?.data || res?.data || res;
  },

  updateStatus: async (id: string, status: string): Promise<any> => {
    const res: any = await apiClient.patch(`/registrations/${id}`, { status });
    return res?.data?.data || res?.data || res;
  },
};
