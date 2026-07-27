import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { UserPlus, Users, Upload, Trophy, Sparkles } from 'lucide-react';

const steps = [
  {
    id: '01',
    title: 'Register & Setup',
    description: 'Create your account, set up your profile, and browse available hackathons to find your perfect match.',
    icon: UserPlus,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    borderColor: 'border-blue-400/20',
  },
  {
    id: '02',
    title: 'Build Your Team',
    description: 'Find like-minded developers, form your dream team, and start collaborating on innovative ideas.',
    icon: Users,
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    borderColor: 'border-purple-400/20',
  },
  {
    id: '03',
    title: 'Submit Project',
    description: 'Build your solution, push your code, create a demo, and submit before the deadline.',
    icon: Upload,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-400/10',
    borderColor: 'border-cyan-400/20',
  },
  {
    id: '04',
    title: 'Win Rewards',
    description: 'Get evaluated by expert judges, climb the leaderboard, and win amazing prizes and recognition.',
    icon: Trophy,
    color: 'text-amber-400',
    bgColor: 'bg-amber-400/10',
    borderColor: 'border-amber-400/20',
  },
];

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export const HowItWorks = () => {
  return (
    <section className="py-24 relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 text-sm font-medium text-purple-700 mb-6"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Simple Process</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900"
          >
            How It <span className="gradient-text">Works</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-slate-500"
          >
            Get started in four simple steps and start building amazing projects. Our platform makes the entire hackathon journey seamless.
          </motion.p>
        </div>

        <div className="relative">
          {/* Connecting Line - hidden on mobile */}
          <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-[2px] border-t-2 border-dashed border-slate-200 -z-10" />

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6"
          >
            {steps.map((step, index) => (
              <motion.div 
                key={step.id} 
                variants={itemVariants}
                className="relative flex flex-col items-center text-center group"
              >
                {/* Step Number */}
                <div className="absolute -top-10 -right-4 text-[120px] font-extrabold text-slate-200 -z-20 select-none pointer-events-none transition-all duration-500">
                  {step.id}
                </div>

                {/* Icon Circle */}
                <div className={`w-24 h-24 rounded-full ${step.bgColor} border ${step.borderColor} flex items-center justify-center mb-8 relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[color:var(--tw-shadow-color)]`} style={{ '--tw-shadow-color': 'rgba(0,0,0,0.05)' } as any}>
                  <div className="absolute inset-0 rounded-full bg-white/50 backdrop-blur-sm -z-10" />
                  <step.icon className={`w-10 h-10 ${step.color}`} strokeWidth={1.5} />
                  
                  {/* Number Badge */}
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-sm font-bold shadow-xl text-slate-700">
                    {index + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="glass-panel p-6 rounded-2xl w-full flex-1 border border-slate-200 hover:border-slate-300 transition-colors relative z-10">
                  <h3 className="text-xl font-bold mb-3 text-slate-800">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
