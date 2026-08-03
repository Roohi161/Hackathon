import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  ClipboardCheck,
  Heart,
  DollarSign,
  FileSearch,
  GraduationCap,
  ShieldCheck,
  Megaphone,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { UserRole } from '../../types';
import { useAuthStore } from '../../stores/authStore';

interface SidebarNavigationProps {
  activeTab: string;
  setActiveTab?: (tab: string) => void;
  currentRole?: UserRole;
  setCurrentRole?: (role: UserRole) => void;
  onLogout?: () => void;
  userName?: string;
  userAvatar?: string;
  unreadMessagesCount?: number;
}

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  isAi?: boolean;
}

const roleColors: Record<string, string> = {
  PARTICIPANT: 'bg-indigo-100/90 text-indigo-700',
  ORGANIZER: 'bg-purple-100/90 text-purple-700',
  JUDGE: 'bg-amber-100/90 text-amber-700',
  ADMIN: 'bg-emerald-100/90 text-emerald-700',
  SUPER_ADMIN: 'bg-rose-100/90 text-rose-700',
  MENTOR: 'bg-cyan-100/90 text-cyan-700',
  VOLUNTEER: 'bg-teal-100/90 text-teal-700',
  SPONSOR: 'bg-yellow-100/90 text-yellow-700',
  REVIEWER: 'bg-blue-100/90 text-blue-700',
};

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  activeTab,
  setActiveTab,
  userName = 'User',
  userAvatar,
  unreadMessagesCount = 0
}) => {
  const navigate = useNavigate();
  const role = useAuthStore((state) => state.role);
  const isParticipant = role === 'PARTICIPANT';

  const handleItemClick = (id: string) => {
    if (setActiveTab) setActiveTab(id);
    
    if (role === 'ORGANIZER') {
      navigate('/organizer');
      return;
    }
    if (role === 'JUDGE') {
      navigate('/judge');
      return;
    }
    if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
      navigate('/admin');
      return;
    }

    if (id === 'explore') navigate('/hackathons');
    else if (id === 'my-hackathons') navigate('/my-hackathons');
    else navigate(`/${id}`);
  };

  // Base nav items filtered by role
  const mainNavItems: NavItem[] = isParticipant ? [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'explore', label: 'Discover Hackathons', icon: Compass },
    { id: 'my-hackathons', label: 'My Hackathons', icon: Trophy, badge: '3' },
    { id: 'teams', label: 'Teams Workspace', icon: Users },
    { id: 'projects', label: 'Project Repos', icon: FolderCode }
  ] : [
    { id: 'explore', label: 'Discover Hackathons', icon: Compass },
    { id: 'my-hackathons', label: 'Hosted Hackathons', icon: Trophy },
  ];

  const growthNavItems: NavItem[] = isParticipant ? [
    { id: 'learning', label: 'Learning Center', icon: BookOpen },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'leaderboard', label: 'Leaderboard', icon: Medal }
  ] : [
    { id: 'leaderboard', label: 'Leaderboard', icon: Medal }
  ];

  const commNavItems: NavItem[] = [
    { id: 'messages', label: 'Inbox & Chat', icon: MessageSquare, badge: unreadMessagesCount > 0 ? String(unreadMessagesCount) : undefined },
    { id: 'calendar', label: 'Calendar', icon: Calendar }
  ];

  const aiNavItems: NavItem[] = [
    { id: 'ai-assistant', label: 'AI Copilot Suite', icon: Sparkles, isAi: true }
  ];

  const accountNavItems: NavItem[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // Role-specific workspace nav items
  const roleNavItems: Record<string, NavItem[]> = {
    ORGANIZER: [
      { id: 'organizer', label: 'Organizer Workspace', icon: Megaphone },
    ],
    JUDGE: [
      { id: 'judge', label: 'Evaluation Portal', icon: ClipboardCheck },
    ],
    ADMIN: [
      { id: 'admin', label: 'Admin Dashboard', icon: ShieldCheck },
    ],
    SUPER_ADMIN: [
      { id: 'admin', label: 'Admin Dashboard', icon: ShieldCheck },
    ],
    MENTOR: [
      { id: 'mentor', label: 'Mentor Dashboard', icon: GraduationCap },
    ],
    VOLUNTEER: [
      { id: 'volunteer', label: 'Volunteer Hub', icon: Heart },
    ],
    SPONSOR: [
      { id: 'sponsor', label: 'Sponsor Portal', icon: DollarSign },
    ],
    REVIEWER: [
      { id: 'reviewer', label: 'Review Center', icon: FileSearch },
    ],
  };

  const currentRoleItems = roleNavItems[role] || [];

  const renderNavGroup = (title: string, items: NavItem[]) => (
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
            onClick={() => handleItemClick(item.id)}
            className={`w-full relative flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 group cursor-pointer ${
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

            {'badge' in item && item.badge && (
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
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200/90 min-h-screen flex flex-col justify-between p-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto hidden lg:flex shadow-2xs">
      <div className="space-y-4">
        {/* User Card */}
        <div 
          onClick={() => navigate('/profile')}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-50 to-indigo-50/50 border border-slate-200/80 flex items-center justify-between cursor-pointer hover:border-indigo-300 transition-all group shadow-2xs"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm shadow-sm overflow-hidden shrink-0 border border-indigo-200">
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
              <span className={`text-[9px] font-extrabold uppercase tracking-wider mt-0.5 inline-block px-2 py-0.5 rounded-md ${roleColors[role] || roleColors.PARTICIPANT}`}>
                {role}
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
        </div>

        {/* Navigation Sections */}
        <div className="space-y-2 divide-y divide-slate-100">
          {currentRoleItems.length > 0 && renderNavGroup('Workspace', currentRoleItems)}
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
