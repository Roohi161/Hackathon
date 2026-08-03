import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar, ArrowRight, Zap, Clock, Code, Terminal, Cpu, Sparkles, Star, Award, ChevronRight } from 'lucide-react';
import type { Hackathon, AuthenticatedUser } from '../../types';

interface ParticipantDashboardProps {
  user: AuthenticatedUser;
  allHackathons: Hackathon[];
  onViewHackathon: (hackathon: Hackathon) => void;
}

export const ParticipantDashboard: React.FC<ParticipantDashboardProps> = ({ user, allHackathons, onViewHackathon }) => {
  // Registered hackathons for participant
  const myHackathons = allHackathons.slice(0, 3);
  
  // Recommend hackathons based on status
  const recommendedHackathons = allHackathons.filter(h => h.status === 'upcoming').slice(0, 2);

  const calculateProfileScore = () => {
    let score = 50; // base for signing up
    if (user.education) score += 10;
    if (user.skills && user.skills.length > 0) score += 20;
    if (user.githubUrl || user.linkedinUrl) score += 20;
    return score;
  };

  const profileScore = calculateProfileScore();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* Background Decorative Ambient Orbs */}
      <div className="absolute -top-10 -left-10 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 -right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Hero Welcome Banner with Light Gradient & Floating Hackathon Visuals */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl p-8 sm:p-10 text-slate-900 bg-gradient-to-br from-indigo-50 via-purple-50/70 to-blue-50/50 border-2 border-indigo-100/90 shadow-xl shadow-indigo-100/50 relative overflow-hidden group"
      >
        {/* Floating Code & Tech Watermarks */}
        <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6">
          <Terminal className="w-72 h-72 text-indigo-700" />
        </div>
        <div className="absolute right-48 top-4 opacity-[0.07] pointer-events-none">
          <Cpu className="w-36 h-36 text-violet-700 animate-spin-slow" />
        </div>
        <div className="absolute left-1/2 -bottom-8 opacity-[0.05] pointer-events-none">
          <Code className="w-48 h-48 text-indigo-900" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-indigo-200 text-indigo-700 text-xs font-black mb-4 shadow-xs backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
            <span>Participant Command Center</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3 text-slate-900">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600">{user.name.split(' ')[0]}</span>! 🚀
          </h1>
          <p className="text-slate-600 text-base sm:text-lg mb-8 leading-relaxed font-medium">
            Ready to build something extraordinary? View your ongoing hackathons, track project milestones, and level up your skills.
          </p>
          
          <div className="bg-white/90 backdrop-blur-md border border-indigo-100/90 rounded-2xl p-5 shadow-sm inline-block min-w-[280px]">
            <div className="flex items-center justify-between gap-4 mb-2">
              <div className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" /> Profile Strength
              </div>
              <div className="text-base font-black text-indigo-700">{profileScore}%</div>
            </div>
            <div className="w-full h-2.5 bg-indigo-50 rounded-full overflow-hidden border border-indigo-100">
              <motion.div 
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${profileScore}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
            {profileScore < 100 && (
              <p className="text-[11px] text-slate-500 mt-2.5 font-semibold flex items-center gap-1">
                <Award className="w-3 h-3 text-indigo-500 shrink-0" /> Add socials & skills to reach 100% and stand out to judges!
              </p>
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: My Registered Hackathons */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-100 border border-indigo-200 text-indigo-600 shadow-2xs">
                  <Trophy className="w-6 h-6" />
                </div>
                My Hackathons
              </h2>
              <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
                {myHackathons.length} Active Events
              </span>
            </div>
            
            {myHackathons.length > 0 ? (
              <div className="grid gap-5">
                {myHackathons.map(hackathon => {
                  const diff = new Date(hackathon.endDate).getTime() - new Date().getTime();
                  const daysLeft = diff <= 0 ? 'Event Ended' : `${Math.ceil(diff / (1000 * 60 * 60 * 24))} Days Left`;

                  return (
                    <motion.div 
                      whileHover={{ y: -4, scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                      key={hackathon.id} 
                      className="bg-gradient-to-br from-white via-indigo-50/20 to-purple-50/30 rounded-3xl p-5 sm:p-6 border-2 border-indigo-100/80 shadow-md hover:shadow-xl hover:border-indigo-300 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center gap-6 group relative overflow-hidden"
                      onClick={() => onViewHackathon(hackathon)}
                    >
                      {/* Left border accent gradient line */}
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-l-3xl" />

                      <div className="relative w-full sm:w-40 h-32 shrink-0 rounded-2xl overflow-hidden shadow-sm border border-slate-200/80">
                        <img src={hackathon.banner} alt={hackathon.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-white/90 text-slate-800 backdrop-blur-md">
                          {hackathon.mode}
                        </span>
                      </div>

                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-lg bg-emerald-100/80 text-emerald-800 border border-emerald-200">
                            Registered
                          </span>
                          <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-lg bg-amber-100/80 text-amber-800 border border-amber-200 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-600" /> {daysLeft}
                          </span>
                          <span className="text-[11px] font-bold text-slate-500 bg-white/80 px-2.5 py-0.5 rounded-lg border border-slate-200 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-indigo-500" /> {new Date(hackathon.startDate).toLocaleDateString()} - {new Date(hackathon.endDate).toLocaleDateString()}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-lg font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{hackathon.title}</h3>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-1 font-medium">{hackathon.tagline}</p>
                        </div>

                        {/* Domain / Tech Tracks */}
                        <div className="flex flex-wrap items-center gap-2 pt-0.5">
                          <span className="font-extrabold text-slate-400 text-[10px] uppercase tracking-wider">Tracks:</span>
                          {hackathon.tracks.map((t, idx) => (
                            <span key={idx} className="font-bold text-indigo-700 bg-indigo-100/70 px-2.5 py-0.5 rounded-lg border border-indigo-200/60 text-[11px]">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center justify-end sm:justify-center">
                        <div className="p-3.5 rounded-2xl bg-indigo-600 text-white group-hover:bg-violet-600 group-hover:scale-105 transition-all shadow-md">
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl p-10 border-2 border-dashed border-slate-200 text-center shadow-xs">
                <Trophy className="w-14 h-14 text-indigo-300 mx-auto mb-4" />
                <h3 className="text-lg font-extrabold text-slate-900 mb-2">No active hackathons</h3>
                <p className="text-slate-500 text-xs sm:text-sm mb-6 max-w-sm mx-auto font-medium">You haven't registered for any hackathons yet. Find high-impact challenges and start building!</p>
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Recommendations */}
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-100 border border-amber-200 text-amber-600 shadow-2xs">
                <Zap className="w-5 h-5 fill-amber-400 text-amber-600" />
              </div>
              Recommended For You
            </h2>
            
            <div className="grid gap-5">
              {recommendedHackathons.map(hackathon => (
                <motion.div 
                  whileHover={{ y: -3 }}
                  key={hackathon.id} 
                  className="bg-gradient-to-b from-white via-indigo-50/30 to-purple-50/20 rounded-3xl border-2 border-indigo-100 overflow-hidden shadow-md hover:shadow-xl hover:border-indigo-300 transition-all group"
                >
                  <div className="h-36 overflow-hidden relative">
                    <img src={hackathon.banner} alt={hackathon.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />
                    <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/90 text-indigo-700 backdrop-blur-md shadow-xs">
                      {hackathon.mode}
                    </div>
                    <div className="absolute bottom-3 left-4 text-white right-4">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 mb-0.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Featured Competition
                      </div>
                      <h3 className="font-extrabold text-sm sm:text-base leading-tight text-white line-clamp-1">{hackathon.title}</h3>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="flex flex-wrap gap-1.5">
                      {hackathon.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2.5 py-0.5 rounded-lg bg-indigo-100/70 text-indigo-800 text-[11px] font-bold border border-indigo-200/60">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <button 
                      onClick={() => onViewHackathon(hackathon)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-extrabold text-xs hover:from-indigo-700 hover:to-violet-700 transition-all shadow-sm flex items-center justify-center gap-2 group/btn"
                    >
                      <span>Explore Challenge</span>
                      <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

      </div>
    </div>
  );
};

