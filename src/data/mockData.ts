import type { Hackathon, ProjectSubmission, Team, Announcement, OrganizerVerificationRequest, ProjectTeamMember } from '../types';

export const PROJECT_TEAM: ProjectTeamMember[] = [
  {
    name: 'Shaik Ansar Ali',
    role: 'Lead Full-Stack Architect & AI Specialist',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com'
  },
  {
    name: 'KVS Bhavya Sri',
    role: 'Frontend Engineer & UI/UX Designer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com'
  },
  {
    name: 'M Rohan Yaswanth',
    role: 'Backend API & Database Engineer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com'
  },
  {
    name: 'Shaik Roohi',
    role: 'Real-time Infrastructure & QA Engineer',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com'
  }
];

export const INITIAL_HACKATHONS: Hackathon[] = [
  {
    id: 'hack-1',
    title: 'AI Innovators Global Hackathon 2026',
    tagline: 'Build next-generation autonomous AI agents and multimodal web apps.',
    banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    status: 'live',
    mode: 'online',
    location: 'Global (Virtual)',
    startDate: '2026-07-20T09:00:00Z',
    endDate: '2026-07-28T23:59:59Z',
    prizePool: '₹40,00,000',
    prizeBreakdown: [
      { title: '🥇 1st Grand Winner', amount: '₹20,00,000', description: 'Includes Cloud credits & Vercel Pro membership.' },
      { title: '🥈 2nd Place Runner-Up', amount: '₹12,00,000', description: 'Includes ₹4 lakh API credits for LLM tooling.' },
      { title: '🥉 Best UI/UX Design', amount: '₹8,00,000', description: 'Awarded to top visually outstanding application.' }
    ],
    tracks: ['Generative AI', 'Agentic Coding', 'Multimodal Web Apps', 'Open Innovation'],
    problemStatements: [
      {
        id: 'ps-101',
        track: 'Generative AI',
        title: 'Autonomous Code Refactoring Agent',
        description: 'Design an end-to-end intelligent coding assistant capable of auto-fixing TypeScript lint errors, writing unit tests, and visualizing system architecture.',
        difficulty: 'Advanced'
      },
      {
        id: 'ps-102',
        track: 'Agentic Coding',
        title: 'Real-Time Hackathon Management System',
        description: 'Build a full-stack unified platform supporting live leaderboards, rubric-based evaluation portals, and participant invite workflows.',
        difficulty: 'Intermediate'
      },
      {
        id: 'ps-103',
        track: 'Multimodal Web Apps',
        title: 'Interactive Data Visualizer for Scientific Workflows',
        description: 'Develop dynamic data dashboards processing biological, genomic, or chemical API datasets in browser.',
        difficulty: 'All Levels'
      }
    ],
    rubrics: [
      { id: 'rub-1', name: 'Innovation & Originality', description: 'Creativity and unique problem-solving approach', weight: 30 },
      { id: 'rub-2', name: 'Technical Execution & Architecture', description: 'Code quality, test coverage, and backend robustness', weight: 30 },
      { id: 'rub-3', name: 'UI / UX Design Excellence', description: 'Aesthetics, animations, responsive polish, and usability', weight: 25 },
      { id: 'rub-4', name: 'Presentation & Demo Video', description: 'Clarity of presentation, live demo video, and documentation', weight: 15 }
    ],
    schedule: [
      { time: 'Day 1 (July 20)', event: 'Opening Ceremony & Track Briefing', description: 'Keynotes by industry leaders and mentor QA.' },
      { time: 'Day 3 (July 22)', event: 'Midway Checkpoint & Office Hours', description: '1-on-1 mentor guidance sessions.' },
      { time: 'Day 8 (July 27)', event: 'Submission Deadline (23:59 UTC)', description: 'Projects must submit GitHub links & Video demos.' },
      { time: 'Day 9 (July 28)', event: 'Live Judging & Winners Ceremony', description: 'Judges score entries live on evaluation portal.' }
    ],
    rules: [
      'Teams must consist of 1 to 4 participants.',
      'All code must be committed to a public GitHub repository during the hackathon timeline.',
      'Submissions must include a 2-3 minute video demonstration (YouTube/Loom link).',
      'Plagiarism or pre-built complete applications strictly prohibited.'
    ],
    featured: true,
    organizerName: 'DevPulse Labs',
    organizerVerified: true,
    participantsCount: 1542,
    teamsCount: 312,
    description: '',
    tags: []
  },
  {
    id: 'hack-2',
    title: 'Web3 & Decentralized Scale-A-Thon',
    tagline: 'Construct scalable dApps, zero-knowledge tools, and cross-chain protocols.',
    banner: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80',
    status: 'upcoming',
    mode: 'hybrid',
    location: 'San Francisco, CA & Online',
    startDate: '2026-08-10T10:00:00Z',
    endDate: '2026-08-15T18:00:00Z',
    prizePool: '₹60,00,000',
    prizeBreakdown: [
      { title: '🏆 Grand Protocol Prize', amount: '₹32,00,000' },
      { title: '⚡ Best ZK Application', amount: '₹16,00,000' },
      { title: '🎨 Best DAO Tooling', amount: '₹12,0,000' }
    ],
    tracks: ['DeFi', 'Zero-Knowledge', 'Cross-Chain', 'Infra & Tooling'],
    problemStatements: [
      {
        id: 'ps-201',
        track: 'DeFi',
        title: 'Micro-Loan Protocol with Reputation Scoring',
        description: 'Create an on-chain credit verification protocol with privacy-preserving zero-knowledge proofs.',
        difficulty: 'Advanced'
      }
    ],
    rubrics: [
      { id: 'rub-201', name: 'Smart Contract Security', description: 'Clean code & gas optimization', weight: 35 },
      { id: 'rub-202', name: 'User Experience & Wallet Flow', description: 'Seamless onboarding without friction', weight: 35 },
      { id: 'rub-203', name: 'Pitch & Practical Utility', description: 'Market viability and presentation', weight: 30 }
    ],
    schedule: [
      { time: 'Aug 10', event: 'Hackathon Hack-off Launch' },
      { time: 'Aug 15', event: 'Final Pitching & Award Ceremony' }
    ],
    rules: [
      'Maximum 5 members per team.',
      'Smart contracts must be verifiable on Etherscan/Blockscout.'
    ],
    featured: true,
    organizerName: 'CryptoForge Alliance',
    organizerVerified: false,
    participantsCount: 856,
    teamsCount: 145,
    description: '',
    tags: []
  },
  {
    id: 'hack-3',
    title: 'ClimateTech & Green Innovation Challenge',
    tagline: 'Pioneering technology for carbon tracking, renewable grid management, and sustainability.',
    banner: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
    status: 'ended',
    mode: 'in-person',
    location: 'Berlin Tech Center, Germany',
    startDate: '2026-06-01T08:00:00Z',
    endDate: '2026-06-05T20:00:00Z',
    prizePool: '₹25,00,000',
    prizeBreakdown: [
      { title: '🌱 Eco Champion', amount: '₹15,00,000' },
      { title: '⚡ Smart Energy Award', amount: '₹10,00,000' }
    ],
    tracks: ['Carbon Footprint', 'Renewable Energy', 'Circular Economy'],
    problemStatements: [
      {
        id: 'ps-301',
        track: 'Carbon Footprint',
        title: 'IoT Carbon Offsetting Tracker',
        description: 'Sensors linked with live dashboard for real-time factory emission monitoring.',
        difficulty: 'Intermediate'
      }
    ],
    rubrics: [
      { id: 'rub-301', name: 'Sustainability Impact', description: 'Measurable environmental outcome', weight: 40 },
      { id: 'rub-302', name: 'Technical Prototype', description: 'Working hardware/software integration', weight: 40 },
      { id: 'rub-303', name: 'Feasibility', description: 'Commercial deployment roadmap', weight: 20 }
    ],
    schedule: [
      { time: 'June 1', event: 'Opening' },
      { time: 'June 5', event: 'Final Judging' }
    ],
    rules: ['All code open-sourced under MIT License.'],
    featured: false,
    organizerName: 'GreenTech Global',
    organizerVerified: true,
    participantsCount: 650,
    teamsCount: 160,
    description: 'Pioneering technology for carbon tracking, renewable grid management, and sustainability.',
    tags: ['Carbon Footprint', 'Renewable Energy', 'Circular Economy']
  },
  {
    id: 'hack-4',
    title: 'Quantum Computing & FinTech Summit 2026',
    tagline: 'Build next-gen financial algorithms, quantum-resistant security, and automated trading bots.',
    banner: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80',
    status: 'live',
    mode: 'online',
    location: 'Global (Virtual)',
    startDate: '2026-07-20T00:00:00Z',
    endDate: '2026-08-15T23:59:59Z',
    prizePool: '₹50,00,000',
    prizeBreakdown: [
      { title: '🥇 1st Place Quantum Alpha', amount: '₹25,00,000', description: 'Best quantum-resistant financial protocol.' },
      { title: '🥈 2nd Place Algo Bot', amount: '₹15,00,000', description: 'High-frequency algorithmic trading strategy.' },
      { title: '🥉 3rd Place DeFi Shield', amount: '₹10,00,000', description: 'DeFi protocol risk management system.' }
    ],
    tracks: ['Quantum Cryptography', 'DeFi & Trading', 'Algorithmic Risk'],
    problemStatements: [
      {
        id: 'ps-401',
        track: 'Quantum Cryptography',
        title: 'Post-Quantum Vault Security',
        description: 'Design a lattice-based cryptographic vault for decentralized finance transactions.',
        difficulty: 'Advanced'
      }
    ],
    rubrics: [
      { id: 'rub-401', name: 'Cryptographic Soundness', description: 'Resistance to quantum attack vectors', weight: 50 },
      { id: 'rub-402', name: 'Latency & Throughput', description: 'Performance under high-frequency load', weight: 30 },
      { id: 'rub-403', name: 'Code Quality', description: 'Clean modular implementation', weight: 20 }
    ],
    schedule: [
      { time: 'July 20', event: 'Hackathon Kickoff' },
      { time: 'August 15', event: 'Submission Deadline' }
    ],
    rules: ['Must use lattice-based encryption standards.', 'Submissions must include benchmark scripts.'],
    featured: true,
    organizerName: 'FinTech Quantum Labs',
    organizerVerified: true,
    participantsCount: 1420,
    teamsCount: 295,
    description: 'Build next-gen financial algorithms, quantum-resistant security, and automated trading bots.',
    tags: ['Quantum Cryptography', 'DeFi & Trading', 'Algorithmic Risk']
  },
  {
    id: 'hack-5',
    title: 'HealthTech & AI Medical Diagnostics Hack',
    tagline: 'Developing AI-driven medical imaging, remote patient monitoring, and predictive health analytics.',
    banner: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    status: 'upcoming',
    mode: 'hybrid',
    location: 'Boston Medical Hub, USA & Virtual',
    startDate: '2026-08-10T08:00:00Z',
    endDate: '2026-08-25T20:00:00Z',
    prizePool: '$45,000',
    prizeBreakdown: [
      { title: '🏥 Diagnostic Excellence Award', amount: '$25,000', description: 'Highest accuracy medical image diagnostic model.' },
      { title: '🩺 Patient Care Innovation', amount: '$20,000', description: 'Best remote patient monitoring platform.' }
    ],
    tracks: ['AI Radiology', 'Bioinformatics', 'Remote Patient Care'],
    problemStatements: [
      {
        id: 'ps-501',
        track: 'AI Radiology',
        title: 'Real-time X-Ray Anomaly Detection',
        description: 'Computer vision model for early identification of lung anomalies in low-resource clinics.',
        difficulty: 'Intermediate'
      }
    ],
    rubrics: [
      { id: 'rub-501', name: 'Model Accuracy & Precision', description: 'High sensitivity & low false positive rate', weight: 45 },
      { id: 'rub-502', name: 'Clinical Utility', description: 'Ease of adoption for frontline healthcare workers', weight: 35 },
      { id: 'rub-503', name: 'HIPAA Compliance & Privacy', description: 'Federated learning and data anonymization', weight: 20 }
    ],
    schedule: [
      { time: 'August 10', event: 'Opening Ceremony & Dataset Release' },
      { time: 'August 25', event: 'Live Judging Panel' }
    ],
    rules: ['All datasets must be anonymized.', 'Open-source compliance required.'],
    featured: false,
    organizerName: 'BioHealth Innovations',
    organizerVerified: true,
    participantsCount: 980,
    teamsCount: 185,
    description: 'Developing AI-driven medical imaging, remote patient monitoring, and predictive health analytics.',
    tags: ['AI Radiology', 'Bioinformatics', 'Remote Patient Care']
  },
  {
    id: 'hack-6',
    title: 'Autonomous Robotics & Cyber-Physical Systems',
    tagline: 'Pioneering ROS2 swarm robotics, edge vision AI, and autonomous drone navigation.',
    banner: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    status: 'live',
    mode: 'online',
    location: 'Global (Virtual)',
    startDate: '2026-07-15T00:00:00Z',
    endDate: '2026-08-30T23:59:59Z',
    prizePool: '$80,000',
    prizeBreakdown: [
      { title: '🤖 Swarm Master Grand Prize', amount: '$40,000', description: 'Best multi-agent swarm coordination algorithm.' },
      { title: '🚁 Autonomous Navigation Winner', amount: '$25,000', description: 'Best SLAM navigation in GPS-denied environments.' },
      { title: '⚡ Edge AI Hardware Optimization', amount: '$15,000', description: 'Lowest power consumption edge vision pipeline.' }
    ],
    tracks: ['Edge AI Vision', 'Swarm Intelligence', 'Drone Flight Controls'],
    problemStatements: [
      {
        id: 'ps-601',
        track: 'Swarm Intelligence',
        title: 'Multi-Rover Search & Rescue Coordination',
        description: 'ROS2 algorithm for autonomous rovers mapping unknown cavern terrain without GPS.',
        difficulty: 'Advanced'
      }
    ],
    rubrics: [
      { id: 'rub-601', name: 'Simulation Fidelity & Control', description: 'Gazebo/Isaac Sim test performance', weight: 50 },
      { id: 'rub-602', name: 'Fault Tolerance', description: 'Graceful degradation on node failure', weight: 30 },
      { id: 'rub-603', name: 'Documentation & Demo', description: 'Clean setup guide and video demonstration', weight: 20 }
    ],
    schedule: [
      { time: 'July 15', event: 'Simulation Sandbox Launch' },
      { time: 'August 30', event: 'Final Leaderboard Lock' }
    ],
    rules: ['ROS2 Humble/Jazzy framework compatibility required.'],
    featured: true,
    organizerName: 'RoboTech Global Alliance',
    organizerVerified: true,
    participantsCount: 2150,
    teamsCount: 410,
    description: 'Pioneering ROS2 swarm robotics, edge vision AI, and autonomous drone navigation.',
    tags: ['Edge AI Vision', 'Swarm Intelligence', 'Drone Flight Controls']
  }
];

