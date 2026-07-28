import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar, ArrowRight, Zap, Clock } from 'lucide-react';
import type { Hackathon, AuthenticatedUser } from '../../types';

interface ParticipantDashboardProps {
  user: AuthenticatedUser;
  allHackathons: Hackathon[];
  onViewHackathon: (hackathon: Hackathon) => void;
}

export const ParticipantDashboard: React.FC<ParticipantDashboardProps> = ({ user, allHackathons, onViewHackathon }) => {
  // Registered hackathons for participant
  const myHackathons = allHackathons.slice(0, 3);
  
  // Recommend hackathons based on status (in reality, would use user.skills and hackathon.eligibility)
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Hero Welcome */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 text-slate-900 shadow-xl shadow-slate-200/50 border border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
          <Zap className="w-64 h-64 rotate-12 text-slate-900" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Welcome back, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-slate-500 text-lg mb-8 leading-relaxed">
            Ready to build something amazing? Check out your upcoming hackathons or discover new challenges that match your skills.
          </p>
          
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 inline-block">
            <div className="flex items-center gap-4 mb-3">
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Profile Strength</div>
              <div className="text-lg font-extrabold text-slate-900">{profileScore}%</div>
            </div>
            <div className="w-64 h-2 bg-slate-200 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${profileScore}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
            {profileScore < 100 && (
              <p className="text-xs text-slate-400 mt-3 font-medium">Add more links to reach 100% and unlock premium hackathons.</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: My Hackathons & Activity */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <Trophy className="w-6 h-6 text-indigo-600" /> My Hackathons
              </h2>
            </div>
            
            {myHackathons.length > 0 ? (
              <div className="grid gap-4">
                {myHackathons.map(hackathon => {
                  const diff = new Date(hackathon.endDate).getTime() - new Date().getTime();
                  const daysLeft = diff <= 0 ? 'Event Ended' : `${Math.ceil(diff / (1000 * 60 * 60 * 24))} Days Left`;

                  return (
                    <motion.div 
                      whileHover={{ scale: 1.01 }}
                      key={hackathon.id} 
                      className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center gap-6"
                      onClick={() => onViewHackathon(hackathon)}
                    >
                      <img src={hackathon.banner} alt={hackathon.title} className="w-full sm:w-36 h-28 object-cover rounded-xl shadow-xs" />
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Registered
                          </span>
                          <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-md bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {daysLeft}
                          </span>
                          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {new Date(hackathon.startDate).toLocaleDateString()} - {new Date(hackathon.endDate).toLocaleDateString()}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">{hackathon.title}</h3>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-1 font-medium">{hackathon.tagline}</p>
                        </div>

                        {/* Domain / Tech Tracks */}
                        <div className="flex items-center gap-2 pt-1 text-xs">
                          <span className="font-bold text-slate-400 text-[11px] uppercase tracking-wider">Domain:</span>
                          <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 text-[11px]">
                            {hackathon.tracks.join(' • ')}
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <button className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-xs">
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center shadow-sm">
                <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">No active hackathons</h3>
                <p className="text-slate-500 mb-6 max-w-sm mx-auto">You haven't registered for any hackathons yet. Find one that matches your skills!</p>
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Recommendations */}
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" /> Recommended For You
            </h2>
            <div className="grid gap-4">
              {recommendedHackathons.map(hackathon => (
                <div key={hackathon.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all group">
                  <div className="h-32 overflow-hidden relative">
                    <img src={hackathon.banner} alt={hackathon.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 text-white">
                      <div className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-1">{hackathon.mode}</div>
                      <h3 className="font-bold leading-tight">{hackathon.title}</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {hackathon.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">{tag}</span>
                      ))}
                    </div>
                    <button 
                      onClick={() => onViewHackathon(hackathon)}
                      className="w-full py-2 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-sm hover:bg-indigo-600 hover:text-white transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
