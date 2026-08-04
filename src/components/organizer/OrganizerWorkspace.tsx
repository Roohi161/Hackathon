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
  const storeTeams = useTeamStore((s) => s.teams);
  const storeAnnouncements = useNotificationStore((s) => s.announcements);

  const hackathons = (propsHackathons && propsHackathons.length > 0) ? propsHackathons : storeHackathons;
  const teams = (propsTeams && propsTeams.length > 0) ? propsTeams : storeTeams;

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
      { id: '1', groupName: 'CyberPioneers', code: 'CYBER-2026', leaderEmail: 'ansar@hackathoncentral.io', groupSize: '4 Members', status: 'APPROVED', hackathonId: 'h-1', hackathonTitle: 'AI Hackathon 2026' },
      { id: '2', groupName: 'Visionary Crew', code: 'VISION-99', leaderEmail: 'alex@visionary.io', groupSize: '2 Members', status: 'APPROVED', hackathonId: 'h-2', hackathonTitle: 'Quantum FinTech Challenge' },
      { id: '3', groupName: 'Quantum Hackers', code: 'QNTM-404', leaderEmail: 'carlos@quantum.org', groupSize: '1 Members', status: 'UNDER_REVIEW', hackathonId: 'h-3', hackathonTitle: 'HealthTech AI Summit' },
    ];
  });

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
                      <span>Max Team: {h.maxTeamSize || 4}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CREATE HACKATHON (Screen 1 Match) */}
          {activeTab === 'create' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left AI Real-Time Preview Card */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-purple-700 bg-purple-100/80">
                  <Sparkles className="w-3.5 h-3.5" /> Real-Time AI Preview
                </span>

                <div className="relative rounded-2xl overflow-hidden aspect-video border border-slate-200 bg-slate-900">
                  <img
                    src={bannerUrl || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80'}
                    alt="Event Banner"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent p-4 flex items-end">
                    <h3 className="text-white font-black text-lg tracking-tight">
                      {eventTitle || 'Your Event Title'}
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700">
                    <p className="text-[9px] font-bold uppercase text-slate-400">POOL</p>
                    <p className="text-xs font-black">{prizePool || '₹25,00,000'}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-100 text-slate-700">
                    <p className="text-[9px] font-bold uppercase text-slate-400">Max Size</p>
                    <p className="text-xs font-black">{maxTeamSize} Ppl</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-purple-50 text-purple-700">
                    <p className="text-[9px] font-bold uppercase text-slate-400">Level</p>
                    <p className="text-xs font-black">Intermediate</p>
                  </div>
                </div>
              </div>

              {/* Right Form Card */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
                <div>
                  <span className="text-xs font-bold text-slate-400 block">Step 1 of 4</span>
                  <h3 className="text-xl font-black text-slate-900">Basic Event Info</h3>
                </div>

                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!eventTitle.trim()) {
                      notify('Please enter an Event Title', 'warning');
                      return;
                    }

                    const newCreatedHackathon: Hackathon = {
                      id: `hack-${Date.now()}`,
                      title: eventTitle.trim(),
                      tagline: tagline.trim() || 'Revolutionizing tech innovation',
                      description: description.trim() || 'Join our global hackathon challenge.',
                      banner: bannerUrl || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
                      status: 'live',
                      mode: 'online',
                      visibility: 'PUBLIC',
                      location: 'Online / Virtual',
                      timezone: 'IST',
                      startDate: startDate || 'Aug 05, 2026',
                      endDate: endDate || 'Aug 10, 2026',
                      maxTeamSize: maxTeamSize || 4,
                      minTeamSize: 1,
                      prizePool: prizePool || '₹25,00,000',
                      organizerName: currentOrg || 'Organizer',
                      organizerVerified: true,
                      participantsCount: 1,
                      teamsCount: 1,
                      category: 'AI & Web3'
                    };

                    addHackathon(newCreatedHackathon);
                    notify(`🎉 Hackathon "${eventTitle}" published live for all participants!`, 'success');
                    setEventTitle('');
                    setTagline('');
                    setDescription('');
                    setActiveTab('hackathons');
                  }}
                >
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-600 block mb-1">EVENT TITLE</label>
                    <input
                      type="text"
                      placeholder="Title"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs font-medium rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-purple-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-600 block mb-1">TAGLINE</label>
                    <input
                      type="text"
                      placeholder="Tagline"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs font-medium rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-purple-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-600 block mb-1">DESCRIPTION</label>
                    <textarea
                      rows={3}
                      placeholder="Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs font-medium rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-purple-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-600 block mb-1">MAX TEAM SIZE</label>
                      <input
                        type="number"
                        value={maxTeamSize}
                        onChange={(e) => setMaxTeamSize(Number(e.target.value))}
                        className="w-full px-4 py-2.5 text-xs font-medium rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-purple-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-600 block mb-1">POOL (INR)</label>
                      <input
                        type="text"
                        value={prizePool}
                        onChange={(e) => setPrizePool(e.target.value)}
                        className="w-full px-4 py-2.5 text-xs font-medium rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-purple-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-600 block mb-1">BANNER IMAGE URL</label>
                    <input
                      type="text"
                      value={bannerUrl}
                      onChange={(e) => setBannerUrl(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs font-medium rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-purple-500 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-md hover:from-purple-700 hover:to-indigo-700 transition-all cursor-pointer mt-2"
                  >
                    Next Step
                  </button>
                </form>
              </div>

            </div>
          )}

          {/* TAB 4: REGISTRATIONS (Screen 2 Match) */}
          {activeTab === 'registrations' && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Developer Registrations</h2>
                  <p className="text-xs font-semibold text-slate-500">
                    Verify team justifications, member profiles, and approve/reject applications
                  </p>
                </div>
                <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 font-extrabold text-xs rounded-xl border border-indigo-100">
                  {registrationList.length} Teams Registered
                </span>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/80 text-[10px] font-black uppercase text-slate-400 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4">GROUP NAME</th>
                        <th className="px-6 py-4">GROUP NUMBER/CODE</th>
                        <th className="px-6 py-4">LEADER EMAIL</th>
                        <th className="px-6 py-4">GROUP SIZE</th>
                        <th className="px-6 py-4">STATUS</th>
                        <th className="px-6 py-4 text-right">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                      {registrationList.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-600" />
                            <span className="font-bold text-slate-900">{row.groupName}</span>
                          </td>
                          <td className="px-6 py-4 text-slate-500 font-mono text-[11px]">{row.code}</td>
                          <td className="px-6 py-4">{row.leaderEmail}</td>
                          <td className="px-6 py-4">{row.groupSize}</td>
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
                              onClick={() => handleRegistrationAction(row.id, 'APPROVED')}
                              className="px-2.5 py-1 bg-emerald-600 text-white font-bold text-[11px] rounded-lg hover:bg-emerald-700 cursor-pointer shadow-2xs"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRegistrationAction(row.id, 'UNDER_REVIEW')}
                              className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 font-bold text-[11px] rounded-lg cursor-pointer"
                            >
                              Review
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

        </main>

      </div>
    </div>
  );
};