export const INITIAL_SUBMISSIONS: ProjectSubmission[] = [
  {
    id: 'sub-1',
    hackathonId: 'hack-1',
    hackathonTitle: 'AI Innovators Global Hackathon 2026',
    title: 'Antigravity Code Studio',
    tagline: 'Autonomous AI pairing assistant with live sandbox and multi-agent refactoring.',
    description: 'Antigravity Code Studio is a next-gen web platform that brings full agentic AI capabilities to developer browser sessions. Built with Next.js, WebSockets, and custom glassmorphism visual layout, it enables developers to visualize project architecture, score code quality, and automatically fix lint warnings in real-time.',
    repoUrl: 'https://github.com/hackathon-team/antigravity-studio',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'WebSockets'],
    teamName: 'CyberPioneers',
    members: ['Shaik Ansar Ali', 'KVS Bhavya Sri', 'M Rohan Yaswanth', 'Shaik Roohi'],
    track: 'Agentic Coding',
    submittedAt: '2026-07-25T10:15:00Z',
    evaluated: true,
    scores: [
      {
        judgeName: 'Dr. Sarah Lin (AI Research Director)',
        rubricScores: {
          'rub-1': 9.5,
          'rub-2': 9.8,
          'rub-3': 9.6,
          'rub-4': 9.0
        },
        weightedTotal: 95.4,
        feedback: 'Outstanding architecture and stunning execution! The real-time visual feedback drawer and multi-role workflows set a benchmark for developer tooling.',
        evaluatedAt: '2026-07-25T11:00:00Z'
      }
    ],
    averageScore: 95.4,
    mockCodeSnippet: `// Antigravity Agent Workflow Dispatcher\nexport async function executeTaskAgent(task) {\n  const planner = new AgentPlanner({ model: 'gemini-3.6-flash' });\n  const plan = await planner.createPlan(task.prompt);\n  return await plan.executeParallelSteps();\n}`
  },
  {
    id: 'sub-2',
    hackathonId: 'hack-1',
    hackathonTitle: 'AI Innovators Global Hackathon 2026',
    title: 'PulseVision Multimodal Analytics',
    tagline: 'Real-time video analytics pipeline powered by custom vision models.',
    description: 'PulseVision analyzes live streaming video feeds to automatically flag anomalies, summarize meetings, and generate structured JSON metadata instantly.',
    repoUrl: 'https://github.com/pulsevision/analytics-app',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    techStack: ['Python', 'FastAPI', 'React', 'Tailwind CSS', 'OpenCV'],
    teamName: 'Visionary Crew',
    members: ['Alex Rivera', 'Elena Rostova'],
    track: 'Multimodal Web Apps',
    submittedAt: '2026-07-24T18:30:00Z',
    evaluated: true,
    scores: [
      {
        judgeName: 'Marcus Vance (Senior VPE)',
        rubricScores: {
          'rub-1': 8.8,
          'rub-2': 9.0,
          'rub-3': 8.5,
          'rub-4': 8.8
        },
        weightedTotal: 88.1,
        feedback: 'Very solid video pipeline execution. UI could use slight contrast refinement, but backend performance is super fast.',
        evaluatedAt: '2026-07-25T09:30:00Z'
      }
    ],
    averageScore: 88.1,
    mockCodeSnippet: `def process_video_frame(frame_bytes):\n    embeddings = model.encode_frame(frame_bytes)\n    return {"timestamp": time.time(), "anomalies": detect(embeddings)}`
  },
  {
    id: 'sub-3',
    hackathonId: 'hack-1',
    hackathonTitle: 'AI Innovators Global Hackathon 2026',
    title: 'NeuralSynth Audio Workspace',
    tagline: 'Generative AI voice synthesis and spatial soundscape builder for games.',
    description: 'NeuralSynth lets game creators produce dynamic, reactive background scores and character dialogue using natural text prompts.',
    repoUrl: 'https://github.com/neuralsynth/audio-lab',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    techStack: ['PyTorch', 'React', 'Web Audio API', 'Node.js'],
    teamName: 'SoundWave Labs',
    members: ['Devon Vance', 'Sophia Patel', 'Li Wei'],
    track: 'Generative AI',
    submittedAt: '2026-07-25T08:00:00Z',
    evaluated: false,
    scores: [],
    mockCodeSnippet: `const audioCtx = new AudioContext();\nconst synthNode = createNeuralAudioNode(audioCtx);\nsynthNode.generateFromPrompt("futuristic neon city rain");`
  }
];

