import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { MessageSquare, BarChart3, Trophy, Calendar, Shield, Globe, ArrowRight, Zap } from 'lucide-react';

const features = [
  {
    title: 'Real-time Collaboration',
    description: 'Built-in team chat, code sharing, and project boards for seamless teamwork.',
    icon: MessageSquare,
    accent: 'bg-indigo-500',
    iconColor: 'text-indigo-400',
    iconBg: 'bg-indigo-400/10',
    borderColor: 'group-hover:border-indigo-500/50',
    shadowColor: 'group-hover:shadow-indigo-500/20',
  },
  {
    title: 'Smart Evaluation',
    description: 'AI-powered rubric scoring, detailed analytics, and fair judging workflows.',
    icon: BarChart3,
    accent: 'bg-purple-500',
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-400/10',
    borderColor: 'group-hover:border-purple-500/50',
    shadowColor: 'group-hover:shadow-purple-500/20',
  },
  {
    title: 'Live Leaderboards',
    description: 'Dynamic rankings updated in real-time with filtering by category and track.',
    icon: Trophy,
    accent: 'bg-amber-500',
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-400/10',
    borderColor: 'group-hover:border-amber-500/50',
    shadowColor: 'group-hover:shadow-amber-500/20',
  },
  {
    title: 'Event Management',
    description: 'Full event lifecycle management from creation to completion with analytics.',
    icon: Calendar,
    accent: 'bg-cyan-500',
    iconColor: 'text-cyan-400',
    iconBg: 'bg-cyan-400/10',
    borderColor: 'group-hover:border-cyan-500/50',
    shadowColor: 'group-hover:shadow-cyan-500/20',
  },
  {
    title: 'Secure Submissions',
    description: 'Git integration, code scanning, plagiarism detection, and secure file storage.',
    icon: Shield,
    accent: 'bg-emerald-500',
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-400/10',
    borderColor: 'group-hover:border-emerald-500/50',
    shadowColor: 'group-hover:shadow-emerald-500/20',
  },
  {
    title: 'Global Community',
    description: 'Connect with developers worldwide, find mentors, and grow your network.',
    icon: Globe,
    accent: 'bg-rose-500',
    iconColor: 'text-rose-400',
    iconBg: 'bg-rose-400/10',
    borderColor: 'group-hover:border-rose-500/50',
    shadowColor: 'group-hover:shadow-rose-500/20',
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
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-sm font-medium text-indigo-700 mb-6"
          >
            <Zap className="w-4 h-4 text-indigo-400" />
            <span>Powerful Features</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900"
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
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className={`group glass-card rounded-2xl p-8 border border-slate-200 relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${feature.shadowColor} ${feature.borderColor}`}
            >
              {/* Colored Top Border Strip */}
              <div className={`absolute top-0 left-0 right-0 h-[3px] ${feature.accent} opacity-70 group-hover:opacity-100 transition-opacity`} />
              
              <div className="flex flex-col h-full">
                <div className={`w-14 h-14 rounded-2xl ${feature.iconBg} flex items-center justify-center mb-6 border border-slate-200 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                </div>
                
                <h3 className="text-xl font-bold mb-4 text-slate-800 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-slate-500 leading-relaxed flex-grow mb-6">
                  {feature.description}
                </p>
                
                <a href="#" className={`inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-opacity`}>
                  Learn more
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
