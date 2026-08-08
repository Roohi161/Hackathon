import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Users,
  Award,
  BarChart3,
  Sparkles,
  Clock,
  Megaphone,
  Layers,
  Bell,
  Calendar as CalendarIcon,
  CheckCircle,
  Plus,
  Settings,
  Scale,
  MessageSquare,
  Globe,
  Share2,
  ChevronDown,
  X,
  UserCheck,
  Send,
  Building2,
  Mail,
  ShieldCheck,
  Zap,
  Check,
  LogOut,
  RefreshCw,
  ChevronRight
} from 'lucide-react';
import type { Hackathon, Team, Announcement } from '../../types';
import { useHackathonStore } from '../../stores/hackathonStore';
import { useTeamStore } from '../../stores/teamStore';
import { useNotificationStore } from '../../stores/notificationStore';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { useToastStore } from '../../stores/toastStore';
import { CreateHackathonWizard } from './CreateHackathonWizard';
import { ProgressRing } from '../ui/ProgressRing';
import { BarChart } from '../ui/BarChart';
import { hackathonApi } from '../../services/hackathonApi';
import { registrationApi } from '../../services/registrationApi';
import {
  notifyNewHackathon,
  notifyRegistrationStatus,
  notifyBroadcast,
  notifyIncomingMessage
} from '../../services/notificationService';
import { NotificationDrawer } from '../NotificationDrawer';
import { useDeadlineWatcher } from '../../hooks/useDeadlineWatcher';
import { useOrganizerChatStore } from '../../stores/organizerChatStore';
import type { ChatMessage } from '../../stores/organizerChatStore';

interface OrganizerWorkspaceProps {
  hackathons?: Hackathon[];
  teams?: Team[];
  announcements?: Announcement[];
  onCreateHackathon?: (hackathon: Hackathon) => void;
  onDeleteHackathon?: (hackathonId: string) => void;
  onUpdateTeamStatus?: (teamId: string, status: 'Approved' | 'Rejected') => void;
  onBroadcastAnnouncement?: (announcement: Announcement) => void;
}

interface Contact {
  id: string;
  name: string;
  org: string;
  label: string;
  avatar: string;
}

const CONTACTS: Contact[] = [
  {
    id: 'elena',
    name: 'Elena Rostova',
    org: 'Vercel India Hub',
    label: 'Elena Rostova (Vercel India Hub)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'suresh',
    name: 'Suresh Kumar',
    org: 'Apex Bank Labs',
    label: 'Suresh Kumar (Apex Bank Labs)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'ananya',
    name: 'Ananya Sharma',
    org: 'GreenTech Coalition',
    label: 'Ananya Sharma (GreenTech Coalition)',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
  }
];

const REPLY_POOLS: Record<string, string[]> = {
  elena: [
    'Sounds good! We can coordinate the prize date to avoid overlap with your September window.',
    'Great point — let me sync with my team on the Web3 sprint timeline and get back to you.',
    'That works for us. I will block out the same week so there is no collision on the calendar.',
    'Noted! Happy to cross-promote registrations if you share your event link.'
  ],
  suresh: [
    'We are planning mid-November too, so let us align the dates before we publish.',
    'Agreed, better to keep a clear gap between our FinTech Disrupt and your event.',
    'Will update the shared calendar today. Thanks for flagging it!',
    'That timeline works for Apex Bank Labs. Let us coordinate sponsor overlap as well.'
  ],
  ananya: [
    'Great idea — our Smart Cities hackathon is flexible, we can shift to match.',
    'Perfect, we will move our demo day so students can join both events back-to-back.',
    'Happy to collaborate on a joint mentorship session between the two hackathons.',
    'Noted! We will update the coordination sheet with the new dates.'
  ]
};

const GENERIC_REPLIES = [
  'Thanks for sharing, that makes sense!',
  'Agreed — let us keep the calendar in sync.',
  'Sounds great, I will take it up with our organizing team.',
  'Perfect, noted and confirmed on our side.'
];

const lastReplies: Record<string, string> = {};

const pickReply = (contactId: string): string => {
  const pool = REPLY_POOLS[contactId] || GENERIC_REPLIES;
  const reply = pool[Math.floor(Math.random() * pool.length)];
  lastReplies[contactId] = reply;
  return reply;
};

const lastReplyText = (contactId: string): string => lastReplies[contactId] || 'Thanks!';

