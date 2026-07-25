import React from 'react';
import { Terminal, Heart, Code2, Shield, ExternalLink } from 'lucide-react';
import { PROJECT_TEAM } from '../data/mockData';

interface FooterProps {
  onOpenTeamModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTeamModal }) => {
  return (
    <footer className="w-full glass-panel border-t border-white/10 mt-20 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg gradient-bg text-white">
                <Terminal className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-white">Hackathon Central</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              A modern full-stack web application designed to streamline hackathon publishing, team creation, submission evaluation, and live leaderboards.
            </p>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Platform Roles</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-indigo-400 transition-colors">Participant Discovery & Submissions</span></li>
              <li><span className="hover:text-indigo-400 transition-colors">Organizer Step-by-Step Wizard</span></li>
              <li><span className="hover:text-indigo-400 transition-colors">Judge Evaluation Portal & Rubrics</span></li>
              <li><span className="hover:text-indigo-400 transition-colors">Admin Security & Verified Hosts</span></li>
            </ul>
          </div>

          {/* Tech Stack Spec */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Tech Architecture</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5"><Code2 className="w-3.5 h-3.5 text-indigo-400" /> Next.js / React (TypeScript v5+)</li>
              <li className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-indigo-400" /> NestJS API & Prisma ORM</li>
              <li className="flex items-center gap-1.5"><ExternalLink className="w-3.5 h-3.5 text-indigo-400" /> PostgreSQL & Socket.IO</li>
            </ul>
          </div>

          {/* Team Members List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-white text-sm">Engineering Team</h4>
              <button
                onClick={onOpenTeamModal}
                className="text-[11px] text-indigo-400 hover:underline font-medium"
              >
                View Details
              </button>
            </div>
            <div className="space-y-1.5 text-xs text-gray-300 font-medium">
              {PROJECT_TEAM.map((member, idx) => (
                <div key={idx} className="flex items-center justify-between p-1.5 rounded-lg bg-gray-900/40 border border-white/5">
                  <span className="truncate">{member.name}</span>
                  <span className="text-[10px] text-gray-500 font-mono">Dev</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 Hackathon Central. Designed and engineered for Hackathon Management.</p>
          <div className="flex items-center gap-1 text-gray-400">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
            <span>by Shaik Ansar Ali, KVS Bhavya Sri, M Rohan Yaswanth & Shaik Roohi</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
