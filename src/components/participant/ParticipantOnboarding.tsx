import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Briefcase, Code, GraduationCap, Globe, Link2, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { AuthenticatedUser } from '../../types';

interface ParticipantOnboardingProps {
  user: AuthenticatedUser;
  onComplete: (updatedUser: AuthenticatedUser) => void;
}

export const ParticipantOnboarding: React.FC<ParticipantOnboardingProps> = ({ user, onComplete }) => {
  const [education, setEducation] = useState('Student');
  const [skillsInput, setSkillsInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [step, setStep] = useState(1);

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillsInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillsInput.trim())) {
        setSkills([...skills, skillsInput.trim()]);
      }
      setSkillsInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    onComplete({
      ...user,
      profileComplete: true,
      education,
      skills,
      githubUrl,
      linkedinUrl
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
        
        {/* Progress Bar */}
        <div className="flex h-2 bg-slate-100">
          <motion.div 
            className="bg-indigo-600 h-full"
            initial={{ width: 0 }}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="p-8 sm:p-12">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Welcome, {user.name.split(' ')[0]}!</h2>
            <p className="text-slate-500 mt-2">Let's complete your profile to find the best hackathons for you.</p>
          </div>

          <form onSubmit={handleSubmit}>
            
            {/* STEP 1: Education */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-indigo-600" /> Current Status
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button type="button" onClick={() => setEducation('Student')} className={`p-4 border-2 rounded-xl text-left transition-all ${education === 'Student' ? 'border-indigo-600 bg-indigo-50 text-indigo-900' : 'border-slate-200 hover:border-indigo-300 text-slate-600'}`}>
                      <GraduationCap className="w-6 h-6 mb-2" />
                      <div className="font-semibold">Student</div>
                      <div className="text-xs opacity-75 mt-1">Currently enrolled in a university or school</div>
                    </button>
                    <button type="button" onClick={() => setEducation('Professional')} className={`p-4 border-2 rounded-xl text-left transition-all ${education === 'Professional' ? 'border-indigo-600 bg-indigo-50 text-indigo-900' : 'border-slate-200 hover:border-indigo-300 text-slate-600'}`}>
                      <Briefcase className="w-6 h-6 mb-2" />
                      <div className="font-semibold">Professional</div>
                      <div className="text-xs opacity-75 mt-1">Working in the industry</div>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Skills */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                    <Code className="w-5 h-5 text-indigo-600" /> Your Skills
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">Type a skill and press Enter to add it.</p>
                  
                  <input
                    type="text"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                    placeholder="e.g. React, Python, UI Design..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                  />
                  
                  <div className="flex flex-wrap gap-2 min-h-[100px]">
                    {skills.map(skill => (
                      <span key={skill} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium flex items-center gap-2">
                        {skill}
                        <button type="button" onClick={() => removeSkill(skill)} className="text-slate-400 hover:text-slate-600">
                          &times;
                        </button>
                      </span>
                    ))}
                    {skills.length === 0 && (
                      <span className="text-slate-400 text-sm italic">No skills added yet.</span>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Social Links */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Connect Your Profiles</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">GitHub URL (Optional)</label>
                      <div className="relative">
                        <Globe className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="url"
                          value={githubUrl}
                          onChange={(e) => setGithubUrl(e.target.value)}
                          placeholder="https://github.com/username"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">LinkedIn URL (Optional)</label>
                      <div className="relative">
                        <Link2 className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="url"
                          value={linkedinUrl}
                          onChange={(e) => setLinkedinUrl(e.target.value)}
                          placeholder="https://linkedin.com/in/username"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="mt-10 flex items-center justify-between pt-6 border-t border-slate-100">
              {step > 1 ? (
                <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-2.5 text-slate-600 hover:text-slate-900 font-medium transition-colors">
                  Back
                </button>
              ) : (
                <div />
              )}
              
              <button type="submit" className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 flex items-center gap-2">
                {step === 3 ? (
                  <>Complete Profile <CheckCircle2 className="w-5 h-5" /></>
                ) : (
                  <>Continue <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
