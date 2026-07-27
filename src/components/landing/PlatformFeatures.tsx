import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { MessageSquare, BarChart3, Trophy, Calendar, Shield, Globe, ArrowRight, Zap, X, CheckCircle2 } from 'lucide-react';

interface FeatureDetail {
  title: string;
  description: string;
  details: string[];
  icon: any;
  accent: string;
  iconColor: string;
  iconBg: string;
  borderColor: string;
  shadowColor: string;
}

const features: FeatureDetail[] = [
  {
    title: 'Real-time Collaboration',
    description: 'Built-in team chat, code sharing, and project boards for seamless teamwork.',
    details: [
      'Instant team chat channels per project',
      'Real-time markdown & code snippet sharing',
      'Kanban task boards & milestone tracking',
      'Integrated GitHub & GitLab webhook sync',
      'Voice and video huddle rooms for quick syncs',
      'Collaborative whiteboard for brainstorming',
      'Threaded discussions and @mentions',
      'Customizable notification preferences',
      'File sharing with built-in previewers',
      'Role-based access control for team members'
    ],
    icon: MessageSquare,
    accent: 'bg-indigo-500',
    iconColor: 'text-indigo-600',
    iconBg: 'bg-indigo-50 border-indigo-200',
    borderColor: 'group-hover:border-indigo-300',
    shadowColor: 'group-hover:shadow-indigo-100',
  },
  {
    title: 'Smart Evaluation',
    description: 'AI-powered rubric scoring, detailed analytics, and fair judging workflows.',
    details: [
      'Multi-dimensional weighted rubric templates',
      'Blind evaluation mode to reduce scoring bias',
      'Automatic score aggregation & consensus analytics',
      'Code quality & repository activity metrics',
      'AI-assisted project summarization for judges',
      'Customizable judging criteria per track',
      'Conflict of interest detection algorithm',
      'Real-time judging progress dashboard',
      'Automated feedback generation for participants',
      'Historical judging data and trend analysis'
    ],
    icon: BarChart3,
    accent: 'bg-purple-500',
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-50 border-purple-200',
    borderColor: 'group-hover:border-purple-300',
    shadowColor: 'group-hover:shadow-purple-100',
  },
  {
    title: 'Live Leaderboards',
    description: 'Dynamic rankings updated in real-time with filtering by category and track.',
    details: [
      'Real-time websocket leaderboard updates',
      'Filter rankings by track, tech stack, or team size',
      'Public & private leaderboards per competition',
      'Exportable CSV & JSON scoring audit trails',
      'Gamified achievement badges and streaks',
      'Historical performance graphs per team',
      'Interactive visual data breakdowns',
      'Automated tie-breaking resolution logic',
      'Customizable leaderboard theme and styling',
      'API access for embedding on external sites'
    ],
    icon: Trophy,
    accent: 'bg-amber-500',
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-50 border-amber-200',
    borderColor: 'group-hover:border-amber-300',
    shadowColor: 'group-hover:shadow-amber-100',
  },
  {
    title: 'Event Management',
    description: 'Full event lifecycle management from creation to completion with analytics.',
    details: [
      'Drag-and-drop timeline & milestone builder',
      'Custom registration screening forms',
      'Live broadcast announcement system',
      'Automated digital certificate & prize payouts',
      'Sponsor booth and tier management system',
      'Built-in ticketing and RSVP tracking',
      'Dynamic email campaign automation',
      'Post-event feedback collection forms',
      'Comprehensive event budget tracking',
      'Real-time attendee engagement analytics'
    ],
    icon: Calendar,
    accent: 'bg-cyan-500',
    iconColor: 'text-cyan-600',
    iconBg: 'bg-cyan-50 border-cyan-200',
    borderColor: 'group-hover:border-cyan-300',
    shadowColor: 'group-hover:shadow-cyan-100',
  },
  {
    title: 'Secure Submissions',
    description: 'Git integration, code scanning, plagiarism detection, and secure file storage.',
    details: [
      'Direct GitHub, GitLab & Bitbucket repository linking',
      'Automated commit history & originality verification',
      'Loom & YouTube video demo embeds',
      'Encrypted artifact & submission storage',
      'Automated dependency vulnerability scanning',
      'Docker image build and test environments',
      'Continuous Integration (CI) pipeline hooks',
      'Advanced plagiarism detection against public repos',
      'Immutable submission timestamping',
      'Malware and virus scanning on all uploads'
    ],
    icon: Shield,
    accent: 'bg-emerald-500',
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50 border-emerald-200',
    borderColor: 'group-hover:border-emerald-300',
    shadowColor: 'group-hover:shadow-emerald-100',
  },
  {
    title: 'Global Community',
    description: 'Connect with developers worldwide, find mentors, and grow your network.',
    details: [
      'Cross-platform hacker matchmaking engine',
      'Mentor directory with 1-on-1 office hours scheduling',
      'Alumni directory & career opportunities',
      'Global community Discord & Slack integrations',
      'Skill-based endorsement and reputation system',
      'Interactive community forums and Q&A boards',
      'Local chapter and regional meetup discovery',
      'Open-source project contribution tracking',
      'Personalized learning resource recommendations',
      'Verified portfolios with verified hackathon wins'
    ],
    icon: Globe,
    accent: 'bg-rose-500',
    iconColor: 'text-rose-600',
    iconBg: 'bg-rose-50 border-rose-200',
    borderColor: 'group-hover:border-rose-300',
    shadowColor: 'group-hover:shadow-rose-100',
  },
];

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const PlatformFeatures = () => {
  const [activeFeature, setActiveFeature] = useState<FeatureDetail | null>(null);

  return (
    <section className="py-24 relative overflow-hidden bg-white/40">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-100/80 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-100/60 rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/3" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-sm font-semibold text-indigo-700 mb-6"
          >
            <Zap className="w-4 h-4 text-indigo-600" />
            <span>Powerful Platform Suite</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900 tracking-tight"
          >
            Everything You <span className="gradient-text">Need</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-slate-500"
          >
            A comprehensive suite of tools designed for hackathon excellence. Focus on building great products while we handle the rest.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {[...features, ...features, ...features].map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className={`group bg-white/90 backdrop-blur-xl rounded-2xl p-8 border border-slate-200 relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${feature.borderColor}`}
            >
              {/* Colored Top Border Strip */}
              <div className={`absolute top-0 left-0 right-0 h-[3px] ${feature.accent} opacity-70 group-hover:opacity-100 transition-opacity`} />

              <div className="flex flex-col h-full">
                <div className={`w-14 h-14 rounded-2xl ${feature.iconBg} flex items-center justify-center mb-6 border border-slate-200 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                </div>

                <h3 className="text-xl font-bold mb-3 text-slate-900 transition-colors">
                  {feature.title}
                </h3>

                <p className="text-slate-500 text-sm leading-relaxed flex-grow mb-6">
                  {feature.description}
                </p>

                <button
                  type="button"
                  onClick={() => setActiveFeature(feature)}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors self-start"
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* FEATURE DETAILS MODAL */}
      <AnimatePresence>
        {activeFeature && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${activeFeature.iconBg}`}>
                    <activeFeature.icon className={`w-6 h-6 ${activeFeature.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg">{activeFeature.title}</h3>
                    <p className="text-xs text-slate-500">Enterprise Feature Breakdown</p>
                  </div>
                </div>
                <button onClick={() => setActiveFeature(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                {activeFeature.description}
              </p>

              <div className="space-y-2.5 mb-6">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Technical Capabilities</div>
                {activeFeature.details.map((detail, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="font-medium">{detail}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setActiveFeature(null)}
                className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-md hover:bg-indigo-700 transition-colors"
              >
                Close Details
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
