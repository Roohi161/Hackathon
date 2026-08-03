import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from '../Navbar';
import { SidebarNavigation } from './SidebarNavigation';
import { Footer } from '../Footer';
import { ToastContainer } from '../ui/Toast';
import { NotificationDrawer } from '../NotificationDrawer';
import { TeamModal } from '../TeamModal';
import { useAuthStore } from '../../stores/authStore';
import { useNotificationStore } from '../../stores/notificationStore';
import { useUIStore } from '../../stores/uiStore';

import { ParticipantBackground } from '../participant/ParticipantBackground';

export const AppLayout: React.FC = () => {
  const { user, role, logout } = useAuthStore();
  const { isDrawerOpen, setDrawerOpen, announcements } = useNotificationStore();
  const { isTeamModalOpen, setTeamModalOpen } = useUIStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract active tab name from path
  const currentTab = location.pathname.split('/')[1] || 'explore';

  const handleNavigateTab = (tab: string) => {
    if (tab === 'dashboard') {
      const roleRouteMap: Record<string, string> = {
        ORGANIZER: '/organizer',
        JUDGE: '/judge',
        ADMIN: '/admin',
        SUPER_ADMIN: '/admin',
        MENTOR: '/mentor',
        VOLUNTEER: '/volunteer',
        SPONSOR: '/sponsor',
        REVIEWER: '/reviewer',
        PARTICIPANT: '/dashboard',
      };
      navigate(roleRouteMap[role] || '/dashboard');
      return;
    }
    if (tab === 'explore' || tab === 'detail') navigate('/hackathons');
    else if (tab === 'admin-dashboard') navigate('/admin');
    else if (tab === 'organizer-workspace') navigate('/organizer');
    else if (tab === 'judge-portal') navigate('/judge');
    else navigate(`/${tab}`);
  };

  const isParticipant = String(role).toUpperCase() === 'PARTICIPANT';

  return (
    <div className={`min-h-screen flex flex-col text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-500 ${
      isParticipant
        ? 'bg-gradient-to-br from-indigo-50/80 via-slate-50 to-purple-50/60 relative overflow-x-hidden'
        : 'bg-slate-50 dark:bg-slate-950'
    }`}>
      {/* Background Ambient Mesh Orbs & Tech Overlay for Participant Portal */}
      {isParticipant && <ParticipantBackground />}

      {/* Persistent Top Navbar */}
      <Navbar
        currentRole={role}
        onOpenNotifications={() => setDrawerOpen(true)}
        onOpenTeamModal={() => setTeamModalOpen(true)}
        unreadCount={announcements.length}
        activeTab={currentTab}
        setActiveTab={handleNavigateTab}
        loggedInUser={user ? { name: user.name, email: user.email, avatar: user.avatar || '' } : null}
        onLogout={logout}
      />

      {/* Main Content & Sidebar Wrapper */}
      <div className="flex-1 w-full mx-auto flex items-start px-1 sm:px-2 md:px-3 relative z-10">
        {/* Sidebar Navigation */}
        <SidebarNavigation
          activeTab={currentTab}
          setActiveTab={handleNavigateTab}
          currentRole={role}
          onLogout={logout}
          userName={user?.name}
          userAvatar={user?.avatar}
          unreadMessagesCount={announcements.length}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-2 sm:p-4 lg:p-5">
          <Outlet />
        </main>
      </div>

      {/* Persistent Footer */}
      <Footer
        onOpenTeamModal={() => setTeamModalOpen(true)}
        onNavigate={(tab) => {
          handleNavigateTab(tab);
        }}
      />

      {/* Drawers & Modals */}
      <NotificationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        announcements={announcements}
      />

      <TeamModal
        isOpen={isTeamModalOpen}
        onClose={() => setTeamModalOpen(false)}
      />

      <ToastContainer />
    </div>
  );
};
