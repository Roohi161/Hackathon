import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Mail, Lock, Eye, EyeOff, Users } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { authApi } from '../services/authApi';
import type { UserRole } from '../types';

interface LoginUser {
  name: string;
  email: string;
  avatar: string;
}

interface SignupPageProps {
  onSignup?: (role: UserRole, user: LoginUser) => void;
  onBack?: () => void;
  onSwitchToLogin?: () => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onSignup, onBack, onSwitchToLogin }) => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<string>('participant');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (!/\d/.test(password)) {
      setError('Password must contain at least one number (0-9).');
      return;
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      setError('Password must contain at least one SPECIAL character (e.g. !@#$%^&*).');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const res = await authApi.register({
        name,
        email,
        password,
        role: role.toUpperCase() as any,
      });
      setAuth(res.user, res.tokens);
      if (onSignup) {
        onSignup(role as any, { name: res.user.name, email: res.user.email, avatar: res.user.avatar || '' });
      }
      navigate('/hackathons');
    } catch {
      // Fallback local signup for offline/demo mode
      const newUser = {
        id: `user-${Date.now()}`,
        email,
        name,
        role: role.toUpperCase() as any,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        isEmailVerified: true,
        profileComplete: false,
        skills: [] as string[],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Store credentials locally for login validation
      try {
        const storedUsersStr = localStorage.getItem('hc_registered_users');
        const storedUsers = storedUsersStr ? JSON.parse(storedUsersStr) : [];
        const existingIdx = storedUsers.findIndex((u: any) => u.email.toLowerCase() === email.toLowerCase());
        if (existingIdx >= 0) {
          storedUsers[existingIdx] = { email: email.toLowerCase(), password, name, role: role.toUpperCase(), userObj: newUser };
        } else {
          storedUsers.push({ email: email.toLowerCase(), password, name, role: role.toUpperCase(), userObj: newUser });
        }
        localStorage.setItem('hc_registered_users', JSON.stringify(storedUsers));
      } catch {}

      const tokens = {
        accessToken: `demo-token-${Date.now()}`,
        refreshToken: `demo-refresh-${Date.now()}`,
      };

      setAuth(newUser, tokens);
      if (onSignup) {
        onSignup(role as any, { name, email, avatar: newUser.avatar });
      }
      navigate('/hackathons');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-indigo-200/40 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-purple-200/40 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '1.5s' }} />

      <header className="relative z-10 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-24">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              {onBack && (
                <button onClick={onBack} className="p-2 mr-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors">
                  ← Back
                </button>
              )}
              <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/20">
                <Terminal className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Hackathon<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600">Central</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 relative z-10 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md mx-auto">
          <div className="p-8 rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200 shadow-2xl space-y-6">
            <div className="text-center">
              <h3 className="font-bold text-slate-900 text-2xl">Create Account</h3>
              <p className="text-sm text-slate-500 mt-2">Sign up to get started.</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Role</label>
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="participant">Participant</option>
                  <option value="organizer">Organizer</option>
                  <option value="judge">Judge</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-slate-700">Password</label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full pl-10 pr-12 py-2.5 text-sm rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Must be at least 8 characters with 1 number & 1 special character</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-12 py-2.5 text-sm rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              {error && <div className="text-red-500 text-xs text-center">{error}</div>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
              >
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </button>

              <div className="mt-6 text-center text-sm text-slate-500">
                Already have an account?{' '}
                <button 
                  type="button" 
                  onClick={() => onSwitchToLogin ? onSwitchToLogin() : navigate('/login')} 
                  className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};
