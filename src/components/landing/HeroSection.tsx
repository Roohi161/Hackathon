import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import {
  ArrowRight, Sparkles, Trophy, Clock, DollarSign, GitBranch,
  Layers, Users, Award
} from 'lucide-react';

interface HeroSectionProps {
  onExplore: () => void;
  onHost: () => void;
}

/* ─── Static decorative data ─────────────────────────────────────────────── */
const CODE_TOKENS = [
  { text: '</>', x: 6,  y: 22, rot: -14, delay: 0,   dur: 16, clr: 'rgba(99,102,241,0.55)',  size: 15 },
  { text: '{}',  x: 18, y: 72, rot: 10,  delay: 1.2, dur: 19, clr: 'rgba(168,85,247,0.50)',  size: 14 },
  { text: 'git', x: 3,  y: 48, rot: -6,  delay: 2.4, dur: 14, clr: 'rgba(249,115,22,0.50)',  size: 11 },
  { text: 'npm', x: 10, y: 86, rot: 8,   delay: 0.6, dur: 17, clr: 'rgba(20,184,166,0.45)',  size: 11 },
  { text: '=>',  x: 3,  y: 35, rot: -4,  delay: 3.0, dur: 20, clr: 'rgba(99,102,241,0.40)',  size: 13 },
  { text: '&&',  x: 14, y: 58, rot: 12,  delay: 1.8, dur: 15, clr: 'rgba(236,72,153,0.40)',  size: 12 },
  { text: '//',  x: 8,  y: 93, rot: -2,  delay: 4.0, dur: 18, clr: 'rgba(99,102,241,0.35)',  size: 11 },
];

const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  x:  [3,8,14,21,28,34,41,47,54,60,67,73,79,85,91,6,12,18,25,32,38,45,52,58,64,71,77,88][i],
  y:  [15,42,68,28,55,83,12,39,66,22,49,76,33,60,87,72,18,45,9,36,63,27,54,81,44,21,68,38][i],
  sz: [2,3,2,4,2,3,2,3,4,2,3,2,4,2,3,2,3,2,3,4,2,3,2,3,4,2,3,2][i],
  dl: i * 0.28,
  dr: 3.5 + (i % 4) * 0.6,
  clr: ['#818cf8','#c084fc','#fb923c','#34d399','#38bdf8','#f472b6'][i % 6],
}));

const HEX_GRID = Array.from({ length: 12 }, (_, i) => ({
  x:  [5,18,31,44,57,70,83,11,24,37,50,63][i],
  y:  [10,25,8,18,30,15,22,40,55,48,62,70][i],
  sz: [28,22,32,26,20,24,30,22,28,24,26,20][i],
  op: [0.07,0.05,0.08,0.06,0.05,0.07,0.06,0.05,0.08,0.06,0.07,0.05][i],
  clr:['#818cf8','#c084fc','#f97316','#38bdf8','#818cf8','#c084fc',
       '#f97316','#38bdf8','#818cf8','#c084fc','#f97316','#38bdf8'][i],
}));

