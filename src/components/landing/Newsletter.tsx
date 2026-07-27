import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

export const Newsletter = () => {
  return (
    <section className="py-24 relative z-10 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-br from-indigo-600 to-purple-600 shadow-xl shadow-indigo-200 rounded-3xl p-8 md:p-12 overflow-hidden border-none"
        >
          {/* Background decorations */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute top-[-50%] left-[-10%] w-[60%] h-[150%] bg-indigo-600/20 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-50%] right-[-10%] w-[60%] h-[150%] bg-cyan-600/20 blur-[100px] rounded-full pointer-events-none" />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 text-white mb-6 shadow-lg backdrop-blur-sm border border-white/30">
                <Mail size={32} />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                Stay in the <span className="gradient-text">Loop</span>
              </h2>
              <p className="text-lg text-gray-300 max-w-xl mx-auto lg:mx-0">
                Get notified about upcoming hackathons, platform updates, and exclusive opportunities.
              </p>
            </div>

            <div className="w-full lg:w-auto lg:min-w-[400px]">
              <form className="flex flex-col sm:flex-row gap-4 mb-4" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full flex-grow px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all backdrop-blur-sm"
                  required
                />
                <button
                  type="submit"
                  className="px-8 py-4 rounded-xl font-bold text-indigo-600 bg-white hover:bg-slate-50 hover:shadow-lg transition-all hover:-translate-y-1 whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-sm text-white/80 text-center lg:text-left">
                No spam, unsubscribe anytime. Join 10,000+ developers.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
