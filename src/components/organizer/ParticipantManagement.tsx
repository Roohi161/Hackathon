import React, { useState } from 'react';
import { Users, Search, Download, Mail } from 'lucide-react';
import type { Team } from '../../types';

interface ParticipantManagementProps {
  teams: Team[];
  onUpdateTeamStatus: (teamId: string, status: 'Approved' | 'Rejected') => void;
}

export const ParticipantManagement: React.FC<ParticipantManagementProps> = ({
  teams,
  onUpdateTeamStatus
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredTeams = teams.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.leaderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.inviteCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportCSV = () => {
    const headers = ['Team ID', 'Team Name', 'Leader Name', 'Leader Email', 'Invite Code', 'Status', 'Members Count'];
    const rows = filteredTeams.map((t) => [
      t.id,
      `"${t.name}"`,
      `"${t.leaderName}"`,
      t.leaderEmail,
      t.inviteCode,
      t.status,
      t.members.length
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `hackathon_participants_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-purple-500/20">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">Participant & Team Management</h2>
            <p className="text-xs text-gray-400">Review registrations, manage statuses, and export participant data</p>
          </div>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-colors"
        >
          <Download className="w-4 h-4" /> Export CSV Roster
        </button>
      </div>

      {/* Filter & Search */}
      <div className="p-4 rounded-2xl glass-panel border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by team name or leader..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Registrations ({teams.length})</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending Review</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl glass-panel border border-white/10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-950/60 text-xs font-semibold text-gray-400">
              <th className="p-4">Team Name</th>
              <th className="p-4">Leader & Email</th>
              <th className="p-4">Invite Code</th>
              <th className="p-4">Members</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 text-xs">
            {filteredTeams.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-500">
                  No matching registered teams found.
                </td>
              </tr>
            ) : (
              filteredTeams.map((team) => (
                <tr key={team.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-white">
                    {team.name}
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-white">{team.leaderName}</div>
                    <div className="text-[11px] text-gray-400 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-purple-400" /> {team.leaderEmail}
                    </div>
                  </td>
                  <td className="p-4 font-mono font-bold text-purple-300">
                    {team.inviteCode}
                  </td>
                  <td className="p-4 text-gray-300">
                    {team.members.length} members
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                      team.status === 'Approved'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : team.status === 'Pending'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {team.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {team.status !== 'Approved' && (
                      <button
                        onClick={() => onUpdateTeamStatus(team.id, 'Approved')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-[11px] font-semibold transition-colors"
                      >
                        Approve
                      </button>
                    )}
                    {team.status !== 'Rejected' && (
                      <button
                        onClick={() => onUpdateTeamStatus(team.id, 'Rejected')}
                        className="px-2.5 py-1 rounded-lg bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 text-[11px] font-semibold transition-colors"
                      >
                        Reject
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
