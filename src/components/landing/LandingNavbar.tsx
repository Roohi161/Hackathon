import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Search, Menu, X } from 'lucide-react';

interface LandingNavbarProps {
  onGetStarted: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({ onGetStarted }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ['Home', 'Hackathons', 'Leaderboard', 'About', 'Contact'];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? 'bg-[#0B1020]/80 backdrop-blur-md border-b border-white/10 shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 lg:h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]">
            <Terminal size={24} />
          </div>
          <span className="text-xl font-extrabold text-white hidden sm:block tracking-tight">
            Hackathon<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Central</span>
          </span>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-gray-300 hover:text-white text-sm font-medium relative group transition-colors"
            >
              {link}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors">
            <Search size={20} />
          </button>
          
          <button className="hidden sm:block text-gray-300 hover:text-white font-medium text-sm transition-colors">
            Sign In
          </button>
          
          <button
            onClick={onGetStarted}
            className="hidden sm:flex bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:via-purple-500 hover:to-cyan-400 text-white font-medium text-sm px-5 py-2.5 rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.4)] transition-all hover:scale-105"
          >
            Get Started
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden text-gray-300 hover:text-white p-2 rounded-md hover:bg-white/5 transition-colors"
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
              className="fixed inset-0 bg-[#0B1020]/90 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-64 bg-[#0F172A] border-l border-white/10 p-6 z-50 flex flex-col md:hidden shadow-2xl"
            >
              <div className="flex justify-end mb-8">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex flex-col gap-6 flex-1">
                {navLinks.map((link) => (
                  <a
                    key={link}
                    href={`#${link.toLowerCase()}`}
                    className="text-gray-300 hover:text-white text-lg font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link}
                  </a>
                ))}
              </div>
              
              <div className="flex flex-col gap-4 mt-auto">
                <button className="text-gray-300 hover:text-white font-medium py-3 border border-white/10 rounded-xl transition-colors">
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onGetStarted();
                  }}
                  className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-medium py-3 rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                >
                  Get Started
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
