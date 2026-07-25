import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { 
  Users, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight
} from 'lucide-react';

export interface WorkspaceCardsProps {
  onLogin: (
    role: 'participant' | 'organizer' | 'judge', 
    user: { name: string; email: string; avatar: string }
  ) => void;
}

type Role = 'participant' | 'organizer' | 'judge';

interface CardData {
  id: Role;
  theme: string;
  themeGradient: string;
  themeBorder: string;
  themeButton: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  defaultEmail: string;
  defaultPass: string;
  name: string;
  avatar: string;
  accountType: string;
}

const cardData: CardData[] = [
  {
    id: 'participant',
    theme: 'blue',
    themeGradient: 'from-blue-500 to-cyan-500',
    themeBorder: 'border-blue-500/20',
    themeButton: 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500',
    icon: <Users className="w-6 h-6 text-blue-400" />,
    title: 'Participant Portal',
    description: 'Join hackathons, build projects, collaborate with teams, and compete for prizes.',
    features: [
      'Discover & Join Hackathons',
      'Build & Manage Teams',
      'Submit Projects & Code',
      'Track Rankings & Scores'
    ],
    defaultEmail: 'ansar@hackathoncentral.io',
    defaultPass: 'participant2026',
    name: 'Shaik Ansar Ali',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    accountType: 'Participant Account'
  },
  {
    id: 'organizer',
    theme: 'purple',
    themeGradient: 'from-purple-500 to-fuchsia-500',
    themeBorder: 'border-purple-500/20',
    themeButton: 'bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500',
    icon: <ShieldCheck className="w-6 h-6 text-purple-400" />,
    title: 'Organizer Hub',
    description: 'Create hackathons, manage participants, configure rubrics, and track analytics.',
    features: [
      'Create & Publish Hackathons',
      'Manage Registrations',
      'Broadcast Announcements',
      'Analytics Dashboard'
    ],
    defaultEmail: 'bhavya@hackathoncentral.io',
    defaultPass: 'organizer2026',
    name: 'KVS Bhavya Sri',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    accountType: 'Organizer Account'
  },
  {
    id: 'judge',
    theme: 'amber',
    themeGradient: 'from-amber-500 to-orange-500',
    themeBorder: 'border-amber-500/20',
    themeButton: 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500',
    icon: <Award className="w-6 h-6 text-amber-400" />,
    title: 'Judge Console',
    description: 'Evaluate submissions, score rubrics, provide feedback, and rank projects.',
    features: [
      'Review Submissions',
      'Score with Rubrics',
      'Provide Expert Feedback',
      'Finalize Rankings'
    ],
    defaultEmail: 'rohan@hackathoncentral.io',
    defaultPass: 'judge2026',
    name: 'M Rohan Yaswanth',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    accountType: 'Judge Account'
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const WorkspaceCard = ({ data, onLogin }: { data: CardData, onLogin: WorkspaceCardsProps['onLogin'] }) => {
  const [email, setEmail] = useState(data.defaultEmail);
  const [password, setPassword] = useState(data.defaultPass);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(data.id, {
      name: data.name,
      email: data.defaultEmail,
      avatar: data.avatar
    });
  };

  return (
    <motion.div 
      variants={itemVariants}
      className={`glass-panel overflow-hidden rounded-[24px] border ${data.themeBorder} flex flex-col relative group transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl hover:shadow-${data.theme}-500/20`}
    >
      {/* Top Gradient Strip */}
      <div className={`h-1 w-full bg-gradient-to-r ${data.themeGradient}`} />
      
      <div className="p-8 flex flex-col flex-1">
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-${data.theme}-500/10 border border-${data.theme}-500/20`}>
            {data.icon}
          </div>
          <h3 className="text-xl font-bold text-white">{data.title}</h3>
        </div>
        
        <p className="text-gray-400 text-sm mb-6 flex-1 min-h-[40px]">
          {data.description}
        </p>

        <ul className="space-y-3 mb-8">
          {data.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
              <CheckCircle2 className={`w-4 h-4 mt-0.5 text-${data.theme}-400 shrink-0`} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="h-px w-full bg-white/[0.08] mb-8" />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl px-10 py-2.5 text-sm text-white focus:outline-none focus:border-white/20 transition-colors"
              placeholder="Email address"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl px-10 py-2.5 text-sm text-white focus:outline-none focus:border-white/20 transition-colors"
              placeholder="Password"
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400 px-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-gray-600 bg-transparent text-indigo-500 focus:ring-0 focus:ring-offset-0" />
              <span>Remember me</span>
            </label>
            <a href="#" className="hover:text-white transition-colors">Forgot password?</a>
          </div>

          <button 
            type="submit"
            className={`w-full py-3 px-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 shadow-lg transition-all ${data.themeButton}`}
          >
            Continue as {data.title.split(' ')[0]}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-4">
          <p className="text-xs text-gray-500">Or continue with</p>
          <div className="flex gap-3 w-full">
            <button type="button" className="flex-1 py-2 rounded-xl bg-white/[0.03] border border-white/[0.1] hover:bg-white/[0.08] transition-colors flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </button>
            <button type="button" className="flex-1 py-2 rounded-xl bg-white/[0.03] border border-white/[0.1] hover:bg-white/[0.08] transition-colors flex items-center justify-center">
              <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </button>
          </div>
          <p className="text-[10px] text-gray-600 mt-2">Demo credentials pre-filled for testing</p>
        </div>

        {/* User Preview */}
        <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center gap-3">
          <img 
            src={data.avatar} 
            alt={data.name} 
            className="w-10 h-10 rounded-full object-cover border border-white/20"
          />
          <div>
            <div className="text-sm font-medium text-white">{data.name}</div>
            <div className={`text-xs text-${data.theme}-400`}>{data.accountType}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const WorkspaceCards: React.FC<WorkspaceCardsProps> = ({ onLogin }) => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-gray-300 mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            Role-Based Access
          </div>
          
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Choose Your <span className="gradient-text">Workspace</span>
          </h2>
          
          <p className="text-lg text-gray-400">
            Select your role to access a personalized dashboard tailored to your needs.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {cardData.map((data) => (
            <WorkspaceCard key={data.id} data={data} onLogin={onLogin} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};
