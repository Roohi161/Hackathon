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
          <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-sm border border-amber-500/40 flex items-center justify-center shadow-lg shadow-amber-500/20">
            🥇 1
          </span>
        );
      case 1:
        return (
          <span className="w-8 h-8 rounded-full bg-gray-400/20 text-gray-200 font-extrabold text-sm border border-gray-400/40 flex items-center justify-center">
            🥈 2
          </span>
        );
      case 2:
        return (
          <span className="w-8 h-8 rounded-full bg-amber-700/20 text-amber-600 font-extrabold text-sm border border-amber-700/40 flex items-center justify-center">
            🥉 3
          </span>
        );
      default:
        return (
          <span className="w-8 h-8 rounded-full bg-gray-900 text-gray-400 font-semibold text-xs border border-white/10 flex items-center justify-center">
            #{index + 1}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-amber-500/20">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">Live Leaderboard & Winners Gallery</h2>
            <p className="text-xs text-gray-400">Scored live by assigned evaluation panel</p>
          </div>
        </div>

        {/* Hackathon Filter Selector */}
        <select
          value={selectedHackathonId}
          onChange={(e) => setSelectedHackathonId(e.target.value)}
          className="px-4 py-2 text-xs rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
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
          <div className="text-center py-16 glass-panel rounded-2xl text-gray-400">
            <Award className="w-10 h-10 mx-auto mb-2 opacity-50 text-amber-400" />
            <p className="text-sm font-semibold">No evaluated project submissions found.</p>
          </div>
        ) : (
          filteredSubmissions.map((submission, index) => (
            <div
              key={submission.id}
              className={`p-5 rounded-2xl glass-panel border transition-all duration-300 ${
                index === 0
                  ? 'border-amber-500/40 bg-amber-950/20 shadow-xl shadow-amber-500/10'
                  : 'border-white/10 hover:border-indigo-500/30'
              }`}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                
                {/* Left Rank & Project Title */}
                <div className="flex items-center gap-4 min-w-0">
                  {getRankBadge(index)}

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white truncate">{submission.title}</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {submission.track}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 line-clamp-1">{submission.tagline}</p>
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
                      <span>Team: <strong className="text-indigo-400">{submission.teamName}</strong></span>
                      <span>•</span>
                      <span>Members: {submission.members.join(', ')}</span>
                    </div>
                  </div>
                </div>

                {/* Score & Feedback Trigger */}
                <div className="flex items-center gap-6 self-end md:self-center">
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider block">Judge Score</span>
                    <div className="flex items-baseline justify-end gap-1">
                      <span className="text-2xl font-extrabold text-amber-300 font-mono">
                        {submission.averageScore ? submission.averageScore.toFixed(1) : 'Pending'}
                      </span>
                      <span className="text-xs text-gray-500 font-mono">/ 100</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedSubmission(submission)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 border border-white/10 text-xs text-indigo-300 font-semibold transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl overflow-hidden glass-panel rounded-2xl border border-indigo-500/30 shadow-2xl">
            <div className="p-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-gray-800">
                <div>
                  <h3 className="font-bold text-white text-lg">{selectedSubmission.title}</h3>
                  <p className="text-xs text-indigo-400">Team {selectedSubmission.teamName}</p>
                </div>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
                >
                  ✕
                </button>
              </div>

              <div className="py-4 space-y-4">
                <div className="p-4 rounded-xl bg-gray-900/60 border border-white/5 space-y-2">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Evaluation Scores & Remarks</span>
                  {selectedSubmission.scores.length === 0 ? (
                    <p className="text-xs text-gray-400">No written evaluation remarks submitted yet.</p>
                  ) : (
                    selectedSubmission.scores.map((score, i) => (
                      <div key={i} className="space-y-2 pt-2 border-t border-gray-800">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white">{score.judgeName}</span>
                          <span className="font-mono text-amber-400 font-bold">{score.weightedTotal.toFixed(1)} / 100</span>
                        </div>
                        <p className="text-xs text-gray-300 italic bg-gray-950/50 p-3 rounded-lg border border-white/5">
                          "{score.feedback}"
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 text-xs">
                  <a
                    href={selectedSubmission.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-indigo-400 hover:underline"
                  >
                    View GitHub Repository <ExternalLink className="w-3 h-3" />
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
