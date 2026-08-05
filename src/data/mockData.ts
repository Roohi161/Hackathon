/**
 * Default/fallback data for when the backend API is unreachable.
 * This data is used ONLY as initialization defaults in stores and components.
 * When the backend is connected, stores will fetch live data and replace these.
 *
 * NOTE: These are NOT mock/fake data for testing. They represent a reasonable
 * "empty state" or minimal sample data for offline/demo mode.
 */

export const PROJECT_TEAM = [
  {
    name: 'Development Team',
    role: 'Full Stack Engineers',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    bio: 'Building the future of hackathon management.',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
];

export const INITIAL_HACKATHONS: Array<Record<string, unknown>> = [
  {
    id: 'h-1',
    title: 'AI Hackathon 2026',
    slug: 'ai-hackathon-2026',
    tagline: 'Build next-generation autonomous AI agents & multimodal apps.',
    description: 'Join top global developers in building cutting-edge Generative AI applications, RAG pipelines, and AI copilot agents.',
    banner: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    status: 'live',
    mode: 'online',
    visibility: 'PUBLIC',
    location: 'Online / Virtual',
    timezone: 'IST',
    startDate: 'Aug 01, 2026',
    endDate: 'Aug 10, 2026',
    maxTeamSize: 5,
    minTeamSize: 1,
    prizePool: '₹25,00,000',
    organizerName: 'TechCorp India Labs',
    organizerVerified: true,
    participantsCount: 1420,
    teamsCount: 310,
    tracks: ['Generative AI', 'Agentic Coding', 'LLM Infrastructure'],
    problemStatements: [
      { id: 'ps-1', title: 'Autonomous Code Refactoring Agent', description: 'Build an AI agent that automatically detects technical debt and opens pull requests.', difficulty: 'Advanced' },
      { id: 'ps-2', title: 'Real-time Multimodal RAG Assistant', description: 'Develop an Assistant capable of querying complex PDFs and video transcripts.', difficulty: 'Intermediate' }
    ],
    prizes: [
      { title: '1st Place Grand Winner', amount: '₹10,00,000' },
      { title: '2nd Place Runner-Up', amount: '₹6,00,000' },
      { title: 'Best AI Agent Special Track', amount: '₹4,00,000' }
    ]
  },
  {
    id: 'h-2',
    title: 'Quantum FinTech Challenge',
    slug: 'quantum-fintech-challenge',
    tagline: 'Decentralized ledger, smart contract auditing & Web3 finance.',
    description: 'Transform financial infrastructure with high-frequency algorithmic trading, privacy-preserving zero-knowledge proofs, and smart contracts.',
    banner: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
    status: 'live',
    mode: 'hybrid',
    visibility: 'PUBLIC',
    location: 'Bengaluru / Hybrid',
    timezone: 'IST',
    startDate: 'Aug 05, 2026',
    endDate: 'Aug 15, 2026',
    maxTeamSize: 4,
    minTeamSize: 1,
    prizePool: '₹18,00,000',
    organizerName: 'FinTech Innovations Forum',
    organizerVerified: true,
    participantsCount: 890,
    teamsCount: 180,
    tracks: ['DeFi Protocols', 'Zero-Knowledge Proofs', 'Algorithmic Trading'],
    problemStatements: [
      { id: 'ps-3', title: 'Automated Smart Contract Vulnerability Scanner', description: 'Build a static analyzer tool that detects reentrancy and overflow bugs.', difficulty: 'Advanced' }
    ],
    prizes: [
      { title: 'Grand Champion', amount: '₹8,00,000' },
      { title: 'Best ZK-Proof Hack', amount: '₹4,00,000' }
    ]
  },
  {
    id: 'h-3',
    title: 'HealthTech AI Summit',
    slug: 'healthtech-ai-summit',
    tagline: 'Predictive clinical diagnostic models & medical imaging AI.',
    description: 'Innovate digital healthcare solutions with machine learning models for early disease prediction and automated EHR integrations.',
    banner: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    status: 'upcoming',
    mode: 'online',
    visibility: 'PUBLIC',
    location: 'Virtual',
    timezone: 'IST',
    startDate: 'Aug 20, 2026',
    endDate: 'Aug 25, 2026',
    maxTeamSize: 4,
    minTeamSize: 1,
    prizePool: '₹15,00,000',
    organizerName: 'Apex Health Research',
    organizerVerified: true,
    participantsCount: 650,
    teamsCount: 120,
    tracks: ['Medical Computer Vision', 'Predictive Diagnostics'],
    prizes: [
      { title: 'Top Diagnostic Innovation', amount: '₹7,00,000' }
    ]
  },
  {
    id: 'h-4',
    title: 'Cyber Security Summit 2026',
    slug: 'cyber-security-summit-2026',
    tagline: 'Zero-trust architecture, threat defense & vulnerability scanning.',
    description: 'Test your offensive and defensive security skills in penetration testing, threat detection, and encrypted communication protocols.',
    banner: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    status: 'ended',
    mode: 'in-person',
    visibility: 'PUBLIC',
    location: 'Hyderabad Tech Center',
    timezone: 'IST',
    startDate: 'Jul 10, 2026',
    endDate: 'Jul 15, 2026',
    maxTeamSize: 4,
    minTeamSize: 1,
    prizePool: '₹12,00,000',
    organizerName: 'CyberGuard Alliance',
    organizerVerified: true,
    participantsCount: 1100,
    teamsCount: 240,
    tracks: ['Zero-Trust', 'Penetration Testing'],
    prizes: [
      { title: '1st Place Shield Winner', amount: '₹5,00,000' }
    ]
  }
];

export const INITIAL_TEAMS: Array<Record<string, unknown>> = [];

export const INITIAL_ANNOUNCEMENTS: Array<Record<string, unknown>> = [];

export const INITIAL_SUBMISSIONS: Array<Record<string, unknown>> = [];

export const INITIAL_VERIFICATIONS: Array<Record<string, unknown>> = [];
