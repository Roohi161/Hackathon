import React, { useState } from 'react';
import { X, Video, Code2, Tag, Send } from 'lucide-react';
import type { Hackathon, ProjectSubmission } from '../../types';

interface ProjectSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  hackathon: Hackathon;
  onSubmitProject: (submission: ProjectSubmission) => void;
}

export const ProjectSubmissionModal: React.FC<ProjectSubmissionModalProps> = ({
  isOpen,
  onClose,
  hackathon,
  onSubmitProject
}) => {
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [repoUrl, setRepoUrl] = useState('https://github.com/hackathon-team/project-demo');
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/embed/dQw4w9WgXcQ');
  const [teamName, setTeamName] = useState('CyberPioneers');
  const [track, setTrack] = useState(hackathon.tracks[0] || 'General');
  const [techInput, setTechInput] = useState('Next.js, TypeScript, Tailwind CSS, WebSockets');
  const [codeSnippet, setCodeSnippet] = useState(
    `// Core Implementation Snippet\nexport async function evaluateSubmission(submissionId) {\n  const scores = await runRubricPipeline(submissionId);\n  return scores;\n}`
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !repoUrl) return;

    const techStackArray = techInput.split(',').map((t) => t.trim()).filter(Boolean);

    const newSubmission: ProjectSubmission = {
      id: `sub-${Date.now()}`,
      hackathonId: hackathon.id,
      hackathonTitle: hackathon.title,
      title,
      tagline,
      description,
      repoUrl,
      videoUrl,
      techStack: techStackArray,
      teamName,
      members: ['Shaik Ansar Ali', 'KVS Bhavya Sri', 'M Rohan Yaswanth', 'Shaik Roohi'],
      track,
      submittedAt: new Date().toISOString(),
      scores: [],
      evaluated: false,
      mockCodeSnippet: codeSnippet
    };

    onSubmitProject(newSubmission);
    alert('Project submission successful! Judges will review your project on the evaluation portal.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 overflow-hidden glass-panel rounded-2xl border border-indigo-500/30 shadow-2xl">
        <div className="p-6">
          
          <div className="flex items-center justify-between pb-4 border-b border-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Submit Project Demo</h3>
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

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Antigravity Code Studio"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Team Name</label>
                <input
                  type="text"
                  required
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Catchy Tagline</label>
              <input
                type="text"
                required
                placeholder="e.g. Autonomous AI pairing assistant with live sandbox..."
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1 flex items-center gap-1">
                  Public GitHub Repository URL
                </label>
                <input
                  type="url"
                  required
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1 flex items-center gap-1">
                  <Video className="w-3.5 h-3.5 text-red-400" /> Video Demo Embed URL
                </label>
                <input
                  type="url"
                  required
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Select Track</label>
                <select
                  value={track}
                  onChange={(e) => setTrack(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {hackathon.tracks.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-indigo-400" /> Tech Stack Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Detailed Description & Architecture</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain your technical architecture, problems solved, and unique features..."
                className="w-full px-3 py-2 text-xs rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1 flex items-center gap-1">
                <Code2 className="w-3.5 h-3.5 text-indigo-400" /> Key Code Snippet for Judge Preview
              </label>
              <textarea
                rows={3}
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                className="w-full p-3 text-xs font-mono rounded-xl bg-gray-950 border border-gray-800 text-emerald-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold text-xs text-white gradient-bg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              <Send className="w-4 h-4" /> Submit Entry to Evaluation Portal
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};
