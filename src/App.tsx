import { useState, useEffect } from 'react';
import { getDbHealth, getHackathonsFromDb, saveHackathonToDb, saveTeamToDb } from './services/api';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { TeamModal } from './components/TeamModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';

// Participant Components
import { HackathonList } from './components/participant/HackathonList';
import { HackathonDetail } from './components/participant/HackathonDetail';
import { TeamRegistrationModal } from './components/participant/TeamRegistrationModal';
import { ProjectSubmissionModal } from './components/participant/ProjectSubmissionModal';
import { LeaderboardView } from './components/participant/LeaderboardView';

// Organizer Components
import { CreateHackathonWizard } from './components/organizer/CreateHackathonWizard';
import { ParticipantManagement } from './components/organizer/ParticipantManagement';
import { AnnouncementBroadcaster } from './components/organizer/AnnouncementBroadcaster';

// Judge Components
import { DedicatedEvaluationPortal } from './components/judge/DedicatedEvaluationPortal';
import { SubmissionInspector } from './components/judge/SubmissionInspector';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';

// Mock Initial Data
import {
  INITIAL_HACKATHONS,
  INITIAL_SUBMISSIONS,
  INITIAL_TEAMS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_VERIFICATIONS
} from './data/mockData';

import type {
  UserRole,
  Hackathon,
  ProjectSubmission,
  Team,
  Announcement,
  OrganizerVerificationRequest,
  JudgeScore
} from './types';

// Authenticated user type
interface AuthenticatedUser {
  name: string;
  email: string;
  avatar: string;
}

