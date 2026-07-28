import React, { useState } from 'react';
import { Trophy, Award, ExternalLink, MessageSquare } from 'lucide-react';
import type { ProjectSubmission, Hackathon } from '../../types';

interface LeaderboardViewProps {
  submissions: ProjectSubmission[];
  hackathons: Hackathon[];
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ submissions, hackathons }) => {
  const [selectedHackathonId, setSelectedHackathonId] = useState<string>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<ProjectSubmission | null>(null);

  const filteredSubmissions = submissions
    .filter((s) => selectedHackathonId === 'all' || s.hackathonId === selectedHackathonId)
    .sort((a, b) => (b.averageScore || 0) - (a.averageScore || 0));

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return (
          <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 font-black text-sm border border-amber-300 flex items-center justify-center shadow-md shadow-amber-200 shrink-0">
            🥇 1
          </span>
        );
      case 1:
        return (
          <span className="w-10 h-10 rounded-2xl bg-slate-200 text-slate-700 font-black text-sm border border-slate-300 flex items-center justify-center shadow-2xs shrink-0">
            🥈 2
          </span>
        );
      case 2:
        return (
          <span className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 font-black text-sm border border-amber-200 flex items-center justify-center shadow-2xs shrink-0">
            🥉 3
          </span>
        );
      default:
        return (
          <span className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-600 font-bold text-xs border border-slate-200 flex items-center justify-center shrink-0">
            #{index + 1}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 shadow-xs">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Live Leaderboard & Winners Gallery</h2>
            <p className="text-xs font-semibold text-slate-500">Scored live by assigned evaluation panel</p>
          </div>
        </div>

        {/* Hackathon Filter Selector */}
        <select
          value={selectedHackathonId}
          onChange={(e) => setSelectedHackathonId(e.target.value)}
          className="px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-2xs"
        >
          <option value="all">All Hackathons</option>
          {hackathons.map((h) => (
            <option key={h.id} value={h.id}>
              {h.title}
            </option>
          ))}
        </select>
      </div>

      {/* Leaderboard Table Grid */}
      <div className="space-y-4">
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 text-slate-400 shadow-xs">
            <Award className="w-10 h-10 mx-auto mb-2 text-amber-500" />
            <p className="text-sm font-bold text-slate-800">No evaluated project submissions found.</p>
            <p className="text-xs text-slate-500 mt-1">Scores will appear here live as judges evaluate projects.</p>
          </div>
        ) : (
          filteredSubmissions.map((submission, index) => (
            <div
              key={submission.id}
              className={`p-6 rounded-3xl transition-all duration-300 ${
                index === 0
                  ? 'bg-amber-50/50 border-2 border-amber-300 shadow-lg shadow-amber-100/60'
                  : 'bg-white border border-slate-200 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                
                {/* Left Rank & Project Title */}
                <div className="flex items-center gap-4 min-w-0">
                  {getRankBadge(index)}

                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-extrabold text-slate-900 truncate">{submission.title}</h3>
                      <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {submission.track}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium line-clamp-1">{submission.tagline}</p>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 font-medium">
                      <span>Team: <strong className="text-indigo-600 font-bold">{submission.teamName}</strong></span>
                      <span>•</span>
                      <span>Members: {submission.members.join(', ')}</span>
                    </div>
                  </div>
                </div>

                {/* Score & Feedback Trigger */}
                <div className="flex items-center gap-6 self-end md:self-center shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Judge Score</span>
                    <div className="flex items-baseline justify-end gap-1">
                      <span className="text-2xl font-black text-amber-600 font-mono">
                        {submission.averageScore ? submission.averageScore.toFixed(1) : 'Pending'}
                      </span>
                      <span className="text-xs text-slate-400 font-mono font-bold">/ 100</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedSubmission(submission)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> View Feedback
                  </button>
                </div>

              </div>
            </div>
          ))
        )}
      </div>

      {/* Feedback Modal Detail */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-2xl">
            <div className="p-6 sm:p-8 space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-xl tracking-tight">{selectedSubmission.title}</h3>
                  <p className="text-xs font-bold text-indigo-600">Team {selectedSubmission.teamName}</p>
                </div>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Evaluation Scores & Remarks</span>
                  {selectedSubmission.scores.length === 0 ? (
                    <p className="text-xs text-slate-500 font-medium">No written evaluation remarks submitted yet.</p>
                  ) : (
                    selectedSubmission.scores.map((score, i) => (
                      <div key={i} className="space-y-2 pt-3 border-t border-slate-200/80 first:border-0 first:pt-0">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-900">{score.judgeName}</span>
                          <span className="font-mono text-amber-600 font-bold">{score.weightedTotal.toFixed(1)} / 100</span>
                        </div>
                        <p className="text-xs text-slate-700 font-medium italic bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                          "{score.feedback}"
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 text-xs font-bold">
                  <a
                    href={selectedSubmission.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 hover:underline"
                  >
                    View GitHub Repository <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