/* ─── Holographic Orb ─────────────────────────────────────────────────────── */
function HoloOrb({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const R = 200; // orb radius
  const cx = 220; const cy = 220;
  const tiltX = (mouseY - 0.5) * 18;
  const tiltY = (mouseX - 0.5) * -18;

  return (
    <motion.div
      className="relative"
      animate={{ rotateX: tiltX, rotateY: tiltY }}
      transition={{ type: 'spring', stiffness: 60, damping: 20 }}
      style={{ width: 440, height: 440, perspective: 1000, transformStyle: 'preserve-3d' as const }}
    >
      {/* Ambient outer glow */}
      <div className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 55% 45%, rgba(139,92,246,0.22) 0%, rgba(99,102,241,0.16) 35%, rgba(251,146,60,0.10) 65%, transparent 80%)',
          filter: 'blur(24px)',
          transform: 'scale(1.35)',
        }}
      />
      {/* Secondary orange glow */}
      <div className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 30% 70%, rgba(251,146,60,0.18) 0%, transparent 60%)',
          filter: 'blur(32px)',
          transform: 'scale(1.2)',
        }}
      />

      <svg width={440} height={440} viewBox="0 0 440 440" className="relative z-10">
        <defs>
          {/* Core sphere gradient */}
          <radialGradient id="orbCore" cx="42%" cy="38%" r="58%">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="25%"  stopColor="#ede9fe" stopOpacity="0.85" />
            <stop offset="55%"  stopColor="#ddd6fe" stopOpacity="0.75" />
            <stop offset="80%"  stopColor="#c4b5fd" stopOpacity="0.60" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.45" />
          </radialGradient>
          {/* Holographic sheen */}
          <radialGradient id="orbSheen" cx="38%" cy="32%" r="45%">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="60%"  stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          {/* Ring gradients */}
          <linearGradient id="ring1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#818cf8" stopOpacity="0" />
            <stop offset="30%"  stopColor="#818cf8" stopOpacity="0.9" />
            <stop offset="70%"  stopColor="#c084fc" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#c084fc" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="ring2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#fb923c" stopOpacity="0" />
            <stop offset="30%"  stopColor="#fb923c" stopOpacity="0.8" />
            <stop offset="70%"  stopColor="#f472b6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#f472b6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="ring3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#38bdf8" stopOpacity="0" />
            <stop offset="40%"  stopColor="#38bdf8" stopOpacity="0.7" />
            <stop offset="60%"  stopColor="#34d399" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </linearGradient>
          {/* Glow filter */}
          <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="glowStrong" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="8" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          {/* Hex clip */}
          <clipPath id="orbClip">
            <circle cx={cx} cy={cy} r={R} />
          </clipPath>
        </defs>

        {/* ── Shadow beneath orb */}
        <ellipse cx={cx} cy={cy + R + 18} rx={R * 0.7} ry={14}
          fill="rgba(99,102,241,0.12)" filter="url(#glowStrong)" />

        {/* ── Main orb sphere */}
        <circle cx={cx} cy={cy} r={R} fill="url(#orbCore)" />

        {/* ── Hexagonal grid inside sphere */}
        <g clipPath="url(#orbClip)" opacity="0.18">
          {Array.from({ length: 10 }, (_, row) =>
            Array.from({ length: 10 }, (_, col) => {
              const hw = 22; const hh = hw * Math.sin(Math.PI / 3);
              const ox = col * hw * 1.73 + (row % 2 === 0 ? 0 : hw * 0.87) + 20;
              const oy = row * hh * 1.35 + 20;
              const pts = [
                [ox + hw * 0.5, oy], [ox + hw, oy + hh * 0.5],
                [ox + hw, oy + hh * 1.5], [ox + hw * 0.5, oy + hh * 2],
                [ox, oy + hh * 1.5], [ox, oy + hh * 0.5],
              ].map(p => p.join(',')).join(' ');
              return <polygon key={`${row}-${col}`} points={pts} fill="none"
                stroke="#818cf8" strokeWidth="0.6" />;
            })
          )}
        </g>

        {/* ── Circuit lines inside sphere */}
        <g clipPath="url(#orbClip)" opacity="0.25" stroke="#818cf8" strokeWidth="0.8" fill="none">
          <polyline points="100,160 140,160 140,200 180,200" />
          <polyline points="260,140 300,140 300,180 340,180" />
          <polyline points="120,280 160,280 160,320" />
          <polyline points="300,270 300,310 340,310" />
          <circle cx="140" cy="160" r="2.5" fill="#818cf8" opacity="0.6"/>
          <circle cx="300" cy="140" r="2.5" fill="#c084fc" opacity="0.6"/>
          <circle cx="160" cy="280" r="2.5" fill="#38bdf8" opacity="0.6"/>
        </g>

        {/* ── Latitude lines (sphere illusion) */}
        <g clipPath="url(#orbClip)" opacity="0.12" stroke="#a78bfa" strokeWidth="0.7" fill="none">
          {[-100, -60, -20, 20, 60, 100].map(dy => {
            const ry = Math.sqrt(Math.max(0, R * R - dy * dy));
            return <ellipse key={dy} cx={cx} cy={cy + dy} rx={ry} ry={ry * 0.35} />;
          })}
          {/* Longitude lines */}
          {[-120, -60, 0, 60, 120].map(angle => (
            <ellipse key={angle} cx={cx} cy={cy} rx={R * Math.abs(Math.cos(angle * Math.PI / 180))}
              ry={R} transform={`rotate(${angle}, ${cx}, ${cy})`} />
          ))}
        </g>

        {/* ── Holographic sheen overlay */}
        <circle cx={cx} cy={cy} r={R} fill="url(#orbSheen)" />

        {/* ── Orbiting Ring 1 — wide flat ring */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{ originX: `${cx}px`, originY: `${cy}px` }}
        >
          <ellipse cx={cx} cy={cy} rx={R + 32} ry={22}
            fill="none" stroke="url(#ring1)" strokeWidth="3" filter="url(#glow)" />
          <circle cx={cx + R + 32} cy={cy} r="5" fill="#818cf8" filter="url(#glowStrong)" />
        </motion.g>

        {/* ── Orbiting Ring 2 — tilted ring */}
        <motion.g
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          style={{ originX: `${cx}px`, originY: `${cy}px` }}
        >
          <ellipse cx={cx} cy={cy} rx={R + 55} ry={28}
            fill="none" stroke="url(#ring2)" strokeWidth="2.5"
            transform={`rotate(35, ${cx}, ${cy})`} filter="url(#glow)" />
          <circle cx={cx} cy={cy - R - 55} r="4.5" fill="#fb923c"
            transform={`rotate(-45, ${cx}, ${cy})`} filter="url(#glowStrong)" />
        </motion.g>

        {/* ── Orbiting Ring 3 — outer slow ring */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          style={{ originX: `${cx}px`, originY: `${cy}px` }}
        >
          <ellipse cx={cx} cy={cy} rx={R + 78} ry={18}
            fill="none" stroke="url(#ring3)" strokeWidth="2"
            transform={`rotate(-25, ${cx}, ${cy})`} filter="url(#glow)" />
          <circle cx={cx + R + 78} cy={cy} r="4" fill="#38bdf8"
            transform={`rotate(60, ${cx}, ${cy})`} filter="url(#glowStrong)" />
        </motion.g>

        {/* ── Data orbit dots */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          style={{ originX: `${cx}px`, originY: `${cy}px` }}
        >
          {[0, 120, 240].map(a => (
            <circle key={a} cx={cx + (R + 18) * Math.cos(a * Math.PI / 180)}
              cy={cy + 14 * Math.sin(a * Math.PI / 180)}
              r="3.5" fill="#c084fc" filter="url(#glow)" opacity="0.85" />
          ))}
        </motion.g>

        {/* ── Inner core glow pulse */}
        <motion.circle cx={cx} cy={cy} r={R * 0.28}
          fill="rgba(255,255,255,0.55)"
          animate={{ r: [R * 0.24, R * 0.32, R * 0.24], opacity: [0.5, 0.75, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          filter="url(#glowStrong)"
        />

        {/* ── Glowing dot at highlight point */}
        <circle cx={cx - 52} cy={cy - 72} r="6" fill="white" opacity="0.80" filter="url(#glow)" />
        <circle cx={cx - 52} cy={cy - 72} r="3" fill="white" opacity="0.95" />
      </svg>
    </motion.div>
  );
}

/* ─── Component ──────────────────────────────────────────────────────────── */
export const HeroSection: React.FC<HeroSectionProps> = ({ onExplore, onHost }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  // Smooth spring for parallax
  const springX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 25 });

  // Parallax layers
  const blob1X = useTransform(springX, [0, 1], [-30, 30]);
  const blob1Y = useTransform(springY, [0, 1], [-20, 20]);
  const blob2X = useTransform(springX, [0, 1], [20, -20]);
  const blob2Y = useTransform(springY, [0, 1], [15, -15]);
  const orbX   = useTransform(springX, [0, 1], [-12, 12]);
  const orbY   = useTransform(springY, [0, 1], [-8, 8]);

  // Scroll parallax
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 700], [0, 120]);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top)  / rect.height;
      mouseX.set(Math.max(0, Math.min(1, nx)));
      mouseY.set(Math.max(0, Math.min(1, ny)));
      setMousePos({ x: nx, y: ny });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, [mouseX, mouseY]);

  const stats = [
    { label: 'Hackathons Hosted',     value: '500+',    icon: <Layers    className="text-indigo-500" size={22} /> },
    { label: 'Active Participants',    value: '50,000+', icon: <Users     className="text-purple-500" size={22} /> },
    { label: 'Prize Pool Distributed', value: '$2M+',    icon: <Trophy    className="text-amber-500"  size={22} /> },
    { label: 'Projects Submitted',     value: '12,000+', icon: <GitBranch className="text-cyan-500"   size={22} /> },
    { label: 'Expert Judges',          value: '1,200+',  icon: <Award     className="text-pink-500"   size={22} /> },
  ];

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-hidden pt-20 pb-16 lg:pt-28 flex flex-col"
      style={{
        background: `
          radial-gradient(ellipse 80% 60% at 15% 20%,  #EEF4FF 0%,  transparent 65%),
          radial-gradient(ellipse 70% 55% at 85% 15%,  #FDF2FF 0%,  transparent 60%),
          radial-gradient(ellipse 65% 70% at 90% 80%,  #FFF6EC 0%,  transparent 55%),
          radial-gradient(ellipse 75% 60% at 10% 85%,  #EAFBFF 0%,  transparent 60%),
          radial-gradient(ellipse 55% 50% at 50% 50%,  #F5F7FF 0%,  transparent 70%),
          linear-gradient(145deg, #F5F7FF 0%, #EEF4FF 25%, #FDF2FF 50%, #FFF6EC 75%, #EAFBFF 100%)
        `,
      }}
    >
      {/* ── AURORA LIGHT BEAMS ──────────────────────────────────────────── */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          x: blob1X, y: blob1Y,
          top: '-20%', left: '-15%',
          width: '70%', height: '70%',
          background: 'radial-gradient(ellipse, rgba(139,92,246,0.20) 0%, rgba(99,102,241,0.12) 40%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(60px)',
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute pointer-events-none"
        style={{
          x: blob2X, y: blob2Y,
          top: '-10%', right: '-20%',
          width: '65%', height: '65%',
          background: 'radial-gradient(ellipse, rgba(251,146,60,0.18) 0%, rgba(244,114,182,0.12) 45%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(70px)',
        }}
        animate={{ scale: [1, 1.10, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      <motion.div
        className="absolute pointer-events-none"
        style={{
          bottom: '-15%', left: '20%',
          width: '60%', height: '55%',
          background: 'radial-gradient(ellipse, rgba(56,189,248,0.15) 0%, rgba(52,211,153,0.10) 45%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(80px)',
        }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />
      {/* Diagonal color beams */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute" style={{
          top: '10%', left: '-5%', width: '45%', height: '3px',
          background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent)',
          transform: 'rotate(25deg)', filter: 'blur(2px)',
        }} />
        <div className="absolute" style={{
          top: '35%', right: '-5%', width: '40%', height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(251,146,60,0.35), transparent)',
          transform: 'rotate(-20deg)', filter: 'blur(2px)',
        }} />
        <div className="absolute" style={{
          bottom: '25%', left: '10%', width: '35%', height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.30), transparent)',
          transform: 'rotate(15deg)', filter: 'blur(2px)',
        }} />
      </div>

      {/* ── GRADIENT WAVE SHAPES ────────────────────────────────────────── */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.06 }}>
        <defs>
          <radialGradient id="meshGrad1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        {/* Faint hex grid */}
        {HEX_GRID.map((h, i) => {
          const R2 = h.sz; const pts = Array.from({ length: 6 }, (_, k) => {
            const a = (Math.PI / 180) * (60 * k - 30);
            return `${h.x + R2 * Math.cos(a)}%,${h.y + R2 * Math.sin(a) * 0.55}%`;
          }).join(' ');
          return <polygon key={i} points={pts} fill="none"
            stroke={h.clr} strokeWidth="0.8" opacity={h.op} />;
        })}
        {/* Dotted network lines */}
        <line x1="5%"  y1="20%" x2="22%" y2="30%" stroke="#818cf8" strokeWidth="0.6" strokeDasharray="3 8" opacity="0.25" />
        <line x1="22%" y1="30%" x2="40%" y2="22%" stroke="#c084fc" strokeWidth="0.6" strokeDasharray="3 8" opacity="0.20" />
        <line x1="8%"  y1="55%" x2="20%" y2="45%" stroke="#38bdf8" strokeWidth="0.6" strokeDasharray="3 8" opacity="0.20" />
        <line x1="15%" y1="80%" x2="30%" y2="70%" stroke="#fb923c" strokeWidth="0.6" strokeDasharray="3 8" opacity="0.18" />
        {/* Circuit traces */}
        <polyline points="40,80 90,80 90,130 150,130" fill="none" stroke="#818cf8" strokeWidth="0.8" strokeOpacity="0.18" />
        <polyline points="80,220 130,220 130,270 190,270" fill="none" stroke="#c084fc" strokeWidth="0.8" strokeOpacity="0.15" />
        <circle cx="90"  cy="80"  r="2.5" fill="#818cf8" fillOpacity="0.30" />
        <circle cx="130" cy="220" r="2.5" fill="#c084fc" fillOpacity="0.25" />
        {/* Grid lines */}
        {[15, 30, 45, 60, 75].map(p => (
          <line key={p} x1="0" y1={`${p}%`} x2="100%" y2={`${p}%`}
            stroke="#818cf8" strokeWidth="0.4" strokeDasharray="4 16" opacity="0.06" />
        ))}
        {[12, 24, 36, 48, 60, 72, 84].map(p => (
          <line key={p} x1={`${p}%`} y1="0" x2={`${p}%`} y2="100%"
            stroke="#818cf8" strokeWidth="0.4" strokeDasharray="4 16" opacity="0.06" />
        ))}
      </svg>

      {/* ── FLOATING CODE TOKENS ────────────────────────────────────────── */}
      {CODE_TOKENS.map((t, i) => (
        <motion.div
          key={i}
          className="absolute select-none pointer-events-none font-mono font-bold"
          style={{ left: `${t.x}%`, top: `${t.y}%`, color: t.clr, fontSize: t.size, rotate: t.rot,
            textShadow: `0 0 12px ${t.clr}` }}
          animate={{ y: [0, -20, 0], x: [0, i % 2 === 0 ? 8 : -8, 0], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: t.dur, repeat: Infinity, ease: 'easeInOut', delay: t.delay }}
        >
          {t.text}
        </motion.div>
      ))}

      {/* ── PARTICLES ───────────────────────────────────────────────────── */}
      {PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.sz, height: p.sz, background: p.clr,
            boxShadow: `0 0 ${p.sz * 3}px ${p.clr}` }}
          animate={{ scale: [0.5, 1.4, 0.5], opacity: [0.2, 0.75, 0.2], y: [0, -14, 0] }}
          transition={{ duration: p.dr, repeat: Infinity, ease: 'easeInOut', delay: p.dl }}
        />
      ))}

      {/* ── STAR SPARKS ─────────────────────────────────────────────────── */}
      {[...Array(8)].map((_, i) => (
        <motion.div key={`sp-${i}`} className="absolute pointer-events-none"
          style={{ left: `${[10,25,38,52,65,78,88,42][i]}%`, top: `${[28,55,18,72,38,60,22,85][i]}%` }}
          animate={{ scale: [0, 1, 0], opacity: [0, 0.9, 0], rotate: [0, 45, 90] }}
          transition={{ duration: [3.2,2.8,3.5,2.6,3.0,3.8,2.4,3.3][i], repeat: Infinity,
            ease: 'easeInOut', delay: i * 0.55, repeatDelay: 1.2 }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path d="M5 0 L5.6 4.4 L10 5 L5.6 5.6 L5 10 L4.4 5.6 L0 5 L4.4 4.4 Z"
              fill={['#818cf8','#c084fc','#fb923c','#34d399','#38bdf8','#f472b6','#818cf8','#c084fc'][i]}
              opacity="0.75" />
          </svg>
        </motion.div>
      ))}

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
      <motion.div
        style={{ y: heroY }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 relative flex-1 flex flex-col"
      >
        <div className="flex flex-col lg:flex-row items-center gap-10 flex-1 min-h-[calc(100vh-8rem)]">

          {/* ── LEFT TEXT (55%) ─────────────────────────────────────────── */}
          <div className="w-full lg:w-[55%] flex flex-col items-start text-left pt-10 lg:pt-0">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full mb-8"
              style={{
                background: 'rgba(99,102,241,0.08)',
                border: '1px solid rgba(99,102,241,0.22)',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 0 20px rgba(99,102,241,0.10)',
              }}
            >
              <span className="text-xl">🚀</span>
              <span className="text-sm font-semibold text-indigo-700">Season 2026 — Open for Registration</span>
              <span className="ml-1 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.08] tracking-tight mb-6"
            >
              Build.{' '}
              <span style={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 40%, #0ea5e9 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                filter: 'drop-shadow(0 0 18px rgba(99,102,241,0.30))',
              }}>
                Innovate.
              </span>{' '}
              Win.
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-500 mb-10 max-w-xl leading-relaxed"
            >
              The complete platform for hosting, managing, evaluating, and participating in hackathons.
              Join <span className="font-semibold text-slate-700">50,000+ developers</span> building the future.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mb-14"
            >
              <motion.button
                onClick={onExplore}
                whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 text-white font-semibold px-8 py-4 rounded-xl text-base"
                style={{
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #0ea5e9 100%)',
                  boxShadow: '0 0 28px rgba(99,102,241,0.35), 0 4px 16px rgba(99,102,241,0.25)',
                }}
              >
                Explore Hackathons <ArrowRight size={18} />
              </motion.button>

              <motion.button
                onClick={onHost}
                whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 font-semibold px-8 py-4 rounded-xl text-base text-slate-700"
                style={{
                  background: 'rgba(255,255,255,0.75)',
                  border: '1px solid rgba(148,163,184,0.35)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
                }}
              >
                <Sparkles size={18} className="text-purple-500" /> Host a Hackathon
              </motion.button>
            </motion.div>

            {/* Trusted by */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.55 }}
            >
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
                Trusted by teams from
              </p>
              <div className="flex flex-wrap gap-7 items-center">
                {['Google', 'Microsoft', 'Meta', 'Amazon', 'Netflix'].map(brand => (
                  <motion.span
                    key={brand}
                    whileHover={{ opacity: 1, scale: 1.08 }}
                    className="text-slate-400 font-bold text-sm cursor-pointer transition-all"
                    style={{ opacity: 0.5 }}
                  >
                    {brand}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT SIDE — HOLO ORB + FLOATING CARDS (45%) ────────────── */}
          <div className="hidden lg:flex w-[45%] relative items-center justify-center" style={{ minHeight: 520 }}>

            {/* Orb parallax wrapper */}
            <motion.div style={{ x: orbX, y: orbY }} className="relative z-20">
              <HoloOrb mouseX={mousePos.x} mouseY={mousePos.y} />
            </motion.div>

            {/* ── Floating Card: Live Leaderboard */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-6 right-[-10px] z-30"
              style={{
                background: 'rgba(255,255,255,0.82)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(148,163,184,0.22)',
                borderRadius: 20,
                padding: '16px 20px',
                width: 230,
                boxShadow: '0 16px 40px rgba(99,102,241,0.12), 0 4px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
              }}
            >
              <div className="flex items-center gap-2.5 mb-3">
                <div style={{ background: 'rgba(99,102,241,0.12)', borderRadius: 8, padding: 6 }}>
                  <Trophy size={16} className="text-indigo-500" />
                </div>
                <span className="font-bold text-slate-800 text-sm">Live Leaderboard</span>
                <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              {['Team Alpha', 'CyberKnights', 'CodeNinjas'].map((team, i) => (
                <div key={i} className="flex justify-between items-center text-xs py-1.5 border-b border-slate-100 last:border-0">
                  <span className="text-slate-600 font-medium">{i + 1}. {team}</span>
                  <span className="text-emerald-500 font-bold">+{100 - i * 15}pts</span>
                </div>
              ))}
            </motion.div>

            {/* ── Floating Card: Countdown */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
              className="absolute left-[-30px] top-[38%] z-30"
              style={{
                background: 'rgba(255,255,255,0.82)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(148,163,184,0.22)',
                borderRadius: 18,
                padding: '14px 18px',
                width: 200,
                boxShadow: '0 16px 40px rgba(168,85,247,0.10), 0 4px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
              }}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div style={{ background: 'rgba(168,85,247,0.12)', borderRadius: 8, padding: 6 }}>
                  <Clock size={14} className="text-purple-500" />
                </div>
                <span className="text-slate-500 text-xs font-medium">Ending In</span>
              </div>
              <div className="font-mono font-extrabold text-slate-800 text-2xl tracking-widest">02:14:35</div>
              <div className="text-xs text-slate-400 mt-1">AI Innovation Challenge</div>
            </motion.div>

            {/* ── Floating Card: Prize Pool */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
              className="absolute bottom-16 right-[-20px] z-30"
              style={{
                background: 'rgba(255,255,255,0.82)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(148,163,184,0.22)',
                borderRadius: 18,
                padding: '14px 18px',
                width: 190,
                boxShadow: '0 16px 40px rgba(52,211,153,0.12), 0 4px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
              }}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div style={{ background: 'rgba(52,211,153,0.12)', borderRadius: 8, padding: 6 }}>
                  <DollarSign size={14} className="text-emerald-500" />
                </div>
                <span className="text-slate-500 text-xs font-medium">Prize Pool</span>
              </div>
              <div className="font-extrabold text-3xl" style={{
                background: 'linear-gradient(135deg, #10b981, #14b8a6)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>$50,000</div>
            </motion.div>

            {/* ── Floating Card: Submission */}
            <motion.div
              animate={{ y: [0, -9, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              className="absolute bottom-4 left-[-10px] z-30"
              style={{
                background: 'rgba(255,255,255,0.82)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(148,163,184,0.22)',
                borderRadius: 18,
                padding: '12px 16px',
                width: 240,
                boxShadow: '0 16px 40px rgba(56,189,248,0.10), 0 4px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
              }}
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <div style={{ background: 'rgba(56,189,248,0.12)', borderRadius: 8, padding: 5 }}>
                  <GitBranch size={13} className="text-cyan-500" />
                </div>
                <span className="text-slate-700 text-xs font-semibold">New Submission ✨</span>
              </div>
              <p className="text-xs text-slate-500 ml-8">Team Nova — AI Health Assistant</p>
            </motion.div>
          </div>
        </div>

        {/* ── STATS BAR ──────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7 }}
          className="mt-12 mb-10 w-full"
        >
          <div style={{
            background: 'rgba(255,255,255,0.72)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(148,163,184,0.20)',
            borderRadius: 20,
            padding: '28px 32px',
            boxShadow: '0 8px 32px rgba(99,102,241,0.08), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.95)',
          }}
            className="flex flex-wrap gap-6 justify-between items-center"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center gap-1.5 flex-1 min-w-[130px]"
              >
                {stat.icon}
                <span className="text-2xl font-extrabold text-slate-900 tracking-tight">{stat.value}</span>
                <span className="text-xs font-medium text-slate-500 text-center">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
