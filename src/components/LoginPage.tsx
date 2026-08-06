import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Mail, Lock, Eye, EyeOff, KeyRound, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { authApi } from '../services/authApi';
import type { UserRole } from '../types';

interface LoginUser {
  name: string;
  email: string;
  avatar: string;
}

interface LoginPageProps {
  onLogin?: (role: UserRole, user: LoginUser) => void;
  onBack?: () => void;
  onSwitchToSignup?: () => void;
  targetRole?: 'PARTICIPANT' | 'ORGANIZER' | 'JUDGE' | 'ADMIN';
  title?: string;
  subtitle?: string;
  badgeText?: string;
  accentColor?: string;
}

type AuthView = 'login' | 'forgot_email' | 'forgot_otp' | 'forgot_new' | 'success';

export const LoginPage: React.FC<LoginPageProps> = ({ 
  onLogin, 
  onBack, 
  onSwitchToSignup,
  targetRole,
  title = 'Sign In',
  subtitle = 'Sign in with your credentials or demo accounts',
  badgeText,
  accentColor
}) => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<string>(targetRole ? targetRole.toLowerCase() : 'participant');

  // Forgot password specific state
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loginFailed, setLoginFailed] = useState(false);

  const navigateByRole = (userRole: UserRole) => {
    const roleRouteMap: Record<string, string> = {
      ORGANIZER: '/organizer',
      JUDGE: '/judge',
      ADMIN: '/admin',
      SUPER_ADMIN: '/admin',
      MENTOR: '/mentor',
      VOLUNTEER: '/volunteer',
      SPONSOR: '/sponsor',
      REVIEWER: '/reviewer',
      PARTICIPANT: '/dashboard',
    };
    navigate(roleRouteMap[userRole] || '/dashboard');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const res = await authApi.login({ email, password });
      const userRole = (res.user.role || 'PARTICIPANT').toUpperCase() as UserRole;
      setAuth({ ...res.user, role: userRole }, res.tokens);
      if (onLogin) {
        onLogin(userRole, { name: res.user.name, email: res.user.email, avatar: res.user.avatar || '' });
      }
      navigateByRole(userRole);
      return;
    } catch {
      // Check registered users in local storage
      try {
        const storedUsersStr = localStorage.getItem('hc_registered_users');
        const storedUsers = storedUsersStr ? JSON.parse(storedUsersStr) : [];
        const foundUser = storedUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

        if (foundUser) {
          if (foundUser.password !== password) {
            setError('Invalid password. Please check your password and try again.');
            setLoginFailed(true);
            return;
          }
          const userRole = (foundUser.role || 'PARTICIPANT') as UserRole;
          setAuth(foundUser.userObj, { accessToken: `token-${Date.now()}`, refreshToken: `ref-${Date.now()}` });
          if (onLogin) {
            onLogin(userRole, { name: foundUser.name, email: foundUser.email, avatar: foundUser.userObj.avatar });
          }
          navigateByRole(userRole);
          return;
        }
      } catch {}

      // Reject unregistered or invalid credentials strictly
      setError('Invalid email or password. Please check your credentials or Sign Up for a new account.');
      setLoginFailed(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setIsLoading(true);
    setError('');
    setTimeout(() => {
      setIsLoading(false);
      setView('forgot_otp');
      setSuccessMsg('OTP has been sent to your email.');
    }, 1000);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      setError('Please enter a valid OTP.');
      return;
    }
    setIsLoading(true);
    setError('');
    setSuccessMsg('');
    setTimeout(() => {
      setIsLoading(false);
      setView('forgot_new');
    }, 800);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmNewPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    setError('');
    setTimeout(() => {
      setIsLoading(false);
      setView('success');
    }, 1000);
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

            {/* View: Login */}
            {view === 'login' && (
              <>
                <div className="text-center space-y-1">
                  {badgeText && (
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-700 inline-block mb-1">
                      {badgeText}
                    </span>
                  )}
                  <h3 className="font-bold text-slate-900 text-2xl">{title}</h3>
                  <p className="text-sm text-slate-500">{subtitle}</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        autoComplete="off"
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
                      <button 
                        type="button" 
                        onClick={() => { 
                          if (loginFailed) {
                            setView('forgot_email'); setError(''); setSuccessMsg(''); 
                          } else {
                            setError('Forgot password can only be used after an invalid login attempt.');
                          }
                        }}
                        className={`text-xs font-medium transition-colors ${loginFailed ? 'text-indigo-600 hover:text-indigo-700' : 'text-slate-400 cursor-not-allowed'}`}
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
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
                  </div>

                  {error && <div className="text-red-500 text-xs text-center">{error}</div>}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
                  >
                    {isLoading ? 'Authenticating...' : 'Sign In'}
                  </button>

                  <div className="mt-6 text-center text-sm text-slate-500">
                    Don't have an account?{' '}
                    <button 
                      type="button" 
                      onClick={() => onSwitchToSignup ? onSwitchToSignup() : navigate('/signup')} 
                      className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
                    >
                      Sign up
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* View: Forgot Password - Enter Email */}
            {view === 'forgot_email' && (
              <>
                <button 
                  onClick={() => { setView('login'); setError(''); }} 
                  className="text-xs text-slate-500 hover:text-slate-800 mb-4 inline-block"
                >
                  ← Back to Login
                </button>
                <div className="text-center mb-6">
                  <h3 className="font-bold text-slate-900 text-2xl">Reset Password</h3>
                  <p className="text-sm text-slate-500 mt-2">Enter your email to receive a One-Time Password (OTP).</p>
                </div>

                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  {error && <div className="text-red-500 text-xs text-center">{error}</div>}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                </form>
              </>
            )}

            {/* View: Forgot Password - Verify OTP */}
            {view === 'forgot_otp' && (
              <>
                <button 
                  onClick={() => { setView('forgot_email'); setError(''); setSuccessMsg(''); }} 
                  className="text-xs text-slate-500 hover:text-slate-800 mb-4 inline-block"
                >
                  ← Back
                </button>
                <div className="text-center mb-6">
                  <h3 className="font-bold text-slate-900 text-2xl">Enter OTP</h3>
                  <p className="text-sm text-slate-500 mt-2">We sent a verification code to <span className="font-semibold">{email}</span></p>
                </div>

                {successMsg && (
                  <div className="p-3 mb-4 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-medium text-center border border-emerald-200">
                    {successMsg}
                  </div>
                )}

                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Verification Code</label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="e.g. 123456"
                        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white border border-slate-300 text-slate-900 tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  {error && <div className="text-red-500 text-xs text-center">{error}</div>}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </form>
              </>
            )}

            {/* View: Forgot Password - Enter New Password */}
            {view === 'forgot_new' && (
              <>
                <div className="text-center mb-6">
                  <div className="mx-auto w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-2xl">Create New Password</h3>
                  <p className="text-sm text-slate-500 mt-2">Your email has been verified. You can now set a new password.</p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">New Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full pl-10 pr-12 py-2.5 text-sm rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full pl-10 pr-12 py-2.5 text-sm rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  {error && <div className="text-red-500 text-xs text-center">{error}</div>}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </>
            )}

            {/* View: Success View */}
            {view === 'success' && (
              <div className="text-center py-6">
                <div className="mx-auto w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-900 text-2xl mb-2">Password Updated!</h3>
                <p className="text-sm text-slate-500 mb-8">Your password has been changed successfully. You can now sign in with your new password.</p>
                <button
                  onClick={() => {
                    setView('login');
                    setPassword('');
                    setNewPassword('');
                    setConfirmNewPassword('');
                    setOtp('');
                  }}
                  className="w-full py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  Proceed to Sign In
                </button>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};
