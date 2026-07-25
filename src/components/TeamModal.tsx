import React from 'react';
import { X, Award, Code, Sparkles, Globe } from 'lucide-react';
import { PROJECT_TEAM } from '../data/mockData';

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeamModal: React.FC<TeamModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl overflow-hidden glass-panel rounded-2xl border border-indigo-500/30 shadow-2xl">
        {/* Header decoration */}
        <div className="h-2 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />

        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between pb-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Project Engineering Team</h2>
                <p className="text-sm text-gray-400">Architects & Developers behind Hackathon Central</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {PROJECT_TEAM.map((member, index) => (
              <div
                key={index}
                className="group relative p-4 rounded-xl glass-card border border-white/10 hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500/30 group-hover:border-indigo-400 transition-colors shadow-md"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-base truncate group-hover:text-indigo-300 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-xs text-indigo-400 font-medium mt-0.5">{member.role}</p>
                    
                    <div className="flex items-center gap-3 mt-3">
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-400 hover:text-white transition-colors"
                        title="GitHub Profile"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                        </svg>
                      </a>
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-400 hover:text-indigo-400 transition-colors"
                        title="LinkedIn Profile"
                      >
                        <Globe className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/40 flex items-center justify-between text-xs text-gray-300">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Full-Stack Platform Specification & Execution</span>
            </div>
            <div className="flex items-center gap-1.5 text-indigo-400 font-mono">
              <Code className="w-3.5 h-3.5" />
              <span>v1.0.0-production</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
