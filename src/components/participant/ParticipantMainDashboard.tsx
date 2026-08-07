import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  Clock,
  Award,
  Users,
  FolderCode,
  Star,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Video,
  FileCheck,
  UserCheck,
  Zap,
  ExternalLink
} from 'lucide-react';
import type { Hackathon } from '../../types';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import { useHackathonStore } from '../../stores/hackathonStore';

interface ParticipantMainDashboardProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  hackathons?: Hackathon[];
  onViewHackathon?: (hackathon: Hackathon) => void;
  onNavigateTab?: (tab: string) => void;
}

export const ParticipantMainDashboard: React.FC<ParticipantMainDashboardProps> = ({
  user: propsUser,
  hackathons: propsHackathons,
  onViewHackathon,
  onNavigateTab
}) => {
  const navigate = useNavigate();
  const storeUser = useAuthStore((s) => s.user);
  const storeHackathons = useHackathonStore((s) => s.hackathons);
  const fetchHackathons = useHackathonStore((s) => s.fetchHackathons);

  React.useEffect(() => {
    fetchHackathons();
  }, [fetchHackathons]);

  const getCombinedHackathons = () => {
    const map = new Map<string, Hackathon>();
    if (storeHackathons && storeHackathons.length > 0) {
      storeHackathons.forEach(h => map.set(h.id, h));
    }
    if (propsHackathons && propsHackathons.length > 0) {
      propsHackathons.forEach(h => map.set(h.id, h));
    }
    return Array.from(map.values());
  };

  const user = propsUser || storeUser || { name: 'User', email: 'user@example.com' };
  const hackathons = getCombinedHackathons();
  const userName = user?.name || 'User';
  const activeHackathon = hackathons[0];

  const handleNavigate = (tab: string) => {
    if (onNavigateTab) onNavigateTab(tab);
    if (tab === 'explore' || tab === 'dashboard') navigate('/hackathons');
    else if (tab === 'teams') navigate('/teams');
    else if (tab === 'projects') navigate('/projects');
    else if (tab === 'calendar') navigate('/calendar');
    else if (tab === 'learning') navigate('/learning');
    else if (tab === 'certificates') navigate('/certificates');
    else if (tab === 'leaderboard') navigate('/leaderboard');
    else navigate(`/${tab}`);
  };

  const handleViewHackathon = (hack: any) => {
    if (onViewHackathon) onViewHackathon(hack);
    navigate(`/hackathons/${hack.id || 'h-1'}`);
  };

  const quickStats = [
    { label: 'Total Joined', value: '3', icon: Trophy, bg: 'bg-indigo-50 border-indigo-100', color: 'text-indigo-600', trend: '+1 this mo', tab: 'explore' },
    { label: 'Ongoing', value: '2', icon: Clock, bg: 'bg-amber-50 border-amber-100', color: 'text-amber-600', trend: 'Active', tab: 'explore' },
    { label: 'Completed', value: '1', icon: CheckCircle2, bg: 'bg-emerald-50 border-emerald-100', color: 'text-emerald-600', trend: '100% pass', tab: 'explore' },
    { label: 'Certificates', value: '3', icon: Award, bg: 'bg-violet-50 border-violet-100', color: 'text-violet-600', trend: 'Verified', tab: 'certificates' },
    { label: 'Teams Joined', value: '2', icon: Users, bg: 'bg-blue-50 border-blue-100', color: 'text-blue-600', trend: 'Alpha Coders', tab: 'teams' },
    { label: 'Projects', value: '3', icon: FolderCode, bg: 'bg-purple-50 border-purple-100', color: 'text-purple-600', trend: '3 Repos', tab: 'projects' },
    { label: 'Total Badges', value: '7', icon: Star, bg: 'bg-rose-50 border-rose-100', color: 'text-rose-600', trend: 'Top 5%', tab: 'profile' },
    { label: 'Current Rank', value: '#12', icon: TrendingUp, bg: 'bg-teal-50 border-teal-100', color: 'text-teal-600', trend: 'Global', tab: 'leaderboard' }
  ];

  const timelineEvents = [
    { day: 'Tomorrow', title: 'Team Alpha Architecture Sync', time: '2:00 PM', icon: Users, type: 'Team Meeting', color: 'text-indigo-600 bg-indigo-50 border-indigo-100', tab: 'teams' },
    { day: 'Friday', title: 'AI Mentor Session with Dr. John', time: '6:00 PM', icon: Video, type: 'Mentor Session', color: 'text-violet-600 bg-violet-50 border-violet-100', tab: 'calendar' },
    { day: 'Saturday', title: 'AI Hackathon Final Submission Deadline', time: '11:59 PM', icon: FileCheck, type: 'Submission Lock', color: 'text-amber-600 bg-amber-50 border-amber-100', tab: 'projects' }
  ];

  const recentActivity = [
    { text: 'Registered for Global AI Innovators Hackathon 2026', time: '2 hours ago', icon: Trophy, color: 'text-indigo-600 bg-indigo-50 border-indigo-100', tab: 'explore' },
    { text: 'Promoted to Team Leader for "Alpha Coders"', time: '4 hours ago', icon: UserCheck, color: 'text-emerald-600 bg-emerald-50 border-emerald-100', tab: 'teams' },
    { text: 'Connected GitHub Repository & Pushed 4 Commits', time: '1 day ago', icon: FolderCode, color: 'text-violet-600 bg-violet-50 border-violet-100', tab: 'projects' },
    { text: 'Issued Official Cryptographic Winner Certificate', time: '2 days ago', icon: Award, color: 'text-amber-600 bg-amber-50 border-amber-100', tab: 'certificates' }
  ];

  // Rotating 4 Hackathon Background Images calculated by current hour
  const HERO_IMAGES = [
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1400&q=80', // Coding Team Sync
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1400&q=80', // Tech Developers Collaborating
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80', // Hackathon Team Workshop
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=80'  // Cyber Tech Workspace
  ];

  const currentHourImageIndex = React.useMemo(() => {
    return Math.floor(Date.now() / (1000 * 60 * 60)) % HERO_IMAGES.length;
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300 relative z-10">
      
      {/* Compact Light Futuristic Tech Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-indigo-50/60 to-purple-50/50 p-6 sm:p-8 border border-indigo-200/80 shadow-md backdrop-blur-xl group">
        {/* Subtle Circuit Overlay & Mesh Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3.5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 to-violet-500/10 text-indigo-700 text-xs font-bold border border-indigo-200/80 backdrop-blur-md shadow-2xs">
              <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" /> Student • Level 5 Participant
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-heading">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600">{userName}</span> 👋
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed">
              You are actively participating in <strong className="text-indigo-700 font-bold underline decoration-indigo-300">3 Hackathons</strong>. Your next project submission lock is due in 2 days!
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleNavigate('explore')}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs sm:text-sm font-bold transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-indigo-300/40 flex items-center gap-2 cursor-pointer group/btn active:scale-98"
              >
                <Trophy className="w-4 h-4 group-hover/btn:rotate-12 transition-transform duration-300" />
                <span>Discover Hackathons</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
              </button>
              <button
                onClick={() => handleNavigate('teams')}
                className="px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold border border-slate-200 shadow-2xs hover:shadow-md transition-all duration-200 flex items-center gap-2 cursor-pointer active:scale-98"
              >
                <Users className="w-4 h-4 text-indigo-600" /> <span>Team Workspace</span>
              </button>
            </div>
          </div>

          {/* Compact Light Tech Highlight Box */}
          <div 
            onClick={() => activeHackathon && handleViewHackathon(activeHackathon)}
            className="shrink-0 bg-white/90 backdrop-blur-md border border-indigo-200/80 p-5 rounded-3xl space-y-2.5 min-w-[250px] shadow-sm hover:shadow-md hover:border-indigo-400 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Upcoming Deadline
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 truncate">
              {activeHackathon ? activeHackathon.title : 'AI Hackathon 2026'}
            </h3>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-amber-800 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-xl w-fit">
              <Clock className="w-4 h-4 text-amber-600 animate-pulse" /> Submission in 2 Days
            </div>
          </div>
        </div>
      </div>

      {/* Quick Statistics Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-indigo-100/80 text-indigo-600 border border-indigo-200">
              <Zap className="w-4.5 h-4.5 fill-indigo-400" />
            </div>
            Participant Overview & Stats
          </h2>
          <span className="text-xs font-normal text-slate-400">Updated Real-Time</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {quickStats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleNavigate(stat.tab)}
                className="p-4 rounded-2xl border-2 bg-gradient-to-b from-white to-slate-50/50 border-indigo-100/90 shadow-2xs space-y-2 text-center sm:text-left hover:shadow-lg hover:border-indigo-300 transition-all duration-200 cursor-pointer group"
              >
                <div className={`p-2 rounded-xl w-fit mx-auto sm:mx-0 shadow-2xs border ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="block text-2xl font-bold text-slate-900 font-mono tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
                    {stat.label}
                  </span>
                  <span className="text-[10px] font-semibold text-indigo-600 mt-0.5 block">
                    {stat.trend}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Upcoming Events & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upcoming Events Timeline */}
        <div className="lg:col-span-2 bg-gradient-to-br from-white via-indigo-50/20 to-purple-50/20 p-6 sm:p-7 rounded-3xl border-2 border-indigo-100/90 shadow-md space-y-5">
          <div className="flex items-center justify-between border-b border-indigo-100/80 pb-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-indigo-600" /> Upcoming Timeline & Meetings
            </h2>
            <button
              onClick={() => handleNavigate('calendar')}
              className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-purple-600 hover:underline flex items-center gap-1 cursor-pointer transition-colors duration-200"
            >
              Full Calendar <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {timelineEvents.map((event, idx) => {
              const Icon = event.icon;
              return (
                <div 
                  key={idx} 
                  onClick={() => handleNavigate(event.tab)}
                  className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between gap-4 hover:bg-slate-100/80 hover:border-indigo-200 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`p-2.5 rounded-xl border shrink-0 ${event.color}`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                          {event.day}
                        </span>
                        <span className="text-[11px] font-normal text-slate-400">{event.type}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">{event.title}</h4>
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm font-normal text-slate-500 shrink-0 font-mono">{event.time}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <Zap className="w-5 h-5 text-indigo-600" /> Recent Activity Log
            </h2>
          </div>

          <div className="space-y-3">
            {recentActivity.map((act, idx) => {
              const Icon = act.icon;
              return (
                <div 
                  key={idx} 
                  onClick={() => handleNavigate(act.tab)}
                  className="p-3.5 rounded-2xl bg-slate-50/60 border border-slate-200/60 flex items-start gap-3 hover:bg-slate-100/80 hover:border-indigo-200 transition-all cursor-pointer"
                >
                  <div className={`p-2 rounded-xl border shrink-0 mt-0.5 ${act.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-slate-800 leading-snug">{act.text}</p>
                    <span className="text-[11px] text-slate-400 font-normal block mt-1">{act.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Featured Hackathons Active Grid */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Trophy className="w-5 h-5 text-indigo-600" /> Active Recommended Hackathons
          </h2>
          <button
            onClick={() => handleNavigate('explore')}
            className="text-xs sm:text-sm font-semibold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
          >
            Explore All ({hackathons.length}) <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {(hackathons || []).map((hack: any) => (
            <div
              key={hack.id}
              onClick={() => handleViewHackathon(hack)}
              className="group relative flex flex-col justify-between p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-lg hover:border-indigo-200 transition-all duration-300 cursor-pointer"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
                    {hack.category || 'AI & Tech'}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    {hack.mode || 'Online'}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                  {hack.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {hack.tagline || hack.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-600">
                  <Trophy className="w-3.5 h-3.5" /> {hack.prizePool || '₹25,00,000'}
                </div>
                <span className="text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Details <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
