import React, { useState, useEffect } from 'react';
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
  X,
  Database,
  Megaphone,
  FolderKanban,
  UserCheck,
  CheckCircle2,
  XCircle,
  Activity,
  Sliders,
  Bell,
  Lock,
  Search,
  Filter,
  FileText
} from 'lucide-react';
import type { Hackathon, OrganizerVerificationRequest } from '../../types';
import { INITIAL_HACKATHONS, INITIAL_VERIFICATIONS } from '../../data/mockData';
import { useHackathonStore } from '../../stores/hackathonStore';

interface AdminDashboardProps {
  activeTab?: string;
  hackathons?: Hackathon[];
  onToggleFeatured?: (hackathonId: string) => void;
  verifications?: OrganizerVerificationRequest[];
  onUpdateVerificationStatus?: (reqId: string, status: 'approved' | 'rejected') => void;
  onNavigateTab?: (tab: any) => void;
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

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: 'Participant' | 'Organizer' | 'Judge' | 'Admin';
  joinedDate: string;
  status: 'Active' | 'Suspended';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  activeTab: propActiveTab = 'metrics',
  hackathons: propsHackathons,
  onToggleFeatured,
  verifications: propsVerifications,
  onUpdateVerificationStatus,
  onNavigateTab
}) => {
  const storeHackathons = useHackathonStore((s) => s.hackathons);
  const hackathons = (propsHackathons && propsHackathons.length > 0) ? propsHackathons : (storeHackathons.length > 0 ? storeHackathons : (INITIAL_HACKATHONS as any));
  const [verificationList, setVerificationList] = useState<OrganizerVerificationRequest[]>(
    (propsVerifications && propsVerifications.length > 0) ? propsVerifications : (INITIAL_VERIFICATIONS as any)
  );

  const [activeAdminTab, setActiveAdminTab] = useState<string>(propActiveTab);

  useEffect(() => {
    if (propActiveTab) {
      setActiveAdminTab(propActiveTab);
    }
  }, [propActiveTab]);

  const handleTabChange = (tab: string) => {
    setActiveAdminTab(tab);
    if (onNavigateTab) {
      onNavigateTab(tab);
    }
  };

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

  // Interactive Platform Users State
  const [usersList, setUsersList] = useState<UserRecord[]>([
    { id: 'u1', name: 'Alex Johnson', email: 'alex.j@gmail.com', role: 'Participant', joinedDate: 'May 12, 2024', status: 'Active' },
    { id: 'u2', name: 'Dr. Sarah Chen', email: 'sarah.chen@ai-research.org', role: 'Judge', joinedDate: 'Apr 02, 2024', status: 'Active' },
    { id: 'u3', name: 'Elena Rostova', email: 'elena@techcorp.ai', role: 'Organizer', joinedDate: 'Jan 15, 2024', status: 'Active' },
    { id: 'u4', name: 'Liam Vance', email: 'liam.v@devnet.io', role: 'Participant', joinedDate: 'May 20, 2024', status: 'Active' },
    { id: 'u5', name: 'Vikram Patel', email: 'vikram@solana.org', role: 'Participant', joinedDate: 'Mar 18, 2024', status: 'Active' }
  ]);

  // Modals
  const [showAddJudgeModal, setShowAddJudgeModal] = useState(false);
  const [judgeForm, setJudgeForm] = useState({ name: '', email: '', expertise: 'Artificial Intelligence', assignedTrack: 'AI Innovation Challenge 2026' });

  const [showAddOrganizerModal, setShowAddOrganizerModal] = useState(false);
  const [organizerForm, setOrganizerForm] = useState({ name: '', email: '', organization: '' });

  const totalHackathons = hackathons.length;
  const totalParticipants = hackathons.reduce((sum: number, h: any) => sum + (h.participantsCount || h.participants || 0), 0);
  const totalTeams = hackathons.reduce((sum: number, h: any) => sum + (h.teamsCount || Math.floor((h.participantsCount || 40) / 4)), 0);

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
  };

  const handleUpdateVerification = (reqId: string, status: 'approved' | 'rejected') => {
    setVerificationList(verificationList.map(v => v.id === reqId ? { ...v, status } : v));
    if (onUpdateVerificationStatus) {
      onUpdateVerificationStatus(reqId, status);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16 text-slate-100">
      {/* Title & Header (DARK GLASSMORPHISM WITH QUICK ACTIONS) */}
      <div className="p-6 rounded-2xl bg-slate-900/90 backdrop-blur-2xl border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Platform Administration</h2>
            <p className="text-xs text-slate-400">Manage judges, verify organizers, monitor security, and pin featured hackathons</p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddJudgeModal(true)}
            className="px-3.5 py-2 rounded-xl bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-extrabold transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-400" /> Appoint Judge
          </button>
          <button
            onClick={() => setShowAddOrganizerModal(true)}
            className="px-3.5 py-2 rounded-xl bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 border border-purple-500/30 text-xs font-extrabold transition-all flex items-center gap-2 shadow-sm"
          >
            <Building2 className="w-3.5 h-3.5 text-purple-400" /> Add Organizer
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {(activeAdminTab === 'metrics' || activeAdminTab === 'dashboard') && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-xl space-y-2 hover:border-indigo-500/40 transition-all">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Total Competitions</span>
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <span className="text-3xl font-black text-white font-mono">{totalHackathons}</span>
              <p className="text-[11px] text-slate-400">Across 4 major technology tracks</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-xl space-y-2 hover:border-emerald-500/40 transition-all">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Active Hackers</span>
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <span className="text-3xl font-black text-white font-mono">{totalParticipants}</span>
              <p className="text-[11px] text-slate-400">+18% growth this month</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-xl space-y-2 hover:border-amber-500/40 transition-all">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Total Registered Teams</span>
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Trophy className="w-4 h-4" />
                </div>
              </div>
              <span className="text-3xl font-black text-white font-mono">{totalTeams}</span>
              <p className="text-[11px] text-slate-400">Avg 4 members per team</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-xl space-y-2 hover:border-purple-500/40 transition-all">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Appointed Judges</span>
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <span className="text-3xl font-black text-white font-mono">{judges.length}</span>
              <p className="text-[11px] text-slate-400">Industry domain experts</p>
            </div>
          </div>

          {/* Quick System Status */}
          <div className="p-6 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-400" /> Platform System Telemetry
              </h3>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                100% Operational
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 font-bold">API Latency</span>
                <p className="text-xl font-mono font-bold text-emerald-400">24ms</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 font-bold">Database Queries</span>
                <p className="text-xl font-mono font-bold text-indigo-400">1,420 req/s</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 font-bold">Security Audits</span>
                <p className="text-xl font-mono font-bold text-amber-400">Passed (0 Flags)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MY EVENTS / HACKATHONS */}
      {(activeAdminTab === 'events' || activeAdminTab === 'featured') && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-white">Platform Managed Hackathons</h3>
              <p className="text-xs text-slate-400">Real-time status tracking and featured event toggles</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-xs font-bold text-slate-400">
                  <th className="p-4">Hackathon Title</th>
                  <th className="p-4">Track</th>
                  <th className="p-4">Participants</th>
                  <th className="p-4">Prize Pool</th>
                  <th className="p-4">Featured</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
                {hackathons.map((h: any) => (
                  <tr key={h.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-white flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold border border-indigo-500/30">
                        <Trophy className="w-4 h-4" />
                      </div>
                      {h.title}
                    </td>
                    <td className="p-4"><span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono text-[11px]">{h.category || 'AI'}</span></td>
                    <td className="p-4 font-mono font-bold text-indigo-400">{h.participantsCount || h.participants || 120}</td>
                    <td className="p-4 font-mono font-bold text-amber-400">${h.prizePool || '50,000'}</td>
                    <td className="p-4">
                      <button
                        onClick={() => onToggleFeatured && onToggleFeatured(h.id)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 border transition-all ${
                          h.featured
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${h.featured ? 'fill-amber-300' : ''}`} />
                        {h.featured ? 'Featured' : 'Pin Event'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: JUDGES */}
      {activeAdminTab === 'judges' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-white">Appointed Expert Judges</h3>
              <p className="text-xs text-slate-400">Add industry experts and assign them to specific hackathons for evaluation</p>
            </div>
            <button
              onClick={() => setShowAddJudgeModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-purple-500 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add New Judge
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {judges.map((judge) => (
              <div key={judge.id} className="p-5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-xl flex flex-col justify-between space-y-4 hover:border-indigo-500/40 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img src={judge.avatar} alt={judge.name} className="w-11 h-11 rounded-full object-cover border-2 border-indigo-500/40" />
                    <div>
                      <h4 className="font-bold text-white text-sm">{judge.name}</h4>
                      <p className="text-xs text-slate-400 font-mono">{judge.email}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {judge.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div className="text-slate-400">Expertise: <span className="font-semibold text-white">{judge.expertise}</span></div>
                  <div className="text-slate-400">Assigned Track: <span className="font-semibold text-indigo-400">{judge.assignedTrack}</span></div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-[11px] text-slate-400 font-medium">Verified Evaluation Portal</span>
                  <button
                    onClick={() => handleRemoveJudge(judge.id)}
                    className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 p-1 hover:bg-rose-500/10 rounded-md transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ORGANIZERS */}
      {activeAdminTab === 'organizers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-white">Verified Platform Organizers</h3>
              <p className="text-xs text-slate-400">Approve organizations and grant full hackathon hosting privileges</p>
            </div>
            <button
              onClick={() => setShowAddOrganizerModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-purple-600/30 hover:from-purple-500 hover:to-indigo-500 transition-all"
            >
              <Building2 className="w-4 h-4" />
              Add New Organizer
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-xs font-bold text-slate-400">
                  <th className="p-4">Organizer Name</th>
                  <th className="p-4">Organization</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
                {organizers.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-white">{o.name}</td>
                    <td className="p-4"><span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-indigo-300 font-bold">{o.organization}</span></td>
                    <td className="p-4 font-mono text-slate-400">{o.email}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Verified Host
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: VERIFICATION REQUESTS / CONTROLS */}
      {(activeAdminTab === 'verification' || activeAdminTab === 'moderation') && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-black text-white">Platform Controls & Moderation Queue</h3>
            <p className="text-xs text-slate-400">Review official credentials and grant organizing access</p>
          </div>

          <div className="space-y-3">
            {verificationList.map((req) => (
              <div key={req.id} className="p-5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-extrabold text-white text-sm">{req.organizationName}</h4>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      req.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                      req.status === 'rejected' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                      'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    }`}>
                      {req.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Contact Email: <span className="font-mono text-indigo-300">{req.contactEmail}</span></p>
                  <p className="text-xs text-slate-400">Tax/Org Reg Number: <span className="font-mono text-slate-300">{req.taxId || 'TAX-998412'}</span></p>
                </div>

                {req.status === 'pending' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateVerification(req.id, 'approved')}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve
                    </button>
                    <button
                      onClick={() => handleUpdateVerification(req.id, 'rejected')}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-rose-600/30 text-rose-400 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-all"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: DATA CENTER / ANALYTICS */}
      {activeAdminTab === 'analytics' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-400" /> Platform Data Center & Storage Vault
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Real-time repository sync, media assets storage, and database cluster health</p>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => alert('Initiated AES-256 Nightly PostgreSQL Database Backup! Automated snapshot saving to AWS S3 node...')}
                className="px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
              >
                <Activity className="w-4 h-4 text-indigo-400" /> Trigger Manual Backup
              </button>
              <button 
                onClick={() => alert('Downloading Platform Data Center Audit Log (CSV)...')}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-slate-400" /> Export System Logs
              </button>
            </div>
          </div>

          {/* 4 HACKATHON DATA METRIC CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-xl space-y-2 hover:border-indigo-500/40 transition-all">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                <span>Code Repositories</span>
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Database className="w-4 h-4" />
                </div>
              </div>
              <span className="text-2xl font-mono font-black text-indigo-400">148 Synced Repos</span>
              <p className="text-[11px] text-slate-400">GitHub & GitLab Webhooks (0 Errors)</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-xl space-y-2 hover:border-emerald-500/40 transition-all">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                <span>Submission Media Storage</span>
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <span className="text-2xl font-mono font-black text-emerald-400">42.8 GB / 500 GB</span>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[12%] rounded-full" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-xl space-y-2 hover:border-amber-500/40 transition-all">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                <span>Judged Scorecards</span>
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <span className="text-2xl font-mono font-black text-amber-400">1,240 Score Log Entries</span>
              <p className="text-[11px] text-slate-400">Weighted Rubrics & Feedback</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-xl space-y-2 hover:border-purple-500/40 transition-all">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                <span>Database Cluster Health</span>
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <span className="text-2xl font-mono font-black text-purple-400">PostgreSQL 16.2</span>
              <p className="text-[11px] text-slate-400">AES-256 Encrypted • 99.98% Uptime</p>
            </div>
          </div>

          {/* STORAGE BREAKDOWN BY RESOURCE TYPE */}
          <div className="p-6 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-xl space-y-4">
            <h4 className="text-sm font-black text-white uppercase tracking-wider text-slate-300">
              Storage Footprint Breakdown
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-bold block">GitHub Code Tarballs</span>
                <span className="font-mono text-base font-bold text-indigo-400">18.2 GB</span>
                <span className="text-[10px] text-slate-500 block">Source Zip & Tar archives</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-bold block">Demo Videos (1080p MP4)</span>
                <span className="font-mono text-base font-bold text-emerald-400">12.4 GB</span>
                <span className="text-[10px] text-slate-500 block">318 Uploaded video walkthroughs</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-bold block">Pitch Decks & Slides</span>
                <span className="font-mono text-base font-bold text-amber-400">10.8 GB</span>
                <span className="text-[10px] text-slate-500 block">PDFs & Presentation decks</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-bold block">Judged Rubric Data</span>
                <span className="font-mono text-base font-bold text-purple-400">1.4 GB</span>
                <span className="text-[10px] text-slate-500 block">Structured evaluation scorecards</span>
              </div>
            </div>
          </div>

          {/* HACKATHON REPOSITORIES & STORAGE NODES LOG TABLE */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-white uppercase tracking-wider text-slate-300">
                Connected Project Repositories & Storage Nodes
              </h4>
              <span className="text-xs text-slate-400 font-mono">Showing 4 Active Node Streams</span>
            </div>

            <div className="overflow-x-auto rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-xs font-bold text-slate-400">
                    <th className="p-4">Project Submission</th>
                    <th className="p-4">Track</th>
                    <th className="p-4">Storage Node Location</th>
                    <th className="p-4">Code Repository</th>
                    <th className="p-4">Data Volume</th>
                    <th className="p-4">Sync Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
                  <tr className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-white">OmniPay ZK-Rollup Wallet</td>
                    <td className="p-4"><span className="px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-bold">Web3 & DeFi</span></td>
                    <td className="p-4 font-mono text-slate-400">us-east-aws-s3-node1</td>
                    <td className="p-4 font-mono text-indigo-400 hover:underline cursor-pointer">github.com/zk-architects/omnipay</td>
                    <td className="p-4 font-mono font-bold text-white">284 MB</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Synced & Verified
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-white">CodeGenix AI Assistant</td>
                    <td className="p-4"><span className="px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-bold">AI & Machine Learning</span></td>
                    <td className="p-4 font-mono text-slate-400">us-west-aws-s3-node2</td>
                    <td className="p-4 font-mono text-indigo-400 hover:underline cursor-pointer">github.com/devintel/codegenix</td>
                    <td className="p-4 font-mono font-bold text-white">1.4 GB</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Synced & Verified
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-white">HealthVision AI Diagnostic</td>
                    <td className="p-4"><span className="px-2.5 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-bold">Healthcare & BioTech</span></td>
                    <td className="p-4 font-mono text-slate-400">eu-central-aws-s3-node1</td>
                    <td className="p-4 font-mono text-indigo-400 hover:underline cursor-pointer">github.com/neuraldoc/healthvision</td>
                    <td className="p-4 font-mono font-bold text-white">620 MB</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Synced & Verified
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-white">EcoTrack Sustainability</td>
                    <td className="p-4"><span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold">Sustainability</span></td>
                    <td className="p-4 font-mono text-slate-400">ap-south-aws-s3-node1</td>
                    <td className="p-4 font-mono text-indigo-400 hover:underline cursor-pointer">github.com/greenbytes/ecotrack</td>
                    <td className="p-4 font-mono font-bold text-white">410 MB</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Synced & Verified
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: USERS */}
      {activeAdminTab === 'users' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-white">Platform User Roster</h3>
              <p className="text-xs text-slate-400">Manage registered accounts, roles, and status</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-xs font-bold text-slate-400">
                  <th className="p-4">User Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-white">{u.name}</td>
                    <td className="p-4 font-mono text-slate-400">{u.email}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">{u.joinedDate}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 8: PROJECT TEAM CREDITS (From PDF Brief) */}
      {activeAdminTab === 'team' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" /> Platform Engineering & Core Team
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Hackathon Central Project Brief & Specification Team Members</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Core Contributors
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { name: 'Shaik Ansar Ali', role: 'Full-Stack Developer & Lead', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', badge: 'Lead Architecture' },
              { name: 'KVS Bhavya Sri', role: 'UI/UX & Frontend Engineer', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80', badge: 'Design System' },
              { name: 'M Rohan Yaswanth', role: 'Backend & Systems Engineer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', badge: 'API & Storage' },
              { name: 'Shaik Roohi', role: 'QA & Security Moderation', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', badge: 'System Moderation' }
            ].map((member, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-xl flex flex-col items-center text-center space-y-3 hover:border-indigo-500/40 transition-all">
                <img src={member.avatar} alt={member.name} className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500/40 shadow-md" />
                <div>
                  <h4 className="font-extrabold text-white text-base">{member.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{member.role}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {member.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD JUDGE MODAL */}
      {showAddJudgeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-white text-base">Appoint New Judge</h3>
              <button onClick={() => setShowAddJudgeModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddJudge} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Alex Morgan"
                  value={judgeForm.name}
                  onChange={(e) => setJudgeForm({ ...judgeForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. alex@research.org"
                  value={judgeForm.email}
                  onChange={(e) => setJudgeForm({ ...judgeForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Expertise Domain</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Generative AI & Computer Vision"
                  value={judgeForm.expertise}
                  onChange={(e) => setJudgeForm({ ...judgeForm, expertise: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddJudgeModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md hover:bg-indigo-500"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD ORGANIZER MODAL */}
      {showAddOrganizerModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-white text-base">Add Verified Organizer</h3>
              <button onClick={() => setShowAddOrganizerModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddOrganizer} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Organizer Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elena Rostova"
                  value={organizerForm.name}
                  onChange={(e) => setOrganizerForm({ ...organizerForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Organization Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TechCorp AI Labs"
                  value={organizerForm.organization}
                  onChange={(e) => setOrganizerForm({ ...organizerForm, organization: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. elena@techcorp.ai"
                  value={organizerForm.email}
                  onChange={(e) => setOrganizerForm({ ...organizerForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddOrganizerModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-md hover:bg-purple-500"
                >
                  Grant Hosting Privileges
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
