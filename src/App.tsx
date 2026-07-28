import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { TeamModal } from './components/TeamModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { AboutPage } from './components/landing/AboutPage';
import { ContactPage } from './components/landing/ContactPage';
import { Toast } from './components/Toast';
import type { ToastType } from './components/Toast';
import { UserProfilePage } from './components/profile/UserProfilePage';
import { AnimatePresence } from 'framer-motion';

// Participant Components
import { HackathonList } from './components/participant/HackathonList';
import { HackathonDetail } from './components/participant/HackathonDetail';
import { ParticipantOnboarding } from './components/participant/ParticipantOnboarding';
import { ParticipantDashboard } from './components/participant/ParticipantDashboard';
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

import api from './services/api';

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

// Authenticated user type
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
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  
  // Toast State
  const [toasts, setToasts] = useState<{id: string, message: string, type: ToastType}[]>([]);

  const addToast = (message: string, type: ToastType = 'info') => {
    setToasts(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), message, type }]);
  };
  
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Entities State
  const [hackathons, setHackathons] = useState<Hackathon[]>(INITIAL_HACKATHONS);
  const [selectedHackathon, setSelectedHackathon] = useState<Hackathon | null>(INITIAL_HACKATHONS[0]);

  const [submissions, setSubmissions] = useState<ProjectSubmission[]>(INITIAL_SUBMISSIONS);
  const [selectedSubmission, setSelectedSubmission] = useState<ProjectSubmission | null>(null);

  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [verifications, setVerifications] = useState<OrganizerVerificationRequest[]>(INITIAL_VERIFICATIONS);

  // Fetch initial data from backend API
  useEffect(() => {
    const fetchApiData = async () => {
      try {
        const [hacksRes, teamsRes, subsRes, annRes] = await Promise.all([
          api.get('/hackathons').catch(() => null),
          api.get('/teams').catch(() => null),
          api.get('/submissions').catch(() => null),
          api.get('/announcements').catch(() => null)
        ]);
        
        if (hacksRes?.data?.length) setHackathons(hacksRes.data);
        if (teamsRes?.data?.length) setTeams(teamsRes.data);
        if (subsRes?.data?.length) setSubmissions(subsRes.data);
        if (annRes?.data?.length) setAnnouncements(annRes.data);
      } catch (err) {
        console.warn('Backend not reachable or data missing. Using local mock data fallback.', err);
      }
    };
    
    fetchApiData();
  }, []);

  // Login Handler
  const handleLogin = (role: UserRole, user: AuthenticatedUser) => {
    setLoggedInUser(user);
    setCurrentRole(role);
    setIsAuthenticated(true);
    setShowLogin(false);
    
    // Default routing based on role
    if (role === 'participant') {
      setActiveTab(user.profileComplete ? 'dashboard' : 'onboarding');
    } else if (role === 'organizer') {
      setActiveTab('organizer');
    } else if (role === 'admin') {
      setActiveTab('admin');
    } else {
      setActiveTab('dashboard');
    }
    
    addToast('Successfully signed in!', 'success');
  };

  const handleProfileComplete = (updatedUser: AuthenticatedUser) => {
    setLoggedInUser(updatedUser);
    setActiveTab('dashboard');
    addToast('Profile completed successfully!', 'success');
  };

  // Logout Handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoggedInUser(null);
    setCurrentRole('participant');
    setActiveTab('explore');
  };

  // Participant Handlers


  const handleRegisterTeam = async (newTeam: Team) => {
    setTeams((prev) => [newTeam, ...prev]);
    setHackathons((prev) =>
      prev.map((h) =>
        h.id === newTeam.hackathonId
          ? { ...h, teamsCount: h.teamsCount + 1, participantsCount: h.participantsCount + newTeam.members.length }
          : h
      )
    );
    addToast(`Team "${newTeam.name}" registered successfully!`, 'success');
    try {
      await api.post('/api/teams', {
        name: newTeam.name,
        hackathon_id: newTeam.hackathonId,
        leader_name: newTeam.leaderName,
        leader_email: newTeam.leaderEmail,
        project_title: `${newTeam.name} Project`
      });
    } catch (e) {
      // Fallback
    }
  };

  const handleSubmitProject = (newSubmission: ProjectSubmission) => {
    setSubmissions([newSubmission, ...submissions]);
  };

  // Organizer Handlers
  const handleCreateHackathon = (newHackathon: Hackathon) => {
    setHackathons([newHackathon, ...hackathons]);
    setSelectedHackathon(newHackathon);
    setCurrentRole('participant');
    setActiveTab('detail');
    addToast('Hackathon successfully created & published to central directory!', 'success');
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

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        
        {/* PROFILE VIEW */}
        {activeTab === 'profile' && (
          <UserProfilePage 
            user={loggedInUser} 
            onLogout={handleLogout} 
            onUpdateUser={(updated) => setLoggedInUser((prev: AuthenticatedUser | null) => prev ? { ...prev, ...updated } : null)}
          />
        )}
        
        {/* PARTICIPANT VIEW */}
        {currentRole === 'participant' && (
          <>
            {(!loggedInUser?.profileComplete && activeTab === 'onboarding') ? (
              <ParticipantOnboarding user={loggedInUser!} onComplete={handleProfileComplete} />
            ) : (
              <>
                {activeTab === 'dashboard' && (
                  <ParticipantDashboard 
                    user={loggedInUser!} 
                    allHackathons={hackathons} 
                    onViewHackathon={(h) => {
                      setSelectedHackathon(h);
                      setActiveTab('detail');
                    }}
                  />
                )}
                {activeTab === 'explore' && (
                  <HackathonList
                    hackathons={hackathons}
                    onSelectHackathon={(h) => {
                      setSelectedHackathon(h);
                      setActiveTab('detail');
                    }}
                  />
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

      {/* Global Toasts */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <Toast key={toast.id} {...toast} onClose={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
