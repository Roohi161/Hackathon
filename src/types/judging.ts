export interface Score {
  id: string;
  submissionId: string;
  judgeId: string;
  rubricId: string;
  value: number;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
  judgeName?: string;
}

export interface JudgeAssignment {
  id: string;
  hackathonId: string;
  judgeId: string;
  trackId?: string;
  assignedAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  submissionId: string;
  projectTitle: string;
  teamName: string;
  score: number;
  trackName?: string;
  isWinner: boolean;
}
