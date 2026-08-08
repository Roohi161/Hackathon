export type NotificationType = 'SYSTEM' | 'HACKATHON' | 'TEAM' | 'SUBMISSION' | 'JUDGING' | 'ANNOUNCEMENT' | 'CERTIFICATE' | 'GENERAL';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export type AnnouncementPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Announcement {
  id: string;
  hackathonId: string;
  hackathonTitle?: string;
  title: string;
  content: string;
  priority?: AnnouncementPriority;
  isPinned?: boolean;
  isRead?: boolean;
  createdAt?: string;
  updatedAt?: string;
  timestamp?: string;
  type?: 'critical' | 'info' | 'update';
}
