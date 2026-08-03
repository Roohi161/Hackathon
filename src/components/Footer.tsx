import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Heart, X, BookOpen, Layers, Code, MessageSquare, HelpCircle, Building2, Briefcase, FileText, Mail, ShieldCheck, CheckCircle2, DollarSign } from 'lucide-react';
import type { UserRole } from '../types';

interface FooterProps {
  onOpenTeamModal?: () => void;
  onNavigate?: (tab: string, role?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTeamModal, onNavigate }) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleProductClick = (tab: string, role?: string) => {
    if (onNavigate) {
      onNavigate(tab, role);
    }
    if (role === 'organizer') navigate('/organizer');
    else if (role === 'judge') navigate('/judge');
    else if (role === 'admin') navigate('/admin');
    else if (tab === 'leaderboard') navigate('/leaderboard');
    else navigate('/hackathons');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-white border-t border-slate-200 mt-20 relative overflow-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-6 lg:col-span-2 pr-4">
            <div className="flex items-center gap-2 mb-2 cursor-pointer" onClick={() => handleProductClick('explore', 'participant')}>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-md">
                <Terminal className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-slate-900 tracking-tight">
                Hackathon<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Central</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm font-medium">
              The premier platform for hosting, discovering, and managing world-class hackathons. We connect top developers with innovative organizations.
            </p>
          </div>

          {/* Product Nav */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm tracking-wider uppercase mb-5">Product</h4>
            <ul className="space-y-3.5 text-sm font-medium text-slate-500">
              <li>
                <button onClick={() => handleProductClick('explore', 'participant')} className="hover:text-indigo-600 transition-colors text-left cursor-pointer">
                  Explore Hackathons
                </button>
              </li>
              <li>
                <button onClick={() => handleProductClick('create', 'organizer')} className="hover:text-indigo-600 transition-colors text-left cursor-pointer">
                  Host an Event
                </button>
              </li>
              <li>
                <button onClick={() => handleProductClick('leaderboard', 'participant')} className="hover:text-indigo-600 transition-colors text-left cursor-pointer">
                  Live Leaderboards
                </button>
              </li>
              <li>
                <button onClick={() => handleProductClick('grading', 'judge')} className="hover:text-indigo-600 transition-colors text-left cursor-pointer">
                  Judge Workspace
                </button>
              </li>
            </ul>
          </div>

          {/* Platform Nav */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm tracking-wider uppercase mb-5">Platform</h4>
            <ul className="space-y-3.5 text-sm font-medium text-slate-500">
              <li>
                <button onClick={() => setActiveModal('features')} className="hover:text-indigo-600 transition-colors text-left cursor-pointer">
                  Platform Features
                </button>
              </li>
              <li>
                <button onClick={() => setActiveModal('docs')} className="hover:text-indigo-600 transition-colors text-left cursor-pointer">
                  API & Documentation
                </button>
              </li>
              <li>
                <button onClick={() => setActiveModal('community')} className="hover:text-indigo-600 transition-colors text-left cursor-pointer">
                  Community Discord
                </button>
              </li>
              <li>
                <button onClick={() => setActiveModal('faq')} className="hover:text-indigo-600 transition-colors text-left cursor-pointer">
                  FAQ & Help Center
                </button>
              </li>
            </ul>
          </div>

          {/* Company Nav */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm tracking-wider uppercase mb-5">Company</h4>
            <ul className="space-y-3.5 text-sm font-medium text-slate-500">
              <li>
                <button onClick={onOpenTeamModal} className="hover:text-indigo-600 transition-colors text-left cursor-pointer font-bold text-indigo-600 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 fill-indigo-600 text-indigo-600" /> Platform Creators
                </button>
              </li>
              <li>
                <button onClick={() => setActiveModal('about')} className="hover:text-indigo-600 transition-colors text-left cursor-pointer">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => setActiveModal('careers')} className="hover:text-indigo-600 transition-colors text-left cursor-pointer">
                  Careers
                </button>
              </li>
              <li>
                <button onClick={() => setActiveModal('contact')} className="hover:text-indigo-600 transition-colors text-left cursor-pointer">
                  Contact Support
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-400">
          <p>© 2026 Hackathon Central Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => setActiveModal('privacy')} className="hover:text-slate-600 transition-colors">Privacy Policy</button>
            <button onClick={() => setActiveModal('terms')} className="hover:text-slate-600 transition-colors">Terms of Service</button>
            <button onClick={() => setActiveModal('security')} className="hover:text-slate-600 transition-colors">Security</button>
          </div>
        </div>
      </div>

      {/* Modal Dialogs */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-slate-900 mb-2 capitalize">{activeModal} Information</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              This feature or policy detail is managed live on the Hackathon Central platform.
            </p>
            <button onClick={() => setActiveModal(null)} className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors text-sm">
              Close
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};
