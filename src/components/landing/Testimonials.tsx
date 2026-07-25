import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    quote: 'Hackathon Central made it incredibly easy to find hackathons, form a team, and submit our project. The real-time leaderboard kept us motivated throughout the competition. We ended up winning first place!',
    name: 'Shaik Ansar Ali',
    title: 'Full-Stack Developer & Participant',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&h=200&auto=format&fit=crop',
    role: 'Participant',
    roleColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  {
    quote: 'Managing a hackathon with 500+ participants was seamless. The registration system, announcement broadcaster, and analytics dashboard saved us countless hours. Best platform we have used.',
    name: 'KVS Bhavya Sri',
    title: 'Event Organizer & Tech Lead',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop',
    role: 'Organizer',
    roleColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
  {
    quote: 'The evaluation portal with rubric-based scoring and submission inspector made judging 100+ projects efficient and fair. The code review tools and scoring analytics are world-class.',
    name: 'M Rohan Yaswanth',
    title: 'Senior Engineer & Judge',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop',
    role: 'Judge',
    roleColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export const Testimonials = () => {
  return (
    <section className="py-24 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium mb-6">
            What People Say
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Loved by <span className="gradient-text">Developers</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Hear from participants, organizers, and judges who use our platform.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={item}
              className="glass-panel glass-panel-hover p-8 rounded-2xl relative flex flex-col"
            >
              <div className="absolute top-6 right-6 text-indigo-500/20">
                <Quote size={48} fill="currentColor" />
              </div>
              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className="fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              <p className="text-gray-300 italic mb-8 flex-grow relative z-10">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border border-white/10"
                />
                <div>
                  <h4 className="text-white font-bold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-400">{testimonial.title}</p>
                </div>
              </div>
              <div className={`mt-4 inline-flex items-center self-start px-2.5 py-0.5 rounded-full text-xs font-medium border ${testimonial.roleColor}`}>
                {testimonial.role}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
