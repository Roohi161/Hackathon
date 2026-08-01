import { create } from 'zustand';
import type { Team } from '../types/team';
import { INITIAL_TEAMS } from '../data/mockData';

interface TeamState {
  teams: Team[];
  myTeam: Team | null;
  isLoading: boolean;

  setTeams: (teams: Team[]) => void;
  setMyTeam: (team: Team | null) => void;
  addTeam: (team: Team) => void;
  updateTeam: (id: string, partial: Partial<Team>) => void;
  deleteTeam: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useTeamStore = create<TeamState>((set) => ({
  teams: INITIAL_TEAMS as unknown as Team[],
  myTeam: (INITIAL_TEAMS[0] as unknown as Team) || null,
  isLoading: false,

  setTeams: (teams: Team[]) => set({ teams }),
  setMyTeam: (myTeam: Team | null) => set({ myTeam }),
  addTeam: (team: Team) =>
    set((state: TeamState) => ({ teams: [team, ...state.teams], myTeam: team })),
  updateTeam: (id: string, partial: Partial<Team>) =>
    set((state: TeamState) => ({
      teams: state.teams.map((t: Team) => (t.id === id ? { ...t, ...partial } : t)),
      myTeam: state.myTeam?.id === id ? { ...state.myTeam, ...partial } : state.myTeam,
    })),
  deleteTeam: (id: string) =>
    set((state: TeamState) => ({
      teams: state.teams.filter((t: Team) => t.id !== id),
      myTeam: state.myTeam?.id === id ? null : state.myTeam,
    })),
  setLoading: (isLoading: boolean) => set({ isLoading }),
}));
