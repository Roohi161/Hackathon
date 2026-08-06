import React, { useState } from 'react';
import { 
  Sparkles, 
  LayoutDashboard, 
  Award, 
  ChevronLeft,
  ChevronDown,
  Users,
  Database,
  Megaphone,
  UserCheck,
  FolderKanban,
  Sliders,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';

export const AdminPortal: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('adminIsAuthenticated') === 'true';
  });

  const [activeTab, setActiveTab] = useState<
    'metrics' | 'analytics' | 'judges' | 'organizers' | 'moderation' | 'featured' | 'payouts' | 'verification' | 'events' | 'users'
  >('metrics');

  const [controlsExpanded, setControlsExpanded] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('adminIsAuthenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminIsAuthenticated');
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex bg-[#0B0F19] text-slate-100 font-sans relative">
      {/* REFINED ELEGANT DARK SIDEBAR */}
      <aside 
        className={`${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } bg-[#0F172A] text-slate-300 flex flex-col fixed inset-y-0 left-0 z-50 transition-all duration-300 shadow-xl border-r border-slate-800`}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-5 border-b border-slate-800 bg-[#0F172A]">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('metrics')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-white flex items-center justify-center shadow-md font-black">
              <Sparkles className="w-5 h-5" />
            </div>
            {!sidebarCollapsed && (
              <span className="font-extrabold text-lg tracking-tight text-white">
                HackPulse <span className="text-indigo-400 font-bold text-xs uppercase tracking-wider ml-1 px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30">Admin</span>
              </span>
            )}
          </div>

          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center hover:bg-slate-700 hover:text-white transition-all border border-slate-700"
          >
            <ChevronLeft className={`w-4 h-4 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-5 scrollbar-none">
          {/* OVERVIEW SECTION */}
          <div className="space-y-1">
            {!sidebarCollapsed && (
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 mb-2">
                OVERVIEW
              </div>
            )}

            {/* Dashboard Item */}
            <button
              onClick={() => setActiveTab('metrics')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
                activeTab === 'metrics'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30 font-extrabold border-l-2 border-indigo-400'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4" />
                {!sidebarCollapsed && <span>Dashboard & Metrics</span>}
              </div>
            </button>
          </div>

          {/* PLATFORM MANAGEMENT (PDF SPECIFICATION) */}
          <div className="space-y-1 pt-4 border-t border-slate-800">
            {!sidebarCollapsed && (
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 mb-2">
                PLATFORM MANAGEMENT
              </div>
            )}

            {/* Featured Hackathons (PDF feature) */}
            <button
              onClick={() => setActiveTab('events')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'events' || activeTab === 'featured'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30 font-extrabold border-l-2 border-indigo-400'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <FolderKanban className="w-4 h-4 text-amber-400" />
                {!sidebarCollapsed && <span>Featured Hackathons</span>}
              </div>
              {!sidebarCollapsed && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Carousel
                </span>
              )}
            </button>

            {/* Organizer Verification Flow (PDF feature) */}
            <button
              onClick={() => setActiveTab('verification')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'verification' || activeTab === 'moderation'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30 font-extrabold border-l-2 border-indigo-400'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sliders className="w-4 h-4 text-emerald-400" />
                {!sidebarCollapsed && <span>Organizer Verifications</span>}
              </div>
              {!sidebarCollapsed && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Review
                </span>
              )}
            </button>

            {/* Host Organizers (PDF feature) */}
            <button
              onClick={() => setActiveTab('organizers')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'organizers'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30 font-extrabold border-l-2 border-indigo-400'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                {!sidebarCollapsed && <span>Host Organizers</span>}
              </div>
            </button>

            {/* Mentors & Judges (PDF feature) */}
            <button
              onClick={() => setActiveTab('judges')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'judges'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30 font-extrabold border-l-2 border-indigo-400'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Award className="w-4 h-4" />
                {!sidebarCollapsed && <span>Mentors & Judges</span>}
              </div>
              {!sidebarCollapsed && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  3
                </span>
              )}
            </button>
          </div>

          {/* SYSTEM & CREDITS */}
          <div className="space-y-1 pt-4 border-t border-slate-800">
            {!sidebarCollapsed && (
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 mb-2">
                SYSTEM & SECURITY
              </div>
            )}

            {/* Data Center */}
            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30 font-extrabold border-l-2 border-indigo-400'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Database className="w-4 h-4" />
                {!sidebarCollapsed && <span>Data Center & Vault</span>}
              </div>
              {!sidebarCollapsed && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  LIVE
                </span>
              )}
            </button>

            {/* User Roster */}
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'users'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30 font-extrabold border-l-2 border-indigo-400'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <UserCheck className="w-4 h-4" />
                {!sidebarCollapsed && <span>User Roster</span>}
              </div>
            </button>

            {/* Project Team Credits */}
            <button
              onClick={() => setActiveTab('team' as any)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === ('team' as any)
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30 font-extrabold border-l-2 border-indigo-400'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-indigo-400" />
                {!sidebarCollapsed && <span>Project Team Brief</span>}
              </div>
            </button>
          </div>
        </nav>

        {/* Bottom Profile Widget & Sign Out */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-black text-xs flex items-center justify-center border border-indigo-400/40">
                  A
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-900"></span>
              </div>
              {!sidebarCollapsed && (
                <div className="text-left">
                  <span className="text-xs font-bold text-white block leading-none">Super Admin</span>
                  <span className="text-[10px] text-slate-400 block leading-none mt-1">admin@hackathon.com</span>
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="w-8 h-8 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 flex items-center justify-center transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <header className="h-20 bg-[#0F172A]/90 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-40 px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black text-white tracking-tight">Admin Operations Center</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Live Control
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700">
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                A
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-white block leading-none">Super Admin</span>
                <span className="text-[10px] text-slate-400 block leading-none mt-0.5">admin@hackathon.com</span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-8">
          <AdminDashboard
            activeTab={activeTab}
            hackathons={[]}
            onToggleFeatured={() => {}}
            verifications={[]}
            onUpdateVerificationStatus={() => {}}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        </main>
      </div>
    </div>
  );
};
