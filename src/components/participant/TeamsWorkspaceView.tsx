import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  Send,
  Crown,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  UserPlus,
  UserX,
  LogOut,
  X,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  Clock,
  AlertCircle,
  BarChart2,
  Layers,
  Calendar,
  Edit2,
  FileSpreadsheet,
  Check,
  Bell,
  CheckCheck
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useNotificationStore } from '../../stores/notificationStore';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  joinedDate: string;
  status: 'Active' | 'Pending' | 'Offline';
  isLeader: boolean;
}

export interface BulletPoint {
  id: string;
  text: string;
  isDone: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  status: 'Completed' | 'Pending' | 'Not Completed';
  assignee: string;
  assigneeEmail: string;
  createdAt: string; // Date & Time
  isToday: boolean;
  bullets: BulletPoint[];
}

export interface TeamItem {
  id: string;
  name: string;
  hackathonName: string;
  memberCount: number;
  maxMembers: number;
  leaderName: string;
  leaderEmail: string;
  status: 'Active' | 'Recruiting' | 'Submitted';
  progress: number;
  isRegisteredForHackathon: boolean;
  members: TeamMember[];
}

export const TeamsWorkspaceView: React.FC = () => {
  const currentUser = useAuthStore((s) => s.user);
  const addAnnouncement = useNotificationStore((s) => s.addAnnouncement);

  // Registered Hackathons List for Filtering Teams
  const REGISTERED_HACKATHONS = [
    'All Hackathons',
    'AI Hackathon 2026',
    'Quantum FinTech Challenge',
    'HealthTech AI Summit',
    'Cyber Security Summit 2026'
  ];

  const [selectedHackathonFilter, setSelectedHackathonFilter] = useState<string>('All Hackathons');

  // Distinct Color Palette for Team Member Cards
  const MEMBER_CARD_THEMES = [
    { bg: 'bg-indigo-50/90 border-indigo-200/80 text-indigo-900', badge: 'bg-indigo-600 text-white', avatar: 'from-indigo-600 to-indigo-800' },
    { bg: 'bg-emerald-50/90 border-emerald-200/80 text-emerald-900', badge: 'bg-emerald-600 text-white', avatar: 'from-emerald-600 to-teal-700' },
    { bg: 'bg-violet-50/90 border-violet-200/80 text-violet-900', badge: 'bg-violet-600 text-white', avatar: 'from-violet-600 to-purple-700' },
    { bg: 'bg-amber-50/90 border-amber-200/80 text-amber-900', badge: 'bg-amber-600 text-white', avatar: 'from-amber-600 to-amber-800' },
    { bg: 'bg-sky-50/90 border-sky-200/80 text-sky-900', badge: 'bg-sky-600 text-white', avatar: 'from-sky-600 to-blue-700' }
  ];

  // Default Account Contacts available for adding/inviting
  const ACCOUNT_CONTACTS = [
    { name: 'Roohi', email: 'roohi@hackathon.com', role: 'Database Architect' },
    { name: 'Ansar', email: 'ansar@hackathon.com', role: 'AI & ML Specialist' },
    { name: 'Bhavya', email: 'bhavya@hackathon.com', role: 'Frontend Engineer' },
    { name: 'Rohan Sharma', email: 'rohan@hackathon.com', role: 'QA & Integration' },
    { name: 'Priya Patel', email: 'priya@hackathon.com', role: 'UI/UX Designer' },
    { name: 'Participant User', email: 'participant@hackathon.com', role: 'Full Stack Hacker' }
  ];

  // Teams State initialized dynamically to ensure user-scoped data for newly signed-in participants
  const [teams, setTeams] = useState<TeamItem[]>(() => {
    const userEmail = (currentUser?.email || 'participant@hackathon.com').toLowerCase();
    const userName = currentUser?.name || 'Participant User';

    // Default seed teams
    const seedTeams: TeamItem[] = [
      {
        id: 'team-1',
        name: 'Alpha Coders',
        hackathonName: 'AI Hackathon 2026',
        memberCount: 4,
        maxMembers: 5,
        leaderName: 'Roohi',
        leaderEmail: 'roohi@hackathon.com',
        status: 'Active',
        progress: 75,
        isRegisteredForHackathon: true,
        members: [
          { id: 'm-1', name: 'Roohi', email: 'roohi@hackathon.com', role: 'Team Leader & DB Architect', joinedDate: 'Aug 01, 2026', status: 'Active', isLeader: true },
          { id: 'm-2', name: 'Ansar', email: 'ansar@hackathon.com', role: 'AI & ML Engineer', joinedDate: 'Aug 01, 2026', status: 'Active', isLeader: false },
          { id: 'm-3', name: 'Bhavya', email: 'bhavya@hackathon.com', role: 'Frontend & UI Specialist', joinedDate: 'Aug 02, 2026', status: 'Active', isLeader: false },
          { id: 'm-4', name: userName, email: userEmail, role: 'Full Stack Hacker', joinedDate: 'Aug 02, 2026', status: 'Active', isLeader: false }
        ]
      },
      {
        id: 'team-2',
        name: 'Quantum Innovators',
        hackathonName: 'Quantum FinTech Challenge',
        memberCount: 3,
        maxMembers: 5,
        leaderName: userName,
        leaderEmail: userEmail,
        status: 'Recruiting',
        progress: 40,
        isRegisteredForHackathon: true,
        members: [
          { id: 'm-5', name: userName, email: userEmail, role: 'Lead Developer', joinedDate: 'Aug 03, 2026', status: 'Active', isLeader: true },
          { id: 'm-6', name: 'Priya Patel', email: 'priya@hackathon.com', role: 'UI/UX Designer', joinedDate: 'Aug 03, 2026', status: 'Active', isLeader: false },
          { id: 'm-7', name: 'Ansar', email: 'ansar@hackathon.com', role: 'Smart Contract Dev', joinedDate: 'Aug 03, 2026', status: 'Pending', isLeader: false }
        ]
      }
    ];

    // If new participant signs in, create a dedicated new team for them
    if (userEmail !== 'participant@hackathon.com' && userEmail !== 'roohi@hackathon.com') {
      return [
        {
          id: `team-${Date.now()}`,
          name: `${userName}'s Squad`,
          hackathonName: 'AI Hackathon 2026',
          memberCount: 1,
          maxMembers: 5,
          leaderName: userName,
          leaderEmail: userEmail,
          status: 'Active',
          progress: 20,
          isRegisteredForHackathon: true,
          members: [
            { id: `m-${Date.now()}`, name: userName, email: userEmail, role: 'Team Leader', joinedDate: 'Aug 03, 2026', status: 'Active', isLeader: true }
          ]
        }
      ];
    }

    return seedTeams;
  });

  // Filter teams based on top hackathon selection
  const availableTeams = selectedHackathonFilter === 'All Hackathons'
    ? teams
    : teams.filter(t => t.hackathonName === selectedHackathonFilter);

  const [selectedTeamId, setSelectedTeamId] = useState<string>(availableTeams[0]?.id || 'team-1');
  
  // Set default tab to 'members' so Member Roster is rendered FIRST
  const [activeTab, setActiveTab] = useState<'members' | 'overview' | 'kanban'>('members');

  // Floating Bottom Chat Bar State
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Member Table Filter States
  const [memberSearch, setMemberSearch] = useState('');
  const [memberStatusFilter, setMemberStatusFilter] = useState<'All' | 'Active' | 'Pending' | 'Offline'>('All');
  const [sortBy, setSortBy] = useState<'AZ' | 'Role' | 'Date'>('AZ');

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  // Modal for Viewing Member Tasks
  const [viewTasksMember, setViewTasksMember] = useState<TeamMember | null>(null);

  // Modal for Past Historical Data Sheet
  const [showPastDataSheetModal, setShowPastDataSheetModal] = useState(false);
  const [pastDataSearch, setPastDataSearch] = useState('');

  // Modal for Adding Clean Multi-Bullet Tasks for a Specific Member
  const [taskModalMember, setTaskModalMember] = useState<TeamMember | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [bulletInputs, setBulletInputs] = useState<string[]>(['']);

  // Modal for Asking "Which tasks are not completed?" when status marked Not Completed
  const [notCompletedPromptTask, setNotCompletedPromptTask] = useState<TaskItem | null>(null);

  // Modal for Modifying / Editing Task Details
  const [editTaskItem, setEditTaskItem] = useState<TaskItem | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');

  // Selected Member Filter for Task Board
  const [selectedMemberForBoard, setSelectedMemberForBoard] = useState<string>('All Members');

  // Form Inputs for Create / Add Member
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamHackathon, setNewTeamHackathon] = useState('AI Hackathon 2026');

  const [inviteMemberName, setInviteMemberName] = useState('');
  const [inviteMemberEmail, setInviteMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Developer');

  // Chat Messages State
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Roohi', senderEmail: 'roohi@hackathon.com', text: 'Hey team! Let\'s lock down the architecture for our AI pipeline.', time: '10:14 AM', isLeader: true },
    { id: 2, sender: 'Ansar', senderEmail: 'ansar@hackathon.com', text: 'I completed the ML model training and embeddings API routes!', time: '10:16 AM', isLeader: false },
    { id: 3, sender: 'Bhavya', senderEmail: 'bhavya@hackathon.com', text: 'Frontend UI layout is synced with Tailwind CSS and Sora typography!', time: '10:25 AM', isLeader: false }
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Rich Historical Tasks Dataset with Date & Time, Assignees, Action Items, & Results
  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: 't1',
      title: 'Backend REST API & ML Embeddings Integration',
      status: 'Pending',
      assignee: 'Ansar',
      assigneeEmail: 'ansar@hackathon.com',
      createdAt: 'Aug 03, 2026 at 10:15 AM',
      isToday: true,
      bullets: [
        { id: 'b1', text: 'Configure FastAPI endpoints for vector retrieval', isDone: true },
        { id: 'b2', text: 'Benchmark cosine similarity performance', isDone: false },
        { id: 'b3', text: 'Connect PostgreSQL pgvector extension', isDone: false }
      ]
    },
    {
      id: 't2',
      title: 'React Dashboard UI & Sora Font Systems',
      status: 'Pending',
      assignee: 'Bhavya',
      assigneeEmail: 'bhavya@hackathon.com',
      createdAt: 'Aug 03, 2026 at 11:30 AM',
      isToday: true,
      bullets: [
        { id: 'b4', text: 'Import Google Sora & Plus Jakarta Sans typography', isDone: true },
        { id: 'b5', text: 'Build responsive grid for member cards', isDone: true },
        { id: 'b6', text: 'Add interactive task audit bar chart', isDone: false }
      ]
    },
    {
      id: 't3',
      title: 'JWT Authentication & Role Access Verification',
      status: 'Not Completed',
      assignee: 'Roohi',
      assigneeEmail: 'roohi@hackathon.com',
      createdAt: 'Aug 03, 2026 at 09:00 AM',
      isToday: true,
      bullets: [
        { id: 'b7', text: 'Implement OAuth refresh token middleware', isDone: false },
        { id: 'b8', text: 'Enforce team registered member write access', isDone: true }
      ]
    },
    {
      id: 't4',
      title: 'PostgreSQL Database Migrations & Schema Audit',
      status: 'Completed',
      assignee: 'Roohi',
      assigneeEmail: 'roohi@hackathon.com',
      createdAt: 'Aug 02, 2026 at 04:45 PM',
      isToday: false, // Past Data
      bullets: [
        { id: 'b9', text: 'Create initial database schema for teams and members', isDone: true },
        { id: 'b10', text: 'Run seed script for hackathon dummy data', isDone: true }
      ]
    },
    {
      id: 't5',
      title: 'Participant Portal UI & Hackathon Card Polish',
      status: 'Completed',
      assignee: 'Participant User',
      assigneeEmail: 'participant@hackathon.com',
      createdAt: 'Aug 03, 2026 at 02:20 PM',
      isToday: true,
      bullets: [
        { id: 'b11', text: 'Refine top hero background rotating carousel', isDone: true },
        { id: 'b12', text: 'Add edge-to-edge layout padding adjustments', isDone: true }
      ]
    },
    {
      id: 't6',
      title: 'Initial Hackathon Brainstorming & AI Pipeline Architecture',
      status: 'Completed',
      assignee: 'Roohi',
      assigneeEmail: 'roohi@hackathon.com',
      createdAt: 'Aug 01, 2026 at 02:00 PM',
      isToday: false, // Past Data
      bullets: [
        { id: 'b13', text: 'Draft problem statement for AI Judge portal', isDone: true },
        { id: 'b14', text: 'Choose Tech Stack (React + Vite + Tailwind)', isDone: true }
      ]
    },
    {
      id: 't7',
      title: 'UI Mockups & Color System Selection',
      status: 'Completed',
      assignee: 'Priya Patel',
      assigneeEmail: 'priya@hackathon.com',
      createdAt: 'Aug 01, 2026 at 05:30 PM',
      isToday: false, // Past Data
      bullets: [
        { id: 'b15', text: 'Design glassmorphism cards for member workspace', isDone: true },
        { id: 'b16', text: 'Create color themes for team cards', isDone: true }
      ]
    }
  ]);

  // Active Team Object
  const currentTeam = availableTeams.find(t => t.id === selectedTeamId) || availableTeams[0] || teams[0];

  // Registered Participant Permission Check
  const isCurrentUserTeamMember = currentTeam.members.some(
    m => m.email.toLowerCase() === (currentUser?.email || 'participant@hackathon.com').toLowerCase()
  );

  // Compute Task Review Stats for Today's tasks
  const todayTasks = tasks.filter(t => t.isToday);
  const pastTasks = tasks.filter(t => !t.isToday);

  const displayedBoardTasks = selectedMemberForBoard === 'All Members'
    ? todayTasks
    : todayTasks.filter(t => t.assignee.toLowerCase() === selectedMemberForBoard.toLowerCase() || t.assigneeEmail.toLowerCase() === selectedMemberForBoard.toLowerCase());

  const filteredPastTasksSheet = pastTasks.filter(t =>
    t.title.toLowerCase().includes(pastDataSearch.toLowerCase()) ||
    t.assignee.toLowerCase().includes(pastDataSearch.toLowerCase()) ||
    t.createdAt.toLowerCase().includes(pastDataSearch.toLowerCase()) ||
    t.status.toLowerCase().includes(pastDataSearch.toLowerCase())
  );

  const getMemberTaskStats = (email: string) => {
    const memberTasks = todayTasks.filter(t => t.assigneeEmail.toLowerCase() === email.toLowerCase());
    const completed = memberTasks.filter(t => t.status === 'Completed').length;
    const pending = memberTasks.filter(t => t.status === 'Pending').length;
    const notCompleted = memberTasks.filter(t => t.status === 'Not Completed').length;
    const total = memberTasks.length;
    const completedPct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { memberTasks, completed, pending, notCompleted, total, completedPct };
  };

  // Handle Enter Key in Add Task Modal to Automatically Direct Focus to the Next Bullet Point Input Line
  const handleBulletKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const updated = [...bulletInputs];
      updated.splice(index + 1, 0, '');
      setBulletInputs(updated);

      setTimeout(() => {
        const nextInput = document.getElementById(`bullet-input-${index + 1}`);
        if (nextInput) {
          (nextInput as HTMLInputElement).focus();
        }
      }, 50);
    }
  };

  // Submit New Task
  const handleSaveIndividualTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskModalMember || !taskTitle.trim()) return;

    if (!isCurrentUserTeamMember) {
      alert('Only registered team members can add tasks!');
      return;
    }

    const cleanBullets: BulletPoint[] = bulletInputs
      .filter(b => b.trim().length > 0)
      .map((bText, idx) => ({
        id: `b-${Date.now()}-${idx}`,
        text: bText.trim(),
        isDone: false
      }));

    const nowStr = 'Aug 03, 2026 at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newTask: TaskItem = {
      id: `t-${Date.now()}`,
      title: taskTitle.trim(),
      status: 'Pending',
      assignee: taskModalMember.name,
      assigneeEmail: taskModalMember.email,
      createdAt: nowStr,
      isToday: true,
      bullets: cleanBullets.length > 0 ? cleanBullets : [{ id: `b-${Date.now()}`, text: taskTitle.trim(), isDone: false }]
    };

    setTasks([newTask, ...tasks]);
    setTaskTitle('');
    setBulletInputs(['']);
    setTaskModalMember(null);
  };

  // Toggle Bullet Done State
  const handleToggleBulletDone = (taskId: string, bulletId: string) => {
    if (!isCurrentUserTeamMember) {
      alert('Only registered team members can update task points!');
      return;
    }

    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        const updatedBullets = t.bullets.map(b => b.id === bulletId ? { ...b, isDone: !b.isDone } : b);
        const allDone = updatedBullets.length > 0 && updatedBullets.every(b => b.isDone);
        return {
          ...t,
          bullets: updatedBullets,
          status: allDone ? 'Completed' : t.status
        };
      }
      return t;
    }));
  };

  // Handle Task Status Change with End-of-Day Inquiry Prompt
  const handleUpdateTaskStatus = (taskId: string, newStatus: 'Completed' | 'Pending' | 'Not Completed') => {
    if (!isCurrentUserTeamMember) {
      alert('Only registered team members can update task status!');
      return;
    }

    const targetTask = tasks.find(t => t.id === taskId);

    if (newStatus === 'Not Completed' && targetTask) {
      setNotCompletedPromptTask(targetTask);
    } else {
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    }
  };

  // Save Edit Task Details
  const handleSaveEditTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTaskItem || !editTaskTitle.trim()) return;

    setTasks(tasks.map(t => t.id === editTaskItem.id ? { ...t, title: editTaskTitle.trim() } : t));
    setEditTaskItem(null);
  };

  // Handle Create Team
  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    const newTeam: TeamItem = {
      id: `team-${Date.now()}`,
      name: newTeamName,
      hackathonName: newTeamHackathon,
      memberCount: 1,
      maxMembers: 5,
      leaderName: currentUser?.name || 'Participant User',
      leaderEmail: currentUser?.email || 'participant@hackathon.com',
      status: 'Recruiting',
      progress: 10,
      isRegisteredForHackathon: true,
      members: [
        {
          id: `m-${Date.now()}`,
          name: currentUser?.name || 'Participant User',
          email: currentUser?.email || 'participant@hackathon.com',
          role: 'Team Leader',
          joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          status: 'Active',
          isLeader: true
        }
      ]
    };

    setTeams([newTeam, ...teams]);
    setSelectedTeamId(newTeam.id);
    setNewTeamName('');
    setIsCreateModalOpen(false);
  };

  // Handle Add/Invite Member WITH REAL-TIME NOTIFICATION INVITATION SENT
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteMemberName.trim() || !inviteMemberEmail.trim()) return;

    if (!isCurrentUserTeamMember) {
      alert('Only registered team members can modify team data!');
      return;
    }

    if (currentTeam.members.some(m => m.email.toLowerCase() === inviteMemberEmail.toLowerCase())) {
      alert(`${inviteMemberName} (${inviteMemberEmail}) is already a member of ${currentTeam.name}!`);
      return;
    }

    // Add Pending Member to Team State awaiting acceptance
    const newMember: TeamMember = {
      id: `m-${Date.now()}`,
      name: inviteMemberName.trim(),
      email: inviteMemberEmail.trim().toLowerCase(),
      role: newMemberRole.trim() || 'Core Developer',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: 'Pending', // Pending until accepted
      isLeader: false
    };

    setTeams(teams.map(t => {
      if (t.id === currentTeam.id) {
        return {
          ...t,
          memberCount: t.members.length + 1,
          members: [...t.members, newMember]
        };
      }
      return t;
    }));

    // Trigger Notification Announcement for the Invited User to Accept Invitation
    addAnnouncement({
      id: `ann-inv-${Date.now()}`,
      hackathonId: currentTeam.hackathonName,
      hackathonTitle: currentTeam.hackathonName,
      title: `📬 Team Invitation Received: Join ${currentTeam.name}`,
      content: `${currentUser?.name || 'Team Leader'} has invited ${inviteMemberName} (${inviteMemberEmail}) to join team "${currentTeam.name}" for ${currentTeam.hackathonName} as ${newMember.role}. Click Notification drawer to accept!`,
      priority: 'HIGH',
      isPinned: true,
      createdAt: 'Just now',
      timestamp: 'Just now',
      type: 'info'
    });

    alert(`Invitation sent to ${inviteMemberName} (${inviteMemberEmail})! An invitation alert has been pushed to their Notifications badge to accept.`);

    setInviteMemberName('');
    setInviteMemberEmail('');
    setNewMemberRole('Developer');
    setIsAddMemberModalOpen(false);
  };

  // Handle Accept Invitation from Notification
  const handleAcceptMemberInvitation = (memberId: string) => {
    setTeams(teams.map(t => {
      if (t.id === currentTeam.id) {
        return {
          ...t,
          members: t.members.map(m => m.id === memberId ? { ...m, status: 'Active' } : m)
        };
      }
      return t;
    }));
    alert('Invitation accepted! The member is now active in the team.');
  };

  // Handle Remove Member
  const handleRemoveMember = (memberId: string, memberName: string) => {
    if (!isCurrentUserTeamMember) {
      alert('Only registered team members can modify team data!');
      return;
    }
    if (!confirm(`Are you sure you want to remove ${memberName} from ${currentTeam.name}?`)) return;

    setTeams(teams.map(t => {
      if (t.id === currentTeam.id) {
        const updated = t.members.filter(m => m.id !== memberId);
        return {
          ...t,
          memberCount: updated.length,
          members: updated
        };
      }
      return t;
    }));
  };

  // Handle Make Team Lead
  const handleMakeLead = (memberId: string, memberName: string) => {
    if (!isCurrentUserTeamMember) {
      alert('Only registered team members can modify team data!');
      return;
    }
    if (!confirm(`Promote ${memberName} to Team Leader of ${currentTeam.name}? They will receive the Team Lead Crown 👑`)) return;

    setTeams(teams.map(t => {
      if (t.id === currentTeam.id) {
        const targetMember = t.members.find(m => m.id === memberId);
        return {
          ...t,
          leaderName: memberName,
          leaderEmail: targetMember ? targetMember.email : t.leaderEmail,
          members: t.members.map(m => ({
            ...m,
            isLeader: m.id === memberId,
            role: m.id === memberId ? 'Team Leader 👑' : (m.isLeader ? 'Core Member' : m.role)
          }))
        };
      }
      return t;
    }));
  };

  // Handle Change Member Role
  const handleChangeRole = (memberId: string, currentRoleStr: string) => {
    if (!isCurrentUserTeamMember) {
      alert('Only registered team members can modify team data!');
      return;
    }
    const newRole = prompt('Enter new role for this member:', currentRoleStr);
    if (!newRole || !newRole.trim()) return;

    setTeams(teams.map(t => {
      if (t.id === currentTeam.id) {
        return {
          ...t,
          members: t.members.map(m => m.id === memberId ? { ...m, role: newRole.trim() } : m)
        };
      }
      return t;
    }));
  };

  // Handle Leave Team
  const handleLeaveTeam = () => {
    if (!confirm(`Are you sure you want to leave ${currentTeam.name}?`)) return;

    const remaining = teams.filter(t => t.id !== currentTeam.id);
    if (remaining.length > 0) {
      setTeams(remaining);
      setSelectedTeamId(remaining[0].id);
    } else {
      alert('You have left all teams.');
    }
  };

  // Chat Send
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const senderName = currentUser?.name || 'Participant User';
    const senderEmail = currentUser?.email || 'participant@hackathon.com';
    const isLeader = currentTeam.members.some(m => m.email.toLowerCase() === senderEmail.toLowerCase() && m.isLeader);

    setMessages([
      ...messages,
      {
        id: Date.now(),
        sender: senderName,
        senderEmail: senderEmail,
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isLeader: isLeader
      }
    ]);
    setNewMessage('');
  };

  // Filter & Sort Members
  const filteredMembers = (currentTeam?.members || [])
    .filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
                            m.email.toLowerCase().includes(memberSearch.toLowerCase()) ||
                            m.role.toLowerCase().includes(memberSearch.toLowerCase());
      const matchesStatus = memberStatusFilter === 'All' || m.status === memberStatusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'AZ') return a.name.localeCompare(b.name);
      if (sortBy === 'Role') return a.role.localeCompare(b.role);
      return b.joinedDate.localeCompare(a.joinedDate);
    });

  return (
    <div className="space-y-6 animate-fadeIn relative z-10 pb-24">
      
      {/* TOP DUAL HACKATHON & TEAM SELECTOR BAR */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-2xs">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight font-heading">Teams Workspace</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {availableTeams.length} Enrolled Teams
                </span>
              </div>
              <p className="text-xs font-normal text-slate-500">Invitations trigger real-time notification alerts. Clean past historical data sheet preserves clean text.</p>
            </div>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
          >
            <Plus className="w-4 h-4" /> Create Team
          </button>
        </div>

        {/* Dual Selectors: 1) Select Hackathon  2) Select Team */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-indigo-600" /> Filter Registered Hackathon:
            </label>
            <select
              value={selectedHackathonFilter}
              onChange={(e) => {
                const newHackathon = e.target.value;
                setSelectedHackathonFilter(newHackathon);
                const matching = newHackathon === 'All Hackathons' ? teams : teams.filter(t => t.hackathonName === newHackathon);
                if (matching.length > 0) setSelectedTeamId(matching[0].id);
              }}
              className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {REGISTERED_HACKATHONS.map((h, i) => (
                <option key={i} value={h}>{h}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-indigo-600" /> Active Hackathon Team:
            </label>
            <select
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {availableTeams.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.hackathonName})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Active Team Summary Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/30 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {currentTeam.status}
            </span>
            <span className="text-xs text-indigo-300 font-medium">{currentTeam.hackathonName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-heading">{currentTeam.name}</h1>
          <p className="text-xs text-slate-300 font-normal flex items-center gap-1.5 flex-wrap">
            Team Leader: <span className="inline-flex items-center gap-1 text-white font-semibold"><Crown className="w-3.5 h-3.5 text-amber-400" /> {currentTeam.leaderName} ({currentTeam.leaderEmail})</span> • {currentTeam.memberCount} of {currentTeam.maxMembers} Members
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsAddMemberModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" /> Add / Invite Member
          </button>
          <button
            onClick={handleLeaveTeam}
            className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-semibold border border-red-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Leave Team
          </button>
        </div>
      </div>

      {/* Workspace Sub-Tab Navigation (PLACING MEMBER ROSTER FIRST) */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs w-fit">
        <button
          onClick={() => setActiveTab('members')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'members' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Members Roster ({currentTeam.members.length})
        </button>
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Person Cards & Today's Reviews
        </button>
        <button
          onClick={() => setActiveTab('kanban')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'kanban' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Today's Task Board ({todayTasks.length})
        </button>
      </div>

      {/* TAB 1: MEMBERS ROSTER TABLE (STARTING VIEW) */}
      {activeTab === 'members' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-2 border-b border-slate-100">
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search member name, email or role..."
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={memberStatusFilter}
                  onChange={(e: any) => setMemberStatusFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-50 border border-slate-200 text-slate-700 outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-50 border border-slate-200 text-slate-700 outline-none"
                >
                  <option value="AZ">Sort A-Z</option>
                  <option value="Role">Sort by Role</option>
                  <option value="Date">Sort by Date</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-50/50">
                  <th className="py-3 px-4">Member & Email</th>
                  <th className="py-3 px-4">Role / Post</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4">Invitation Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-bold flex items-center justify-center text-xs relative">
                        {m.name.charAt(0)}
                        {m.isLeader && (
                          <div className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 p-0.5 rounded-full border border-white" title="Team Lead Crown">
                            <Crown className="w-2.5 h-2.5 fill-amber-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span>{m.name}</span>
                          {m.isLeader && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              <Crown className="w-3 h-3 text-amber-500 fill-amber-400" /> Lead
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-normal block">{m.email}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-normal">{m.role}</td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">{m.joinedDate}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 w-fit ${
                        m.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        m.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {m.status === 'Pending' && <Bell className="w-3 h-3 text-amber-500 animate-bounce" />}
                        {m.status === 'Pending' ? 'Invitation Sent (Pending Accept)' : m.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {m.status === 'Pending' && (
                          <button
                            onClick={() => handleAcceptMemberInvitation(m.id)}
                            className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg cursor-pointer flex items-center gap-1 shadow-2xs"
                          >
                            <Check className="w-3 h-3" /> Accept Invitation
                          </button>
                        )}
                        {!m.isLeader && (
                          <button
                            onClick={() => handleMakeLead(m.id, m.name)}
                            className="px-2.5 py-1 text-[11px] font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg border border-amber-200 cursor-pointer flex items-center gap-1"
                            title="Make Team Lead"
                          >
                            <Crown className="w-3 h-3 text-amber-500" /> Make Lead
                          </button>
                        )}
                        <button
                          onClick={() => handleChangeRole(m.id, m.role)}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg cursor-pointer"
                          title="Change Role"
                        >
                          Change Role
                        </button>
                        {!m.isLeader && (
                          <button
                            onClick={() => handleRemoveMember(m.id, m.name)}
                            className="px-2 py-1 text-[11px] font-semibold bg-red-50 text-red-600 hover:bg-red-100 rounded-lg cursor-pointer"
                            title="Remove Member"
                          >
                            <UserX className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PERSON CARDS WITH TODAY'S TASK STATS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" /> Team Member Profile Cards (Showing Today's Updates Only)
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentTeam.members.map((mem, index) => {
                const theme = MEMBER_CARD_THEMES[index % MEMBER_CARD_THEMES.length];
                const stats = getMemberTaskStats(mem.email);

                return (
                  <div
                    key={mem.id}
                    className={`p-5 rounded-3xl border shadow-sm space-y-4 transition-all hover:-translate-y-1 flex flex-col justify-between cursor-pointer ${theme.bg}`}
                    onClick={() => {
                      setViewTasksMember(mem);
                    }}
                  >
                    <div className="space-y-3">
                      {/* Avatar & Leader Crown */}
                      <div className="flex items-center justify-between">
                        <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${theme.avatar} text-white font-bold flex items-center justify-center text-sm shadow-xs relative`}>
                          {mem.name.charAt(0)}
                          {mem.isLeader && (
                            <div className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 p-0.5 rounded-full border border-white" title="Team Lead Crown">
                              <Crown className="w-3 h-3 fill-amber-400" />
                            </div>
                          )}
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${theme.badge}`}>
                          {mem.isLeader ? 'Team Lead 👑' : mem.status}
                        </span>
                      </div>

                      {/* Name & Role */}
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold flex items-center gap-1">
                          {mem.name}
                        </h4>
                        <span className="text-xs opacity-90 font-medium block">{mem.role}</span>
                        <span className="text-[10px] opacity-75 font-normal block font-mono">{mem.email}</span>
                      </div>

                      {/* Today's Work Completed Review Bar */}
                      <div className="p-3 rounded-2xl bg-white/80 border border-slate-200/60 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className="text-slate-700">Today's Work:</span>
                          <span className="text-emerald-700 font-mono">{stats.completedPct}%</span>
                        </div>
                        <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden flex">
                          <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${stats.completedPct}%` }} />
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium pt-0.5">
                          <span>Done: {stats.completed}</span>
                          <span>Pending: {stats.pending}</span>
                          <span>Left: {stats.notCompleted}</span>
                        </div>
                      </div>
                    </div>

                    {/* Per-Person Add Task Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setTaskModalMember(mem);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5 text-indigo-400" /> Add Task for {mem.name.split(' ')[0]}
                    </button>

                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TODAY'S TASK BOARD (REVIEW BAR REMOVED PER USER REQUEST) */}
      {activeTab === 'kanban' && (
        <div className="space-y-6">
          
          {/* Member Name Selector Bar & SEE PAST DATA BUTTON */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" /> Today's Task Updates by Member
                </h3>
                <p className="text-xs text-slate-500">Filter by member names or click to view clean past historical data sheet</p>
              </div>

              {/* SEE PAST DATA BUTTON THAT OPENS CLEAN AUDIT SHEET */}
              <button
                onClick={() => setShowPastDataSheetModal(true)}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-md transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
              >
                <FileSpreadsheet className="w-4 h-4 text-amber-300" /> Click to View Clean Past Historical Data Sheet ({pastTasks.length})
              </button>
            </div>

            {/* Member Selection Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedMemberForBoard('All Members')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  selectedMemberForBoard === 'All Members' ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                👥 All Team Members
              </button>
              {currentTeam.members.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMemberForBoard(m.name)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedMemberForBoard.toLowerCase() === m.name.toLowerCase() ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>👤 {m.name}</span>
                  {m.isLeader && <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* 3 STATUS COLUMNS: COMPLETED, PENDING, NOT COMPLETED */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* COLUMN 1: COMPLETED */}
            <div className="p-4 rounded-3xl bg-emerald-50/50 border border-emerald-200/80 shadow-2xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 border-b border-emerald-200 pb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Completed Today</span>
                <span className="bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full text-[10px] font-mono">{displayedBoardTasks.filter(t => t.status === 'Completed').length}</span>
              </h4>
              <div className="space-y-2.5">
                {displayedBoardTasks.filter(t => t.status === 'Completed').length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400 bg-white rounded-2xl">No completed tasks today</div>
                ) : (
                  displayedBoardTasks.filter(t => t.status === 'Completed').map((t) => (
                    <div key={t.id} className="p-4 rounded-2xl bg-white border border-emerald-200/80 shadow-2xs space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="text-xs font-bold text-slate-900 leading-snug">{t.title}</h5>
                        <button
                          onClick={() => {
                            setEditTaskItem(t);
                            setEditTaskTitle(t.title);
                          }}
                          className="text-slate-400 hover:text-indigo-600 text-xs flex items-center gap-0.5"
                          title="Modify / Edit Task Details"
                        >
                          <Edit2 className="w-3 h-3" /> Edit
                        </button>
                      </div>

                      <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" /> {t.createdAt}
                      </div>

                      {/* Point-wise bullets */}
                      <div className="space-y-1.5 pt-1 border-t border-slate-100">
                        {t.bullets.map((b) => (
                          <div
                            key={b.id}
                            onClick={() => handleToggleBulletDone(t.id, b.id)}
                            className="flex items-center gap-2 text-xs font-normal text-slate-700 cursor-pointer hover:text-emerald-600"
                          >
                            <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[10px] ${
                              b.isDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-slate-50'
                            }`}>
                              {b.isDone && '✓'}
                            </span>
                            <span className={b.isDone ? 'line-through text-slate-400' : ''}>{b.text}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-100">
                        <span>Assignee: <strong>{t.assignee}</strong></span>
                        <select
                          value={t.status}
                          onChange={(e: any) => handleUpdateTaskStatus(t.id, e.target.value)}
                          className="px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-100 text-emerald-800 border border-emerald-300 outline-none cursor-pointer"
                        >
                          <option value="Completed">Completed</option>
                          <option value="Pending">Pending</option>
                          <option value="Not Completed">Not Completed</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* COLUMN 2: PENDING */}
            <div className="p-4 rounded-3xl bg-amber-50/50 border border-amber-200/80 shadow-2xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 border-b border-amber-200 pb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-amber-600" /> Pending Today</span>
                <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full text-[10px] font-mono">{displayedBoardTasks.filter(t => t.status === 'Pending').length}</span>
              </h4>
              <div className="space-y-2.5">
                {displayedBoardTasks.filter(t => t.status === 'Pending').length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400 bg-white rounded-2xl">No pending tasks today</div>
                ) : (
                  displayedBoardTasks.filter(t => t.status === 'Pending').map((t) => (
                    <div key={t.id} className="p-4 rounded-2xl bg-white border border-amber-200/80 shadow-2xs space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="text-xs font-bold text-slate-900 leading-snug">{t.title}</h5>
                        <button
                          onClick={() => {
                            setEditTaskItem(t);
                            setEditTaskTitle(t.title);
                          }}
                          className="text-slate-400 hover:text-indigo-600 text-xs flex items-center gap-0.5"
                          title="Modify / Edit Task Details"
                        >
                          <Edit2 className="w-3 h-3" /> Edit
                        </button>
                      </div>

                      <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" /> {t.createdAt}
                      </div>

                      {/* Point-wise bullets */}
                      <div className="space-y-1.5 pt-1 border-t border-slate-100">
                        {t.bullets.map((b) => (
                          <div
                            key={b.id}
                            onClick={() => handleToggleBulletDone(t.id, b.id)}
                            className="flex items-center gap-2 text-xs font-normal text-slate-700 cursor-pointer hover:text-emerald-600"
                          >
                            <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[10px] ${
                              b.isDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-slate-50'
                            }`}>
                              {b.isDone && '✓'}
                            </span>
                            <span className={b.isDone ? 'line-through text-slate-400' : ''}>{b.text}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-100">
                        <span>Assignee: <strong>{t.assignee}</strong></span>
                        <select
                          value={t.status}
                          onChange={(e: any) => handleUpdateTaskStatus(t.id, e.target.value)}
                          className="px-2 py-0.5 text-[10px] font-semibold rounded bg-amber-100 text-amber-800 border border-amber-300 outline-none cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Completed">Completed</option>
                          <option value="Not Completed">Not Completed</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* COLUMN 3: NOT COMPLETED */}
            <div className="p-4 rounded-3xl bg-red-50/50 border border-red-200/80 shadow-2xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-red-800 border-b border-red-200 pb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5"><AlertCircle className="w-4 h-4 text-red-600" /> Not Completed Today</span>
                <span className="bg-red-200 text-red-900 px-2 py-0.5 rounded-full text-[10px] font-mono">{displayedBoardTasks.filter(t => t.status === 'Not Completed').length}</span>
              </h4>
              <div className="space-y-2.5">
                {displayedBoardTasks.filter(t => t.status === 'Not Completed').length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400 bg-white rounded-2xl">No uncompleted tasks today</div>
                ) : (
                  displayedBoardTasks.filter(t => t.status === 'Not Completed').map((t) => (
                    <div key={t.id} className="p-4 rounded-2xl bg-white border border-red-200/80 shadow-2xs space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="text-xs font-bold text-slate-900 leading-snug">{t.title}</h5>
                        <button
                          onClick={() => {
                            setEditTaskItem(t);
                            setEditTaskTitle(t.title);
                          }}
                          className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold flex items-center gap-0.5 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200"
                          title="Modify / Edit Task Details"
                        >
                          <Edit2 className="w-3 h-3" /> Modify Details
                        </button>
                      </div>

                      <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" /> {t.createdAt}
                      </div>

                      {/* Point-wise bullets */}
                      <div className="space-y-1.5 pt-1 border-t border-slate-100">
                        {t.bullets.map((b) => (
                          <div
                            key={b.id}
                            onClick={() => handleToggleBulletDone(t.id, b.id)}
                            className="flex items-center gap-2 text-xs font-normal text-slate-700 cursor-pointer hover:text-emerald-600"
                          >
                            <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[10px] ${
                              b.isDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-slate-50'
                            }`}>
                              {b.isDone && '✓'}
                            </span>
                            <span className={b.isDone ? 'line-through text-slate-400' : ''}>{b.text}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-100">
                        <span>Assignee: <strong>{t.assignee}</strong></span>
                        <select
                          value={t.status}
                          onChange={(e: any) => handleUpdateTaskStatus(t.id, e.target.value)}
                          className="px-2 py-0.5 text-[10px] font-semibold rounded bg-red-100 text-red-800 border border-red-300 outline-none cursor-pointer"
                        >
                          <option value="Not Completed">Not Completed</option>
                          <option value="Completed">Completed</option>
                          <option value="Pending">Pending</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* FLOATING BOTTOM LIVE TEAM CHAT BAR WITH ONLINE MEMBERS, TYPING INDICATOR, PROFILE PICS & BLUE TICKS */}
      <div className="fixed bottom-4 right-4 sm:right-8 z-40 w-80 sm:w-96 shadow-2xl rounded-3xl overflow-hidden border border-indigo-500/30 transition-all duration-300">
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-full px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <span className="text-xs font-bold text-white font-heading">{currentTeam.name} Live Team Chat</span>
          </div>
          <div className="flex items-center gap-2 text-indigo-300 text-xs">
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> {currentTeam.members.filter(m => m.status === 'Active').length} Online
            </span>
            {isChatOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
        </button>

        {isChatOpen && (
          <div className="bg-white flex flex-col h-96 border-t border-slate-200">
            
            {/* Online Members Presence Ribbon */}
            <div className="px-3.5 py-2 bg-slate-900/95 text-white flex items-center justify-between text-[10px] border-b border-slate-800">
              <span className="font-semibold text-slate-300 uppercase tracking-wider">Online Members:</span>
              <div className="flex items-center gap-2 overflow-x-auto">
                {currentTeam.members.map((m) => (
                  <div key={m.id} className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                    <span className={`w-1.5 h-1.5 rounded-full ${m.status === 'Active' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    <span className="font-bold text-white">{m.name.split(' ')[0]}</span>
                    {m.isLeader && <Crown className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Message Stream */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50/50">
              {messages.map((m) => (
                <div key={m.id} className="flex items-start gap-2.5">
                  {/* Sender Profile Picture Avatar */}
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-bold flex items-center justify-center text-[11px] shrink-0 shadow-2xs relative">
                    {m.sender.charAt(0)}
                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-white" />
                  </div>

                  <div className="flex-1 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 flex items-center gap-1">
                        {m.sender} {m.isLeader && <Crown className="w-3 h-3 text-amber-500 fill-amber-400" />}
                      </span>
                      <span className="text-[9px] font-normal text-slate-400 font-mono">{m.time}</span>
                    </div>

                    <p className="text-xs text-slate-700 font-normal leading-relaxed">{m.text}</p>

                    {/* Bottom Message Status: Seen by all group team members with full avatars & double blue ticks */}
                    <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-slate-100/80 text-[9px]">
                      <span className="font-semibold text-slate-400">Seen by {currentTeam.members.length} team members:</span>
                      <div className="flex items-center gap-1">
                        <div className="flex items-center -space-x-1">
                          {currentTeam.members.map((mem, idx) => (
                            <div
                              key={idx}
                              className="w-4 h-4 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-[9px] font-bold flex items-center justify-center border border-white shadow-2xs"
                              title={`Seen by ${mem.name} (${mem.email})`}
                            >
                              {mem.name.charAt(0)}
                            </div>
                          ))}
                        </div>
                        {/* Double Blue Ticks */}
                        <CheckCheck className="w-3.5 h-3.5 text-sky-500 font-bold ml-0.5" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {newMessage.trim().length > 0 && (
                <div className="flex items-center gap-2 text-[10px] text-indigo-600 font-semibold italic bg-indigo-50/80 p-2 rounded-xl border border-indigo-100 w-fit">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                  <span>{currentUser?.name || 'You'} is typing a message...</span>
                </div>
              )}
            </div>

            {/* Chat Input Form */}
            <form onSubmit={handleSendMessage} className="p-2.5 border-t border-slate-200 bg-white flex items-center gap-2">
              <input
                type="text"
                placeholder="Type message (shows live typing & blue ticks)..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-indigo-500"
              />
              <button type="submit" className="p-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 cursor-pointer shadow-2xs">
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* MODAL: CLEAN PAST HISTORICAL DATA AUDIT SHEET (TEXT NOT STRICKEN OUT) */}
      {showPastDataSheetModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 space-y-5 border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-heading">
                    Past Historical Data Audit Sheet
                  </h3>
                  <p className="text-xs text-slate-500">Clean, non-clumsy log sheet with date, time, work items, and completion results</p>
                </div>
              </div>

              <button onClick={() => setShowPastDataSheetModal(false)} className="p-1 text-slate-400 hover:text-slate-600 self-start sm:self-auto">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Input */}
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search historical sheet by task, date, time or assignee..."
                value={pastDataSearch}
                onChange={(e) => setPastDataSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500"
              />
            </div>

            {/* Clean Spreadsheet Table without Strikeout */}
            <div className="overflow-x-auto flex-1 border border-slate-200 rounded-2xl bg-slate-50/50">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-white">
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Assigned Member</th>
                    <th className="py-3 px-4">Work Item & Details</th>
                    <th className="py-3 px-4 text-right">Completion Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/80 text-xs bg-white">
                  {filteredPastTasksSheet.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-xs text-slate-400">
                        No matching past historical tasks found.
                      </td>
                    </tr>
                  ) : (
                    filteredPastTasksSheet.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-slate-600 text-[11px] whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                            <span>{t.createdAt}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                          {t.assignee}
                        </td>
                        <td className="py-3.5 px-4 space-y-1">
                          <span className="font-bold text-slate-900 block">{t.title}</span>
                          <div className="space-y-1 pt-0.5">
                            {t.bullets.map(b => (
                              <div key={b.id} className="text-[11px] text-slate-700 font-medium flex items-center gap-1.5">
                                <span className="text-indigo-500">•</span>
                                <span>{b.text}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            t.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                            t.status === 'Pending' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-red-100 text-red-800 border border-red-300'
                          }`}>
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <span className="text-xs text-slate-500 font-mono">Total {filteredPastTasksSheet.length} Historical Records</span>
              <button
                onClick={() => setShowPastDataSheetModal(false)}
                className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
              >
                Close Historical Audit Sheet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: VIEW TASKS POINT-WISE BY DATE & TIME */}
      {viewTasksMember && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-heading">Tasks Assigned to {viewTasksMember.name}</h3>
                <span className="text-xs text-slate-500 font-mono">{viewTasksMember.email}</span>
              </div>
              <button onClick={() => setViewTasksMember(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {tasks.filter(t => t.assigneeEmail.toLowerCase() === viewTasksMember.email.toLowerCase()).length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl">
                  No tasks assigned to {viewTasksMember.name}. Click "Add Task" to create one.
                </div>
              ) : (
                tasks.filter(t => t.assigneeEmail.toLowerCase() === viewTasksMember.email.toLowerCase()).map((t) => (
                  <div key={t.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900">{t.title}</h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        t.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                        t.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {t.status}
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Date & Time Assigned: <strong>{t.createdAt}</strong></span>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-200/60">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Point-Wise Action Items:</span>
                      {t.bullets.map((b) => (
                        <div
                          key={b.id}
                          onClick={() => handleToggleBulletDone(t.id, b.id)}
                          className="flex items-center gap-2 text-xs font-normal text-slate-700 cursor-pointer hover:text-emerald-600"
                        >
                          <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[10px] ${
                            b.isDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {b.isDone && '✓'}
                          </span>
                          <span className={b.isDone ? 'line-through text-slate-400' : ''}>{b.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewTasksMember(null)}
                className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
              >
                Close Task View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD CLEAN BULLETED TASK WITH DIRECT CURSOR FOCUS ON ENTER */}
      {taskModalMember && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-heading">Add Task for {taskModalMember.name}</h3>
                <span className="text-xs text-slate-500 font-mono">{taskModalMember.email}</span>
              </div>
              <button onClick={() => setTaskModalMember(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveIndividualTask} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Main Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Build Vector Embeddings API Route"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">Point-Wise Action Items</label>
                  <span className="text-[10px] text-indigo-600 font-medium">(Press Enter to jump cursor to next line)</span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {bulletInputs.map((bVal, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 font-mono">•</span>
                      <input
                        id={`bullet-input-${idx}`}
                        type="text"
                        placeholder={`Point ${idx + 1} item...`}
                        value={bVal}
                        onKeyDown={(e) => handleBulletKeyDown(idx, e)}
                        onChange={(e) => {
                          const updated = [...bulletInputs];
                          updated[idx] = e.target.value;
                          setBulletInputs(updated);
                        }}
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                      />
                      {bulletInputs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setBulletInputs(bulletInputs.filter((_, i) => i !== idx))}
                          className="p-1 text-slate-400 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setBulletInputs([...bulletInputs, ''])}
                  className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1 pt-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add another bullet line
                </button>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setTaskModalMember(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-xl hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 cursor-pointer"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: INQUIRY WHEN MARKING TASK "NOT COMPLETED" */}
      {notCompletedPromptTask && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertCircle className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900 font-heading">End-of-Day Task Completion Inquiry</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Which specific points of <strong>"{notCompletedPromptTask.title}"</strong> assigned to <strong>{notCompletedPromptTask.assignee}</strong> were not completed today?
            </p>

            <div className="space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
              {notCompletedPromptTask.bullets.map((b) => (
                <div key={b.id} className="flex items-center justify-between text-xs">
                  <span className={b.isDone ? 'line-through text-slate-400' : 'text-slate-800'}>{b.text}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${b.isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                    {b.isDone ? 'Done' : 'Not Done'}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => {
                  setTasks(tasks.map(t => t.id === notCompletedPromptTask.id ? { ...t, status: 'Not Completed' } : t));
                  setNotCompletedPromptTask(null);
                }}
                className="px-4 py-2 text-xs font-semibold bg-red-600 text-white rounded-xl hover:bg-red-700 cursor-pointer"
              >
                Mark as Not Completed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: MODIFY / EDIT TASK DETAILS AFTER COMPLETION */}
      {editTaskItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-heading">Modify Task Details</h3>
              <button onClick={() => setEditTaskItem(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditTask} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Task Title</label>
                <input
                  type="text"
                  required
                  value={editTaskTitle}
                  onChange={(e) => setEditTaskTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditTaskItem(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-xl hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 cursor-pointer"
                >
                  Save Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE TEAM MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 font-heading">Create New Team</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Team Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cyber Pioneers"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Enrolled Hackathon</label>
                <select
                  value={newTeamHackathon}
                  onChange={(e) => setNewTeamHackathon(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                >
                  <option value="AI Hackathon 2026">AI Hackathon 2026</option>
                  <option value="Quantum FinTech Challenge">Quantum FinTech Challenge</option>
                  <option value="HealthTech AI Summit">HealthTech AI Summit</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-xl hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                >
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / INVITE MEMBER MODAL */}
      {isAddMemberModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 font-heading">Invite Member to {currentTeam.name}</h3>
              <button onClick={() => setIsAddMemberModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Quick Select from Account Contacts</label>
                <select
                  onChange={(e) => {
                    const found = ACCOUNT_CONTACTS.find(c => c.email === e.target.value);
                    if (found) {
                      setInviteMemberName(found.name);
                      setInviteMemberEmail(found.email);
                      setNewMemberRole(found.role);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-indigo-500 bg-slate-50"
                >
                  <option value="">-- Choose Account Contact --</option>
                  {ACCOUNT_CONTACTS.map((c) => (
                    <option key={c.email} value={c.email}>
                      {c.name} ({c.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Member Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bhavya"
                  value={inviteMemberName}
                  onChange={(e) => setInviteMemberName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Member Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. bhavya@hackathon.com"
                  value={inviteMemberEmail}
                  onChange={(e) => setInviteMemberEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Assigned Team Role</label>
                <input
                  type="text"
                  placeholder="e.g. AI Specialist / Frontend Dev"
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddMemberModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-xl hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                >
                  Invite & Send Notification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
