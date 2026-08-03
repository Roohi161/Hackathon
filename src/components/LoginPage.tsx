import { useState } from 'react';
import { Terminal, Mail, Lock, Eye, EyeOff, KeyRound, CheckCircle2, ArrowRight, Sparkles, Code, Cpu, ShieldCheck } from 'lucide-react';
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setIsLoading(true);
    setError('');
    setTimeout(() => {
      // Dynamic name resolution for logged in user
      let userName = 'Authenticated User';
      if (role === 'participant') userName = 'Shaik Ansar Ali';
      else if (role === 'organizer') userName = 'KVS Bhavya Sri';
      else if (role === 'judge') userName = 'M Rohan Yaswanth';
      else if (role === 'admin') userName = 'System Administrator';

      if (email.includes('@')) {
        const parts = email.split('@')[0];
        userName = parts.charAt(0).toUpperCase() + parts.slice(1);
      }

      onLogin(role, {
        name: userName,
        email: email,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
      });
      setIsLoading(false);
    }, 400);
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
      {/* Soft Ambient Mesh Background & Tech Watermarks */}
      <div className="absolute top-[-150px] left-[-150px] w-[600px] h-[600px] bg-indigo-200/40 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-150px] right-[-150px] w-[600px] h-[600px] bg-purple-200/40 rounded-full blur-[140px] pointer-events-none animate-pulse" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-100/30 rounded-full blur-[160px] pointer-events-none" />

      {/* Subtle background tech symbols */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-20">
        <Code className="absolute top-20 left-20 w-32 h-32 text-indigo-400" />
        <Cpu className="absolute bottom-20 right-20 w-40 h-40 text-purple-400" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full bg-white/70 backdrop-blur-xl border-b border-indigo-100/80 shadow-2xs">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-24">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              {onBack && (
                <button 
                  onClick={onBack} 
                  className="px-3.5 py-1.5 mr-2 rounded-xl text-xs font-extrabold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/80 border border-slate-200/80 transition-all flex items-center gap-1.5 shadow-2xs"
                >
                  ← Back to Home
                </button>
              )}
              <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <span className="font-black text-xl tracking-tight text-slate-900">
                  Hackathon<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Central</span>
                </span>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-500 bg-white/80 border border-slate-200/80 px-3.5 py-1.5 rounded-full shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure Participant Gateway
            </div>
          </div>
        </div>
      </header>

      {/* Main Login Area */}
      <main className="flex-1 relative z-10 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md mx-auto">
          <div className="p-8 sm:p-10 rounded-3xl bg-white/85 backdrop-blur-2xl border-2 border-indigo-100/90 shadow-2xl shadow-indigo-100/60 space-y-6 relative overflow-hidden">
            {/* Top Glowing Pill Decor */}
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto mb-2" />

            {/* View: Login */}
            {view === 'login' && (
              <>
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-black capitalize">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> {role} Access Portal
                  </div>
                  <h3 className="font-black text-slate-900 text-2xl tracking-tight capitalize">{role} Sign In</h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    {role === 'participant' && 'Sign in to manage team submissions, track leaderboards & compete'}
                    {role === 'organizer' && 'Sign in to create hackathons, manage tracks, and verify participants'}
                    {role === 'judge' && 'Sign in to evaluate submissions, score projects, and review leaderboards'}
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Account Role</label>
                    <select 
                      value={role} 
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="w-full px-4 py-2.5 text-xs font-bold rounded-2xl bg-slate-50/80 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all cursor-pointer"
                    >
                      <option value="participant">Participant</option>
                      <option value="organizer">Organizer</option>
                      <option value="judge">Judge</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-indigo-500 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={`${role}@hackathon.com`}
                        className="w-full pl-10 pr-4 py-2.5 text-xs font-bold rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">Password</label>
                      <button 
                        type="button" 
                        onClick={() => { 
                          setView('forgot_email'); setError(''); setSuccessMsg(''); 
                        }}
                        className="text-xs font-extrabold text-indigo-600 hover:text-purple-600 transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-indigo-500 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-12 py-2.5 text-xs font-bold rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all shadow-2xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-2.5 p-1 text-slate-400 hover:text-slate-700 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold text-center">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-2xl font-black text-xs text-white bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span>{isLoading ? 'Authenticating...' : 'Sign In To Workspace'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="pt-4 text-center text-xs font-semibold text-slate-500 border-t border-slate-100">
                    Don't have a participant account?{' '}
                    <button 
                      type="button" 
                      onClick={onSwitchToSignup} 
                      className="font-black text-indigo-600 hover:text-purple-600 transition-colors underline decoration-indigo-300"
                    >
                      Create Account
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
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 mb-2 inline-flex items-center gap-1"
                >
                  ← Back to Login
                </button>
                <div className="text-center space-y-2 mb-6">
                  <h3 className="font-black text-slate-900 text-2xl">Reset Password</h3>
                  <p className="text-xs text-slate-500 font-semibold">Enter your email to receive a One-Time Verification Code (OTP).</p>
                </div>

                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-indigo-500 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-2.5 text-xs font-bold rounded-2xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  {error && <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold text-center">{error}</div>}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-2xl font-black text-xs text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {isLoading ? 'Sending OTP...' : 'Send Verification OTP'}
                  </button>
                </form>
              </>
            )}

            {/* View: Forgot Password - Verify OTP */}
            {view === 'forgot_otp' && (
              <>
                <button 
                  onClick={() => { setView('forgot_email'); setError(''); setSuccessMsg(''); }} 
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 mb-2 inline-flex items-center gap-1"
                >
                  ← Back
                </button>
                <div className="text-center space-y-2 mb-6">
                  <h3 className="font-black text-slate-900 text-2xl">Enter Verification Code</h3>
                  <p className="text-xs text-slate-500 font-semibold">We sent a verification code to <span className="font-bold text-indigo-600">{email}</span></p>
                </div>

                {successMsg && (
                  <div className="p-3 mb-4 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold text-center border border-emerald-200">
                    {successMsg}
                  </div>
                )}

                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Verification OTP Code</label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-indigo-500 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="e.g. 123456"
                        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-2xl bg-white border border-slate-200 text-slate-900 tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  {error && <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold text-center">{error}</div>}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-2xl font-black text-xs text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {isLoading ? 'Verifying...' : 'Verify Code & Proceed'}
                  </button>
                </form>
              </>
            )}

            {/* View: Forgot Password - Enter New Password */}
            {view === 'forgot_new' && (
              <>
                <div className="text-center mb-6 space-y-2">
                  <div className="mx-auto w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-2 shadow-2xs border border-emerald-200">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-slate-900 text-2xl">Create New Password</h3>
                  <p className="text-xs text-slate-500 font-semibold">Your email has been verified. Set your new security password below.</p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">New Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-indigo-500 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full pl-10 pr-12 py-2.5 text-xs font-bold rounded-2xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all shadow-2xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-2.5 p-1 text-slate-400 hover:text-slate-700 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-indigo-500 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full pl-10 pr-12 py-2.5 text-xs font-bold rounded-2xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  {error && <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold text-center">{error}</div>}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-2xl font-black text-xs text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {isLoading ? 'Updating...' : 'Save New Password'}
                  </button>
                </form>
              </>
            )}

            {/* View: Success View */}
            {view === 'success' && (
              <div className="text-center py-4 space-y-4">
                <div className="mx-auto w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center shadow-md border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-black text-slate-900 text-2xl">Password Updated!</h3>
                <p className="text-xs text-slate-500 font-semibold max-w-xs mx-auto">Your password has been changed successfully. You can now sign in with your updated credentials.</p>
                <button
                  onClick={() => {
                    setView('login');
                    setPassword('');
                    setNewPassword('');
                    setConfirmNewPassword('');
                    setOtp('');
                  }}
                  className="w-full py-3 rounded-2xl font-black text-xs text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Proceed to Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};
