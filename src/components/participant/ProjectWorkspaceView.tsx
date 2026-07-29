import React, { useState } from 'react';
import {
  FolderCode,
  GitCommit,
  Upload,
  FileText,
  Video,
  CheckCircle2,
  ExternalLink,
  Lock
} from 'lucide-react';

export const ProjectWorkspaceView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'github' | 'files' | 'submission'>('overview');

  const [githubUrl, setGithubUrl] = useState('https://github.com/CyberPioneers/ai-code-studio');
  const [demoUrl, setDemoUrl] = useState('https://ai-code-studio.dev');
  const [videoUrl, setVideoUrl] = useState('https://youtube.com/watch?v=demo123');
  const [techStack, setTechStack] = useState('React, TypeScript, TailwindCSS, Express.js, PostgreSQL, OpenAI API');
  const [description, setDescription] = useState('Autonomous AI pairing assistant with live sandbox and multi-agent refactoring.');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const repoCommits = [
    { message: 'feat: add PostgreSQL vector database integration', author: 'Roohi', time: '2 hours ago', hash: '8f2a91b' },
    { message: 'fix: resolve dark theme text contrast on leaderboard', author: 'Ansar', time: '5 hours ago', hash: '3c1d94a' },
    { message: 'docs: update architecture diagram and setup guide', author: 'Bhavya', time: '1 day ago', hash: '7e8f12c' }
  ];

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    alert('Project submission locked and sent to evaluation panel!');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-2xs">
            <FolderCode className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">AI Code Studio Workspace</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-700">
                AI Hackathon 2026
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500">Repository connected • Ready for evaluation</p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200/80">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'overview' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('github')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'github' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FolderCode className="w-3.5 h-3.5" /> GitHub Sync
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'files' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-3.5 h-3.5" /> File Manager
          </button>
          <button
            onClick={() => setActiveTab('submission')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'submission' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Final Submit
          </button>
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3 md:col-span-2">
              <h3 className="text-base font-extrabold text-slate-900">Project Executive Summary</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {description}
              </p>
              <div className="pt-2 flex flex-wrap gap-2">
                {techStack.split(',').map((tech, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
                    {tech.trim()}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-extrabold text-slate-900">Submission Status</h3>
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <span className="text-xs font-extrabold text-emerald-900 block">Workspace Synchronized</span>
                <span className="text-[10px] font-semibold text-emerald-700 block">All criteria requirements met</span>
              </div>
              <button
                onClick={() => setActiveTab('submission')}
                className="w-full py-3 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md"
              >
                Go to Final Submission →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GITHUB INTEGRATION TAB */}
      {activeTab === 'github' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FolderCode className="w-6 h-6 text-slate-900" />
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Connected Repository</h3>
                  <a href={githubUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                    {githubUrl} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Synced Live
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-lg font-black text-slate-900 font-mono">42</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Commits</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-lg font-black text-slate-900 font-mono">3</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Active Branches</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-lg font-black text-slate-900 font-mono">5</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Contributors</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-lg font-black text-slate-900 font-mono">18</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Stars</span>
              </div>
            </div>

            <div className="space-y-3 pt-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Repository Commits</h4>
              {repoCommits.map((c, i) => (
                <div key={i} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <GitCommit className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="font-bold text-slate-800">{c.message}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500">
                    <span>{c.author}</span>
                    <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-bold">{c.hash}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FILE MANAGER TAB */}
      {activeTab === 'files' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-base font-extrabold text-slate-900">Project File Manager & Assets</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <FileText className="w-8 h-8 text-rose-500" />
              <div>
                <h4 className="text-xs font-extrabold text-slate-900">Architecture_Diagram.pdf</h4>
                <span className="text-[10px] font-bold text-slate-500">2.4 MB • PDF Document</span>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <FileText className="w-8 h-8 text-indigo-500" />
              <div>
                <h4 className="text-xs font-extrabold text-slate-900">Presentation_Slide.pptx</h4>
                <span className="text-[10px] font-bold text-slate-500">8.1 MB • PowerPoint</span>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <Video className="w-8 h-8 text-emerald-500" />
              <div>
                <h4 className="text-xs font-extrabold text-slate-900">Demo_Walkthrough.mp4</h4>
                <span className="text-[10px] font-bold text-slate-500">45.0 MB • Video MP4</span>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-2xl border-2 border-dashed border-slate-200 text-center space-y-2">
            <Upload className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs font-bold text-slate-700">Drag and drop additional assets (ZIP, PPT, PDF, MP4)</p>
            <span className="text-[10px] font-semibold text-slate-400 block">Maximum file size: 100 MB</span>
          </div>
        </div>
      )}

      {/* FINAL SUBMISSION FORM TAB */}
      {activeTab === 'submission' && (
        <form onSubmit={handleFinalSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Final Hackathon Project Submission</h3>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              Ensure all URLs and repositories are public and accessible to judges.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">GitHub Repository URL *</label>
              <input
                type="url"
                required
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Live Demo / Application Link</label>
                <input
                  type="url"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Video Demo Link (YouTube / Loom)</label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tech Stack & Frameworks</label>
              <input
                type="text"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Project Description & Problem Solved</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitted}
            className={`w-full py-3.5 rounded-xl font-bold text-xs text-white transition-all shadow-md flex items-center justify-center gap-2 ${
              isSubmitted
                ? 'bg-emerald-600 cursor-default'
                : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700'
            }`}
          >
            {isSubmitted ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> Submission Locked & Submitted!
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" /> Lock & Submit Final Project
              </>
            )}
          </button>
        </form>
      )}

    </div>
  );
};
