import { create } from 'zustand';
import type { Hackathon } from '../types/hackathon';
import { INITIAL_HACKATHONS } from '../data/mockData';
import { hackathonApi } from '../services/hackathonApi';

interface HackathonState {
  hackathons: Hackathon[];
  selectedHackathon: Hackathon | null;
  isLoading: boolean;
  searchQuery: string;
  selectedCategory: string;
  selectedStatus: string;

  fetchHackathons: () => Promise<void>;
  setHackathons: (hackathons: Hackathon[]) => void;
  selectHackathon: (hackathon: Hackathon | null) => void;
  addHackathon: (hackathon: Hackathon) => void;
  updateHackathon: (id: string, partial: Partial<Hackathon>) => void;
  deleteHackathon: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedStatus: (status: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useHackathonStore = create<HackathonState>((set) => ({
  hackathons: INITIAL_HACKATHONS as unknown as Hackathon[],
  selectedHackathon: (INITIAL_HACKATHONS[0] as unknown as Hackathon) || null,
  isLoading: false,
  searchQuery: '',
  selectedCategory: 'all',
  selectedStatus: 'all',

  fetchHackathons: async () => {
    set({ isLoading: true });
    try {
      const res = await hackathonApi.getAll();
      const list = Array.isArray(res) ? res : ((res as any)?.items || []);
      if (list && list.length > 0) {
        set({ hackathons: list as any, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  setHackathons: (hackathons: Hackathon[]) => set({ hackathons }),
  selectHackathon: (selectedHackathon: Hackathon | null) => set({ selectedHackathon }),
  addHackathon: (hackathon: Hackathon) =>
    set((state: HackathonState) => ({ hackathons: [hackathon, ...state.hackathons] })),
  updateHackathon: (id: string, partial: Partial<Hackathon>) =>
    set((state: HackathonState) => ({
      hackathons: state.hackathons.map((h: Hackathon) =>
        h.id === id ? { ...h, ...partial } : h
      ),
      selectedHackathon:
        state.selectedHackathon?.id === id
          ? { ...state.selectedHackathon, ...partial }
          : state.selectedHackathon,
    })),
  deleteHackathon: (id: string) =>
    set((state: HackathonState) => ({
      hackathons: state.hackathons.filter((h: Hackathon) => h.id !== id),
      selectedHackathon:
        state.selectedHackathon?.id === id ? null : state.selectedHackathon,
    })),
  setSearchQuery: (searchQuery: string) => set({ searchQuery }),
  setSelectedCategory: (selectedCategory: string) => set({ selectedCategory }),
  setSelectedStatus: (selectedStatus: string) => set({ selectedStatus }),
  setLoading: (isLoading: boolean) => set({ isLoading }),
}));
