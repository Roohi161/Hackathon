export type UserRole = 'participant' | 'organizer' | 'judge' | 'admin';

export type HackathonStatus = 'live' | 'upcoming' | 'ended';
export type HackathonMode = 'online' | 'hybrid' | 'in-person';

export interface ProblemStatement {
  id: string;
  track: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
}

export interface RubricCriteria {
  id: string;
  name: string;
  description: string;
  weight: number; // percentage, e.g. 25
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface Team {
  id: string;
  name: string;
  leaderName: string;
  leaderEmail: string;
  inviteCode: string;
  members: TeamMember[];
  hackathonId: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  registeredAt: string;
  justification?: string;
  description?: string;
}

export interface JudgeScore {
  judgeName: string;
  rubricScores: Record<string, number>; // criterionId -> score (0-10)
  weightedTotal: number; // calculated total out of 100
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

export interface HackathonScheduleItem {
  time: string;
  event: string;
  description?: string;
}

export interface AuthenticatedUser {
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
}

export interface PrizeItem {
  title: string;
  amount: string;
  description?: string;
}

export interface Hackathon {
  id: string;
  title: string;
  tagline: string;
  banner: string;
  status: HackathonStatus;
  mode: HackathonMode;
  location: string;
  startDate: string;
  endDate: string;
  prizePool: string;
  prizeBreakdown: PrizeItem[];
  tracks: string[];
  problemStatements: ProblemStatement[];
  rubrics: RubricCriteria[];
  schedule: HackathonScheduleItem[];
  rules: string[];
  featured?: boolean;
  organizerName: string;
  organizerVerified?: boolean;
  participantsCount: number;
  teamsCount: number;
  description: string;
  tags: string[];
  difficulty?: string;
  imageGradient?: string;
  eligibility?: string[]; // e.g. ['Student', 'Professional', 'React', 'Python']
}

export interface Announcement {
  id: string;
  hackathonId: string;
  hackathonTitle: string;
  title: string;
  content: string;
  timestamp: string;
  type: 'critical' | 'info' | 'update';
}

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
