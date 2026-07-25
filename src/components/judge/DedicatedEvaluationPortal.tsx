import React, { useState } from 'react';
import { Award, CheckCircle2, Clock, Eye, Filter } from 'lucide-react';
import type { ProjectSubmission, Hackathon } from '../../types';

interface DedicatedEvaluationPortalProps {
  submissions: ProjectSubmission[];
  hackathons: Hackathon[];
  onSelectSubmission: (submission: ProjectSubmission) => void;
}

export const DedicatedEvaluationPortal: React.FC<DedicatedEvaluationPortalProps> = ({
  submissions,
  hackathons,
  onSelectSubmission
}) => {
  const [selectedHackathonId, setSelectedHackathonId] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'evaluated'>('all');

  const filteredSubmissions = submissions.filter((s) => {
    const matchesHackathon = selectedHackathonId === 'all' || s.hackathonId === selectedHackathonId;
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'evaluated' && s.evaluated) ||
      (filterStatus === 'pending' && !s.evaluated);

    return matchesHackathon && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-amber-500/30">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">Dedicated Evaluation Portal</h2>
            <p className="text-xs text-gray-400">Review project submissions against configured rubrics</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Hackathon Selector */}
          <select
            value={selectedHackathonId}
            onChange={(e) => setSelectedHackathonId(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Hackathons</option>
            {hackathons.map((h) => (
              <option key={h.id} value={h.id}>
                {h.title}
              </option>
            ))}
          </select>

          {/* Status Selector */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 text-xs rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Evaluation Statuses</option>
            <option value="pending">⏳ Pending Review</option>
            <option value="evaluated">✅ Evaluated</option>
          </select>
        </div>
      </div>

      {/* Submissions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubmissions.length === 0 ? (
          <div className="col-span-full text-center py-16 glass-panel rounded-2xl text-gray-400">
            <Filter className="w-10 h-10 mx-auto mb-2 opacity-50 text-amber-400" />
            <p className="text-sm font-semibold">No assigned submissions match criteria.</p>
          </div>
        ) : (
          filteredSubmissions.map((submission) => (
            <div
              key={submission.id}
              className="p-5 rounded-2xl glass-panel glass-panel-hover border border-white/10 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    Track: {submission.track}
                  </span>
                  {submission.evaluated ? (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Evaluated
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-400">
                      <Clock className="w-3.5 h-3.5" /> Pending
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white line-clamp-1">{submission.title}</h3>
                <p className="text-xs text-gray-300 line-clamp-2">{submission.tagline}</p>
                <p className="text-[11px] text-gray-400">Team: <strong className="text-indigo-300">{submission.teamName}</strong></p>
              </div>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-1">
                {submission.techStack.slice(0, 3).map((t, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-gray-800 text-[10px] text-gray-300">
                    {t}
                  </span>
                ))}
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-gray-800 flex items-center justify-between">
                <div>
                  {submission.averageScore !== undefined && (
                    <span className="text-xs font-mono font-bold text-amber-300">
                      Score: {submission.averageScore.toFixed(1)}/100
                    </span>
                  )}
                </div>
                <button
                  onClick={() => onSelectSubmission(submission)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition-colors shadow-md"
                >
                  <Eye className="w-3.5 h-3.5" /> Evaluate Project
                </button>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
};
