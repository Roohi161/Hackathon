import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Users, Clock, Zap, MapPin, Award } from 'lucide-react';

const hackathons = [
  {
    id: 1,
    title: 'AI Innovation Challenge 2026',
    organizer: 'TechCorp AI',
    organizerInitials: 'TC',
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
    title: 'FinTech Disrupt',
    organizer: 'GlobalBank',
    organizerInitials: 'GB',
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
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      
      <div className="container mx-auto px-6 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-gray-300 mb-6"
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Featured Events</span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl font-extrabold mb-4"
            >
              Trending <span className="gradient-text">Hackathons</span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-gray-400"
            >
              Discover the most exciting competitions happening right now. Join a team, build something amazing, and win big.
            </motion.p>
          </div>
          
          <motion.button
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="hidden md:flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors shrink-0 font-medium"
          >
            View All Hackathons
          </motion.button>
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
          {hackathons.map((hackathon) => (
            <motion.div 
              key={hackathon.id}
              variants={cardVariants}
              className="min-w-[340px] md:min-w-[400px] w-[340px] md:w-[400px] snap-start shrink-0 glass-card rounded-2xl overflow-hidden group hover:-translate-y-2 transition-all duration-300 border border-white/[0.08]"
            >
              {/* Card Header / Image Placeholder */}
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
                <h3 className="text-xl font-bold mb-4 line-clamp-1 group-hover:text-cyan-400 transition-colors">
                  {hackathon.title}
                </h3>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {hackathon.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-xs font-medium text-gray-300">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="text-xs text-gray-500">Prize Pool</div>
                      <div className="font-bold text-white">{hackathon.prize}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-400" />
                    <div>
                      <div className="text-xs text-gray-500">Participants</div>
                      <div className="font-bold text-white">{hackathon.participants}</div>
                    </div>
                  </div>
                </div>

                <hr className="border-white/10 mb-6" />

                {/* Footer */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span className="text-gray-300 font-medium">{hackathon.timeLeft}</span>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded border ${hackathon.difficultyColor}`}>
                    {hackathon.difficulty}
                  </span>
                </div>

                <button className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-bold hover:shadow-lg hover:shadow-indigo-500/25 transition-all active:scale-[0.98]">
                  Register Now
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Mobile view all button */}
      <div className="mt-8 px-6 md:hidden">
        <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium">
          View All Hackathons
        </button>
      </div>
    </section>
  );
};
