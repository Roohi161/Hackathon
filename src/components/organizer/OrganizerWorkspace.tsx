import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Users,
  Award,
  BarChart3,
  Sparkles,
  Clock,
  Megaphone,
  Layers,
  Bell,
  Calendar as CalendarIcon,
  Plus,
  Settings,
  Scale,
  ChevronDown,
  X,
  Send,
  Building2,
  Trash2,
  ExternalLink,
  LogOut,
  RefreshCw,
  Search,
  CheckCircle2
} from 'lucide-react';
import type { Hackathon } from '../../types';
import { useHackathonStore } from '../../stores/hackathonStore';
import { useNotificationStore } from '../../stores/notificationStore';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { useToastStore } from '../../stores/toastStore';
import { hackathonApi } from '../../services/hackathonApi';
import { NotificationDrawer } from '../NotificationDrawer';
import { ToastContainer } from '../ui/Toast';
import { CreateHackathonWizard } from './CreateHackathonWizard';

const INITIAL_ORGANIZER_HACKATHONS: Hackathon[] = [
  {
    id: 'org-h-1',
    title: 'Web3 & Decentralized Scale-A-Thon',
    slug: 'web3-scale-a-thon',
    tagline: 'Build next-gen decentralized protocols & dApps.',
    description: 'A global hackathon inviting developers to build scalable Web3 protocols, smart contracts, and zero-knowledge tools.',
    banner: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    status: 'PUBLISHED' as any,
    mode: 'ONLINE' as any,
    visibility: 'PUBLIC' as any,
    maxTeamSize: 4,
    minTeamSize: 1,
    prizePool: '₹25,00,000',
    organizerId: 'org-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tracks: [],
    problemStatements: [],
    rubrics: [],
    schedule: [],
    faqs: [],
  },
  {
    id: 'org-h-2',
    title: 'AI Innovation Challenge 2026',
    slug: 'ai-innovation-challenge',
    tagline: 'Autonomous AI agents, LLM toolchains, and multimodal models.',
    description: 'Compete to build state-of-the-art AI agents, fine-tuned transformer pipelines, and real-time intelligence interfaces.',
    banner: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    status: 'PUBLISHED' as any,
    mode: 'HYBRID' as any,
    visibility: 'PUBLIC' as any,
    maxTeamSize: 5,
    minTeamSize: 1,
    prizePool: '₹15,00,000',
    organizerId: 'org-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tracks: [],
    problemStatements: [],
    rubrics: [],
    schedule: [],
    faqs: [],
  },
  {
    id: 'org-h-3',
    title: 'Smart Cities & GreenTech Sprint',
    slug: 'smart-cities-greentech',
    tagline: 'IoT sensors, clean energy grids, and sustainable urban tech.',
    description: 'Solve real-world climate and urban infrastructure challenges using IoT networks, GIS mapping, and predictive analytics.',
    banner: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    status: 'PUBLISHED' as any,
    mode: 'ONLINE' as any,
    visibility: 'PUBLIC' as any,
    maxTeamSize: 4,
    minTeamSize: 1,
    prizePool: '₹10,00,000',
    organizerId: 'org-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tracks: [],
    problemStatements: [],
    rubrics: [],
    schedule: [],
    faqs: [],
  },
  {
    id: 'org-h-4',
    title: 'FinTech Disrupt Challenge',
    slug: 'fintech-disrupt',
    tagline: 'Next-gen payment gateways, DeFi algorithms, and banking APIs.',
    description: 'Build secure financial tech applications, algorithmic risk models, and automated compliance engines.',
    banner: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
    status: 'UPCOMING' as any,
    mode: 'ONLINE' as any,
    visibility: 'PUBLIC' as any,
    maxTeamSize: 4,
    minTeamSize: 1,
    prizePool: '₹20,00,000',
    organizerId: 'org-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tracks: [],
    problemStatements: [],
    rubrics: [],
    schedule: [],
    faqs: [],
  },
  {
    id: 'org-h-5',
    title: 'HealthTech Hackathon 2026',
    slug: 'healthtech-hackathon',
    tagline: 'Telemedicine, medical imaging AI, and EHR integrations.',
    description: 'Innovate digital health solutions for automated diagnostics, patient monitoring, and clinical research.',
    banner: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    status: 'UPCOMING' as any,
    mode: 'HYBRID' as any,
    visibility: 'PUBLIC' as any,
    maxTeamSize: 4,
    minTeamSize: 1,
    prizePool: '₹18,00,000',
    organizerId: 'org-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tracks: [],
    problemStatements: [],
    rubrics: [],
    schedule: [],
    faqs: [],
  },
  {
    id: 'org-h-6',
    title: 'CyberSecurity & Zero Trust Hack',
    slug: 'cybersecurity-zero-trust',
    tagline: 'Penetration testing, encryption protocols, and threat defense.',
    description: 'Demonstrate zero-trust security architectures, vulnerability scanners, and automated threat mitigations.',
    banner: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    status: 'PUBLISHED' as any,
    mode: 'ONLINE' as any,
    visibility: 'PUBLIC' as any,
    maxTeamSize: 4,
    minTeamSize: 1,
    prizePool: '₹12,50,000',
    organizerId: 'org-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tracks: [],
    problemStatements: [],
    rubrics: [],
    schedule: [],
    faqs: [],
  },
  {
    id: 'org-h-7',
    title: 'EduTech Open Source Sprint',
    slug: 'edutech-open-source',
    tagline: 'Interactive learning tools, LMS platforms, and AI tutors.',
    description: 'Transform digital learning with accessible open-source tools, gamified quizzes, and personalized AI mentoring.',
    banner: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&q=80',
    status: 'ENDED' as any,
    mode: 'ONLINE' as any,
    visibility: 'PUBLIC' as any,
    maxTeamSize: 4,
    minTeamSize: 1,
    prizePool: '₹8,00,000',
    organizerId: 'org-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tracks: [],
    problemStatements: [],
    rubrics: [],
    schedule: [],
    faqs: [],
  },
  {
    id: 'org-h-8',
    title: 'Cloud Native & Kubernetes Summit',
    slug: 'cloud-native-k8s',
    tagline: 'Microservices, serverless, mesh networking, and DevOps pipelines.',
    description: 'Engineer cloud-native microservices architectures, auto-scaling Kubernetes operators, and CI/CD pipelines.',
    banner: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    status: 'PUBLISHED' as any,
    mode: 'ONLINE' as any,
    visibility: 'PUBLIC' as any,
    maxTeamSize: 4,
    minTeamSize: 1,
    prizePool: '₹14,00,000',
    organizerId: 'org-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tracks: [],
    problemStatements: [],
    rubrics: [],
    schedule: [],
    faqs: [],
  },
  {
    id: 'org-h-9',
    title: 'Autonomous Robotics & Drones Hack',
    slug: 'robotics-drones',
    tagline: 'ROS2 robotics control, drone navigation, and spatial AI.',
    description: 'Develop autonomous flight controllers, computer vision tracking algorithms, and robotics simulations.',
    banner: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    status: 'UPCOMING' as any,
    mode: 'HYBRID' as any,
    visibility: 'PUBLIC' as any,
    maxTeamSize: 5,
    minTeamSize: 1,
    prizePool: '₹16,00,000',
    organizerId: 'org-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tracks: [],
    problemStatements: [],
    rubrics: [],
    schedule: [],
    faqs: [],
  },
  {
    id: 'org-h-10',
    title: 'Quantum Computing Developer Challenge',
    slug: 'quantum-computing',
    tagline: 'Qiskit algorithms, quantum cryptography, and optimization.',
    description: 'Formulate quantum circuits, quantum key distribution mechanisms, and hybrid quantum-classical algorithms.',
    banner: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
    status: 'PUBLISHED' as any,
    mode: 'ONLINE' as any,
    visibility: 'PUBLIC' as any,
    maxTeamSize: 3,
    minTeamSize: 1,
    prizePool: '₹22,00,000',
    organizerId: 'org-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tracks: [],
    problemStatements: [],
    rubrics: [],
    schedule: [],
    faqs: [],
  },
  {
    id: 'org-h-11',
    title: 'AR/VR Spatial Computing Hackathon',
    slug: 'spatial-computing-arvr',
    tagline: 'VisionOS, Unity spatial shaders, and WebXR experiences.',
    description: 'Design immersive AR/VR experiences, 3D spatial user interfaces, and interactive virtual workspaces.',
    banner: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&w=800&q=80',
    status: 'PUBLISHED' as any,
    mode: 'HYBRID' as any,
    visibility: 'PUBLIC' as any,
    maxTeamSize: 4,
    minTeamSize: 1,
    prizePool: '₹15,00,000',
    organizerId: 'org-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tracks: [],
    problemStatements: [],
    rubrics: [],
    schedule: [],
    faqs: [],
  },
  {
    id: 'org-h-12',
    title: 'BioTech & Genomic Data Sprint',
    slug: 'biotech-genomic-data',
    tagline: 'CRISPR sequence analysis, protein folding AI, and drug discovery.',
    description: 'Accelerate computational biology pipelines using deep learning models for genomic sequence analysis.',
    banner: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80',
    status: 'UPCOMING' as any,
    mode: 'ONLINE' as any,
    visibility: 'PUBLIC' as any,
    maxTeamSize: 4,
    minTeamSize: 1,
    prizePool: '₹20,00,000',
    organizerId: 'org-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tracks: [],
    problemStatements: [],
    rubrics: [],
    schedule: [],
    faqs: [],
  },
  {
    id: 'org-h-13',
    title: 'Gaming & Interactive Entertainment Jam',
    slug: 'gaming-interactive-jam',
    tagline: 'Unreal Engine 5 physics, procedurally generated worlds, and AI NPCs.',
    description: 'Build next-level indie game prototypes, procedurally generated environments, and intelligent non-player characters.',
    banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    status: 'PUBLISHED' as any,
    mode: 'ONLINE' as any,
    visibility: 'PUBLIC' as any,
    maxTeamSize: 5,
    minTeamSize: 1,
    prizePool: '₹10,00,000',
    organizerId: 'org-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tracks: [],
    problemStatements: [],
    rubrics: [],
    schedule: [],
    faqs: [],
  }
];

