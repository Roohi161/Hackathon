import React, { useState } from 'react';
import {
  FolderCode,
  GitCommit,
  Upload,
  FileText,
  Video,
  CheckCircle2,
  ExternalLink,
  Lock,
  GitBranch,
  FileCode,
  GitPullRequest,
  AlertCircle,
  Activity,
  RefreshCw,
  Edit3,
  Award,
  Users,
  Layers,
  Code2,
  Clock,
  Sparkles,
  CheckSquare,
  X,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const ProjectWorkspaceView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'github' | 'files' | 'submission'>('overview');

  // Core Project & Repository Data
  const [projectName, setProjectName] = useState('AI Code Studio');
  const [teamName, setTeamName] = useState('Alpha Coders');
  const [githubUrl, setGithubUrl] = useState('https://github.com/CyberPioneers/ai-code-studio');
  const [demoUrl, setDemoUrl] = useState('https://ai-code-studio.dev');
  const [videoUrl, setVideoUrl] = useState('https://youtube.com/watch?v=demo123');
  const [techStack, setTechStack] = useState('React, TypeScript, TailwindCSS, Express.js, PostgreSQL, OpenAI API');
  const [description, setDescription] = useState('Autonomous AI pairing assistant with live sandbox and multi-agent refactoring.');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Repository Metrics
  const [primaryBranch, setPrimaryBranch] = useState('main');
  const [totalCommits, setTotalCommits] = useState(148);
  const [filesCount, setFilesCount] = useState(64);
  const [linesOfCode, setLinesOfCode] = useState(12850);
  const [openPRs, setOpenPRs] = useState(3);
  const [openIssues, setOpenIssues] = useState(2);
  const [lastCommitTime, setLastCommitTime] = useState('12 minutes ago');

  // Team Contributors
  const contributors = [
    { name: 'Roohi', role: 'Team Leader & DB Architect', avatar: 'R', commits: 52, email: 'roohi@hackathon.com' },
    { name: 'Ansar', role: 'AI & ML Engineer', avatar: 'A', commits: 44, email: 'ansar@hackathon.com' },
    { name: 'Bhavya', role: 'Frontend & UI Specialist', avatar: 'B', commits: 38, email: 'bhavya@hackathon.com' },
    { name: 'Participant User', role: 'Full Stack Hacker', avatar: 'P', commits: 14, email: 'participant@hackathon.com' }
  ];

  // Repository Commits Log
  const [repoCommits, setRepoCommits] = useState([
    { message: 'feat: add PostgreSQL vector database integration & embeddings API', author: 'Roohi', time: '12 minutes ago', hash: '8f2a91b' },
    { message: 'fix: resolve light/dark contrast and Sora typography hierarchy', author: 'Ansar', time: '2 hours ago', hash: '3c1d94a' },
    { message: 'docs: update README.md architecture diagram and setup guide', author: 'Bhavya', time: '5 hours ago', hash: '7e8f12c' },
    { message: 'chore: configure Vite build chunk optimization & typescript types', author: 'Participant User', time: '1 day ago', hash: '9b4d21e' }
  ]);

  // Modals State
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Form Temp States
  const [newRepoInput, setNewRepoInput] = useState(githubUrl);
  const [tempProjectName, setTempProjectName] = useState(projectName);
  const [tempDescription, setTempDescription] = useState(description);
  const [tempTechStack, setTempTechStack] = useState(techStack);

  // Submission Checklist Items & Status
  const checklistItems = [
    { id: 'c1', label: 'Repository Connected', isCompleted: !!githubUrl, details: githubUrl || 'Not linked' },
    { id: 'c2', label: 'Minimum Commits Requirement (>= 10)', isCompleted: totalCommits >= 10, details: `${totalCommits} commits logged` },
    { id: 'c3', label: 'Team Members Added', isCompleted: contributors.length > 0, details: `${contributors.length} active contributors` },
    { id: 'c4', label: 'Project Description Added', isCompleted: description.trim().length > 20, details: 'Description verified' },
    { id: 'c5', label: 'Technologies Added', isCompleted: techStack.trim().length > 5, details: '6 tech stack tags' },
    { id: 'c6', label: 'README Available', isCompleted: true, details: 'README.md synced' },
  ];

  const isSubmissionReady = checklistItems.every(item => item.isCompleted);

  // Action Handlers
  const handleSyncRepository = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setTotalCommits(totalCommits + 1);
      setLastCommitTime('Just now');
      setIsSyncing(false);
      alert('Repository successfully synchronized live with GitHub!');
    }, 1000);
  };

  const handleSaveConnectRepo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRepoInput.trim()) return;
    setGithubUrl(newRepoInput.trim());
    setIsConnectModalOpen(false);
    alert('Repository linked successfully!');
  };

  const handleSaveEditDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setProjectName(tempProjectName);
    setDescription(tempDescription);
    setTechStack(tempTechStack);
    setIsEditModalOpen(false);
    alert('Project details updated successfully!');
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSubmissionReady) {
      alert('Please complete all checklist items before locking submission!');
      return;
    }
    setIsSubmitted(true);
    alert('🎉 Congratulations! Project submission locked and sent to evaluation panel!');
  };

  return (
    <div className="space-y-6 animate-fadeIn relative z-10 pb-20">
      
      {/* HEADER BAR */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-2xs">
              <FolderCode className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-heading">{projectName}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {teamName}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                  isSubmitted ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  {isSubmitted ? 'Submitted & Locked' : 'Draft • Ready for Review'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal mt-0.5">
                Primary Branch: <code className="font-mono text-slate-700 font-bold bg-slate-100 px-1.5 py-0.5 rounded">{primaryBranch}</code> • Last Commit: <span className="font-semibold text-slate-700">{lastCommitTime}</span>
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSyncRepository}
              disabled={isSyncing}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Repo'}
            </button>
            
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit Details
            </button>

            <button
              onClick={() => setActiveTab('submission')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              Go to Final Submission <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-50 border border-slate-200/80 w-fit">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            Project Overview & Repo Info
          </button>
          <button
            onClick={() => setActiveTab('github')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'github' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <FolderCode className="w-3.5 h-3.5" /> GitHub Sync & Activity
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'files' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Upload className="w-3.5 h-3.5" /> Assets & Files
          </button>
          <button
            onClick={() => setActiveTab('submission')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'submission' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Submission Checklist & Submit
          </button>
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">

          {/* Top Repository Stats Bar (Commits, Lines, PRs, Issues, Contributors) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs text-center space-y-1 hover:border-indigo-200 transition-colors">
              <GitCommit className="w-5 h-5 text-indigo-600 mx-auto" />
              <span className="text-lg font-bold text-slate-900 font-mono block">{totalCommits}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Total Commits</span>
            </div>
            
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs text-center space-y-1 hover:border-indigo-200 transition-colors">
              <Code2 className="w-5 h-5 text-emerald-600 mx-auto" />
              <span className="text-lg font-bold text-slate-900 font-mono block">{linesOfCode.toLocaleString()}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Lines of Code</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs text-center space-y-1 hover:border-indigo-200 transition-colors">
              <FileCode className="w-5 h-5 text-violet-600 mx-auto" />
              <span className="text-lg font-bold text-slate-900 font-mono block">{filesCount}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Total Files</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs text-center space-y-1 hover:border-indigo-200 transition-colors">
              <GitPullRequest className="w-5 h-5 text-amber-600 mx-auto" />
              <span className="text-lg font-bold text-slate-900 font-mono block">{openPRs}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Pull Requests</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs text-center space-y-1 hover:border-indigo-200 transition-colors">
              <AlertCircle className="w-5 h-5 text-rose-600 mx-auto" />
              <span className="text-lg font-bold text-slate-900 font-mono block">{openIssues}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Issues</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs text-center space-y-1 hover:border-indigo-200 transition-colors">
              <Users className="w-5 h-5 text-sky-600 mx-auto" />
              <span className="text-lg font-bold text-slate-900 font-mono block">{contributors.length}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Contributors</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Main Details Card */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Project Executive Description */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900 font-heading">Project Description & Architecture</h3>
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {description}
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-700 block">Technologies & Frameworks Stack:</span>
                  <div className="flex flex-wrap gap-2">
                    {techStack.split(',').map((tech, i) => (
                      <span key={i} className="px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Connected Repository Card */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <FolderCode className="w-5 h-5 text-slate-900" />
                    <h3 className="text-base font-bold text-slate-900 font-heading">Connected GitHub Repository</h3>
                  </div>
                  <button
                    onClick={() => setIsConnectModalOpen(true)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all cursor-pointer"
                  >
                    Connect / Change Repo
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <a href={githubUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-indigo-600 hover:underline flex items-center gap-1.5">
                      {githubUrl} <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <p className="text-[11px] text-slate-500 font-mono">Branch: {primaryBranch} • Total Commits: {totalCommits}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> View Repository
                    </a>
                  </div>
                </div>
              </div>

              {/* Team Members & Contributors Card */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 font-heading border-b border-slate-100 pb-3">
                  Team Members & Code Contributors ({contributors.length})
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {contributors.map((c, i) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                          {c.avatar}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{c.name}</h4>
                          <span className="text-[10px] text-slate-500 font-medium block">{c.role}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100 font-mono">
                        {c.commits} commits
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Submission Checklist & Working Actions Card */}
            <div className="space-y-6">
              
              {/* Submission Checklist Card */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-base font-bold text-slate-900 font-heading">Submission Checklist</h3>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                    isSubmissionReady ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {isSubmissionReady ? '100% Ready' : 'In Progress'}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {checklistItems.map((item) => (
                    <div key={item.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          item.isCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                        }`}>
                          {item.isCompleted ? '✓' : '!'}
                        </span>
                        <div>
                          <span className="font-semibold text-slate-800 block leading-tight">{item.label}</span>
                          <span className="text-[10px] text-slate-400 font-normal block">{item.details}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Working Action Buttons Card */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-slate-900 font-heading border-b border-slate-100 pb-2">
                  Quick Working Actions
                </h3>

                <div className="space-y-2">
                  <button
                    onClick={() => setIsConnectModalOpen(true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2"><FolderCode className="w-4 h-4 text-indigo-400" /> Connect / Change Repo</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setIsActivityModalOpen(true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-xs font-semibold transition-all flex items-center justify-between border border-indigo-200 cursor-pointer"
                  >
                    <span className="flex items-center gap-2"><Activity className="w-4 h-4 text-indigo-600" /> View Recent Activity</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setIsEvaluationModalOpen(true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-900 text-xs font-semibold transition-all flex items-center justify-between border border-violet-200 cursor-pointer"
                  >
                    <span className="flex items-center gap-2"><Award className="w-4 h-4 text-violet-600" /> View Evaluation Criteria</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setActiveTab('submission')}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Go to Final Submission</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* GITHUB INTEGRATION & RECENT ACTIVITY TAB */}
      {activeTab === 'github' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <FolderCode className="w-6 h-6 text-slate-900" />
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-heading">GitHub Integration Details</h3>
                  <a href={githubUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1">
                    {githubUrl} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <button
                onClick={handleSyncRepository}
                disabled={isSyncing}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Sync Repo Now'}
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Repository Commits Log</h4>
              {repoCommits.map((c, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs hover:border-indigo-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <GitCommit className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900 block">{c.message}</span>
                      <span className="text-[10px] text-slate-400 font-mono">Committed by {c.author}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500">
                    <span className="text-[10px]">{c.time}</span>
                    <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-bold text-slate-700">{c.hash}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ASSETS & FILE MANAGER TAB */}
      {activeTab === 'files' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 font-heading">Project File Manager & Assets</h3>
            <span className="text-xs text-slate-500 font-mono">3 Uploaded Files</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <FileText className="w-8 h-8 text-rose-500" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Architecture_Diagram.pdf</h4>
                <span className="text-[10px] font-medium text-slate-500">2.4 MB • PDF Document</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <FileText className="w-8 h-8 text-indigo-500" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Presentation_Slide.pptx</h4>
                <span className="text-[10px] font-medium text-slate-500">8.1 MB • PowerPoint</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <Video className="w-8 h-8 text-emerald-500" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Demo_Walkthrough.mp4</h4>
                <span className="text-[10px] font-medium text-slate-500">45.0 MB • Video MP4</span>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-2xl border-2 border-dashed border-slate-200 text-center space-y-2">
            <Upload className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs font-bold text-slate-700">Drag and drop additional assets (ZIP, PPT, PDF, MP4)</p>
            <span className="text-[10px] font-normal text-slate-400 block">Maximum file size: 100 MB</span>
          </div>
        </div>
      )}

      {/* FINAL SUBMISSION TAB */}
      {activeTab === 'submission' && (
        <form onSubmit={handleFinalSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold text-slate-900 font-heading">Final Hackathon Project Submission</h3>
            <p className="text-xs text-slate-500 mt-1">
              Verify all checklist items and links before locking your final project submission for judges.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">GitHub Repository URL *</label>
              <input
                type="url"
                required
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Live Demo Link</label>
                <input
                  type="url"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Video Demo Link</label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tech Stack</label>
              <input
                type="text"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Project Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitted}
            className={`w-full py-3.5 rounded-xl font-bold text-xs text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
              isSubmitted
                ? 'bg-emerald-600 cursor-default'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isSubmitted ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> Submission Locked & Sent to Judges Panel!
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" /> Lock & Submit Final Project
              </>
            )}
          </button>
        </form>
      )}

      {/* MODAL 1: CONNECT / CHANGE REPOSITORY */}
      {isConnectModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-heading">Connect GitHub Repository</h3>
              <button onClick={() => setIsConnectModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveConnectRepo} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Repository URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/org/repo"
                  value={newRepoInput}
                  onChange={(e) => setNewRepoInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsConnectModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-xl hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 cursor-pointer"
                >
                  Connect Repository
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT PROJECT DETAILS */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-heading">Edit Project Details</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditDetails} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Project Name</label>
                <input
                  type="text"
                  required
                  value={tempProjectName}
                  onChange={(e) => setTempProjectName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Technologies Stack</label>
                <input
                  type="text"
                  value={tempTechStack}
                  onChange={(e) => setTempTechStack(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Description</label>
                <textarea
                  rows={3}
                  value={tempDescription}
                  onChange={(e) => setTempDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-xl hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 cursor-pointer"
                >
                  Save Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: VIEW RECENT ACTIVITY */}
      {isActivityModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-heading">Recent Repository Activity</h3>
              <button onClick={() => setIsActivityModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {repoCommits.map((c, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
                    <span>{c.author}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{c.time}</span>
                  </div>
                  <p className="text-xs text-slate-600 font-normal">{c.message}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsActivityModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
              >
                Close Activity Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: VIEW EVALUATION CRITERIA */}
      {isEvaluationModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-heading">Hackathon Evaluation Criteria</h3>
              <button onClick={() => setIsEvaluationModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                <strong className="block text-indigo-900">1. Innovation & Originality (30%)</strong>
                <span>Unique approach to problem solving and creative usage of AI models.</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <strong className="block text-emerald-900">2. Technical Execution & Code Quality (30%)</strong>
                <span>Clean repository commits, documentation, modular architecture, and stability.</span>
              </div>
              <div className="p-3 bg-violet-50 rounded-xl border border-violet-100">
                <strong className="block text-violet-900">3. UI/UX & Presentation (20%)</strong>
                <span>Polished user interface, intuitive flow, and effective demo video walkthrough.</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                <strong className="block text-amber-900">4. Impact & Completeness (20%)</strong>
                <span>Real-world applicability, working MVP features, and complete submission checklist.</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsEvaluationModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
