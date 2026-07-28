import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { UserPlus, Users, Upload, Trophy, Sparkles } from 'lucide-react';

const steps = [
  {
    id: '01',
    title: 'Register & Setup',
    description: 'Create your account, set up your profile, and browse available hackathons to find your perfect match.',
    icon: UserPlus,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    gradient: 'from-blue-500 to-cyan-400',
    shadowColor: 'shadow-blue-500/30'
  },
  {
    id: '02',
    title: 'Build Your Team',
    description: 'Find like-minded developers, form your dream team, and start collaborating on innovative ideas.',
    icon: Users,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    gradient: 'from-purple-500 to-pink-500',
    shadowColor: 'shadow-purple-500/30'
  },
  {
    id: '03',
    title: 'Submit Project',
    description: 'Build your solution, push your code, create a demo, and submit before the deadline.',
    icon: Upload,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
    gradient: 'from-emerald-500 to-teal-400',
    shadowColor: 'shadow-emerald-500/30'
  },
  {
    id: '04',
    title: 'Win Rewards',
    description: 'Get evaluated by expert judges, climb the leaderboard, and win amazing prizes and recognition.',
    icon: Trophy,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
    gradient: 'from-amber-500 to-orange-400',
    shadowColor: 'shadow-amber-500/30'
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
  show: { opacity: 1, y: 0, transition: { duration: 0.6, type: "spring", bounce: 0.4 } },
};

export const HowItWorks = () => {
  return (
    <section className="py-32 relative z-10 overflow-hidden bg-white">
      {/* Dynamic Background Elements */}
      <div className="absolute top-40 left-[-10%] w-[500px] h-[500px] bg-indigo-50/50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-cyan-50/50 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full px-6 lg:px-12 xl:px-24 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-28">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100/50 text-sm font-semibold text-indigo-700 mb-6 shadow-sm shadow-indigo-100"
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Streamlined Experience</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-6xl font-black mb-6 text-slate-900 tracking-tight"
          >
            How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">Works</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-500 font-medium"
          >
            From idea to deployment in four simple steps. We handle the logistics so you can focus on building something incredible.
          </motion.p>
        </div>

        <div className="relative">
          {/* Animated Connecting Line */}
          <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-1 bg-slate-100 rounded-full -z-10 overflow-hidden">
             <motion.div 
               initial={{ x: "-100%" }}
               whileInView={{ x: "100%" }}
               viewport={{ once: true }}
               transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
               className="w-full h-full bg-gradient-to-r from-transparent via-indigo-400 to-transparent"
             />
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8"
          >
            {steps.map((step, index) => (
              <motion.div 
                key={step.id} 
                variants={itemVariants}
                className="relative flex flex-col items-center text-center group"
              >
                {/* Massive Animated Number Background */}
                <div className="absolute -top-12 md:-top-16 text-[140px] font-black text-transparent bg-clip-text bg-gradient-to-b from-slate-100 to-transparent -z-20 select-none pointer-events-none transition-all duration-700 group-hover:-translate-y-4 group-hover:from-slate-200">
                  {step.id}
                </div>

                {/* Glowing Icon Container */}
                <div className="relative mb-10 mt-6">
                  {/* Outer glow ring */}
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-tr ${step.gradient} opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-700`} />
                  
                  {/* Main Circle */}
                  <div className={`w-24 h-24 rounded-full bg-white border-2 border-slate-100 group-hover:border-transparent flex items-center justify-center relative z-10 transition-all duration-500 group-hover:scale-110 shadow-xl shadow-slate-200/50 group-hover:${step.shadowColor}`}>
                    
                    {/* Inner Gradient background on hover */}
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-tr ${step.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    
                    <step.icon className={`w-10 h-10 ${step.color} transition-transform duration-500 group-hover:scale-110`} strokeWidth={2} />
                    
                    {/* Floating Step Badge */}
                    <div className={`absolute -bottom-3 -right-3 w-10 h-10 rounded-full bg-gradient-to-tr ${step.gradient} p-[2px] shadow-lg ${step.shadowColor} transition-transform duration-500 group-hover:scale-110`}>
                      <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-sm font-black text-slate-800">
                        {index + 1}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl w-full flex-1 border border-slate-100 hover:border-slate-200 transition-all duration-500 shadow-[0_8px_30px_rgb(0,0,0,0.04)] group-hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] group-hover:-translate-y-2 relative z-10 overflow-hidden">
                  {/* Top edge gradient highlight */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${step.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  <h3 className="text-2xl font-bold mb-4 text-slate-800 group-hover:text-slate-900 transition-colors">{step.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">
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