export const OrganizerWorkspace: React.FC<OrganizerWorkspaceProps> = ({
  hackathons: propsHackathons,
  teams: propsTeams,
  announcements: propsAnnouncements,
}) => {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const addToast = useToastStore((s) => s.addToast);
  const notify = (title: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => addToast({ title, type });

  const storeHackathons = useHackathonStore((s) => s.hackathons);
  const fetchHackathons = useHackathonStore((s) => s.fetchHackathons);
  const addHackathon = useHackathonStore((s) => s.addHackathon);
  const updateHackathonStore = useHackathonStore((s) => s.updateHackathon);
  const deleteHackathonStore = useHackathonStore((s) => s.deleteHackathon);
  const storeTeams = useTeamStore((s) => s.teams);
  const storeAnnouncements = useNotificationStore((s) => s.announcements);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const chatPublicMessages = useOrganizerChatStore((s) => s.publicMessages);
  const chatDirectMessages = useOrganizerChatStore((s) => s.directMessages);
  const chatSendPublic = useOrganizerChatStore((s) => s.sendPublic);
  const chatSendDirect = useOrganizerChatStore((s) => s.sendDirect);
  const chatReceivePublic = useOrganizerChatStore((s) => s.receivePublic);
  const chatReceiveDirect = useOrganizerChatStore((s) => s.receiveDirect);

  useEffect(() => {
    fetchHackathons();
  }, [fetchHackathons]);

  // Load registrations from the backend (authoritative) so registrations made
  // in any browser/session show up. Falls back to the localStorage mirror.
  const loadRegistrations = React.useCallback(async () => {
    try {
      const list = await registrationApi.getAll();
      if (Array.isArray(list)) setRegistrationList(list);
    } catch {
      try {
        const saved = localStorage.getItem('hc_global_registrations');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) setRegistrationList(parsed);
        }
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    loadRegistrations();
  }, [loadRegistrations]);

  const syncFromStorage = () => {
    try {
      const saved = localStorage.getItem('hc_global_registrations');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setRegistrationList(parsed);
      }
    } catch {
      // ignore
    }
  };
  useEffect(() => {
    window.addEventListener('storage', syncFromStorage);
    return () => window.removeEventListener('storage', syncFromStorage);
  }, []);

  const hackathons = (propsHackathons && propsHackathons.length > 0) ? propsHackathons : storeHackathons;
  const teams = (propsTeams && propsTeams.length > 0) ? propsTeams : storeTeams;

  useDeadlineWatcher(hackathons as any[]);

  const [editingHackathonId, setEditingHackathonId] = useState<string | null>(null);

  // Active Tab Navigation
  const [activeTab, setActiveTab] = useState<
    'overview' | 'hackathons' | 'create' | 'registrations' | 'review' | 'judges' | 'broadcaster' | 'connect' | 'settings'
  >('overview');

  // Refresh registrations whenever the Registrations tab is opened
  useEffect(() => {
    if (activeTab === 'registrations') loadRegistrations();
  }, [activeTab, loadRegistrations]);

  // Poll while the Registrations tab is active so new participant
  // registrations appear without a manual reload
  useEffect(() => {
    if (activeTab !== 'registrations') return;
    const timer = setInterval(loadRegistrations, 10000);
    return () => clearInterval(timer);
  }, [activeTab, loadRegistrations]);

  // Org Switcher State
  const [currentOrg, setCurrentOrg] = useState('TechCorp India Labs');
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Form State for Create Hackathon
  const [eventTitle, setEventTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [maxTeamSize, setMaxTeamSize] = useState(4);
  const [prizePool, setPrizePool] = useState('₹25,00,000');
  const [bannerUrl, setBannerUrl] = useState('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80');

  // State for Registrations Management with localStorage sync
  const [selectedHackathonForReg, setSelectedHackathonForReg] = useState<string | null>(null);
  const [selectedRegForDetails, setSelectedRegForDetails] = useState<any | null>(null);
  const [selectedMemberDetails, setSelectedMemberDetails] = useState<any | null>(null);
  const [expandedMemberIdx, setExpandedMemberIdx] = useState<number | null>(null);

  const [registrationList, setRegistrationList] = useState<any[]>([]);

  // Hackathon timeline status derived from start/end dates: LIVE / ENDED / UPCOMING
  const getHackathonTimelineStatus = (h: any) => {
    const now = Date.now();
    const start = h?.startDate ? new Date(h.startDate).getTime() : NaN;
    const end = h?.endDate ? new Date(h.endDate).getTime() : NaN;
    if (!Number.isNaN(start) && !Number.isNaN(end)) {
      if (now < start) return { label: 'UPCOMING', tone: 'bg-sky-600/90' };
      if (now > end) return { label: 'ENDED', tone: 'bg-slate-800/90' };
      return { label: 'LIVE', tone: 'bg-emerald-600/90' };
    }
    return { label: (h?.status || 'ACTIVE').toUpperCase(), tone: 'bg-indigo-600/90' };
  };

  const formatDateTime = (iso?: string) => {
    if (!iso) return 'Not set';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return 'Not set';
    return d.toLocaleString([], { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // Bulk Approve All Registrations for a specific Hackathon
  const handleApproveAllForHackathon = (hackathonId: string, hackathonTitle: string) => {
    if (!window.confirm(`Are you sure you want to approve ALL pending registrations for "${hackathonTitle}"?`)) {
      return;
    }

    setRegistrationList(prev => {
      const updated = prev.map(item => {
        if (item.hackathonId === hackathonId || (!item.hackathonId && hackathonId === 'h-1')) {
          if (item.status === 'UNDER_REVIEW' || !item.status) {
            return { ...item, status: 'APPROVED' };
          }
        }
        return item;
      });

      try {
        localStorage.setItem('hc_global_registrations', JSON.stringify(updated));
      } catch {}

      // Dispatch announcement notification to participant
      useNotificationStore.getState().addAnnouncement({
        id: `ann-${Date.now()}`,
        hackathonId: hackathonId,
        hackathonTitle: hackathonTitle,
        title: `Bulk Registration Approval! 🚀`,
        content: `All pending registrations for "${hackathonTitle}" have been APPROVED by the organizer. You now have full access to hackathon details and submission portal.`,
        priority: 'HIGH',
        createdAt: 'Just now',
        type: 'update'
      });

      return updated;
    });

    // Sync approvals to backend so they persist across browsers
    registrationList
      .filter(r => (r.hackathonId === hackathonId || (!r.hackathonId && hackathonId === 'h-1')) && (r.status === 'UNDER_REVIEW' || !r.status))
      .forEach(r => {
        registrationApi.updateStatus(r.id, 'APPROVED').catch(() => {});
      });

    notify(`All pending registrations for "${hackathonTitle}" approved successfully!`, 'success');
  };

  // State for Judges
  const [judgeName, setJudgeName] = useState('');
  const [judgeEmail, setJudgeEmail] = useState('');
  const [judgeExpertise, setJudgeExpertise] = useState('');
  const [assignedTrack, setAssignedTrack] = useState('Generative AI');
  const [selectedJudgeForCreds, setSelectedJudgeForCreds] = useState<any | null>(null);

  const [judgesList, setJudgesList] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('hc_global_judges');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [
      {
        id: 'j-101',
        name: 'Dr. Suresh Kumar',
        email: 'suresh@judge.io',
        track: 'Generative AI',
        expertise: 'Computer Vision & LLMs',
        username: 'suresh_judge',
        tempPassword: 'JDG-suresh#9821',
        portalUrl: 'https://hackathoncentral.io/judge/login',
        supportEmail: 'support@hackathons.io',
        credentialsSentAt: 'Today, 10:00 AM'
      },
      {
        id: 'j-102',
        name: 'Elena Rostova',
        email: 'elena@judge.io',
        track: 'Agentic Coding',
        expertise: 'Web3 Security',
        username: 'elena_judge',
        tempPassword: 'JDG-elena#4412',
        portalUrl: 'https://hackathoncentral.io/judge/login',
        supportEmail: 'support@hackathons.io',
        credentialsSentAt: 'Yesterday, 04:15 PM'
      },
    ];
  });

  // State for Broadcaster
  const [broadcastTargetEvent, setBroadcastTargetEvent] = useState('Web3 & Decentralized Scale-A-Thon');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastContent, setBroadcastContent] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sendEmail, setSendEmail] = useState(true);
  const [sendSms, setSendSms] = useState(false);

  // State for Connect Hub Chat
  const [newMessage, setNewMessage] = useState('');
  const [activeDmContact, setActiveDmContact] = useState<Contact | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Handle Registration Status Change
  const handleRegistrationAction = (id: string, newStatus: 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW') => {
    setRegistrationList(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, status: newStatus } : item);
      try {
        localStorage.setItem('hc_global_registrations', JSON.stringify(updated));
      } catch {
        // ignore
      }
      const targetItem = prev.find(item => item.id === id);
      if (targetItem) {
        // Dispatch live notification to store
        notifyRegistrationStatus({
          id: targetItem.id,
          hackathonId: targetItem.hackathonId || 'h-1',
          hackathonTitle: targetItem.hackathonTitle || 'Hackathon',
          groupName: targetItem.groupName || '',
          status: newStatus
        });
      }
      return updated;
    });

    // Sync status change to backend so it persists across browsers
    registrationApi.updateStatus(id, newStatus).catch(() => {});
    notify(`Team registration status updated to ${newStatus}`, 'success');
  };

  // Handle Appoint Judge & Auto-Generate Credentials with Email Dispatch
  const handleAppointJudge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judgeName || !judgeEmail) {
      notify('Please enter Judge Name and Email', 'warning');
      return;
    }

    const cleanUsername = judgeName.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_judge';
    const generatedPass = `JDG-${cleanUsername.slice(0, 4)}#${Math.floor(1000 + Math.random() * 9000)}`;
    const supportEmail = 'support@hackathons.io';
    const sentTime = new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });

    const newJudge = {
      id: `j-${Date.now()}`,
      name: judgeName,
      email: judgeEmail,
      track: assignedTrack,
      expertise: judgeExpertise || 'General AI & Web Development',
      username: cleanUsername,
      tempPassword: generatedPass,
      portalUrl: 'https://hackathoncentral.io/judge/login',
      supportEmail: supportEmail,
      credentialsSentAt: sentTime
    };

    setJudgesList(prev => {
      const updated = [...prev, newJudge];
      try {
        localStorage.setItem('hc_global_judges', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setJudgeName('');
    setJudgeEmail('');
    setJudgeExpertise('');

    // Open Credential Modal Preview immediately so organizer can see credentials and verify email delivery
    setSelectedJudgeForCreds(newJudge);

    notify(`Judge ${judgeName} appointed! Credentials mailed from ${supportEmail}`, 'success');
  };

  // Handle Revoke Judge
  const handleRevokeJudge = (id: string) => {
    setJudgesList(prev => {
      const updated = prev.filter(j => j.id !== id);
      try {
        localStorage.setItem('hc_global_judges', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    notify('Judge credentials revoked', 'info');
  };

  // Handle Broadcast Submission
  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastContent) {
      notify('Please fill in announcement title and content', 'warning');
      return;
    }
    notifyBroadcast(broadcastTitle, broadcastContent, broadcastTargetEvent, 'platform');
    notify(`Broadcast "${broadcastTitle}" sent to participants!`, 'success');
    setBroadcastTitle('');
    setBroadcastContent('');
  };

  // Handle Send Chat
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const meName = user?.name || 'You';
    const text = newMessage.trim();

    if (activeDmContact) {
      chatSendDirect(activeDmContact.id, text, meName);
      // Simulated reply from the recipient after a short "typing" delay
      setIsTyping(true);
      setTimeout(() => {
        chatReceiveDirect(activeDmContact!.id, activeDmContact!.label, pickReply(activeDmContact!.id));
        setIsTyping(false);
        notifyIncomingMessage(activeDmContact!.label, true, lastReplyText(activeDmContact!.id));
      }, 1400 + Math.random() * 1200);
    } else {
      chatSendPublic(text, meName);
      // Simulated reply in the public room from another organizer
      const randomContact = CONTACTS[Math.floor(Math.random() * CONTACTS.length)];
      setIsTyping(true);
      setTimeout(() => {
        chatReceivePublic(randomContact.label, pickReply(randomContact.id));
        setIsTyping(false);
        notifyIncomingMessage(randomContact.label, false, lastReplyText(randomContact.id));
      }, 1600 + Math.random() * 1400);
    }

    setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-50/20 to-indigo-50/30 p-4 sm:p-6 text-slate-900 font-sans">
      
      {/* Top Header Bar */}
      <header className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-4 mb-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand Badge */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-xl text-white shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg text-slate-900 tracking-tight">Hackathon</span>
              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-indigo-100 text-indigo-700 rounded-md uppercase tracking-wider">
                Workspace
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">{currentOrg}</p>
          </div>
        </div>

        {/* Right Top Controls */}
        <div className="flex items-center gap-3">
          {/* Org Selector */}
          <div className="relative">
            <button
              onClick={() => setShowOrgDropdown(!showOrgDropdown)}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-100/80 hover:bg-slate-200/80 rounded-xl text-xs font-bold text-slate-700 transition-colors border border-slate-200 cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-purple-600" />
              <span>{currentOrg}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            {showOrgDropdown && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50">
                <p className="text-[10px] font-bold text-slate-400 uppercase px-3 py-1">Select Organization</p>
                {['TechCorp India Labs', 'Vercel India Hub', 'Apex Bank Labs', 'GreenTech Coalition'].map(org => (
                  <button
                    key={org}
                    onClick={() => { setCurrentOrg(org); setShowOrgDropdown(false); }}
                    className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                      currentOrg === org ? 'bg-purple-50 text-purple-700' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {org}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Calendar Button */}
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="flex items-center gap-2 px-3.5 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold transition-colors border border-indigo-100 cursor-pointer"
          >
            <CalendarIcon className="w-4 h-4 text-indigo-600" />
            <span>Calendar</span>
          </button>

          {/* Notification Bell */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black flex items-center justify-center text-xs shadow-sm">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'KB'}
            </div>
            <span className="text-xs font-extrabold text-slate-900 hidden sm:inline">{user?.name || 'KVS Bhavya'}</span>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Sidebar Navigation (3 cols) */}
        <aside className="lg:col-span-3 space-y-6">
          
          {/* Main Nav Card */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm space-y-2">
            <h4 className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
              WORKSPACE
            </h4>

            {[
              { id: 'overview', label: 'Dashboard Overview', icon: BarChart3 },
              { id: 'hackathons', label: `My Hackathons (${hackathons.length || 13})`, icon: Layers },
              { id: 'create', label: 'Create Hackathon', icon: Plus },
              { id: 'registrations', label: 'Registrations', icon: Users },
              { id: 'review', label: 'Review & Summary', icon: CheckCircle },
              { id: 'judges', label: 'Judges & Rubrics', icon: Scale },
              { id: 'broadcaster', label: 'Broadcaster', icon: Megaphone },
              { id: 'connect', label: 'Connect Hub', icon: Sparkles },
              { id: 'settings', label: 'Workspace Settings', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-indigo-200'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer border border-transparent hover:border-rose-100"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout Workspace</span>
            </button>
          </div>

          {/* Workspace Stats Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="w-4 h-4" />
              <h5 className="text-[10px] font-black uppercase tracking-wider">WORKSPACE STATS</h5>
            </div>
            
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase">Total Revenue Earned</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">₹12,50,000</h3>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
              <div className="flex justify-between items-center text-slate-600 font-medium">
                <span>Corporate Sponsors:</span>
                <span className="font-extrabold text-slate-900">₹8,00,000</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 font-medium">
                <span>Grants:</span>
                <span className="font-extrabold text-slate-900">₹4,50,000</span>
              </div>
            </div>
          </div>

        </aside>

        {/* Right Main Content Area (9 cols) */}
        <main className="lg:col-span-9 min-w-0">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (() => {
            const approvedCount = registrationList.filter((r: any) => r.status === 'APPROVED').length;
            const rejectedCount = registrationList.filter((r: any) => r.status === 'REJECTED').length;
            const pendingCount = registrationList.filter((r: any) => !r.status || r.status === 'UNDER_REVIEW').length;
            const approvedPct = registrationList.length > 0 ? Math.round((approvedCount / registrationList.length) * 100) : 0;

            const statusBars = [
              { label: 'Approved Teams', value: approvedCount, display: `${approvedCount}`, color: '#10b981' },
              { label: 'Under Review', value: pendingCount, display: `${pendingCount}`, color: '#f59e0b' },
              { label: 'Rejected', value: rejectedCount, display: `${rejectedCount}`, color: '#f43f5e' }
            ];

            const hackathonBars = hackathons.slice(0, 5).map((h) => {
              const count = registrationList.filter((r: any) => r.hackathonId === h.id).length;
              return { label: h.title || 'Hackathon', value: count, display: `${count}`, color: '#6366f1' };
            });

            return (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { title: 'Total Hackathons', value: `${hackathons.length}`, icon: Trophy, color: 'text-purple-600 bg-purple-50' },
                    { title: 'Total Registrations', value: `${registrationList.length}`, icon: Users, color: 'text-indigo-600 bg-indigo-50' },
                    { title: 'Approved Teams', value: `${approvedCount}`, icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50' },
                    { title: 'Pending Review', value: `${pendingCount}`, icon: Clock, color: 'text-amber-600 bg-amber-50' },
                  ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <div key={i} className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
                        <div>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{stat.title}</p>
                          <h3 className="text-2xl font-black text-slate-900 mt-1">{stat.value}</h3>
                        </div>
                        <div className={`p-3 rounded-2xl ${stat.color}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Analytics: Registration insights with charts */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col items-center justify-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 self-start">Approval Rate</span>
                    <ProgressRing
                      value={approvedPct}
                      size={150}
                      strokeWidth={14}
                      color={approvedPct >= 60 ? '#10b981' : approvedPct >= 30 ? '#f59e0b' : '#f43f5e'}
                      label="Approved"
                      sublabel={`of ${registrationList.length} registration(s)`}
                    />
                  </div>

                  <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 tracking-tight">
                      <span className="p-1.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100"><Users className="w-4 h-4" /></span>
                      Registrations by Status
                    </h3>
                    <BarChart items={statusBars} emptyMessage="No registrations yet — they will appear here." />
                  </div>

                  <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 tracking-tight">
                      <span className="p-1.5 rounded-xl bg-violet-50 text-violet-600 border border-violet-100"><Layers className="w-4 h-4" /></span>
                      Registrations per Hackathon
                    </h3>
                    <BarChart items={hackathonBars} emptyMessage="No registrations yet — they will appear here." />
                  </div>
                </div>

                {/* Quick Actions & Recent Overview */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                  <h3 className="text-lg font-black text-slate-900">Active Hackathons Overview</h3>
                  <div className="divide-y divide-slate-100">
                    {hackathons.slice(0, 4).map((h, i) => (
                      <div key={i} className="py-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={h.banner || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=200&q=80'}
                            alt={h.title || 'Hackathon banner'}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-900 text-sm truncate">{h.title || `Hackathon #${i+1}`}</h4>
                            <p className="text-xs text-slate-400 truncate">{h.tagline || 'AI & Cloud Infrastructure Challenge'}</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-700 shrink-0">
                          {h.status || 'PUBLISHED'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* TAB 2: MY HACKATHONS */}
          {activeTab === 'hackathons' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">My Hackathons</h2>
                  <p className="text-xs font-semibold text-slate-500">Manage all your hosted events</p>
                </div>
                <button
                  onClick={() => setActiveTab('create')}
                  className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Create Hackathon
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hackathons.map((h, i) => (
                  <div key={h.id || i} className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden group flex flex-col">
                    {/* Banner Image */}
                    <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                      <img
                        src={h.banner || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80'}
                        alt={h.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                      {/* Status & Mode Overlay */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                        {(() => {
                          const t = getHackathonTimelineStatus(h);
                          return (
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase text-white backdrop-blur-md border border-white/20 ${t.tone}`}>
                              {t.label}
                            </span>
                          );
                        })()}
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-indigo-600/90 text-white">
                          {h.mode || 'Online'}
                        </span>
                      </div>

                      {/* Prize Pool Overlay */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-400/90 text-slate-950 text-xs font-black backdrop-blur-md shadow-sm">
                        <Trophy className="w-3.5 h-3.5 text-slate-950" />
                        <span>{h.prizePool || '₹10,00,000'} Prize Pool</span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        {h.organizerName && (
                          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 mb-1">
                            {h.organizerName}
                          </div>
                        )}
                        <h3 className="font-black text-slate-900 text-base line-clamp-1">{h.title}</h3>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">{h.description || h.tagline || 'No description available'}</p>
                      </div>

                      {/* Start & End Time */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
                          <CalendarIcon className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span className="text-slate-400 font-semibold">Starts:</span> {formatDateTime(h.startDate)}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
                          <Clock className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span className="text-slate-400 font-semibold">Ends:</span> {formatDateTime(h.endDate)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs font-bold text-slate-600 pt-2 border-t border-slate-100">
                        <span>Prize: {h.prizePool || '₹10,00,000'}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingHackathonId(h.id);
                              setActiveTab('create');
                            }}
                            className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete "${h.title}"?`)) {
                                deleteHackathonStore(h.id);
                                hackathonApi.delete(h.id).catch(() => {});
                                addToast({
                                  title: 'Hackathon Deleted',
                                  message: `"${h.title}" was removed.`,
                                  type: 'info'
                                });
                              }
                            }}
                            className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CREATE HACKATHON (Enterprise 5-Step Wizard Studio) */}
          {activeTab === 'create' && (
            <CreateHackathonWizard
              initialHackathon={editingHackathonId ? storeHackathons.find(h => h.id === editingHackathonId) : null}
              onSaveDraft={(draftData) => {
                if (editingHackathonId && draftData.id) {
                  updateHackathonStore(editingHackathonId, draftData);
                } else {
                  addHackathon({ status: 'DRAFT', ...draftData } as Hackathon);
                }

                // Sync to backend DB asynchronously
                if (editingHackathonId && draftData.id) {
                  hackathonApi.update(editingHackathonId, draftData).catch(() => {});
                } else {
                  hackathonApi.create(draftData).catch(() => {});
                }
              }}
              onPublish={async (newHackathon) => {
                const targetObj = { ...newHackathon, status: 'live' as const };
                if (editingHackathonId) {
                  updateHackathonStore(editingHackathonId, targetObj);
                } else {
                  addHackathon(targetObj);
                }

                notifyNewHackathon({ id: targetObj.id, title: targetObj.title });

                try {
                  console.log('🚀 Sending new hackathon payload to Railway DB:', targetObj);
                  const dbRecord = await hackathonApi.create(targetObj);
                  console.log('✅ Created hackathon in Railway DB:', dbRecord);
                  if (dbRecord?.id && dbRecord.id !== targetObj.id) {
                    updateHackathonStore(targetObj.id, { id: dbRecord.id });
                  }
                  addToast({
                    title: 'Hackathon Stored in DB & Published! 🚀',
                    message: `"${targetObj.title}" is now live in Railway DB and visible to participants.`,
                    type: 'success',
                    duration: 5000
                  });
                } catch (err: any) {
                  console.error('❌ DB Save warning:', err);
                  addToast({
                    title: 'Hackathon Published! 🚀',
                    message: `"${targetObj.title}" is now live for all participants.`,
                    type: 'success',
                    duration: 5000
                  });
                }

                setEditingHackathonId(null);
                setActiveTab('hackathons');
              }}
              onCancel={() => {
                setEditingHackathonId(null);
                setActiveTab('hackathons');
              }}
            />
          )}

          {/* TAB 4: REGISTRATIONS (Enterprise Developer Registrations Management) */}
          {activeTab === 'registrations' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Developer Registrations</h2>
                  <p className="text-xs font-semibold text-slate-500">
                    Manage hackathon cards, click counts to inspect team submissions, and perform bulk approvals
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {selectedHackathonForReg && (
                    <button
                      onClick={() => {
                        setSelectedRegForDetails(null);
                        setSelectedHackathonForReg(null);
                      }}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors"
                    >
                      ← Back to All Hackathons
                    </button>
                  )}
                  <button
                    onClick={loadRegistrations}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors flex items-center gap-1.5"
                    title="Refresh registrations from the server"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh
                  </button>
                  <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 font-extrabold text-xs rounded-xl border border-indigo-100">
                    {registrationList.length} Total Registrations
                  </span>
                </div>
              </div>

              {!selectedHackathonForReg ? (
                /* HACKATHON CARDS GRID FOR REGISTRATIONS */
                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-500">Hosted Hackathons Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {hackathons.map((h) => {
                      const hRegs = registrationList.filter(r => r.hackathonId === h.id || (!r.hackathonId && h.id === 'h-1'));
                      const totalCount = hRegs.length;
                      const pendingCount = hRegs.filter(r => r.status === 'UNDER_REVIEW' || !r.status).length;
                      const approvedCount = hRegs.filter(r => r.status === 'APPROVED').length;
                      const rejectedCount = hRegs.filter(r => r.status === 'REJECTED').length;

                      return (
                        <div key={h.id} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="font-black text-slate-900 text-base line-clamp-1">{h.title}</h4>
                              {(() => {
                                const t = getHackathonTimelineStatus(h);
                                return (
                                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase text-white ${t.tone}`}>
                                    {t.label}
                                  </span>
                                );
                              })()}
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-2">{h.tagline || h.description || 'Hosted Innovation Hackathon'}</p>
                          </div>

                          <div className="pt-3 border-t border-slate-100 space-y-3">
                            <div className="grid grid-cols-4 gap-2 text-center">
                              <button
                                onClick={() => setSelectedHackathonForReg(h.id)}
                                className="p-2 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 transition-colors cursor-pointer border border-indigo-100/60"
                                title="Click to view full registration list"
                              >
                                <span className="text-[9px] font-extrabold uppercase text-slate-400 block">TOTAL</span>
                                <span className="text-base font-black text-indigo-700 underline decoration-indigo-300">{totalCount}</span>
                              </button>

                              <div className="p-2 rounded-2xl bg-amber-50 text-amber-800 border border-amber-100/60">
                                <span className="text-[9px] font-extrabold uppercase text-slate-400 block">PENDING</span>
                                <span className="text-base font-black text-amber-600">{pendingCount}</span>
                              </div>

                              <div className="p-2 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100/60">
                                <span className="text-[9px] font-extrabold uppercase text-slate-400 block">APPROVED</span>
                                <span className="text-base font-black text-emerald-600">{approvedCount}</span>
                              </div>

                              <div className="p-2 rounded-2xl bg-rose-50 text-rose-800 border border-rose-100/60">
                                <span className="text-[9px] font-extrabold uppercase text-slate-400 block">REJECTED</span>
                                <span className="text-base font-black text-rose-600">{rejectedCount}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 pt-1">
                              <button
                                onClick={() => setSelectedHackathonForReg(h.id)}
                                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer text-center"
                              >
                                View Registrations ({totalCount})
                              </button>

                              {pendingCount > 0 && (
                                <button
                                  onClick={() => handleApproveAllForHackathon(h.id, h.title)}
                                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer whitespace-nowrap"
                                >
                                  Approve All ({pendingCount})
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {hackathons.length === 0 && (
                    <div className="p-10 rounded-3xl bg-white border border-slate-200/80 text-center space-y-2">
                      <p className="text-sm font-bold text-slate-700">No Hackathons Found</p>
                      <p className="text-xs text-slate-500">Create a hackathon first, then participant registrations will appear here.</p>
                    </div>
                  )}
                </div>
              ) : (
                /* SPECIFIC HACKATHON REGISTRATION TABLE (LEVEL 1: TEAMS / LEVEL 2: TEAM DETAILS) */
                <div className="space-y-4">
                  {(() => {
                    const targetHack = hackathons.find(h => h.id === selectedHackathonForReg);
                    const filteredRegs = registrationList.filter(r => r.hackathonId === selectedHackathonForReg || (!r.hackathonId && selectedHackathonForReg === 'h-1'));

                    // ===== LEVEL 2: TEAM DETAILS (overall team info + members) =====
                    if (selectedRegForDetails) {
                      const liveReg = registrationList.find(r => r.id === selectedRegForDetails.id) || selectedRegForDetails;
                      const membersList = Array.isArray(liveReg.members) && liveReg.members.length > 0
                        ? liveReg.members
                        : [
                            { name: liveReg.groupName?.replace("'s Entry", '') || 'Team Lead', role: 'Team Lead', email: liveReg.leaderEmail }
                          ];

                      return (
                        <div className="space-y-4">
                          {/* Breadcrumb */}
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 flex-wrap">
                            <button onClick={() => { setSelectedRegForDetails(null); setSelectedHackathonForReg(null); }} className="text-indigo-600 hover:underline cursor-pointer">Registrations</button>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                            <button onClick={() => setSelectedRegForDetails(null)} className="text-indigo-600 hover:underline cursor-pointer">{targetHack?.title || 'Hackathon'}</button>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                            <span className="text-slate-900">{liveReg.groupName}</span>
                          </div>

                          {/* Team Header */}
                          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                              <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">SELECTED TEAM</span>
                              <h3 className="text-xl font-black text-slate-900">{liveReg.groupName}</h3>
                              <p className="text-xs text-slate-500 font-mono">Code: {liveReg.code}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                liveReg.status === 'APPROVED'
                                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                                  : liveReg.status === 'REJECTED'
                                  ? 'bg-rose-100 text-rose-700 border border-rose-300'
                                  : 'bg-amber-100 text-amber-700 border border-amber-300'
                              }`}>
                                {liveReg.status || 'UNDER_REVIEW'}
                              </span>
                              <button
                                onClick={() => setSelectedRegForDetails(null)}
                                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors"
                              >
                                ← Back to Teams
                              </button>
                            </div>
                          </div>

                          {/* Overall Team Info */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                              <span className="text-[10px] font-black uppercase text-slate-400 block">Team Size</span>
                              <span className="text-lg font-black text-slate-900">{liveReg.groupSize || `${membersList.length} Members`}</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                              <span className="text-[10px] font-black uppercase text-slate-400 block">Registered On</span>
                              <span className="text-sm font-black text-slate-900">{liveReg.registeredAt || 'Today'}</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs sm:col-span-2">
                              <span className="text-[10px] font-black uppercase text-slate-400 block">Team Lead Email</span>
                              <span className="text-sm font-black text-slate-900 break-all">{liveReg.leaderEmail}</span>
                            </div>
                          </div>

                          {/* Team Members with View Details */}
                          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Team Members ({membersList.length}) — click View Details to inspect each member</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {membersList.map((m: any, mIdx: number) => (
                                <div key={mIdx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2 hover:bg-indigo-50/50 transition-colors">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-black text-[10px] flex items-center justify-center shrink-0">
                                      {mIdx === 0 ? '👑' : mIdx + 1}
                                    </span>
                                    <div className="min-w-0">
                                      <span className="font-extrabold text-slate-900 text-xs block truncate">{m.name || `Member #${mIdx + 1}`}</span>
                                      <span className="text-[10px] text-slate-400 font-medium block truncate">{m.email || m.role || (mIdx === 0 ? 'Team Lead' : 'Hacker')}</span>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => {
                                      setSelectedMemberDetails({ ...liveReg, members: membersList });
                                      setExpandedMemberIdx(mIdx);
                                    }}
                                    className="px-3 py-1 bg-white hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-200 hover:border-indigo-600 font-bold text-[10px] rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-2xs"
                                  >
                                    View Details ↗
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    }

                    // ===== LEVEL 1: TEAMS LIST for the selected hackathon =====
                    const pendingCount = filteredRegs.filter(r => r.status === 'UNDER_REVIEW' || !r.status).length;

                    return (
                      <div className="space-y-4">
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 flex-wrap">
                          <button onClick={() => setSelectedHackathonForReg(null)} className="text-indigo-600 hover:underline cursor-pointer">Registrations</button>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                          <span className="text-slate-900">{targetHack?.title || 'Hackathon'}</span>
                        </div>

                        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div>
                            <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">SELECTED EVENT REGISTRATIONS</span>
                            <h3 className="text-xl font-black text-slate-900">{targetHack?.title || 'Hackathon Registrations'}</h3>
                            <p className="text-xs font-medium text-slate-500">{filteredRegs.length} Total Registered Applications • {pendingCount} Pending Approval</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleApproveAllForHackathon(selectedHackathonForReg, targetHack?.title || 'Hackathon')}
                              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-2xl shadow-md shadow-emerald-200 transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                            >
                              <span>Accept All / Approve All Registrations</span>
                              <span className="px-2 py-0.5 bg-white/20 rounded-full text-[10px]">{pendingCount > 0 ? pendingCount : 'All'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Registered Team Cards with View Details */}
                        <div className="space-y-4">
                          {filteredRegs.length === 0 && (
                            <div className="p-10 rounded-3xl bg-white border border-slate-200/80 text-center space-y-2">
                              <p className="text-sm font-bold text-slate-700">No Registrations Yet</p>
                              <p className="text-xs text-slate-500">When participants register for this hackathon, their applications will appear here.</p>
                            </div>
                          )}
                          {filteredRegs.map((row) => {
                            const membersList = Array.isArray(row.members) && row.members.length > 0
                              ? row.members
                              : [
                                  { name: row.groupName?.replace("'s Entry", '') || 'Team Lead', role: 'Team Lead', email: row.leaderEmail }
                                ];

                            return (
                              <div key={row.id} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-indigo-200 transition-all space-y-4">
                                {/* Overall Team Brief Header */}
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                                      <h4 className="font-black text-slate-900 text-lg">{row.groupName}</h4>
                                      <span className="text-xs text-slate-400 font-mono">({row.code})</span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-semibold">
                                      <span>👥 Team Size: <strong>{row.groupSize || `${membersList.length} Members`}</strong></span>
                                      <span>📅 Registered: <strong>{row.registeredAt || 'Today'}</strong></span>
                                      <span>📧 Lead Email: <strong>{row.leaderEmail}</strong></span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                      row.status === 'APPROVED'
                                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                                        : row.status === 'REJECTED'
                                        ? 'bg-rose-100 text-rose-700 border border-rose-300'
                                        : 'bg-amber-100 text-amber-700 border border-amber-300'
                                    }`}>
                                      {row.status || 'UNDER_REVIEW'}
                                    </span>
                                    <button
                                      onClick={() => setSelectedRegForDetails(row)}
                                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-2xs"
                                    >
                                      View Details ↗
                                    </button>
                                  </div>
                                </div>

                                {/* Individual Members Names List */}
                                <div className="space-y-2">
                                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Registered Team Members ({membersList.length}):</span>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                    {membersList.map((m: any, mIdx: number) => (
                                      <div key={mIdx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2 hover:bg-indigo-50/50 transition-colors">
                                        <div className="flex items-center gap-2 min-w-0">
                                          <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-black text-[10px] flex items-center justify-center shrink-0">
                                            {mIdx === 0 ? '👑' : mIdx + 1}
                                          </span>
                                          <div className="min-w-0">
                                            <span className="font-extrabold text-slate-900 text-xs block truncate">{m.name || `Member #${mIdx + 1}`}</span>
                                            <span className="text-[10px] text-slate-400 font-medium block truncate">{m.role || (mIdx === 0 ? 'Team Lead' : 'Hacker')}</span>
                                          </div>
                                        </div>

                                        <button
                                          onClick={() => {
                                            setSelectedMemberDetails({ ...row, members: membersList });
                                            setExpandedMemberIdx(mIdx);
                                          }}
                                          className="px-3 py-1 bg-white hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-200 hover:border-indigo-600 font-bold text-[10px] rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-2xs"
                                        >
                                          View Details ↗
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {/* TAB: REVIEW & SUMMARY DASHBOARD */}
          {activeTab === 'review' && (
            <div className="space-y-6">
              {/* Review Header & Filter Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Hackathon Review & Executive Summary</h2>
                  <p className="text-xs font-semibold text-slate-500">
                    Comprehensive overview of registrations, evaluations, rankings, winners, and prize payouts
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Filter Event:</span>
                  <select
                    value={selectedHackathonForReg || 'all'}
                    onChange={(e) => setSelectedHackathonForReg(e.target.value === 'all' ? null : e.target.value)}
                    className="px-3.5 py-2 text-xs font-extrabold rounded-xl bg-white border border-slate-200 text-slate-800 shadow-2xs outline-none cursor-pointer"
                  >
                    <option value="all">🏆 All Hackathons Summary</option>
                    {hackathons.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {(() => {
                const targetId = selectedHackathonForReg;
                const relevantHackathons = targetId ? hackathons.filter(h => h.id === targetId) : hackathons;
                const relevantRegs = targetId
                  ? registrationList.filter(r => r.hackathonId === targetId || (!r.hackathonId && targetId === 'h-1'))
                  : registrationList;

                const totalRegs = relevantRegs.length;
                const approvedTeams = relevantRegs.filter(r => r.status === 'APPROVED').length;
                const pendingRegs = relevantRegs.filter(r => r.status === 'UNDER_REVIEW' || !r.status).length;
                const rejectedRegs = relevantRegs.filter(r => r.status === 'REJECTED').length;

                // Executive Summaries List per Hackathon
                return (
                  <div className="space-y-6">
                    {/* Metric Cards Banner */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Applications</span>
                        <div className="text-2xl font-black text-slate-900">{totalRegs} <span className="text-xs font-semibold text-slate-500">Teams</span></div>
                        <span className="text-[10px] font-bold text-indigo-600">Across {relevantHackathons.length} Event(s)</span>
                      </div>

                      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Approved / Participated</span>
                        <div className="text-2xl font-black text-emerald-600">{approvedTeams} <span className="text-xs font-semibold text-emerald-800">Verified</span></div>
                        <span className="text-[10px] font-bold text-slate-500">{pendingRegs} Pending Review</span>
                      </div>

                      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Evaluations Completed</span>
                        <div className="text-2xl font-black text-purple-600">100% <span className="text-xs font-semibold text-purple-800">Scored</span></div>
                        <span className="text-[10px] font-bold text-purple-600">Rubric Verified</span>
                      </div>

                      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Prize Distribution Status</span>
                        <div className="text-2xl font-black text-teal-600">Paid <span className="text-xs font-semibold text-slate-500">/ Synced</span></div>
                        <span className="text-[10px] font-bold text-emerald-600">✓ Transactions Settled</span>
                      </div>
                    </div>

                    {/* Detailed Hackathon Summaries */}
                    <div className="space-y-6">
                      {relevantHackathons.map((h) => {
                        const hRegs = registrationList.filter(r => r.hackathonId === h.id || (!r.hackathonId && h.id === 'h-1'));
                        const hApproved = hRegs.filter(r => r.status === 'APPROVED');
                        const hPending = hRegs.filter(r => r.status === 'UNDER_REVIEW' || !r.status);
                        const hRejected = hRegs.filter(r => r.status === 'REJECTED');

                        // Mock/Default Winners and Judging Data for complete summary presentation
                        const winners = [
                          { rank: '🥇 1st Place', team: 'CyberPioneers', project: 'Neural Guardian AI', score: '96.8 / 100', prize: '₹12,50,000', status: 'PAID (Txn #88412)', lead: 'Ansar Ali' },
                          { rank: '🥈 2nd Place', team: 'Visionary Crew', project: 'Quantum Ledger Protocol', score: '94.2 / 100', prize: '₹7,50,000', status: 'PAID (Txn #88413)', lead: 'Alex Rivera' },
                          { rank: '🥉 3rd Place', team: 'Carlos Solo Hack', project: 'BioHealth Synth', score: '91.5 / 100', prize: '₹5,00,000', status: 'PENDING DISBURSAL', lead: 'Carlos Mendoza' }
                        ];

                        return (
                          <div key={h.id} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
                            
                            {/* Hackathon Top Bar Summary */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-100">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-100 text-indigo-700">
                                    {h.category || 'INNOVATION SPRINT'}
                                  </span>
                                  <span className="text-xs font-bold text-slate-400">ID: {h.id}</span>
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mt-1">{h.title}</h3>
                                <p className="text-xs text-slate-500 font-medium">{h.tagline || h.description || 'Enterprise Hackathon Challenge'}</p>
                              </div>

                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  <span className="text-[10px] font-black uppercase text-slate-400 block">Total Prize Pool</span>
                                  <span className="text-base font-black text-emerald-600">{h.prizePool || '₹25,00,000'}</span>
                                </div>
                                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  ● {h.status || 'Active'}
                                </span>
                              </div>
                            </div>

                            {/* 1. Registration & Participation Breakup */}
                            <div className="space-y-3">
                              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-indigo-600" /> 1. Registration & Participation Metrics
                              </h4>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
                                <div>
                                  <span className="text-[9px] font-black uppercase text-slate-400 block">Total Applications</span>
                                  <span className="font-extrabold text-slate-900 text-sm">{hRegs.length} Teams</span>
                                </div>
                                <div>
                                  <span className="text-[9px] font-black uppercase text-slate-400 block">Approved Teams</span>
                                  <span className="font-extrabold text-emerald-600 text-sm">{hApproved.length} Participated</span>
                                </div>
                                <div>
                                  <span className="text-[9px] font-black uppercase text-slate-400 block">Under Review</span>
                                  <span className="font-extrabold text-amber-600 text-sm">{hPending.length} Applications</span>
                                </div>
                                <div>
                                  <span className="text-[9px] font-black uppercase text-slate-400 block">Rejected</span>
                                  <span className="font-extrabold text-rose-600 text-sm">{hRejected.length} Applications</span>
                                </div>
                              </div>
                            </div>

                            {/* 2. Evaluation, Scores & Winner Rankings Table */}
                            <div className="space-y-3">
                              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-500" /> 2. Judging Scores, Rankings & Prize Payout Summary
                              </h4>

                              <div className="rounded-2xl border border-slate-200/80 overflow-hidden text-xs">
                                <table className="w-full text-left">
                                  <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b border-slate-100">
                                    <tr>
                                      <th className="px-4 py-3">RANKING</th>
                                      <th className="px-4 py-3">TEAM & LEAD</th>
                                      <th className="px-4 py-3">PROJECT TITLE</th>
                                      <th className="px-4 py-3">EVALUATION SCORE</th>
                                      <th className="px-4 py-3">PRIZE MONEY</th>
                                      <th className="px-4 py-3 text-right">PAYMENT STATUS</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                    {winners.map((w, idx) => (
                                      <tr key={idx} className="hover:bg-slate-50/50">
                                        <td className="px-4 py-3 font-extrabold text-slate-900">{w.rank}</td>
                                        <td className="px-4 py-3">
                                          <span className="font-bold text-slate-900 block">{w.team}</span>
                                          <span className="text-[10px] text-slate-400">Lead: {w.lead}</span>
                                        </td>
                                        <td className="px-4 py-3 font-semibold text-indigo-600">{w.project}</td>
                                        <td className="px-4 py-3">
                                          <span className="px-2.5 py-1 rounded-xl bg-purple-50 text-purple-700 font-extrabold text-[11px] border border-purple-100">
                                            ⭐ {w.score}
                                          </span>
                                        </td>
                                        <td className="px-4 py-3 font-black text-slate-900">{w.prize}</td>
                                        <td className="px-4 py-3 text-right">
                                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                                            w.status.includes('PAID')
                                              ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                                              : 'bg-amber-100 text-amber-700 border border-amber-300'
                                          }`}>
                                            {w.status}
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 5: JUDGES & RUBRICS (Screen 3 Match) */}
          {activeTab === 'judges' && (
            <div className="space-y-6">
              
              {/* Header Dark Card */}
              <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2 text-indigo-300">
                  <Award className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-wider">EVALUATION PROCESS</span>
                </div>
                <h3 className="text-xl font-black flex items-center gap-2">
                  <span>⚖️</span> How Judges Evaluate & Score submissions
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-[9px] font-extrabold text-indigo-300 uppercase">STEP 01: ASSIGN TRACK</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      Judges are assigned to specific challenge statement tracks based on their expertise.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-[9px] font-extrabold text-indigo-300 uppercase">STEP 02: SCORING RUBRICS</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      Judges review project code and assign scores (1 to 10) on preset criteria weights.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-[9px] font-extrabold text-indigo-300 uppercase">STEP 03: STANDINGS SYNC</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      Weighted standings update in real-time, pushing top solutions to the Leaderboard.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form & Appointed Panel Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Form Card */}
                <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-purple-600" /> Appoint New Judge
                  </h3>

                  <form className="space-y-3" onSubmit={handleAppointJudge}>
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-600 block mb-1">Judge Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Shaik Ansar Ali"
                        value={judgeName}
                        onChange={(e) => setJudgeName(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-purple-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-600 block mb-1">Email Address</label>
                      <input
                        type="email"
                        placeholder="e.g. ansar@judge.io"
                        value={judgeEmail}
                        onChange={(e) => setJudgeEmail(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-purple-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-600 block mb-1">Expertise Domain</label>
                      <input
                        type="text"
                        placeholder="e.g. Machine Learning, Cryptography"
                        value={judgeExpertise}
                        onChange={(e) => setJudgeExpertise(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-purple-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-600 block mb-1">Assigned Event Track</label>
                      <select
                        value={assignedTrack}
                        onChange={(e) => setAssignedTrack(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-purple-500 outline-none"
                      >
                        <option>Generative AI</option>
                        <option>Agentic Coding</option>
                        <option>Web3 & DeFi</option>
                        <option>Open Innovation</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-md hover:from-purple-700 hover:to-indigo-700 transition-all cursor-pointer mt-2"
                    >
                      ✓ Save Judge Details
                    </button>
                  </form>
                </div>

                {/* Appointed Panel List */}
                <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-black text-slate-900">APPOINTED PANEL ({judgesList.length})</h3>
                      <p className="text-[10px] text-slate-400 font-semibold">Judge login credentials auto-mailed from support@hackathons.io</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-700">
                      ● Active Evaluators
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {judgesList.map((j) => (
                      <div key={j.id} className="py-4 space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-extrabold text-slate-900 text-sm">{j.name}</h4>
                              <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-extrabold text-[10px]">
                                {j.track}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium">{j.email} • <span className="text-slate-400">{j.expertise}</span></p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedJudgeForCreds(j)}
                              className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-xs rounded-xl border border-indigo-100 transition-colors cursor-pointer flex items-center gap-1"
                            >
                              🔑 View Credentials
                            </button>
                            <button
                              onClick={() => handleRevokeJudge(j.id)}
                              className="px-2.5 py-1 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer transition-colors"
                            >
                              Revoke
                            </button>
                          </div>
                        </div>

                        {/* Visible Credentials Pill Bar on Organizer Page */}
                        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-[9px] font-black uppercase text-slate-400 block">Username</span>
                            <span className="font-mono font-bold text-slate-900">{j.username || `${j.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_judge`}</span>
                          </div>
                          <div>
                            <span className="text-[9px] font-black uppercase text-slate-400 block">Temp Password</span>
                            <span className="font-mono font-bold text-indigo-600">{j.tempPassword || 'JDG-pass#2026'}</span>
                          </div>
                          <div>
                            <span className="text-[9px] font-black uppercase text-slate-400 block">Mailer Status</span>
                            <span className="font-bold text-emerald-600 flex items-center gap-1 text-[11px]">
                              <span>✉️ Sent from {j.supportEmail || 'support@hackathons.io'}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 6: BROADCASTER (Screen 4 Match) */}
          {activeTab === 'broadcaster' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm max-w-3xl mx-auto space-y-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <span>📢</span> Broadcast Studio
                </h2>
                <p className="text-xs font-semibold text-slate-500 mt-1">
                  Broadcasting notifications directly to live participant dashboards
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSendBroadcast}>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-600 block mb-1">Target Event</label>
                  <select
                    value={broadcastTargetEvent}
                    onChange={(e) => setBroadcastTargetEvent(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-purple-500 outline-none"
                  >
                    <option>Web3 & Decentralized Scale-A-Thon</option>
                    <option>AI Innovation Challenge 2026</option>
                    <option>Smart Cities Hackathon 2026</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-600 block mb-1">Announcement Title</label>
                  <input
                    type="text"
                    placeholder="📢 Submissions are now open for final evaluation!"
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs font-medium rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-600 block mb-1">Message Content</label>
                  <textarea
                    rows={4}
                    placeholder="Provide explicit instructions for building teams..."
                    value={broadcastContent}
                    onChange={(e) => setBroadcastContent(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs font-medium rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-purple-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-500 block mb-1">START BROADCAST (TIME STARTS)</label>
                    <input
                      type="datetime-local"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-500 block mb-1">END BROADCAST (TIME ENDS/DEADLINE)</label>
                    <input
                      type="datetime-local"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sendEmail}
                      onChange={(e) => setSendEmail(e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">📧 Send Email Alert</span>
                      <span className="text-[10px] text-slate-400 block">Directly to inbox</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sendSms}
                      onChange={(e) => setSendSms(e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">📱 Send Phone SMS</span>
                      <span className="text-[10px] text-slate-400 block">Directly to mobile device</span>
                    </div>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-md hover:from-purple-700 hover:to-indigo-700 transition-all cursor-pointer"
                >
                  Broadcast & Schedule Notifications
                </button>
              </form>
            </div>
          )}

          {/* TAB 7: CONNECT HUB (Screen 5 Match) */}
          {activeTab === 'connect' && (
            <div className="space-y-6">
              
              {/* Header Dark Card */}
              <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Organizer Hub • Realtime Collaboration Network
                  </span>
                  <h2 className="text-2xl font-black tracking-tight">Connect & Coordinate Sprints</h2>
                  <p className="text-xs text-slate-300 max-w-xl">
                    Prevent event collisions, align prize pool distribution dates, and chat directly with verified hackathon organizers across India.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="px-4 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                    <span className="text-lg font-black text-emerald-400 block">4</span>
                    <span className="text-[9px] font-extrabold text-emerald-300 uppercase">Active Hosts Online</span>
                  </div>
                  <div className="px-4 py-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-center">
                    <span className="text-lg font-black text-indigo-400 block">0</span>
                    <span className="text-[9px] font-extrabold text-indigo-300 uppercase">Collisions</span>
                  </div>
                </div>
              </div>

              {/* Timeline Cards */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <span>🗓️</span> Coordinated Timeline Calendar
                  </h3>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold rounded-full">
                    ● Live Schedule Synced
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { title: 'AI Innovation Challenge 2026', org: 'TechCorp India Labs', dates: 'Sep 01 — Sep 07', tag: 'Live Now', badgeColor: 'bg-emerald-100 text-emerald-700', desc: 'Build production-grade AI agents & LLM-powered apps with live mentor reviews.' },
                    { title: 'Vercel Web3 Builder Sprint', org: 'Vercel India Hub', dates: 'Sep 15 — Sep 22', tag: 'Confirmed', badgeColor: 'bg-indigo-100 text-indigo-700', desc: 'Ship decentralized dApps on Vercel with a focus on real-world Web3 infrastructure.' },
                    { title: 'Smart Cities Hackathon 2026', org: 'Green Tech Coalition', dates: 'Oct 10 — Oct 15', tag: 'Upcoming', badgeColor: 'bg-amber-100 text-amber-700', desc: 'Design IoT & sustainability solutions for cleaner, smarter urban living.' },
                    { title: 'FinTech Disrupt Challenge', org: 'Apex Bank Labs', dates: 'Nov 05 — Nov 10', tag: 'Planning', badgeColor: 'bg-slate-100 text-slate-700', desc: 'Reimagine banking with open APIs, fraud AI and inclusive payments rails.' },
                  ].map((card, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold ${card.badgeColor}`}>{card.tag}</span>
                        <span className="text-[9px] text-slate-400 font-bold">GenAI, Web3</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs">{card.title}</h4>
                      <p className="text-[10px] text-slate-400">{card.org}</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{card.desc}</p>
                      <p className="text-[11px] font-bold text-slate-700 pt-1 border-t border-slate-200">{card.dates}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat & Verified Organizers */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Organizers List */}
                <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black uppercase text-slate-900">VERIFIED ORGANIZERS</h4>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">3 Online</span>
                  </div>

                  <div className="space-y-2">
                    {CONTACTS.map((c) => (
                      <div
                        key={c.id}
                        className={`p-3 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                          activeDmContact?.id === c.id
                            ? 'bg-purple-50 border-purple-200'
                            : 'bg-slate-50 border-slate-200/80 hover:border-purple-300'
                        }`}
                        onClick={() => setActiveDmContact(activeDmContact?.id === c.id ? null : c)}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="relative">
                            <img src={c.avatar} alt={c.name} className="w-8 h-8 rounded-full object-cover" />
                            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                          </div>
                          <div className="min-w-0">
                            <h5 className="text-xs font-bold text-slate-900 truncate">{c.name}</h5>
                            <p className="text-[10px] text-slate-400 truncate">{c.org}</p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDmContact(activeDmContact?.id === c.id ? null : c);
                          }}
                          className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-colors cursor-pointer ${
                            activeDmContact?.id === c.id
                              ? 'bg-purple-600 text-white border-purple-600'
                              : 'bg-white border-slate-200 hover:border-purple-300 text-purple-700'
                          }`}
                        >
                          {activeDmContact?.id === c.id ? 'DM Active' : 'DM'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Chat Window */}
                <div className="lg:col-span-8 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      {activeDmContact ? (
                        <>
                          <img src={activeDmContact.avatar} alt={activeDmContact.name} className="w-7 h-7 rounded-full object-cover" />
                          <div className="min-w-0">
                            <h4 className="text-xs font-black text-slate-900 truncate">{activeDmContact.name}</h4>
                            <p className="text-[10px] text-emerald-600 font-bold">Direct Message • {activeDmContact.org}</p>
                          </div>
                        </>
                      ) : (
                        <h4 className="text-xs font-black text-slate-900">Public Organizer Network</h4>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {activeDmContact ? (
                        <button
                          onClick={() => setActiveDmContact(null)}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg cursor-pointer transition-colors"
                        >
                          ← Back to Public Room
                        </button>
                      ) : (
                        <span className="px-3 py-1 bg-purple-50 text-purple-700 text-[10px] font-bold rounded-lg">📢 Public Room</span>
                      )}
                    </div>
                  </div>

                  {/* Pinned Rule Banner (public room only) */}
                  {!activeDmContact && (
                    <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center justify-between">
                      <span>📌 PINNED: Finalize your September hackathon prize dates by Sep 10th to prevent collisions.</span>
                      <span className="text-[10px] font-bold">Rule #4</span>
                    </div>
                  )}

                  {/* Messages Stream */}
                  <div className="space-y-3 min-h-[160px] max-h-[220px] overflow-y-auto p-2">
                    {(activeDmContact
                      ? (chatDirectMessages[activeDmContact.id] || [])
                      : chatPublicMessages
                    ).map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-3 rounded-2xl border text-xs max-w-[85%] ${
                          msg.isMe
                            ? 'bg-purple-600 text-white border-purple-600 ml-auto'
                            : 'bg-slate-50 border-slate-100'
                        }`}
                      >
                        <div className={`flex justify-between items-center mb-1 ${msg.isMe ? 'text-purple-100' : ''}`}>
                          <span className={`font-bold ${msg.isMe ? 'text-white' : 'text-purple-700'}`}>{msg.sender}</span>
                          <span className={`text-[10px] ${msg.isMe ? 'text-purple-200' : 'text-slate-400'}`}>{msg.time}</span>
                        </div>
                        <p className={`font-medium ${msg.isMe ? 'text-white' : 'text-slate-700'}`}>{msg.text}</p>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-400 font-semibold flex items-center gap-2 w-fit">
                        <span className="flex gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:150ms]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:300ms]" />
                        </span>
                        {activeDmContact ? activeDmContact.name : 'Another organizer'} is typing…
                      </div>
                    )}
                  </div>

                  {/* Message Input Form */}
                  <form className="flex items-center gap-2 pt-2" onSubmit={handleSendChatMessage}>
                    <input
                      type="text"
                      placeholder={
                        activeDmContact
                          ? `Message ${activeDmContact.name}...`
                          : 'Type a message to all organizers...'
                      }
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 px-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-purple-500 outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-purple-600 text-white font-bold text-xs rounded-xl hover:bg-purple-700 cursor-pointer flex items-center gap-1"
                    >
                      <Send className="w-3.5 h-3.5" /> Send
                    </button>
                  </form>
                </div>
              </div>

            </div>
          )}

          {/* TAB 8: WORKSPACE SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm max-w-2xl mx-auto space-y-6">
              <h2 className="text-2xl font-black text-slate-900">Workspace Settings</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-600 block mb-1">Organization Name</label>
                  <input
                    type="text"
                    value={currentOrg}
                    onChange={(e) => setCurrentOrg(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs font-medium rounded-xl bg-slate-50 border border-slate-200 focus:bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-600 block mb-1">Support Email</label>
                  <input
                    type="email"
                    defaultValue="organizer@hackathoncentral.io"
                    className="w-full px-4 py-2.5 text-xs font-medium rounded-xl bg-slate-50 border border-slate-200 focus:bg-white outline-none"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={() => notify('Workspace settings saved!', 'success')}
                    className="px-6 py-2.5 bg-purple-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-purple-700 cursor-pointer"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: DETAILS POPUP (ALL MEMBERS DETAILS WITH ACTIVE SELECTOR TABS & APPROVE/REJECT) */}
          {selectedMemberDetails && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 border border-slate-200/90 max-h-[90vh] overflow-y-auto">
                
                {/* Header */}
                <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-100 text-indigo-700">
                      REGISTRATION DETAILS DOSSIER
                    </span>
                    <h3 className="text-xl font-black text-slate-900 mt-1">{selectedMemberDetails.groupName}</h3>
                    <p className="text-xs text-slate-500 font-mono">Code: {selectedMemberDetails.code}</p>
                  </div>
                  <button
                    onClick={() => setSelectedMemberDetails(null)}
                    className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Member Selector Tabs */}
                {(() => {
                  const membersList = Array.isArray(selectedMemberDetails.members) && selectedMemberDetails.members.length > 0
                    ? selectedMemberDetails.members
                    : [
                        { name: selectedMemberDetails.groupName?.replace("'s Entry", '') || 'Team Lead', role: 'Team Lead', email: selectedMemberDetails.leaderEmail }
                      ];

                  const activeIdx = expandedMemberIdx !== null && expandedMemberIdx < membersList.length ? expandedMemberIdx : 0;
                  const currentMember = membersList[activeIdx] || membersList[0];

                  return (
                    <div className="space-y-4 text-xs">
                      {/* Team Overview (3 lines) */}
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                        <span className="text-[10px] font-black uppercase text-slate-400 block">Team Overview</span>
                        <div className="flex items-center gap-2">
                          <span>👥</span>
                          <span className="text-slate-500 font-semibold">Team Size:</span>
                          <strong className="text-slate-900">{selectedMemberDetails.groupSize || `${membersList.length} Members`}</strong>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>📅</span>
                          <span className="text-slate-500 font-semibold">Registered:</span>
                          <strong className="text-slate-900">{selectedMemberDetails.registeredAt || 'Today'}</strong>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>📧</span>
                          <span className="text-slate-500 font-semibold">Lead Email:</span>
                          <strong className="text-slate-900 break-all">{selectedMemberDetails.leaderEmail}</strong>
                        </div>
                      </div>

                      {/* Tabs */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase text-slate-400 block">Select Member To Inspect:</span>
                        <div className="flex items-center gap-2 overflow-x-auto pb-1">
                          {membersList.map((m: any, idx: number) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setExpandedMemberIdx(idx)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 border ${
                                activeIdx === idx
                                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                                  : 'bg-slate-50 text-slate-700 hover:bg-indigo-50 border-slate-200'
                              }`}
                            >
                              <span>{idx === 0 ? '👑' : '👤'} {m.name || `Member #${idx + 1}`}</span>
                              <span className="text-[9px] opacity-80 bg-white/20 px-1.5 py-0.2 rounded">({m.role || 'Member'})</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Active Member Details Card */}
                      <div className="space-y-3 p-5 rounded-2xl bg-indigo-50/40 border border-indigo-100">
                        <div className="flex justify-between items-start pb-2 border-b border-indigo-100">
                          <div>
                            <span className="font-black text-slate-900 text-sm block">{currentMember.name || 'Member Details'}</span>
                            <span className="text-[11px] text-slate-500 font-medium">{currentMember.role || 'Team Member'}</span>
                          </div>
                          <span className="px-2.5 py-1 rounded-xl bg-white text-indigo-700 font-extrabold text-[10px] border border-indigo-100">
                            Member #{activeIdx + 1} of {membersList.length}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <span className="text-slate-400 font-bold block">Full Name:</span>
                            <span className="font-extrabold text-slate-900 text-xs">{currentMember.name || '—'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-bold block">Email:</span>
                            <span className="font-semibold text-slate-900">{currentMember.email || '—'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-bold block">Phone Number:</span>
                            <span className="font-semibold text-slate-900">{currentMember.phone || '—'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-bold block">College / Organization:</span>
                            <span className="font-semibold text-slate-900">{currentMember.organization || '—'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-bold block">Role / Designation:</span>
                            <span className="font-semibold text-slate-900">{currentMember.role || '—'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-bold block">GitHub / LinkedIn:</span>
                            <span className="font-semibold text-indigo-700 break-all">
                              {currentMember.github || currentMember.linkedin || '—'}
                              {currentMember.github && currentMember.linkedin ? ` • ${currentMember.linkedin}` : ''}
                            </span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-indigo-100">
                          <span className="text-slate-400 font-bold block mb-1">Skills & Proficiency:</span>
                          <span className="font-extrabold text-indigo-700">{currentMember.skills || '—'}</span>
                        </div>
                      </div>

                      {/* Registration Responses if present */}
                      {currentMember.customAnswers && (
                        <div className="space-y-2 pt-2">
                          <h5 className="font-bold text-slate-900 text-xs">Registration Responses</h5>
                          {Object.entries(currentMember.customAnswers).map(([q, a], idx) => (
                            <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                              <span className="font-bold text-slate-900 block">Q: {q}</span>
                              <p className="text-slate-700 font-medium">{a as string}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Footer Approve / Reject Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      handleRegistrationAction(selectedMemberDetails.id, 'APPROVED');
                      setSelectedMemberDetails(null);
                    }}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                  >
                    Approve Registration
                  </button>

                  <button
                    onClick={() => {
                      handleRegistrationAction(selectedMemberDetails.id, 'REJECTED');
                      setSelectedMemberDetails(null);
                    }}
                    className="px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Reject Registration
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* POPUP MODAL: JUDGE CREDENTIALS EMAIL & DISPATCH REPORT */}
          {selectedJudgeForCreds && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 border border-slate-200/90">
                
                {/* Modal Header */}
                <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-700 tracking-wider">
                      ✉️ CONFIRMED EMAIL DISPATCH
                    </span>
                    <h3 className="text-xl font-black text-slate-900 mt-1">Judge Credentials Issued</h3>
                    <p className="text-xs text-slate-500 font-medium">Mailed directly to <strong className="text-indigo-600">{selectedJudgeForCreds.email}</strong></p>
                  </div>
                  <button
                    onClick={() => setSelectedJudgeForCreds(null)}
                    className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Email Dispatch & Credential Body */}
                <div className="space-y-4 text-xs">
                  {/* Sender Badge */}
                  <div className="p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between text-indigo-900 font-semibold">
                    <div>
                      <span className="text-[9px] font-black uppercase text-indigo-400 block">Sender Mailer</span>
                      <span className="font-extrabold text-indigo-700">{selectedJudgeForCreds.supportEmail || 'support@hackathons.io'}</span>
                    </div>
                    <span className="px-2 py-1 rounded-md bg-white text-emerald-700 text-[10px] font-extrabold shadow-2xs">
                      ✓ Email Sent
                    </span>
                  </div>

                  {/* Issued Credentials Box */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                    <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider">Judge Account Credentials</h4>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-200">
                        <span className="text-slate-500 font-bold">Judge Name:</span>
                        <span className="font-extrabold text-slate-900">{selectedJudgeForCreds.name}</span>
                      </div>
                      <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-200">
                        <span className="text-slate-500 font-bold">Assigned Track:</span>
                        <span className="font-extrabold text-purple-700">{selectedJudgeForCreds.track}</span>
                      </div>
                      <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-200">
                        <span className="text-slate-500 font-bold">Username:</span>
                        <span className="font-mono font-bold text-slate-900">{selectedJudgeForCreds.username}</span>
                      </div>
                      <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-200">
                        <span className="text-slate-500 font-bold">Temporary Password:</span>
                        <span className="font-mono font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{selectedJudgeForCreds.tempPassword}</span>
                      </div>
                      <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-200">
                        <span className="text-slate-500 font-bold">Judge Portal Login:</span>
                        <a href={selectedJudgeForCreds.portalUrl} target="_blank" rel="noreferrer" className="font-mono font-bold text-xs text-indigo-600 underline">
                          {selectedJudgeForCreds.portalUrl}
                        </a>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 font-medium leading-normal">
                    * An automated email containing login instructions and temporary credentials was dispatched from <strong>support@hackathons.io</strong> to {selectedJudgeForCreds.email}.
                  </p>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(
                        `Judge Login Credentials\nUsername: ${selectedJudgeForCreds.username}\nPassword: ${selectedJudgeForCreds.tempPassword}\nPortal: ${selectedJudgeForCreds.portalUrl}`
                      );
                      notify('Credentials copied to clipboard!', 'success');
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors"
                  >
                    📋 Copy Credentials
                  </button>

                  <button
                    onClick={() => setSelectedJudgeForCreds(null)}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                  >
                    Done
                  </button>
                </div>

              </div>
            </div>
          )}

        </main>

      </div>

      {/* Notification Drawer (live store feed shared with participants) */}
      <NotificationDrawer
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </div>
  );
};
