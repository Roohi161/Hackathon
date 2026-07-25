import React, { useState } from 'react';
import { X, UserPlus, Users, Key, Copy, Check, Sparkles } from 'lucide-react';
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
  const [joinCode, setJoinCode] = useState('');

  const [generatedTeam, setGeneratedTeam] = useState<Team | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName || !leaderName || !leaderEmail) return;

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
      members: [
        {
          id: `mem-1`,
          name: leaderName,
          email: leaderEmail,
          role: 'Team Leader'
        }
      ]
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg overflow-hidden glass-panel rounded-2xl border border-indigo-500/30 shadow-2xl">
        <div className="p-6">
          
          <div className="flex items-center justify-between pb-4 border-b border-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Team Registration</h3>
                <p className="text-xs text-gray-400">{hackathon.title}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {generatedTeam ? (
            <div className="py-6 space-y-6 text-center">
              <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-16 h-16 mx-auto flex items-center justify-center">
                <Check className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-xl font-bold text-white">Team Registered Successfully!</h4>
                <p className="text-xs text-gray-300 mt-1">
                  Share this unique invite code with your teammates to let them join:
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-900 border border-indigo-500/40 flex items-center justify-between">
                <span className="font-mono font-bold text-lg text-indigo-300 tracking-wider">
                  {generatedTeam.inviteCode}
                </span>
                <button
                  onClick={copyInviteCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl font-semibold text-xs text-white gradient-bg hover:opacity-90 transition-opacity"
              >
                Done & Return to Event
              </button>
            </div>
          ) : (
            <>
              {/* Tab Selector */}
              <div className="flex items-center gap-2 my-4 p-1 rounded-xl bg-gray-900/60 border border-white/5">
                <button
                  onClick={() => setTab('create')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                    tab === 'create'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Create New Team
                </button>
                <button
                  onClick={() => setTab('join')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                    tab === 'join'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Join via Code
                </button>
              </div>

              {tab === 'create' ? (
                <form onSubmit={handleCreateTeam} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Team Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CyberPioneers"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Leader Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Shaik Ansar Ali"
                      value={leaderName}
                      onChange={(e) => setLeaderName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Leader Email</label>
                    <input
                      type="email"
                      required
                      placeholder="ansar@hackathoncentral.io"
                      value={leaderEmail}
                      onChange={(e) => setLeaderEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 mt-2 rounded-xl font-semibold text-xs text-white gradient-bg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" /> Create Team & Generate Code
                  </button>
                </form>
              ) : (
                <form onSubmit={handleJoinTeam} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Enter Team Invite Code</label>
                    <div className="relative">
                      <Key className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. CYBER-2026"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                        className="w-full pl-9 pr-4 py-2 text-xs font-mono font-bold rounded-xl bg-gray-900 border border-gray-700 text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 tracking-wider"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 mt-2 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2"
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
