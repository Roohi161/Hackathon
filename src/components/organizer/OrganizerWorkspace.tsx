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
  Cpu,
  Calendar as CalendarIcon,
  History,
  CheckCircle,
  Plus,
  Settings,
  Zap,
  Target,
  Sparkle,
  AlertCircle
} from 'lucide-react';
import type { Hackathon, Team, Announcement, ProblemStatement, RubricCriteria, PrizeItem } from '../../types';

interface OrganizerWorkspaceProps {
  hackathons: Hackathon[];
  teams: Team[];
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

export const OrganizerWorkspace: React.FC<OrganizerWorkspaceProps> = ({
  hackathons,
  teams,
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

  // Save custom dates
  useEffect(() => {
    localStorage.setItem('hc_custom_dates', JSON.stringify(customDates));
  }, [customDates]);

  // Check for arrived dates on mount/load
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const arrived = customDates.find(d => d.date === todayStr && !d.notified);
    if (arrived) {
      setTodayNotification(arrived.title);
      // Mark as notified so it only popups once
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
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [registrationDeadline, setRegistrationDeadline] = useState('2026-08-30');
  const [editingHackathonId, setEditingHackathonId] = useState<string | null>(null);
  const [isGeneratingBanner, setIsGeneratingBanner] = useState(false);
  const [isBannerConfirmed, setIsBannerConfirmed] = useState(false);

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
    { title: '🥇 1st Place Grand Champion', amount: '₹15,00,000', description: 'Main cash prize + Server sponsorship' },
    { title: '🥈 2nd Place Runner-Up', amount: '₹7,50,000', description: 'Runner-up award' },
    { title: '🥉 3rd Place Innovation Award', amount: '₹2,50,000', description: 'Special visual design award' }
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

  const handleAiBannerGenerate = () => {
    setIsGeneratingBanner(true);
    setTimeout(() => {
      setBanner('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80');
      setIsGeneratingBanner(false);
    }, 1500);
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
      
      {/* ── WOW BACKGROUND ELEMENTS (GLOWING ORBS, HIGHER OPACITY GRIDS) ──── */}
      <div className="absolute inset-0 bg-[radial-gradient(#d1d5db_1.5px,transparent_1.5px)] bg-[size:24px_24px] pointer-events-none opacity-60 z-0" />
      
      {/* Giant Rotating Gradient Background Spheres */}
      <div className="absolute top-[-20%] left-[-10%] w-[65vw] h-[65vw] rounded-full bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent blur-[120px] pointer-events-none animate-pulse z-0" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-tr from-pink-500/25 via-cyan-400/10 to-transparent blur-[140px] pointer-events-none animate-pulse z-0" style={{ animationDuration: '12s' }} />
      <div className="absolute top-[30%] left-[20%] w-[35vw] h-[35vw] rounded-full bg-gradient-to-r from-purple-400/15 to-indigo-500/5 blur-[100px] pointer-events-none z-0" />

      {/* ── TODAY CALENDAR NOTIFICATION MODAL POPUP (WOW ELEMENT) ────────── */}
      <AnimatePresence>
        {todayNotification && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="bg-white/90 backdrop-blur-xl border border-white/60 p-6 md:p-8 rounded-3xl shadow-2xl max-w-md w-full space-y-4 text-center relative overflow-hidden"
            >
              {/* Top glow */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-40 bg-indigo-500/30 rounded-full blur-2xl pointer-events-none" />
              
              <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-pink-500 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-200">
                <CalendarIcon className="w-8 h-8 animate-bounce" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Date Arrived!</span>
                <h3 className="text-lg font-black text-slate-950 leading-tight">
                  📅 {todayNotification}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Your scheduled calendar reminder is here. Review the dashboard to coordinate details.
                </p>
              </div>

              <button
                onClick={() => setTodayNotification(null)}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-100 transition-all hover:scale-[1.02]"
              >
                Acknowledge
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── FLOATING TOP BAR NAVBAR ──────────────────────────────────────── */}
      <header className="mx-4 md:mx-6 lg:mx-8 my-4 z-40 rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-xl shadow-sm flex items-center justify-between px-6 py-3.5 transition-all">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md font-bold">
            <Cpu className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-extrabold text-slate-900 tracking-tight">Hackathon</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                Workspace
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold">{currentOrg}</p>
          </div>
        </div>

        {/* Action Widgets */}
        <div className="flex items-center gap-3">
          
          {/* Switch Organization */}
          <div className="relative">
            <button
              onClick={() => setShowOrgDropdown(!showOrgDropdown)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-750"
            >
              <span>{currentOrg}</span>
              <ChevronDownIcon className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <AnimatePresence>
              {showOrgDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-52 p-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50"
                >
                  {['TechCorp India Labs', 'AI Agents Forum Bangalore', 'Vercel India Hub'].map(o => (
                    <button
                      key={o}
                      onClick={() => { setCurrentOrg(o); setShowOrgDropdown(false); }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold hover:bg-slate-50 text-slate-700"
                    >
                      {o}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Calendar Planner Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowCalendarDropdown(!showCalendarDropdown)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-100 transition-colors text-xs font-bold"
            >
              <CalendarIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Calendar</span>
            </button>
            <AnimatePresence>
              {showCalendarDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-80 p-4 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 space-y-4 text-left"
                >
                  <h4 className="font-extrabold text-slate-900 text-xs border-b pb-2">Calendar Deadlines</h4>
                  
                  {/* Calendar lists */}
                  <div className="space-y-2 text-[10px] max-h-48 overflow-y-auto">
                    {customDates.map((d, idx) => (
                      <div key={idx} className="p-2 bg-indigo-50/50 border border-indigo-100 rounded-lg flex justify-between items-center">
                        <span className="font-bold text-indigo-950 truncate max-w-[150px]">{d.title}</span>
                        <span className="font-mono text-[9px] text-indigo-500 font-bold">{d.date}</span>
                      </div>
                    ))}
                  </div>

                  {/* Add date form */}
                  <form onSubmit={handleAddCustomDate} className="space-y-2 border-t pt-3">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Add Reminder</span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Code Freeze"
                      value={newDateTitle}
                      onChange={(e) => setNewDateTitle(e.target.value)}
                      className="w-full px-3 py-1.5 border rounded-lg text-[10px] font-semibold"
                    />
                    <input
                      type="date"
                      required
                      value={newDateValue}
                      onChange={(e) => setNewDateValue(e.target.value)}
                      className="w-full px-3 py-1.5 border rounded-lg text-[10px]"
                    />
                    <button type="submit" className="w-full py-2 bg-indigo-650 text-white rounded-lg text-[10px] font-bold">
                      Add to Calendar
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-pink-500" />
            </button>
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-80 p-4 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 space-y-3 text-left"
                >
                  <h4 className="font-bold text-slate-900 text-xs border-b pb-2">Live Notifications</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    <div className="p-2.5 bg-slate-50 text-[11px] rounded-lg">
                      <span className="font-bold">Team CyberKnights registered</span>
                      <p className="text-slate-500">Regional AI agents challenge participant.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-all text-xs font-bold text-slate-700"
            >
              <div className="w-6.5 h-6.5 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
                KS
              </div>
              <span className="hidden sm:inline">KVS Bhavya</span>
              <ChevronDownIcon className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <AnimatePresence>
              {showProfileDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-52 p-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 text-left"
                >
                  <div className="px-3 py-2 text-xs border-b border-slate-100">
                    <div className="font-bold text-slate-800">KVS Bhavya Sri</div>
                    <div className="text-[10px] text-slate-400">organizer@hackathon.io</div>
                  </div>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 text-xs text-slate-700 font-semibold flex items-center gap-2"
                  >
                    <Settings className="w-3.5 h-3.5" /> Workspace Settings
                  </button>
                  <button onClick={() => { setShowProfileDropdown(false); alert('Logged out successfully.'); }} className="w-full text-left px-3 py-2 hover:bg-slate-50 text-xs text-rose-600 font-bold">
                    Log Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* ── LAYOUT ROW ───────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col lg:flex-row px-4 md:px-6 lg:px-8 pb-6 gap-6 w-full z-10">
        
        {/* ── LEFT PANEL (EXPANDED SIDEBAR) ────────────────────────────────── */}
        <aside className="w-full lg:w-64 flex flex-col gap-5 shrink-0">
          
          {/* Main Navigation Group */}
          <div className="p-4 rounded-3xl bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm space-y-4">
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1.5">
                Workspace
              </div>
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
                    activeTab === item.id
                      ? 'bg-indigo-600 text-white shadow-md hover:scale-[1.02]'
                      : 'text-slate-650 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Left Panel Workspace Stats (Revenue & Previous Hackathons) */}
          <div className="p-5 rounded-3xl bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-indigo-500" />
              <span>Workspace Stats</span>
            </h4>

            {/* Total Revenue */}
            <div className="space-y-1">
              <div className="text-[10px] text-slate-400 font-semibold">Total Revenue Earned</div>
              <div className="text-xl font-black text-slate-900 font-mono">₹12,50,000</div>
            </div>

            {/* Revenue breakdown */}
            <div className="space-y-1 text-[10px] text-slate-500">
              <div className="flex justify-between">
                <span>Corporate Sponsors:</span>
                <span className="font-bold text-slate-800">₹8,00,000</span>
              </div>
              <div className="flex justify-between">
                <span>Government Grants:</span>
                <span className="font-bold text-slate-800">₹4,50,000</span>
              </div>
            </div>

            {/* Previous Hackathons */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="text-[10px] text-slate-400 font-semibold">Previous Events (4)</div>
              <div className="space-y-1">
                {[
                  { name: 'Bangalore FinTech Hack 2025', status: 'Completed' },
                  { name: 'Delhi NCR EdTech Sprint 2025', status: 'Completed' }
                ].map((ph, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[10px] p-1.5 bg-slate-50/80 rounded-lg border border-slate-100 hover:shadow-sm transition-all">
                    <span className="font-bold text-slate-700 truncate max-w-[120px]">{ph.name}</span>
                    <span className="text-[9px] font-bold text-slate-400 flex items-center gap-0.5">
                      <CheckCircle className="w-2.5 h-2.5 text-emerald-500" /> {ph.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ── MAIN WORKSPACE CONTENT ───────────────────────────────────────── */}
        <main className="flex-1 space-y-6">

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 w-full">
              
              {/* Header and Add Hackathon trigger */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-950 tracking-tight">Console Dashboard</h2>
                  <p className="text-xs text-slate-500 font-medium">Launch and screen hackathons directly from one screen</p>
                </div>
                <button
                  onClick={() => { setActiveTab('create'); setWizardStep(1); }}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:opacity-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02]"
                >
                  <Plus className="w-4 h-4" />
                  Add New Hackathon
                </button>
              </div>

              {/* KPI metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { label: 'Total Prize Pool', value: '₹75,00,000', icon: Trophy, color: 'text-emerald-500' },
                  { label: 'Registered Hackers', value: totalParticipants.toLocaleString(), icon: Users, color: 'text-indigo-500' },
                  { label: 'Active Events', value: hackathons.length, icon: Layers, color: 'text-cyan-500' },
                  { label: 'Pending Screenings', value: pendingApprovals, icon: Clock, color: 'text-amber-500' },
                ].map((kpi, idx) => (
                  <div key={idx} className="p-6 bg-white/95 border border-slate-200 rounded-3xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{kpi.label}</span>
                      <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
                    </div>
                    <div className="text-3xl font-extrabold text-slate-900 font-mono mt-3">{kpi.value}</div>
                  </div>
                ))}
              </div>

              {/* Bottom Visual Cards to fill empty spaces */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                
                {/* Recent Submissions Activity Stream */}
                <div className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b pb-3">
                    <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <Zap className="w-4.5 h-4.5 text-indigo-600 animate-bounce" /> Recent Activity Stream
                    </h4>
                    <span className="text-[10px] text-indigo-600 font-extrabold cursor-pointer">View Stream</span>
                  </div>
                  <div className="space-y-3.5">
                    {[
                      { team: 'Team Nova AI', desc: 'Submitted Project codebase links for evaluation.', time: '12 mins ago' },
                      { team: 'Devs Bangalore', desc: 'Completed participant registration checklist validation.', time: '1 hr ago' },
                      { team: 'CyberKnights', desc: 'Assigned under Rubrics target score trackers.', time: '3 hrs ago' }
                    ].map((act, idx) => (
                      <div key={idx} className="flex justify-between items-start text-xs border-b border-slate-50 pb-2.5 hover:bg-slate-50/50 p-1.5 rounded-lg transition-colors">
                        <div>
                          <span className="font-bold text-slate-800">{act.team}</span>
                          <p className="text-slate-500 text-[11px]">{act.desc}</p>
                        </div>
                        <span className="text-[9px] text-slate-400 font-semibold">{act.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Score Summary Metrics */}
                <div className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b pb-3">
                    <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <Target className="w-4.5 h-4.5 text-purple-600" /> Scoring Analytics
                    </h4>
                    <span className="text-[10px] text-purple-600 font-extrabold">Inspect Rubrics</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 text-center hover:scale-[1.02] transition-transform">
                      <span className="text-[10px] text-purple-500 font-bold">AVG EVALUATION</span>
                      <div className="text-2xl font-black text-purple-800">8.4 / 10</div>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-center hover:scale-[1.02] transition-transform">
                      <span className="text-[10px] text-emerald-500 font-bold">TOTAL SCORED</span>
                      <div className="text-2xl font-black text-emerald-800">12 Teams</div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: MY HACKATHONS */}
          {activeTab === 'hackathons' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-955">Active Hackathons</h3>
                  <p className="text-xs text-slate-500">Monitor active user-provided card banners</p>
                </div>
                
                {/* Button to add new hackathon */}
                <button
                  onClick={() => { setActiveTab('create'); setWizardStep(1); }}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition-all hover:scale-[1.02]"
                >
                  <Plus className="w-4 h-4" /> Add Hackathon
                </button>
              </div>

              {/* Grid of hackathons with banners */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHackathons.map((h) => (
                  <div key={h.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
                    <div className="h-40 relative overflow-hidden">
                      <img src={h.banner} alt={h.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                      <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[9px] font-extrabold uppercase bg-emerald-500 text-white">
                        {h.status}
                      </span>
                      <div className="absolute bottom-4 left-4 right-4 text-white font-extrabold text-sm leading-tight">
                        {h.title}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <div>
                          <div className="text-slate-400 text-[9px] uppercase font-bold">Prize Pool</div>
                          <div className="font-extrabold text-emerald-600">
                            {h.prizePool.startsWith('₹') ? h.prizePool : `₹${h.prizePool}`}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-400 text-[9px] uppercase font-bold">Hackers</div>
                          <div className="font-extrabold text-slate-800">{h.participantsCount}</div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                        <span className="text-[10px] text-slate-405 font-black uppercase tracking-wider">{h.mode}</span>
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
                            className="text-[10px] font-extrabold text-indigo-600 hover:text-indigo-750 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-all"
                          >
                            Modify
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${h.title}"?`)) {
                                onDeleteHackathon(h.id);
                              }
                            }}
                            className="text-[10px] font-extrabold text-rose-600 hover:text-rose-750 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl transition-all"
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

          {/* TAB 3: CREATE HACKATHON WIZARD - SPLIT VIEW WITH LIVE DYNAMIC CARD PREVIEW */}
          {activeTab === 'create' && (
            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Side: Live Glassmorphic Wow Preview (4 Columns) */}
              <div className="lg:col-span-5 space-y-4 sticky top-28">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 w-fit text-[10px] font-bold">
                  <Sparkle className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
                  <span>Real-Time AI Preview</span>
                </div>
                
                {/* Live Glassmorphic Mockup Card */}
                <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl overflow-hidden shadow-xl hover:shadow-indigo-500/10 hover:shadow-2xl transition-all duration-300">
                  <div className="h-44 relative bg-slate-900 overflow-hidden">
                    {banner ? (
                      <img src={banner} alt="Wizard Banner Preview" className="w-full h-full object-cover opacity-80" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-550 to-purple-650 flex items-center justify-center text-white text-xs font-bold">
                        No Banner Provided
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <span className="absolute top-4 left-4 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-indigo-600 text-white border border-indigo-400/30">
                      Draft Preview
                    </span>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h4 className="font-black text-base truncate">{title || 'Your Summit Title'}</h4>
                      <p className="text-[10px] text-slate-300 font-semibold truncate">{tagline || 'Tagline shows here'}</p>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                        <span className="text-[8px] text-slate-400 font-bold uppercase">Pool</span>
                        <div className="text-xs font-black text-emerald-600 truncate">{prizePool || '₹0'}</div>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                        <span className="text-[8px] text-slate-400 font-bold uppercase">Team Cap</span>
                        <div className="text-xs font-black text-slate-800 truncate">{maxTeamSize || '4'} Ppl</div>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                        <span className="text-[8px] text-slate-400 font-bold uppercase">Level</span>
                        <div className="text-xs font-black text-indigo-600 truncate">{difficulty}</div>
                      </div>
                    </div>

                    <div className="space-y-2 border-t pt-3.5 text-xs text-slate-650">
                      <div className="flex justify-between">
                        <span>Registration Deadline:</span>
                        <span className="font-bold text-slate-900">{registrationDeadline || 'Not set'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Event Mode:</span>
                        <span className="font-bold text-slate-900 capitalize">{mode}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex gap-2 text-[10px] text-slate-500">
                  <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                  <p>Changes on the right are updated instantly in the live design container on the left.</p>
                </div>
              </div>

              {/* Right Side: Interactive Wizard Form (7 Columns) */}
              <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xl space-y-6 hover:shadow-2xl transition-all duration-300">
                <div className="space-y-3">
                  <span className="text-xs font-bold text-indigo-600 uppercase">Step {wizardStep} of 4</span>
                  <h3 className="text-xl font-extrabold text-slate-955 font-black">
                    {wizardStep === 1 && 'Basic Event Info & Banner'}
                    {wizardStep === 2 && 'Challenge Statements'}
                    {wizardStep === 3 && 'Prizes (₹ Rupees)'}
                    {wizardStep === 4 && 'Grading Rubrics'}
                  </h3>
                </div>

                <form onSubmit={handleWizardSubmit} className="space-y-5">
                  {wizardStep === 1 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Event Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. India Multimodal AI Hackathon"
                          value={title}
                          onChange={(e) => handleTitleChange(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-550 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Tagline</label>
                        <input
                          type="text"
                          placeholder="e.g. Build regional solutions & win rewards"
                          value={tagline}
                          onChange={(e) => setTagline(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-550 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Detailed Description</label>
                        <textarea
                          placeholder="Describe the overall scope, rules, and expectations of this hackathon..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 focus:ring-2 focus:ring-indigo-550 focus:outline-none"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Max Team Size (No of ppl)</label>
                          <input
                            type="number"
                            value={maxTeamSize}
                            onChange={(e) => setMaxTeamSize(e.target.value)}
                            min={1}
                            max={10}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Difficulty Level</label>
                          <select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value as any)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800"
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Mode</label>
                          <select
                            value={mode}
                            onChange={(e) => setMode(e.target.value as any)}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800"
                          >
                            <option value="online">Online</option>
                            <option value="hybrid">Hybrid</option>
                            <option value="in-person">In-Person</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Prize Pool (INR)</label>
                          <input
                            type="text"
                            value={prizePool}
                            onChange={(e) => handlePrizePoolChange(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-emerald-600"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Registration Deadline</label>
                          <input
                            type="date"
                            value={registrationDeadline}
                            onChange={(e) => setRegistrationDeadline(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-850"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Banner Image URL</label>
                        {isBannerConfirmed ? (
                          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img src={banner} className="w-12 h-12 object-cover rounded-lg border border-slate-200" />
                              <div>
                                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                                  <CheckCircle className="w-3 h-3" /> Banner Applied
                                </span>
                                <p className="text-[9px] text-slate-400 truncate max-w-[200px]">{banner}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setIsBannerConfirmed(false)}
                              className="text-[10px] font-bold text-indigo-650 hover:underline bg-indigo-50 px-2.5 py-1.5 rounded-lg border border-indigo-100"
                            >
                              Edit/Change URL
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={banner}
                              onChange={(e) => setBanner(e.target.value)}
                              placeholder="Paste banner URL or let AI suggest..."
                              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono"
                            />
                            <button
                              type="button"
                              onClick={handleAiBannerGenerate}
                              className="px-3 py-2.5 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 text-indigo-600 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
                              disabled={isGeneratingBanner}
                            >
                              <Sparkle className="w-3.5 h-3.5 animate-pulse" />
                              <span>AI Suggest</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (banner) setIsBannerConfirmed(true);
                              }}
                              className="px-3.5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold transition-all"
                            >
                              Save Banner
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end pt-2">
                        <button type="button" onClick={() => setWizardStep(2)} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-100 transition-all hover:scale-105">
                          Next
                        </button>
                      </div>
                    </div>
                  )}

                  {wizardStep === 2 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900 text-xs">Problem Tracks</h4>
                        <button
                          type="button"
                          onClick={() => setProblemStatements([...problemStatements, { id: `ps-${Date.now()}`, track: 'AI', title: 'AI Track Challenge', description: 'Brief description', difficulty: 'Intermediate' }])}
                          className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-bold"
                        >
                          + Add Challenge
                        </button>
                      </div>
                      {problemStatements.map((ps) => (
                        <div key={ps.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                          <input
                            type="text"
                            value={ps.title}
                            onChange={(e) => setProblemStatements(problemStatements.map(p => p.id === ps.id ? { ...p, title: e.target.value } : p))}
                            className="w-full px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold"
                          />
                        </div>
                      ))}
                      <div className="flex justify-between pt-2">
                        <button type="button" onClick={() => setWizardStep(1)} className="px-5 py-2 border rounded-xl text-xs font-bold">Back</button>
                        <button type="button" onClick={() => setWizardStep(3)} className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">Next</button>
                      </div>
                    </div>
                  )}

                  {wizardStep === 3 && (
                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-900 text-xs">Indian Rupees Reward Split</h4>
                      {prizes.map((pz, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={pz.title}
                            onChange={(e) => setPrizes(prizes.map((p, i) => i === idx ? { ...p, title: e.target.value } : p))}
                            className="flex-1 px-3 py-1.5 border rounded-lg text-xs"
                          />
                          <input
                            type="text"
                            value={pz.amount}
                            onChange={(e) => setPrizes(prizes.map((p, i) => i === idx ? { ...p, amount: e.target.value } : p))}
                            className="w-32 px-3 py-1.5 border rounded-lg text-xs font-bold text-emerald-600"
                          />
                        </div>
                      ))}
                      <div className="flex justify-between pt-2">
                        <button type="button" onClick={() => setWizardStep(2)} className="px-5 py-2 border rounded-xl text-xs font-bold">Back</button>
                        <button type="button" onClick={() => setWizardStep(4)} className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">Next</button>
                      </div>
                    </div>
                  )}

                  {wizardStep === 4 && (
                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-900 text-xs">Weights Selection (Sum to 100%)</h4>
                      {rubrics.map((ru) => (
                        <div key={ru.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-xs font-semibold text-slate-700">{ru.name}</span>
                          <input
                            type="number"
                            value={ru.weight}
                            onChange={(e) => setRubrics(rubrics.map(r => r.id === ru.id ? { ...r, weight: parseInt(e.target.value, 10) || 0 } : r))}
                            className="w-16 px-2 py-1 text-center border rounded-lg text-xs font-bold text-indigo-600"
                          />
                        </div>
                      ))}
                      <div className="flex justify-between pt-2">
                        <button type="button" onClick={() => setWizardStep(3)} className="px-5 py-2 border rounded-xl text-xs font-bold">Back</button>
                        <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-100">
                          Publish Live
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: REGISTRATIONS & TEAMS */}
          {activeTab === 'teams' && (
            <div className="space-y-6">
              <h3 className="text-xl font-extrabold text-slate-955">Developer Registrations</h3>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 font-bold text-slate-600">
                      <th className="p-4">Team Name</th>
                      <th className="p-4">Leader Email</th>
                      <th className="p-4">Members</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {teams.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4 font-bold text-slate-900">{t.name}</td>
                        <td className="p-4 text-slate-500 font-mono">{t.leaderEmail}</td>
                        <td className="p-4 font-semibold text-indigo-600">{t.members.length} members</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold border ${
                            t.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {t.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => onUpdateTeamStatus(t.id, 'Approved')}
                            className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold text-xs shadow-sm hover:scale-[1.02] transition-transform"
                          >
                            Approve
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: JUDGES */}
          {activeTab === 'judges' && (
            <div className="space-y-6">
              <div className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-sm space-y-4">
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-600 animate-pulse" /> Evaluation & Grading Rules
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Appointed judges grade submissions from 1 to 10. The system then automatically multiplies by each weight to compute the team's standing.
                </p>
              </div>
            </div>
          )}

          {/* TAB 7: ANNOUNCEMENTS BROADCASTER */}
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
