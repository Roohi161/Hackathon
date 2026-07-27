import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight, Sparkles, Trophy, Clock, DollarSign, GitBranch,
  Layers, Users, Award
} from 'lucide-react';

interface HeroSectionProps {
  onExplore: () => void;
  onHost: () => void;
}

// ── Static seed data (no Math.random at render time → no hydration mismatch) ──
const CODE_SNIPPETS = [
  { text: '</>', x: '8%',  y: '18%', delay: 0,    dur: 14, rotate: -12, size: 'text-lg',  color: 'text-indigo-400/40' },
  { text: '{}', x: '82%', y: '12%', delay: 2,    dur: 18, rotate: 8,   size: 'text-xl',  color: 'text-purple-400/35' },
  { text: '<>', x: '72%', y: '72%', delay: 1,    dur: 12, rotate: -6,  size: 'text-base',color: 'text-orange-400/35' },
  { text: '()', x: '15%', y: '78%', delay: 3,    dur: 16, rotate: 14,  size: 'text-lg',  color: 'text-cyan-400/35'   },
  { text: '[]', x: '55%', y: '8%',  delay: 1.5,  dur: 20, rotate: -4,  size: 'text-base',color: 'text-violet-400/30' },
  { text: '=>', x: '90%', y: '45%', delay: 0.5,  dur: 15, rotate: 6,   size: 'text-sm',  color: 'text-blue-400/30'   },
  { text: '&&', x: '3%',  y: '50%', delay: 2.5,  dur: 17, rotate: -8,  size: 'text-sm',  color: 'text-pink-400/25'   },
  { text: '//', x: '40%', y: '88%', delay: 4,    dur: 13, rotate: 3,   size: 'text-sm',  color: 'text-indigo-300/30' },
];

const HEX_POSITIONS = [
  { x: '5%',  y: '10%', size: 44, delay: 0,   opacity: 0.08, color: '#818cf8' },
  { x: '88%', y: '8%',  size: 36, delay: 1,   opacity: 0.07, color: '#c084fc' },
  { x: '92%', y: '60%', size: 52, delay: 2,   opacity: 0.06, color: '#f97316' },
  { x: '2%',  y: '65%', size: 40, delay: 0.5, opacity: 0.07, color: '#818cf8' },
  { x: '48%', y: '3%',  size: 30, delay: 1.5, opacity: 0.06, color: '#c084fc' },
  { x: '62%', y: '92%', size: 38, delay: 2.5, opacity: 0.07, color: '#38bdf8' },
];

const AI_NODES = [
  { x: '22%', y: '25%', delay: 0,   size: 6, color: '#818cf8', pulseColor: 'rgba(129,140,248,0.2)' },
  { x: '76%', y: '30%', delay: 1,   size: 5, color: '#c084fc', pulseColor: 'rgba(192,132,252,0.2)' },
  { x: '35%', y: '70%', delay: 0.5, size: 7, color: '#f97316', pulseColor: 'rgba(249,115,22,0.2)'  },
  { x: '68%', y: '65%', delay: 1.5, size: 5, color: '#38bdf8', pulseColor: 'rgba(56,189,248,0.2)'  },
  { x: '12%', y: '45%', delay: 2,   size: 4, color: '#818cf8', pulseColor: 'rgba(129,140,248,0.15)'},
  { x: '85%', y: '80%', delay: 2.5, size: 6, color: '#c084fc', pulseColor: 'rgba(192,132,252,0.15)'},
];

const SPARKS = [
  { x: '18%', y: '35%', delay: 0,   dur: 3.2 },
  { x: '65%', y: '20%', delay: 0.8, dur: 2.8 },
  { x: '42%', y: '60%', delay: 1.6, dur: 3.5 },
  { x: '80%', y: '50%', delay: 2.4, dur: 2.6 },
  { x: '30%', y: '82%', delay: 0.4, dur: 3.0 },
  { x: '55%', y: '15%', delay: 1.2, dur: 3.8 },
  { x: '90%', y: '35%', delay: 2.0, dur: 2.4 },
  { x: '8%',  y: '72%', delay: 1.8, dur: 3.3 },
  { x: '72%', y: '88%', delay: 0.6, dur: 2.9 },
  { x: '48%', y: '42%', delay: 2.8, dur: 3.6 },
];