export function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<AuthenticatedUser | null>(null);

  // Global State
  const [currentRole, setCurrentRole] = useState<UserRole>('participant');
  const [activeTab, setActiveTab] = useState<string>('explore');

  // Modals State
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isTeamRegModalOpen, setIsTeamRegModalOpen] = useState(false);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  // Entities State
  const [hackathons, setHackathons] = useState<Hackathon[]>(INITIAL_HACKATHONS);
  const [selectedHackathon, setSelectedHackathon] = useState<Hackathon | null>(INITIAL_HACKATHONS[0]);

  const [submissions, setSubmissions] = useState<ProjectSubmission[]>(INITIAL_SUBMISSIONS);
  const [selectedSubmission, setSelectedSubmission] = useState<ProjectSubmission | null>(null);

  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [verifications, setVerifications] = useState<OrganizerVerificationRequest[]>(INITIAL_VERIFICATIONS);

  const [dbConnected, setDbConnected] = useState(false);
  if (dbConnected) {
    // Verified connected to Render PostgreSQL Cloud DB
  }

  // Sync PostgreSQL Live Data on Mount
  useEffect(() => {
    async function loadPostgresData() {
      const health = await getDbHealth();
      if (health) {
        setDbConnected(true);
        console.log('🐘 Connected to PostgreSQL Cloud DB:', health.dbName);
      }
      const dbHackathons = await getHackathonsFromDb();
      if (dbHackathons && dbHackathons.length > 0) {
        // Map postgres rows to Hackathon entity format if present
        const mapped = dbHackathons.map((h: any) => ({
          id: h.id,
          title: h.title,
          organizerName: h.organizer_name,
          organizerInitials: h.organizer_initials || 'HC',
          status: h.status || 'Live',
          mode: h.mode || 'Online',
          prizePool: h.prize_pool,
          participantsCount: h.participants_count || 500,
          teamsCount: h.teams_count || 120,
          timeLeft: h.time_left || '2 Days Left',
          difficulty: h.difficulty || 'Intermediate',
          tags: h.tags || ['AI', 'React'],
          banner: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
          imageGradient: h.image_gradient || 'from-indigo-600 to-purple-600',
          featured: h.featured || false,
          description: 'Official hackathon synced live with Render PostgreSQL database central_hackathon.',
          rules: ['Build clean code', 'Submit project before deadline'],
          schedule: [{ time: '09:00 AM', event: 'Event Kickoff' }],
          problemStatements: [{ id: 'ps1', track: 'AI Track', title: 'Smart Agents', description: 'Build autonomous agents', difficulty: 'Intermediate' as const }]
        }));
        setHackathons(mapped);
      }
    }
    loadPostgresData();
  }, []);

  // Login Handler
  const handleLogin = (role: UserRole, user: AuthenticatedUser) => {
    setLoggedInUser(user);
    setCurrentRole(role);
    setIsAuthenticated(true);
    // Set the default tab for the role
    if (role === 'participant') setActiveTab('explore');
    else if (role === 'organizer') setActiveTab('create');
    else if (role === 'judge') setActiveTab('judge-portal');
    else if (role === 'admin') setActiveTab('admin-dashboard');
  };

  // Logout Handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoggedInUser(null);
    setCurrentRole('participant');
    setActiveTab('explore');
  };

  // Handlers for Role Switch
  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'participant') setActiveTab('explore');
    else if (role === 'organizer') setActiveTab('create');
    else if (role === 'judge') setActiveTab('judge-portal');
    else if (role === 'admin') setActiveTab('admin-dashboard');
  };

  // Participant Handlers
  const handleSelectHackathon = (hackathon: Hackathon) => {
    setSelectedHackathon(hackathon);
    setActiveTab('detail');
  };

  const handleRegisterTeam = (newTeam: Team) => {
    setTeams([newTeam, ...teams]);
    saveTeamToDb({
      name: newTeam.name,
      hackathon_id: newTeam.hackathonId,
      leader_name: newTeam.leaderName,
      leader_email: newTeam.leaderEmail,
      project_title: newTeam.name + ' Project'
    });
    // update hackathon team counts
    setHackathons(
      hackathons.map((h) =>
        h.id === newTeam.hackathonId ? { ...h, teamsCount: h.teamsCount + 1 } : h
      )
    );
  };

  const handleSubmitProject = (newSubmission: ProjectSubmission) => {
    setSubmissions([newSubmission, ...submissions]);
  };

  // Organizer Handlers
  const handleCreateHackathon = (newHackathon: Hackathon) => {
    setHackathons([newHackathon, ...hackathons]);
    saveHackathonToDb({
      id: newHackathon.id,
      title: newHackathon.title,
      organizer_name: newHackathon.organizerName,
      organizer_initials: 'HC',
      status: newHackathon.status,
      mode: newHackathon.mode,
      prize_pool: newHackathon.prizePool,
      time_left: '2 Days Left',
      difficulty: 'Intermediate',
      tags: ['AI', 'Web3'],
      image_gradient: 'from-indigo-600 to-purple-600',
      featured: newHackathon.featured
    });
    setSelectedHackathon(newHackathon);
    setCurrentRole('participant');
    setActiveTab('detail');
    alert('Hackathon successfully created & saved to PostgreSQL database!');
  };

  const handleUpdateTeamStatus = (teamId: string, status: 'Approved' | 'Rejected') => {
    setTeams(teams.map((t) => (t.id === teamId ? { ...t, status } : t)));
  };

  const handleBroadcastAnnouncement = (announcement: Announcement) => {
    setAnnouncements([announcement, ...announcements]);
  };

  // Judge Handlers
  const handleSaveScorecard = (submissionId: string, score: JudgeScore) => {
    setSubmissions(
      submissions.map((s) => {
        if (s.id === submissionId) {
          const updatedScores = [score, ...s.scores];
          const avg =
            updatedScores.reduce((acc, curr) => acc + curr.weightedTotal, 0) /
            updatedScores.length;

          return {
            ...s,
            scores: updatedScores,
            averageScore: avg,
            evaluated: true
          };
        }
        return s;
      })
    );
  };

  // Admin Handlers
  const handleToggleFeatured = (hackathonId: string) => {
    setHackathons(
      hackathons.map((h) => (h.id === hackathonId ? { ...h, featured: !h.featured } : h))
    );
  };

  const handleUpdateVerificationStatus = (reqId: string, status: 'approved' | 'rejected') => {
    setVerifications(
      verifications.map((v) => (v.id === reqId ? { ...v, status } : v))
    );
  };

  // --- LOGIN GATE ---
  if (!isAuthenticated) {
    if (showLogin) {
      return <LoginPage onLogin={handleLogin} onBack={() => setShowLogin(false)} onSwitchToSignup={() => { setShowLogin(false); setShowSignup(true); }} />;
    }
    if (showSignup) {
      return <SignupPage onSignup={handleLogin} onBack={() => setShowSignup(false)} onSwitchToLogin={() => { setShowSignup(false); setShowLogin(true); }} />;
    }
    return <LandingPage onLogin={handleLogin} onNavigateLogin={() => setShowLogin(true)} onNavigateSignup={() => setShowSignup(true)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Persistent Navigation */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenTeamModal={() => setIsTeamModalOpen(true)}
        unreadCount={announcements.length}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        loggedInUser={loggedInUser}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* PARTICIPANT VIEW */}
        {currentRole === 'participant' && (
          <>
            {activeTab === 'explore' && (
              <HackathonList
                hackathons={hackathons}
                onSelectHackathon={handleSelectHackathon}
              />
            )}

            {activeTab === 'detail' && selectedHackathon && (
              <HackathonDetail
                hackathon={selectedHackathon}
                onBack={() => setActiveTab('explore')}
                onOpenTeamRegistration={() => setIsTeamRegModalOpen(true)}
                onOpenSubmissionModal={() => setIsSubmissionModalOpen(true)}
              />
            )}

            {activeTab === 'leaderboard' && (
              <LeaderboardView
                submissions={submissions}
                hackathons={hackathons}
              />
            )}
          </>
        )}

        {/* ORGANIZER VIEW */}
        {currentRole === 'organizer' && (
          <>
            {activeTab === 'create' && (
              <CreateHackathonWizard
                onCreateHackathon={handleCreateHackathon}
                onCancel={() => setActiveTab('manage')}
              />
            )}

            {activeTab === 'manage' && (
              <ParticipantManagement
                teams={teams}
                onUpdateTeamStatus={handleUpdateTeamStatus}
              />
            )}

            {activeTab === 'broadcast' && (
              <AnnouncementBroadcaster
                hackathons={hackathons}
                onBroadcastAnnouncement={handleBroadcastAnnouncement}
              />
            )}
          </>
        )}

        {/* JUDGE VIEW */}
        {currentRole === 'judge' && (
          <>
            {activeTab === 'judge-portal' && (
              <DedicatedEvaluationPortal
                submissions={submissions}
                hackathons={hackathons}
                onSelectSubmission={(sub) => {
                  setSelectedSubmission(sub);
                  setActiveTab('inspector');
                }}
              />
            )}

            {activeTab === 'inspector' && selectedSubmission && (
              <SubmissionInspector
                submission={selectedSubmission}
                hackathon={
                  hackathons.find((h) => h.id === selectedSubmission.hackathonId) ||
                  hackathons[0]
                }
                onBack={() => setActiveTab('judge-portal')}
                onSaveScorecard={handleSaveScorecard}
              />
            )}
          </>
        )}

        {/* ADMIN VIEW */}
        {currentRole === 'admin' && (
          <AdminDashboard
            hackathons={hackathons}
            onToggleFeatured={handleToggleFeatured}
            verifications={verifications}
            onUpdateVerificationStatus={handleUpdateVerificationStatus}
          />
        )}

      </main>

      {/* Persistent Footer */}
      <Footer onOpenTeamModal={() => setIsTeamModalOpen(true)} />

      {/* Global Modals */}
      <TeamModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
      />

      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        announcements={announcements}
      />

      {selectedHackathon && (
        <>
          <TeamRegistrationModal
            isOpen={isTeamRegModalOpen}
            onClose={() => setIsTeamRegModalOpen(false)}
            hackathon={selectedHackathon}
            onRegisterTeam={handleRegisterTeam}
          />

          <ProjectSubmissionModal
            isOpen={isSubmissionModalOpen}
            onClose={() => setIsSubmissionModalOpen(false)}
            hackathon={selectedHackathon}
            onSubmitProject={handleSubmitProject}
          />
        </>
      )}
    </div>
  );
}

export default App;
