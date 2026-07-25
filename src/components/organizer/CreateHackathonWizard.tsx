import React, { useState } from 'react';
import { PlusCircle, Trash2, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import type { Hackathon, ProblemStatement, RubricCriteria, PrizeItem } from '../../types';

interface CreateHackathonWizardProps {
  onCreateHackathon: (hackathon: Hackathon) => void;
  onCancel: () => void;
}

export const CreateHackathonWizard: React.FC<CreateHackathonWizardProps> = ({
  onCreateHackathon,
  onCancel
}) => {
  const [step, setStep] = useState<number>(1);

  // Step 1 State
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [banner, setBanner] = useState('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80');
  const [mode, setMode] = useState<'online' | 'hybrid' | 'in-person'>('online');
  const [location, setLocation] = useState('Global (Virtual)');
  const [prizePool, setPrizePool] = useState('$25,000');
  const [startDate] = useState('2026-08-01T09:00');
  const [endDate] = useState('2026-08-07T23:59');

  // Step 2 State - Problem Statements & Tracks
  const [tracksInput, setTracksInput] = useState('AI Agents, Full Stack, Web3');
  const [problemStatements, setProblemStatements] = useState<ProblemStatement[]>([
    {
      id: 'ps-new-1',
      track: 'AI Agents',
      title: 'Automated Code Review Agent',
      description: 'Build an autonomous assistant that reviews PRs and highlights security vulnerabilities.',
      difficulty: 'Intermediate'
    }
  ]);

  // Step 3 State - Prizes Breakdown
  const [prizes, setPrizes] = useState<PrizeItem[]>([
    { title: '🥇 1st Place Champion', amount: '$15,000', description: 'Grand prize + Vercel credits' },
    { title: '🥈 2nd Place Runner-Up', amount: '$10,000', description: 'Runner-up cash award' }
  ]);

  // Step 4 State - Judging Rubrics Configuration
  const [rubrics, setRubrics] = useState<RubricCriteria[]>([
    { id: 'rub-n-1', name: 'Innovation', description: 'Originality of concept', weight: 30 },
    { id: 'rub-n-2', name: 'Technical Depth', description: 'Code architecture and robustness', weight: 40 },
    { id: 'rub-n-3', name: 'UI / UX Design', description: 'User experience and polish', weight: 30 }
  ]);

  // Rubric weights sum check
  const totalWeight = rubrics.reduce((acc, curr) => acc + curr.weight, 0);

  const handleAddProblem = () => {
    setProblemStatements([
      ...problemStatements,
      {
        id: `ps-new-${Date.now()}`,
        track: 'General',
        title: 'New Challenge Title',
        description: 'Challenge description...',
        difficulty: 'All Levels'
      }
    ]);
  };

  const handleRemoveProblem = (id: string) => {
    setProblemStatements(problemStatements.filter((p) => p.id !== id));
  };

  const handleAddRubric = () => {
    setRubrics([
      ...rubrics,
      {
        id: `rub-new-${Date.now()}`,
        name: 'Custom Criterion',
        description: 'Description...',
        weight: 10
      }
    ]);
  };

  const handleRemoveRubric = (id: string) => {
    setRubrics(rubrics.filter((r) => r.id !== id));
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();

    if (totalWeight !== 100) {
      alert(`Judging Rubric weights must total exactly 100%. Current total: ${totalWeight}%`);
      return;
    }

    const newHackathon: Hackathon = {
      id: `hack-${Date.now()}`,
      title,
      tagline,
      banner,
      status: 'live',
      mode,
      location,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      prizePool,
      prizeBreakdown: prizes,
      tracks: tracksInput.split(',').map((t) => t.trim()),
      problemStatements,
      rubrics,
      schedule: [
        { time: 'Day 1', event: 'Hackathon Kickoff' },
        { time: 'Day 7', event: 'Project Submissions Due & Live Judging' }
      ],
      rules: ['All code must be open source.', 'Teams 1-4 members.'],
      organizerName: 'DevPulse Verified Organizer',
      organizerVerified: true,
      participantsCount: 0,
      teamsCount: 0
    };

    onCreateHackathon(newHackathon);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Wizard Header */}
      <div className="p-6 rounded-2xl glass-panel border border-purple-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">Step-by-Step Hackathon Creator Wizard</h2>
            <p className="text-xs text-gray-400">Configure problem statements, prize pool, and judging rubrics</p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="px-3 py-1.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-xs font-semibold text-gray-300 border border-white/10"
        >
          Cancel
        </button>
      </div>

      {/* Steps Indicator Bar */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { num: 1, label: 'Basic Info' },
          { num: 2, label: 'Tracks & Problems' },
          { num: 3, label: 'Prize Breakdown' },
          { num: 4, label: 'Judging Rubrics' }
        ].map((s) => (
          <div
            key={s.num}
            onClick={() => setStep(s.num)}
            className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
              step === s.num
                ? 'bg-purple-600/30 border-purple-500 text-white font-bold'
                : step > s.num
                ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-400'
                : 'bg-gray-900/40 border-white/5 text-gray-500'
            }`}
          >
            <span className="text-[10px] uppercase font-mono block">Step 0{s.num}</span>
            <span className="text-xs">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Wizard Step Content Form */}
      <form onSubmit={handleFinish} className="p-8 rounded-3xl glass-panel border border-white/10 space-y-6">
        
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-gray-800 pb-2">Step 1: General Information</h3>
            
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Hackathon Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Autonomous AI Hackathon 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Tagline & Core Objective</label>
              <input
                type="text"
                required
                placeholder="e.g. Build next-gen autonomous LLM agents..."
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Event Format / Mode</label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="online">Online / Virtual</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="in-person">In-Person</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Total Prize Pool Display</label>
                <input
                  type="text"
                  required
                  value={prizePool}
                  onChange={(e) => setPrizePool(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-bold text-amber-300"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Banner Image URL</label>
                <input
                  type="url"
                  required
                  value={banner}
                  onChange={(e) => setBanner(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 transition-colors flex items-center gap-2"
              >
                Next: Tracks & Problems <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-gray-800 pb-2">Step 2: Tracks & Problem Statements</h3>
            
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Tech Stack Tracks (comma separated)</label>
              <input
                type="text"
                value={tracksInput}
                onChange={(e) => setTracksInput(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-gray-300 uppercase">Problem Statements ({problemStatements.length})</h4>
                <button
                  type="button"
                  onClick={handleAddProblem}
                  className="px-3 py-1 rounded-lg bg-purple-950 text-purple-300 border border-purple-500/30 text-xs font-semibold hover:bg-purple-900"
                >
                  + Add Problem Statement
                </button>
              </div>

              {problemStatements.map((ps, idx) => (
                <div key={ps.id} className="p-4 rounded-xl glass-card border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-purple-400">Problem #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveProblem(ps.id)}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Title"
                      value={ps.title}
                      onChange={(e) => {
                        const updated = [...problemStatements];
                        updated[idx].title = e.target.value;
                        setProblemStatements(updated);
                      }}
                      className="px-3 py-1.5 text-xs rounded-lg bg-gray-900 border border-gray-700 text-white"
                    />
                    <input
                      type="text"
                      placeholder="Track"
                      value={ps.track}
                      onChange={(e) => {
                        const updated = [...problemStatements];
                        updated[idx].track = e.target.value;
                        setProblemStatements(updated);
                      }}
                      className="px-3 py-1.5 text-xs rounded-lg bg-gray-900 border border-gray-700 text-white"
                    />
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Problem description & objective..."
                    value={ps.description}
                    onChange={(e) => {
                      const updated = [...problemStatements];
                      updated[idx].description = e.target.value;
                      setProblemStatements(updated);
                    }}
                    className="w-full p-2 text-xs rounded-lg bg-gray-900 border border-gray-700 text-white"
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 bg-gray-900 border border-white/10 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 flex items-center gap-2"
              >
                Next: Prize Breakdown <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-gray-800 pb-2">Step 3: Prize Breakdown Configuration</h3>
            
            <div className="space-y-3">
              {prizes.map((p, idx) => (
                <div key={idx} className="p-4 rounded-xl glass-card border border-amber-500/20 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Prize Title (e.g. 1st Place)"
                    value={p.title}
                    onChange={(e) => {
                      const updated = [...prizes];
                      updated[idx].title = e.target.value;
                      setPrizes(updated);
                    }}
                    className="px-3 py-1.5 text-xs rounded-lg bg-gray-900 border border-gray-700 text-white font-bold"
                  />
                  <input
                    type="text"
                    placeholder="Amount (e.g. $15,000)"
                    value={p.amount}
                    onChange={(e) => {
                      const updated = [...prizes];
                      updated[idx].amount = e.target.value;
                      setPrizes(updated);
                    }}
                    className="px-3 py-1.5 text-xs rounded-lg bg-gray-900 border border-gray-700 text-amber-300 font-mono"
                  />
                  <input
                    type="text"
                    placeholder="Perks description..."
                    value={p.description || ''}
                    onChange={(e) => {
                      const updated = [...prizes];
                      updated[idx].description = e.target.value;
                      setPrizes(updated);
                    }}
                    className="px-3 py-1.5 text-xs rounded-lg bg-gray-900 border border-gray-700 text-gray-300"
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 bg-gray-900 border border-white/10 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 flex items-center gap-2"
              >
                Next: Judging Rubrics <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <h3 className="text-lg font-bold text-white">Step 4: Custom Judging Rubrics System</h3>
              <div className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${
                totalWeight === 100
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                Total Weight: {totalWeight}% / 100%
              </div>
            </div>

            <div className="space-y-4">
              <button
                type="button"
                onClick={handleAddRubric}
                className="px-3 py-1.5 rounded-lg bg-purple-950 text-purple-300 border border-purple-500/30 text-xs font-semibold hover:bg-purple-900"
              >
                + Add Custom Rubric Criterion
              </button>

              {rubrics.map((rub, idx) => (
                <div key={rub.id} className="p-4 rounded-xl glass-card border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-indigo-400">Criterion #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRubric(rub.id)}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Criterion Name"
                      value={rub.name}
                      onChange={(e) => {
                        const updated = [...rubrics];
                        updated[idx].name = e.target.value;
                        setRubrics(updated);
                      }}
                      className="px-3 py-1.5 text-xs rounded-lg bg-gray-900 border border-gray-700 text-white font-semibold"
                    />
                    <input
                      type="text"
                      placeholder="Guideline description"
                      value={rub.description}
                      onChange={(e) => {
                        const updated = [...rubrics];
                        updated[idx].description = e.target.value;
                        setRubrics(updated);
                      }}
                      className="px-3 py-1.5 text-xs rounded-lg bg-gray-900 border border-gray-700 text-gray-300"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={rub.weight}
                        onChange={(e) => {
                          const updated = [...rubrics];
                          updated[idx].weight = Number(e.target.value);
                          setRubrics(updated);
                        }}
                        className="w-20 px-3 py-1.5 text-xs rounded-lg bg-gray-900 border border-gray-700 text-indigo-300 font-mono font-bold text-center"
                      />
                      <span className="text-xs text-gray-400">% Weight</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-800">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 bg-gray-900 border border-white/10 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <button
                type="submit"
                className="px-8 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 shadow-xl shadow-purple-500/20 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Publish Hackathon Competition
              </button>
            </div>
          </div>
        )}

      </form>
    </div>
  );
};
