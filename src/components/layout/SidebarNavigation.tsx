import React from 'react';
import {
  LayoutDashboard,
  Compass,
  Trophy,
  Users,
  FolderCode,
  BookOpen,
  Award,
  Medal,
  MessageSquare,
  Calendar,
  Sparkles,
  User,
  Settings,
  ChevronRight,
  Terminal,
  Cpu,
  Code
} from 'lucide-react';
import type { UserRole } from '../../types';

interface SidebarNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  onLogout?: () => void;
  userName?: string;
  userAvatar?: string;
  unreadMessagesCount?: number;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  activeTab,
  setActiveTab,
  currentRole,
  setCurrentRole,
  userName = 'Roohi',
  userAvatar,
  unreadMessagesCount = 3
}) => {
  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'explore', label: 'Discover Hackathons', icon: Compass },
    { id: 'my-hackathons', label: 'My Hackathons', icon: Trophy, badge: '3' },
    { id: 'teams', label: 'Teams Workspace', icon: Users },
    { id: 'projects', label: 'Project Repos', icon: FolderCode }
  ];

  const growthNavItems = [
    { id: 'learning', label: 'Learning Center', icon: BookOpen },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'leaderboard', label: 'Leaderboard', icon: Medal }
  ];

  const commNavItems = [
    { id: 'messages', label: 'Inbox & Chat', icon: MessageSquare, badge: unreadMessagesCount > 0 ? String(unreadMessagesCount) : undefined },
    { id: 'calendar', label: 'Calendar', icon: Calendar }
  ];

  const aiNavItems = [
    { id: 'ai-assistant', label: 'AI Copilot Suite', icon: Sparkles, isAi: true }
  ];

  const accountNavItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderNavGroup = (title: string, items: typeof mainNavItems) => (
    <div className="space-y-1 py-2">
      <h4 className="px-3.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
        {title}
      </h4>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        const isAiItem = 'isAi' in item && item.isAi;

        return (
          <button
            key={item.id}
            onClick={() => {
              if (currentRole !== 'participant' && ['dashboard', 'explore', 'my-hackathons', 'teams', 'projects', 'learning', 'certificates', 'leaderboard', 'messages', 'calendar', 'ai-assistant', 'profile', 'settings'].includes(item.id)) {
                setCurrentRole('participant');
              }
              setActiveTab(item.id);
            }}
            className={`w-full relative flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 group ${
              isActive
                ? isAiItem
                  ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white shadow-md'
                  : 'bg-indigo-50/90 text-indigo-700 font-extrabold border border-indigo-100/90 shadow-2xs'
                : isAiItem
                ? 'bg-gradient-to-r from-violet-50 to-indigo-50 text-violet-700 hover:from-violet-100 hover:to-indigo-100 border border-violet-100'
                : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
            }`}
          >
            {isActive && !isAiItem && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-600 rounded-r-full" />
            )}

            <div className="flex items-center gap-2.5 min-w-0">
              <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                isActive
                  ? isAiItem ? 'text-white' : 'text-indigo-600'
                  : isAiItem ? 'text-violet-600' : 'text-slate-400 group-hover:text-slate-700'
              }`} />
              <span className="truncate">{item.label}</span>
            </div>

            {item.badge && (
              <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-200 text-slate-700'
              }`}>
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <aside className={`w-64 shrink-0 min-h-screen flex flex-col justify-between p-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto hidden lg:flex relative overflow-hidden transition-all duration-300 ${
      currentRole === 'participant'
        ? 'bg-gradient-to-b from-white/95 via-indigo-50/50 to-purple-50/40 backdrop-blur-2xl border-r-2 border-indigo-100/90 shadow-lg shadow-indigo-100/30'
        : 'bg-white border-r border-slate-200/90 shadow-2xs'
    }`}>
      {/* Background Decorative Tech Elements for Participant Sidebar */}
      {currentRole === 'participant' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-[0.06] -z-10">
          <Terminal className="absolute -top-10 -right-10 w-48 h-48 text-indigo-800" />
          <Cpu className="absolute top-1/2 -left-12 w-44 h-44 text-purple-800 animate-spin-slow" />
          <Code className="absolute bottom-10 -right-8 w-40 h-40 text-violet-800" />
        </div>
      )}

      <div className="space-y-4 relative z-10">
        {/* User Card */}
        <div 
          onClick={() => setActiveTab('profile')}
          className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all group shadow-2xs ${
            currentRole === 'participant'
              ? 'bg-white/90 border-indigo-200/90 hover:border-indigo-400 hover:shadow-md'
              : 'bg-gradient-to-r from-slate-50 to-indigo-50/50 border-slate-200/80 hover:border-indigo-300'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-black flex items-center justify-center text-sm shadow-sm overflow-hidden shrink-0 border border-indigo-200">
              {userAvatar ? (
                <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
              ) : (
                userName.charAt(0).toUpperCase()
              )}
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-black text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                {userName}
              </h4>
              <span className="text-[9px] font-extrabold text-indigo-700 bg-indigo-100/90 px-2 py-0.5 rounded-md inline-block mt-0.5">
                Level 5 Participant
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
        </div>

        {/* Navigation Sections */}
        <div className="space-y-2 divide-y divide-indigo-100/60">
          {renderNavGroup('Overview', mainNavItems)}
          {renderNavGroup('Growth & Recognition', growthNavItems)}
          {renderNavGroup('Collaboration', commNavItems)}
          {renderNavGroup('AI Copilot Suite', aiNavItems)}
          {renderNavGroup('Preferences', accountNavItems)}
        </div>
      </div>
    </aside>
  );
};
