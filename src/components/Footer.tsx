import React from 'react';
import { Terminal, Heart } from 'lucide-react';

interface FooterProps {
  onOpenTeamModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTeamModal }) => {
  return (
    <footer className="w-full bg-[#0f172a] border-t border-slate-800 mt-20 relative overflow-hidden">
      {/* Decorative Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[4px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent blur-sm" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4 lg:col-span-2 pr-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                <Terminal className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">Hackathon<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Central</span></span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The premier platform for hosting, discovering, and managing world-class hackathons. We connect top developers with innovative organizations.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="p-2 rounded-full bg-slate-800/50 text-slate-400 hover:bg-indigo-500/20 hover:text-indigo-400 transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              </a>
              <a href="#" className="p-2 rounded-full bg-slate-800/50 text-slate-400 hover:bg-indigo-500/20 hover:text-indigo-400 transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className="p-2 rounded-full bg-slate-800/50 text-slate-400 hover:bg-indigo-500/20 hover:text-indigo-400 transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.7a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26z"/></svg>
              </a>
            </div>
          </div>

          {/* Product Nav */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Explore Hackathons</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Host an Event</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Live Leaderboards</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Judging Portal</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* Resources Nav */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Resources</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Organizer Guide</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Community Forum</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Help Center</a></li>
            </ul>
          </div>

          {/* Company Nav */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Contact</a></li>
              {onOpenTeamModal && (
                <li><button onClick={onOpenTeamModal} className="hover:text-indigo-400 transition-colors text-left">Meet the Team</button></li>
              )}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-500">
            <span>© 2026 Hackathon Central.</span>
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Security</a>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
            <span>by the <button onClick={onOpenTeamModal} className="text-indigo-400 hover:underline">Hackathon Central Team</button></span>
          </div>
        </div>

      </div>
    </footer>
  );
};