const GEOMETRIC = [
  { type: 'triangle', x: '78%', y: '22%', delay: 0,   dur: 20, size: 18, color: '#818cf8', opacity: 0.12 },
  { type: 'diamond',  x: '14%', y: '58%', delay: 1.5, dur: 25, size: 14, color: '#f97316', opacity: 0.12 },
  { type: 'triangle', x: '58%', y: '78%', delay: 3,   dur: 18, size: 12, color: '#c084fc', opacity: 0.10 },
  { type: 'diamond',  x: '88%', y: '72%', delay: 0.8, dur: 22, size: 16, color: '#38bdf8', opacity: 0.10 },
  { type: 'cross',    x: '30%', y: '15%', delay: 2,   dur: 16, size: 14, color: '#818cf8', opacity: 0.09 },
];

function HexShape({ size, color, opacity }: { size: number; color: string; opacity: number }) {
  const h = size * Math.sin(Math.PI / 3);
  const points = [
    [size / 2, 0],
    [size, h / 2],
    [size, (3 * h) / 2],
    [size / 2, 2 * h],
    [0, (3 * h) / 2],
    [0, h / 2],
  ].map(p => p.join(',')).join(' ');
  return (
    <svg width={size * 2} height={size * 2.2} style={{ overflow: 'visible' }}>
      <polygon points={points} fill="none" stroke={color} strokeWidth="1.2" opacity={opacity} />
    </svg>
  );
}

function GeometricShape({ type, size, color, opacity }: { type: string; size: number; color: string; opacity: number }) {
  if (type === 'triangle') {
    const pts = `${size},0 ${size * 2},${size * 1.7} 0,${size * 1.7}`;
    return (
      <svg width={size * 2} height={size * 1.8} style={{ overflow: 'visible' }}>
        <polygon points={pts} fill="none" stroke={color} strokeWidth="1.2" opacity={opacity} />
      </svg>
    );
  }
  if (type === 'diamond') {
    const pts = `${size},0 ${size * 2},${size} ${size},${size * 2} 0,${size}`;
    return (
      <svg width={size * 2} height={size * 2} style={{ overflow: 'visible' }}>
        <polygon points={pts} fill="none" stroke={color} strokeWidth="1.2" opacity={opacity} />
      </svg>
    );
  }
  // cross
  return (
    <svg width={size * 2} height={size * 2} style={{ overflow: 'visible' }}>
      <line x1={size} y1={0} x2={size} y2={size * 2} stroke={color} strokeWidth="1.2" opacity={opacity} />
      <line x1={0} y1={size} x2={size * 2} y2={size} stroke={color} strokeWidth="1.2" opacity={opacity} />
    </svg>
  );
}

