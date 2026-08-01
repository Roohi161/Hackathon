import { hackathonApi } from './hackathonApi';
import apiClient from './apiClient';

export { apiClient as api };

export async function getDbHealth() {
  try {
    const res: any = await apiClient.get('/health');
    return res.data || res;
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

export async function saveHackathonToDb(hackathonData: any) {
  try {
    return await hackathonApi.create(hackathonData);
  } catch (err) {
    console.warn('⚠️ Could not save hackathon:', err);
    return null;
  }
}

export async function saveTeamToDb(teamData: any) {
  try {
    const res: any = await apiClient.post('/teams', teamData);
    return res.data || res;
  } catch (err) {
    console.warn('⚠️ Could not save team:', err);
    return null;
  }
}

export default apiClient;
