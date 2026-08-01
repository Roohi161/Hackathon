export * from './auth';
export * from './common';
export * from './hackathon';
export * from './team';
export * from './submission';
export * from './judging';
export * from './notification';

// Legacy compatibility exports
export type AuthenticatedUser = {
  name: string;
  email: string;
  avatar: string;
  role?: string;
  profileComplete?: boolean;
  education?: string;
  college?: string;
  bio?: string;
  skills?: string[];
  githubUrl?: string;
  github?: string;
  linkedinUrl?: string;
};

export interface OrganizerVerificationRequest {
  id: string;
  organizerName: string;
  organization: string;
  email: string;
  website: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface ProjectTeamMember {
  name: string;
  role: string;
  avatar: string;
  github?: string;
  linkedin?: string;
}

export interface JudgeScore {
  judgeName: string;
  rubricScores: Record<string, number>;
  weightedTotal: number;
  feedback: string;
  evaluatedAt: string;
}

export interface ProjectSubmission {
  id: string;
  hackathonId: string;
  hackathonTitle: string;
  title: string;
  tagline: string;
  description: string;
  repoUrl: string;
  videoUrl: string;
  techStack: string[];
  teamName: string;
  members: string[];
  track: string;
  submittedAt: string;
  scores: JudgeScore[];
  averageScore?: number;
  evaluated: boolean;
  mockCodeSnippet?: string;
}