// Circuit + Connection SVG overlay (purely declarative, no random)
function CircuitOverlay() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
      <defs>
        <marker id="dot" markerWidth="4" markerHeight="4" refX="2" refY="2">
          <circle cx="2" cy="2" r="1.5" fill="#818cf8" opacity="0.5" />
        </marker>
      </defs>
      {/* Horizontal circuit trace - top left */}
      <polyline points="60,80 120,80 120,140 200,140" fill="none" stroke="#818cf8" strokeWidth="0.8" strokeOpacity="0.12" strokeDasharray="0" />
      {/* Corner joints */}
      <circle cx="120" cy="80"  r="2.5" fill="#818cf8" fillOpacity="0.18" />
      <circle cx="120" cy="140" r="2.5" fill="#818cf8" fillOpacity="0.18" />
      {/* Vertical trace - right side */}
      <polyline points="1100,60 1100,160 1020,160 1020,220" fill="none" stroke="#c084fc" strokeWidth="0.8" strokeOpacity="0.10" />
      <circle cx="1100" cy="160" r="2.5" fill="#c084fc" fillOpacity="0.15" />
      <circle cx="1020" cy="160" r="2.5" fill="#c084fc" fillOpacity="0.15" />
      {/* Bottom circuit */}
      <polyline points="200,680 280,680 280,720 400,720" fill="none" stroke="#f97316" strokeWidth="0.8" strokeOpacity="0.10" />
      <circle cx="280" cy="680" r="2.5" fill="#f97316" fillOpacity="0.15" />
      {/* Dotted AI connection paths */}
      <line x1="22%" y1="25%" x2="35%" y2="70%" stroke="#818cf8" strokeWidth="0.7" strokeOpacity="0.10" strokeDasharray="4 6" markerEnd="url(#dot)" />
      <line x1="76%" y1="30%" x2="68%" y2="65%" stroke="#c084fc" strokeWidth="0.7" strokeOpacity="0.10" strokeDasharray="4 6" markerEnd="url(#dot)" />
      <line x1="12%" y1="45%" x2="22%" y2="25%" stroke="#818cf8" strokeWidth="0.7" strokeOpacity="0.08" strokeDasharray="4 6" />
      <line x1="35%" y1="70%" x2="68%" y2="65%" stroke="#38bdf8" strokeWidth="0.7" strokeOpacity="0.08" strokeDasharray="4 6" />
      {/* Mesh grid - very faint */}
      {[...Array(8)].map((_, i) => (
        <line key={`h${i}`} x1="0" y1={`${(i + 1) * 12}%`} x2="100%" y2={`${(i + 1) * 12}%`}
          stroke="#818cf8" strokeWidth="0.4" strokeOpacity="0.04" strokeDasharray="6 14" />
      ))}
      {[...Array(10)].map((_, i) => (
        <line key={`v${i}`} x1={`${(i + 1) * 10}%`} y1="0" x2={`${(i + 1) * 10}%`} y2="100%"
          stroke="#818cf8" strokeWidth="0.4" strokeOpacity="0.04" strokeDasharray="6 14" />
      ))}
    </svg>
  );
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExplore, onHost }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Slow parallax for gradient blobs (non-distracting)
  const blob1Y = useTransform(scrollY, [0, 600], [0, 80]);
  const blob2Y = useTransform(scrollY, [0, 600], [0, -60]);
  const blob3Y = useTransform(scrollY, [0, 600], [0, 40]);

  const stats = [
    { label: 'Hackathons Hosted',      value: '500+',    icon: <Layers    className="text-indigo-400" size={24} /> },
    { label: 'Active Participants',     value: '50,000+', icon: <Users     className="text-purple-400" size={24} /> },
    { label: 'Prize Pool Distributed',  value: '$2M+',    icon: <Trophy    className="text-yellow-400" size={24} /> },
    { label: 'Projects Submitted',      value: '12,000+', icon: <GitBranch className="text-cyan-400"   size={24} /> },
    { label: 'Expert Judges',           value: '1,200+',  icon: <Award     className="text-pink-400"   size={24} /> },
  ];

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-hidden pt-20 pb-16 lg:pt-32 flex flex-col justify-center"
      style={{ background: 'linear-gradient(135deg, #fafafe 0%, #f0f0fe 30%, #fdf6ff 60%, #fff8f5 100%)' }}
    >
      {/* ── GRADIENT BLOBS (parallax, soft) ─────────────────────────────── */}
      <motion.div
        style={{ y: blob1Y }}
        className="absolute top-[-15%] left-[-8%] w-[55%] h-[55%] rounded-full pointer-events-none"
        animate={{ scale: [1, 1.06, 1], opacity: [0.55, 0.7, 0.55] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-300/30 via-purple-200/20 to-transparent blur-[90px]" />
      </motion.div>

      <motion.div
        style={{ y: blob2Y }}
        className="absolute bottom-[-10%] right-[-8%] w-[50%] h-[50%] rounded-full pointer-events-none"
        animate={{ scale: [1, 1.08, 1], opacity: [0.45, 0.65, 0.45] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-tl from-orange-200/25 via-pink-100/20 to-transparent blur-[100px]" />
      </motion.div>

      <motion.div
        style={{ y: blob3Y }}
        className="absolute top-[25%] right-[10%] w-[35%] h-[40%] rounded-full pointer-events-none"
        animate={{ scale: [1, 1.05, 1], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-bl from-purple-200/20 via-blue-100/15 to-transparent blur-[80px]" />
      </motion.div>

      {/* Additional orange accent blob */}
      <motion.div
        className="absolute bottom-[20%] left-[5%] w-[28%] h-[30%] rounded-full pointer-events-none"
        animate={{ scale: [1, 1.07, 1], opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-tr from-orange-200/20 to-transparent blur-[70px]" />
      </motion.div>

      {/* ── CIRCUIT + MESH OVERLAY ────────────────────────────────────────── */}
      <CircuitOverlay />

      {/* ── HEXAGONAL PATTERNS ───────────────────────────────────────────── */}
      {HEX_POSITIONS.map((h, i) => (
        <motion.div
          key={`hex-${i}`}
          className="absolute pointer-events-none"
          style={{ left: h.x, top: h.y }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 40 + i * 5, repeat: Infinity, ease: 'linear', delay: h.delay }}
        >
          <HexShape size={h.size} color={h.color} opacity={h.opacity} />
        </motion.div>
      ))}

      {/* ── GEOMETRIC SHAPES ─────────────────────────────────────────────── */}
      {GEOMETRIC.map((g, i) => (
        <motion.div
          key={`geo-${i}`}
          className="absolute pointer-events-none"
          style={{ left: g.x, top: g.y }}
          animate={{ rotate: [0, g.type === 'triangle' ? -360 : 360], opacity: [g.opacity * 0.7, g.opacity, g.opacity * 0.7] }}
          transition={{ duration: g.dur, repeat: Infinity, ease: 'linear', delay: g.delay }}
        >
          <GeometricShape type={g.type} size={g.size} color={g.color} opacity={g.opacity} />
        </motion.div>
      ))}

      {/* ── FLOATING CODE SNIPPETS ────────────────────────────────────────── */}
      {CODE_SNIPPETS.map((s, i) => (
        <motion.div
          key={`code-${i}`}
          className={`absolute pointer-events-none select-none font-mono font-bold ${s.size} ${s.color}`}
          style={{ left: s.x, top: s.y, rotate: s.rotate }}
          animate={{
            y: [0, -18, 0],
            x: [0, i % 2 === 0 ? 8 : -8, 0],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{ duration: s.dur, repeat: Infinity, ease: 'easeInOut', delay: s.delay }}
        >
          {s.text}
        </motion.div>
      ))}

      {/* ── AI NODES with pulse rings ─────────────────────────────────────── */}
      {AI_NODES.map((n, i) => (
        <div
          key={`node-${i}`}
          className="absolute pointer-events-none"
          style={{ left: n.x, top: n.y, transform: 'translate(-50%, -50%)' }}
        >
          {/* Pulse ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              width: n.size * 5,
              height: n.size * 5,
              left: -(n.size * 5 - n.size) / 2,
              top: -(n.size * 5 - n.size) / 2,
              background: n.pulseColor,
              borderRadius: '50%',
            }}
            animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeOut', delay: n.delay }}
          />
          {/* Node dot */}
          <div
            style={{
              width: n.size,
              height: n.size,
              borderRadius: '50%',
              background: n.color,
              opacity: 0.55,
            }}
          />
        </div>
      ))}

      {/* ── TINY SPARK PARTICLES ─────────────────────────────────────────── */}
      {SPARKS.map((s, i) => (
        <motion.div
          key={`spark-${i}`}
          className="absolute pointer-events-none"
          style={{ left: s.x, top: s.y }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 0.8, 0],
            rotate: [0, 45, 90],
          }}
          transition={{ duration: s.dur, repeat: Infinity, ease: 'easeInOut', delay: s.delay, repeatDelay: 1 }}
        >
          {/* 4-pointed star spark */}
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path d="M5 0 L5.5 4.5 L10 5 L5.5 5.5 L5 10 L4.5 5.5 L0 5 L4.5 4.5 Z"
              fill={i % 3 === 0 ? '#818cf8' : i % 3 === 1 ? '#f97316' : '#c084fc'}
              opacity="0.65"
            />
          </svg>
        </motion.div>
      ))}

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 relative flex-1 flex flex-col">
        <div className="flex flex-col lg:flex-row items-center gap-16 flex-1">

          {/* Left Content (60%) */}
          <div className="w-full lg:w-[60%] flex flex-col items-start text-left pt-10 lg:pt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200 mb-8 shadow-sm"
            >
              <span className="text-xl">🚀</span>
              <span className="text-sm font-medium text-indigo-700">Season 2026 — Open for Registration</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-tight tracking-tight mb-6"
            >
              Build.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600">
                Innovate.
              </span>{' '}
              Win.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-500 mb-10 max-w-2xl leading-relaxed"
            >
              The complete platform for hosting, managing, evaluating, and participating in hackathons.
              Join thousands of developers building the future.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <button
                onClick={onExplore}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:opacity-90 text-white px-8 py-4 rounded-xl font-medium shadow-[0_0_24px_rgba(79,70,229,0.28)] transition-all hover:-translate-y-1"
              >
                Explore Hackathons
                <ArrowRight size={20} />
              </button>

              <button
                onClick={onHost}
                className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 shadow-md px-8 py-4 rounded-xl font-medium transition-all hover:-translate-y-1"
              >
                <Sparkles size={20} className="text-purple-500" />
                Host a Hackathon
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-16 w-full"
            >
              <p className="text-sm font-medium text-slate-400 mb-4">Trusted by teams from</p>
              <div className="flex flex-wrap gap-8 items-center text-slate-400 font-bold text-lg grayscale opacity-60">
                {['Google', 'Microsoft', 'Meta', 'Amazon', 'Netflix'].map(brand => (
                  <span key={brand} className="hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                    {brand}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Content — Floating Cards */}
          <div className="hidden lg:block w-[40%] relative h-[600px]">
            <div className="absolute inset-0 flex items-center justify-center">

              {/* Card 1 — Live Leaderboard */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-10 right-4 w-64 bg-white/92 backdrop-blur-[16px] border border-slate-200 p-5 rounded-2xl shadow-xl shadow-indigo-100/60 rotate-[3deg] z-20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Trophy className="text-indigo-500" size={20} />
                  </div>
                  <span className="font-bold text-slate-800">Live Leaderboard</span>
                </div>
                <div className="space-y-3">
                  {['Team Alpha', 'CyberKnights', 'CodeNinjas'].map((team, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">{i + 1}. {team}</span>
                      <span className="text-emerald-500 font-semibold">+{100 - i * 15}pts</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Card 2 — Countdown Timer */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute top-1/3 left-[-20px] w-56 bg-white/92 backdrop-blur-[16px] border border-slate-200 p-5 rounded-2xl shadow-xl -rotate-[2deg] z-30"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Clock className="text-purple-500" size={20} />
                  </div>
                  <span className="font-medium text-slate-500 text-sm">Ending In</span>
                </div>
                <div className="text-3xl font-mono font-bold text-slate-800 tracking-wider">
                  02:14:35
                </div>
              </motion.div>

              {/* Card 3 — Prize Pool */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute bottom-20 right-[-10px] w-60 bg-white/92 backdrop-blur-[16px] border border-slate-200 p-5 rounded-2xl shadow-xl rotate-[1deg] z-10"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <DollarSign className="text-emerald-500" size={20} />
                  </div>
                  <span className="font-medium text-slate-500 text-sm">Prize Pool</span>
                </div>
                <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
                  $50,000
                </div>
              </motion.div>

              {/* Card 4 — Recent Submission */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                className="absolute bottom-10 left-10 w-72 bg-white/92 backdrop-blur-[16px] border border-slate-200 p-4 rounded-2xl shadow-xl -rotate-[1deg] z-40"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-cyan-100 rounded-lg">
                    <GitBranch className="text-cyan-500" size={16} />
                  </div>
                  <span className="font-medium text-slate-800 text-sm">Recent Submission</span>
                </div>
                <p className="text-sm text-slate-500 ml-11">Team Nova — AI Health Assistant</p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="mt-24 mb-12 w-full"
        >
          <div className="bg-white/75 backdrop-blur-md border border-slate-200/80 rounded-2xl p-6 md:p-8 flex flex-wrap gap-8 justify-between items-center shadow-lg shadow-indigo-100/30">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center justify-center gap-2 flex-1 min-w-[150px]">
                {stat.icon}
                <span className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</span>
                <span className="text-sm font-medium text-slate-500 text-center">{stat.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
