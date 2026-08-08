import { useNotificationStore } from '../stores/notificationStore';
import type { Announcement } from '../types/notification';

const nowISO = () => new Date().toISOString();

const fire = (announcement: Omit<Announcement, 'id'> & { id?: string }) => {
  useNotificationStore.getState().addAnnouncement({
    ...announcement,
    id: announcement.id || `ann-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  });
};

export const notifyLogin = (userName: string, role: string) => {
  const label = String(role).toUpperCase() === 'ORGANIZER' ? 'Organizer' : 'Participant';
  fire({
    id: `ann-login-${Date.now()}`,
    hackathonId: 'platform',
    hackathonTitle: 'Hackathon Central Platform',
    title: `👋 Welcome back, ${userName || 'there'}!`,
    content: `Signed in successfully as ${label}. Your live activity feed is now synced.`,
    type: 'info',
    priority: 'LOW',
    createdAt: 'Just now',
  });
};

export const notifyNewHackathon = (hackathon: { id: string; title: string }) => {
  fire({
    id: `ann-new-hack-${hackathon.id}-${Date.now()}`,
    hackathonId: hackathon.id,
    hackathonTitle: hackathon.title,
    title: '🚀 New Hackathon Published!',
    content: `"${hackathon.title}" is now live and open for registrations. Check it out on the explore page.`,
    type: 'update',
    priority: 'HIGH',
    createdAt: 'Just now',
  });
};

export const notifyRegistrationSubmitted = (reg: {
  id: string;
  hackathonId: string;
  hackathonTitle: string;
  groupName: string;
}) => {
  fire({
    id: `ann-reg-submitted-${reg.id}`,
    hackathonId: reg.hackathonId,
    hackathonTitle: reg.hackathonTitle,
    title: `📝 Registration Received (UNDER REVIEW)`,
    content: `Your application "${reg.groupName}" for "${reg.hackathonTitle}" has been submitted and is now UNDER REVIEW by the organizer.`,
    type: 'info',
    priority: 'MEDIUM',
    createdAt: 'Just now',
  });
  fire({
    id: `ann-org-reg-${reg.id}`,
    hackathonId: reg.hackathonId,
    hackathonTitle: reg.hackathonTitle,
    title: `📥 New Registration Received`,
    content: `A new team "${reg.groupName}" has registered for "${reg.hackathonTitle}". Review it from the Registrations tab.`,
    type: 'update',
    priority: 'MEDIUM',
    createdAt: 'Just now',
  });
};

export const notifyRegistrationStatus = (reg: {
  id: string;
  hackathonId: string;
  hackathonTitle: string;
  groupName: string;
  status: string;
}) => {
  fire({
    id: `ann-reg-status-${reg.id}`,
    hackathonId: reg.hackathonId,
    hackathonTitle: reg.hackathonTitle,
    title: `Registration Status Update: ${reg.status}`,
    content: `Your registration for "${reg.hackathonTitle}" (${reg.groupName}) has been marked as ${reg.status}.`,
    type: reg.status === 'APPROVED' ? 'update' : 'critical',
    priority: reg.status === 'APPROVED' ? 'HIGH' : 'MEDIUM',
    createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });
};

export const notifyBroadcast = (title: string, content: string, hackathonTitle?: string, hackathonId?: string) => {
  fire({
    hackathonId: hackathonId || 'platform',
    hackathonTitle: hackathonTitle || 'Hackathon Central Platform',
    title: `📢 ${title}`,
    content,
    type: 'info',
    priority: 'HIGH',
    createdAt: 'Just now',
  });
};

export const notifyHackathonStarted = (hackathon: { id: string; title: string }) => {
  fire({
    id: `ann-started-${hackathon.id}`,
    hackathonId: hackathon.id,
    hackathonTitle: hackathon.title,
    title: '🏁 Hackathon Has Started!',
    content: `"${hackathon.title}" is now LIVE. The countdown is on — start building your project now!`,
    type: 'critical',
    priority: 'CRITICAL',
    createdAt: 'Just now',
  });
};

export const notifyHackathonEndingSoon = (hackathon: { id: string; title: string }, hoursLeft: number) => {
  fire({
    id: `ann-ending-soon-${hackathon.id}`,
    hackathonId: hackathon.id,
    hackathonTitle: hackathon.title,
    title: '⏰ Submission Deadline Approaching',
    content: `"${hackathon.title}" ends in ${hoursLeft < 1 ? 'under 1 hour' : `about ${hoursLeft} hour${hoursLeft === 1 ? '' : 's'}`}. Make sure your final submission is in!`,
    type: 'critical',
    priority: 'CRITICAL',
    createdAt: 'Just now',
  });
};

export const notifyHackathonEnded = (hackathon: { id: string; title: string }) => {
  fire({
    id: `ann-ended-${hackathon.id}`,
    hackathonId: hackathon.id,
    hackathonTitle: hackathon.title,
    title: '🏆 Hackathon Concluded',
    content: `"${hackathon.title}" has officially ended. Submissions are closed — results will be announced soon.`,
    type: 'update',
    priority: 'HIGH',
    createdAt: 'Just now',
  });
};

export const notifyIncomingMessage = (senderName: string, isDirect: boolean, text: string) => {
  fire({
    id: `ann-msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    hackathonId: 'platform',
    hackathonTitle: 'Organizer Connect Hub',
    title: `${isDirect ? '💬 New Direct Message' : '💬 New Message in Public Room'}`,
    content: `${senderName}: ${text.slice(0, 90)}${text.length > 90 ? '…' : ''}`,
    type: 'info',
    priority: 'MEDIUM',
    createdAt: 'Just now',
  });
};
