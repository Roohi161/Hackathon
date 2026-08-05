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
  hackathonId?: string;
  name: string;
  description?: string;
  color?: string;
}

export interface HackathonSponsor {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  tier: 'Title' | 'Platinum' | 'Gold' | 'Silver' | 'Community' | 'Partner';
  description?: string;
}

export interface HackathonJudge {
  id: string;
  name: string;
  company?: string;
  designation?: string;
  expertise?: string;
  linkedin?: string;
  avatar?: string;
}

export interface HackathonMentor {
  id: string;
  name: string;
  company?: string;
  skills?: string;
  availability?: string;
  bio?: string;
  avatar?: string;
}

export interface SubmissionConfig {
  github: 'required' | 'optional' | 'disabled';
  demoUrl: 'required' | 'optional' | 'disabled';
  videoUrl: 'required' | 'optional' | 'disabled';
  presentation: 'required' | 'optional' | 'disabled';
  apkUpload: 'required' | 'optional' | 'disabled';
  zipUpload: 'required' | 'optional' | 'disabled';
  documentation: 'required' | 'optional' | 'disabled';
  techStack: 'required' | 'optional' | 'disabled';
  aiDeclaration: 'required' | 'optional' | 'disabled';
}

export interface CertificateSettings {
  enabled: boolean;
  templateName: string;
  signatureTitle: string;
  enableQrVerification: boolean;
}

export interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
}

export interface Hackathon {
  id: string;
  title: string;
  slug?: string;
  tagline?: string;
  description?: string;
  shortDescription?: string;
  detailedDescription?: string;
  logo?: string;
  banner?: string;
  coverImage?: string;
  status: HackathonStatus;
  mode: HackathonMode;
  visibility?: HackathonVisibility;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  category?: string;
  subcategory?: string;
  timezone?: string;
  language?: string;
  country?: string;
  state?: string;
  city?: string;
  location?: string;
  venue?: string;
  mapsUrl?: string;
  featured?: boolean;
  registrationStart?: string;
  registrationEnd?: string;
  teamFormationDeadline?: string;
  startDate?: string;
  endDate?: string;
  submissionDeadline?: string;
  evaluationStart?: string;
  evaluationEnd?: string;
  winnerAnnouncementDate?: string;
  certDistributionDate?: string;
  maxTeamSize?: number;
  minTeamSize?: number;
  maxParticipants?: number;
  registrationFee?: string;
  requireApproval?: boolean;
  isInviteOnly?: boolean;
  isWaitlistEnabled?: boolean;
  audience?: 'Everyone' | 'Students' | 'Professionals';
  requiredSkills?: string[];
  prerequisites?: string;
  prizePool?: string;
  prizeBreakdown?: PrizeItem[];
  allowLateSubmission?: boolean;
  enableBlindJudging?: boolean;
  tags?: string[];
  rules?: string[];
  eligibility?: string[];
  website?: string;
  supportEmail?: string;
  supportPhone?: string;
  socialLinks?: {
    twitter?: string;
    discord?: string;
    linkedin?: string;
    github?: string;
  };
  organizerId?: string;
  organizerName?: string;
  organizerVerified?: boolean;
  participantsCount?: number;
  teamsCount?: number;
  tracks?: (string | HackathonTrack)[];
  problemStatements?: ProblemStatement[];
  rubrics?: RubricCriteria[];
  schedule?: HackathonScheduleItem[];
  prizes?: PrizeItem[];
  sponsors?: HackathonSponsor[];
  judges?: HackathonJudge[];
  mentors?: HackathonMentor[];
  faqs?: FAQItem[];
  submissionConfig?: SubmissionConfig;
  certificateSettings?: CertificateSettings;
  seoSettings?: SEOSettings;
  createdAt?: string;
  updatedAt?: string;
}