export const INITIAL_TEAMS: Team[] = [
  {
    id: 'team-1',
    name: 'CyberPioneers',
    leaderName: 'Shaik Ansar Ali',
    leaderEmail: 'ansar@hackathoncentral.io',
    inviteCode: 'CYBER-2026',
    hackathonId: 'hack-1',
    status: 'Approved',
    registeredAt: '2026-07-20T11:00:00Z',
    members: [
      { id: 'm-1', name: 'Shaik Ansar Ali', email: 'ansar@hackathoncentral.io', role: 'Team Lead' },
      { id: 'm-2', name: 'KVS Bhavya Sri', email: 'bhavya@hackathoncentral.io', role: 'UI/UX Lead' },
      { id: 'm-3', name: 'M Rohan Yaswanth', email: 'rohan@hackathoncentral.io', role: 'Backend Lead' },
      { id: 'm-4', name: 'Shaik Roohi', email: 'roohi@hackathoncentral.io', role: 'DevOps Lead' }
    ]
  },
  {
    id: 'team-2',
    name: 'Visionary Crew',
    leaderName: 'Alex Rivera',
    leaderEmail: 'alex@visionary.io',
    inviteCode: 'VISION-99',
    hackathonId: 'hack-1',
    status: 'Approved',
    registeredAt: '2026-07-21T14:20:00Z',
    members: [
      { id: 'm-5', name: 'Alex Rivera', email: 'alex@visionary.io', role: 'Full Stack' },
      { id: 'm-6', name: 'Elena Rostova', email: 'elena@visionary.io', role: 'ML Researcher' }
    ]
  },
  {
    id: 'team-3',
    name: 'Quantum Hackers',
    leaderName: 'Carlos Gomez',
    leaderEmail: 'carlos@quantum.org',
    inviteCode: 'QNTM-404',
    hackathonId: 'hack-1',
    status: 'Pending',
    registeredAt: '2026-07-25T09:10:00Z',
    members: [
      { id: 'm-7', name: 'Carlos Gomez', email: 'carlos@quantum.org', role: 'Developer' }
    ]
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    hackathonId: 'hack-1',
    hackathonTitle: 'AI Innovators Global Hackathon 2026',
    title: '🚀 Submissions Now Open!',
    content: 'Project submission portal is live. Ensure your team submits public GitHub repository links and demo videos before July 27, 23:59 UTC.',
    timestamp: '2026-07-25T08:00:00Z',
    type: 'critical'
  },
  {
    id: 'ann-2',
    hackathonId: 'hack-1',
    hackathonTitle: 'AI Innovators Global Hackathon 2026',
    title: '💡 Mentor Office Hours live in Discord',
    content: 'Join Voice Channel #mentor-help for 1-on-1 architecture reviews with Google & Vercel engineering mentors.',
    timestamp: '2026-07-24T16:00:00Z',
    type: 'info'
  },
  {
    id: 'ann-3',
    hackathonId: 'hack-2',
    hackathonTitle: 'Web3 & Decentralized Scale-A-Thon',
    title: '📅 Early Bird Registration Reminder',
    content: 'Team formation is open. Over $75,000 in bounties to be awarded across DeFi & ZK tracks.',
    timestamp: '2026-07-23T12:00:00Z',
    type: 'update'
  }
];

export const INITIAL_VERIFICATIONS: OrganizerVerificationRequest[] = [
  {
    id: 'ver-1',
    organizerName: 'DevPulse Labs',
    organization: 'DevPulse Inc.',
    email: 'contact@devpulse.io',
    website: 'https://devpulse.io',
    status: 'approved',
    submittedAt: '2026-07-15'
  },
  {
    id: 'ver-2',
    organizerName: 'HyperDrive Hackathons',
    organization: 'HyperDrive Org',
    email: 'info@hyperdrive.dev',
    website: 'https://hyperdrive.dev',
    status: 'pending',
    submittedAt: '2026-07-24'
  }
];
