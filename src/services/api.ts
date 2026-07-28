const API_BASE_URL = 'http://localhost:5000/api';

export interface DbHealth {
  status: string;
  database: string;
  timestamp: string;
  dbName: string;
  version: string;
}

// 1. Health Check & PostgreSQL Info
export async function getDbHealth(): Promise<DbHealth | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('⚠️ PostgreSQL Backend API not reachable, using offline mode:', err);
    return null;
  }
}

// 2. Hackathons API
export async function getHackathonsFromDb() {
  try {
    const res = await fetch(`${API_BASE_URL}/hackathons`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('⚠️ Could not fetch hackathons from PostgreSQL:', err);
    return null;
  }
}

export async function saveHackathonToDb(hackathonData: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/hackathons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hackathonData)
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('⚠️ Could not save hackathon to PostgreSQL:', err);
    return null;
  }
}

// 3. Judges API
export async function getJudgesFromDb() {
  try {
    const res = await fetch(`${API_BASE_URL}/judges`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('⚠️ Could not fetch judges from PostgreSQL:', err);
    return null;
  }
}

export async function saveJudgeToDb(judgeData: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/judges`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(judgeData)
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('⚠️ Could not save judge to PostgreSQL:', err);
    return null;
  }
}

export async function deleteJudgeFromDb(id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/judges/${id}`, { method: 'DELETE' });
    return res.ok;
  } catch (err) {
    console.warn('⚠️ Could not delete judge from PostgreSQL:', err);
    return false;
  }
}

// 4. Organizers API
export async function getOrganizersFromDb() {
  try {
    const res = await fetch(`${API_BASE_URL}/organizers`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('⚠️ Could not fetch organizers from PostgreSQL:', err);
    return null;
  }
}

export async function saveOrganizerToDb(orgData: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/organizers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orgData)
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('⚠️ Could not save organizer to PostgreSQL:', err);
    return null;
  }
}

// 5. Teams API
export async function saveTeamToDb(teamData: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/teams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teamData)
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('⚠️ Could not save team to PostgreSQL:', err);
    return null;
  }
}
