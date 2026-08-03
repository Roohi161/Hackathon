import React from 'react';
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
  ShieldCheck,
  ExternalLink,
  Code,
  Cpu,
  Terminal
} from 'lucide-react';
import type { Hackathon } from '../../types';
import { motion } from 'framer-motion';

interface ParticipantMainDashboardProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  hackathons: Hackathon[];
  onViewHackathon: (hackathon: Hackathon) => void;
  onNavigateTab: (tab: string) => void;
}

export const ParticipantMainDashboard: React.FC<ParticipantMainDashboardProps> = ({
  user,
  hackathons,
  onViewHackathon,
  onNavigateTab
}) => {
  const userName = user?.name || 'Roohi';
  const activeHackathon = hackathons[0];

  const quickStats = [
    { label: 'Total Joined', value: '3', icon: Trophy, bg: 'bg-indigo-100/80 border-indigo-200', color: 'text-indigo-700', trend: '+1 this mo' },
    { label: 'Ongoing', value: '2', icon: Clock, bg: 'bg-amber-100/80 border-amber-200', color: 'text-amber-700', trend: 'Active' },
    { label: 'Completed', value: '1', icon: CheckCircle2, bg: 'bg-emerald-100/80 border-emerald-200', color: 'text-emerald-700', trend: '100% pass' },
    { label: 'Certificates', value: '3', icon: Award, bg: 'bg-violet-100/80 border-violet-200', color: 'text-violet-700', trend: 'Verified' },
    { label: 'Teams Joined', value: '2', icon: Users, bg: 'bg-blue-100/80 border-blue-200', color: 'text-blue-700', trend: 'Alpha Coders' },
    { label: 'Projects', value: '3', icon: FolderCode, bg: 'bg-purple-100/80 border-purple-200', color: 'text-purple-700', trend: '3 Repos' },
    { label: 'Total Badges', value: '7', icon: Star, bg: 'bg-rose-100/80 border-rose-200', color: 'text-rose-700', trend: 'Top 5%' },
    { label: 'Current Rank', value: '#12', icon: TrendingUp, bg: 'bg-teal-100/80 border-teal-200', color: 'text-teal-700', trend: 'Global' }
  ];

  const timelineEvents = [
    { day: 'Tomorrow', title: 'Team Alpha Architecture Sync', time: '2:00 PM', icon: Users, type: 'Team Meeting', color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { day: 'Friday', title: 'AI Mentor Session with Dr. John', time: '6:00 PM', icon: Video, type: 'Mentor Session', color: 'text-violet-600 bg-violet-50 border-violet-200' },
    { day: 'Saturday', title: 'AI Hackathon Final Submission Deadline', time: '11:59 PM', icon: FileCheck, type: 'Submission Lock', color: 'text-amber-600 bg-amber-50 border-amber-200' }
  ];

  const recentActivity = [
    { text: 'Registered for Global AI Innovators Hackathon 2026', time: '2 hours ago', icon: Trophy, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { text: 'Promoted to Team Leader for "Alpha Coders"', time: '4 hours ago', icon: UserCheck, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { text: 'Connected GitHub Repository & Pushed 4 Commits', time: '1 day ago', icon: FolderCode, color: 'text-violet-600 bg-violet-50 border-violet-200' },
    { text: 'Issued Official Cryptographic Winner Certificate', time: '2 days ago', icon: Award, color: 'text-amber-600 bg-amber-50 border-amber-200' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* Background Decorative Mesh Orbs */}
      <div className="absolute -top-12 -left-12 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 -right-12 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Light Theme Premium Hero Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50 via-purple-50/70 to-blue-50/50 text-slate-900 p-6 sm:p-10 border-2 border-indigo-100/90 shadow-xl shadow-indigo-100/50 group"
      >
        {/* Subtle Tech Watermark Accents */}
        <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6">
          <Terminal className="w-72 h-72 text-indigo-700" />
        </div>
        <div className="absolute right-1/3 -top-6 opacity-[0.06] pointer-events-none">
          <Cpu className="w-48 h-48 text-violet-700 animate-spin-slow" />
        </div>
        <div className="absolute left-1/2 -bottom-10 opacity-[0.04] pointer-events-none">
          <Code className="w-56 h-56 text-indigo-900" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 text-indigo-700 text-xs font-black border border-indigo-200/80 shadow-2xs backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" /> Student • Level 5 Participant
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600">{userName}</span> 👋
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed">
              You are actively participating in <strong className="text-indigo-600 font-black underline decoration-indigo-300">3 Hackathons</strong>. Your next project submission lock is due in 2 days!
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigateTab('explore')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-black transition-all shadow-md shadow-indigo-200 flex items-center gap-2 group/btn cursor-pointer"
              >
                <Trophy className="w-4 h-4" /> <span>Discover Hackathons</span>
              </button>
              <button
                onClick={() => onNavigateTab('teams')}
                className="px-5 py-2.5 rounded-xl bg-white/90 hover:bg-white text-slate-700 text-xs font-black border border-indigo-200/80 shadow-2xs transition-all flex items-center gap-2 backdrop-blur-md cursor-pointer"
              >
                <Users className="w-4 h-4 text-indigo-600" /> <span>Team Workspace</span>
              </button>
            </div>
          </div>

          {/* Countdown Highlight Box */}
          <div className="shrink-0 bg-white/90 backdrop-blur-md border border-indigo-100/90 p-6 rounded-3xl space-y-3 min-w-[260px] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider font-black text-slate-400 block">
                Upcoming Deadline
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <h3 className="font-black text-sm text-slate-900 truncate">
              {activeHackathon ? activeHackathon.title : 'AI Hackathon 2026'}
            </h3>
            <div className="flex items-center gap-2 text-xs font-black text-amber-800 bg-amber-50 border border-amber-200/90 px-3.5 py-1.5 rounded-xl w-fit shadow-2xs">
              <Clock className="w-4 h-4 text-amber-600 animate-pulse" /> Submission in 2 Days
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Statistics Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-600 border border-indigo-200">
              <Zap className="w-4 h-4 fill-indigo-400" />
            </div>
            Participant Overview & Stats
          </h2>
          <span className="text-xs font-bold text-slate-400">Updated Real-Time</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {quickStats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -3, scale: 1.02 }}
                className="p-4 rounded-2xl border bg-gradient-to-b from-white to-slate-50/50 border-indigo-100/90 shadow-2xs space-y-2 text-center sm:text-left hover:shadow-md transition-all hover:border-indigo-300"
              >
                <div className={`p-2 rounded-xl w-fit mx-auto sm:mx-0 shadow-2xs border ${stat.bg} ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xl font-black text-slate-900 font-mono tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                    {stat.label}
                  </span>
                  <span className="text-[9px] font-extrabold text-indigo-600 mt-0.5 block">
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
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Calendar className="w-4.5 h-4.5 text-indigo-600" /> Upcoming Timeline & Meetings
            </h2>
            <button
              onClick={() => onNavigateTab('calendar')}
              className="text-xs font-black text-indigo-600 hover:text-purple-600 hover:underline flex items-center gap-1 transition-colors"
            >
              Full Calendar <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {timelineEvents.map((event, idx) => {
              const Icon = event.icon;
              return (
                <div key={idx} className="p-4 rounded-2xl bg-white border border-indigo-100/80 flex items-center justify-between gap-4 hover:border-indigo-300 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl border shrink-0 ${event.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded-md border border-indigo-200">
                          {event.day}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">{event.type}</span>
                      </div>
                      <h4 className="text-xs font-black text-slate-900 mt-1">{event.title}</h4>
                    </div>
                  </div>
                  <span className="text-xs font-black text-slate-700 font-mono bg-slate-50 px-3 py-1 rounded-xl border border-slate-200 shrink-0 shadow-2xs">
                    {event.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-gradient-to-br from-white via-indigo-50/20 to-purple-50/20 p-6 sm:p-7 rounded-3xl border-2 border-indigo-100/90 shadow-md space-y-5">
          <div className="flex items-center justify-between border-b border-indigo-100/80 pb-4">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Clock className="w-4.5 h-4.5 text-indigo-600" /> Recent Activity
            </h2>
            <ShieldCheck className="w-4.5 h-4.5 text-emerald-500" />
          </div>

          <div className="space-y-4">
            {recentActivity.map((act, idx) => {
              const Icon = act.icon;
              return (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <div className={`p-2 rounded-xl shrink-0 border ${act.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-extrabold text-slate-800 leading-snug">{act.text}</p>
                    <span className="text-[10px] font-bold text-slate-400 block">{act.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* My Active Registered Hackathons */}
      <div className="bg-gradient-to-br from-white via-indigo-50/20 to-purple-50/20 p-6 sm:p-7 rounded-3xl border-2 border-indigo-100/90 shadow-md space-y-5">
        <div className="flex items-center justify-between border-b border-indigo-100/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-100 border border-indigo-200 text-indigo-600">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">Registered Hackathons</h2>
              <p className="text-xs font-semibold text-slate-500">Access your active hackathon team workspaces and submission portals</p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('my-hackathons')}
            className="text-xs font-black text-indigo-600 hover:text-purple-600 hover:underline flex items-center gap-1 transition-colors"
          >
            View All My Events <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {hackathons.slice(0, 3).map((hack) => (
            <motion.div
              whileHover={{ y: -4 }}
              key={hack.id}
              onClick={() => onViewHackathon(hack)}
              className="p-5 rounded-3xl bg-white border-2 border-indigo-100 hover:border-indigo-300 hover:shadow-xl transition-all cursor-pointer space-y-4 group relative overflow-hidden"
            >
              <div className="relative overflow-hidden rounded-2xl h-36">
                <img src={hack.banner} alt={hack.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/90 backdrop-blur-md text-indigo-700 border border-indigo-100 shadow-2xs">
                  {hack.status}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors truncate">{hack.title}</h4>
                <p className="text-xs text-slate-500 font-extrabold line-clamp-1">{hack.tracks.join(' • ')}</p>
                <div className="pt-2 flex items-center justify-between text-xs font-black text-indigo-600 border-t border-slate-100">
                  <span>Launch Workspace</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
};

