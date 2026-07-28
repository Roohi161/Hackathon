import React from 'react';
import {
  UserCheck,
  Award,
  ShieldCheck,
  Bell,
  Users,
  Terminal,
  PlusCircle,
  Trophy,
  Layers,
  LogOut,
  Megaphone
} from 'lucide-react';
import type { UserRole } from '../types';

interface LoggedInUser {
  name: string;
  email: string;
  avatar: string;
}

interface NavbarProps {
  currentRole: UserRole;

  onOpenNotifications: () => void;
  onOpenTeamModal: () => void;
  unreadCount: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  loggedInUser?: LoggedInUser | null;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,

  onOpenNotifications,
  onOpenTeamModal,
  unreadCount,
  activeTab,
  setActiveTab,
  loggedInUser,
  onLogout
}) => {
  const roleColors: Record<string, string> = {
    participant: 'border-indigo-500/40 text-indigo-300',
    organizer: 'border-purple-500/40 text-purple-300',
    judge: 'border-amber-500/40 text-amber-300',
    admin: 'border-emerald-500/40 text-emerald-300'
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('explore')}>
            <div className="p-2 rounded-xl gradient-bg text-white shadow-lg shadow-indigo-500/20">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white">
                  Hackathon<span className="gradient-text">Central</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  LIVE PLATFORM
                </span>
              </div>
              <p className="text-[11px] text-gray-400 hidden md:block">
                Full-Stack Competition & Evaluation Hub
              </p>
            </div>
          </div>

          {/* Navigation Links according to Active Role */}
          <nav className="hidden md:flex items-center gap-1 bg-gray-900/60 p-1 rounded-xl border border-white/5">
            {currentRole === 'participant' && (
              <>
                <button
                  onClick={() => setActiveTab('explore')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'explore'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" /> Explore Events
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('leaderboard')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'leaderboard'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5" /> Leaderboards
                  </span>
                </button>
              </>
            )}

            {currentRole === 'organizer' && (
              <>
                <button
                  onClick={() => setActiveTab('create')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'create'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <PlusCircle className="w-3.5 h-3.5" /> Creator Wizard
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('manage')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'manage'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" /> Registrations
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('broadcast')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'broadcast'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Megaphone className="w-3.5 h-3.5" /> Broadcast
                  </span>
                </button>
              </>
            )}

            {currentRole === 'judge' && (
              <button
                onClick={() => setActiveTab('judge-portal')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'judge-portal'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" /> Assigned Submissions
                </span>
              </button>
            )}

            {currentRole === 'admin' && (
              <button
                onClick={() => setActiveTab('admin-dashboard')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'admin-dashboard'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Admin Overview
                </span>
              </button>
            )}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            {/* Team Credits Button */}
            <button
              onClick={onOpenTeamModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-700/40 rounded-xl transition-all shadow-sm"
              title="View Project Engineering Team"
            >
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Project Team</span>
            </button>

            {/* Notification Drawer Toggle */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 text-gray-300 hover:text-white bg-gray-900/60 hover:bg-gray-800 border border-white/10 rounded-xl transition-colors"
              title="Live Broadcasts"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Logged-in User Profile & Role Switcher */}
            {/* Logged-in User Profile */}
            {loggedInUser && (
              <div className="flex items-center gap-3">
                {/* Static Role Badge */}
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-900 border ${roleColors[currentRole]?.split(' ')[0] || 'border-indigo-500/40'} ${roleColors[currentRole]?.split(' ')[1] || 'text-indigo-300'} shadow-inner`}>
                  <UserCheck className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">{currentRole}</span>
                </div>

                {/* User Avatar + Name */}
                <div className="flex items-center gap-2 pl-3 border-l border-white/10">
                  <img
                    src={loggedInUser.avatar}
                    alt={loggedInUser.name}
                    className="w-9 h-9 rounded-full object-cover border-2 border-indigo-500/30 shadow-lg hover:border-indigo-400 transition-colors cursor-pointer"
                  />
                  <div className="hidden lg:block">
                    <span className="text-xs font-bold text-white block leading-tight">{loggedInUser.name}</span>
                    <span className="text-[10px] text-gray-400 block leading-tight">{loggedInUser.email}</span>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  className="p-2 ml-1 text-gray-400 hover:text-red-400 bg-gray-900/60 hover:bg-red-950/40 border border-white/10 hover:border-red-500/30 rounded-xl transition-all shadow-sm"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};

