import React from 'react';
import { Terminal, Heart } from 'lucide-react';

interface FooterProps {
  onOpenTeamModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTeamModal }) => {
  return (
    <footer className="w-full bg-white border-t border-slate-200 mt-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-6 lg:col-span-2 pr-4">
            <div className="flex items-center gap-2 mb-2">
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
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Explore Hackathons</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Host an Event</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Live Leaderboards</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Judging Portal</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* Resources Nav */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm tracking-wider uppercase mb-5">Resources</h4>
            <ul className="space-y-3.5 text-sm font-medium text-slate-500">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Organizer Guide</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Community Forum</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Help Center</a></li>
            </ul>
          </div>

          {/* Company Nav */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm tracking-wider uppercase mb-5">Company</h4>
            <ul className="space-y-3.5 text-sm font-medium text-slate-500">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Contact</a></li>
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
            <a href="#" className="hover:text-slate-800 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-800 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-800 transition-colors">Security</a>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
            <span>by the <button onClick={onOpenTeamModal} className="text-indigo-600 font-bold hover:underline">Hackathon Central Team</button></span>
          </div>
        </div>

      </div>
    </footer>
  );
};
