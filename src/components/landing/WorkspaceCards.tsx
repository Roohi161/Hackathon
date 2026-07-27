import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  Users,
  ShieldCheck,
  Award,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Lock
} from 'lucide-react';

export interface WorkspaceCardsProps {
  onLogin: (
    role: 'participant' | 'organizer' | 'judge' | 'admin',
    user: { name: string; email: string; avatar: string }
  ) => void;
}

type Role = 'participant' | 'organizer' | 'judge' | 'admin';

interface CardData {
  id: Role;
  theme: string;
  themeGradient: string;
  themeBorder: string;
  themeButton: string;
  badgeBg: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  stats: { label: string; value: string }[];
  defaultUser: {
    name: string;
    email: string;
    avatar: string;
  };
}

const cardData: CardData[] = [
  {
    id: 'participant',
    theme: 'blue',
    themeGradient: 'from-blue-500 via-cyan-500 to-indigo-500',
    themeBorder: 'border-blue-200/80 hover:border-blue-400',
    themeButton: 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-blue-500/25',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: <Users className="w-6 h-6 text-blue-600" />,
    title: 'Participant Portal',
    subtitle: 'For Hackers & Builders',
    description: 'Discover competitive hackathons, form high-performing teams, build cutting-edge solutions, and showcase your project to global judges.',
    features: [
      'Discover & Join Global Hackathons',
      'AI Team Matchmaking & Chat',
      'Git Integration & Submissions',
      'Live Leaderboards & Ranking'
    ],
    stats: [
      { label: 'Active Teams', value: '12,500+' },
      { label: 'Submissions', value: '45,000+' }
    ],
    defaultUser: {
      name: 'Participant Lead',
      email: 'participant@hackathoncentral.io',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    }
  },
  {
    id: 'organizer',
    theme: 'purple',
    themeGradient: 'from-purple-500 via-indigo-500 to-fuchsia-500',
    themeBorder: 'border-purple-200/80 hover:border-purple-400',
    themeButton: 'bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 shadow-purple-500/25',
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: <ShieldCheck className="w-6 h-6 text-purple-600" />,
    title: 'Organizer Hub',
    subtitle: 'For Event Hosts',
    description: 'End-to-end hackathon management suite. Design custom timelines, configure judging rubrics, manage participants, and broadcast live updates.',
    features: [
      'No-Code Event Creation Wizard',
      'Screening & Participant Approvals',
      'Custom Judging Rubric Designer',
      'Live Announcement Broadcaster'
    ],
    stats: [
      { label: 'Events Hosted', value: '500+' },
      { label: 'Prizes Awarded', value: '$2M+' }
    ],
    defaultUser: {
      name: 'Event Organizer',
      email: 'organizer@hackathoncentral.io',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'
    }
  },
  {
    id: 'judge',
    theme: 'amber',
    themeGradient: 'from-amber-500 via-orange-500 to-yellow-500',
    themeBorder: 'border-amber-200/80 hover:border-amber-400',
    themeButton: 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-500/25',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: <Award className="w-6 h-6 text-amber-600" />,
    title: 'Judge Console',
    subtitle: 'For Industry Experts',
    description: 'Evaluate submissions with precision using multi-dimensional scorecards, review code repos and demo videos, and finalize fair rankings.',
    features: [
      'Multi-Criteria Rubric Scoring',
      'Integrated Code & Video Inspector',
      'Blind & Fair Judging Workflow',
      'Automated Winner Consensus'
    ],
    stats: [
      { label: 'Expert Judges', value: '1,200+' },
      { label: 'Evaluation Rate', value: '98.9%' }
    ],
    defaultUser: {
      name: 'Technical Judge',
      email: 'judge@hackathoncentral.io',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
    }
  },
  {
    id: 'admin',
    theme: 'emerald',
    themeGradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    themeBorder: 'border-emerald-200/80 hover:border-emerald-400',
    themeButton: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/25',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: <Lock className="w-6 h-6 text-emerald-600" />,
    title: 'Admin Console',
    subtitle: 'For System Directors',
    description: 'Complete platform control. Appoint expert judges, verify organizer applications, manage user security, and curate homepage featured events.',
    features: [
      'Appoint & Assign Expert Judges',
      'Add & Verify Hackathon Organizers',
      'Featured Events & Carousel Control',
      'Global Security & System Analytics'
    ],
    stats: [
      { label: 'System Uptime', value: '99.99%' },
      { label: 'Verification Rate', value: '100%' }
    ],
    defaultUser: {
      name: 'Platform Administrator',
      email: 'admin@hackathoncentral.io',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
    }
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export const WorkspaceCards: React.FC<WorkspaceCardsProps> = ({ onLogin }) => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gradient-to-tr from-indigo-100/50 via-purple-100/40 to-blue-100/50 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-sm font-semibold text-indigo-700 mb-6 backdrop-blur-md shadow-sm">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Tailored Platform Experience
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Select Your <span className="gradient-text">Workspace</span>
          </h2>

          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Choose your role to access dedicated tools tailored specifically for hackers, event organizers, expert judges, and platform administrators.
          </p>
        </motion.div>

        {/* 4 Workspace Cards Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {cardData.map((card) => (
            <motion.div
              key={card.id}
              variants={itemVariants}
              className={`bg-white/90 backdrop-blur-xl rounded-[24px] border ${card.themeBorder} flex flex-col relative group transition-all duration-300 hover:-translate-y-2 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-100/80 overflow-hidden`}
            >
              {/* Top Decorative Gradient Strip */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${card.themeGradient}`} />

              <div className="p-6 flex flex-col flex-1">
                {/* Header Badge & Icon */}
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-50 border border-slate-200/80 shadow-sm p-2.5`}>
                    {card.icon}
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${card.badgeBg}`}>
                    {card.subtitle}
                  </span>
                </div>

                {/* Card Title & Description */}
                <h3 className="text-xl font-extrabold text-slate-900 mb-2.5 tracking-tight">
                  {card.title}
                </h3>
                <p className="text-slate-500 text-xs mb-5 leading-relaxed flex-1">
                  {card.description}
                </p>

                {/* Stats Highlights */}
                <div className="grid grid-cols-2 gap-2 mb-5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  {card.stats.map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className="text-base font-extrabold text-slate-900">{stat.value}</div>
                      <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Feature Checklist */}
                <div className="mb-6">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">Included Capabilities</p>
                  <ul className="space-y-2">
                    {card.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-emerald-500 shrink-0" />
                        <span className="font-medium leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action CTA Button */}
                <button
                  type="button"
                  onClick={() => onLogin(card.id, card.defaultUser)}
                  className={`w-full py-3 px-4 rounded-xl text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all duration-300 hover:scale-[1.02] ${card.themeButton}`}
                >
                  <span>Enter {card.title.split(' ')[0]} Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
