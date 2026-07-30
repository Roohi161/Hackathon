import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token to every request if authenticated
api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface DbHealth {
  status: string;
  database: string;
  timestamp: string;
  dbName: string;
  version: string;
}

// Named helper functions for PostgreSQL DDL / DML operations
export async function getDbHealth(): Promise<DbHealth | null> {
  try {
    const res = await api.get('/api/health');
    return res.data;
  } catch (err) {
    console.warn('⚠️ PostgreSQL Backend API not reachable, using offline mode:', err);
    return null;
  }
}

export async function getHackathonsFromDb() {
  try {
    const res = await api.get('/api/hackathons');
    return res.data;
  } catch (err) {
    console.warn('⚠️ Could not fetch hackathons from PostgreSQL:', err);
    return null;
  }
}

export async function saveHackathonToDb(hackathonData: any) {
  try {
    const res = await api.post('/api/hackathons', hackathonData);
    return res.data;
  } catch (err) {
    console.warn('⚠️ Could not save hackathon to PostgreSQL:', err);
    return null;
  }
}

export async function deleteHackathonFromDb(id: string) {
  try {
    const res = await api.delete(`/api/hackathons/${id}`);
    return res.status === 200;
  } catch (err) {
    console.warn('⚠️ Could not delete hackathon from PostgreSQL:', err);
    return false;
  }
}

export async function getJudgesFromDb() {
  try {
    const res = await api.get('/api/judges');
    return res.data;
  } catch (err) {
    console.warn('⚠️ Could not fetch judges from PostgreSQL:', err);
    return null;
  }
}

export async function saveJudgeToDb(judgeData: any) {
  try {
    const res = await api.post('/api/judges', judgeData);
    return res.data;
  } catch (err) {
    console.warn('⚠️ Could not save judge to PostgreSQL:', err);
    return null;
  }
}

export async function deleteJudgeFromDb(id: string) {
  try {
    const res = await api.delete(`/api/judges/${id}`);
    return res.status === 200;
  } catch (err) {
    console.warn('⚠️ Could not delete judge from PostgreSQL:', err);
    return false;
  }
}

export async function getOrganizersFromDb() {
  try {
    const res = await api.get('/api/organizers');
    return res.data;
  } catch (err) {
    console.warn('⚠️ Could not fetch organizers from PostgreSQL:', err);
    return null;
  }
}

export async function saveOrganizerToDb(orgData: any) {
  try {
    const res = await api.post('/api/organizers', orgData);
    return res.data;
  } catch (err) {
    console.warn('⚠️ Could not save organizer to PostgreSQL:', err);
    return null;
  }
}

export async function saveTeamToDb(teamData: any) {
  try {
    const res = await api.post('/api/teams', teamData);
    return res.data;
  } catch (err) {
    console.warn('⚠️ Could not save team to PostgreSQL:', err);
    return null;
  }
}

export default api;
