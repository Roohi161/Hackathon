import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Sparkles, Trophy, Clock, DollarSign, GitBranch, 
  Layers, Users, Award 
} from 'lucide-react';

interface HeroSectionProps {
  onExplore: () => void;
  onHost: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExplore, onHost }) => {
  // Stats data
  const stats = [
    { label: 'Hackathons Hosted', value: '500+', icon: <Layers className="text-indigo-400" size={24} /> },
    { label: 'Active Participants', value: '50,000+', icon: <Users className="text-purple-400" size={24} /> },
    { label: 'Prize Pool Distributed', value: '$2M+', icon: <Trophy className="text-yellow-400" size={24} /> },
    { label: 'Projects Submitted', value: '12,000+', icon: <GitBranch className="text-cyan-400" size={24} /> },
    { label: 'Expert Judges', value: '1,200+', icon: <Award className="text-pink-400" size={24} /> },
  ];

  // Particle positions for hydration safety
  const [particles, setParticles] = useState<Array<{x: number, y: number, opacity: number, duration: number, yAnim: number, xAnim: number}>>([]);
  
  useEffect(() => {
    // Generate particles client-side to avoid hydration mismatch
    const generated = [...Array(15)].map(() => ({
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
      y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
      opacity: Math.random() * 0.5 + 0.1,
      duration: Math.random() * 10 + 10,
      yAnim: Math.random() * -100 - 50,
      xAnim: Math.random() * 50 - 25,
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0B1020] overflow-hidden pt-20 pb-16 lg:pt-32 flex flex-col justify-center">
      {/* Background Gradients & Particles */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/30 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '4s' }}></div>
      
      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-white rounded-full"
            initial={{
              x: p.x,
              y: p.y,
              opacity: p.opacity,
            }}
            animate={{
              y: [null, p.yAnim],
              x: [null, p.xAnim],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 relative flex-1 flex flex-col">
        <div className="flex flex-col lg:flex-row items-center gap-16 flex-1">
          {/* Left Content (60%) */}
          <div className="w-full lg:w-[60%] flex flex-col items-start text-left pt-10 lg:pt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8"
            >
              <span className="text-xl">🚀</span>
              <span className="text-sm font-medium text-indigo-300">Season 2026 — Open for Registration</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight mb-6"
            >
              Build. <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">Innovate.</span> Win.
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed"
            >
              The complete platform for hosting, managing, evaluating, and participating in hackathons. Join thousands of developers building the future.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <button
                onClick={onExplore}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:opacity-90 text-white px-8 py-4 rounded-xl font-medium shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all hover:-translate-y-1"
              >
                Explore Hackathons
                <ArrowRight size={20} />
              </button>
              
              <button
                onClick={onHost}
                className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white px-8 py-4 rounded-xl font-medium transition-all hover:-translate-y-1"
              >
                <Sparkles size={20} className="text-purple-400" />
                Host a Hackathon
              </button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-16 w-full"
            >
              <p className="text-sm font-medium text-gray-500 mb-4">Trusted by teams from</p>
              <div className="flex flex-wrap gap-8 items-center text-gray-400 font-bold text-lg grayscale opacity-70">
                <span className="hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">Google</span>
                <span className="hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">Microsoft</span>
                <span className="hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">Meta</span>
                <span className="hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">Amazon</span>
                <span className="hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">Netflix</span>
              </div>
            </motion.div>
          </div>

          {/* Right Content (40%) */}
          <div className="hidden lg:block w-[40%] relative h-[600px]">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Card 1: Live Leaderboard */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 right-4 w-64 bg-[#0F172A]/60 backdrop-blur-[16px] border border-white/10 p-5 rounded-2xl shadow-indigo-500/20 shadow-xl rotate-[3deg] z-20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-500/20 rounded-lg">
                    <Trophy className="text-indigo-400" size={20} />
                  </div>
                  <span className="font-bold text-white">Live Leaderboard</span>
                </div>
                <div className="space-y-3">
                  {['Team Alpha', 'CyberKnights', 'CodeNinjas'].map((team, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">{i + 1}. {team}</span>
                      <span className="text-green-400 font-medium">+{100 - i * 15}pts</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Card 2: Countdown Timer */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-1/3 left-[-20px] w-56 bg-[#0F172A]/60 backdrop-blur-[16px] border border-white/10 p-5 rounded-2xl shadow-xl -rotate-[2deg] z-30"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Clock className="text-purple-400" size={20} />
                  </div>
                  <span className="font-medium text-gray-300 text-sm">Ending In</span>
                </div>
                <div className="text-3xl font-mono font-bold text-white tracking-wider">
                  02:14:35
                </div>
              </motion.div>

              {/* Card 3: Prize Pool */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-20 right-[-10px] w-60 bg-[#0F172A]/60 backdrop-blur-[16px] border border-white/10 p-5 rounded-2xl shadow-xl rotate-[1deg] z-10"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <DollarSign className="text-green-400" size={20} />
                  </div>
                  <span className="font-medium text-gray-300 text-sm">Prize Pool</span>
                </div>
                <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                  $50,000
                </div>
              </motion.div>

              {/* Card 4: Recent Submission */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="absolute bottom-10 left-10 w-72 bg-[#0F172A]/60 backdrop-blur-[16px] border border-white/10 p-4 rounded-2xl shadow-xl -rotate-[1deg] z-40"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <GitBranch className="text-cyan-400" size={16} />
                  </div>
                  <span className="font-medium text-white text-sm">Recent Submission</span>
                </div>
                <p className="text-sm text-gray-400 ml-11">Team Nova — AI Health Assistant</p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="mt-24 mb-12 w-full"
        >
          <div className="bg-[#0F172A]/60 backdrop-blur-[16px] border border-white/10 rounded-2xl p-6 md:p-8 flex flex-wrap gap-8 justify-between items-center shadow-2xl">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center justify-center gap-2 flex-1 min-w-[150px]">
                {stat.icon}
                <span className="text-3xl font-bold text-white mt-2">{stat.value}</span>
                <span className="text-sm font-medium text-gray-400 text-center">{stat.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
