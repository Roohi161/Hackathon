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
import type { UserRole } from '../../types/auth';

export const AppLayout: React.FC = () => {
  const { user, role, logout } = useAuthStore();
  const { isDrawerOpen, setDrawerOpen, announcements } = useNotificationStore();
  const { isTeamModalOpen, setTeamModalOpen } = useUIStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract active tab name from path
  const currentTab = location.pathname.split('/')[1] || 'explore';

  const handleNavigateTab = (tab: string) => {
    if (tab === 'explore' || tab === 'dashboard') navigate('/hackathons');
    else if (tab === 'detail') navigate('/hackathons');
    else if (tab === 'admin-dashboard') navigate('/admin');
    else if (tab === 'organizer-workspace') navigate('/organizer');
    else if (tab === 'judge-portal') navigate('/judge');
    else navigate(`/${tab}`);
  };

  const handleRoleChange = (newRole: string) => {
    useAuthStore.getState().setRole(newRole as UserRole);
    if (newRole === 'organizer' || newRole === 'ORGANIZER') navigate('/organizer');
    else if (newRole === 'judge' || newRole === 'JUDGE') navigate('/judge');
    else if (newRole === 'admin' || newRole === 'ADMIN') navigate('/admin');
    else navigate('/hackathons');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Persistent Top Navbar */}
      <Navbar
        currentRole={role.toLowerCase() as any}
        onOpenNotifications={() => setDrawerOpen(true)}
        onOpenTeamModal={() => setTeamModalOpen(true)}
        unreadCount={announcements.length}
        activeTab={currentTab}
        setActiveTab={handleNavigateTab}
        loggedInUser={user as any}
        onLogout={logout}
      />

      {/* Main Content & Sidebar Wrapper */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex items-start">
        {/* Sidebar Navigation */}
        <SidebarNavigation
          activeTab={currentTab}
          setActiveTab={handleNavigateTab}
          currentRole={role.toLowerCase() as any}
          setCurrentRole={handleRoleChange as any}
          onLogout={logout}
          userName={user?.name}
          userAvatar={user?.avatar}
          unreadMessagesCount={announcements.length}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Persistent Footer */}
      <Footer
        onOpenTeamModal={() => setTeamModalOpen(true)}
        onNavigate={(tab, newRole) => {
          handleRoleChange(newRole);
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
