import { motion } from 'framer-motion';
import { Terminal, Home, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Global404Page = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#070B15] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10"
      >
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="p-3 bg-indigo-500/20 rounded-xl">
            <Terminal className="text-indigo-400 w-8 h-8" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">
            Hackathon<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Central</span>
          </span>
        </div>

        <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/20 mb-4 drop-shadow-2xl">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-slate-400 max-w-md mx-auto mb-10 text-lg leading-relaxed">
          Looks like this route doesn't exist or you've wandered into an uncharted digital territory.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-8 py-3.5 rounded-full border border-slate-700 bg-slate-800/50 text-white font-medium hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" /> Go Back
          </button>
          <Link
            to="/"
            className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
          >
            <Home className="w-5 h-5" /> Return Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
