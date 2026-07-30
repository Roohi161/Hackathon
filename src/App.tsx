import { useState, useEffect } from 'react';
import { getDbHealth, getHackathonsFromDb, saveHackathonToDb, saveTeamToDb, deleteHackathonFromDb } from './services/api';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { TeamModal } from './components/TeamModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { AboutPage } from './components/landing/AboutPage';
import { ContactPage } from './components/landing/ContactPage';

// Sidebar & Layout Components
import { SidebarNavigation } from './components/layout/SidebarNavigation';

// Participant Components
import { HackathonList } from './components/participant/HackathonList';
import { HackathonDetail } from './components/participant/HackathonDetail';
import { ParticipantOnboarding } from './components/participant/ParticipantOnboarding';
import { ParticipantDashboard } from './components/participant/ParticipantDashboard';
import { ParticipantMainDashboard } from './components/participant/ParticipantMainDashboard';
import { TeamsWorkspaceView } from './components/participant/TeamsWorkspaceView';
import { ProjectWorkspaceView } from './components/participant/ProjectWorkspaceView';
import { LearningCenterView } from './components/participant/LearningCenterView';
import { CertificatesView } from './components/participant/CertificatesView';
import { CalendarView } from './components/participant/CalendarView';
import { MessagesView } from './components/participant/MessagesView';
import { SettingsView } from './components/participant/SettingsView';
import { TeamRegistrationModal } from './components/participant/TeamRegistrationModal';
import { ProjectSubmissionModal } from './components/participant/ProjectSubmissionModal';
import { LeaderboardView } from './components/participant/LeaderboardView';
import { UserProfilePage } from './components/profile/UserProfilePage';

// AI Suite Components
import { AiAssistantHub } from './components/ai/AiAssistantHub';

// Organizer Components
import { OrganizerWorkspace } from './components/organizer/OrganizerWorkspace';

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
  AuthenticatedUser,
  Hackathon,
  ProjectSubmission,
  Team,
  Announcement,
  OrganizerVerificationRequest,
  JudgeScore
} from './types';





