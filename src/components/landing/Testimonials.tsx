import { motion } from 'framer-motion';
import { Quote, Star, ShieldCheck, Trophy, Users, Globe2, Sparkles } from 'lucide-react';

const communityInsights = [
  {
    quote: "Hackathon Central provided the ultimate competitive experience. Real-time leaderboards, automated code verification, and seamless team collaboration enabled our team to ship our AI agent platform in under 36 hours.",
    roleTitle: 'Global Hackathon Winner',
    category: 'Generative AI & Autonomous Agents Track',
    badge: 'Participant Insight',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    iconBg: 'bg-blue-500/10 text-blue-600',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&h=200&auto=format&fit=crop'
  },
  {
    quote: "Hosting our flagship annual hackathon with 1,000+ developers was effortless. The registration screening, announcement broadcaster, and custom rubric scoring saved our team over 100 hours of coordination.",
    roleTitle: 'Lead Community Organizer',
    category: 'DevOps & Cloud Native Hackathon',
    badge: 'Organizer Insight',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    iconBg: 'bg-purple-500/10 text-purple-600',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop'
  },
  {
    quote: "The evaluation suite is best-in-class. Multi-dimensional rubrics, integrated repository inspection, and blind scoring ensured fair, fast, and transparent evaluation across 150+ project submissions.",
    roleTitle: 'Senior Technical Judge',
    category: 'FinTech & Web3 Innovation Sprint',
    badge: 'Judge Insight',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    iconBg: 'bg-amber-500/10 text-amber-600',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop'
  }
];

const impactStats = [
  { label: 'Global Active Hackers', value: '50,000+', icon: <Users className="w-5 h-5 text-indigo-500" /> },
  { label: 'Platform Satisfaction', value: '99.4%', icon: <Sparkles className="w-5 h-5 text-purple-500" /> },
  { label: 'Total Prizes Awarded', value: '$2.5M+', icon: <Trophy className="w-5 h-5 text-amber-500" /> },
  { label: 'Countries Represented', value: '120+', icon: <Globe2 className="w-5 h-5 text-cyan-500" /> }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export const Testimonials = () => {
  return (
    <section className="py-24 relative z-10 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-50/60 rounded-full blur-[130px] pointer-events-none" />

      <div className="w-full px-6 lg:px-12 xl:px-24 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700 text-sm font-semibold mb-6 backdrop-blur-md shadow-sm">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            Verified Platform Feedback
          </span>
          <h2 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Trusted by the Global <span className="gradient-text">Developer Ecosystem</span>
          </h2>
          <p className="text-xl sm:text-2xl text-slate-500 max-w-2xl mx-auto">
            Discover how participants, organizers, and expert judges leverage Hackathon Central to drive technological breakthroughs.
          </p>
        </motion.div>

        {/* 3 Impact Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {communityInsights.map((insight, index) => (
            <motion.div
              key={index}
              variants={item}
              className="bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-8 rounded-2xl relative flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-indigo-200"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${insight.badgeColor}`}>
                  {insight.badge}
                </span>
              </div>

              <div className="absolute top-8 right-8 text-indigo-100/60 pointer-events-none">
                <Quote size={48} fill="currentColor" />
              </div>

              <p className="text-slate-600 italic text-sm mb-8 flex-grow relative z-10 leading-relaxed">
                "{insight.quote}"
              </p>

              <div className="pt-4 border-t border-slate-100 mt-auto">
                <h4 className="text-slate-900 font-extrabold text-base mb-0.5">{insight.roleTitle}</h4>
                <p className="text-xs font-medium text-slate-500">{insight.category}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Community Trust Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-6 md:p-8 shadow-lg shadow-indigo-100/30"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {impactStats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center p-2">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 mb-3">
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
