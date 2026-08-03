import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { Users, Clock, Star, Calendar, MessageSquare, Video, ArrowRight, Activity, Target } from 'lucide-react';

export const MentorDashboard: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-32 bg-slate-800 rounded-3xl w-full"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-800 rounded-2xl"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn p-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-900/50 via-teal-900/40 to-slate-900 border border-cyan-500/20 p-8 shadow-lg">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-sm font-medium mb-4">
              <Star className="w-4 h-4" />
              Mentor Portal
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name || 'Mentor'}!</h1>
            <p className="text-cyan-100/70 text-lg">You have 2 upcoming mentoring sessions today.</p>
          </div>
          <button className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2">
            <Video className="w-5 h-5" />
            Join Next Session
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Sessions', value: '12', icon: Video, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
          { label: 'Teams Assigned', value: '5', icon: Users, color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/20' },
          { label: 'Hours Mentored', value: '34', icon: Clock, color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20' },
          { label: 'Feedback Score', value: '4.9', icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
        ].map((stat, i) => (
          <div key={i} className={`p-6 rounded-2xl glass-panel border ${stat.border} flex flex-col gap-4`}>
            <div className={`p-3 rounded-xl w-fit ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
              <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Assigned Teams */}
          <div className="glass-panel rounded-2xl border border-slate-700/50 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-400" />
                Assigned Teams
              </h2>
              <button className="text-sm text-cyan-400 hover:text-cyan-300">View all</button>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Quantum Coders', hackathon: 'AI Innovators 2026', members: 4, lastSession: '2 days ago' },
                { name: 'Neural Nets', hackathon: 'AI Innovators 2026', members: 3, lastSession: 'Yesterday' },
              ].map((team, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/30 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
                      {team.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{team.name}</h3>
                      <p className="text-sm text-slate-400">{team.hackathon} • {team.members} members</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full">Last: {team.lastSession}</span>
                    <MessageSquare className="w-5 h-5 text-slate-400 hover:text-cyan-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Upcoming Schedule */}
          <div className="glass-panel rounded-2xl border border-slate-700/50 p-6">
             <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                Upcoming Sessions
              </h2>
            </div>
            <div className="space-y-4">
               {[
                { title: 'Architecture Review', team: 'Quantum Coders', time: 'Today, 2:00 PM', type: 'Video Call' },
                { title: 'Pitch Feedback', team: 'Neural Nets', time: 'Tomorrow, 10:00 AM', type: 'Review' },
              ].map((session, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div>
                    <h3 className="text-white font-medium">{session.title}</h3>
                    <p className="text-sm text-slate-400">{session.team} • {session.time}</p>
                  </div>
                  <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors">
                    Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="glass-panel rounded-2xl border border-slate-700/50 p-6">
            <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {[
                { label: 'Schedule Session', icon: Calendar },
                { label: 'View Team Progress', icon: Activity },
                { label: 'Send Feedback', icon: MessageSquare },
              ].map((action, i) => (
                <button key={i} className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-cyan-500/10 hover:text-cyan-400 text-slate-300 border border-transparent hover:border-cyan-500/30 transition-all text-sm font-medium">
                  <span className="flex items-center gap-3"><action.icon className="w-4 h-4" /> {action.label}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass-panel rounded-2xl border border-slate-700/50 p-6">
            <h2 className="text-lg font-bold text-white mb-4">Recent Activity</h2>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
               <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-cyan-500 bg-slate-900 group-hover:bg-cyan-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2" />
                  <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                    <p className="text-sm text-white">Feedback sent to Quantum Coders</p>
                    <span className="text-xs text-slate-400">2h ago</span>
                  </div>
               </div>
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-slate-700 bg-slate-900 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2" />
                  <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                    <p className="text-sm text-white">Completed session with Neural Nets</p>
                    <span className="text-xs text-slate-400">Yesterday</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