export function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('hc_auth') === 'true';
  });
  const [loggedInUser, setLoggedInUser] = useState<AuthenticatedUser | null>(() => {
    const raw = localStorage.getItem('hc_user');
    return raw ? JSON.parse(raw) : null;
  });

  // Global State
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return (localStorage.getItem('hc_role') as UserRole) || 'participant';
  });
  const [activeTab, setActiveTab] = useState<string>(() => {
    return localStorage.getItem('hc_tab') || 'explore';
  });

  // Modals State
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isTeamRegModalOpen, setIsTeamRegModalOpen] = useState(false);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);

  // Entities State
  const [hackathons, setHackathons] = useState<Hackathon[]>(() => {
    const raw = localStorage.getItem('hc_hackathons');
    return raw ? JSON.parse(raw) : INITIAL_HACKATHONS;
  });
  const [selectedHackathon, setSelectedHackathon] = useState<Hackathon | null>(() => {
    return hackathons[0] || null;
  });

  const [submissions, setSubmissions] = useState<ProjectSubmission[]>(INITIAL_SUBMISSIONS);
  const [selectedSubmission, setSelectedSubmission] = useState<ProjectSubmission | null>(null);

  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [verifications, setVerifications] = useState<OrganizerVerificationRequest[]>(INITIAL_VERIFICATIONS);


  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('hc_auth', isAuthenticated ? 'true' : 'false');
    localStorage.setItem('hc_user', loggedInUser ? JSON.stringify(loggedInUser) : '');
    localStorage.setItem('hc_role', currentRole);
    localStorage.setItem('hc_tab', activeTab);
  }, [isAuthenticated, loggedInUser, currentRole, activeTab]);

  useEffect(() => {
    localStorage.setItem('hc_hackathons', JSON.stringify(hackathons));
  }, [hackathons]);

  // Sync PostgreSQL Live Data on Mount
  useEffect(() => {
    async function loadPostgresData() {
      const health = await getDbHealth();
      if (health) {
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
          description: 'Official hackathon synced live with Render PostgreSQL database.',
          rules: ['Build clean code', 'Submit project before deadline'],
          schedule: [{ time: '09:00 AM', event: 'Event Kickoff' }],
          problemStatements: [{ id: 'ps1', track: 'AI Track', title: 'Smart Agents', description: 'Build autonomous agents', difficulty: 'Intermediate' as const }]
        }));
        // Merge with local storage added ones
        setHackathons(prev => {
          const ids = new Set(mapped.map((x: any) => x.id));
          const localOnly = prev.filter(x => !ids.has(x.id));
          return [...localOnly, ...mapped];
        });
      }
    }
    loadPostgresData();
  }, []);

  // Login Handler
  const handleLogin = (role: UserRole, user: AuthenticatedUser) => {
    setLoggedInUser(user);
    localStorage.setItem('hackathon_user', JSON.stringify(user));
    localStorage.setItem('hackathon_is_auth', 'true');
    setCurrentRole(role);
    setIsAuthenticated(true);
    // Set the default tab for the role
    if (role === 'participant') setActiveTab('explore');
    else if (role === 'organizer') setActiveTab('overview');
    else if (role === 'judge') setActiveTab('judge-portal');
    else if (role === 'admin') setActiveTab('admin-dashboard');
  };

  // Logout Handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoggedInUser(null);
    localStorage.removeItem('hackathon_user');
    localStorage.setItem('hackathon_is_auth', 'false');
    setCurrentRole('participant');
    setActiveTab('explore');
    localStorage.clear();
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

  const handleProfileComplete = (updatedUser: AuthenticatedUser) => {
    setLoggedInUser({ ...updatedUser, profileComplete: true });
    localStorage.setItem('hc_user', JSON.stringify({ ...updatedUser, profileComplete: true }));
    setActiveTab('dashboard');
  };

  // Organizer Handlers
  const handleCreateHackathon = (newHackathon: Hackathon) => {
    // Check if modifying existing
    setHackathons(prev => {
      const exists = prev.some(h => h.id === newHackathon.id);
      if (exists) {
        return prev.map(h => h.id === newHackathon.id ? newHackathon : h);
      }
      return [newHackathon, ...prev];
    });

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
    setActiveTab('hackathons');
    alert('Hackathon successfully saved & synced to backend and database!');
  };

  const handleDeleteHackathon = (hackathonId: string) => {
    setHackathons(hackathons.filter(h => h.id !== hackathonId));
    deleteHackathonFromDb(hackathonId);
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
    if (showAbout) {
      return <AboutPage onNavigateHome={() => setShowAbout(false)} onNavigateLogin={() => setShowLogin(true)} onNavigateSignup={() => setShowSignup(true)} onNavigateContact={() => { setShowAbout(false); setShowContact(true); }} />;
    }
    if (showContact) {
      return <ContactPage onNavigateHome={() => setShowContact(false)} onNavigateLogin={() => setShowLogin(true)} onNavigateSignup={() => setShowSignup(true)} onNavigateAbout={() => { setShowContact(false); setShowAbout(true); }} />;
    }
    return <LandingPage onLogin={handleLogin} onNavigateLogin={() => setShowLogin(true)} onNavigateSignup={() => setShowSignup(true)} onNavigateAbout={() => setShowAbout(true)} onNavigateContact={() => setShowContact(true)} />;
  }

  // --- ORGANIZER ROLE FULL SCREEN VIEW BYPASS ---
  if (currentRole === 'organizer') {
    return (
      <div className="min-h-screen bg-[#F4F6FB] selection:bg-indigo-500 selection:text-white w-full">
        <OrganizerWorkspace
          hackathons={hackathons}
          teams={teams}
          submissions={submissions}
          announcements={announcements}
          onCreateHackathon={handleCreateHackathon}
          onDeleteHackathon={handleDeleteHackathon}
          onUpdateTeamStatus={handleUpdateTeamStatus}
          onBroadcastAnnouncement={handleBroadcastAnnouncement}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Persistent Navigation */}
      <Navbar
        currentRole={currentRole}

        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenTeamModal={() => setIsTeamModalOpen(true)}
        unreadCount={announcements.length}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        loggedInUser={loggedInUser}
        onLogout={handleLogout}
      />

      {/* Main Layout Wrapper */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex items-start">
        
        {/* Sidebar Navigation */}
        <SidebarNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentRole={currentRole}
          setCurrentRole={setCurrentRole}
          onLogout={handleLogout}
          userName={loggedInUser?.name}
          userAvatar={loggedInUser?.avatar}
          unreadMessagesCount={announcements.length}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          
          {/* PROFILE VIEW */}
          {activeTab === 'profile' && (
            <UserProfilePage 
              user={loggedInUser} 
              onLogout={handleLogout} 
              onUpdateUser={(updated) => setLoggedInUser((prev: AuthenticatedUser | null) => prev ? { ...prev, ...updated } : null)}
            />
          )}

          {/* SETTINGS VIEW */}
          {activeTab === 'settings' && (
            <SettingsView />
          )}

          {/* AI SUITE HUB */}
          {activeTab === 'ai-assistant' && (
            <AiAssistantHub />
          )}

          {/* PARTICIPANT VIEWS */}
          {currentRole === 'participant' && (
            <>
              {(!loggedInUser?.profileComplete && activeTab === 'onboarding') ? (
                <ParticipantOnboarding user={loggedInUser!} onComplete={handleProfileComplete} />
              ) : (
                <>
                  {activeTab === 'dashboard' && (
                    <ParticipantMainDashboard
                      user={loggedInUser!}
                      hackathons={hackathons}
                      onViewHackathon={handleSelectHackathon}
                      onNavigateTab={setActiveTab}
                    />
                  )}
                  {activeTab === 'explore' && (
                    <HackathonList
                      hackathons={hackathons}
                      onSelectHackathon={handleSelectHackathon}
                    />
                  )}
                  {activeTab === 'my-hackathons' && (
                    <ParticipantDashboard 
                      user={loggedInUser!} 
                      allHackathons={hackathons} 
                      onViewHackathon={handleSelectHackathon}
                    />
                  )}
                  {activeTab === 'teams' && (
                    <TeamsWorkspaceView />
                  )}
                  {activeTab === 'projects' && (
                    <ProjectWorkspaceView />
                  )}
                  {activeTab === 'learning' && (
                    <LearningCenterView />
                  )}
                  {activeTab === 'certificates' && (
                    <CertificatesView />
                  )}
                  {activeTab === 'calendar' && (
                    <CalendarView />
                  )}
                  {activeTab === 'messages' && (
                    <MessagesView />
                  )}
                  {activeTab === 'detail' && selectedHackathon && (
                    <HackathonDetail
                      hackathon={selectedHackathon}
                      onBack={() => setActiveTab('dashboard')}
                      onOpenTeamRegistration={() => setIsTeamRegModalOpen(true)}
                      onOpenSubmissionModal={() => setIsSubmissionModalOpen(true)}
                    />
                  )}
                </>
              )}
              {activeTab === 'leaderboard' && (
                <LeaderboardView
                  submissions={submissions}
                  hackathons={hackathons}
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
      </div>

      {/* Persistent Footer */}
      <Footer
        onOpenTeamModal={() => setIsTeamModalOpen(true)}
        onNavigate={(tab, role) => {
          setCurrentRole(role);
          setActiveTab(tab);
        }}
      />

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
