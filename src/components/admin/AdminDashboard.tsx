import React, { useState } from 'react';
import { ShieldCheck, Trophy, Users, Star, CheckCircle, Layers, Lock } from 'lucide-react';
import type { Hackathon, OrganizerVerificationRequest } from '../../types';

interface AdminDashboardProps {
  hackathons: Hackathon[];
  onToggleFeatured: (hackathonId: string) => void;
  verifications: OrganizerVerificationRequest[];
  onUpdateVerificationStatus: (reqId: string, status: 'approved' | 'rejected') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  hackathons,
  onToggleFeatured,
  verifications,
  onUpdateVerificationStatus
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'metrics' | 'featured' | 'verification'>('metrics');

  const totalHackathons = hackathons.length;
  const totalParticipants = hackathons.reduce((acc, h) => acc + h.participantsCount, 0);
  const totalTeams = hackathons.reduce((acc, h) => acc + h.teamsCount, 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Admin Title */}
      <div className="p-6 rounded-2xl glass-panel border border-emerald-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">Platform Administration</h2>
            <p className="text-xs text-gray-400">Global metrics, featured hackathons, and organizer security verification</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-1 rounded-xl bg-gray-900 border border-white/5">
          <button
            onClick={() => setActiveAdminTab('metrics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeAdminTab === 'metrics'
                ? 'bg-emerald-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveAdminTab('featured')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeAdminTab === 'featured'
                ? 'bg-emerald-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Featured Events
          </button>
          <button
            onClick={() => setActiveAdminTab('verification')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeAdminTab === 'verification'
                ? 'bg-emerald-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Organizer Verifications ({verifications.filter(v => v.status === 'pending').length})
          </button>
        </div>
      </div>

      {activeAdminTab === 'metrics' && (
        <div className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl glass-card border border-white/10 space-y-1">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Total Competitions</span>
                <Layers className="w-4 h-4 text-indigo-400" />
              </div>
              <span className="text-3xl font-extrabold text-white font-mono">{totalHackathons}</span>
            </div>

            <div className="p-5 rounded-2xl glass-card border border-white/10 space-y-1">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Active Hackers</span>
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-3xl font-extrabold text-white font-mono">{totalParticipants}</span>
            </div>

            <div className="p-5 rounded-2xl glass-card border border-white/10 space-y-1">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Total Registered Teams</span>
                <Trophy className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-3xl font-extrabold text-white font-mono">{totalTeams}</span>
            </div>

            <div className="p-5 rounded-2xl glass-card border border-white/10 space-y-1">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Platform Security Status</span>
                <Lock className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="text-base font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> All Systems Nominal
              </span>
            </div>
          </div>
        </div>
      )}

      {activeAdminTab === 'featured' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Manage Homepage Carousel Events</h3>
          <div className="space-y-3">
            {hackathons.map((h) => (
              <div key={h.id} className="p-4 rounded-xl glass-panel border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={h.banner} alt={h.title} className="w-16 h-10 object-cover rounded-lg" />
                  <div>
                    <h4 className="font-bold text-white text-sm">{h.title}</h4>
                    <p className="text-xs text-gray-400">{h.organizerName} • Prize: {h.prizePool}</p>
                  </div>
                </div>

                <button
                  onClick={() => onToggleFeatured(h.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    h.featured
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                      : 'bg-gray-900 text-gray-400 border border-white/10 hover:text-white'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${h.featured ? 'fill-current' : ''}`} />
                  {h.featured ? 'Featured on Homepage' : 'Pin to Featured'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeAdminTab === 'verification' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Organizer Verification Applications</h3>
          <div className="overflow-x-auto rounded-2xl glass-panel border border-white/10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-950/60 text-xs font-semibold text-gray-400">
                  <th className="p-4">Organizer Name</th>
                  <th className="p-4">Organization</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-xs">
                {verifications.map((v) => (
                  <tr key={v.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-white">{v.organizerName}</td>
                    <td className="p-4 text-gray-300">{v.organization}</td>
                    <td className="p-4 text-gray-400 font-mono">{v.email}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                        v.status === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : v.status === 'pending'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {v.status !== 'approved' && (
                        <button
                          onClick={() => onUpdateVerificationStatus(v.id, 'approved')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-[11px] font-semibold"
                        >
                          Grant Badge
                        </button>
                      )}
                      {v.status !== 'rejected' && (
                        <button
                          onClick={() => onUpdateVerificationStatus(v.id, 'rejected')}
                          className="px-2.5 py-1 rounded-lg bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 text-[11px] font-semibold"
                        >
                          Reject
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
