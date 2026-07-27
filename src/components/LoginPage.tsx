import { useState } from 'react';
import { Terminal, Mail, Lock, Eye, EyeOff, KeyRound, CheckCircle2, ArrowRight } from 'lucide-react';
import type { UserRole } from '../types';

interface LoginUser {
  name: string;
  email: string;
  avatar: string;
}

interface LoginPageProps {
  onLogin: (role: UserRole, user: LoginUser) => void;
  onBack?: () => void;
  onSwitchToSignup?: () => void;
}

type AuthView = 'login' | 'forgot_email' | 'forgot_otp' | 'forgot_new' | 'success';

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onBack, onSwitchToSignup }) => {
  const [view, setView] = useState<AuthView>('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('participant');
  
  // Forgot password specific state
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loginFailed, setLoginFailed] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setIsLoading(true);
    setError('');
    setTimeout(() => {
      // Simulate failed login unless it's a specific credential, to trigger the 'forgot password' rule
      if (email !== 'demo@example.com' || password !== 'password123') {
        setIsLoading(false);
        setError('Invalid email or password.');
        setLoginFailed(true);
        return;
      }
      
      onLogin(role, {
        name: 'Demo User',
        email: email,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
      });
      setIsLoading(false);
    }, 800);
  };

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setIsLoading(true);
    setError('');
    // Simulate sending OTP
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
    // Simulate OTP verification (accepts any for demo)
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
    // Simulate password reset
    setTimeout(() => {
      setIsLoading(false);
      setView('success');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-indigo-200/40 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-purple-200/40 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '1.5s' }} />

      <header className="relative z-10 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
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
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
            
            {/* View: Login */}
            {view === 'login' && (
              <>
                <div className="text-center">
                  <h3 className="font-bold text-slate-900 text-2xl">Sign In</h3>
                  <p className="text-sm text-slate-500 mt-2">Welcome back! (Use demo@example.com / password123)</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
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
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full pl-10 pr-12 py-2.5 text-sm rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="shrink-0 px-3 text-xs text-slate-400 font-medium uppercase tracking-wider">Or continue with</span>
                    <div className="flex-grow border-t border-slate-200"></div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors text-sm font-medium">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                      </svg>
                      GitHub
                    </button>
                    <button type="button" className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors text-sm font-medium">
                      <svg className="w-4 h-4" viewBox="0 0 48 48">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                      </svg>
                      Google
                    </button>
                  </div>
                
                  <div className="mt-6 text-center text-sm text-slate-500">
                    Don't have an account?{' '}
                    <button type="button" onClick={onSwitchToSignup} className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
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
                        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white border border-slate-300 text-slate-900 tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                        className="w-full pl-10 pr-12 py-2.5 text-sm rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                        className="w-full pl-10 pr-12 py-2.5 text-sm rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
