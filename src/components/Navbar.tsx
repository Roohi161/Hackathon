import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Users,
  Terminal,
  LogOut,
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
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  loggedInUser?: LoggedInUser | null;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole = 'PARTICIPANT',
  onOpenNotifications,
  onOpenTeamModal,
  unreadCount,
  setActiveTab,
  loggedInUser,
  onLogout
}) => {
  const navigate = useNavigate();

  const normalizedRole = (currentRole || 'PARTICIPANT').toLowerCase();

  const roleColors: Record<string, string> = {
    participant: 'bg-indigo-100 text-indigo-700 border-indigo-300',
    organizer: 'bg-purple-100 text-purple-700 border-purple-300',
    judge: 'bg-amber-100 text-amber-700 border-amber-300',
    admin: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    super_admin: 'bg-rose-100 text-rose-700 border-rose-300',
    mentor: 'bg-cyan-100 text-cyan-700 border-cyan-300',
    sponsor: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    volunteer: 'bg-teal-100 text-teal-700 border-teal-300',
    reviewer: 'bg-blue-100 text-blue-700 border-blue-300'
  };

  const handleBrandClick = () => {
    if (setActiveTab) setActiveTab('explore');
    navigate('/hackathons');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={handleBrandClick}>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-md group-hover:shadow-lg transition-all">
              <Terminal className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl text-slate-900 tracking-tight leading-none">
                Hackathon<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Central</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider">PREMIER PLATFORM</span>
            </div>
          </div>

          {/* Global Search Bar */}
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search hackathons, teams, projects, resources..."
                className="w-full pl-9 pr-4 py-2 text-xs font-medium rounded-2xl bg-slate-100 border border-slate-200 text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              />
              <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            
            {/* Dev Team Credits Button */}
            <button
              onClick={onOpenTeamModal}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-slate-200 cursor-pointer"
              title="View Platform Engineering Team (Creators)"
            >
              <Users className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Dev Team</span>
            </button>

            {/* Notification Drawer Toggle */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors border border-slate-200 cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Logged-in User Profile Dropdown */}
            {loggedInUser && (
              <div className="flex items-center gap-3 relative group cursor-pointer pl-2 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <span className="text-xs font-extrabold text-slate-900 block leading-tight">{loggedInUser.name}</span>
                  <span className={`text-[9px] font-extrabold uppercase tracking-wider mt-0.5 inline-block px-2 py-0.5 rounded border ${roleColors[normalizedRole] || roleColors.participant}`}>
                    {currentRole}
                  </span>
                </div>
                
                <div className="relative">
                  <img
                    src={loggedInUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'}
                    alt={loggedInUser.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/30 group-hover:ring-indigo-500 transition-all"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-48 py-2 bg-white rounded-2xl shadow-xl border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-extrabold text-slate-900 truncate">{loggedInUser.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{loggedInUser.email}</p>
                  </div>
                  <button
                    onClick={() => navigate('/profile')}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    👤 View Profile
                  </button>
                  <button
                    onClick={() => navigate('/settings')}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    ⚙️ Settings
                  </button>
                  {onLogout && (
                    <button
                      onClick={onLogout}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors border-t border-slate-100 flex items-center gap-1.5 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Log Out
                    </button>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