const getInitialHackathons = (): Hackathon[] => {
  try {
    const saved = localStorage.getItem('hc_organizer_hackathons');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Fallback to default list
  }
  return INITIAL_ORGANIZER_HACKATHONS;
};

const INITIAL_REGISTRATIONS = [
  {
    id: '1',
    groupName: 'CyberPioneers AI',
    code: 'CYBER-2026',
    leaderName: 'Shaik Ansar Ali',
    leaderEmail: 'ansar@hackathoncentral.io',
    leaderPhone: '+91 98765 43210',
    orgName: 'IIT Madras',
    track: 'Generative AI & LLMs',
    level: 'Working Professional',
    groupSize: '4 Members',
    status: 'APPROVED',
    registeredAt: '2026-08-01 14:30',
    github: 'https://github.com/ansar',
    eventTitle: 'AI Innovation Challenge 2026'
  },
  {
    id: '2',
    groupName: 'Visionary Agentic Crew',
    code: 'VISION-99',
    leaderName: 'Alex Rivera',
    leaderEmail: 'alex@visionary.io',
    leaderPhone: '+91 91234 56789',
    orgName: 'BITS Pilani',
    track: 'Agentic Coding',
    level: 'Senior Architect',
    groupSize: '2 Members',
    status: 'APPROVED',
    registeredAt: '2026-08-02 09:15',
    github: 'https://github.com/alexrivera',
    eventTitle: 'AI Innovation Challenge 2026'
  },
  {
    id: '3',
    groupName: 'Quantum Zero Hackers',
    code: 'QNTM-404',
    leaderName: 'Carlos Vance',
    leaderEmail: 'carlos@quantum.org',
    leaderPhone: '+1 (555) 019-2834',
    orgName: 'Stanford University',
    track: 'Web3 Protocols & DeFi',
    level: 'Student',
    groupSize: '3 Members',
    status: 'PENDING',
    registeredAt: '2026-08-03 11:45',
    github: 'https://github.com/carlosquantum',
    eventTitle: 'Web3 & Decentralized Scale-A-Thon'
  },
  {
    id: '4',
    groupName: 'Nexus FinTech Labs',
    code: 'NEXUS-88',
    leaderName: 'Priya Sharma',
    leaderEmail: 'priya@nexuslabs.in',
    leaderPhone: '+91 99887 76655',
    orgName: 'Delhi Technological University',
    track: 'FinTech & DeFi',
    level: 'Working Professional',
    groupSize: '4 Members',
    status: 'SHORTLISTED',
    registeredAt: '2026-08-03 12:10',
    github: 'https://github.com/priyanexus',
    eventTitle: 'FinTech Disrupt Challenge'
  },
  {
    id: '5',
    groupName: 'BioHealth AI Squad',
    code: 'BIO-777',
    leaderName: 'Dr. Rahul Verma',
    leaderEmail: 'rahul@biohealth.ai',
    leaderPhone: '+91 97654 32109',
    orgName: 'AIIMS New Delhi',
    track: 'Generative AI & LLMs',
    level: 'Senior Architect',
    groupSize: '5 Members',
    status: 'APPROVED',
    registeredAt: '2026-08-02 16:50',
    github: 'https://github.com/rahulbioai',
    eventTitle: 'HealthTech Hackathon 2026'
  },
  {
    id: '6',
    groupName: 'GreenGrid Robotics',
    code: 'GRID-55',
    leaderName: 'Kavya Nair',
    leaderEmail: 'kavya@greengrid.org',
    leaderPhone: '+91 94455 66778',
    orgName: 'NIT Trichy',
    track: 'Smart Cities & GreenTech',
    level: 'Student',
    groupSize: '4 Members',
    status: 'PENDING',
    registeredAt: '2026-08-03 15:20',
    github: 'https://github.com/kavyagrid',
    eventTitle: 'Smart Cities & GreenTech Sprint'
  }
];

const INITIAL_JUDGES = [
  { id: '1', name: 'Dr. Suresh Kumar', email: 'suresh@judge.io', track: 'Generative AI', expertise: 'Computer Vision & LLMs' },
  { id: '2', name: 'Elena Rostova', email: 'elena@judge.io', track: 'Agentic Coding', expertise: 'Web3 Security' },
];

const getInitialRegistrations = () => {
  try {
    const saved = localStorage.getItem('hc_organizer_registrations');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Ignored
  }
  return INITIAL_REGISTRATIONS;
};

const getInitialJudges = () => {
  try {
    const saved = localStorage.getItem('hc_organizer_judges');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Ignored
  }
  return INITIAL_JUDGES;
};

