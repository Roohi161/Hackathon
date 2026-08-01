import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Search, Menu, X, Trophy, ArrowRight } from 'lucide-react';

interface LandingNavbarProps {
  onNavigateSignup?: () => void;
  onNavigateLogin?: () => void;
  onGetStarted?: () => void;
  onNavigateHome?: () => void;
  onNavigateAbout?: () => void;
  onNavigateContact?: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({ onNavigateSignup, onNavigateLogin, onGetStarted, onNavigateHome, onNavigateAbout, onNavigateContact }) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState<'leaderboard' | 'about' | 'contact' | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const searchResults = [
    { type: 'Hackathon', title: 'AI Innovation Challenge 2026', tags: 'Generative AI, LLMs', prize: '$50K' },
    { type: 'Hackathon', title: 'Web3 Builder Sprint', tags: 'Solidity, Rust, DeFi', prize: '$100K' },
    { type: 'Hackathon', title: 'Green Tech Hackathon', tags: 'IoT, Climate Tech', prize: '$25K' },
  ].filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNavClick = (link: string) => {
    setMobileMenuOpen(false);
    if (link === 'Home') {
      if (onNavigateHome) onNavigateHome();
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (link === 'Hackathons') {
      navigate('/hackathons');
    } else if (link === 'Leaderboard') {
      navigate('/leaderboard');
    } else if (link === 'About') {
      if (onNavigateAbout) onNavigateAbout();
      else navigate('/about');
    } else if (link === 'Contact') {
      if (onNavigateContact) onNavigateContact();
      else navigate('/contact');
    }
  };

  const handleAuthAction = () => {
    if (onNavigateLogin) {
      onNavigateLogin();
    } else {
      navigate('/login');
    }
  };

  const handleSignupAction = () => {
    if (onNavigateSignup) {
      onNavigateSignup();
    } else {
      navigate('/signup');
    }
  };

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled ? 'bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-lg shadow-slate-200/50' : 'bg-transparent'
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-24 h-16 lg:h-20 flex items-center justify-between">
          {/* Logo */}
          <div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]">
              <Terminal size={24} />
            </div>
            <span className="text-xl font-extrabold text-slate-900 hidden sm:block tracking-tight">
              Hackathon<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600">Central</span>
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {['Home', 'Hackathons', 'Leaderboard', 'About', 'Contact'].map((link) => (
              <button
                key={link}
                onClick={() => handleNavClick(link)}
                className="text-slate-600 hover:text-slate-900 text-sm font-medium relative group transition-colors cursor-pointer"
              >
                {link}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              title="Search Hackathons"
            >
              <Search size={20} />
            </button>

            <button
              onClick={handleAuthAction}
              className="hidden sm:block text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors cursor-pointer"
            >
              Sign In
            </button>

            <button
              onClick={handleSignupAction}
              className="hidden sm:flex bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:via-purple-500 hover:to-cyan-400 text-white font-medium text-sm px-5 py-2.5 rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.4)] transition-all hover:scale-105 cursor-pointer"
            >
              Get Started
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden text-slate-600 hover:text-slate-900 p-2 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 md:hidden"
                onClick={() => setMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 h-full w-64 bg-white border-l border-slate-200 p-6 z-50 flex flex-col md:hidden shadow-2xl"
              >
                <div className="flex justify-end mb-8">
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="flex flex-col gap-6 flex-1">
                  {['Home', 'Hackathons', 'Leaderboard', 'About', 'Contact'].map((link) => (
                    <button
                      key={link}
                      onClick={() => handleNavClick(link)}
                      className="text-slate-700 hover:text-slate-900 text-lg font-medium text-left transition-colors cursor-pointer"
                    >
                      {link}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-4 mt-auto">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleAuthAction();
                    }}
                    className="text-slate-700 hover:text-slate-900 font-medium py-3 border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleSignupAction();
                    }}
                    className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-medium py-3 rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.4)] cursor-pointer"
                  >
                    Get Started
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* SEARCH MODAL */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-start justify-center pt-24 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden"
            >
              <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search hackathons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none"
                />
                <button onClick={() => setSearchOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 max-h-80 overflow-y-auto space-y-2">
                {searchResults.length > 0 ? (
                  searchResults.map((res, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setSearchOpen(false);
                        navigate('/hackathons');
                      }}
                      className="p-3 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between border border-transparent hover:border-slate-200 transition-colors"
                    >
                      <div>
                        <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">{res.type}</div>
                        <div className="text-sm font-bold text-slate-900">{res.title}</div>
                        <div className="text-xs text-slate-500">{res.tags}</div>
                      </div>
                      <span className="text-xs font-extrabold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg">{res.prize}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400 text-sm">No matches found for "{searchQuery}"</div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LEADERBOARD MODAL */}
      <AnimatePresence>
        {activeModal === 'leaderboard' && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg">Global Hackathon Rankings</h3>
                    <p className="text-xs text-slate-500">Live points & project scores across Season 2026</p>
                  </div>
                </div>
                <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2.5 mb-6">
                {[
                  { rank: 1, team: 'Team Nova — AI Health', score: '98.5 pts', track: 'AI Track' },
                  { rank: 2, team: 'CyberKnights — Web3 Vault', score: '96.2 pts', track: 'DeFi Track' },
                  { rank: 3, team: 'GreenPulse — Carbon Tracker', score: '94.8 pts', track: 'Climate Track' },
                  { rank: 4, team: 'CodeNinjas — Cloud Mesh', score: '93.0 pts', track: 'Cloud Track' },
                ].map((t) => (
                  <div key={t.rank} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        t.rank === 1 ? 'bg-amber-400 text-slate-900' : 'bg-slate-200 text-slate-700'
                      }`}>{t.rank}</span>
                      <div>
                        <div className="font-bold text-slate-800">{t.team}</div>
                        <div className="text-xs text-slate-400">{t.track}</div>
                      </div>
                    </div>
                    <span className="font-extrabold text-emerald-600">{t.score}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setActiveModal(null);
                  navigate('/leaderboard');
                }}
                className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                <span>View Full Leaderboards</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
