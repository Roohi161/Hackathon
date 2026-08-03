import { hackathonApi } from './hackathonApi';
import apiClient from './apiClient';
import type { Hackathon } from '../types/hackathon';
import type { Team } from '../types/team';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export { apiClient as api };

export async function getDbHealth() {
  try {
    const res = await apiClient.get<ApiResponse<unknown>>('/health');
    return res.data.data;
  } catch (err) {
    console.warn('⚠️ Backend health check failed:', err);
    return null;
  }
}

export async function getHackathonsFromDb() {
  try {
    return await hackathonApi.getAll();
  } catch (err) {
    console.warn('⚠️ Could not fetch hackathons:', err);
    return null;
  }
}

export async function saveHackathonToDb(hackathonData: Partial<Hackathon>) {
  try {
    return await hackathonApi.create(hackathonData);
  } catch (err) {
    console.warn('⚠️ Could not save hackathon:', err);
    return null;
  }
}

export async function saveTeamToDb(teamData: Partial<Team>) {
  try {
    const res = await apiClient.post<ApiResponse<Team>>('/teams', teamData);
    return res.data.data;
  } catch (err) {
    console.warn('⚠️ Could not save team:', err);
    return null;
  }
}

export default apiClient;
