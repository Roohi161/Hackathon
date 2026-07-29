import React from 'react';
import { BookOpen, Code, FileText, Database, PlayCircle, ExternalLink } from 'lucide-react';

export const LearningCenterView: React.FC = () => {
  const resources = [
    { title: 'Full-Stack Hackathon Starter Template', category: 'Templates', icon: Code, color: 'text-indigo-600 bg-indigo-50' },
    { title: 'PostgreSQL & Vector Search Roadmap', category: 'Roadmaps', icon: Database, color: 'text-emerald-600 bg-emerald-50' },
    { title: 'OpenAI & Claude API Reference Cheat Sheet', category: 'API Ref', icon: FileText, color: 'text-violet-600 bg-violet-50' },
    { title: 'Building Autonomous Agent Swarms with Python', category: 'Courses', icon: PlayCircle, color: 'text-amber-600 bg-amber-50' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-2xs">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Participant Learning Center</h2>
            <p className="text-xs font-semibold text-slate-500">Tutorials, Datasets, Boilerplates, and API References</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {resources.map((res, idx) => {
          const Icon = res.icon;
          return (
            <div key={idx} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-slate-100 text-slate-700">
                  {res.category}
                </span>
                <div className={`p-2 rounded-xl ${res.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-sm font-extrabold text-slate-900">{res.title}</h3>
              <button className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                Access Resource <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
