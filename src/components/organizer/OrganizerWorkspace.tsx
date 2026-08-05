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
  LogOut
} from 'lucide-react';
import type { Hackathon, Team, Announcement } from '../../types';
import { useHackathonStore } from '../../stores/hackathonStore';
import { useTeamStore } from '../../stores/teamStore';
import { useNotificationStore } from '../../stores/notificationStore';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { useToastStore } from '../../stores/toastStore';
import { CreateHackathonWizard } from './CreateHackathonWizard';
import { hackathonApi } from '../../services/hackathonApi';

interface OrganizerWorkspaceProps {
  hackathons?: Hackathon[];
  teams?: Team[];
  announcements?: Announcement[];
  onCreateHackathon?: (hackathon: Hackathon) => void;
  onDeleteHackathon?: (hackathonId: string) => void;
  onUpdateTeamStatus?: (teamId: string, status: 'Approved' | 'Rejected') => void;
  onBroadcastAnnouncement?: (announcement: Announcement) => void;
}

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
  const addHackathon = useHackathonStore((s) => s.addHackathon);
  const updateHackathonStore = useHackathonStore((s) => s.updateHackathon);
  const deleteHackathonStore = useHackathonStore((s) => s.deleteHackathon);
  const storeTeams = useTeamStore((s) => s.teams);
  const storeAnnouncements = useNotificationStore((s) => s.announcements);

  const hackathons = (propsHackathons && propsHackathons.length > 0) ? propsHackathons : storeHackathons;
  const teams = (propsTeams && propsTeams.length > 0) ? propsTeams : storeTeams;

  const [editingHackathonId, setEditingHackathonId] = useState<string | null>(null);

  // Active Tab Navigation
  const [activeTab, setActiveTab] = useState<
    'overview' | 'hackathons' | 'create' | 'registrations' | 'judges' | 'broadcaster' | 'connect' | 'settings'
  >('overview');

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
  const [selectedMemberDetails, setSelectedMemberDetails] = useState<any | null>(null);
  const [expandedMemberIdx, setExpandedMemberIdx] = useState<number | null>(null);

  const [registrationList, setRegistrationList] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('hc_global_registrations');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [
      {
        id: '1',
        groupName: 'CyberPioneers',
        code: 'CYBER-2026',
        leaderEmail: 'ansar@hackathoncentral.io',
        groupSize: '4 Members',
        status: 'APPROVED',
        hackathonId: 'h-1',
        hackathonTitle: 'AI Hackathon 2026',
        registrationType: 'team',
        registeredAt: 'Today, 10:15 AM',
        members: [
          {
            name: 'Ansar Shaik',
            email: 'ansar@hackathoncentral.io',
            phone: '+91 9876543210',
            organization: 'IIT Madras',
            department: 'Computer Science & Engineering',
            yearSemester: '4th Year / 8th Sem',
            role: 'Team Lead & AI Engineer',
            skills: 'Python, PyTorch, LangChain, React, FastAPI',
            experienceLevel: 'Advanced',
            github: 'https://github.com/ansar-ai',
            linkedin: 'https://linkedin.com/in/ansar-shaik',
            portfolio: 'https://ansar.dev',
            resumeFileName: 'Ansar_Shaik_Resume.pdf',
            customAnswers: {
              'Why do you want to join this hackathon?': 'To build enterprise-grade generative AI co-pilots and deploy scalable web apps.',
              'Previous Hackathon Experience': 'Winner of Global AI Sprint 2025 and 1st Runner Up in HackGov 2025.'
            }
          },
          {
            name: 'Bhavya Sri',
            email: 'bhavya@hackathon.com',
            phone: '+91 9812345678',
            organization: 'BITS Pilani',
            department: 'Information Technology',
            yearSemester: '3rd Year / 6th Sem',
            role: 'Frontend & UX Lead',
            skills: 'TypeScript, React 18, TailwindCSS, Vite, Zustand',
            experienceLevel: 'Intermediate',
            github: 'https://github.com/bhavya-code',
            linkedin: 'https://linkedin.com/in/bhavya-sri',
            resumeFileName: 'Bhavya_Sri_Resume.pdf'
          },
          {
            name: 'Rahul Sharma',
            email: 'rahul@hackathon.com',
            phone: '+91 9765432109',
            organization: 'IIT Delhi',
            department: 'Electrical Engineering',
            yearSemester: '4th Year / 7th Sem',
            role: 'Backend Architect',
            skills: 'Node.js, PostgreSQL, Docker, Redis, Kubernetes',
            experienceLevel: 'Advanced',
            github: 'https://github.com/rahul-dev',
            linkedin: 'https://linkedin.com/in/rahul-sharma',
            resumeFileName: 'Rahul_Sharma_Resume.pdf'
          },
          {
            name: 'Sneha Patel',
            email: 'sneha@hackathon.com',
            phone: '+91 9654321098',
            organization: 'NIT Trichy',
            department: 'Data Science & AI',
            yearSemester: '3rd Year / 5th Sem',
            role: 'ML Engineer',
            skills: 'Python, Scikit-learn, OpenCV, HuggingFace',
            experienceLevel: 'Intermediate',
            github: 'https://github.com/sneha-ml',
            linkedin: 'https://linkedin.com/in/sneha-patel',
            resumeFileName: 'Sneha_Patel_Resume.pdf'
          }
        ]
      },
      {
        id: '2',
        groupName: 'Visionary Crew',
        code: 'VISION-99',
        leaderEmail: 'alex@visionary.io',
        groupSize: '2 Members',
        status: 'APPROVED',
        hackathonId: 'h-2',
        hackathonTitle: 'Quantum FinTech Challenge',
        registrationType: 'team',
        registeredAt: 'Yesterday, 04:30 PM',
        members: [
          {
            name: 'Alex Rivera',
            email: 'alex@visionary.io',
            phone: '+1 415 555 0199',
            organization: 'Stanford University',
            department: 'Computational Finance',
            yearSemester: 'Graduate / MS',
            role: 'Team Lead & Blockchain Developer',
            skills: 'Solidity, Rust, Web3.js, Ethers.js, Go',
            experienceLevel: 'Advanced',
            github: 'https://github.com/alex-visionary',
            linkedin: 'https://linkedin.com/in/alex-rivera',
            resumeFileName: 'Alex_Rivera_CV.pdf'
          }
        ]
      },
      {
        id: '3',
        groupName: 'Carlos Solo Hack',
        code: 'QNTM-404',
        leaderEmail: 'carlos@quantum.org',
        groupSize: '1 Member',
        status: 'UNDER_REVIEW',
        hackathonId: 'h-3',
        hackathonTitle: 'HealthTech AI Summit',
        registrationType: 'individual',
        registeredAt: 'Today, 11:45 AM',
        members: [
          {
            name: 'Carlos Mendoza',
            email: 'carlos@quantum.org',
            phone: '+1 650 555 0144',
            organization: 'MIT',
            department: 'Bioinformatics',
            yearSemester: '2nd Year / MS',
            role: 'Solo Hacker & ML Researcher',
            skills: 'Python, TensorFlow, Scikit-learn, BioPython',
            experienceLevel: 'Intermediate',
            github: 'https://github.com/carlos-mit',
            resumeFileName: 'Carlos_Mendoza_Resume.pdf',
            customAnswers: {
              'Why do you want to join this hackathon?': 'To solve predictive healthcare diagnosis challenges using multimodal neural models.'
            }
          }
        ]
      }
    ];
  });

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

    notify(`All pending registrations for "${hackathonTitle}" approved successfully!`, 'success');
  };

  // State for Judges
  const [judgeName, setJudgeName] = useState('');
  const [judgeEmail, setJudgeEmail] = useState('');
  const [judgeExpertise, setJudgeExpertise] = useState('');
  const [assignedTrack, setAssignedTrack] = useState('Generative AI');
  const [judgesList, setJudgesList] = useState([
    { id: '1', name: 'Dr. Suresh Kumar', email: 'suresh@judge.io', track: 'Generative AI', expertise: 'Computer Vision & LLMs' },
    { id: '2', name: 'Elena Rostova', email: 'elena@judge.io', track: 'Agentic Coding', expertise: 'Web3 Security' },
  ]);

  // State for Broadcaster
  const [broadcastTargetEvent, setBroadcastTargetEvent] = useState('Web3 & Decentralized Scale-A-Thon');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastContent, setBroadcastContent] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sendEmail, setSendEmail] = useState(true);
  const [sendSms, setSendSms] = useState(false);

  // State for Connect Hub Chat
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Elena (Vercel India)', time: '10:30 AM', message: 'Hey organizers! Finalizing our Web3 Sprint prize dates for September.' },
    { sender: 'Suresh (Apex Labs)', time: '10:35 AM', message: 'Sounds great. We are hosting FinTech Disrupt in November to avoid collision.' },
  ]);
  const [newMessage, setNewMessage] = useState('');

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
        useNotificationStore.getState().addAnnouncement({
          id: `ann-${Date.now()}`,
          hackathonId: targetItem.hackathonId || 'h-1',
          hackathonTitle: targetItem.hackathonTitle || 'Hackathon',
          title: `Registration Status Update: ${newStatus}`,
          content: `Your registration for "${targetItem.hackathonTitle || 'Hackathon'}" (${targetItem.groupName}) has been marked as ${newStatus}.`,
          priority: newStatus === 'APPROVED' ? 'HIGH' : 'MEDIUM',
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: newStatus === 'APPROVED' ? 'update' : 'critical'
        });
      }
      return updated;
    });
    notify(`Team registration status updated to ${newStatus}`, 'success');
  };

  // Handle Appoint Judge
  const handleAppointJudge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judgeName || !judgeEmail) {
      notify('Please enter Judge Name and Email', 'warning');
      return;
    }
    setJudgesList(prev => [...prev, {
      id: String(Date.now()),
      name: judgeName,
      email: judgeEmail,
      track: assignedTrack,
      expertise: judgeExpertise || 'General AI & Web Development'
    }]);
    setJudgeName('');
    setJudgeEmail('');
    setJudgeExpertise('');
    notify(`Judge ${judgeName} appointed successfully!`, 'success');
  };

  // Handle Revoke Judge
  const handleRevokeJudge = (id: string) => {
    setJudgesList(prev => prev.filter(j => j.id !== id));
    notify('Judge credentials revoked', 'info');
  };

  // Handle Broadcast Submission
  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastContent) {
      notify('Please fill in announcement title and content', 'warning');
      return;
    }
    notify(`Broadcast "${broadcastTitle}" sent to participants!`, 'success');
    setBroadcastTitle('');
    setBroadcastContent('');
  };

  // Handle Send Chat
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setChatMessages(prev => [...prev, {
      sender: `${user?.name || 'You'} (${currentOrg})`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      message: newMessage
    }]);
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
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
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
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: 'Total Hackathons', value: hackathons.length || 13, icon: Trophy, color: 'text-purple-600 bg-purple-50' },
                  { title: 'Active Registrations', value: '1,420', icon: Users, color: 'text-indigo-600 bg-indigo-50' },
                  { title: 'Projects Submitted', value: '384', icon: Layers, color: 'text-emerald-600 bg-emerald-50' },
                  { title: 'Total Prize Pool', value: '₹50,00,000', icon: Award, color: 'text-amber-600 bg-amber-50' },
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

              {/* Quick Actions & Recent Overview */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-lg font-black text-slate-900">Active Hackathons Overview</h3>
                <div className="divide-y divide-slate-100">
                  {hackathons.slice(0, 4).map((h, i) => (
                    <div key={i} className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{h.title || `Hackathon #${i+1}`}</h4>
                        <p className="text-xs text-slate-400">{h.tagline || 'AI & Cloud Infrastructure Challenge'}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-700">
                        {h.status || 'PUBLISHED'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hackathons.map((h, i) => (
                  <div key={i} className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-black text-slate-900 text-base">{h.title}</h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-100 text-indigo-700">
                        {h.status || 'Active'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">{h.description || h.tagline || 'No description available'}</p>
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
              onPublish={(newHackathon) => {
                if (editingHackathonId) {
                  updateHackathonStore(editingHackathonId, newHackathon);
                  hackathonApi.update(editingHackathonId, newHackathon).catch(() => {});
                } else {
                  addHackathon(newHackathon);
                  hackathonApi.create(newHackathon).catch(() => {});
                }

                setEditingHackathonId(null);
                setActiveTab('hackathons');
                addToast({
                  title: 'Hackathon Published! 🚀',
                  message: `"${newHackathon.title}" is now live on the platform portal.`,
                  type: 'success',
                  duration: 5000
                });
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
                      onClick={() => setSelectedHackathonForReg(null)}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors"
                    >
                      ← Back to All Hackathons
                    </button>
                  )}
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
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-100 text-indigo-700">
                                {h.status || 'Active'}
                              </span>
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
                </div>
              ) : (
                /* SPECIFIC HACKATHON REGISTRATION TABLE */
                <div className="space-y-4">
                  {(() => {
                    const targetHack = hackathons.find(h => h.id === selectedHackathonForReg);
                    const filteredRegs = registrationList.filter(r => r.hackathonId === selectedHackathonForReg || (!r.hackathonId && selectedHackathonForReg === 'h-1'));
                    const pendingCount = filteredRegs.filter(r => r.status === 'UNDER_REVIEW' || !r.status).length;

                    return (
                      <div className="space-y-4">
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

                        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-slate-50/80 text-[10px] font-black uppercase text-slate-400 border-b border-slate-100">
                                <tr>
                                  <th className="px-6 py-4">TEAM / PARTICIPANT</th>
                                  <th className="px-6 py-4">REG CODE</th>
                                  <th className="px-6 py-4">LEADER CONTACT</th>
                                  <th className="px-6 py-4">MEMBERS</th>
                                  <th className="px-6 py-4">STATUS</th>
                                  <th className="px-6 py-4 text-right">ACTIONS</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                                {filteredRegs.map((row) => (
                                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                      <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-indigo-600" />
                                        <div>
                                          <span className="font-bold text-slate-900 block">{row.groupName}</span>
                                          <span className="text-[10px] text-slate-400">{row.registeredAt || 'Today'}</span>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 font-mono text-[11px]">{row.code}</td>
                                    <td className="px-6 py-4">{row.leaderEmail}</td>
                                    <td className="px-6 py-4">
                                      <button
                                        onClick={() => {
                                          setSelectedMemberDetails(row);
                                          setExpandedMemberIdx(null);
                                        }}
                                        className="px-2.5 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-[11px] border border-indigo-100 transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                                        title="Click to view all team members and their full details"
                                      >
                                        <span>👥 {row.groupSize || '1 Member'}</span>
                                        <span className="text-[9px] bg-indigo-200/60 px-1 py-0.2 rounded text-indigo-900">View All ↗</span>
                                      </button>
                                    </td>
                                    <td className="px-6 py-4">
                                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                        row.status === 'APPROVED'
                                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                                          : row.status === 'REJECTED'
                                          ? 'bg-rose-100 text-rose-700 border border-rose-300'
                                          : 'bg-amber-100 text-amber-700 border border-amber-300'
                                      }`}>
                                        {row.status || 'UNDER_REVIEW'}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-1.5">
                                      <button
                                        onClick={() => setSelectedMemberDetails(row)}
                                        className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 font-bold text-[11px] rounded-lg cursor-pointer"
                                      >
                                        View Details
                                      </button>

                                      <button
                                        onClick={() => handleRegistrationAction(row.id, 'APPROVED')}
                                        className="px-2.5 py-1 bg-emerald-600 text-white font-bold text-[11px] rounded-lg hover:bg-emerald-700 cursor-pointer shadow-2xs"
                                      >
                                        Approve
                                      </button>
                                      <button
                                        onClick={() => handleRegistrationAction(row.id, 'REJECTED')}
                                        className="px-2.5 py-1 bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 font-bold text-[11px] rounded-lg cursor-pointer"
                                      >
                                        Reject
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
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
                    <h3 className="text-base font-black text-slate-900">APPOINTED PANEL ({judgesList.length})</h3>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Active Evaluators</span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {judgesList.map((j) => (
                      <div key={j.id} className="py-3 flex items-center justify-between gap-4">
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs">{j.name}</h4>
                          <p className="text-[10px] text-slate-400">{j.email}</p>
                          <p className="text-[11px] font-bold text-purple-600 mt-0.5">{j.track}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-500 font-medium">{j.expertise}</p>
                          <button
                            onClick={() => handleRevokeJudge(j.id)}
                            className="text-xs font-bold text-rose-600 hover:text-rose-700 mt-1 cursor-pointer"
                          >
                            Revoke
                          </button>
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
                    { title: 'AI Innovation Challenge 2026', org: 'TechCorp India Labs', dates: 'Sep 01 — Sep 07', tag: 'Live Now', badgeColor: 'bg-emerald-100 text-emerald-700' },
                    { title: 'Vercel Web3 Builder Sprint', org: 'Vercel India Hub', dates: 'Sep 15 — Sep 22', tag: 'Confirmed', badgeColor: 'bg-indigo-100 text-indigo-700' },
                    { title: 'Smart Cities Hackathon 2026', org: 'Green Tech Coalition', dates: 'Oct 10 — Oct 15', tag: 'Upcoming', badgeColor: 'bg-amber-100 text-amber-700' },
                    { title: 'FinTech Disrupt Challenge', org: 'Apex Bank Labs', dates: 'Nov 05 — Nov 10', tag: 'Planning', badgeColor: 'bg-slate-100 text-slate-700' },
                  ].map((card, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold ${card.badgeColor}`}>{card.tag}</span>
                        <span className="text-[9px] text-slate-400 font-bold">GenAI, Web3</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs">{card.title}</h4>
                      <p className="text-[10px] text-slate-400">{card.org}</p>
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
                    {[
                      { name: 'Elena Rostova', org: 'Vercel India Hub', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
                      { name: 'Suresh Kumar', org: 'Apex Bank Labs', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
                      { name: 'Ananya Sharma', org: 'GreenTech Coalition', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' },
                    ].map((org, i) => (
                      <div key={i} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img src={org.avatar} alt={org.name} className="w-8 h-8 rounded-full object-cover" />
                          <div className="min-w-0">
                            <h5 className="text-xs font-bold text-slate-900 truncate">{org.name}</h5>
                            <p className="text-[10px] text-slate-400 truncate">{org.org}</p>
                          </div>
                        </div>
                        <button className="px-2.5 py-1 text-[10px] font-bold bg-white border border-slate-200 hover:border-purple-300 rounded-lg text-purple-700 cursor-pointer">
                          DM
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Chat Window */}
                <div className="lg:col-span-8 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h4 className="text-xs font-black text-slate-900">Public Organizer Network</h4>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-purple-50 text-purple-700 text-[10px] font-bold rounded-lg">📢 Public Room</span>
                    </div>
                  </div>

                  {/* Pinned Rule Banner */}
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center justify-between">
                    <span>📌 PINNED: Finalize your September hackathon prize dates by Sep 10th to prevent collisions.</span>
                    <span className="text-[10px] font-bold">Rule #4</span>
                  </div>

                  {/* Messages Stream */}
                  <div className="space-y-3 min-h-[160px] max-h-[220px] overflow-y-auto p-2">
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-purple-700">{msg.sender}</span>
                          <span className="text-[10px] text-slate-400">{msg.time}</span>
                        </div>
                        <p className="text-slate-700 font-medium">{msg.message}</p>
                      </div>
                    ))}
                  </div>

                  {/* Message Input Form */}
                  <form className="flex items-center gap-2 pt-2" onSubmit={handleSendChatMessage}>
                    <input
                      type="text"
                      placeholder="Type a message to all organizers..."
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

          {/* Redesigned & Enhanced Registration Details Popup */}
          {selectedMemberDetails && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl space-y-6 border border-slate-200/90 max-h-[90vh] flex flex-col justify-between">
                
                {/* Modal Header */}
                <div className="flex justify-between items-start border-b border-slate-100 pb-4 shrink-0">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-100 text-indigo-700 tracking-wider">
                      REGISTRATION DOSSIER
                    </span>
                    <h3 className="text-xl font-black text-slate-900 mt-1">{selectedMemberDetails.groupName}</h3>
                    <p className="text-xs text-slate-500 font-mono">Reg Code: <strong className="text-indigo-600">{selectedMemberDetails.code}</strong></p>
                  </div>
                  <button
                    onClick={() => setSelectedMemberDetails(null)}
                    className="p-2 text-slate-400 hover:text-slate-700 rounded-2xl hover:bg-slate-100 cursor-pointer transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Internally Scrollable Body Content */}
                <div className="overflow-y-auto pr-1 space-y-6 text-xs flex-1">
                  
                  {/* SECTION 1: REGISTRATION OVERVIEW */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-1 border-b border-slate-100 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-600" /> 1. Registration Overview
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <div>
                        <span className="text-[9px] font-black uppercase text-slate-400 block mb-0.5">Hackathon Name</span>
                        <span className="font-bold text-slate-900 line-clamp-1">{selectedMemberDetails.hackathonTitle || 'Hackathon Event'}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-black uppercase text-slate-400 block mb-0.5">Hackathon Code</span>
                        <span className="font-mono font-bold text-slate-700">{selectedMemberDetails.hackathonId || 'HACK-2026'}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-black uppercase text-slate-400 block mb-0.5">Registration Code</span>
                        <span className="font-mono font-bold text-indigo-600">{selectedMemberDetails.code || 'REG-XXXX'}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-black uppercase text-slate-400 block mb-0.5">Registration Date</span>
                        <span className="font-bold text-slate-900">{selectedMemberDetails.registeredAt || 'Today'}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-black uppercase text-slate-400 block mb-0.5">Registration Type</span>
                        <span className="font-black uppercase text-purple-700">{selectedMemberDetails.registrationType || (selectedMemberDetails.groupName?.includes('Solo') ? 'Individual' : 'Team')}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-black uppercase text-slate-400 block mb-0.5">Team Name</span>
                        <span className="font-bold text-slate-900">{selectedMemberDetails.groupName}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-black uppercase text-slate-400 block mb-0.5">Team Size</span>
                        <span className="font-bold text-slate-900">{selectedMemberDetails.groupSize || '1 Member'}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-black uppercase text-slate-400 block mb-0.5">Approval Status</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase inline-block mt-0.5 ${
                          selectedMemberDetails.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                            : selectedMemberDetails.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-700 border border-rose-300'
                            : 'bg-amber-100 text-amber-700 border border-amber-300'
                        }`}>
                          {selectedMemberDetails.status || 'UNDER_REVIEW'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: TEAM LEADER DETAILS */}
                  {(() => {
                    const lead = Array.isArray(selectedMemberDetails.members) && selectedMemberDetails.members.length > 0
                      ? selectedMemberDetails.members[0]
                      : {
                          name: selectedMemberDetails.groupName?.replace("'s Entry", ''),
                          email: selectedMemberDetails.leaderEmail,
                          phone: '+91 9876543210',
                          organization: 'IIT Madras',
                          department: 'Computer Science & Engineering',
                          yearSemester: '4th Year / 8th Sem',
                          skills: 'React, Node.js, Python, TypeScript',
                          github: 'https://github.com/lead-dev',
                          linkedin: 'https://linkedin.com/in/lead-dev',
                          resumeFileName: 'Team_Lead_Resume.pdf'
                        };

                    return (
                      <div className="space-y-3">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-1 border-b border-slate-100 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-purple-600" /> 2. Team Leader / Primary Applicant Details
                        </h4>
                        <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/90 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-extrabold text-slate-900 text-sm">{lead.name || 'Team Leader'}</span>
                              <span className="text-xs text-slate-500 block font-medium">Primary Contact Lead</span>
                            </div>
                            <span className="px-2.5 py-1 rounded-xl bg-white text-indigo-700 font-extrabold text-[10px] border border-indigo-100 shadow-2xs">
                              👑 Team Lead
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                            <div>
                              <span className="text-slate-400 font-bold block">Email:</span>
                              <span className="text-slate-900 font-semibold">{lead.email || selectedMemberDetails.leaderEmail}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 font-bold block">Phone Number:</span>
                              <span className="text-slate-900 font-semibold">{lead.phone || '+91 9876543210'}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 font-bold block">College / Organization:</span>
                              <span className="text-slate-900 font-semibold">{lead.organization || 'IIT Madras'}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 font-bold block">Department / Branch:</span>
                              <span className="text-slate-900 font-semibold">{lead.department || 'Computer Science & Engineering'}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 font-bold block">Year / Semester:</span>
                              <span className="text-slate-900 font-semibold">{lead.yearSemester || '4th Year / 8th Sem'}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 font-bold block">Skills / Tech Stack:</span>
                              <span className="text-indigo-700 font-bold">{lead.skills || 'Full Stack & AI'}</span>
                            </div>
                          </div>

                          {/* Links & Resume Action */}
                          <div className="pt-2 border-t border-indigo-100/80 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                            <div className="flex flex-wrap items-center gap-3">
                              {lead.github && (
                                <a href={lead.github} target="_blank" rel="noreferrer" className="text-indigo-600 font-bold underline hover:text-indigo-800">
                                  GitHub Profile ↗
                                </a>
                              )}
                              {lead.linkedin && (
                                <a href={lead.linkedin} target="_blank" rel="noreferrer" className="text-blue-600 font-bold underline hover:text-blue-800">
                                  LinkedIn Profile ↗
                                </a>
                              )}
                              {lead.portfolio && (
                                <a href={lead.portfolio} target="_blank" rel="noreferrer" className="text-purple-600 font-bold underline hover:text-purple-800">
                                  Portfolio Website ↗
                                </a>
                              )}
                            </div>

                            <button
                              onClick={() => {
                                const filename = lead.resumeFileName || `${lead.name || 'Leader'}_Resume.pdf`;
                                alert(`Viewing/Downloading uploaded resume: ${filename}`);
                              }}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                            >
                              <span>📄 View / Download Resume</span>
                              {lead.resumeFileName && <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">({lead.resumeFileName})</span>}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* SECTION 3: ALL TEAM MEMBERS (CLICK TO VIEW FULL DETAILS) */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-600" /> 3. All Team Members Roster ({Array.isArray(selectedMemberDetails.members) ? selectedMemberDetails.members.length : 1})
                      </h4>
                      <span className="text-[10px] text-slate-400 font-semibold">Click any member to inspect full profile</span>
                    </div>

                    {/* Member Quick-Selector Buttons */}
                    {Array.isArray(selectedMemberDetails.members) && selectedMemberDetails.members.length > 0 && (
                      <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {selectedMemberDetails.members.map((m: any, idx: number) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setExpandedMemberIdx(expandedMemberIdx === idx ? null : idx)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 border ${
                              expandedMemberIdx === idx
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                                : 'bg-slate-50 text-slate-700 hover:bg-indigo-50 border-slate-200'
                            }`}
                          >
                            <span>{idx === 0 ? '👑' : '👤'} {m.name || `Member #${idx + 1}`}</span>
                            <span className="text-[9px] opacity-80 bg-white/20 px-1.5 py-0.2 rounded">({m.role || 'Member'})</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Expanded Member Detailed Profiles Grid */}
                    <div className="grid grid-cols-1 gap-3 pt-1">
                      {Array.isArray(selectedMemberDetails.members) && selectedMemberDetails.members.length > 0 ? (
                        selectedMemberDetails.members.map((m: any, idx: number) => {
                          const isExpanded = expandedMemberIdx === null || expandedMemberIdx === idx;

                          return (
                            <div
                              key={idx}
                              className={`rounded-2xl border transition-all ${
                                isExpanded
                                  ? 'bg-white border-indigo-200 shadow-sm p-4 space-y-3 ring-1 ring-indigo-500/10'
                                  : 'bg-slate-50/60 border-slate-200 p-3 hover:bg-slate-100/80 cursor-pointer'
                              }`}
                              onClick={() => {
                                if (!isExpanded) setExpandedMemberIdx(idx);
                              }}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-black text-xs flex items-center justify-center">
                                    {idx + 1}
                                  </span>
                                  <div>
                                    <span className="font-extrabold text-slate-900 text-xs sm:text-sm">{m.name || `Member #${idx + 1}`}</span>
                                    <span className="text-[11px] text-slate-500 block font-medium">{m.email} {m.phone && `• ${m.phone}`}</span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-extrabold text-[10px] border border-indigo-100">
                                    {m.role || (idx === 0 ? 'Team Lead' : 'Hacker')}
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setExpandedMemberIdx(expandedMemberIdx === idx ? null : idx);
                                    }}
                                    className="text-[10px] text-indigo-600 font-bold hover:underline px-2 py-1 rounded bg-indigo-50"
                                  >
                                    {expandedMemberIdx === idx ? 'Collapse ▲' : 'View All Details ▼'}
                                  </button>
                                </div>
                              </div>

                              {isExpanded && (
                                <div className="space-y-3 pt-2 border-t border-slate-100">
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[11px] bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                                    <div>
                                      <span className="text-slate-400 block font-bold">College / Org:</span>
                                      <span className="font-extrabold text-slate-900">{m.organization || 'IIT Madras'}</span>
                                    </div>
                                    <div>
                                      <span className="text-slate-400 block font-bold">Branch / Department:</span>
                                      <span className="font-extrabold text-slate-900">{m.department || 'Computer Science & Eng'}</span>
                                    </div>
                                    <div>
                                      <span className="text-slate-400 block font-bold">Year / Semester:</span>
                                      <span className="font-extrabold text-slate-900">{m.yearSemester || '3rd Year / 6th Sem'}</span>
                                    </div>
                                    <div>
                                      <span className="text-slate-400 block font-bold">Experience Level:</span>
                                      <span className="font-extrabold text-slate-900">{m.experienceLevel || 'Intermediate'}</span>
                                    </div>
                                  </div>

                                  {m.skills && (
                                    <div className="p-2.5 rounded-xl bg-indigo-50/40 border border-indigo-100 text-[11px]">
                                      <span className="text-slate-500 font-bold block mb-0.5">Skills & Tech Stack:</span>
                                      <span className="text-indigo-800 font-extrabold">{m.skills}</span>
                                    </div>
                                  )}

                                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] pt-1">
                                    <div className="flex items-center gap-3">
                                      {m.github && (
                                        <a href={m.github} target="_blank" rel="noreferrer" className="text-indigo-600 font-bold underline hover:text-indigo-800">
                                          GitHub Profile ↗
                                        </a>
                                      )}
                                      {m.linkedin && (
                                        <a href={m.linkedin} target="_blank" rel="noreferrer" className="text-blue-600 font-bold underline hover:text-blue-800">
                                          LinkedIn Profile ↗
                                        </a>
                                      )}
                                    </div>

                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const name = m.resumeFileName || `${m.name || 'Member'}_Resume.pdf`;
                                        alert(`Viewing/Downloading resume for ${m.name}: ${name}`);
                                      }}
                                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-xl shadow-xs cursor-pointer flex items-center gap-1"
                                    >
                                      <span>📄 View / Download Resume</span>
                                      {m.resumeFileName && <span className="text-[9px] bg-white/20 px-1 rounded">({m.resumeFileName})</span>}
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-500 font-medium">
                          No additional team member records found.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SECTION 4: REGISTRATION RESPONSES & CUSTOM QUESTIONS */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-1 border-b border-slate-100 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500" /> 4. Registration Responses & Custom Answers
                    </h4>
                    
                    <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3">
                      {(() => {
                        const leadResp = Array.isArray(selectedMemberDetails.members) && selectedMemberDetails.members[0]?.customAnswers
                          ? selectedMemberDetails.members[0].customAnswers
                          : {
                              'Why do you want to join this hackathon?': 'To build real-world AI application co-pilots, learn from mentors, and deploy scalable solutions.',
                              'Previous Hackathon Experience': 'Participated in 2 national-level hackathons and won 2nd runner up in Web3 Sprint.'
                            };

                        return Object.entries(leadResp).map(([question, answer], qIdx) => (
                          <div key={qIdx} className="space-y-1 bg-white p-3 rounded-xl border border-amber-100">
                            <span className="text-[11px] font-black text-amber-900 block">Q: {question}</span>
                            <p className="text-xs text-slate-700 leading-relaxed font-medium">A: {answer as string}</p>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>

                </div>

                {/* Modal Footer Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 shrink-0">
                  <div className="text-[11px] font-bold text-slate-500">
                    Current Status: <span className="uppercase text-slate-900">{selectedMemberDetails.status || 'UNDER_REVIEW'}</span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        if (selectedMemberDetails.status === 'APPROVED') {
                          alert('This registration is ALREADY APPROVED.');
                          return;
                        }
                        handleRegistrationAction(selectedMemberDetails.id, 'APPROVED');
                        setSelectedMemberDetails(null);
                      }}
                      disabled={selectedMemberDetails.status === 'APPROVED'}
                      className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer ${
                        selectedMemberDetails.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800 cursor-not-allowed opacity-80'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
                      }`}
                    >
                      {selectedMemberDetails.status === 'APPROVED' ? '✓ Registration Approved' : 'Approve Registration'}
                    </button>

                    <button
                      onClick={() => {
                        if (selectedMemberDetails.status === 'REJECTED') {
                          alert('This registration is ALREADY REJECTED.');
                          return;
                        }
                        handleRegistrationAction(selectedMemberDetails.id, 'REJECTED');
                        setSelectedMemberDetails(null);
                      }}
                      disabled={selectedMemberDetails.status === 'REJECTED'}
                      className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                        selectedMemberDetails.status === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800 cursor-not-allowed opacity-80'
                          : 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200'
                      }`}
                    >
                      {selectedMemberDetails.status === 'REJECTED' ? '✕ Registration Rejected' : 'Reject Registration'}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

        </main>

      </div>
    </div>
  );
};
