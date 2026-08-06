import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  Clock, 
  Eye, 
  Search, 
  Star, 
  Code2, 
  ExternalLink, 
  Play, 
  FileText, 
  Users, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Bell,
  ChevronDown,
  LayoutDashboard,
  FolderKanban,
  FileCheck,
  Calendar,
  Megaphone,
  MessageSquare,
  Settings,
  HelpCircle,
  TrendingUp,
  RotateCw,
  Zap,
  Globe,
  Sliders,
  Send,
  Download,
  UserCheck,
  Check,
  Info,
  SlidersHorizontal,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DedicatedEvaluationPortalProps {
  submissions?: any[];
  hackathons?: any[];
  onSelectSubmission?: (submission: any) => void;
}

type ActiveTab = 
  | 'dashboard' 
  | 'assignments' 
  | 'projects' 
  | 'evaluation' 
  | 'scorecards' 
  | 'teams' 
  | 'schedule' 
  | 'announcements' 
  | 'messages' 
  | 'settings';

const JUDGE_PROJECTS = [
  {
    id: 'sub-1',
    title: 'HealthMind Diagnostic AI',
    tagline: 'Real-time radiography image analysis via lightweight vision transformer.',
    description: 'An edge-AI medical diagnostic assistant that detects chest X-ray anomalies in under 200ms with 98.4% precision, complete with heatmap explainability overlays for doctors.',
    category: 'HEALTHCARE & BIOTECH',
    categoryBadge: 'bg-indigo-500/10 text-indigo-700 border-indigo-200/80',
    evaluated: true,
    score: '92.5',
    teamName: 'NeuralDoc Labs',
    teamMembers: ['Dr. Marcus Vance', 'Elena Rostova', 'Priya Shah'],
    techStack: ['PyTorch', 'Vision Transformer', 'React', 'TailwindCSS'],
    submittedDate: 'May 19, 2024',
    repoUrl: 'https://github.com/healthmind-ai/radiology-vision',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    mockSnippet: `// Lightweight Vision Transformer Inference
import torch
from transformers import ViTForImageClassification

model = ViTForImageClassification.from_pretrained("healthmind/vit-chest-xray")
def analyze_scan(image_tensor):
    outputs = model(image_tensor)
    probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
    return {"anomaly_score": probs[0][1].item()}`
  },
  {
    id: 'sub-2',
    title: 'OmniPay ZK-Rollup Wallet',
    tagline: 'Gasless cross-chain micro-payments powered by zero-knowledge proofs.',
    description: 'OmniPay enables sub-cent instant global payments across Ethereum, Arbitrum, and Solana using zk-SNARK proof aggregation for complete financial privacy.',
    category: 'WEB3 & DEFI',
    categoryBadge: 'bg-purple-500/10 text-purple-700 border-purple-200/80',
    evaluated: false,
    score: null,
    teamName: 'ZK-Architects',
    teamMembers: ['Vikram Patel', 'Chloe Bennett', 'Arjun Mehta'],
    techStack: ['Circom', 'Rust', 'Next.js', 'Solana'],
    submittedDate: 'May 18, 2024',
    repoUrl: 'https://github.com/omnipay/zk-payments',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    mockSnippet: `// ZK-Proof Aggregator Circuit
pragma circom 2.0.0;

template OmniPayCircuit() {
    signal input privateKey;
    signal input amount;
    signal output proofHash;
    
    proofHash <== privateKey * amount;
}`
  },
  {
    id: 'sub-3',
    title: 'EcoTrack Sustainability',
    tagline: 'AI-powered platform for tracking carbon footprint and environmental impact.',
    description: 'EcoTrack connects IoT carbon sensors with machine learning algorithms to audit enterprise emissions supply chains in real time.',
    category: 'SUSTAINABILITY',
    categoryBadge: 'bg-emerald-500/10 text-emerald-700 border-emerald-200/80',
    evaluated: true,
    score: '88.0',
    teamName: 'GreenBytes',
    teamMembers: ['Aisha Khan', 'Daniel Lee', 'Maria Garcia'],
    techStack: ['Python', 'TensorFlow', 'Django', 'PostgreSQL'],
    submittedDate: 'May 17, 2024',
    repoUrl: 'https://github.com/greenbytes/ecotrack',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    mockSnippet: `// Real-Time Supply Chain Carbon Estimator
def calculate_emissions(transport_km, energy_kwh):
    co2_transport = transport_km * 0.12
    co2_energy = energy_kwh * 0.45
    return round(co2_transport + co2_energy, 2)`
  },
  {
    id: 'sub-4',
    title: 'CodeGenix AI Assistant',
    tagline: 'AI assistant for developers with intelligent code completion and bug detection.',
    description: 'CodeGenix integrates into developer IDEs to autonomously generate unit tests, detect security vulnerabilities, and rewrite legacy code routines.',
    category: 'AI & MACHINE LEARNING',
    categoryBadge: 'bg-sky-500/10 text-sky-700 border-sky-200/80',
    evaluated: false,
    score: null,
    teamName: 'DevIntelligence',
    teamMembers: ['Rahul Nair', 'Sophie Kim', 'James Wilson'],
    techStack: ['Python', 'LLM', 'FastAPI', 'Vue.js'],
    submittedDate: 'May 17, 2024',
    repoUrl: 'https://github.com/devintel/codegenix',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    mockSnippet: `// Autonomous Vulnerability Scanner
async function scanAST(sourceCode) {
  const ast = parse(sourceCode);
  const vulnerabilities = await detectSqlInjection(ast);
  return vulnerabilities;
}`
  }
];

