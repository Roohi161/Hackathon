import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'What is Hackathon Central?',
    answer: 'Hackathon Central is a comprehensive platform for hosting, managing, and participating in hackathons. It provides tools for participants, organizers, and judges to collaborate effectively.',
  },
  {
    question: 'How do I register for a hackathon?',
    answer: 'Simply create an account, browse available hackathons, and click Register. You can join as an individual or form a team with other participants.',
  },
  {
    question: 'Can I organize my own hackathon?',
    answer: 'Yes! Switch to the Organizer role and use our Creation Wizard to set up your hackathon with custom themes, prizes, timelines, and evaluation rubrics.',
  },
  {
    question: 'How does the judging process work?',
    answer: 'Judges are assigned submissions to evaluate using customizable rubric scorecards. Each criterion is weighted, and final scores are calculated automatically for fair ranking.',
  },
  {
    question: 'Is the platform free to use?',
    answer: 'Hackathon Central offers a free tier for participants. Organizers can start with our Starter plan and upgrade for advanced features like analytics and custom branding.',
  },
  {
    question: 'What technologies are supported?',
    answer: 'We support all major technologies and frameworks. Projects can be submitted via Git integration, file upload, or direct link. Our platform is tech-stack agnostic.',
  },
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium mb-6">
            Common Questions
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to know about Hackathon Central.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-panel rounded-2xl overflow-hidden"
          >
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`border-b border-white/[0.06] last:border-0 ${
                  openIndex === index ? 'bg-white/[0.02]' : ''
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left px-8 py-6 flex items-center justify-between focus:outline-none focus-visible:bg-white/[0.05] transition-colors hover:bg-white/[0.03]"
                >
                  <span className="text-lg font-medium text-white pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`text-gray-400 transition-transform duration-300 flex-shrink-0 ${
                      openIndex === index ? 'rotate-180 text-indigo-400' : ''
                    }`}
                    size={24}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-6 text-gray-400">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
