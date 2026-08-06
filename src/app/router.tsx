import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';
import { Spinner } from '../components/ui/Spinner';

// Lazy-loaded Page Components with Named Export Mapping
const LandingPage = lazy(() => import('../components/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('../components/LoginPage').then(m => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import('../components/SignupPage').then(m => ({ default: m.SignupPage })));
const OrganizerLoginPage = lazy(() => import('../components/auth/OrganizerLoginPage').then(m => ({ default: m.OrganizerLoginPage })));
const JudgeLoginPage = lazy(() => import('../components/auth/JudgeLoginPage').then(m => ({ default: m.JudgeLoginPage })));
const AdminLoginPage = lazy(() => import('../components/auth/AdminLoginPage').then(m => ({ default: m.AdminLoginPage })));

const AboutPage = lazy(() => import('../components/landing/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('../components/landing/ContactPage').then(m => ({ default: m.ContactPage })));

// Participant Views
const HackathonList = lazy(() => import('../components/participant/HackathonList').then(m => ({ default: m.HackathonList })));
const HackathonDetail = lazy(() => import('../components/participant/HackathonDetail').then(m => ({ default: m.HackathonDetail })));
const ParticipantMainDashboard = lazy(() => import('../components/participant/ParticipantMainDashboard').then(m => ({ default: m.ParticipantMainDashboard })));
const TeamsWorkspaceView = lazy(() => import('../components/participant/TeamsWorkspaceView').then(m => ({ default: m.TeamsWorkspaceView })));
const ProjectWorkspaceView = lazy(() => import('../components/participant/ProjectWorkspaceView').then(m => ({ default: m.ProjectWorkspaceView })));
const LearningCenterView = lazy(() => import('../components/participant/LearningCenterView').then(m => ({ default: m.LearningCenterView })));
const CertificatesView = lazy(() => import('../components/participant/CertificatesView').then(m => ({ default: m.CertificatesView })));
const CalendarView = lazy(() => import('../components/participant/CalendarView').then(m => ({ default: m.CalendarView })));
const MessagesView = lazy(() => import('../components/participant/MessagesView').then(m => ({ default: m.MessagesView })));
const SettingsView = lazy(() => import('../components/participant/SettingsView').then(m => ({ default: m.SettingsView })));
const LeaderboardView = lazy(() => import('../components/participant/LeaderboardView').then(m => ({ default: m.LeaderboardView })));
const UserProfilePage = lazy(() => import('../components/profile/UserProfilePage').then(m => ({ default: m.UserProfilePage })));
const AiAssistantHub = lazy(() => import('../components/ai/AiAssistantHub').then(m => ({ default: m.AiAssistantHub })));

// Specialized Full-Page Workspace Views (Self-contained Layouts)
const OrganizerWorkspace = lazy(() => import('../components/organizer/OrganizerWorkspace').then(m => ({ default: m.OrganizerWorkspace })));
const DedicatedEvaluationPortal = lazy(() => import('../components/judge/DedicatedEvaluationPortal').then(m => ({ default: m.DedicatedEvaluationPortal })));
const AdminPortal = lazy(() => import('../components/admin/AdminPortal').then(m => ({ default: m.AdminPortal })));
const MentorDashboard = lazy(() => import('../components/mentor/MentorDashboard').then(m => ({ default: m.MentorDashboard })));
const VolunteerDashboard = lazy(() => import('../components/volunteer/VolunteerDashboard').then(m => ({ default: m.VolunteerDashboard })));
const SponsorDashboard = lazy(() => import('../components/sponsor/SponsorDashboard').then(m => ({ default: m.SponsorDashboard })));
const ReviewerDashboard = lazy(() => import('../components/reviewer/ReviewerDashboard').then(m => ({ default: m.ReviewerDashboard })));

const Global404Page = lazy(() => import('../components/Global404Page').then(m => ({ default: m.Global404Page })));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <Spinner size="lg" />
  </div>
);

import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const RoleDashboardRedirect: React.FC = () => {
  const role = useAuthStore((s) => s.role);
  if (role === 'ORGANIZER') return <Navigate to="/organizer" replace />;
  if (role === 'JUDGE') return <Navigate to="/judge" replace />;
  if (role === 'ADMIN' || role === 'SUPER_ADMIN') return <Navigate to="/admin" replace />;
  if (role === 'MENTOR') return <Navigate to="/mentor" replace />;
  if (role === 'VOLUNTEER') return <Navigate to="/volunteer" replace />;
  if (role === 'SPONSOR') return <Navigate to="/sponsor" replace />;
  if (role === 'REVIEWER') return <Navigate to="/reviewer" replace />;
  return <ParticipantMainDashboard />;
};

const RoleMyHackathonsRedirect: React.FC = () => {
  const role = useAuthStore((s) => s.role);
  if (role === 'ORGANIZER') return <Navigate to="/organizer" replace />;
  if (role === 'JUDGE') return <Navigate to="/judge" replace />;
  if (role === 'ADMIN' || role === 'SUPER_ADMIN') return <Navigate to="/admin" replace />;
  return <HackathonList onlyMyHackathons={true} />;
};

const RoleProfileRedirect: React.FC = () => {
  const role = useAuthStore((s) => s.role);
  if (role === 'ORGANIZER') return <Navigate to="/organizer" replace />;
  if (role === 'JUDGE') return <Navigate to="/judge" replace />;
  if (role === 'ADMIN' || role === 'SUPER_ADMIN') return <Navigate to="/admin" replace />;
  return <UserProfilePage />;
};

import { useNavigate } from 'react-router-dom';
import { UserRole, User } from '../types/auth';

export const AppRouter: React.FC = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = (role: string, user: any) => {
    const uppercaseRole = (role || 'PARTICIPANT').toUpperCase() as UserRole;
    const authUser: User = {
      id: `usr-${Date.now()}`,
      email: user.email || 'user@hackathon.com',
      name: user.name || 'User',
      role: uppercaseRole,
      avatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      isEmailVerified: true,
      profileComplete: true,
      skills: ['React', 'TypeScript', 'Node.js'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setAuth(authUser, {
      accessToken: 'demo-access-token-' + Date.now(),
      refreshToken: 'demo-refresh-token-' + Date.now()
    });

    if (uppercaseRole === 'ADMIN' || uppercaseRole === 'SUPER_ADMIN') {
      navigate('/admin');
    } else if (uppercaseRole === 'JUDGE') {
      navigate('/judge');
    } else if (uppercaseRole === 'ORGANIZER') {
      navigate('/organizer');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage onLogin={() => {}} />} />
          <Route path="/login" element={<LoginPage onLogin={() => {}} />} />
          <Route path="/organizer/login" element={<OrganizerLoginPage />} />
          <Route path="/judge/login" element={<JudgeLoginPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/signup" element={<SignupPage onSignup={() => {}} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* Authenticated Standard Routes (with AppLayout Top Navbar & Left Sidebar) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<RoleDashboardRedirect />} />
            <Route path="/hackathons" element={<HackathonList />} />
            <Route path="/my-hackathons" element={<RoleMyHackathonsRedirect />} />
            <Route path="/hackathons/:id" element={<HackathonDetail />} />
            <Route path="/teams" element={<TeamsWorkspaceView />} />
            <Route path="/projects" element={<ProjectWorkspaceView />} />
            <Route path="/learning" element={<LearningCenterView />} />
            <Route path="/certificates" element={<CertificatesView />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/messages" element={<MessagesView />} />
            <Route path="/settings" element={<SettingsView />} />
            <Route path="/profile" element={<RoleProfileRedirect />} />
            <Route path="/ai-assistant" element={<AiAssistantHub />} />
            <Route path="/leaderboard" element={<LeaderboardView submissions={[]} hackathons={[]} />} />
          </Route>

          {/* Full-Page Workspaces (Self-Contained Layouts without duplicate AppLayout sidebar) */}
          <Route element={<RoleRoute allowedRoles={['ORGANIZER', 'ADMIN', 'SUPER_ADMIN']} />}>
            <Route path="/organizer/*" element={<OrganizerWorkspace />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={['JUDGE', 'ADMIN', 'SUPER_ADMIN']} />}>
            <Route path="/judge/*" element={<DedicatedEvaluationPortal submissions={[]} hackathons={[]} onSelectSubmission={() => {}} />} />
          </Route>

          <Route path="/admin/*" element={<AdminPortal />} />

          <Route element={<RoleRoute allowedRoles={['MENTOR', 'ADMIN', 'SUPER_ADMIN']} />}>
            <Route path="/mentor/*" element={<MentorDashboard />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={['VOLUNTEER', 'ADMIN', 'SUPER_ADMIN']} />}>
            <Route path="/volunteer/*" element={<VolunteerDashboard />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={['SPONSOR', 'ADMIN', 'SUPER_ADMIN']} />}>
            <Route path="/sponsor/*" element={<SponsorDashboard />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={['REVIEWER', 'ADMIN', 'SUPER_ADMIN']} />}>
            <Route path="/reviewer/*" element={<ReviewerDashboard />} />
          </Route>
        </Route>

        {/* 404 Catch-all */}
        <Route path="*" element={<Global404Page />} />
      </Routes>
    </Suspense>
  );
};
