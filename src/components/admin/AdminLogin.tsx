import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, Box, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface AdminLoginProps {
  onLogin: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@hackathon.com' && password === 'admin') {
      onLogin();
    } else {
      alert('Invalid admin credentials. Hint: use admin@hackathon.com / admin');
    }
  };

  const handleQuickFill = () => {
    setEmail('admin@hackathon.com');
    setPassword('admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#070913] text-slate-100 font-sans selection:bg-purple-500/30">
      {/* Background Image Layer with Gradient Mask */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-luminosity scale-105 transition-transform duration-1000"
        style={{ backgroundImage: `url('/hackathon_bg.jpg')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#070913] via-[#070913]/70 to-[#070913]/90" />

      {/* Ambient Radial Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Glassmorphism Login Box */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#0a0d24]/85 backdrop-blur-2xl border border-indigo-500/20 shadow-[0_25px_60px_rgba(0,0,0,0.8)] rounded-3xl p-8 sm:p-10 relative z-10 overflow-hidden"
      >
        {/* Glow Line on top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-[0_0_15px_rgba(168,85,247,0.8)]" />

        {/* Header Icon & Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-600 p-[2px] shadow-[0_0_25px_rgba(124,58,237,0.6)] mx-auto mb-4">
            <div className="w-full h-full bg-[#0a0d24] rounded-2xl flex items-center justify-center">
              <Box className="w-8 h-8 text-indigo-400" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Admin<span className="text-indigo-400">Console</span>
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
            Central Hackathon Portal Access
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
              Admin Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@hackathon.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#050716]/90 border border-indigo-500/20 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#050716]/90 border border-indigo-500/20 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-sm shadow-[0_0_25px_rgba(124,58,237,0.5)] hover:shadow-[0_0_35px_rgba(124,58,237,0.7)] border border-white/20 transition-all flex items-center justify-center gap-2 group"
            >
              Sign In to Dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </form>

        {/* Helper Quick Fill Button */}
        <div className="mt-6 pt-6 border-t border-white/10 text-center">
          <button
            type="button"
            onClick={handleQuickFill}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center justify-center gap-1.5 mx-auto transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Auto-fill Demo Credentials
          </button>
        </div>
      </motion.div>
    </div>
  );
};
