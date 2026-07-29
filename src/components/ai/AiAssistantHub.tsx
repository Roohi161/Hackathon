import React, { useState } from 'react';
import {
  Sparkles,
  Lightbulb,
  FileText,
  UserPlus,
  Target,
  Download
} from 'lucide-react';

export const AiAssistantHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'idea' | 'resume' | 'match' | 'gap'>('idea');

  // AI Idea Gen State
  const [theme, setTheme] = useState('Generative AI & Autonomous Agents');
  const [ideas, setIdeas] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Skill Gap State
  const [userSkills, setUserSkills] = useState('React, TypeScript, Express.js');
  const [gapAnalysis, setGapAnalysis] = useState<{
    matchRate: number;
    missingSkills: string[];
    recommendedResources: string[];
  } | null>(null);

  const handleGenerateIdeas = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIdeas([
        '🤖 Agentic Pair Programmer: Autonomous IDE extension with real-time sandbox testing and multi-agent refactoring.',
        '🏥 MedVision AI: Multimodal agent that analyzes radiology X-rays and auto-generates HIPAA-compliant diagnostic summaries.',
        '⚡ FinTech Shield: Lattice-based quantum cryptographic vault for automated high-frequency DeFi trading.'
      ]);
      setIsGenerating(false);
    }, 1000);
  };

  const handleAnalyzeSkillGap = () => {
    setGapAnalysis({
      matchRate: 75,
      missingSkills: ['PostgreSQL Vector (pgvector)', 'OpenAI Embeddings API'],
      recommendedResources: [
        'PostgreSQL Vector Search Tutorial (Learning Center)',
        'OpenAI API Client Quickstart Guide'
      ]
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-800 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-extrabold border border-white/30">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Hackathon Central AI Suite
          </div>
          <h2 className="text-2xl font-black tracking-tight">AI Copilot & Smart Assistant</h2>
          <p className="text-xs font-medium text-indigo-100 max-w-xl">
            Supercharge your hackathon participation with AI-driven project idea generation, team matching, skill gap analysis, and automated resume building.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shrink-0">
          <button
            onClick={() => setActiveTab('idea')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'idea' ? 'bg-white text-indigo-700 shadow-md' : 'text-white hover:bg-white/10'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" /> Idea Assistant
          </button>
          <button
            onClick={() => setActiveTab('resume')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'resume' ? 'bg-white text-indigo-700 shadow-md' : 'text-white hover:bg-white/10'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Resume Builder
          </button>
          <button
            onClick={() => setActiveTab('match')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'match' ? 'bg-white text-indigo-700 shadow-md' : 'text-white hover:bg-white/10'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" /> Team Matcher
          </button>
          <button
            onClick={() => setActiveTab('gap')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'gap' ? 'bg-white text-indigo-700 shadow-md' : 'text-white hover:bg-white/10'
            }`}
          >
            <Target className="w-3.5 h-3.5" /> Skill Gap
          </button>
        </div>
      </div>

      {/* 1. AI PROJECT IDEA ASSISTANT */}
      {activeTab === 'idea' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" /> AI Project Idea Generator & Tech Stack Recommender
            </h3>
            <p className="text-xs font-medium text-slate-500">
              Input a hackathon track or theme to receive AI-generated project concepts with recommended tech stacks.
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="e.g. AI, FinTech, HealthTech, Cybersecurity..."
              className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-indigo-500 outline-none"
            />
            <button
              onClick={handleGenerateIdeas}
              disabled={isGenerating}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 shrink-0"
            >
              <Sparkles className="w-4 h-4" /> {isGenerating ? 'Generating...' : 'Generate Project Ideas'}
            </button>
          </div>

          {ideas.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">AI Suggested Project Concepts</h4>
              {ideas.map((idea, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <p className="text-xs font-bold text-slate-800 leading-relaxed">{idea}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. AI RESUME BUILDER */}
      {activeTab === 'resume' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" /> Automated AI Resume & Hackathon Portfolio Builder
            </h3>
            <p className="text-xs font-medium text-slate-500">
              Automatically compiles your completed hackathons, project submissions, team leadership roles, and badges into a resume for recruiters.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h4 className="text-base font-black text-slate-900">Roohi — Level 5 Full-Stack Developer</h4>
                <span className="text-xs font-semibold text-slate-500">3 Hackathons Completed • 4 Digital Certificates Verified</span>
              </div>
              <button
                onClick={() => alert('Downloading AI-Generated Hackathon Resume PDF...')}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Download className="w-3.5 h-3.5" /> Download Resume PDF
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <h5 className="font-bold text-slate-800 uppercase tracking-wider">Highlighted Hackathon Accomplishments</h5>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 space-y-1">
                <span className="font-extrabold text-indigo-600">AI Code Studio (1st Place Winner - AI Hackathon 2026)</span>
                <p className="text-slate-600 font-medium">Built autonomous AI pair programming assistant with live sandbox and PostgreSQL vector search integration.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. AI TEAM MATCHER */}
      {activeTab === 'match' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-emerald-600" /> Smart AI Teammate Matchmaker
            </h3>
            <p className="text-xs font-medium text-slate-500">
              Matches you with participants based on complementary skills, timezone, and project track interests.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Alex Rivera', role: 'Frontend & UI/UX Specialist', match: '98% Compatibility', skills: ['React', 'TailwindCSS', 'Figma'] },
              { name: 'Elena Rostova', role: 'Data Scientist & AI Researcher', match: '94% Compatibility', skills: ['Python', 'PyTorch', 'FastAPI'] }
            ].map((match, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-extrabold text-slate-900">{match.name}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800">
                      {match.match}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-500">{match.role}</span>
                  <div className="flex gap-1.5 pt-1">
                    {match.skills.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-white text-[10px] font-bold text-slate-700 border border-slate-200">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => alert(`Sent team invite request to ${match.name}!`)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all shrink-0"
                >
                  Send Team Invite
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. AI SKILL GAP ANALYSIS */}
      {activeTab === 'gap' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-violet-600" /> AI Skill Gap Analysis
            </h3>
            <p className="text-xs font-medium text-slate-500">
              Compare your profile skills against hackathon requirements to identify learning resources before submission deadlines.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Core Tech Stack</label>
              <input
                type="text"
                value={userSkills}
                onChange={(e) => setUserSkills(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium outline-none"
              />
            </div>

            <button
              onClick={handleAnalyzeSkillGap}
              className="px-5 py-2.5 rounded-xl bg-violet-600 text-white text-xs font-bold shadow-md hover:bg-violet-700 transition-all"
            >
              Analyze Skill Alignment
            </button>

            {gapAnalysis && (
              <div className="p-5 rounded-2xl bg-violet-50/50 border border-violet-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800">Hackathon Requirement Match Score</span>
                  <span className="text-violet-700 font-mono text-sm">{gapAnalysis.matchRate}%</span>
                </div>
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Recommended Learning Focus:</span>
                  <ul className="text-xs text-slate-700 space-y-1 font-medium list-disc pl-4">
                    {gapAnalysis.recommendedResources.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