export const DedicatedEvaluationPortal: React.FC<DedicatedEvaluationPortalProps> = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'evaluated'>('all');
  const [selectedTrack, setSelectedTrack] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [projectsList, setProjectsList] = useState(JUDGE_PROJECTS);
  const [selectedProjectForModal, setSelectedProjectForModal] = useState<typeof JUDGE_PROJECTS[0] | null>(null);

  // Scorecard modal sliders
  const [scoreInnov, setScoreInnov] = useState(9.0);
  const [scoreTech, setScoreTech] = useState(9.2);
  const [scoreDesign, setScoreDesign] = useState(8.8);
  const [scoreImpact, setScoreImpact] = useState(9.0);
  const [writtenNotes, setWrittenNotes] = useState('Excellent user interface, clean codebase modularity, and high feasibility.');
  const [isSaving, setIsSaving] = useState(false);

  // Messages State
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Organizer Support', text: 'Welcome to the judging panel! Please review assigned submissions by 6:00 PM EST.', time: '10:30 AM' },
    { id: 2, sender: 'Team ZK-Architects', text: 'Hi Judge, we updated our pitch video link in the submission description.', time: '11:15 AM' }
  ]);
  const [newMessageText, setNewMessageText] = useState('');

  // Filter logic
  const filteredProjects = projectsList.filter((p) => {
    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'evaluated' && p.evaluated) ||
      (statusFilter === 'pending' && !p.evaluated);

    const matchesTrack = selectedTrack === 'all' || p.category.toLowerCase().includes(selectedTrack.toLowerCase());

    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesTrack && matchesSearch;
  });

  const handleOpenEvaluationModal = (proj: typeof JUDGE_PROJECTS[0]) => {
    setSelectedProjectForModal(proj);
    setScoreInnov(9.0);
    setScoreTech(9.2);
    setScoreDesign(8.8);
    setScoreImpact(9.0);
  };

  const handleSaveScorecard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectForModal) return;

    setIsSaving(true);
    const calculatedScore = (((scoreInnov + scoreTech + scoreDesign + scoreImpact) / 4) * 10).toFixed(1);

    setTimeout(() => {
      setProjectsList(projectsList.map(p => {
        if (p.id === selectedProjectForModal.id) {
          return {
            ...p,
            evaluated: true,
            score: calculatedScore
          };
        }
        return p;
      }));
      setIsSaving(false);
      setSelectedProjectForModal(null);
    }, 500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: 'Dr. Alex Morgan (You)', text: newMessageText, time: 'Just now' }]);
    setNewMessageText('');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex relative overflow-hidden selection:bg-indigo-500/20">
      
      {/* AMBIENT FLOATING GRADIENT GLOW ORBS (3D BACKDROP) */}
      <div className="fixed top-10 left-20 w-96 h-96 rounded-full bg-indigo-400/20 blur-[130px] pointer-events-none animate-pulse" />
      <div className="fixed bottom-10 right-20 w-[500px] h-[500px] rounded-full bg-purple-400/20 blur-[150px] pointer-events-none" />
      <div className="fixed top-1/2 left-1/3 w-80 h-80 rounded-full bg-amber-300/15 blur-[110px] pointer-events-none" />

      {/* 1. LEFT SIDEBAR NAVIGATION (FIXED FULL-VIEWPORT SIDEBAR - NO SCROLL GAPS EVER) */}
      <aside className="w-64 fixed top-0 bottom-0 left-0 z-40 bg-white/95 backdrop-blur-2xl border-r border-slate-200/80 flex flex-col justify-between p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)] overflow-y-auto scrollbar-none">
        <div className="space-y-5">
          {/* Brand Header */}
          <div className="flex items-center gap-3 cursor-pointer border-b border-slate-100 pb-4 h-12" onClick={() => setActiveTab('dashboard')}>
            <motion.div 
              whileHover={{ rotate: 8, scale: 1.05 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black shadow-md shadow-indigo-600/20"
            >
              <Award className="w-5 h-5" />
            </motion.div>
            <div>
              <span className="font-black text-sm tracking-tight text-slate-900 block leading-none">HACKATHON</span>
              <span className="font-extrabold text-[10px] uppercase tracking-widest text-indigo-600 block leading-none mt-1">JUDGE PORTAL</span>
            </div>
          </div>

          {/* SECTION 1: MAIN EVALUATION MENU */}
          <div className="space-y-1">
            <div className="px-3.5 text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
              MAIN MENU
            </div>

            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'assignments', label: 'My Assignments', icon: FolderKanban },
              { id: 'projects', label: 'All Projects', icon: FileCheck },
              { id: 'evaluation', label: 'Evaluation', icon: Award },
              { id: 'scorecards', label: 'Scorecards', icon: FileText }
            ].map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as ActiveTab)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 font-black'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                >
                  <IconComp className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* SECTION 2: WORKSPACE & COMMUNITY */}
          <div className="space-y-1 pt-3 border-t border-slate-100">
            <div className="px-3.5 text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
              COMMUNITY & WORKSPACE
            </div>

            {[
              { id: 'teams', label: 'Teams', icon: Users },
              { id: 'schedule', label: 'Schedule', icon: Calendar },
              { id: 'announcements', label: 'Announcements', icon: Megaphone },
              { id: 'messages', label: 'Messages', icon: MessageSquare },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as ActiveTab)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 font-black'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                >
                  <IconComp className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar Bottom Promo Box */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white relative overflow-hidden shadow-lg border border-slate-800 mt-4">
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-amber-300 flex items-center justify-center border border-indigo-500/30">
              <Award className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-xs text-white">Make an Impact</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Your evaluation helps innovators shape the future.
          </p>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA WITH ml-64 OFFSET */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col justify-between relative z-10 overflow-hidden">
        
        {/* TOP WELCOME HEADER BAR */}
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-20 px-8 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              Welcome back, Judge! 👋
            </h1>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              Review innovative solutions. Evaluate fairly. Inspire change.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveTab('announcements')}
              className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center shadow-xs transition-all relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500"></span>
            </button>

            <div 
              onClick={() => setActiveTab('settings')}
              className="flex items-center gap-3 pl-3 border-l border-slate-200 cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Dr. Alex Morgan"
                className="w-10 h-10 rounded-full object-cover border-2 border-indigo-600 shadow-md"
              />
              <div className="text-left hidden sm:block">
                <span className="text-xs font-black text-slate-900 block leading-none">Dr. Alex Morgan</span>
                <span className="text-[10px] font-bold text-slate-500 block leading-none mt-1">Official Judge</span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </header>

        {/* WORKSPACE BODY CONTENT */}
        <div className="p-8 space-y-6 flex-1">

        {/* DYNAMIC DISPERSED SLIDES RENDERER */}
        <AnimatePresence mode="wait">
          
          {/* SLIDE 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard-slide"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* HERO BANNER CARD WITH FLOATING 3D TROPHY ANIMATION */}
              <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10">
                <div className="space-y-3 max-w-xl relative z-10">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 inline-block shadow-sm">
                    JUDGE OFFICIAL
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
                    Empowering Innovation. Recognizing Excellence.
                  </h2>
                  <p className="text-xs text-indigo-200 leading-relaxed">
                    Evaluate projects, provide valuable feedback and help teams turn ideas into impact.
                  </p>
                </div>

                {/* 3D FLOATING TROPHY GRAPHIC ANIMATION */}
                <div className="relative z-10 flex-shrink-0">
                  <motion.img 
                    animate={{ y: [0, -12, 0], rotate: [0, 2, 0] }}
                    transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                    src="/judge_trophy_3d.jpg?v=2" 
                    alt="3D Trophy" 
                    className="w-44 h-44 object-cover rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] border-2 border-white/20" 
                  />
                </div>
              </div>

              {/* 3D GLASSMETRIC SUMMARY BAR (4 CARDS) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Card 1 */}
                <motion.div 
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="p-5 rounded-3xl bg-white/75 backdrop-blur-2xl border border-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(99,102,241,0.15)] transition-all flex items-center justify-between"
                >
                  <div>
                    <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">Assigned Projects</span>
                    <span className="text-2xl font-black text-slate-900 mt-1 block">08</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Projects to review</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-black border border-indigo-500/20 shadow-inner">
                    <FolderKanban className="w-6 h-6" />
                  </div>
                </motion.div>

                {/* Card 2 */}
                <motion.div 
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="p-5 rounded-3xl bg-white/75 backdrop-blur-2xl border border-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(245,158,11,0.15)] transition-all flex items-center justify-between"
                >
                  <div>
                    <span className="text-[11px] font-extrabold text-amber-600 uppercase tracking-wider block">Pending Review</span>
                    <span className="text-2xl font-black text-slate-900 mt-1 block">03</span>
                    <span className="text-[10px] text-amber-600 font-medium block mt-0.5">Awaiting your review</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-black border border-amber-500/20 shadow-inner">
                    <Clock className="w-6 h-6" />
                  </div>
                </motion.div>

                {/* Card 3 */}
                <motion.div 
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="p-5 rounded-3xl bg-white/75 backdrop-blur-2xl border border-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(16,185,129,0.15)] transition-all flex items-center justify-between"
                >
                  <div>
                    <span className="text-[11px] font-extrabold text-emerald-600 uppercase tracking-wider block">Evaluated</span>
                    <span className="text-2xl font-black text-slate-900 mt-1 block">05</span>
                    <span className="text-[10px] text-emerald-600 font-medium block mt-0.5">Projects evaluated</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black border border-emerald-500/20 shadow-inner">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                </motion.div>

                {/* Card 4 */}
                <motion.div 
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="p-5 rounded-3xl bg-white/75 backdrop-blur-2xl border border-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(168,85,247,0.15)] transition-all flex items-center justify-between"
                >
                  <div>
                    <span className="text-[11px] font-extrabold text-purple-600 uppercase tracking-wider block">Average Score Given</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-black text-slate-900">91.2</span>
                      <span className="text-xs font-bold text-slate-400">/ 100</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Across all projects</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-black border border-purple-500/20 shadow-inner">
                    <Star className="w-6 h-6 fill-current" />
                  </div>
                </motion.div>
              </div>

              {/* STREAMLINED SECTION HEADER & COMPACT CONTROLS */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Assigned Submissions</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-50 text-indigo-600 border border-indigo-200">
                    {filteredProjects.length} Entries
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Status Pills */}
                  <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100/90 border border-slate-200/80">
                    <button
                      onClick={() => setStatusFilter('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        statusFilter === 'all'
                          ? 'bg-white text-indigo-600 shadow-xs font-black'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      All ({projectsList.length})
                    </button>
                    <button
                      onClick={() => setStatusFilter('pending')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        statusFilter === 'pending'
                          ? 'bg-white text-indigo-600 shadow-xs font-black'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Pending ({projectsList.filter(p => !p.evaluated).length})
                    </button>
                    <button
                      onClick={() => setStatusFilter('evaluated')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        statusFilter === 'evaluated'
                          ? 'bg-white text-indigo-600 shadow-xs font-black'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Evaluated ({projectsList.filter(p => p.evaluated).length})
                    </button>
                  </div>

                  {/* Compact Track Dropdown */}
                  <select
                    value={selectedTrack}
                    onChange={(e) => setSelectedTrack(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-600 shadow-xs"
                  >
                    <option value="all">All Tracks</option>
                    <option value="HEALTHCARE">Healthcare</option>
                    <option value="WEB3">Web3</option>
                    <option value="SUSTAINABILITY">Sustainability</option>
                    <option value="AI">AI & ML</option>
                  </select>

                  {/* Compact Search Bar */}
                  <div className="relative w-52">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 shadow-xs"
                    />
                  </div>
                </div>
              </div>

              {/* 2x2 PROJECT CARDS GRID WITH 3D GLASSMORPHISM */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProjects.map((proj) => (
                  <motion.div
                    whileHover={{ y: -6, scale: 1.01 }}
                    transition={{ duration: 0.25 }}
                    key={proj.id}
                    className="bg-white/80 backdrop-blur-2xl border border-white/80 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(99,102,241,0.15)] transition-all flex flex-col justify-between space-y-4 group relative overflow-hidden"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${proj.categoryBadge}`}>
                          {proj.category}
                        </span>

                        {proj.evaluated ? (
                          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 shadow-xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Evaluated
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5 shadow-xs">
                            <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending Review
                          </span>
                        )}
                      </div>

                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1.5">
                          <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {proj.title}
                          </h3>
                          <p className="text-xs font-medium text-slate-600 leading-relaxed line-clamp-2">
                            {proj.tagline}
                          </p>
                        </div>

                        {/* 3D GRAPHIC PREVIEW WITH HOVER ANIMATION */}
                        <motion.div 
                          whileHover={{ scale: 1.1, rotate: 3 }}
                          className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex-shrink-0 flex items-center justify-center p-1 shadow-md overflow-hidden"
                        >
                          <img 
                            src="/medical_xray_3d.jpg" 
                            alt="Project Graphic" 
                            className="w-full h-full object-cover rounded-xl"
                          />
                        </motion.div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60">
                        <div className="flex -space-x-2 overflow-hidden">
                          <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center border-2 border-white">
                            M
                          </div>
                          <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center border-2 border-white">
                            E
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900 block leading-tight">Team: {proj.teamName}</span>
                          <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">{proj.teamMembers.join(', ')}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {proj.techStack.map((tech, idx) => (
                          <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100/90 text-[10px] font-bold text-slate-600 border border-slate-200/60">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        {proj.evaluated && proj.score ? (
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 block uppercase">Score Given</span>
                            <span className="text-lg font-black text-indigo-600 font-mono">{proj.score} / 100</span>
                          </div>
                        ) : (
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 block uppercase">Submitted on</span>
                            <span className="text-xs font-bold text-slate-700">{proj.submittedDate}</span>
                          </div>
                        )}
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleOpenEvaluationModal(proj)}
                        className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                          proj.evaluated
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30'
                        }`}
                      >
                        {proj.evaluated ? 'View Scorecard' : 'Review Now'}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* SLIDE 2: MY ASSIGNMENTS */}
          {activeTab === 'assignments' && (
            <motion.div
              key="assignments-slide"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-md flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">My Assigned Submissions Queue</h2>
                  <p className="text-xs text-slate-500">Track and manage project submissions directly assigned to your panel.</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-50 text-indigo-600 border border-indigo-200">
                  4 Assigned Entries
                </span>
              </div>

              <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-3xl overflow-hidden shadow-md">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 text-[11px] font-extrabold uppercase text-slate-500 border-b border-slate-200/80">
                      <th className="py-4 px-6">Project & Team</th>
                      <th className="py-4 px-6">Track</th>
                      <th className="py-4 px-6">Evaluation Status</th>
                      <th className="py-4 px-6">Score</th>
                      <th className="py-4 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                    {projectsList.map((proj) => (
                      <tr key={proj.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <span className="font-extrabold text-slate-900 block text-sm">{proj.title}</span>
                          <span className="text-[11px] text-slate-500 font-normal">Team {proj.teamName}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${proj.categoryBadge}`}>
                            {proj.category}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {proj.evaluated ? (
                            <span className="text-emerald-600 font-extrabold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                            </span>
                          ) : (
                            <span className="text-amber-600 font-extrabold flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> Pending Review
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 font-mono font-bold text-slate-900">
                          {proj.score ? `${proj.score} / 100` : '—'}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleOpenEvaluationModal(proj)}
                            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-sm"
                          >
                            {proj.evaluated ? 'Scorecard' : 'Evaluate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* SLIDE 3: ALL PROJECTS */}
          {activeTab === 'projects' && (
            <motion.div
              key="projects-slide"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-md">
                <h2 className="text-xl font-black text-slate-900">Full Hackathon Submissions Directory</h2>
                <p className="text-xs text-slate-500">Explore all competing project submissions across tracks.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projectsList.map((p) => (
                  <div key={p.id} className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase">{p.category}</span>
                      <span className="text-xs text-slate-400 font-mono">Submitted {p.submittedDate}</span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900">{p.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-xs font-bold text-slate-700">Team: {p.teamName}</span>
                      <a href={p.repoUrl} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1">
                        Repository <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* SLIDE 4: EVALUATION */}
          {activeTab === 'evaluation' && (
            <motion.div
              key="evaluation-slide"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-md">
                <h2 className="text-xl font-black text-slate-900">Interactive Rubric Evaluation Workspace</h2>
                <p className="text-xs text-slate-500">Select any project entry below to evaluate criteria sliders and log qualitative judge notes.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {projectsList.map((p) => (
                  <div key={p.id} className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-sm space-y-3 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-600 block mb-1">{p.category}</span>
                      <h4 className="font-extrabold text-slate-900 text-base">{p.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">{p.tagline}</p>
                    </div>

                    <button
                      onClick={() => handleOpenEvaluationModal(p)}
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-2"
                    >
                      <Award className="w-4 h-4" /> Open Rubric Scorecard
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* SLIDE 5: SCORECARDS */}
          {activeTab === 'scorecards' && (
            <motion.div
              key="scorecards-slide"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-md flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Submitted Scorecards Log</h2>
                  <p className="text-xs text-slate-500">Audit historical scores and feedback submitted by your judging account.</p>
                </div>
                <button className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 border border-slate-200">
                  <Download className="w-4 h-4 text-indigo-600" /> Export CSV Log
                </button>
              </div>

              <div className="space-y-4">
                {projectsList.filter(p => p.evaluated).map((p) => (
                  <div key={p.id} className="p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-black text-slate-900">{p.title}</h4>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Verified
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">Team: {p.teamName} • Evaluated by Dr. Alex Morgan</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right font-mono">
                        <span className="text-[10px] text-slate-400 block uppercase font-sans font-bold">TOTAL SCORE</span>
                        <span className="text-2xl font-black text-indigo-600">{p.score} / 100</span>
                      </div>
                      <button 
                        onClick={() => handleOpenEvaluationModal(p)}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200"
                      >
                        Inspect Breakdown
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* SLIDE 6: TEAMS */}
          {activeTab === 'teams' && (
            <motion.div
              key="teams-slide"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-md">
                <h2 className="text-xl font-black text-slate-900">Participating Teams Roster</h2>
                <p className="text-xs text-slate-500">View competing team structures and member profiles.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'NeuralDoc Labs', members: ['Dr. Marcus Vance', 'Elena Rostova', 'Priya Shah'], project: 'HealthMind Diagnostic AI' },
                  { name: 'ZK-Architects', members: ['Vikram Patel', 'Chloe Bennett', 'Arjun Mehta'], project: 'OmniPay ZK-Rollup Wallet' },
                  { name: 'GreenBytes', members: ['Aisha Khan', 'Daniel Lee', 'Maria Garcia'], project: 'EcoTrack Sustainability' },
                  { name: 'DevIntelligence', members: ['Rahul Nair', 'Sophie Kim', 'James Wilson'], project: 'CodeGenix AI Assistant' }
                ].map((t, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-sm space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base">{t.name}</h4>
                        <span className="text-xs text-indigo-600 font-bold">{t.project}</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-100 text-xs text-slate-600">
                      <strong>Members:</strong> {t.members.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* SLIDE 7: SCHEDULE */}
          {activeTab === 'schedule' && (
            <motion.div
              key="schedule-slide"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-md flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Judging Schedule & Timetable</h2>
                  <p className="text-xs text-slate-500">Official evaluation deadlines and live demonstration slots.</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  Round 2 Live
                </span>
              </div>

              <div className="space-y-3">
                {[
                  { title: 'Round 1: Preliminary Code & Architecture Audit', status: 'Completed', time: 'May 17 - May 18' },
                  { title: 'Round 2: Live Pitch & Rubric Scorecard Submission', status: 'Active (Ends in 4h)', time: 'May 19, 6:00 PM EST' },
                  { title: 'Round 3: Grand Finale Award Ceremony & Winner Announcement', status: 'Upcoming', time: 'May 20, 10:00 AM EST' }
                ].map((s, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-sm flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-slate-900 text-sm">{s.title}</h4>
                      <span className="text-xs text-slate-500">{s.time}</span>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* SLIDE 8: ANNOUNCEMENTS */}
          {activeTab === 'announcements' && (
            <motion.div
              key="announcements-slide"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-md">
                <h2 className="text-xl font-black text-slate-900">Organizer Broadcasts & Updates</h2>
                <p className="text-xs text-slate-500">Official updates issued by the hackathon organizing committee.</p>
              </div>

              <div className="space-y-4">
                {[
                  { title: 'Evaluation Period Extended by 2 Hours', date: 'May 19, 2024', body: 'Judges have been granted an additional 2 hours to finalize rubrics due to high submission volume.' },
                  { title: 'Web3 Track Rubric Clarification', date: 'May 18, 2024', body: 'Please ensure gas efficiency is scored under the Technical Complexity criterion.' }
                ].map((a, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-black text-slate-900 text-base">{a.title}</h4>
                      <span className="text-xs text-slate-400 font-medium">{a.date}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{a.body}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* SLIDE 9: MESSAGES */}
          {activeTab === 'messages' && (
            <motion.div
              key="messages-slide"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-md">
                <h2 className="text-xl font-black text-slate-900">Judge Direct Messages</h2>
                <p className="text-xs text-slate-500">Communicate directly with organizers or requesting team leads.</p>
              </div>

              <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-md space-y-4 max-w-2xl">
                <div className="space-y-3 max-h-64 overflow-y-auto p-3 bg-slate-50 rounded-2xl border border-slate-200/60">
                  {messages.map((m) => (
                    <div key={m.id} className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-1">
                        <span>{m.sender}</span>
                        <span className="text-[10px] text-slate-400">{m.time}</span>
                      </div>
                      <p className="text-xs text-slate-600">{m.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                  <button type="submit" className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center gap-1">
                    <Send className="w-4 h-4" /> Send
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* SLIDE 10: SETTINGS */}
          {activeTab === 'settings' && (
            <motion.div
              key="settings-slide"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6 max-w-2xl"
            >
              <div className="p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-md">
                <h2 className="text-xl font-black text-slate-900">Judge Profile & Portal Settings</h2>
                <p className="text-xs text-slate-500">Configure your evaluation preferences and account settings.</p>
              </div>

              <div className="p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-md space-y-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">Judge Name</label>
                  <input type="text" defaultValue="Dr. Alex Morgan" className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">Email</label>
                  <input type="email" defaultValue="judge@hackathon.com" className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900" />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">Assigned Tracks</label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">Healthcare & BioTech</span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">Web3 & DeFi</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* BOTTOM MOTIVATION BANNER */}
        <div className="p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black shadow-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">Your evaluation drives innovation forward.</h4>
              <p className="text-xs text-slate-500">Thank you for being a part of this incredible journey!</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-2 border border-slate-200">
              <FileText className="w-4 h-4 text-indigo-600" /> Need Help? Check judging guidelines
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="pt-4 pb-8 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between border-t border-slate-200/80">
          <span>© 2026 Hackathon Management System</span>
          <span className="flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure • Transparent • Impactful
          </span>
        </footer>
      </div>
    </main>

      {/* EVALUATION SCORECARD MODAL WITH GLASSMORPHISM */}
      <AnimatePresence>
        {selectedProjectForModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white/90 backdrop-blur-2xl border border-white/90 rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold border border-indigo-100 shadow-sm">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{selectedProjectForModal.title}</h3>
                    <p className="text-xs text-slate-500">Team: {selectedProjectForModal.teamName} • Track: {selectedProjectForModal.category}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedProjectForModal(null)}
                  className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              {/* Code Snippet */}
              {selectedProjectForModal.mockSnippet && (
                <div className="my-5 p-4 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto shadow-inner">
                  <pre>{selectedProjectForModal.mockSnippet}</pre>
                </div>
              )}

              {/* Form Sliders */}
              <form onSubmit={handleSaveScorecard} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                      <span>1. Innovation & Originality</span>
                      <span className="text-indigo-600 font-mono text-sm">{scoreInnov} / 10</span>
                    </div>
                    <input
                      type="range"
                      min={0} max={10} step={0.5}
                      value={scoreInnov}
                      onChange={(e) => setScoreInnov(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                      <span>2. Technical Complexity</span>
                      <span className="text-indigo-600 font-mono text-sm">{scoreTech} / 10</span>
                    </div>
                    <input
                      type="range"
                      min={0} max={10} step={0.5}
                      value={scoreTech}
                      onChange={(e) => setScoreTech(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                      <span>3. UI/UX & Design</span>
                      <span className="text-indigo-600 font-mono text-sm">{scoreDesign} / 10</span>
                    </div>
                    <input
                      type="range"
                      min={0} max={10} step={0.5}
                      value={scoreDesign}
                      onChange={(e) => setScoreDesign(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                      <span>4. Impact & Feasibility</span>
                      <span className="text-indigo-600 font-mono text-sm">{scoreImpact} / 10</span>
                    </div>
                    <input
                      type="range"
                      min={0} max={10} step={0.5}
                      value={scoreImpact}
                      onChange={(e) => setScoreImpact(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>
                </div>

                {/* Weighted Total Display */}
                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-extrabold text-indigo-900 block">CALCULATED SCORE</span>
                    <span className="text-xs text-indigo-600">Weighted scorecard total</span>
                  </div>
                  <div className="text-2xl font-black text-indigo-600 font-mono">
                    {(((scoreInnov + scoreTech + scoreDesign + scoreImpact) / 4) * 10).toFixed(1)} / 100
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Written Feedback
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={writtenNotes}
                    onChange={(e) => setWrittenNotes(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProjectForModal(null)}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Submit Evaluation'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
