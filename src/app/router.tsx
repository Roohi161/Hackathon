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

// Role-Specific Workspace Views
const OrganizerWorkspace = lazy(() => import('../components/organizer/OrganizerWorkspace').then(m => ({ default: m.OrganizerWorkspace })));
const DedicatedEvaluationPortal = lazy(() => import('../components/judge/DedicatedEvaluationPortal').then(m => ({ default: m.DedicatedEvaluationPortal })));
const AdminDashboard = lazy(() => import('../components/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
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

export const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage onLogin={() => {}} />} />
          <Route path="/login" element={<LoginPage onLogin={() => {}} />} />
          <Route path="/signup" element={<SignupPage onSignup={() => {}} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* Authenticated Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<ParticipantMainDashboard />} />
            <Route path="/hackathons" element={<HackathonList />} />
            <Route path="/my-hackathons" element={<HackathonList onlyMyHackathons={true} />} />
            <Route path="/hackathons/:id" element={<HackathonDetail />} />
            <Route path="/teams" element={<TeamsWorkspaceView />} />
            <Route path="/projects" element={<ProjectWorkspaceView />} />
            <Route path="/learning" element={<LearningCenterView />} />
            <Route path="/certificates" element={<CertificatesView />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/messages" element={<MessagesView />} />
            <Route path="/settings" element={<SettingsView />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/ai-assistant" element={<AiAssistantHub />} />
            <Route path="/leaderboard" element={<LeaderboardView submissions={[]} hackathons={[]} />} />

            {/* Organizer Workspace */}
            <Route element={<RoleRoute allowedRoles={['ORGANIZER', 'ADMIN', 'SUPER_ADMIN']} />}>
              <Route path="/organizer/*" element={<OrganizerWorkspace hackathons={[]} teams={[]} announcements={[]} onCreateHackathon={() => {}} onDeleteHackathon={() => {}} onUpdateTeamStatus={() => {}} onBroadcastAnnouncement={() => {}} />} />
            </Route>

            {/* Judge Portal */}
            <Route element={<RoleRoute allowedRoles={['JUDGE', 'ADMIN', 'SUPER_ADMIN']} />}>
              <Route path="/judge/*" element={<DedicatedEvaluationPortal submissions={[]} hackathons={[]} onSelectSubmission={() => {}} />} />
            </Route>

            {/* Admin Dashboard */}
            <Route element={<RoleRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']} />}>
              <Route path="/admin/*" element={<AdminDashboard hackathons={[]} onToggleFeatured={() => {}} verifications={[]} onUpdateVerificationStatus={() => {}} />} />
            </Route>

            {/* Mentor Dashboard */}
            <Route element={<RoleRoute allowedRoles={['MENTOR', 'ADMIN', 'SUPER_ADMIN']} />}>
              <Route path="/mentor/*" element={<MentorDashboard />} />
            </Route>

            {/* Volunteer Hub */}
            <Route element={<RoleRoute allowedRoles={['VOLUNTEER', 'ADMIN', 'SUPER_ADMIN']} />}>
              <Route path="/volunteer/*" element={<VolunteerDashboard />} />
            </Route>

            {/* Sponsor Portal */}
            <Route element={<RoleRoute allowedRoles={['SPONSOR', 'ADMIN', 'SUPER_ADMIN']} />}>
              <Route path="/sponsor/*" element={<SponsorDashboard />} />
            </Route>

            {/* Reviewer Center */}
            <Route element={<RoleRoute allowedRoles={['REVIEWER', 'ADMIN', 'SUPER_ADMIN']} />}>
              <Route path="/reviewer/*" element={<ReviewerDashboard />} />
            </Route>
          </Route>
        </Route>

        {/* 404 Catch-all */}
        <Route path="*" element={<Global404Page />} />
      </Routes>
    </Suspense>
  );
};
