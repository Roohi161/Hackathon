import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { Building2, TrendingUp, Users, Eye, Download, FileText, BarChart3, ExternalLink } from 'lucide-react';

export const SponsorDashboard: React.FC = () => {
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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-900/50 via-orange-900/40 to-slate-900 border border-amber-500/20 p-8 shadow-lg">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-sm font-medium mb-4">
              <Building2 className="w-4 h-4" />
              Sponsor Portal
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome, {user?.name || 'Sponsor'}!</h1>
            <p className="text-amber-100/70 text-lg">Your sponsored events are performing great this month.</p>
          </div>
          <button className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            View ROI Report
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Sponsored Events', value: '4', icon: Building2, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
          { label: 'Total Contribution', value: '$25K', icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
          { label: 'Teams Reached', value: '1.2K', icon: Users, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
          { label: 'Brand Impressions', value: '45K', icon: Eye, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
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
          {/* Sponsored Hackathons */}
          <div className="glass-panel rounded-2xl border border-slate-700/50 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                Active Sponsorships
              </h2>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Global AI Hackathon', dates: 'Oct 15 - Oct 17, 2026', participants: '500+', status: 'Live' },
                { name: 'Web3 Innovators', dates: 'Nov 1 - Nov 3, 2026', participants: '300+', status: 'Upcoming' },
              ].map((hack, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-amber-500/30 transition-colors gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-white font-semibold text-lg">{hack.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${hack.status === 'Live' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>{hack.status}</span>
                    </div>
                    <p className="text-sm text-slate-400">{hack.dates} • {hack.participants} Participants</p>
                  </div>
                  <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
                    View Details
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
                { label: 'View Submissions', icon: FileText },
                { label: 'Download Reports', icon: Download },
                { label: 'Update Branding', icon: ExternalLink },
              ].map((action, i) => (
                <button key={i} className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-amber-500/10 hover:text-amber-400 text-slate-300 border border-transparent hover:border-amber-500/30 transition-all text-sm font-medium">
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
