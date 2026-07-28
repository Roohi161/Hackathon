import React, { useState } from 'react';
import { X, UserPlus, Users, Key, Copy, Check, Sparkles, Plus, Trash2 } from 'lucide-react';
import type { Hackathon, Team } from '../../types';

interface TeamRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  hackathon: Hackathon;
  onRegisterTeam: (newTeam: Team) => void;
}

export const TeamRegistrationModal: React.FC<TeamRegistrationModalProps> = ({
  isOpen,
  onClose,
  hackathon,
  onRegisterTeam
}) => {
  const [tab, setTab] = useState<'create' | 'join'>('create');
  const [teamName, setTeamName] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [leaderEmail, setLeaderEmail] = useState('');
  
  // Additional team members state
  const [members, setMembers] = useState<{ name: string; email: string; role: string }[]>([
    { name: '', email: '', role: 'Developer' }
  ]);
  
  const [joinCode, setJoinCode] = useState('');
  const [generatedTeam, setGeneratedTeam] = useState<Team | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleAddMember = () => {
    if (members.length < 3) {
      setMembers([...members, { name: '', email: '', role: 'Developer' }]);
    }
  };

  const handleRemoveMember = (index: number) => {
    setMembers(members.filter((_, idx) => idx !== index));
  };

  const handleMemberChange = (index: number, field: 'name' | 'email' | 'role', value: string) => {
    const updated = [...members];
    updated[index][field] = value;
    setMembers(updated);
  };

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName || !leaderName || !leaderEmail) return;

    const validMembers = [
      { id: 'mem-leader', name: leaderName, email: leaderEmail, role: 'Team Leader' },
      ...members
        .filter(m => m.name && m.email)
        .map((m, idx) => ({
          id: `mem-${idx + 2}`,
          name: m.name,
          email: m.email,
          role: m.role || 'Member'
        }))
    ];

    const randomCode = `${teamName.substring(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTeam: Team = {
      id: `team-${Date.now()}`,
      name: teamName,
      leaderName,
      leaderEmail,
      inviteCode: randomCode,
      hackathonId: hackathon.id,
      status: 'Approved',
      registeredAt: new Date().toISOString(),
      members: validMembers
    };

    onRegisterTeam(newTeam);
    setGeneratedTeam(newTeam);
  };

  const handleJoinTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode) return;
    alert(`Successfully submitted request to join team with invite code: ${joinCode}`);
    onClose();
  };

  const copyInviteCode = () => {
    if (generatedTeam) {
      navigator.clipboard.writeText(generatedTeam.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl border border-slate-200 shadow-2xl">
        <div className="p-6 sm:p-8 space-y-6">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-xl tracking-tight">Team Registration</h3>
                <p className="text-xs font-semibold text-indigo-600 truncate max-w-xs">{hackathon.title}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {generatedTeam ? (
            <div className="py-6 space-y-6 text-center">
              <div className="p-4 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 w-16 h-16 mx-auto flex items-center justify-center shadow-md">
                <Check className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-xl font-extrabold text-slate-900 tracking-tight">Team Registered Successfully!</h4>
                <p className="text-xs font-medium text-slate-500 mt-1">
                  Your team <strong className="text-slate-900">{generatedTeam.name}</strong> ({generatedTeam.members.length} Members) has been registered for <strong className="text-indigo-600">{hackathon.title}</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between shadow-sm">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Unique Invite Code</span>
                  <span className="font-mono font-black text-xl text-indigo-600 tracking-wider">
                    {generatedTeam.inviteCode}
                  </span>
                </div>
                <button
                  onClick={copyInviteCode}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md active:scale-95"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-md transition-all active:scale-95"
              >
                Return to Dashboard
              </button>
            </div>
          ) : (
            <>
              {/* Tab Selector */}
              <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-100 border border-slate-200/80">
                <button
                  onClick={() => setTab('create')}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                    tab === 'create'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Create New Team
                </button>
                <button
                  onClick={() => setTab('join')}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                    tab === 'join'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Join via Code
                </button>
              </div>

              {tab === 'create' ? (
                <form onSubmit={handleCreateTeam} className="space-y-5">
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                      Team Leader Details
                    </h4>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Team Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. CyberPioneers"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Leader Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Shaik Ansar Ali"
                          value={leaderName}
                          onChange={(e) => setLeaderName(e.target.value)}
                          className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Leader Email *</label>
                        <input
                          type="email"
                          required
                          placeholder="ansar@hackathoncentral.io"
                          value={leaderEmail}
                          onChange={(e) => setLeaderEmail(e.target.value)}
                          className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Team Members List */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Additional Members ({members.length + 1} / 4 Total)
                      </h4>
                      {members.length < 3 && (
                        <button
                          type="button"
                          onClick={handleAddMember}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-xs font-bold transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Member
                        </button>
                      )}
                    </div>

                    {members.map((member, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 relative group">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700">Member #{idx + 2}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(idx)}
                            className="p-1 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <input
                            type="text"
                            placeholder="Full Name"
                            value={member.name}
                            onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 font-medium focus:border-indigo-500 outline-none"
                          />
                          <input
                            type="email"
                            placeholder="Email Address"
                            value={member.email}
                            onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 font-medium focus:border-indigo-500 outline-none"
                          />
                          <select
                            value={member.role}
                            onChange={(e) => handleMemberChange(idx, 'role', e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 font-medium focus:border-indigo-500 outline-none cursor-pointer"
                          >
                            <option value="Frontend">Frontend Dev</option>
                            <option value="Backend">Backend Dev</option>
                            <option value="AI/ML">AI / ML Engineer</option>
                            <option value="UI/UX Designer">UI/UX Designer</option>
                            <option value="Full-Stack">Full-Stack Dev</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 mt-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <UserPlus className="w-4 h-4" /> Complete Registration & Generate Code
                  </button>
                </form>
              ) : (
                <form onSubmit={handleJoinTeam} className="space-y-4 py-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Enter Team Invite Code *</label>
                    <div className="relative">
                      <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. CYBE-1234"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                        className="w-full pl-10 pr-4 py-2.5 text-xs font-mono font-extrabold rounded-xl bg-slate-50 border border-slate-200 text-indigo-600 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all tracking-wider"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 mt-2 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-md active:scale-95"
                  >
                    <Sparkles className="w-4 h-4" /> Join Team
                  </button>
                </form>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
};
