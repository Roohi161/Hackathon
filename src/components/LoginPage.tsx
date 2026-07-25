import { useState } from 'react';
import {
  Terminal,
  Users,
  Award,
  ShieldCheck,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2
} from 'lucide-react';
import type { UserRole } from '../types';

interface LoginUser {
  name: string;
  email: string;
  avatar: string;
}

interface LoginPageProps {
  onLogin: (role: UserRole, user: LoginUser) => void;
}

const LOGIN_PRESETS: Record<'participant' | 'organizer' | 'judge', {
  label: string;
  description: string;
  icon: typeof Users;
  color: string;
  borderColor: string;
  bgAccent: string;
  glowColor: string;
  buttonBg: string;
  demoEmail: string;
  demoPassword: string;
  demoName: string;
  avatar: string;
}> = {
  participant: {
    label: 'Participant',
    description: 'Discover hackathons, register teams, submit projects, and climb the leaderboard.',
    icon: Users,
    color: 'text-indigo-400',
    borderColor: 'border-indigo-500/30',
    bgAccent: 'bg-indigo-500/10',
    glowColor: 'shadow-indigo-500/20',
    buttonBg: 'bg-gradient-to-r from-indigo-600 to-indigo-500',
    demoEmail: 'ansar@hackathoncentral.io',
    demoPassword: 'participant2026',
    demoName: 'Shaik Ansar Ali',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  },
  organizer: {
    label: 'Organizer',
    description: 'Create hackathons, manage participants, configure rubrics, and broadcast announcements.',
    icon: ShieldCheck,
    color: 'text-purple-400',
    borderColor: 'border-purple-500/30',
    bgAccent: 'bg-purple-500/10',
    glowColor: 'shadow-purple-500/20',
    buttonBg: 'bg-gradient-to-r from-purple-600 to-purple-500',
    demoEmail: 'bhavya@hackathoncentral.io',
    demoPassword: 'organizer2026',
    demoName: 'KVS Bhavya Sri',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'
  },
  judge: {
    label: 'Judge',
    description: 'Evaluate submissions, inspect codebases, score rubrics, and provide expert feedback.',
    icon: Award,
    color: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    bgAccent: 'bg-amber-500/10',
    glowColor: 'shadow-amber-500/20',
    buttonBg: 'bg-gradient-to-r from-amber-600 to-amber-500',
    demoEmail: 'rohan@hackathoncentral.io',
    demoPassword: 'judge2026',
    demoName: 'M Rohan Yaswanth',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
  }
};

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<'participant' | 'organizer' | 'judge' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSelectRole = (role: 'participant' | 'organizer' | 'judge') => {
    const preset = LOGIN_PRESETS[role];
    setSelectedRole(role);
    setEmail(preset.demoEmail);
    setPassword(preset.demoPassword);
    setError('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const preset = LOGIN_PRESETS[selectedRole];

    // Validate against demo credentials
    if (email !== preset.demoEmail || password !== preset.demoPassword) {
      setError('Invalid credentials. Use the pre-filled demo credentials to log in.');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate network delay
    setTimeout(() => {
      onLogin(selectedRole, {
        name: preset.demoName,
        email: preset.demoEmail,
        avatar: preset.avatar
      });
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07090e] text-gray-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-indigo-600/8 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-purple-600/8 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Bar */}
      <header className="relative z-10 w-full glass-panel border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl gradient-bg text-white shadow-lg shadow-indigo-500/20">
                <Terminal className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white">
                  Hackathon<span className="gradient-text">Central</span>
                </span>
                <p className="text-[11px] text-gray-400 hidden sm:block">
                  Full-Stack Competition & Evaluation Hub
                </p>
              </div>
            </div>
            <span className="px-3 py-1 text-[10px] font-mono font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              SECURE LOGIN
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl space-y-10">

          {/* Hero Title */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mx-auto">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Welcome to Hackathon Central Platform</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Sign in to your <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
              Choose your role below to access your personalized workspace. Demo credentials are pre-filled for instant access.
            </p>
          </div>

          {/* Role Selection Cards */}
          {!selectedRole ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(Object.entries(LOGIN_PRESETS) as [keyof typeof LOGIN_PRESETS, typeof LOGIN_PRESETS[keyof typeof LOGIN_PRESETS]][] ).map(([key, preset]) => {
                const IconComp = preset.icon;
                return (
                  <button
                    key={key}
                    onClick={() => handleSelectRole(key)}
                    className={`group relative p-6 rounded-2xl glass-panel border ${preset.borderColor} text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${preset.glowColor} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  >
                    {/* Glow accent */}
                    <div className={`absolute inset-0 rounded-2xl ${preset.bgAccent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                    <div className="relative z-10 space-y-4">
                      <div className={`p-3 rounded-xl ${preset.bgAccent} ${preset.color} border ${preset.borderColor} w-fit`}>
                        <IconComp className="w-7 h-7" />
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-indigo-200 transition-colors">
                          {preset.label} Login
                        </h3>
                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                          {preset.description}
                        </p>
                      </div>

                      {/* Demo credentials preview */}
                      <div className="p-3 rounded-xl bg-gray-900/70 border border-white/5 space-y-1.5">
                        <div className="flex items-center gap-2 text-[11px]">
                          <Mail className="w-3 h-3 text-gray-500" />
                          <span className="text-gray-300 font-mono">{preset.demoEmail}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px]">
                          <Lock className="w-3 h-3 text-gray-500" />
                          <span className="text-gray-300 font-mono">••••••••••</span>
                        </div>
                      </div>

                      {/* User preview */}
                      <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                        <img
                          src={preset.avatar}
                          alt={preset.demoName}
                          className="w-9 h-9 rounded-full object-cover border-2 border-white/10"
                        />
                        <div>
                          <span className="text-xs font-semibold text-white block">{preset.demoName}</span>
                          <span className={`text-[10px] font-medium ${preset.color}`}>{preset.label} Account</span>
                        </div>
                      </div>

                      <div className={`flex items-center gap-1.5 ${preset.color} text-xs font-semibold group-hover:translate-x-1 transition-transform`}>
                        <span>Continue as {preset.label}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            /* Login Form */
            <div className="max-w-md mx-auto">
              <div className={`p-8 rounded-3xl glass-panel border ${LOGIN_PRESETS[selectedRole].borderColor} shadow-2xl ${LOGIN_PRESETS[selectedRole].glowColor} space-y-6`}>

                {/* Form Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${LOGIN_PRESETS[selectedRole].bgAccent} ${LOGIN_PRESETS[selectedRole].color} border ${LOGIN_PRESETS[selectedRole].borderColor}`}>
                      {(() => {
                        const IconComp = LOGIN_PRESETS[selectedRole].icon;
                        return <IconComp className="w-6 h-6" />;
                      })()}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{LOGIN_PRESETS[selectedRole].label} Login</h3>
                      <p className="text-xs text-gray-400">Authenticate with your credentials</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedRole(null);
                      setEmail('');
                      setPassword('');
                      setError('');
                    }}
                    className="text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg bg-gray-900 border border-white/10 transition-colors"
                  >
                    ← Switch Role
                  </button>
                </div>

                {/* User Preview */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-900/60 border border-white/5">
                  <img
                    src={LOGIN_PRESETS[selectedRole].avatar}
                    alt={LOGIN_PRESETS[selectedRole].demoName}
                    className={`w-14 h-14 rounded-full object-cover border-2 ${LOGIN_PRESETS[selectedRole].borderColor} shadow-md`}
                  />
                  <div>
                    <span className="text-sm font-bold text-white block">{LOGIN_PRESETS[selectedRole].demoName}</span>
                    <span className={`text-xs font-medium ${LOGIN_PRESETS[selectedRole].color}`}>
                      {LOGIN_PRESETS[selectedRole].label} Dashboard Access
                    </span>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Email Field */}
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(''); }}
                        placeholder="you@hackathoncentral.io"
                        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(''); }}
                        placeholder="Enter your password"
                        className="w-full pl-10 pr-12 py-2.5 text-sm rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 p-1 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Error Alert */}
                  {error && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
                      {error}
                    </div>
                  )}

                  {/* Demo Credentials Hint */}
                  <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/30 text-[11px] text-indigo-300 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>Demo credentials are pre-filled. Click <strong>Sign In</strong> to access the {LOGIN_PRESETS[selectedRole].label} dashboard.</span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 rounded-xl font-bold text-sm text-white ${LOGIN_PRESETS[selectedRole].buttonBg} hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-lg ${LOGIN_PRESETS[selectedRole].glowColor} disabled:opacity-60 disabled:cursor-not-allowed`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Authenticating...</span>
                      </>
                    ) : (
                      <>
                        <ArrowRight className="w-4 h-4" />
                        <span>Sign In as {LOGIN_PRESETS[selectedRole].label}</span>
                      </>
                    )}
                  </button>
                </form>

              </div>
            </div>
          )}

          {/* Footer Credits */}
          <div className="text-center space-y-2">
            <p className="text-[11px] text-gray-500">
              Built by <strong className="text-gray-400">Shaik Ansar Ali</strong>, <strong className="text-gray-400">KVS Bhavya Sri</strong>, <strong className="text-gray-400">M Rohan Yaswanth</strong> & <strong className="text-gray-400">Shaik Roohi</strong>
            </p>
            <p className="text-[10px] text-gray-600">© 2026 Hackathon Central. All rights reserved.</p>
          </div>

        </div>
      </main>
    </div>
  );
};
