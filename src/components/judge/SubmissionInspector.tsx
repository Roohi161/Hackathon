import React, { useState } from 'react';
import { ArrowLeft, Play, Code2, Award, CheckCircle2, ExternalLink } from 'lucide-react';
import type { ProjectSubmission, Hackathon, JudgeScore } from '../../types';

interface SubmissionInspectorProps {
  submission: ProjectSubmission;
  hackathon: Hackathon;
  onBack: () => void;
  onSaveScorecard: (submissionId: string, score: JudgeScore) => void;
}

export const SubmissionInspector: React.FC<SubmissionInspectorProps> = ({
  submission,
  hackathon,
  onBack,
  onSaveScorecard
}) => {
  const [judgeName, setJudgeName] = useState('Dr. Sarah Lin (Judge)');
  const [rubricScores, setRubricScores] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    hackathon.rubrics.forEach((r) => {
      initial[r.id] = 8.5; // default initial score slider value out of 10
    });
    return initial;
  });
  const [writtenFeedback, setWrittenFeedback] = useState(
    'Great project architecture, highly creative user workflow, and clean codebase organization.'
  );

  // Calculate weighted total out of 100
  const calculateWeightedTotal = () => {
    let total = 0;
    hackathon.rubrics.forEach((r) => {
      const scoreOutOf10 = rubricScores[r.id] || 0;
      total += (scoreOutOf10 / 10) * r.weight;
    });
    return total;
  };

  const handleSubmitScorecard = (e: React.FormEvent) => {
    e.preventDefault();

    const weightedTotal = calculateWeightedTotal();

    const scoreObj: JudgeScore = {
      judgeName,
      rubricScores,
      weightedTotal,
      feedback: writtenFeedback,
      evaluatedAt: new Date().toISOString()
    };

    onSaveScorecard(submission.id, scoreObj);
    alert(`Evaluation scorecard submitted! Weighted Total Score: ${weightedTotal.toFixed(1)} / 100`);
    onBack();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-900/60 hover:bg-gray-800 text-xs font-medium text-gray-300 border border-white/10 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Assigned Submissions
      </button>

      {/* Main Grid: Submission Preview vs Scorecard Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Video & GitHub Code Inspector (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Submission Info Header */}
          <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                Track: {submission.track}
              </span>
              <span className="text-xs text-gray-400 font-mono">Team: {submission.teamName}</span>
            </div>

            <h2 className="text-2xl font-extrabold text-white">{submission.title}</h2>
            <p className="text-xs text-gray-300 leading-relaxed">{submission.description}</p>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {submission.techStack.map((tech, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-gray-800 text-[11px] text-gray-300 font-medium border border-white/5">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Embedded Video Demo Player */}
          <div className="p-4 rounded-2xl glass-panel border border-amber-500/20 space-y-3">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <Play className="w-4 h-4 text-red-500 fill-current" /> Video Demo Embed Player
            </h4>
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-white/10 shadow-inner">
              <iframe
                src={submission.videoUrl}
                title={submission.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          {/* GitHub Inspector / Code Preview */}
          <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-gray-300 uppercase flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" /> Embedded GitHub Code Inspector
              </h4>
              <a
                href={submission.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
              >
                Repository <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="p-4 rounded-xl bg-gray-950 font-mono text-xs text-emerald-400 overflow-x-auto border border-gray-800">
              <pre>{submission.mockCodeSnippet || `// Key algorithm snippet\nfunction process() {\n  return "Execution complete";\n}`}</pre>
            </div>
          </div>

        </div>

        {/* Right Column: Interactive Scorecard Form (5 cols) */}
        <div className="lg:col-span-5">
          <form onSubmit={handleSubmitScorecard} className="p-6 rounded-3xl glass-panel border border-amber-500/30 space-y-6 sticky top-20 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-lg">Rubric Scorecard</h3>
                  <p className="text-xs text-gray-400">Score criteria from 0 to 10</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-gray-400 font-mono block">TOTAL SCORE</span>
                <span className="text-2xl font-extrabold text-amber-300 font-mono">
                  {calculateWeightedTotal().toFixed(1)}
                </span>
                <span className="text-xs text-gray-500 font-mono">/100</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Evaluating Judge Name</label>
              <input
                type="text"
                required
                value={judgeName}
                onChange={(e) => setJudgeName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
              />
            </div>

            {/* Criteria Sliders */}
            <div className="space-y-4 pt-2">
              {hackathon.rubrics.map((rubric) => {
                const currentVal = rubricScores[rubric.id] || 0;
                return (
                  <div key={rubric.id} className="p-4 rounded-xl bg-gray-900/70 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{rubric.name}</span>
                      <div className="flex items-center gap-1 font-mono">
                        <span className="text-amber-300 font-bold text-sm">{currentVal}</span>
                        <span className="text-gray-500 text-xs">/ 10</span>
                        <span className="text-[10px] text-indigo-400 ml-1">({rubric.weight}% wt)</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-gray-400">{rubric.description}</p>

                    <input
                      type="range"
                      min={0}
                      max={10}
                      step={0.5}
                      value={currentVal}
                      onChange={(e) =>
                        setRubricScores({ ...rubricScores, [rubric.id]: parseFloat(e.target.value) })
                      }
                      className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                    />
                  </div>
                );
              })}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Qualitative Written Feedback</label>
              <textarea
                rows={3}
                required
                value={writtenFeedback}
                onChange={(e) => setWrittenFeedback(e.target.value)}
                placeholder="Write specific constructive comments..."
                className="w-full p-3 text-xs rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-xs text-white bg-amber-600 hover:bg-amber-500 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <CheckCircle2 className="w-4 h-4" /> Save Scorecard & Submit Feedback
            </button>

          </form>
        </div>

      </div>
    </div>
  );
};
