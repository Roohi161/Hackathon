import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Users, Clock, Zap, MapPin, Award, X, CheckCircle2, Filter } from 'lucide-react';

const allHackathons = [
  {
    id: 1,
    title: 'AI Innovation Challenge 2026',
    organizer: 'TechCorp AI',
    organizerInitials: 'TC',
    category: 'AI & ML',
    status: 'Live',
    statusColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    mode: 'Hybrid',
    imageGradient: 'from-emerald-500/80 to-teal-700/80',
    tags: ['Python', 'TensorFlow', 'React'],
    prize: '$50K',
    participants: 1240,
    teams: 312,
    timeLeft: '2 Days Left',
    difficulty: 'Advanced',
    difficultyColor: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
  },
  {
    id: 2,
    title: 'Green Tech Hackathon',
    organizer: 'EcoSystems Inc.',
    organizerInitials: 'ES',
    category: 'Green Tech',
    status: 'Upcoming',
    statusColor: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    mode: 'Online',
    imageGradient: 'from-blue-500/80 to-indigo-700/80',
    tags: ['IoT', 'Node.js', 'Vue'],
    prize: '$25K',
    participants: 850,
    teams: 215,
    timeLeft: 'In 5 Days',
    difficulty: 'Intermediate',
    difficultyColor: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  },
  {
    id: 3,
    title: 'Web3 Builder Sprint',
    organizer: 'CryptoNet',
    organizerInitials: 'CN',
    category: 'Web3',
    status: 'Closing Soon',
    statusColor: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    mode: 'Online',
    imageGradient: 'from-purple-500/80 to-fuchsia-700/80',
    tags: ['Solidity', 'Next.js', 'Rust'],
    prize: '$100K',
    participants: 2100,
    teams: 540,
    timeLeft: '12 Hours Left',
    difficulty: 'Advanced',
    difficultyColor: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
  },
  {
    id: 4,
    title: 'Cloud Native Hack',
    organizer: 'CloudFoundry',
    organizerInitials: 'CF',
    category: 'Cloud Native',
    status: 'Live',
    statusColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    mode: 'Hybrid',
    imageGradient: 'from-cyan-500/80 to-blue-700/80',
    tags: ['Kubernetes', 'Go', 'Docker'],
    prize: '$30K',
    participants: 920,
    teams: 230,
    timeLeft: '4 Days Left',
    difficulty: 'Intermediate',
    difficultyColor: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  },
  {
    id: 5,
    title: 'FinTech Disrupt 2026',
    organizer: 'GlobalBank',
    organizerInitials: 'GB',
    category: 'FinTech',
    status: 'Upcoming',
    statusColor: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    mode: 'Hybrid',
    imageGradient: 'from-rose-500/80 to-orange-700/80',
    tags: ['Java', 'Spring', 'Angular'],
    prize: '$75K',
    participants: 1500,
    teams: 380,
    timeLeft: 'In 2 Weeks',
    difficulty: 'Beginner',
    difficultyColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

export const FeaturedHackathons = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [registeringHackathon, setRegisteringHackathon] = useState<typeof allHackathons[0] | null>(null);
  const [registrationSubmitted, setRegistrationSubmitted] = useState(false);
  const [teamName, setTeamName] = useState('');

  const categories = ['All', 'AI & ML', 'Web3', 'Green Tech', 'Cloud Native', 'FinTech'];

  const filteredHackathons = selectedCategory === 'All'
    ? allHackathons
    : allHackathons.filter(h => h.category === selectedCategory);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName) return;
    setRegistrationSubmitted(true);
  };

  return (
    <section id="hackathons-section" className="py-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-indigo-100/60 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto px-6 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-sm font-medium text-indigo-700 mb-6"
            >
              <Zap className="w-4 h-4 text-indigo-600" />
              <span>Featured Competitions</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl font-extrabold mb-4 text-slate-900 tracking-tight"
            >
              Trending <span className="gradient-text">Hackathons</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-slate-500 mb-6"
            >
              Discover the most exciting competitions happening right now. Join a team, build something amazing, and win big.
            </motion.p>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 mr-1" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="w-full px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="flex overflow-x-auto gap-6 pb-8 pt-4 snap-x snap-mandatory hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {filteredHackathons.map((hackathon) => (
            <motion.div
              key={hackathon.id}
              variants={cardVariants}
              className="min-w-[340px] md:min-w-[400px] w-[340px] md:w-[400px] snap-start shrink-0 glass-card rounded-2xl overflow-hidden group hover:-translate-y-2 transition-all duration-300 border border-slate-200 bg-white/90 shadow-lg"
            >
              {/* Card Header */}
              <div className={`h-40 relative bg-gradient-to-br ${hackathon.imageGradient} p-6 flex flex-col justify-between`}>
                <div className="flex justify-between items-start">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${hackathon.statusColor}`}>
                    {hackathon.status}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/30 backdrop-blur-md border border-white/10 text-white flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {hackathon.mode}
                  </span>
                </div>

                {/* Organizer */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-white border border-white/30 shadow-lg">
                    {hackathon.organizerInitials}
                  </div>
                  <span className="font-medium text-white shadow-sm drop-shadow-md">
                    {hackathon.organizer}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4 line-clamp-1 text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {hackathon.title}
                </h3>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {hackathon.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs font-medium text-slate-600">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    <div>
                      <div className="text-xs text-slate-400">Prize Pool</div>
                      <div className="font-bold text-slate-800">{hackathon.prize}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-500" />
                    <div>
                      <div className="text-xs text-slate-400">Participants</div>
                      <div className="font-bold text-slate-800">{hackathon.participants}</div>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100 mb-6" />

                {/* Footer */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-indigo-500" />
                    <span className="text-slate-600 font-medium">{hackathon.timeLeft}</span>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded border ${hackathon.difficultyColor}`}>
                    {hackathon.difficulty}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setRegisteringHackathon(hackathon);
                    setRegistrationSubmitted(false);
                    setTeamName('');
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-bold hover:shadow-lg hover:shadow-indigo-500/25 transition-all active:scale-[0.98]"
                >
                  Register Now
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* QUICK REGISTRATION MODAL */}
      <AnimatePresence>
        {registeringHackathon && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs font-semibold text-indigo-600">Quick Event Registration</div>
                  <h3 className="font-extrabold text-slate-900 text-lg">{registeringHackathon.title}</h3>
                </div>
                <button onClick={() => setRegisteringHackathon(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {registrationSubmitted ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-base">Registration Confirmed!</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Team <span className="font-bold text-slate-800">"{teamName}"</span> has successfully joined {registeringHackathon.title}.
                  </p>
                  <button
                    onClick={() => setRegisteringHackathon(null)}
                    className="w-full mt-4 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-md"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Team Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CyberBuilders"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Selected Track</label>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800">
                      {registeringHackathon.category} • Prize: {registeringHackathon.prize}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setRegisteringHackathon(null)}
                      className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold shadow-md"
                    >
                      Confirm Registration
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
