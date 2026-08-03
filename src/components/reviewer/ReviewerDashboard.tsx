import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { ClipboardList, CheckSquare, BarChart, Target, FileText, Download, Play, Award } from 'lucide-react';

export const ReviewerDashboard: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/50 via-indigo-900/40 to-slate-900 border border-blue-500/20 p-8 shadow-lg">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-medium mb-4">
              <ClipboardList className="w-4 h-4" />
              Reviewer Portal
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name || 'Reviewer'}!</h1>
            <p className="text-blue-100/70 text-lg">You have 5 pending submissions to review today.</p>
          </div>
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20">
            <Play className="w-5 h-5" />
            Start Reviewing
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Pending Reviews', value: '5', icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
          { label: 'Completed', value: '24', icon: CheckSquare, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
          { label: 'Avg Score Given', value: '8.5', icon: BarChart, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
          { label: 'Accuracy Rating', value: '98%', icon: Target, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
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
        <div className="lg:col-span-2 space-y-8">
          {/* Review Queue */}
          <div className="glass-panel rounded-2xl border border-slate-700/50 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                Review Queue
              </h2>
            </div>
            <div className="space-y-4">
              {[
                { project: 'AI Health Analyzer', team: 'MedTech Geniuses', hackathon: 'HealthHack 2026', deadline: 'Today, 11:59 PM' },
                { project: 'EcoTracker', team: 'Green Earth', hackathon: 'ClimateAction Hack', deadline: 'Tomorrow, 5:00 PM' },
                { project: 'DeFi Swap', team: 'Chain Masters', hackathon: 'Web3 Innovators', deadline: 'In 2 days' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/30 transition-colors gap-4">
                  <div>
                    <h3 className="text-white font-medium text-lg">{item.project}</h3>
                    <p className="text-sm text-slate-400">{item.team} • {item.hackathon}</p>
                    <p className="text-xs text-red-400 mt-1">Due: {item.deadline}</p>
                  </div>
                  <button className="px-4 py-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white border border-blue-500/30 rounded-lg text-sm font-medium transition-colors">
                    Review
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="glass-panel rounded-2xl border border-slate-700/50 p-6">
            <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {[
                { label: 'View Evaluation Rubric', icon: Award },
                { label: 'Export Scores (CSV)', icon: Download },
                { label: 'View Past Reviews', icon: ClipboardList },
              ].map((action, i) => (
                <button key={i} className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-blue-500/10 hover:text-blue-400 text-slate-300 border border-transparent hover:border-blue-500/30 transition-all text-sm font-medium">
                  <span className="flex items-center gap-3"><action.icon className="w-4 h-4" /> {action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
