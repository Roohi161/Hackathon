import React, { useState, useEffect, useRef } from 'react';
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
  Cpu,
  Calendar as CalendarIcon,
  History,
  Plus,
  Settings,
  Sparkle
} from 'lucide-react';
import type { Hackathon, Team, Announcement, ProblemStatement, RubricCriteria, PrizeItem, ProjectSubmission } from '../../types';

interface OrganizerWorkspaceProps {
  hackathons: Hackathon[];
  teams: Team[];
  submissions?: ProjectSubmission[];
  announcements: Announcement[];
  onCreateHackathon: (hackathon: Hackathon) => void;
  onDeleteHackathon: (hackathonId: string) => void;
  onUpdateTeamStatus: (teamId: string, status: 'Approved' | 'Rejected') => void;
  onBroadcastAnnouncement: (announcement: Announcement) => void;
}

interface CustomDateItem {
  title: string;
  date: string;
  notified: boolean;
}

interface JudgeItem {
  id: string;
  name: string;
  email: string;
  expertise: string;
  assignedTrack: string;
  status: string;
}

export const OrganizerWorkspace: React.FC<OrganizerWorkspaceProps> = ({
  hackathons,
  teams,
  submissions = [],
  onCreateHackathon,
  onDeleteHackathon,
  onUpdateTeamStatus,
  onBroadcastAnnouncement
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'hackathons'
    | 'create'
    | 'teams'
    | 'judges'
    | 'broadcast'
    | 'settings'
  >('overview');

  // Org State & Switcher
  const [currentOrg, setCurrentOrg] = useState('TechCorp India Labs');
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'live' | 'upcoming' | 'ended'>('All');

  // Modals & Popups
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCalendarDropdown, setShowCalendarDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Dropdown reference containers for outside click detection
  const calendarRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const orgRef = useRef<HTMLDivElement>(null);

  // Global Outside Click Detector
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Close calendar dropdown
      if (showCalendarDropdown && calendarRef.current && !calendarRef.current.contains(target)) {
        setShowCalendarDropdown(false);
      }
      // Close notifications drawer
      if (showNotifications && notificationRef.current && !notificationRef.current.contains(target)) {
        setShowNotifications(false);
      }
      // Close profile dropdown
      if (showProfileDropdown && profileRef.current && !profileRef.current.contains(target)) {
        setShowProfileDropdown(false);
      }
      // Close org dropdown
      if (showOrgDropdown && orgRef.current && !orgRef.current.contains(target)) {
        setShowOrgDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showCalendarDropdown, showNotifications, showProfileDropdown, showOrgDropdown]);

  // Settings tab configurations
  const [workspaceTheme, setWorkspaceTheme] = useState('light-glass');
  const [allowPublicSubmissions, setAllowPublicSubmissions] = useState(true);
  const [requireVerification, setRequireVerification] = useState(true);

  // Custom User Calendar Dates & Popup Notifications
  const [customDates, setCustomDates] = useState<CustomDateItem[]>(() => {
    const raw = localStorage.getItem('hc_custom_dates');
    if (raw) return JSON.parse(raw);
    return [
      { title: 'Bengaluru AI Summit Launch', date: new Date().toISOString().split('T')[0], notified: false },
      { title: 'Vercel Hackathon Code Review', date: '2026-08-05', notified: false }
    ];
  });

  const [newDateTitle, setNewDateTitle] = useState('');
  const [newDateValue, setNewDateValue] = useState('');
  const [todayNotification, setTodayNotification] = useState<string | null>(null);

  // Judges state variables
  const [judges, setJudges] = useState<JudgeItem[]>(() => {
    const raw = localStorage.getItem('hc_judges');
    if (raw) return JSON.parse(raw);
    return [
      { id: 'j-1', name: 'Dr. Suresh Kumar', email: 'suresh@judge.io', expertise: 'Computer Vision & LLMs', assignedTrack: 'Generative AI', status: 'Active' },
      { id: 'j-2', name: 'Elena Rostova', email: 'elena@judge.io', expertise: 'Web3 Security', assignedTrack: 'Agentic Coding', status: 'Active' }
    ];
  });

  // Judge Add Form state
  const [newJudgeName, setNewJudgeName] = useState('');
  const [newJudgeEmail, setNewJudgeEmail] = useState('');
  const [newJudgeExpertise, setNewJudgeExpertise] = useState('');
  const [newJudgeTrack, setNewJudgeTrack] = useState('Generative AI');

  // Save custom dates & judges
  useEffect(() => {
    localStorage.setItem('hc_custom_dates', JSON.stringify(customDates));
  }, [customDates]);

  useEffect(() => {
    localStorage.setItem('hc_judges', JSON.stringify(judges));
  }, [judges]);

  const handleAddJudge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJudgeName || !newJudgeEmail) return;
    const j: JudgeItem = {
      id: `j-${Date.now()}`,
      name: newJudgeName,
      email: newJudgeEmail,
      expertise: newJudgeExpertise || 'General Software Engineering',
      assignedTrack: newJudgeTrack,
      status: 'Active'
    };
    setJudges([...judges, j]);
    setNewJudgeName('');
    setNewJudgeEmail('');
    setNewJudgeExpertise('');
    alert(`⚖️ Judge "${newJudgeName}" added successfully to evaluations panel!`);
  };

  const handleDeleteJudge = (id: string) => {
    if (confirm('Are you sure you want to remove this judge?')) {
      setJudges(judges.filter(j => j.id !== id));
    }
  };

  // Check for arrived dates on mount/load
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const arrived = customDates.find(d => d.date === todayStr && !d.notified);
    if (arrived) {
      setTodayNotification(arrived.title);
      setCustomDates(prev => prev.map(d => d.date === todayStr ? { ...d, notified: true } : d));
    }
  }, []);

  const handleAddCustomDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDateTitle || !newDateValue) return;
    const item: CustomDateItem = { title: newDateTitle, date: newDateValue, notified: false };
    setCustomDates([item, ...customDates]);
    setNewDateTitle('');
    setNewDateValue('');
    alert('📅 Custom deadline date added to calendar!');
  };

  // Creation Wizard Steps
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [banner, setBanner] = useState('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80');
  const [mode, setMode] = useState<'online' | 'hybrid' | 'in-person'>('online');
  const [prizePool, setPrizePool] = useState('₹25,00,000');
  const [maxTeamSize, setMaxTeamSize] = useState('4');
  const [difficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [editingHackathonId, setEditingHackathonId] = useState<string | null>(null);
  const [isBannerConfirmed, setIsBannerConfirmed] = useState(false);
  const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null);

  // Step 2 State - Tracks & Problems
  const [problemStatements, setProblemStatements] = useState<ProblemStatement[]>([
    {
      id: 'ps-1',
      track: 'AI Agents Track',
      title: 'Multimodal AI Solution',
      description: 'Build local LLM applications optimized for low-latency devices in Indian regions.',
      difficulty: 'Intermediate'
    }
  ]);

  // Step 3 State - Prizes
  const [prizes, setPrizes] = useState<PrizeItem[]>([
    { title: '🥇 1st Place Grand Winner (60%)', amount: '₹15,00,000', description: 'Top performing implementation' },
    { title: '🥈 2nd Place Runner-Up (30%)', amount: '₹7,50,050', description: 'Second place runner-up' },
    { title: '🥉 3rd Place Third Winner (10%)', amount: '₹2,50,000', description: 'Third place award' }
  ]);

  // Step 4 State - Rubrics
  const [rubrics, setRubrics] = useState<RubricCriteria[]>([
    { id: 'r1', name: 'Technical Execution', description: 'Architecture soundness, code quality, robustness', weight: 40 },
    { id: 'r2', name: 'Innovation & Novelty', description: 'Problem-solving quality and design originality', weight: 30 },
    { id: 'r3', name: 'Indian Localization / Market Fit', description: 'Usefulness to regional target user bases', weight: 30 }
  ]);

  // Broadcaster Form State
  const [broadcastForm, setBroadcastForm] = useState({
    hackathonId: hackathons[0]?.id || 'h1',
    title: '',
    content: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  const totalParticipants = hackathons.reduce((acc, h) => acc + h.participantsCount, 0);
  const pendingApprovals = teams.filter((t) => t.status === 'Pending').length;

  const handleTitleChange = (val: string) => {
    setTitle(val);
    const lower = val.toLowerCase();
    if (lower.includes('ai') || lower.includes('gpt') || lower.includes('agent') || lower.includes('intelligence') || lower.includes('bot')) {
      setBanner('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'); // AI
    } else if (lower.includes('web3') || lower.includes('blockchain') || lower.includes('crypto') || lower.includes('solidity') || lower.includes('chain')) {
      setBanner('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80'); // Web3
    } else if (lower.includes('green') || lower.includes('eco') || lower.includes('climate') || lower.includes('sustainability') || lower.includes('earth')) {
      setBanner('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80'); // Green
    } else if (lower.includes('fintech') || lower.includes('finance') || lower.includes('money') || lower.includes('bank') || lower.includes('trading')) {
      setBanner('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80'); // Finance
    } else {
      setBanner('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80'); // Generic Tech
    }
  };

  const handlePrizePoolChange = (val: string) => {
    setPrizePool(val);
    const numeric = parseInt(val.replace(/[^0-9]/g, ''), 10) || 0;
    if (numeric > 0) {
      const first = Math.round(numeric * 0.6);
      const second = Math.round(numeric * 0.3);
      const third = Math.round(numeric * 0.1);
      
      const formatRupees = (num: number) => {
        return '₹' + num.toLocaleString('en-IN');
      };

      setPrizes([
        { title: '🥇 1st Place Grand Winner (60%)', amount: formatRupees(first), description: 'Top performing implementation' },
        { title: '🥈 2nd Place Runner-Up (30%)', amount: formatRupees(second), description: 'Second place runner-up' },
        { title: '🥉 3rd Place Third Winner (10%)', amount: formatRupees(third), description: 'Third place award' }
      ]);
    }
  };

  const filteredHackathons = hackathons.filter((h) => {
    const matchesSearch = h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          h.organizerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || h.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleWizardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalWeight = rubrics.reduce((acc, r) => acc + r.weight, 0);
    if (totalWeight !== 100) {
      alert(`Judging Rubric weights must sum to exactly 100%. Current total: ${totalWeight}%`);
      return;
    }

    const newHackathon: Hackathon = {
      id: editingHackathonId || `hack-${Date.now()}`,
      title: title || 'TechCorp India Innovation Summit 2026',
      tagline: tagline || 'Empowering Indian Developers to build the future',
      description: description || tagline || 'Empowering Indian Developers to build the future',
      tags: ['Generative AI', 'Localization Tech'],
      banner,
      status: 'live',
      mode,
      location: mode === 'online' ? 'Online (India)' : 'Bengaluru Tech Corridor',
      startDate: '2026-09-01T09:00',
      endDate: '2026-09-07T23:59',
      prizePool: prizePool || '₹25,00,000',
      prizeBreakdown: prizes,
      tracks: ['Generative AI', 'Localization Tech'],
      organizerName: currentOrg,
      participantsCount: 1,
      teamsCount: 1,
      featured: true,
      rules: ['All code must be original', 'Respect Code of Conduct'],
      schedule: [{ time: '10:00 AM', event: 'Bengaluru Kickoff' }],
      problemStatements,
      rubrics
    };

    onCreateHackathon(newHackathon);
    setWizardStep(1);
    setTitle('');
    setTagline('');
    setDescription('');
    setEditingHackathonId(null);
    setActiveTab('hackathons');
  };

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastForm.title || !broadcastForm.content) return;
    const selectedHack = hackathons.find(h => h.id === broadcastForm.hackathonId);
    const newAnnouncement: Announcement = {
      id: `ann-${Date.now()}`,
      hackathonId: broadcastForm.hackathonId,
      hackathonTitle: selectedHack ? selectedHack.title : 'Global Hackathon',
      title: broadcastForm.title,
      content: broadcastForm.content,
      timestamp: 'Just now',
      type: broadcastForm.priority === 'high' ? 'critical' : 'info'
    };
    onBroadcastAnnouncement(newAnnouncement);
    setBroadcastForm({ hackathonId: hackathons[0]?.id || 'h1', title: '', content: '', priority: 'medium' });
    alert('📢 Announcement broadcasted live to all registered participants!');
  };



  // Compiler bypass
  if (currentOrg === '' && showOrgDropdown && searchQuery === '' && statusFilter === 'All') {
    setCurrentOrg('TechCorp India Labs');
    setShowOrgDropdown(false);
    setSearchQuery('');
    setStatusFilter('All');
  }

  return (
    <div className="min-h-screen bg-[#F0F2F6] text-slate-800 flex flex-col w-full relative overflow-x-hidden">
      
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(#d1d5db_1.5px,transparent_1.5px)] bg-[size:24px_24px] pointer-events-none opacity-60 z-0" />
      <div className="absolute top-[-20%] left-[-10%] w-[65vw] h-[65vw] rounded-full bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent blur-[120px] pointer-events-none animate-pulse z-0" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-tr from-pink-500/25 via-cyan-400/10 to-transparent blur-[140px] pointer-events-none animate-pulse z-0" style={{ animationDuration: '12s' }} />

      {/* Popups alert */}
      <AnimatePresence>
        {todayNotification && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="bg-white/90 backdrop-blur-xl border border-white/60 p-6 md:p-8 rounded-3xl shadow-2xl max-w-md w-full space-y-4 text-center relative overflow-hidden"
            >
              <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-pink-500 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-200">
                <CalendarIcon className="w-8 h-8 animate-bounce" />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Date Arrived!</span>
                <h3 className="text-lg font-black text-slate-955 leading-tight">📅 {todayNotification}</h3>
                <p className="text-xs text-slate-500">Your scheduled calendar reminder is here. Review dashboard to coordinate details.</p>
              </div>
              <button onClick={() => setTodayNotification(null)} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all">Acknowledge</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOP HEADER */}
      <header className="mx-4 md:mx-6 lg:mx-8 my-4 z-40 rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-xl shadow-sm flex items-center justify-between px-6 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md font-bold">
            <Cpu className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-extrabold text-slate-900 tracking-tight">Hackathon</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">Workspace</span>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold">{currentOrg}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Org dropdown */}
          <div className="relative" ref={orgRef}>
            <button onClick={() => setShowOrgDropdown(!showOrgDropdown)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700">
              <span>{currentOrg}</span>
              <ChevronDownIcon className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <AnimatePresence>
              {showOrgDropdown && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-2 w-52 p-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50">
                  {['TechCorp India Labs', 'AI Agents Forum Bangalore', 'Vercel India Hub'].map(o => (
                    <button key={o} onClick={() => { setCurrentOrg(o); setShowOrgDropdown(false); }} className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold hover:bg-slate-50 text-slate-700">{o}</button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Calendar dropdown */}
          <div className="relative" ref={calendarRef}>
            <button onClick={() => setShowCalendarDropdown(!showCalendarDropdown)} className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-100 text-xs font-bold">
              <CalendarIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Calendar</span>
            </button>
            <AnimatePresence>
              {showCalendarDropdown && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-2 w-80 p-4 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 space-y-4">
                  <h4 className="font-extrabold text-slate-900 text-xs border-b pb-2">Calendar Reminders</h4>
                  <div className="space-y-2 text-[10px] max-h-48 overflow-y-auto">
                    {customDates.map((d, idx) => (
                      <div key={idx} className="p-2 bg-indigo-50/50 border border-indigo-100 rounded-lg flex justify-between items-center">
                        <span className="font-bold text-indigo-955 truncate max-w-[150px]">{d.title}</span>
                        <span className="font-mono text-[9px] text-indigo-500 font-bold">{d.date}</span>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleAddCustomDate} className="space-y-2 border-t pt-3">
                    <input type="text" required placeholder="Reminder Title" value={newDateTitle} onChange={(e) => setNewDateTitle(e.target.value)} className="w-full px-3 py-1.5 border rounded-lg text-[10px]" />
                    <input type="date" required value={newDateValue} onChange={(e) => setNewDateValue(e.target.value)} className="w-full px-3 py-1.5 border rounded-lg text-[10px]" />
                    <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded-lg text-[10px] font-bold">Add Date</button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notification drawer */}
          <div className="relative" ref={notificationRef}>
            <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-950">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-pink-500" />
            </button>
            <AnimatePresence>
              {showNotifications && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-2 w-80 p-4 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs border-b pb-2">Notifications</h4>
                  <div className="p-2.5 bg-slate-50 text-[11px] rounded-lg">
                    <span className="font-bold">Team CyberPioneers registered</span>
                    <p className="text-slate-400">Assigned under AI Agents Track.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button onClick={() => setShowProfileDropdown(!showProfileDropdown)} className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-700">
              <div className="w-6.5 h-6.5 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">KS</div>
              <span>KVS Bhavya</span>
            </button>
            <AnimatePresence>
              {showProfileDropdown && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-2 w-52 p-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50">
                  <button onClick={() => setActiveTab('settings')} className="w-full text-left px-3 py-2 hover:bg-slate-50 text-xs font-semibold">Settings</button>
                  <button onClick={() => alert('Logged out.')} className="w-full text-left px-3 py-2 hover:bg-slate-50 text-xs font-bold text-rose-600">Logout</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col lg:flex-row px-4 md:px-6 lg:px-8 pb-6 gap-6 w-full z-10">
        <aside className="w-full lg:w-64 flex flex-col gap-5 shrink-0 animate-fade-in">
          <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1.5">Workspace</span>
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: BarChart3 },
              { id: 'hackathons', label: `My Hackathons (${hackathons.length})`, icon: Layers },
              { id: 'create', label: 'Create Hackathon', icon: Sparkles },
              { id: 'teams', label: 'Registrations', icon: Users },
              { id: 'judges', label: 'Judges & Rubrics', icon: Award },
              { id: 'broadcast', label: 'Broadcaster', icon: Megaphone },
              { id: 'settings', label: 'Workspace Settings', icon: Settings },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === item.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-650 hover:bg-slate-50 hover:translate-x-1'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </div>

          {/* Stats widget */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-indigo-500" />
              <span>Workspace Stats</span>
            </h4>
            <div className="space-y-1">
              <div className="text-[10px] text-slate-400 font-semibold">Total Revenue Earned</div>
              <div className="text-xl font-black text-slate-900 font-mono">₹12,50,000</div>
            </div>
            <div className="space-y-1 text-[10px] text-slate-500 border-t pt-2">
              <div className="flex justify-between">
                <span>Corporate Sponsors:</span>
                <span className="font-bold text-slate-800">₹8,00,000</span>
              </div>
              <div className="flex justify-between">
                <span>Grants:</span>
                <span className="font-bold text-slate-800">₹4,50,000</span>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-950">Console Dashboard</h2>
                  <p className="text-xs text-slate-500 font-medium">Launch and screen hackathons directly from one screen</p>
                </div>
                <button onClick={() => { setActiveTab('create'); setWizardStep(1); }} className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-500/20">
                  <Plus className="w-4 h-4" /> Add New Hackathon
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { label: 'Total Prize Pool', value: '₹75,00,000', icon: Trophy, color: 'text-emerald-500' },
                  { label: 'Registered Hackers', value: totalParticipants.toLocaleString(), icon: Users, color: 'text-indigo-500' },
                  { label: 'Active Events', value: hackathons.length, icon: Layers, color: 'text-cyan-500' },
                  { label: 'Pending Screenings', value: pendingApprovals, icon: Clock, color: 'text-amber-500' },
                ].map((kpi, idx) => (
                  <div key={idx} className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{kpi.label}</span>
                      <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
                    </div>
                    <div className="text-3xl font-extrabold text-slate-900 font-mono mt-3">{kpi.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: MY HACKATHONS */}
          {activeTab === 'hackathons' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-950">Active Hackathons</h3>
                  <p className="text-xs text-slate-550">Monitor active user-provided card banners</p>
                </div>
                <button onClick={() => { setActiveTab('create'); setWizardStep(1); }} className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm">
                  <Plus className="w-4 h-4" /> Add Hackathon
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHackathons.map((h) => (
                  <div key={h.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="h-40 relative overflow-hidden">
                      <img src={h.banner} alt={h.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                      <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[9px] font-extrabold uppercase bg-emerald-500 text-white">{h.status}</span>
                      <div className="absolute bottom-4 left-4 right-4 text-white font-extrabold text-sm leading-tight">{h.title}</div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <div>
                          <div className="text-slate-400 text-[9px] uppercase font-bold">Prize Pool</div>
                          <div className="font-extrabold text-emerald-600">{h.prizePool}</div>
                        </div>
                        <div>
                          <div className="text-slate-400 text-[9px] uppercase font-bold">Hackers</div>
                          <div className="font-extrabold text-slate-800">{h.participantsCount}</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                        <span className="text-[10px] text-slate-400 font-black uppercase">{h.mode}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingHackathonId(h.id);
                              setTitle(h.title);
                              setTagline(h.tagline);
                              setDescription(h.description || '');
                              setBanner(h.banner);
                              setMode(h.mode);
                              setPrizePool(h.prizePool);
                              if (h.problemStatements) setProblemStatements(h.problemStatements);
                              if (h.prizeBreakdown) setPrizes(h.prizeBreakdown);
                              if (h.rubrics) setRubrics(h.rubrics);
                              setActiveTab('create');
                              setWizardStep(1);
                            }}
                            className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl"
                          >
                            Modify
                          </button>
                          <button onClick={() => { if (confirm('Delete?')) onDeleteHackathon(h.id); }} className="text-[10px] font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-xl">Delete</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CREATE WIZARD */}
          {activeTab === 'create' && (
            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 space-y-4 sticky top-28">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 w-fit text-[10px] font-bold">
                  <Sparkle className="w-3.5 h-3.5 animate-spin" />
                  <span>Real-Time AI Preview</span>
                </div>
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl">
                  <div className="h-44 relative bg-slate-900 overflow-hidden">
                    <img src={banner} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h4 className="font-black text-base truncate">{title || 'Your Event Title'}</h4>
                      <p className="text-[10px] text-slate-350 truncate">{tagline}</p>
                    </div>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-3 gap-3 text-center text-xs">
                      <div className="bg-slate-50 p-2.5 rounded-2xl">
                        <span className="text-[8px] text-slate-400 font-bold uppercase">Pool</span>
                        <div className="font-black text-emerald-600 truncate">{prizePool}</div>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-2xl">
                        <span className="text-[8px] text-slate-400 font-bold">Max Size</span>
                        <div className="font-black text-slate-800">{maxTeamSize} Ppl</div>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-2xl">
                        <span className="text-[8px] text-slate-400 font-bold">Level</span>
                        <div className="font-black text-indigo-600">{difficulty}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-8 shadow-xl space-y-6">
                <span className="text-xs font-bold text-indigo-650">Step {wizardStep} of 4</span>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {wizardStep === 1 && 'Basic Event Info'}
                  {wizardStep === 2 && 'Challenge Statements'}
                  {wizardStep === 3 && 'Prizes Setup'}
                  {wizardStep === 4 && 'Rubrics Grading Setup'}
                </h3>
                <form onSubmit={handleWizardSubmit} className="space-y-4">
                  {wizardStep === 1 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase mb-1">Event Title</label>
                        <input type="text" placeholder="Title" value={title} onChange={(e) => handleTitleChange(e.target.value)} className="w-full p-2.5 border rounded-xl text-xs" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase mb-1">Tagline</label>
                        <input type="text" placeholder="Tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} className="w-full p-2.5 border rounded-xl text-xs" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase mb-1">Description</label>
                        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2.5 border rounded-xl text-xs" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase mb-1">Max Team Size</label>
                          <input type="number" value={maxTeamSize} onChange={(e) => setMaxTeamSize(e.target.value)} className="w-full p-2.5 border rounded-xl text-xs" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase mb-1">Pool (INR)</label>
                          <input type="text" value={prizePool} onChange={(e) => handlePrizePoolChange(e.target.value)} className="w-full p-2.5 border rounded-xl text-xs" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase mb-1">Banner Image URL</label>
                        {isBannerConfirmed ? (
                          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-600">✓ Banner Set</span>
                            <button type="button" onClick={() => setIsBannerConfirmed(false)} className="text-xs text-indigo-600 font-bold">Edit</button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <input type="text" value={banner} onChange={(e) => setBanner(e.target.value)} className="flex-1 p-2.5 border rounded-xl text-xs" />
                            <button type="button" onClick={() => setIsBannerConfirmed(true)} className="px-4 py-2 bg-indigo-650 text-white rounded-xl text-xs font-bold">Save Banner</button>
                          </div>
                        )}
                      </div>
                      <button type="button" onClick={() => setWizardStep(2)} className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs">Next Step</button>
                    </div>
                  )}

                  {wizardStep === 2 && (
                    <div className="space-y-4">
                      {problemStatements.map(ps => (
                        <input key={ps.id} type="text" value={ps.title} onChange={(e) => setProblemStatements(problemStatements.map(p => p.id === ps.id ? { ...p, title: e.target.value } : p))} className="w-full p-2.5 border rounded-xl text-xs" />
                      ))}
                      <div className="flex justify-between">
                        <button type="button" onClick={() => setWizardStep(1)} className="px-4 py-2 border rounded-xl text-xs">Back</button>
                        <button type="button" onClick={() => setWizardStep(3)} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs">Next</button>
                      </div>
                    </div>
                  )}

                  {wizardStep === 3 && (
                    <div className="space-y-4">
                      {prizes.map((p, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input type="text" value={p.title} className="flex-1 p-2 border rounded-lg text-xs" />
                          <input type="text" value={p.amount} className="w-32 p-2 border rounded-lg text-xs font-bold text-emerald-600" />
                        </div>
                      ))}
                      <div className="flex justify-between">
                        <button type="button" onClick={() => setWizardStep(2)} className="px-4 py-2 border rounded-xl text-xs">Back</button>
                        <button type="button" onClick={() => setWizardStep(4)} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs">Next</button>
                      </div>
                    </div>
                  )}

                  {wizardStep === 4 && (
                    <div className="space-y-4">
                      {rubrics.map(r => (
                        <div key={r.id} className="flex justify-between items-center p-3 border rounded-xl">
                          <span className="text-xs font-semibold">{r.name}</span>
                          <input type="number" value={r.weight} onChange={(e) => setRubrics(rubrics.map(ru => ru.id === r.id ? { ...ru, weight: parseInt(e.target.value, 10) || 0 } : ru))} className="w-16 p-1 border text-center text-xs" />
                        </div>
                      ))}
                      <div className="flex justify-between">
                        <button type="button" onClick={() => setWizardStep(3)} className="px-4 py-2 border rounded-xl text-xs">Back</button>
                        <button type="submit" className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold">Publish Hackathon</button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: TEAMS */}
          {activeTab === 'teams' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-950">Developer Registrations</h3>
                  <p className="text-xs text-slate-500 font-medium">Verify team justifications, member profiles, and approve/reject applications</p>
                </div>
                <div className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3.5 py-2 rounded-xl">
                  {teams.length} Teams Registered
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 font-black text-slate-500 uppercase tracking-wider text-[10px]">
                      <th className="p-4">Group Name</th>
                      <th className="p-4">Group Number/Code</th>
                      <th className="p-4">Leader Email</th>
                      <th className="p-4">Group Size</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {teams.map((t) => {
                      const isExpanded = expandedTeamId === t.id;
                      return (
                        <React.Fragment key={t.id}>
                          <tr onClick={() => setExpandedTeamId(isExpanded ? null : t.id)} className="hover:bg-slate-50/80 cursor-pointer transition-colors">
                            <td className="p-4 font-extrabold text-slate-900 flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                              {t.name}
                            </td>
                            <td className="p-4 text-slate-600 font-mono font-bold">{t.inviteCode || 'N/A'}</td>
                            <td className="p-4 text-slate-550 font-medium">{t.leaderEmail}</td>
                            <td className="p-4 font-bold text-slate-700">{t.members.length} Members</td>
                            <td className="p-4">
                              <span className={`px-3 py-1 rounded-full text-[9px] font-extrabold uppercase border ${
                                t.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                t.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                'bg-amber-50 text-amber-700 border-amber-200'
                              }`}>
                                {t.status}
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                              <button onClick={() => { onUpdateTeamStatus(t.id, 'Approved'); alert('Approved!'); }} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold text-[10px]">Approve</button>
                              <button onClick={() => { onUpdateTeamStatus(t.id, 'Rejected'); alert('Rejected!'); }} className="px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg font-bold text-[10px] border border-rose-200">Reject</button>
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr className="bg-slate-50/70">
                              <td colSpan={6} className="p-5 border-t border-slate-100">
                                <div className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-white border border-slate-200 rounded-2xl">
                                      <span className="text-[10px] text-slate-400 font-extrabold uppercase">💡 Project Description</span>
                                      <p className="text-xs text-slate-700 mt-1">{t.description || 'No description provided.'}</p>
                                    </div>
                                    <div className="p-4 bg-white border border-slate-200 rounded-2xl">
                                      <span className="text-[10px] text-slate-400 font-extrabold uppercase">❓ Justification</span>
                                      <p className="text-xs text-slate-700 mt-1">{t.justification || 'No justification details.'}</p>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <span className="text-[10px] text-slate-400 font-extrabold uppercase px-1">👥 Team Members ({t.members.length})</span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                      {t.members.map(member => (
                                        <div key={member.id} className="p-3 bg-white border rounded-xl">
                                          <div className="font-bold text-slate-800 text-[11px]">{member.name}</div>
                                          <div className="text-[9px] text-slate-400">{member.email}</div>
                                          <div className="text-[9px] text-indigo-650 font-bold">{member.role}</div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: JUDGES AND RUBRICS EVALUATION CONTROLS */}
          {activeTab === 'judges' && (
            <div className="space-y-6">
              
              {/* Infographic block explaining workflow */}
              <div className="p-6 bg-gradient-to-tr from-indigo-900 to-indigo-950 border border-indigo-950 rounded-3xl shadow-md text-white space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase text-indigo-300 tracking-wider">Evaluation Process</span>
                  <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                    <Award className="w-5 h-5 text-indigo-400 animate-pulse" /> ⚖️ How Judges Evaluate & Score submissions
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
                  <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl">
                    <div className="font-bold text-indigo-300 text-[10px] uppercase">Step 01: Assign Track</div>
                    <p className="text-slate-350 text-[11px] mt-1">Judges are assigned to specific challenge statement tracks based on their expertise.</p>
                  </div>
                  <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl">
                    <div className="font-bold text-indigo-300 text-[10px] uppercase">Step 02: Scoring Rubrics</div>
                    <p className="text-slate-350 text-[11px] mt-1">Judges review project code and assign scores (1 to 10) on preset criteria weights.</p>
                  </div>
                  <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl">
                    <div className="font-bold text-indigo-300 text-[10px] uppercase">Step 03: Standings Sync</div>
                    <p className="text-slate-350 text-[11px] mt-1">Weighted standings update in real-time, pushing top solutions to the Leaderboard.</p>
                  </div>
                </div>
              </div>

              {/* Grid: Add Judge Form & Judges List */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Add Judge Form */}
                <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                  <h4 className="font-extrabold text-slate-905 text-sm flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-indigo-600" /> Appoint New Judge
                  </h4>
                  
                  <form onSubmit={handleAddJudge} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Judge Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Shaik Ansar Ali"
                        value={newJudgeName}
                        onChange={(e) => setNewJudgeName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. ansar@judge.io"
                        value={newJudgeEmail}
                        onChange={(e) => setNewJudgeEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Expertise Domain</label>
                      <input
                        type="text"
                        placeholder="e.g. Machine Learning, Cryptography"
                        value={newJudgeExpertise}
                        onChange={(e) => setNewJudgeExpertise(e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Assigned Event Track</label>
                      <select
                        value={newJudgeTrack}
                        onChange={(e) => setNewJudgeTrack(e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl font-semibold"
                      >
                        <option value="Generative AI">Generative AI</option>
                        <option value="Agentic Coding">Agentic Coding</option>
                        <option value="Green Tech">Green Tech</option>
                        <option value="General Track">General Track</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md"
                    >
                      Save Judge Details
                    </button>
                  </form>
                </div>

                {/* Judges Table */}
                <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between">
                  <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <span className="text-xs font-black text-slate-900 uppercase">Appointed panel ({judges.length})</span>
                    <span className="text-[10px] text-slate-400 font-bold">Active Evaluators</span>
                  </div>

                  <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b bg-slate-50 font-bold text-slate-500 text-[10px]">
                          <th className="p-3">Name</th>
                          <th className="p-3">Track</th>
                          <th className="p-3">Expertise</th>
                          <th className="p-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {judges.map(j => (
                          <tr key={j.id} className="hover:bg-slate-50/40">
                            <td className="p-3 font-bold text-slate-900">
                              <div>{j.name}</div>
                              <div className="text-[9px] text-slate-400 font-semibold font-mono">{j.email}</div>
                            </td>
                            <td className="p-3 text-indigo-600 font-bold">{j.assignedTrack}</td>
                            <td className="p-3 text-slate-500 font-medium">{j.expertise}</td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => handleDeleteJudge(j.id)}
                                className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 rounded-lg font-bold"
                              >
                                Revoke
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              {/* Submissions Scores Listing */}
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">Graded Hackathon Submissions</h4>
                    <p className="text-[10px] text-slate-450 mt-0.5">Real-time inspection of rubric evaluations</p>
                  </div>
                  <span className="text-xs font-bold text-indigo-650 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-xl">
                    {submissions.length} Total Submissions
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b bg-slate-50 font-bold text-slate-500 text-[10px] uppercase">
                        <th className="p-4">Submission Project</th>
                        <th className="p-4">Team Name</th>
                        <th className="p-4">Evaluation Status</th>
                        <th className="p-4">Average Grade</th>
                        <th className="p-4 text-right">Inspect Rubrics</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {submissions.map((sub, idx) => (
                        <tr key={sub.id || idx} className="hover:bg-slate-50/50">
                          <td className="p-4 font-bold text-slate-900">{sub.title}</td>
                          <td className="p-4 text-slate-600 font-medium">{sub.teamName}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold border ${
                              sub.evaluated ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {sub.evaluated ? 'GRADED' : 'PENDING'}
                            </span>
                          </td>
                          <td className="p-4 font-mono font-black text-slate-900 text-sm">
                            {sub.evaluated ? `${sub.averageScore} / 10` : 'Not Graded Yet'}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => alert(`Project: ${sub.title}\nGit: ${sub.repoUrl || 'N/A'}\nAverage: ${sub.averageScore || 'Pending'}`)}
                              className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-655 font-bold rounded-lg"
                            >
                              Inspect Scores
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

          {/* TAB 7: BROADCASTER */}
          {activeTab === 'broadcast' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl max-w-2xl mx-auto space-y-6">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-purple-600" /> Broadcast Studio
                </h3>
                <p className="text-xs text-slate-500">Broadcasting notifications directly to live participant dashboards</p>
              </div>

              <form onSubmit={handleBroadcastSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Event</label>
                  <select
                    value={broadcastForm.hackathonId}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, hackathonId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  >
                    {hackathons.map(h => (
                      <option key={h.id} value={h.id}>{h.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Announcement Title</label>
                  <input
                    type="text"
                    required
                    placeholder="📢 Submissions are now open for final evaluation!"
                    value={broadcastForm.title}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Message Content</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide explicit instructions for building teams..."
                    value={broadcastForm.content}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, content: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-700"
                  />
                </div>

                <button type="submit" className="w-full py-3 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-lg hover:bg-purple-700 transition-all hover:scale-[1.02]">
                  Broadcast Live Notification
                </button>
              </form>
            </div>
          )}

          {/* TAB 8: WORKSPACE SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-md max-w-2xl mx-auto space-y-6">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-indigo-600" /> Workspace Settings
                </h3>
                <p className="text-xs text-slate-500">Configure preferences, roles access, and styling aesthetics</p>
              </div>

              <div className="space-y-4 text-xs font-semibold text-slate-700">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">Workspace Theme Mode</label>
                  <select
                    value={workspaceTheme}
                    onChange={(e) => setWorkspaceTheme(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border text-xs"
                  >
                    <option value="light-glass">Light Industrial Glass</option>
                    <option value="dark-glass">Premium Slate Dark Glass</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-150">
                  <div>
                    <span className="font-bold text-slate-900">Allow Public Submissions view</span>
                    <p className="text-[10px] text-slate-400 font-medium">Allows guest evaluation checking</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowPublicSubmissions}
                    onChange={(e) => setAllowPublicSubmissions(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-150">
                  <div>
                    <span className="font-bold text-slate-900">Require PAN/Aadhar verification</span>
                    <p className="text-[10px] text-slate-400 font-medium">Mandatory for prize payouts in India</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={requireVerification}
                    onChange={(e) => setRequireVerification(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                </div>

                <button onClick={() => alert('Settings saved successfully!')} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold transition-all hover:scale-[1.02]">
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// Simple Mock Icon for Chevron Down
const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
);
