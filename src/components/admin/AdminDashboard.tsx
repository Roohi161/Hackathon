import React, { useState } from 'react';
import {
  ShieldCheck,
  Trophy,
  Users,
  Star,
  Layers,
  Building2,
  Award,
  Plus,
  Trash2,
  X
} from 'lucide-react';
import type { Hackathon, OrganizerVerificationRequest } from '../../types';

interface AdminDashboardProps {
  hackathons: Hackathon[];
  onToggleFeatured: (hackathonId: string) => void;
  verifications: OrganizerVerificationRequest[];
  onUpdateVerificationStatus: (reqId: string, status: 'approved' | 'rejected') => void;
}

interface JudgeItem {
  id: string;
  name: string;
  email: string;
  expertise: string;
  assignedTrack: string;
  status: 'Active' | 'Pending';
  avatar: string;
}

interface OrganizerItem {
  id: string;
  name: string;
  email: string;
  organization: string;
  verified: boolean;
  eventsCount: number;
}

import { INITIAL_HACKATHONS, INITIAL_VERIFICATIONS } from '../../data/mockData';
import { useHackathonStore } from '../../stores/hackathonStore';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  hackathons: propsHackathons,
  onToggleFeatured,
  verifications: propsVerifications,
  onUpdateVerificationStatus
}) => {
  const storeHackathons = useHackathonStore((s) => s.hackathons);
  const hackathons = (propsHackathons && propsHackathons.length > 0) ? propsHackathons : (storeHackathons.length > 0 ? storeHackathons : (INITIAL_HACKATHONS as any));
  const verifications = (propsVerifications && propsVerifications.length > 0) ? propsVerifications : (INITIAL_VERIFICATIONS as any);
  const [activeAdminTab, setActiveAdminTab] = useState<'metrics' | 'judges' | 'organizers' | 'featured' | 'verification'>('metrics');

  // Interactive Judge List State
  const [judges, setJudges] = useState<JudgeItem[]>([
    {
      id: 'j1',
      name: 'Dr. Sarah Chen',
      email: 'sarah.chen@ai-research.org',
      expertise: 'Generative AI & LLMs',
      assignedTrack: 'AI Innovation Challenge 2026',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 'j2',
      name: 'Alex Rivera',
      email: 'alex@web3ventures.io',
      expertise: 'Smart Contracts & Rust',
      assignedTrack: 'Web3 Builder Sprint',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 'j3',
      name: 'Marcus Vance',
      email: 'marcus@cloudnative.dev',
      expertise: 'Kubernetes & Distributed Systems',
      assignedTrack: 'Cloud Native Hack',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
    }
  ]);

  // Interactive Organizer List State
  const [organizers, setOrganizers] = useState<OrganizerItem[]>([
    { id: 'o1', name: 'Elena Rostova', email: 'elena@techcorp.ai', organization: 'TechCorp AI Labs', verified: true, eventsCount: 4 },
    { id: 'o2', name: 'David Miller', email: 'david@ecosystems.org', organization: 'EcoSystems Global', verified: true, eventsCount: 2 },
    { id: 'o3', name: 'Priya Sharma', email: 'priya@cryptonet.foundation', organization: 'CryptoNet Foundation', verified: false, eventsCount: 1 }
  ]);

  // Add Judge Modal Form State
  const [showAddJudgeModal, setShowAddJudgeModal] = useState(false);
  const [judgeForm, setJudgeForm] = useState({
    name: '',
    email: '',
    expertise: 'Artificial Intelligence',
    assignedTrack: 'AI Innovation Challenge 2026'
  });

  // Add Organizer Modal Form State
  const [showAddOrganizerModal, setShowAddOrganizerModal] = useState(false);
  const [organizerForm, setOrganizerForm] = useState({
    name: '',
    email: '',
    organization: ''
  });

  const totalHackathons = hackathons.length;
  const totalParticipants = hackathons.reduce((acc: any, h: any) => acc + (h.participantsCount || 0), 0);
  const totalTeams = hackathons.reduce((acc: any, h: any) => acc + (h.teamsCount || 0), 0);

  // Handlers
  const handleAddJudge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judgeForm.name || !judgeForm.email) return;
    const newJudge: JudgeItem = {
      id: `j-${Date.now()}`,
      name: judgeForm.name,
      email: judgeForm.email,
      expertise: judgeForm.expertise,
      assignedTrack: judgeForm.assignedTrack,
      status: 'Active',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`
    };
    setJudges([newJudge, ...judges]);
    setJudgeForm({ name: '', email: '', expertise: 'Artificial Intelligence', assignedTrack: 'AI Innovation Challenge 2026' });
    setShowAddJudgeModal(false);
    alert(`Judge ${newJudge.name} successfully appointed and sent invite!`);
  };

  const handleRemoveJudge = (id: string) => {
    setJudges(judges.filter(j => j.id !== id));
  };

  const handleAddOrganizer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizerForm.name || !organizerForm.email) return;
    const newOrg: OrganizerItem = {
      id: `o-${Date.now()}`,
      name: organizerForm.name,
      email: organizerForm.email,
      organization: organizerForm.organization || 'Independent Host',
      verified: true,
      eventsCount: 0
    };
    setOrganizers([newOrg, ...organizers]);
    setOrganizerForm({ name: '', email: '', organization: '' });
    setShowAddOrganizerModal(false);
    alert(`Organizer ${newOrg.name} (${newOrg.organization}) granted verified organizer portal access!`);
  };

  const handleToggleOrganizerVerification = (id: string) => {
    setOrganizers(organizers.map(o => o.id === id ? { ...o, verified: !o.verified } : o));
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Title & Tab Bar Header */}
      <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Platform Administration</h2>
            <p className="text-xs text-slate-500">Manage judges, verify organizers, monitor security, and pin featured hackathons</p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-slate-100/80 border border-slate-200">
          <button
            onClick={() => setActiveAdminTab('metrics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeAdminTab === 'metrics'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveAdminTab('judges')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeAdminTab === 'judges'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Judges ({judges.length})
          </button>
          <button
            onClick={() => setActiveAdminTab('organizers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeAdminTab === 'organizers'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Organizers ({organizers.length})
          </button>
          <button
            onClick={() => setActiveAdminTab('featured')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeAdminTab === 'featured'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Featured Events
          </button>
          <button
            onClick={() => setActiveAdminTab('verification')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeAdminTab === 'verification'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Verifications ({verifications.filter((v: any) => v.status === 'pending').length})
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeAdminTab === 'metrics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Total Competitions</span>
                <Layers className="w-4 h-4 text-indigo-500" />
              </div>
              <span className="text-3xl font-extrabold text-slate-900 font-mono">{totalHackathons}</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Active Hackers</span>
                <Users className="w-4 h-4 text-emerald-500" />
              </div>
              <span className="text-3xl font-extrabold text-slate-900 font-mono">{totalParticipants}</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Total Registered Teams</span>
                <Trophy className="w-4 h-4 text-amber-500" />
              </div>
              <span className="text-3xl font-extrabold text-slate-900 font-mono">{totalTeams}</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Appointed Judges</span>
                <Award className="w-4 h-4 text-purple-500" />
              </div>
              <span className="text-3xl font-extrabold text-slate-900 font-mono">{judges.length}</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: JUDGE MANAGEMENT */}
      {activeAdminTab === 'judges' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Appointed Expert Judges</h3>
              <p className="text-xs text-slate-500">Add industry experts and assign them to specific hackathons for evaluation</p>
            </div>
            <button
              onClick={() => setShowAddJudgeModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold flex items-center gap-2 shadow-md hover:from-indigo-500 hover:to-purple-500 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add New Judge
            </button>
          </div>

          {/* Judges List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {judges.map((judge) => (
              <div key={judge.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img src={judge.avatar} alt={judge.name} className="w-11 h-11 rounded-full object-cover border border-slate-200" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{judge.name}</h4>
                      <p className="text-xs text-slate-500 font-mono">{judge.email}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {judge.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-slate-500">Expertise: <span className="font-semibold text-slate-800">{judge.expertise}</span></div>
                  <div className="text-slate-500">Assigned Track: <span className="font-semibold text-indigo-600">{judge.assignedTrack}</span></div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400 font-medium">Verified Evaluation Portal</span>
                  <button
                    onClick={() => handleRemoveJudge(judge.id)}
                    className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 p-1 hover:bg-rose-50 rounded-md transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ORGANIZER MANAGEMENT */}
      {activeAdminTab === 'organizers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Verified Platform Organizers</h3>
              <p className="text-xs text-slate-500">Approve organizations and grant full hackathon hosting privileges</p>
            </div>
            <button
              onClick={() => setShowAddOrganizerModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-semibold flex items-center gap-2 shadow-md hover:from-purple-500 hover:to-indigo-500 transition-all"
            >
              <Building2 className="w-4 h-4" />
              Add New Organizer
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl bg-white border border-slate-200 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500">
                  <th className="p-4">Organizer Name</th>
                  <th className="p-4">Organization</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {organizers.map((org) => (
                  <tr key={org.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{org.name}</td>
                    <td className="p-4 text-slate-600 font-medium">{org.organization}</td>
                    <td className="p-4 text-slate-500 font-mono">{org.email}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                        org.verified
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {org.verified ? 'Verified Host' : 'Pending Verification'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggleOrganizerVerification(org.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                          org.verified
                            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {org.verified ? 'Revoke Badge' : 'Approve & Verify'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: FEATURED EVENTS */}
      {activeAdminTab === 'featured' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Manage Homepage Carousel Events</h3>
          <div className="space-y-3">
            {hackathons.map((h: any) => (
              <div key={h.id} className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={h.banner} alt={h.title} className="w-16 h-10 object-cover rounded-lg" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{h.title}</h4>
                    <p className="text-xs text-slate-500">{h.organizerName} • Prize: {h.prizePool}</p>
                  </div>
                </div>

                <button
                  onClick={() => onToggleFeatured(h.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    h.featured
                      ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                      : 'bg-slate-100 text-slate-600 border border-slate-200 hover:text-slate-900'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${h.featured ? 'fill-current text-amber-500' : ''}`} />
                  {h.featured ? 'Featured on Homepage' : 'Pin to Featured'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: ORGANIZER VERIFICATION REQUESTS */}
      {activeAdminTab === 'verification' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Organizer Verification Applications</h3>
          <div className="overflow-x-auto rounded-2xl bg-white border border-slate-200 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500">
                  <th className="p-4">Organizer Name</th>
                  <th className="p-4">Organization</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {verifications.map((v: any) => (
                  <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{v.organizerName}</td>
                    <td className="p-4 text-slate-600">{v.organization}</td>
                    <td className="p-4 text-slate-500 font-mono">{v.email}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                        v.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : v.status === 'pending'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {v.status !== 'approved' && (
                        <button
                          onClick={() => onUpdateVerificationStatus(v.id, 'approved')}
                          className="px-3 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold"
                        >
                          Grant Badge
                        </button>
                      )}
                      {v.status !== 'rejected' && (
                        <button
                          onClick={() => onUpdateVerificationStatus(v.id, 'rejected')}
                          className="px-3 py-1 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 text-xs font-semibold"
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

      {/* MODAL 1: ADD JUDGE MODAL */}
      {showAddJudgeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 animate-scaleUp">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                Appoint Expert Judge
              </h3>
              <button onClick={() => setShowAddJudgeModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddJudge} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Judge Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Maya Patel"
                  value={judgeForm.name}
                  onChange={(e) => setJudgeForm({ ...judgeForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="judge@institution.org"
                  value={judgeForm.email}
                  onChange={(e) => setJudgeForm({ ...judgeForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Expertise</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI/ML, Blockchain, System Architecture"
                  value={judgeForm.expertise}
                  onChange={(e) => setJudgeForm({ ...judgeForm, expertise: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Hackathon Track</label>
                <select
                  value={judgeForm.assignedTrack}
                  onChange={(e) => setJudgeForm({ ...judgeForm, assignedTrack: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  {hackathons.map((h: any) => (
                    <option key={h.id} value={h.title}>{h.title}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddJudgeModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-semibold shadow-md hover:from-purple-500 hover:to-indigo-500"
                >
                  Appoint Judge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD ORGANIZER MODAL */}
      {showAddOrganizerModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 animate-scaleUp">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                Add Verified Organizer
              </h3>
              <button onClick={() => setShowAddOrganizerModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddOrganizer} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Organizer Lead Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Vance"
                  value={organizerForm.name}
                  onChange={(e) => setOrganizerForm({ ...organizerForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Official Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="jordan@company.com"
                  value={organizerForm.email}
                  onChange={(e) => setOrganizerForm({ ...organizerForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Organization / Entity Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. OpenSource Dev Club / Tech Global"
                  value={organizerForm.organization}
                  onChange={(e) => setOrganizerForm({ ...organizerForm, organization: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddOrganizerModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold shadow-md hover:from-indigo-500 hover:to-purple-500"
                >
                  Verify & Grant Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
