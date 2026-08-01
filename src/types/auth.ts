// Shared TypeScript Types & Interfaces

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'ORGANIZER' | 'JUDGE' | 'MENTOR' | 'PARTICIPANT' | 'VOLUNTEER' | 'SPONSOR' | 'REVIEWER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  isEmailVerified: boolean;
  profileComplete: boolean;
  education?: string;
  college?: string;
  skills: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  twitterUrl?: string;
  country?: string;
  city?: string;
  timezone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface LoginRequest {
  email: string;
  passwordHash?: string;
  password?: string;
}

export interface RegisterRequest {
  email: string;
  password?: string;
  name: string;
  role?: UserRole;
}
