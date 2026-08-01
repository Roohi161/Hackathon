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
  setRole: (role: UserRole) => void;
  setLoading: (loading: boolean) => void;
}

const STORAGE_KEYS = {
  USER: 'hc_auth_user',
  TOKENS: 'hc_auth_tokens',
  ROLE: 'hc_auth_role',
};

const getStoredState = () => {
  try {
    const rawUser = localStorage.getItem(STORAGE_KEYS.USER);
    const rawTokens = localStorage.getItem(STORAGE_KEYS.TOKENS);
    const rawRole = localStorage.getItem(STORAGE_KEYS.ROLE);

    const user = rawUser ? JSON.parse(rawUser) : null;
    const tokens = rawTokens ? JSON.parse(rawTokens) : null;
    const role = (rawRole as UserRole) || user?.role || 'PARTICIPANT';

    return {
      user,
      tokens,
      isAuthenticated: !!tokens?.accessToken,
      role,
    };
  } catch {
    return { user: null, tokens: null, isAuthenticated: false, role: 'PARTICIPANT' as UserRole };
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
      return { user: updatedUser };
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

  setRole: (role: UserRole) => {
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
    set({ role });
  },

  setLoading: (isLoading: boolean) => set({ isLoading }),
}));