export const OrganizerWorkspace: React.FC = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const addToast = useToastStore((s) => s.addToast);
  const notify = (title: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => addToast({ title, type });

  const { hackathons: storeHackathons, fetchHackathons, addHackathon, deleteHackathon, isLoading } = useHackathonStore();
  const { announcements, addAnnouncement } = useNotificationStore();

  // Local state for organizer hackathons with localStorage persistence
  const [organizerHackathons, setOrganizerHackathons] = useState<Hackathon[]>(getInitialHackathons);

  // Workspace Navigation Tabs
  const [activeTab, setActiveTab] = useState<
    'overview' | 'hackathons' | 'create' | 'registrations' | 'judges' | 'broadcaster' | 'connect' | 'settings'
  >('overview');

  // Top Bar Dropdowns & Modals
  const [currentOrg, setCurrentOrg] = useState('TechCorp India Labs');
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State: Create/Edit Hackathon 4-Step Wizard
  const [editingHackathonId, setEditingHackathonId] = useState<string | null>(null);
  const [createStep, setCreateStep] = useState<1 | 2 | 3 | 4>(1);
  const [eventTitle, setEventTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [maxTeamSize, setMaxTeamSize] = useState(4);
  const [prizePool, setPrizePool] = useState('₹25,00,000');
  const [bannerUrl, setBannerUrl] = useState('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80');
  const [trackName, setTrackName] = useState('Generative AI & Autonomous Agents');
  const [scoringCriteria, setScoringCriteria] = useState('Code Quality 30%, Innovation 30%, Presentation 20%, Impact 20%');
  const [registrationDeadline, setRegistrationDeadline] = useState('');
  const [hackingBeginsDate, setHackingBeginsDate] = useState('');
  const [submissionsDueDate, setSubmissionsDueDate] = useState('');

  // Form State: Registrations Management with localStorage persistence & filters
  const [registrations, setRegistrations] = useState(getInitialRegistrations);
  const [regSearchQuery, setRegSearchQuery] = useState('');
  const [regStatusFilter, setRegStatusFilter] = useState('All Statuses');
  const [regTrackFilter, setRegTrackFilter] = useState('All Tracks');
  const [regExperienceFilter, setRegExperienceFilter] = useState('All Levels');
  const [selectedRegIds, setSelectedRegIds] = useState<string[]>([]);
  const [viewingRegistration, setViewingRegistration] = useState<any | null>(null);

  // Filtered Registrations List
  const filteredRegistrations = registrations.filter(r => {
    const matchesSearch =
      (r.groupName || '').toLowerCase().includes(regSearchQuery.toLowerCase()) ||
      (r.leaderName || '').toLowerCase().includes(regSearchQuery.toLowerCase()) ||
      (r.leaderEmail || '').toLowerCase().includes(regSearchQuery.toLowerCase()) ||
      (r.orgName || '').toLowerCase().includes(regSearchQuery.toLowerCase());

    const matchesStatus =
      regStatusFilter === 'All Statuses' ||
      (r.status || '').toUpperCase() === regStatusFilter.toUpperCase();

    const matchesTrack =
      regTrackFilter === 'All Tracks' ||
      (r.track || '').toLowerCase().includes(regTrackFilter.toLowerCase());

    const matchesLevel =
      regExperienceFilter === 'All Levels' ||
      (r.level || '').toLowerCase().includes(regExperienceFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesTrack && matchesLevel;
  });

  // Handle Export Excel (.csv)
  const handleExportExcel = () => {
    const headers = ['ID', 'Team Name', 'Team Code', 'Leader Name', 'Leader Email', 'Phone', 'Organization', 'Track', 'Level', 'Team Size', 'Status', 'Registered Date', 'Event Title'];
    const csvRows = [
      headers.join(','),
      ...filteredRegistrations.map(r => [
        `"${r.id}"`,
        `"${r.groupName || ''}"`,
        `"${r.code || ''}"`,
        `"${r.leaderName || ''}"`,
        `"${r.leaderEmail || ''}"`,
        `"${r.leaderPhone || ''}"`,
        `"${r.orgName || ''}"`,
        `"${r.track || ''}"`,
        `"${r.level || ''}"`,
        `"${r.groupSize || ''}"`,
        `"${r.status || ''}"`,
        `"${r.registeredAt || ''}"`,
        `"${r.eventTitle || ''}"`
      ].join(','))
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvRows.join('\n'));
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `Developer_Registrations_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      title: 'Excel Export Complete',
      message: `Exported ${filteredRegistrations.length} developer registration records to Excel (.csv).`,
      type: 'success',
      duration: 4000
    });
  };

  // Bulk Operations
  const handleBulkStatus = (newStatus: 'APPROVED' | 'REJECTED') => {
    if (selectedRegIds.length === 0) return;
    setRegistrations(prev => {
      const updated = prev.map(r => selectedRegIds.includes(r.id) ? { ...r, status: newStatus } : r);
      try {
        localStorage.setItem('hc_organizer_registrations', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    notify(`Bulk updated ${selectedRegIds.length} registration(s) to ${newStatus}`, 'success');
    setSelectedRegIds([]);
  };

  // Handle Approve All Registrations
  const handleApproveAll = () => {
    if (filteredRegistrations.length === 0) {
      notify('No registrations to approve', 'warning');
      return;
    }
    setRegistrations(prev => {
      const targetIds = filteredRegistrations.map(r => r.id);
      const updated = prev.map(r => targetIds.includes(r.id) ? { ...r, status: 'APPROVED' } : r);
      try {
        localStorage.setItem('hc_organizer_registrations', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    addToast({
      title: 'Bulk Approval Complete',
      message: `Approved all ${filteredRegistrations.length} developer registrations!`,
      type: 'success',
      duration: 4000
    });
  };

  // Form State: Judges Management with localStorage persistence
  const [judgeName, setJudgeName] = useState('');
  const [judgeEmail, setJudgeEmail] = useState('');
  const [judgeExpertise, setJudgeExpertise] = useState('');
  const [assignedTrack, setAssignedTrack] = useState('Generative AI');
  const [judges, setJudges] = useState(getInitialJudges);

  // Form State: Broadcaster Studio
  const [broadcastEvent, setBroadcastEvent] = useState('Web3 & Decentralized Scale-A-Thon');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastContent, setBroadcastContent] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sendEmail, setSendEmail] = useState(true);
  const [sendSms, setSendSms] = useState(false);

  // Form State: Connect Hub Chat
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Elena (Vercel India)', time: '10:30 AM', message: 'Hey organizers! Finalizing our Web3 Sprint prize dates for September.' },
    { sender: 'Suresh (Apex Labs)', time: '10:35 AM', message: 'Sounds great. We are hosting FinTech Disrupt in November to avoid collision.' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Fetch hackathons on mount
  useEffect(() => {
    fetchHackathons();
  }, [fetchHackathons]);

  // Delete Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState<Hackathon | null>(null);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState('');

  // Handle Event Creation or Edit Update
  const handleCreateHackathon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) {
      notify('Please specify event title', 'warning');
      return;
    }
    setIsSubmitting(true);

    if (editingHackathonId) {
      // UPDATE EXISTING EVENT
      setOrganizerHackathons(prev => {
        const updated = prev.map(h => h.id === editingHackathonId ? {
          ...h,
          title: eventTitle,
          slug: eventTitle.toLowerCase().replace(/\s+/g, '-'),
          tagline: tagline || h.tagline,
          description: description || h.description,
          banner: bannerUrl || h.banner,
          maxTeamSize: Number(maxTeamSize) || h.maxTeamSize,
          prizePool: prizePool || h.prizePool,
          updatedAt: new Date().toISOString(),
        } : h);
        try {
          localStorage.setItem('hc_organizer_hackathons', JSON.stringify(updated));
        } catch {
          // Ignored
        }
        return updated;
      });

      notify(`Event "${eventTitle}" updated successfully!`, 'success');
      setIsSubmitting(false);
      setEditingHackathonId(null);
      setCreateStep(1);
      setEventTitle('');
      setTagline('');
      setDescription('');
      setMaxTeamSize(4);
      setPrizePool('₹25,00,000');
      setBannerUrl('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80');
      setActiveTab('hackathons');
      return;
    }

    // CREATE BRAND NEW EVENT
    const newHackathonItem: Hackathon = {
      id: `org-h-${Date.now()}`,
      title: eventTitle,
      slug: eventTitle.toLowerCase().replace(/\s+/g, '-'),
      tagline: tagline || 'Building next-gen tech solutions.',
      description: description || 'Global developer competition.',
      banner: bannerUrl,
      status: 'PUBLISHED' as any,
      mode: 'ONLINE' as any,
      visibility: 'PUBLIC' as any,
      maxTeamSize: Number(maxTeamSize) || 4,
      minTeamSize: 1,
      prizePool: prizePool || '₹25,00,000',
      organizerId: user?.id || 'org-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tracks: [],
      problemStatements: [],
      rubrics: [],
      schedule: [],
      faqs: [],
    };

    setOrganizerHackathons(prev => {
      const updated = [newHackathonItem, ...prev];
      try {
        localStorage.setItem('hc_organizer_hackathons', JSON.stringify(updated));
      } catch {
        // Ignored
      }
      return updated;
    });

    addHackathon(newHackathonItem);

    try {
      await hackathonApi.create(newHackathonItem);
      notify(`Event "${eventTitle}" created & published to backend DB!`, 'success');
    } catch {
      notify(`Event "${eventTitle}" created & saved in workspace!`, 'success');
    } finally {
      setIsSubmitting(false);
      setEditingHackathonId(null);
      setCreateStep(1);
      setEventTitle('');
      setTagline('');
      setDescription('');
      setMaxTeamSize(4);
      setPrizePool('₹25,00,000');
      setBannerUrl('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80');
      setActiveTab('hackathons');
    }
  };

  // Reset Create Form & Open Create Tab for Fresh Creation
  const handleOpenCreateTab = () => {
    setEditingHackathonId(null);
    setCreateStep(1);
    setEventTitle('');
    setTagline('');
    setDescription('');
    setMaxTeamSize(4);
    setPrizePool('₹25,00,000');
    setBannerUrl('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80');
    setActiveTab('create');
  };

  // Open Modify Form
  const handleOpenModifyModal = (h: Hackathon) => {
    setEditingHackathonId(h.id);
    setEventTitle(h.title);
    setTagline(h.tagline || '');
    setDescription(h.description || '');
    setMaxTeamSize(h.maxTeamSize || 4);
    setPrizePool(h.prizePool || '₹25,00,000');
    setBannerUrl(h.banner || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80');
    setCreateStep(1);
    setActiveTab('create');
  };

  // Open Delete Confirmation Modal
  const handlePromptDelete = (hackathon: Hackathon) => {
    setDeleteTarget(hackathon);
    setDeleteConfirmInput('');
  };

  // Confirm Deletion Execution
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    if (deleteConfirmInput.trim() !== deleteTarget.title.trim()) {
      notify('Typed title does not match. Please enter exact event title.', 'warning');
      return;
    }

    const targetId = deleteTarget.id;
    const targetTitle = deleteTarget.title;

    setOrganizerHackathons(prev => {
      const updated = prev.filter(h => h.id !== targetId);
      try {
        localStorage.setItem('hc_organizer_hackathons', JSON.stringify(updated));
      } catch {
        // Ignored
      }
      return updated;
    });
    deleteHackathon(targetId);

    try {
      await hackathonApi.delete(targetId);
    } catch {
      // Ignored
    }

    addToast({
      title: 'Deleted',
      message: `Event "${targetTitle}" was permanently deleted.`,
      type: 'error',
      duration: 4000
    });

    setDeleteTarget(null);
    setDeleteConfirmInput('');
  };

  // Handle Approve/Reject Registration
  const handleRegistrationStatus = (id: string, status: 'APPROVED' | 'REJECTED') => {
    setRegistrations(prev => {
      const updated = prev.map(r => r.id === id ? { ...r, status } : r);
      try {
        localStorage.setItem('hc_organizer_registrations', JSON.stringify(updated));
      } catch {
        // Ignored
      }
      return updated;
    });
    notify(`Team application updated to ${status}`, 'success');
  };

  // Handle Appoint Judge
  const handleAppointJudge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judgeName || !judgeEmail) {
      notify('Please enter name and email', 'warning');
      return;
    }
    const newJudge = {
      id: String(Date.now()),
      name: judgeName,
      email: judgeEmail,
      track: assignedTrack,
      expertise: judgeExpertise || 'Generative AI & LLMs'
    };
    setJudges(prev => {
      const updated = [...prev, newJudge];
      try {
        localStorage.setItem('hc_organizer_judges', JSON.stringify(updated));
      } catch {
        // Ignored
      }
      return updated;
    });
    setJudgeName('');
    setJudgeEmail('');
    setJudgeExpertise('');
    notify(`Appointed judge ${judgeName}`, 'success');
  };

  // Handle Revoke Judge
  const handleRevokeJudge = (id: string) => {
    setJudges(prev => {
      const updated = prev.filter(j => j.id !== id);
      try {
        localStorage.setItem('hc_organizer_judges', JSON.stringify(updated));
      } catch {
        // Ignored
      }
      return updated;
    });
    notify('Judge access revoked', 'info');
  };

  // Handle Broadcast Submission
  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastContent) {
      notify('Please fill in title and message', 'warning');
      return;
    }
    addAnnouncement({
      id: `ann-${Date.now()}`,
      hackathonId: 'h-1',
      title: broadcastTitle,
      content: broadcastContent,
      priority: 'HIGH' as any,
      isPinned: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    notify(`Broadcast "${broadcastTitle}" sent to live participants!`, 'success');
    setBroadcastTitle('');
    setBroadcastContent('');
  };

  // Handle Chat Send
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setChatMessages(prev => [...prev, {
      sender: `${user?.name || 'Organizer Admin'} (${currentOrg})`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      message: newMessage
    }]);
    setNewMessage('');
  };

  const [timeFilter, setTimeFilter] = useState('All Time');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  const filteredHackathons = organizerHackathons.filter(h => {
    const matchesSearch =
      (h.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (h.tagline || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'All Statuses' ||
      (h.status || 'LIVE').toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-50/20 to-indigo-50/30 p-4 sm:p-6 text-slate-900 font-sans">
      
      {/* Dedicated Workspace Top Navigation Bar */}
      <header className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-4 mb-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand & Workspace Title */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-xl text-white shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg text-slate-900 tracking-tight">Hackathon</span>
              <span className="px-2 py-0.5 text-[10px] font-black bg-purple-100 text-purple-700 rounded-md uppercase tracking-wider">
                Workspace
              </span>
            </div>
            <p className="text-xs text-slate-500 font-semibold">{currentOrg}</p>
          </div>
        </div>

        {/* Header Control Panel */}
        <div className="flex items-center gap-3">
          {/* Organization Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowOrgDropdown(!showOrgDropdown)}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-100/90 hover:bg-slate-200/90 rounded-xl text-xs font-bold text-slate-700 transition-colors border border-slate-200 cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-purple-600" />
              <span>{currentOrg}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            {showOrgDropdown && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50">
                <p className="text-[10px] font-black text-slate-400 uppercase px-3 py-1">Select Organization</p>
                {['TechCorp India Labs', 'Vercel India Hub', 'Apex Bank Labs', 'GreenTech Coalition'].map(org => (
                  <button
                    key={org}
                    onClick={() => { setCurrentOrg(org); setShowOrgDropdown(false); }}
                    className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                      currentOrg === org ? 'bg-purple-50 text-purple-700' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {org}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Calendar Schedule Modal Button */}
          <button
            onClick={() => setShowCalendarModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold transition-colors border border-indigo-100 cursor-pointer"
          >
            <CalendarIcon className="w-4 h-4 text-indigo-600" />
            <span>Calendar</span>
          </button>

          {/* Notification Bell Drawer */}
          <button
            onClick={() => setShowNotifications(true)}
            className="relative p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {announcements.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {/* User Profile Avatar Pill */}
          <div
            onClick={() => setActiveTab('settings')}
            className="flex items-center gap-2.5 pl-3 border-l border-slate-200 cursor-pointer group"
            title="Workspace & Profile Settings"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black flex items-center justify-center text-xs shadow-sm">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'KB'}
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xs font-extrabold text-slate-900 block leading-tight group-hover:text-purple-600 transition-colors">
                {user?.name || 'KVS Bhavya'}
              </span>
              <span className="text-[9px] font-black text-purple-600 uppercase">ORGANIZER</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout (Sidebar + Content Area) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Sidebar Panel (3 cols) */}
        <aside className="lg:col-span-3 space-y-6">
          
          {/* Workspace Navigation Card */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs space-y-1.5">
            <h4 className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
              WORKSPACE
            </h4>

            {[
              { id: 'overview', label: 'Dashboard Overview', icon: BarChart3 },
              { id: 'hackathons', label: `My Hackathons (${organizerHackathons.length})`, icon: Layers },
              { id: 'create', label: 'Create Hackathon', icon: Plus },
              { id: 'registrations', label: `Registrations (${registrations.length})`, icon: Users },
              { id: 'judges', label: `Judges & Rubrics (${judges.length})`, icon: Scale },
              { id: 'broadcaster', label: 'Broadcaster Studio', icon: Megaphone },
              { id: 'connect', label: 'Connect Hub', icon: Sparkles },
              { id: 'settings', label: 'Workspace Settings', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => item.id === 'create' ? handleOpenCreateTab() : setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-200'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer mt-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout Workspace</span>
            </button>
          </div>

          {/* Workspace Stats Card (Bottom Left) */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="w-4 h-4" />
              <h5 className="text-[10px] font-black uppercase tracking-wider">WORKSPACE STATS</h5>
            </div>
            
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase">Total Revenue Earned</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">₹12,50,000</h3>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
              <div className="flex justify-between items-center text-slate-600 font-medium">
                <span>Corporate Sponsors:</span>
                <span className="font-extrabold text-slate-900">₹8,00,000</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 font-medium">
                <span>Grants:</span>
                <span className="font-extrabold text-slate-900">₹4,50,000</span>
              </div>
            </div>
          </div>

        </aside>

        {/* Right Main Content Screen (9 cols) */}
        <main className="lg:col-span-9 min-w-0">
          
          {/* TAB 1: OVERVIEW (Dynamic Real-Time Stats) */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: 'Total Hosted Hackathons', value: organizerHackathons.length, icon: Trophy, color: 'text-purple-600 bg-purple-50' },
                  { title: 'Total Developer Registrations', value: registrations.length, icon: Users, color: 'text-indigo-600 bg-indigo-50' },
                  { title: 'Approved Teams', value: registrations.filter(r => r.status === 'APPROVED').length, icon: Layers, color: 'text-emerald-600 bg-emerald-50' },
                  { title: 'Appointed Judges', value: judges.length, icon: Award, color: 'text-amber-600 bg-amber-50' },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{stat.title}</p>
                        <h3 className="text-2xl font-black text-slate-900 mt-1">{stat.value}</h3>
                      </div>
                      <div className={`p-3 rounded-2xl ${stat.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-black text-slate-900">Active Hackathons Overview</h3>
                  <button
                    onClick={() => fetchHackathons()}
                    className="p-2 text-slate-400 hover:text-purple-600 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                <div className="divide-y divide-slate-100">
                  {organizerHackathons.slice(0, 5).map((h, i) => (
                    <div key={i} className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{h.title}</h4>
                        <p className="text-xs text-slate-400">{h.tagline || 'AI & Cloud Infrastructure Challenge'}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-700">
                        {h.status || 'PUBLISHED'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY HACKATHONS (Matching Reference Design 100%) */}
          {activeTab === 'hackathons' && (
            <div className="space-y-6">
              
              {/* Top Title Banner */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active Hackathons</h2>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">
                    Monitor active hackathons and review submissions scoring
                  </p>
                </div>

                <button
                  onClick={handleOpenCreateTab}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md flex items-center gap-2 transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" /> Add Hackathon
                </button>
              </div>

              {/* Search & Filter Bar */}
              <div className="bg-white rounded-3xl p-3 border border-slate-200/80 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-3">
                
                {/* Left Search Input */}
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search active hackathons by title, host or tracks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-24 py-2 text-xs font-medium rounded-2xl bg-slate-50/80 border border-slate-200/80 focus:bg-white focus:border-purple-500 outline-none"
                  />
                  <button
                    className="absolute right-1.5 top-1 bottom-1 px-4 bg-indigo-600 text-white font-black text-[10px] rounded-xl hover:bg-indigo-700 transition-colors cursor-pointer uppercase tracking-wider"
                  >
                    SEARCH
                  </button>
                </div>

                {/* Right Filters Control Panel */}
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto shrink-0 text-xs font-bold text-slate-600">
                  <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100/90 hover:bg-slate-200/90 text-slate-700 text-xs font-bold rounded-xl transition-colors border border-slate-200 cursor-pointer">
                    <span className="text-slate-500">⚙</span>
                    <span>FILTERS</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase text-slate-400">TIME:</span>
                    <select
                      value={timeFilter}
                      onChange={(e) => setTimeFilter(e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold outline-none cursor-pointer"
                    >
                      <option>All Time</option>
                      <option>This Month</option>
                      <option>This Year</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase text-slate-400">STATUS:</span>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold outline-none cursor-pointer"
                    >
                      <option>All Statuses</option>
                      <option>LIVE</option>
                      <option>UPCOMING</option>
                      <option>ENDED</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* 3-Column Hackathon Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredHackathons.map((h, i) => {
                  const statusUpper = (h.status || 'LIVE').toUpperCase();
                  let badgeBg = 'bg-emerald-500 text-white';
                  if (statusUpper === 'UPCOMING') badgeBg = 'bg-teal-500 text-white';
                  if (statusUpper === 'ENDED') badgeBg = 'bg-emerald-600 text-white';

                  return (
                    <div
                      key={h.id || i}
                      className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
                    >
                      {/* Banner Image Header */}
                      <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                        <img
                          src={h.banner || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80'}
                          alt={h.title}
                          className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-4 flex flex-col justify-between">
                          {/* Top Badge */}
                          <div className="flex justify-between items-start">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${badgeBg}`}>
                              {statusUpper}
                            </span>
                          </div>

                          {/* Title Overlay */}
                          <h3 className="text-white font-black text-base leading-snug tracking-tight drop-shadow-md line-clamp-2">
                            {h.title}
                          </h3>
                        </div>
                      </div>

                      {/* Card Content Details */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        
                        {/* Dates & Time Left Block */}
                        <div className="space-y-1.5 text-xs text-slate-500 font-semibold border-b border-slate-100 pb-3">
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                              <span>📅</span> Starts:
                            </span>
                            <span className="font-bold text-slate-800 text-[11px]">10/08/26, 3:30 pm</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                              <span>📅</span> Ends:
                            </span>
                            <span className="font-bold text-slate-800 text-[11px]">15/08/26, 11:30 pm</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                              <span>⏳</span> Time Left:
                            </span>
                            <span className="font-black text-slate-900 text-[11px] uppercase tracking-wider">12 DAYS LEFT</span>
                          </div>
                        </div>

                        {/* Prize Pool & Hackers Row */}
                        <div className="grid grid-cols-2 gap-2 text-left py-0.5">
                          <div>
                            <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider">PRIZE POOL</span>
                            <span className="text-sm font-black text-emerald-600 leading-tight block">{h.prizePool || '₹25,00,000'}</span>
                          </div>
                          <div>
                            <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider">HACKERS</span>
                            <span className="text-sm font-black text-slate-900 leading-tight block">856</span>
                          </div>
                        </div>

                        {/* Footer Row (Mode + Action Buttons) */}
                        <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-xs">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                            {h.mode || 'ONLINE'}
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenModifyModal(h)}
                              className="px-3.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] rounded-xl transition-colors cursor-pointer"
                            >
                              Modify
                            </button>
                            <button
                              onClick={() => handlePromptDelete(h)}
                              className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-[11px] rounded-xl transition-colors cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 3: CREATE HACKATHON (Enterprise 5-Step Wizard Studio) */}
          {activeTab === 'create' && (
            <CreateHackathonWizard
              initialHackathon={editingHackathonId ? organizerHackathons.find(h => h.id === editingHackathonId) : null}
              onSaveDraft={(draftData) => {
                setOrganizerHackathons(prev => {
                  const exists = prev.some(h => h.id === draftData.id);
                  const updated = exists
                    ? prev.map(h => h.id === draftData.id ? { ...h, ...draftData } as Hackathon : h)
                    : [{ status: 'DRAFT', ...draftData } as Hackathon, ...prev];
                  try {
                    localStorage.setItem('hc_organizer_hackathons', JSON.stringify(updated));
                  } catch {}
                  return updated;
                });

                // Sync to backend DB asynchronously
                if (editingHackathonId) {
                  hackathonApi.update(editingHackathonId, draftData).catch(() => {});
                } else {
                  hackathonApi.create(draftData).catch(() => {});
                }
              }}
              onPublish={(newHackathon) => {
                setOrganizerHackathons(prev => {
                  const exists = prev.some(h => h.id === newHackathon.id);
                  const updated = exists
                    ? prev.map(h => h.id === newHackathon.id ? newHackathon : h)
                    : [newHackathon, ...prev];
                  try {
                    localStorage.setItem('hc_organizer_hackathons', JSON.stringify(updated));
                  } catch {}
                  return updated;
                });

                // Sync to backend DB asynchronously
                if (editingHackathonId) {
                  hackathonApi.update(editingHackathonId, newHackathon).catch(() => {});
                } else {
                  hackathonApi.create(newHackathon).catch(() => {});
                }

                setEditingHackathonId(null);
                setActiveTab('hackathons');
                addToast({
                  title: 'Hackathon Published! 🚀',
                  message: `"${newHackathon.title}" is now live on the platform portal.`,
                  type: 'success',
                  duration: 5000
                });
              }}
              onCancel={() => {
                setEditingHackathonId(null);
                setActiveTab('hackathons');
              }}
            />
          )}

          {/* TAB 4: REGISTRATIONS (Enterprise Developer Registrations Management) */}
          {activeTab === 'registrations' && (
            <div className="space-y-6">
              
              {/* Header Title & Top Export Action Bar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                    <Users className="w-6 h-6 text-purple-600" />
                    <span>Developer Registrations Management</span>
                  </h2>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">
                    Verify developer credentials, manage team approvals, and export applicant reports
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  {/* Approve All Button */}
                  <button
                    onClick={handleApproveAll}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
                    title="Approve all currently displayed developer applications"
                  >
                    <span>✓</span>
                    <span>Approve All</span>
                  </button>

                  {/* Excel Export Button */}
                  <button
                    onClick={handleExportExcel}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
                    title="Export Filtered List to Excel / CSV"
                  >
                    <span>📥</span>
                    <span>Export Excel (.csv)</span>
                  </button>
                </div>
              </div>

              {/* 4 KPI Stat Metric Cards (Dynamic Calculations) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-1">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="text-[10px] font-black uppercase tracking-wider">TOTAL REGISTRATIONS</span>
                    <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">Live Total</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">{registrations.length}</h3>
                  <p className="text-[11px] font-semibold text-slate-400">Across {organizerHackathons.length} hosted events</p>
                </div>

                <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-1">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="text-[10px] font-black uppercase tracking-wider">APPROVED TEAMS</span>
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                      {registrations.length > 0 ? Math.round((registrations.filter(r => r.status === 'APPROVED').length / registrations.length) * 100) : 0}% Accepted
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-emerald-600">
                    {registrations.filter(r => r.status === 'APPROVED').length}
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-400">Verified & seat confirmed</p>
                </div>

                <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-1">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="text-[10px] font-black uppercase tracking-wider">PENDING REVIEW</span>
                    <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">Action Needed</span>
                  </div>
                  <h3 className="text-2xl font-black text-amber-600">
                    {registrations.filter(r => r.status === 'PENDING').length}
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-400">Awaiting organizer audit</p>
                </div>

                <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-1">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="text-[10px] font-black uppercase tracking-wider">SHORTLISTED / REJECTED</span>
                    <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">Processed</span>
                  </div>
                  <h3 className="text-2xl font-black text-purple-600">
                    {registrations.filter(r => r.status === 'SHORTLISTED' || r.status === 'REJECTED').length}
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-400">Reviewed standby list</p>
                </div>
              </div>

              {/* Advanced Search & Filter Control Panel */}
              <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs space-y-3">
                
                <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
                  
                  {/* Left Search Input */}
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Search applicants by developer name, email, team, or college..."
                      value={regSearchQuery}
                      onChange={(e) => setRegSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs font-medium rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-purple-500 outline-none"
                    />
                  </div>

                  {/* Filter Dropdowns */}
                  <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto shrink-0 text-xs font-bold">
                    
                    {/* Status Filter */}
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-black uppercase text-slate-400">STATUS:</span>
                      <select
                        value={regStatusFilter}
                        onChange={(e) => setRegStatusFilter(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold outline-none cursor-pointer"
                      >
                        <option>All Statuses</option>
                        <option>APPROVED</option>
                        <option>PENDING</option>
                        <option>SHORTLISTED</option>
                        <option>REJECTED</option>
                      </select>
                    </div>

                    {/* Track Filter */}
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-black uppercase text-slate-400">TRACK:</span>
                      <select
                        value={regTrackFilter}
                        onChange={(e) => setRegTrackFilter(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold outline-none cursor-pointer"
                      >
                        <option>All Tracks</option>
                        <option>Generative AI</option>
                        <option>Agentic Coding</option>
                        <option>Web3 Protocols</option>
                        <option>FinTech</option>
                        <option>Smart Cities</option>
                      </select>
                    </div>

                    {/* Experience Filter */}
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-black uppercase text-slate-400">LEVEL:</span>
                      <select
                        value={regExperienceFilter}
                        onChange={(e) => setRegExperienceFilter(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold outline-none cursor-pointer"
                      >
                        <option>All Levels</option>
                        <option>Student</option>
                        <option>Working Professional</option>
                        <option>Senior Architect</option>
                      </select>
                    </div>

                  </div>

                </div>

                {/* Bulk Actions Bar (Visible when rows selected) */}
                {selectedRegIds.length > 0 && (
                  <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 flex items-center justify-between text-xs font-bold">
                    <span className="text-purple-800">{selectedRegIds.length} Developer Registration(s) Selected</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleBulkStatus('APPROVED')}
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-[11px] hover:bg-emerald-700 transition-colors cursor-pointer"
                      >
                        ✓ Approve Selected
                      </button>
                      <button
                        onClick={() => handleBulkStatus('REJECTED')}
                        className="px-3 py-1.5 bg-rose-600 text-white rounded-xl text-[11px] hover:bg-rose-700 transition-colors cursor-pointer"
                      >
                        ✗ Reject Selected
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* Enterprise Registrations Data Table */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/90 text-[10px] font-black uppercase text-slate-400 border-b border-slate-200/80">
                      <tr>
                        <th className="px-4 py-4 w-10">
                          <input
                            type="checkbox"
                            checked={selectedRegIds.length > 0 && selectedRegIds.length === filteredRegistrations.length}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedRegIds(filteredRegistrations.map(r => r.id));
                              } else {
                                setSelectedRegIds([]);
                              }
                            }}
                            className="rounded text-purple-600 cursor-pointer"
                          />
                        </th>
                        <th className="px-5 py-4">DEVELOPER & TEAM</th>
                        <th className="px-5 py-4">TRACK & EVENT</th>
                        <th className="px-5 py-4">INSTITUTION / ORG</th>
                        <th className="px-5 py-4">EXPERIENCE</th>
                        <th className="px-5 py-4">STATUS</th>
                        <th className="px-5 py-4">REGISTERED</th>
                        <th className="px-5 py-4 text-right">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                      {filteredRegistrations.map((row) => {
                        const isSelected = selectedRegIds.includes(row.id);
                        let statusColor = 'bg-amber-100 text-amber-800';
                        if (row.status === 'APPROVED') statusColor = 'bg-emerald-100 text-emerald-800';
                        if (row.status === 'REJECTED') statusColor = 'bg-rose-100 text-rose-800';
                        if (row.status === 'SHORTLISTED') statusColor = 'bg-purple-100 text-purple-800';

                        return (
                          <tr key={row.id} className={`hover:bg-slate-50/80 transition-colors ${isSelected ? 'bg-purple-50/30' : ''}`}>
                            <td className="px-4 py-4">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedRegIds(prev => [...prev, row.id]);
                                  } else {
                                    setSelectedRegIds(prev => prev.filter(id => id !== row.id));
                                  }
                                }}
                                className="rounded text-purple-600 cursor-pointer"
                              />
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                                  {(row.leaderName || row.groupName || 'D').slice(0, 2).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <h4 className="font-bold text-slate-900 leading-tight">{row.groupName}</h4>
                                  <p className="text-[11px] text-slate-400">{row.leaderName} • {row.leaderEmail}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <span className="font-bold text-slate-900 block text-xs">{row.track || 'Generative AI'}</span>
                              <span className="text-[10px] text-slate-400 font-semibold">{row.eventTitle || 'AI Innovation Challenge'}</span>
                            </td>
                            <td className="px-5 py-4 font-medium text-slate-600">{row.orgName || 'IIT Madras'}</td>
                            <td className="px-5 py-4">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                                {row.level || 'Professional'}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${statusColor}`}>
                                {row.status || 'PENDING'}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-[11px] font-medium text-slate-500">
                              {row.registeredAt || '2026-08-03'}
                            </td>
                            <td className="px-5 py-4 text-right space-x-1.5 shrink-0">
                              <button
                                onClick={() => setViewingRegistration(row)}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg transition-colors cursor-pointer"
                                title="View Application Details"
                              >
                                View
                              </button>
                              <button
                                onClick={() => handleRegistrationStatus(row.id, 'APPROVED')}
                                className="px-2.5 py-1 bg-emerald-600 text-white font-bold text-[11px] rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRegistrationStatus(row.id, 'REJECTED')}
                                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-[11px] rounded-lg transition-colors cursor-pointer"
                              >
                                Reject
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: JUDGES & RUBRICS (Screen 3 Match) */}
          {activeTab === 'judges' && (
            <div className="space-y-6">
              
              {/* Header Dark Card */}
              <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2 text-indigo-300">
                  <Award className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-wider">EVALUATION PROCESS</span>
                </div>
                <h3 className="text-xl font-black flex items-center gap-2">
                  <span>⚖️</span> How Judges Evaluate & Score submissions
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-[9px] font-extrabold text-indigo-300 uppercase">STEP 01: ASSIGN TRACK</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      Judges are assigned to specific challenge statement tracks based on their expertise.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-[9px] font-extrabold text-indigo-300 uppercase">STEP 02: SCORING RUBRICS</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      Judges review project code and assign scores (1 to 10) on preset criteria weights.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-[9px] font-extrabold text-indigo-300 uppercase">STEP 03: STANDINGS SYNC</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      Weighted standings update in real-time, pushing top solutions to the Leaderboard.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form & Appointed Panel Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Form Card */}
                <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-purple-600" /> Appoint New Judge
                  </h3>

                  <form className="space-y-3" onSubmit={handleAppointJudge}>
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-600 block mb-1">Judge Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Shaik Ansar Ali"
                        value={judgeName}
                        onChange={(e) => setJudgeName(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-purple-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-600 block mb-1">Email Address</label>
                      <input
                        type="email"
                        placeholder="e.g. ansar@judge.io"
                        value={judgeEmail}
                        onChange={(e) => setJudgeEmail(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-purple-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-600 block mb-1">Expertise Domain</label>
                      <input
                        type="text"
                        placeholder="e.g. Machine Learning, Cryptography"
                        value={judgeExpertise}
                        onChange={(e) => setJudgeExpertise(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-purple-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-600 block mb-1">Assigned Event Track</label>
                      <select
                        value={assignedTrack}
                        onChange={(e) => setAssignedTrack(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-purple-500 outline-none"
                      >
                        <option>Generative AI</option>
                        <option>Agentic Coding</option>
                        <option>Web3 & DeFi</option>
                        <option>Open Innovation</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-md hover:from-purple-700 hover:to-indigo-700 transition-all cursor-pointer mt-2"
                    >
                      ✓ Save Judge Details
                    </button>
                  </form>
                </div>

                {/* Appointed Panel List */}
                <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-black text-slate-900">APPOINTED PANEL ({judges.length})</h3>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Active Evaluators</span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {judges.map((j) => (
                      <div key={j.id} className="py-3 flex items-center justify-between gap-4">
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs">{j.name}</h4>
                          <p className="text-[10px] text-slate-400">{j.email}</p>
                          <p className="text-[11px] font-bold text-purple-600 mt-0.5">{j.track}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-500 font-medium">{j.expertise}</p>
                          <button
                            onClick={() => handleRevokeJudge(j.id)}
                            className="text-xs font-bold text-rose-600 hover:text-rose-700 mt-1 cursor-pointer"
                          >
                            Revoke
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 6: BROADCASTER (Screen 4 Match) */}
          {activeTab === 'broadcaster' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs max-w-3xl mx-auto space-y-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <span>📢</span> Broadcast Studio
                </h2>
                <p className="text-xs font-semibold text-slate-500 mt-1">
                  Broadcasting notifications directly to live participant dashboards
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSendBroadcast}>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-600 block mb-1">Target Event</label>
                  <select
                    value={broadcastEvent}
                    onChange={(e) => setBroadcastEvent(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-purple-500 outline-none"
                  >
                    <option>Web3 & Decentralized Scale-A-Thon</option>
                    <option>AI Innovation Challenge 2026</option>
                    <option>Smart Cities Hackathon 2026</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-600 block mb-1">Announcement Title</label>
                  <input
                    type="text"
                    placeholder="📢 Submissions are now open for final evaluation!"
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs font-medium rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-600 block mb-1">Message Content</label>
                  <textarea
                    rows={4}
                    placeholder="Provide explicit instructions for building teams..."
                    value={broadcastContent}
                    onChange={(e) => setBroadcastContent(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs font-medium rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-purple-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-500 block mb-1">START BROADCAST (TIME STARTS)</label>
                    <input
                      type="datetime-local"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-500 block mb-1">END BROADCAST (TIME ENDS/DEADLINE)</label>
                    <input
                      type="datetime-local"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sendEmail}
                      onChange={(e) => setSendEmail(e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">📧 Send Email Alert</span>
                      <span className="text-[10px] text-slate-400 block">Directly to inbox</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sendSms}
                      onChange={(e) => setSendSms(e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">📱 Send Phone SMS</span>
                      <span className="text-[10px] text-slate-400 block">Directly to mobile device</span>
                    </div>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-md hover:from-purple-700 hover:to-indigo-700 transition-all cursor-pointer"
                >
                  Broadcast & Schedule Notifications
                </button>
              </form>
            </div>
          )}

          {/* TAB 7: CONNECT HUB (Screen 5 Match) */}
          {activeTab === 'connect' && (
            <div className="space-y-6">
              
              {/* Header Dark Card */}
              <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Organizer Hub • Realtime Collaboration Network
                  </span>
                  <h2 className="text-2xl font-black tracking-tight">Connect & Coordinate Sprints</h2>
                  <p className="text-xs text-slate-300 max-w-xl">
                    Prevent event collisions, align prize pool distribution dates, and chat directly with verified hackathon organizers across India.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="px-4 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                    <span className="text-lg font-black text-emerald-400 block">4</span>
                    <span className="text-[9px] font-extrabold text-emerald-300 uppercase">Active Hosts Online</span>
                  </div>
                  <div className="px-4 py-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-center">
                    <span className="text-lg font-black text-indigo-400 block">0</span>
                    <span className="text-[9px] font-extrabold text-indigo-300 uppercase">Collisions</span>
                  </div>
                </div>
              </div>

              {/* Timeline Cards */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <span>🗓️</span> Coordinated Timeline Calendar
                  </h3>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold rounded-full">
                    ● Live Schedule Synced
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { title: 'AI Innovation Challenge 2026', org: 'TechCorp India Labs', dates: 'Sep 01 — Sep 07', tag: 'Live Now', badgeColor: 'bg-emerald-100 text-emerald-700' },
                    { title: 'Vercel Web3 Builder Sprint', org: 'Vercel India Hub', dates: 'Sep 15 — Sep 22', tag: 'Confirmed', badgeColor: 'bg-indigo-100 text-indigo-700' },
                    { title: 'Smart Cities Hackathon 2026', org: 'Green Tech Coalition', dates: 'Oct 10 — Oct 15', tag: 'Upcoming', badgeColor: 'bg-amber-100 text-amber-700' },
                    { title: 'FinTech Disrupt Challenge', org: 'Apex Bank Labs', dates: 'Nov 05 — Nov 10', tag: 'Planning', badgeColor: 'bg-slate-100 text-slate-700' },
                  ].map((card, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold ${card.badgeColor}`}>{card.tag}</span>
                        <span className="text-[9px] text-slate-400 font-bold">GenAI, Web3</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs">{card.title}</h4>
                      <p className="text-[10px] text-slate-400">{card.org}</p>
                      <p className="text-[11px] font-bold text-slate-700 pt-1 border-t border-slate-200">{card.dates}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat & Verified Organizers */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Organizers List */}
                <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black uppercase text-slate-900">VERIFIED ORGANIZERS</h4>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">3 Online</span>
                  </div>

                  <div className="space-y-2">
                    {[
                      { name: 'Elena Rostova', org: 'Vercel India Hub', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
                      { name: 'Suresh Kumar', org: 'Apex Bank Labs', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
                      { name: 'Ananya Sharma', org: 'GreenTech Coalition', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' },
                    ].map((org, i) => (
                      <div key={i} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img src={org.avatar} alt={org.name} className="w-8 h-8 rounded-full object-cover" />
                          <div className="min-w-0">
                            <h5 className="text-xs font-bold text-slate-900 truncate">{org.name}</h5>
                            <p className="text-[10px] text-slate-400 truncate">{org.org}</p>
                          </div>
                        </div>
                        <button className="px-2.5 py-1 text-[10px] font-bold bg-white border border-slate-200 hover:border-purple-300 rounded-lg text-purple-700 cursor-pointer">
                          DM
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Chat Window */}
                <div className="lg:col-span-8 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h4 className="text-xs font-black text-slate-900">Public Organizer Network</h4>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-purple-50 text-purple-700 text-[10px] font-bold rounded-lg">📢 Public Room</span>
                    </div>
                  </div>

                  {/* Pinned Rule Banner */}
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center justify-between">
                    <span>📌 PINNED: Finalize your September hackathon prize dates by Sep 10th to prevent collisions.</span>
                    <span className="text-[10px] font-bold">Rule #4</span>
                  </div>

                  {/* Messages Stream */}
                  <div className="space-y-3 min-h-[160px] max-h-[220px] overflow-y-auto p-2">
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-purple-700">{msg.sender}</span>
                          <span className="text-[10px] text-slate-400">{msg.time}</span>
                        </div>
                        <p className="text-slate-700 font-medium">{msg.message}</p>
                      </div>
                    ))}
                  </div>

                  {/* Message Input Form */}
                  <form className="flex items-center gap-2 pt-2" onSubmit={handleSendChat}>
                    <input
                      type="text"
                      placeholder="Type a message to all organizers..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 px-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-purple-500 outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-purple-600 text-white font-bold text-xs rounded-xl hover:bg-purple-700 cursor-pointer flex items-center gap-1"
                    >
                      <Send className="w-3.5 h-3.5" /> Send
                    </button>
                  </form>
                </div>
              </div>

            </div>
          )}

          {/* TAB 8: WORKSPACE SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs max-w-2xl mx-auto space-y-6">
              <h2 className="text-2xl font-black text-slate-900">Workspace Settings</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-600 block mb-1">Organization Name</label>
                  <input
                    type="text"
                    value={currentOrg}
                    onChange={(e) => setCurrentOrg(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs font-medium rounded-xl bg-slate-50 border border-slate-200 focus:bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-600 block mb-1">Support Email</label>
                  <input
                    type="email"
                    defaultValue="organizer@hackathoncentral.io"
                    className="w-full px-4 py-2.5 text-xs font-medium rounded-xl bg-slate-50 border border-slate-200 focus:bg-white outline-none"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={() => notify('Workspace settings saved!', 'success')}
                    className="px-6 py-2.5 bg-purple-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-purple-700 cursor-pointer"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>

      </div>

      {/* Calendar Schedule Modal */}
      {showCalendarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 relative border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-purple-600" /> Event Calendar Schedule
              </h3>
              <button onClick={() => setShowCalendarModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1 text-xs">
              {organizerHackathons.map((h, idx) => (
                <div key={h.id || idx} className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-extrabold uppercase text-indigo-700">Sep 01 — Sep 07, 2026</span>
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-purple-100 text-purple-700 uppercase">
                      {h.status || 'PUBLISHED'}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{h.title}</h4>
                  <p className="text-slate-500 text-[11px]">{h.tagline || 'Live Hackathon & Developer Sprint'}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowCalendarModal(false)}
              className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800"
            >
              Close Calendar
            </button>
          </div>
        </div>
      )}

      {/* Delete Event Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 relative border border-slate-200">
            <div className="flex items-center gap-3 text-rose-600 border-b border-slate-100 pb-3">
              <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-100">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900 leading-tight">Delete Event Confirmation</h3>
                <p className="text-[10px] font-bold text-rose-600 uppercase">Irreversible Action</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600 font-medium leading-relaxed">
                This action <strong className="text-slate-900">cannot be undone</strong>. This will permanently delete the event <strong className="text-slate-900">"{deleteTarget.title}"</strong>, all associated developer registrations, submission records, and judge assignments.
              </p>

              <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/80 space-y-2">
                <label className="text-[11px] font-bold text-slate-800 block mb-1">
                  Please type <span className="font-mono font-black text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded border border-rose-200 select-all">{deleteTarget.title}</span> to confirm:
                </label>
                <input
                  type="text"
                  placeholder={deleteTarget.title}
                  value={deleteConfirmInput}
                  onChange={(e) => setDeleteConfirmInput(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-rose-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteConfirmInput.trim() !== deleteTarget.title.trim()}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Permanently Delete Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Developer Application Detail Modal */}
      {viewingRegistration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 relative border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-lg text-slate-900 leading-tight">
                  {viewingRegistration.groupName}
                </h3>
                <p className="text-xs font-semibold text-slate-400">Team Code: {viewingRegistration.code}</p>
              </div>
              <button
                onClick={() => setViewingRegistration(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-2">
                <div className="flex justify-between border-b border-purple-200/60 pb-2">
                  <span className="font-bold text-slate-500">Team Lead Name:</span>
                  <span className="font-black text-slate-900">{viewingRegistration.leaderName}</span>
                </div>
                <div className="flex justify-between border-b border-purple-200/60 pb-2">
                  <span className="font-bold text-slate-500">Email Address:</span>
                  <span className="font-bold text-indigo-600">{viewingRegistration.leaderEmail}</span>
                </div>
                <div className="flex justify-between border-b border-purple-200/60 pb-2">
                  <span className="font-bold text-slate-500">Phone Contact:</span>
                  <span className="font-semibold text-slate-800">{viewingRegistration.leaderPhone || '+91 98765 43210'}</span>
                </div>
                <div className="flex justify-between border-b border-purple-200/60 pb-2">
                  <span className="font-bold text-slate-500">Institution / College:</span>
                  <span className="font-black text-slate-900">{viewingRegistration.orgName || 'IIT Madras'}</span>
                </div>
                <div className="flex justify-between border-b border-purple-200/60 pb-2">
                  <span className="font-bold text-slate-500">Challenge Track:</span>
                  <span className="font-black text-purple-700">{viewingRegistration.track || 'Generative AI & LLMs'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-slate-500">Experience Level:</span>
                  <span className="font-black text-slate-900">{viewingRegistration.level || 'Working Professional'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-600">Developer Profile / GitHub:</span>
                <a
                  href={viewingRegistration.github || 'https://github.com'}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <span>{viewingRegistration.github || 'github.com/developer'}</span>
                  <span>↗</span>
                </a>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  handleRegistrationStatus(viewingRegistration.id, 'REJECTED');
                  setViewingRegistration(null);
                }}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Reject Application
              </button>
              <button
                onClick={() => {
                  handleRegistrationStatus(viewingRegistration.id, 'APPROVED');
                  setViewingRegistration(null);
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                ✓ Approve Application
              </button>
            </div>
          </div>
        </div>
      )}
      <NotificationDrawer
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        announcements={announcements}
      />

      {/* Top-Right Sliding Toast Container */}
      <ToastContainer />
    </div>
  );
};
