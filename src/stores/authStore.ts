import { create } from 'zustand';
import type { User, UserRole, AuthTokens } from '../types/auth';

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  role: UserRole;
  isLoading: boolean;

  setAuth: (user: User, tokens: AuthTokens) => void;
  updateUser: (partialUser: Partial<User>) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

const STORAGE_KEYS = {
  USER: 'hc_auth_user',
  TOKENS: 'hc_auth_tokens',
  ROLE: 'hc_auth_role',
};

const getStoredState = (): Pick<AuthState, 'user' | 'tokens' | 'isAuthenticated' | 'role'> => {
  try {
    const rawUser = localStorage.getItem(STORAGE_KEYS.USER);
    const rawTokens = localStorage.getItem(STORAGE_KEYS.TOKENS);

    const user: User | null = rawUser ? JSON.parse(rawUser) : null;
    const tokens: AuthTokens | null = rawTokens ? JSON.parse(rawTokens) : null;

    // Role is ALWAYS derived from the stored user object — single source of truth
    const role: UserRole = user?.role || 'PARTICIPANT';

    return {
      user,
      tokens,
      isAuthenticated: !!tokens?.accessToken && !!user,
      role,
    };
  } catch {
    return { user: null, tokens: null, isAuthenticated: false, role: 'PARTICIPANT' };
  }
};

const initialState = getStoredState();

export const useAuthStore = create<AuthState>((set) => ({
  ...initialState,
  isLoading: false,

  setAuth: (user: User, tokens: AuthTokens) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(tokens));
    localStorage.setItem(STORAGE_KEYS.ROLE, user.role);

    set({
      user,
      tokens,
      isAuthenticated: true,
      role: user.role,
      isLoading: false,
    });
  },

  updateUser: (partialUser: Partial<User>) => {
    set((state: AuthState) => {
      if (!state.user) return state;
      const updatedUser = { ...state.user, ...partialUser };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      // If role was updated via updateUser, sync it
      const newRole = updatedUser.role || state.role;
      localStorage.setItem(STORAGE_KEYS.ROLE, newRole);
      return { user: updatedUser, role: newRole };
    });
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKENS);
    localStorage.removeItem(STORAGE_KEYS.ROLE);

    set({
      user: null,
      tokens: null,
      isAuthenticated: false,
      role: 'PARTICIPANT',
      isLoading: false,
    });
  },

  setLoading: (isLoading: boolean) => set({ isLoading }),
}));
