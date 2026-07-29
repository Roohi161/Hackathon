import React, { useState } from 'react';
import { Terminal, Heart, X, BookOpen, Layers, Code, MessageSquare, HelpCircle, Building2, Briefcase, FileText, Mail, ShieldCheck, CheckCircle2, DollarSign } from 'lucide-react';
import type { UserRole } from '../types';

interface FooterProps {
  onOpenTeamModal?: () => void;
  onNavigate?: (tab: string, role: UserRole) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTeamModal, onNavigate }) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleProductClick = (tab: string, role: UserRole) => {
    if (onNavigate) {
      onNavigate(tab, role);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-white border-t border-slate-200 mt-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
                <button onClick={() => handleProductClick('explore', 'participant')} className="hover:text-indigo-600 transition-colors text-left">
                  Explore Hackathons
                </button>
              </li>
              <li>
                <button onClick={() => handleProductClick('create', 'organizer')} className="hover:text-indigo-600 transition-colors text-left">
                  Host an Event
                </button>
              </li>
              <li>
                <button onClick={() => handleProductClick('leaderboard', 'participant')} className="hover:text-indigo-600 transition-colors text-left">
                  Live Leaderboards
                </button>
              </li>
              <li>
                <button onClick={() => handleProductClick('grading', 'judge')} className="hover:text-indigo-600 transition-colors text-left">
                  Judging Portal
                </button>
              </li>
              <li>
                <button onClick={() => setActiveModal('pricing')} className="hover:text-indigo-600 transition-colors text-left">
                  Pricing
                </button>
              </li>
            </ul>
          </div>

          {/* Resources Nav */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm tracking-wider uppercase mb-5">Resources</h4>
            <ul className="space-y-3.5 text-sm font-medium text-slate-500">
              <li><button onClick={() => setActiveModal('docs')} className="hover:text-indigo-600 transition-colors text-left">Documentation</button></li>
              <li><button onClick={() => setActiveModal('guide')} className="hover:text-indigo-600 transition-colors text-left">Organizer Guide</button></li>
              <li><button onClick={() => setActiveModal('apiref')} className="hover:text-indigo-600 transition-colors text-left">API Reference</button></li>
              <li><button onClick={() => setActiveModal('forum')} className="hover:text-indigo-600 transition-colors text-left">Community Forum</button></li>
              <li><button onClick={() => setActiveModal('help')} className="hover:text-indigo-600 transition-colors text-left">Help Center</button></li>
            </ul>
          </div>

          {/* Company Nav */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm tracking-wider uppercase mb-5">Company</h4>
            <ul className="space-y-3.5 text-sm font-medium text-slate-500">
              <li><button onClick={() => setActiveModal('about')} className="hover:text-indigo-600 transition-colors text-left">About Us</button></li>
              <li><button onClick={() => setActiveModal('careers')} className="hover:text-indigo-600 transition-colors text-left">Careers</button></li>
              <li><button onClick={() => setActiveModal('blog')} className="hover:text-indigo-600 transition-colors text-left">Blog</button></li>
              <li><button onClick={() => setActiveModal('contact')} className="hover:text-indigo-600 transition-colors text-left">Contact</button></li>
              {onOpenTeamModal && (
                <li><button onClick={onOpenTeamModal} className="hover:text-indigo-600 transition-colors text-left">Meet the Team</button></li>
              )}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-medium text-slate-500">
            <span>© 2026 Hackathon Central.</span>
            <button onClick={() => setActiveModal('privacy')} className="hover:text-slate-800 transition-colors">Privacy Policy</button>
            <button onClick={() => setActiveModal('terms')} className="hover:text-slate-800 transition-colors">Terms of Service</button>
            <button onClick={() => setActiveModal('security')} className="hover:text-slate-800 transition-colors">Security</button>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
            <span>by the <button onClick={onOpenTeamModal} className="text-indigo-600 font-bold hover:underline">Hackathon Central Team</button></span>
          </div>
        </div>

      </div>

      {/* FOOTER INTERACTIVE MODALS */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                  {activeModal === 'pricing' && <DollarSign className="w-5 h-5" />}
                  {activeModal === 'docs' && <BookOpen className="w-5 h-5" />}
                  {activeModal === 'guide' && <Layers className="w-5 h-5" />}
                  {activeModal === 'apiref' && <Code className="w-5 h-5" />}
                  {activeModal === 'forum' && <MessageSquare className="w-5 h-5" />}
                  {activeModal === 'help' && <HelpCircle className="w-5 h-5" />}
                  {activeModal === 'about' && <Building2 className="w-5 h-5" />}
                  {activeModal === 'careers' && <Briefcase className="w-5 h-5" />}
                  {activeModal === 'blog' && <FileText className="w-5 h-5" />}
                  {activeModal === 'contact' && <Mail className="w-5 h-5" />}
                  {['privacy', 'terms', 'security'].includes(activeModal) && <ShieldCheck className="w-5 h-5" />}
                </div>
                <h3 className="font-extrabold text-slate-900 text-xl tracking-tight capitalize">
                  {activeModal === 'apiref' ? 'REST API Reference' : activeModal.replace('-', ' ')}
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* MODAL CONTENT SWITCH */}
            {activeModal === 'pricing' && (
              <div className="space-y-6">
                <p className="text-xs font-semibold text-slate-500">Choose the perfect tier for your university, company, or community hackathon.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Free Community</span>
                    <div className="text-2xl font-black text-slate-900">$0 <span className="text-xs font-normal text-slate-500">/ event</span></div>
                    <ul className="text-xs text-slate-600 space-y-2 font-medium">
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Up to 100 participants</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Public Hackathon Page</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Live Leaderboard</li>
                    </ul>
                  </div>
                  <div className="p-5 rounded-2xl bg-indigo-50/60 border-2 border-indigo-500/40 space-y-3 relative">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white absolute -top-3 right-4">POPULAR</span>
                    <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">Pro Host</span>
                    <div className="text-2xl font-black text-slate-900">$299 <span className="text-xs font-normal text-slate-500">/ event</span></div>
                    <ul className="text-xs text-slate-600 space-y-2 font-medium">
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Up to 1,000 participants</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Weighted Judging Panel</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Custom Branding & Tracks</li>
                    </ul>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Enterprise</span>
                    <div className="text-2xl font-black text-slate-900">Custom</div>
                    <ul className="text-xs text-slate-600 space-y-2 font-medium">
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Unlimited participants</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Dedicated SLA & Support</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> PostgreSQL Cloud Sync</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeModal === 'docs' && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900">Welcome to Hackathon Central Documentation</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Hackathon Central provides an end-to-end framework for managing hackathons, judging project submissions with custom rubric weights, and syncing participant state in real time.
                </p>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Quick Start Guides</h5>
                  <ul className="text-xs text-slate-600 space-y-1.5 font-medium list-disc pl-4">
                    <td>How to register a team and share invite codes</td>
                    <li>Submitting GitHub project URLs and demo videos</li>
                    <li>Judge scoring rubrics & real-time evaluation setup</li>
                  </ul>
                </div>
              </div>
            )}

            {activeModal === 'guide' && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900">Organizer Best Practices Playbook</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Planning a successful event? Follow these proven steps:
                </p>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
                    <strong className="text-indigo-600">1. Define Clear Tracks:</strong> Set 2-4 focused problem statements with specific prize breakdowns.
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
                    <strong className="text-indigo-600">2. Configure Rubrics:</strong> Assign percentage weights to criteria like Code Quality, Innovation, and Usability.
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
                    <strong className="text-indigo-600">3. Enable Live Scoring:</strong> Invite judges via unique passcodes for instantaneous leaderboard updates.
                  </div>
                </div>
              </div>
            )}

            {activeModal === 'apiref' && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900">Developer REST API Reference</h4>
                <p className="text-xs text-slate-600 font-medium">Base Endpoint: <code className="px-2 py-1 rounded bg-slate-100 text-indigo-600 font-mono">http://localhost:5000/api</code></p>
                <div className="space-y-2 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 text-slate-100 flex items-center justify-between">
                    <span><strong className="text-emerald-400">GET</strong> /api/hackathons</span>
                    <span className="text-slate-400">Fetch all active events</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 text-slate-100 flex items-center justify-between">
                    <span><strong className="text-amber-400">POST</strong> /api/teams</span>
                    <span className="text-slate-400">Register new team</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 text-slate-100 flex items-center justify-between">
                    <span><strong className="text-indigo-400">PUT</strong> /api/profile</span>
                    <span className="text-slate-400">Update user profile & avatar</span>
                  </div>
                </div>
              </div>
            )}

            {activeModal === 'forum' && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900">Community & Developer Forum</h4>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Join over 15,000+ developers, AI researchers, and hackathon organizers in our official community channel.
                </p>
                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-center space-y-3">
                  <p className="text-xs font-bold text-indigo-900">Looking for teammates or technical support?</p>
                  <button onClick={() => alert('Redirecting to Developer Discord Community...')} className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all">
                    Join Hackathon Central Discord
                  </button>
                </div>
              </div>
            )}

            {activeModal === 'help' && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900">Help & Support Center</h4>
                <p className="text-xs text-slate-600 font-medium">Frequently Asked Questions:</p>
                <div className="space-y-2">
                  <details className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 cursor-pointer">
                    <summary className="font-bold text-slate-900">How do I submit a project for evaluation?</summary>
                    <p className="mt-2 text-slate-600">Navigate to your registered hackathon page and click "Submit Project". Provide your GitHub URL, demo video, and track selection.</p>
                  </details>
                  <details className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 cursor-pointer">
                    <summary className="font-bold text-slate-900">How do invite codes work?</summary>
                    <p className="mt-2 text-slate-600">When a team leader creates a team, a code (e.g. CYBE-8492) is generated. Share this code with your teammates so they can join via "Join via Code".</p>
                  </details>
                </div>
              </div>
            )}

            {['about', 'careers', 'blog', 'contact', 'privacy', 'terms', 'security'].includes(activeModal) && (
              <div className="space-y-4 text-xs font-medium text-slate-600 leading-relaxed">
                <p>
                  Hackathon Central is built to empower innovation globally. We provide secure, high-performance infrastructure for hackathons of any scale.
                </p>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <h5 className="font-bold text-slate-900 uppercase tracking-wider mb-1">Status & Integrity</h5>
                  <p className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> All Systems Operational (PostgreSQL Cloud Live)
                  </p>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

    </footer>
  );
};
