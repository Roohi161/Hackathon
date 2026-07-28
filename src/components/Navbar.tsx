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
  ChevronDown
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
    participant: 'bg-indigo-100 text-indigo-700',
    organizer: 'bg-purple-100 text-purple-700',
    judge: 'bg-amber-100 text-amber-700',
    admin: 'bg-emerald-100 text-emerald-700'
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('explore')}>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-md group-hover:shadow-lg transition-all">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Hackathon<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Central</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-indigo-50 text-indigo-600 border border-indigo-100">
                  LIVE
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links according to Active Role */}
          <nav className="hidden md:flex items-center gap-2">
            {currentRole === 'participant' && (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'dashboard'
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('explore')}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'explore'
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Layers className="w-4 h-4" /> Explore
                </button>
                <button
                  onClick={() => setActiveTab('leaderboard')}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'leaderboard'
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Trophy className="w-4 h-4" /> Leaderboards
                </button>
              </>
            )}

            {currentRole === 'organizer' && (
              <>
                <button
                  onClick={() => setActiveTab('create')}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'create'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" /> Create
                </button>
                <button
                  onClick={() => setActiveTab('manage')}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'manage'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Users className="w-4 h-4" /> Registrations
                </button>
                <button
                  onClick={() => setActiveTab('broadcast')}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'broadcast'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Megaphone className="w-4 h-4" /> Broadcast
                </button>
              </>
            )}

            {currentRole === 'judge' && (
              <button
                onClick={() => setActiveTab('judge-portal')}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'judge-portal'
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Award className="w-4 h-4" /> Submissions
              </button>
            )}

            {currentRole === 'admin' && (
              <button
                onClick={() => setActiveTab('admin-dashboard')}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'admin-dashboard'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4" /> Admin Overview
              </button>
            )}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-4">
            
            <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
              {/* Team Credits Button */}
              <button
                onClick={onOpenTeamModal}
                className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                title="View Platform Engineering Team (Creators)"
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Dev Team</span>
              </button>

              {/* Notification Drawer Toggle */}
              <button
                onClick={onOpenNotifications}
                className="relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute 2 top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
                )}
              </button>
            </div>

            {/* Logged-in User Profile */}
            {loggedInUser && (
              <div className="flex items-center gap-3 relative group cursor-pointer">
                <div className="text-right hidden lg:block">
                  <span className="text-sm font-bold text-slate-900 block leading-tight">{loggedInUser.name}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 inline-block px-1.5 py-0.5 rounded-md ${roleColors[currentRole]}`}>
                    {currentRole}
                  </span>
                </div>
                
                <div className="relative">
                  <img
                    src={loggedInUser.avatar}
                    alt={loggedInUser.name}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100 group-hover:ring-indigo-100 transition-all shadow-sm"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                    <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  </div>
                </div>

                {/* Dropdown Menu (Hover based for simplicity in this redesign) */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right">
                  <div className="p-2 space-y-1">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1 lg:hidden">
                      <span className="text-sm font-bold text-slate-900 block">{loggedInUser.name}</span>
                      <span className="text-xs text-slate-500">{loggedInUser.email}</span>
                    </div>
                    <button
                      onClick={() => setActiveTab('profile')}
                      className="w-full text-left px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors flex items-center gap-2"
                    >
                      <UserCheck className="w-4 h-4" /> My Profile
                    </button>
                    <button
                      onClick={onLogout}
                      className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

