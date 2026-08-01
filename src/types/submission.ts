export type SubmissionStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'EVALUATED' | 'DISQUALIFIED';

export interface SubmissionFile {
  id: string;
  submissionId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
}

export interface Submission {
  id: string;
  hackathonId: string;
  teamId: string;
  trackId?: string;
  submitterId: string;
  title: string;
  tagline?: string;
  description?: string;
  githubUrl?: string;
  demoUrl?: string;
  videoUrl?: string;
  presentationUrl?: string;
  techStack: string[];
  status: SubmissionStatus;
  averageScore?: number;
  isWinner: boolean;
  rank?: number;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
  files?: SubmissionFile[];
  teamName?: string;
  hackathonTitle?: string;
}
