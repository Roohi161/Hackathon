import { create } from 'zustand';

export type Theme = 'light' | 'dark' | 'system';

interface UIState {
  theme: Theme;
  sidebarOpen: boolean;
  isTeamModalOpen: boolean;
  isSubmissionModalOpen: boolean;
  isTeamRegModalOpen: boolean;

  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTeamModalOpen: (open: boolean) => void;
  setSubmissionModalOpen: (open: boolean) => void;
  setTeamRegModalOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: (localStorage.getItem('hc_theme') as Theme) || 'light',
  sidebarOpen: true,
  isTeamModalOpen: false,
  isSubmissionModalOpen: false,
  isTeamRegModalOpen: false,

  setTheme: (theme: Theme) => {
    localStorage.setItem('hc_theme', theme);
    set({ theme });
  },
  toggleSidebar: () => set((state: UIState) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (sidebarOpen: boolean) => set({ sidebarOpen }),
  setTeamModalOpen: (isTeamModalOpen: boolean) => set({ isTeamModalOpen }),
  setSubmissionModalOpen: (isSubmissionModalOpen: boolean) => set({ isSubmissionModalOpen }),
  setTeamRegModalOpen: (isTeamRegModalOpen: boolean) => set({ isTeamRegModalOpen }),
}));
