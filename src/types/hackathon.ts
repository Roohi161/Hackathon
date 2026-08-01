export type HackathonStatus = 'live' | 'upcoming' | 'ended' | 'DRAFT' | 'PUBLISHED' | 'REGISTRATION_OPEN' | 'REGISTRATION_CLOSED' | 'IN_PROGRESS' | 'EVALUATION' | 'COMPLETED' | 'ARCHIVED' | 'CANCELLED';
export type HackathonMode = 'online' | 'hybrid' | 'in-person' | 'ONLINE' | 'HYBRID' | 'IN_PERSON';
export type HackathonVisibility = 'PUBLIC' | 'PRIVATE' | 'INVITE_ONLY';

export interface ProblemStatement {
  id: string;
  hackathonId?: string;
  track?: string;
  trackId?: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  sortOrder?: number;
}

export interface RubricCriteria {
  id: string;
  hackathonId?: string;
  name: string;
  description?: string;
  weight: number;
  maxScore?: number;
  sortOrder?: number;
}

export interface HackathonScheduleItem {
  id?: string;
  hackathonId?: string;
  time?: string;
  event?: string;
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  sortOrder?: number;
}

export interface PrizeItem {
  id?: string;
  hackathonId?: string;
  title: string;
  amount?: string;
  description?: string;
  rank?: number;
}

export interface FAQItem {
  id?: string;
  hackathonId?: string;
  question: string;
  answer: string;
  sortOrder?: number;
}

export interface HackathonTrack {
  id: string;
  hackathonId: string;
  name: string;
  description?: string;
  color?: string;
}

export interface Hackathon {
  id: string;
  title: string;
  slug?: string;
  tagline?: string;
  description?: string;
  banner?: string;
  status: HackathonStatus;
  mode: HackathonMode;
  visibility?: HackathonVisibility;
  location?: string;
  timezone?: string;
  featured?: boolean;
  registrationStart?: string;
  registrationEnd?: string;
  startDate?: string;
  endDate?: string;
  submissionDeadline?: string;
  evaluationStart?: string;
  evaluationEnd?: string;
  maxTeamSize?: number;
  minTeamSize?: number;
  maxParticipants?: number;
  prizePool?: string;
  prizeBreakdown?: PrizeItem[];
  allowLateSubmission?: boolean;
  requireApproval?: boolean;
  enableBlindJudging?: boolean;
  category?: string;
  tags?: string[];
  rules?: string[];
  eligibility?: string[];
  website?: string;
  organizerId?: string;
  organizerName?: string;
  organizerVerified?: boolean;
  participantsCount?: number;
  teamsCount?: number;
  tracks?: any[];
  problemStatements?: ProblemStatement[];
  rubrics?: RubricCriteria[];
  schedule?: HackathonScheduleItem[];
  prizes?: PrizeItem[];
  faqs?: FAQItem[];
  createdAt?: string;
  updatedAt?: string;
}
