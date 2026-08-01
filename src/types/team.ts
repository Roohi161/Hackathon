import type { User } from './auth';

export type TeamStatus = 'Approved' | 'Pending' | 'Rejected' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'DISBANDED';
export type TeamMemberRole = string;
export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED';

export interface TeamMember {
  id?: string;
  name?: string;
  email?: string;
  teamId?: string;
  userId?: string;
  role: TeamMemberRole;
  avatar?: string;
  joinedAt?: string;
  user?: User;
}

export interface TeamInvitation {
  id: string;
  teamId: string;
  senderId: string;
  recipientId?: string;
  recipientEmail?: string;
  status: InvitationStatus;
  message?: string;
  expiresAt: string;
  createdAt: string;
}

export interface Team {
  id: string;
  name: string;
  hackathonId: string;
  leaderName?: string;
  leaderEmail?: string;
  description?: string;
  justification?: string;
  inviteCode?: string;
  status: TeamStatus;
  members: TeamMember[];
  invitations?: TeamInvitation[];
  registeredAt?: string;
  createdAt?: string;
  updatedAt?: string;
}
