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
  Megaphone,
  Package,
  Search
} from 'lucide-react';
import type { UserRole } from '../types';

interface LoggedInUser {
  name: string;
  email: string;
  avatar: string;
}

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
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
  onRoleChange,
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
    judge: 'border-amber-500/40 text-amber-300'
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0F19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('explore')}>
            <div className="p-2 rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-600/20 flex items-center justify-center">
              <Package className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-lg tracking-tight text-white">
                  Admin<span className="text-indigo-300">Console</span>
                </span>
              </div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 hidden md:block mt-0.5">
                CENTRAL HUB
              </p>
            </div>
          </div>

          {/* Search Bar (Centered) */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search platform..."
                className="block w-full pl-10 pr-12 py-2 border border-slate-700/50 rounded-lg leading-5 bg-slate-800/50 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
              />
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-700/50 text-slate-400 border border-slate-600/50">
                  ⌘ K
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links according to Active Role */}
          <nav className="hidden md:flex items-center gap-1 bg-gray-900/60 p-1 rounded-xl border border-white/5">
            {currentRole?.toUpperCase() === 'PARTICIPANT' && (
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

            {currentRole?.toUpperCase() === 'ORGANIZER' && (
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

            {currentRole?.toUpperCase() === 'JUDGE' && (
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
            {loggedInUser ? (
              <div className="flex items-center gap-2">
                {/* Role Switcher (compact) */}
                <div className="relative flex items-center">
                  <select
                    value={currentRole}
                    onChange={(e) => onRoleChange(e.target.value as UserRole)}
                    className={`appearance-none pl-8 pr-6 py-1.5 text-[11px] font-semibold rounded-xl bg-gray-900 border ${roleColors[currentRole]?.split(' ')[0] || 'border-indigo-500/40'} ${roleColors[currentRole]?.split(' ')[1] || 'text-indigo-300'} cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner`}
                  >
                    <option value="participant">Participant</option>
                    <option value="organizer">Organizer</option>
                    <option value="judge">Judge</option>
                    <option value="admin">Admin Portal</option>
                  </select>
                  <UserCheck className="w-3 h-3 text-gray-400 absolute left-2.5 pointer-events-none" />
                </div>

                {/* User Avatar + Name */}
                <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                  <img
                    src={loggedInUser.avatar}
                    alt={loggedInUser.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-indigo-500/30 shadow-md"
                  />
                  <div className="hidden lg:block">
                    <span className="text-xs font-semibold text-white block leading-tight">{loggedInUser.name}</span>
                    <span className="text-[10px] text-gray-400 block leading-tight">{loggedInUser.email}</span>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  className="p-2 text-gray-400 hover:text-red-400 bg-gray-900/60 hover:bg-red-950/40 border border-white/10 hover:border-red-500/30 rounded-xl transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Fallback: Original Role Switcher */
              <div className="relative flex items-center">
                <select
                  value={currentRole}
                  onChange={(e) => onRoleChange(e.target.value as UserRole)}
                  className="appearance-none pl-8 pr-8 py-1.5 text-xs font-semibold rounded-xl bg-gray-900 border border-indigo-500/40 text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
                >
                  <option value="participant">Participant Workflow</option>
                  <option value="organizer">Organizer Workflow</option>
                  <option value="judge">Judge Workflow</option>
                  <option value="admin">Admin Portal</option>
                </select>
                <UserCheck className="w-3.5 h-3.5 text-indigo-400 absolute left-2.5 pointer-events-none" />
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};

