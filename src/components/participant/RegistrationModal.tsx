import React, { useState } from 'react';
import {
  X,
  User,
  Users,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Upload,
  Sparkles,
  BookOpen,
  Award,
  Phone,
  Mail,
  Building,
  Code2,
  Briefcase,
  FileText,
  ShieldCheck,
  Globe
} from 'lucide-react';
import type { Hackathon } from '../../types';
import { useNotificationStore } from '../../stores/notificationStore';

interface MemberDetails {
  name: string;
  email: string;
  phone: string;
  organization: string;
  department?: string;
  yearSemester?: string;
  role: string;
  skills: string;
  experienceLevel: string;
  github: string;
  linkedin?: string;
  portfolio?: string;
  resumeFileName?: string;
  customAnswers?: Record<string, string>;
}

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  hackathon: Hackathon | null;
  onSuccess?: () => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  hackathon,
  onSuccess
}) => {
  if (!isOpen || !hackathon) return null;

  // Step 1: Type Selection ('individual' | 'team')
  const [registrationType, setRegistrationType] = useState<'individual' | 'team'>('individual');

  // Step state: 1: Type Selection, 2: Basic & Team Info, 3: Members Details & Resume, 4: Review & Confirm
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Team Form Data
  const [teamName, setTeamName] = useState('');
  const [teamLeadName, setTeamLeadName] = useState('');
  const [numberOfMembers, setNumberOfMembers] = useState<number>(1);

  // Members Details List
  const createEmptyMember = (role = 'Developer'): MemberDetails => ({
    name: '',
    email: '',
    phone: '',
    organization: '',
    department: 'Computer Science & Engineering',
    yearSemester: '3rd Year / 6th Sem',
    role,
    skills: '',
    experienceLevel: 'Intermediate',
    github: '',
    linkedin: '',
    portfolio: '',
    resumeFileName: '',
    customAnswers: {
      'Why do you want to join this hackathon?': 'To build real-world AI applications, learn from mentors, and collaborate with like-minded developers.',
      'Previous Hackathon Experience': 'Participated in 2 national-level hackathons and won 2nd runner up in Web3 Sprint.'
    }
  });

  const [members, setMembers] = useState<MemberDetails[]>([
    createEmptyMember('Team Lead')
  ]);

  const [activeMemberTab, setActiveMemberTab] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  // Update Number of Team Members dynamically
  const handleMemberCountChange = (count: number) => {
    const validCount = Math.max(1, Math.min(count, hackathon.maxTeamSize || 5));
    setNumberOfMembers(validCount);

    setMembers((prev) => {
      if (validCount > prev.length) {
        const added: MemberDetails[] = [];
        for (let i = prev.length; i < validCount; i++) {
          added.push(createEmptyMember(`Member #${i + 1}`));
        }
        return [...prev, ...added];
      } else {
        return prev.slice(0, validCount);
      }
    });

    if (activeMemberTab >= validCount) {
      setActiveMemberTab(validCount - 1);
    }
  };

  const handleMemberFieldChange = (index: number, field: keyof MemberDetails, value: string) => {
    setMembers((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleFileUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMembers((prev) => {
        const copy = [...prev];
        copy[index] = { ...copy[index], resumeFileName: file.name };
        return copy;
      });
    }
  };

  // Step Validation Logic
  const validateCurrentStep = (): boolean => {
    setErrorMsg('');
    if (currentStep === 1) {
      return true;
    }
    if (currentStep === 2) {
      if (registrationType === 'team') {
        if (!teamName.trim()) {
          setErrorMsg('Please enter a Team Name');
          return false;
        }
        if (!teamLeadName.trim()) {
          setErrorMsg('Please enter Team Lead Name');
          return false;
        }
      }
      return true;
    }
    if (currentStep === 3) {
      // Validate every member details
      for (let i = 0; i < members.length; i++) {
        const m = members[i];
        const label = registrationType === 'team' ? `Member ${i + 1} (${m.name || 'Unnamed'})` : 'Participant';
        if (!m.name.trim()) {
          setErrorMsg(`Please enter Full Name for ${label}`);
          setActiveMemberTab(i);
          return false;
        }
        if (!m.email.trim() || !m.email.includes('@')) {
          setErrorMsg(`Please enter a valid Email address for ${label}`);
          setActiveMemberTab(i);
          return false;
        }
        if (!m.phone.trim()) {
          setErrorMsg(`Please enter Phone Number for ${label}`);
          setActiveMemberTab(i);
          return false;
        }
        if (!m.organization.trim()) {
          setErrorMsg(`Please enter College / Organization for ${label}`);
          setActiveMemberTab(i);
          return false;
        }
        if (!m.skills.trim()) {
          setErrorMsg(`Please enter Skills & Proficiency for ${label}`);
          setActiveMemberTab(i);
          return false;
        }
      }
      return true;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrevStep = () => {
    setErrorMsg('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmittedSuccess(true);

      const regId = `reg-${Date.now()}`;
      const newReg = {
        id: regId,
        groupName: registrationType === 'team' ? teamName : `${members[0]?.name || 'Solo'}'s Entry`,
        code: `REG-${Math.floor(1000 + Math.random() * 9000)}`,
        leaderEmail: members[0]?.email || 'participant@hackathon.com',
        groupSize: `${members.length} Member(s)`,
        status: 'UNDER_REVIEW',
        hackathonId: hackathon.id,
        hackathonTitle: hackathon.title,
        registeredAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        members: members
      };

      // Push to global registration store
      try {
        const saved = localStorage.getItem('hc_global_registrations');
        const list = saved ? JSON.parse(saved) : [];
        list.unshift(newReg);
        localStorage.setItem('hc_global_registrations', JSON.stringify(list));
      } catch {
        // ignore
      }

      // Add Notification to store
      useNotificationStore.getState().addAnnouncement({
        id: `ann-${Date.now()}`,
        hackathonId: hackathon.id,
        hackathonTitle: hackathon.title,
        title: `Registration Submitted (UNDER REVIEW)`,
        content: `Your registration application for "${hackathon.title}" has been received and is currently UNDER REVIEW by the organizer.`,
        priority: 'MEDIUM',
        createdAt: 'Just now',
        type: 'info'
      });

      if (onSuccess) onSuccess();
    }, 1200);
  };

  const handleResetClose = () => {
    setRegistrationType('individual');
    setCurrentStep(1);
    setTeamName('');
    setTeamLeadName('');
    setNumberOfMembers(1);
    setMembers([createEmptyMember('Participant')]);
    setActiveMemberTab(0);
    setErrorMsg('');
    setIsSubmittedSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Top Gradient Ribbon */}
        <div className="h-2 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 shrink-0" />

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-2xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 font-heading">
                Register for {hackathon.title}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Step {currentStep} of 4 • {registrationType === 'team' ? 'Team Registration' : 'Individual Participant'}
              </p>
            </div>
          </div>
          <button
            onClick={handleResetClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicator */}
        {!isSubmittedSuccess && (
          <div className="px-6 py-3 bg-slate-50/80 border-b border-slate-100 shrink-0">
            <div className="grid grid-cols-4 gap-2">
              {[
                { step: 1, title: 'Registration Type' },
                { step: 2, title: 'Basic Details' },
                { step: 3, title: 'Member Info & Resume' },
                { step: 4, title: 'Review & Register' }
              ].map((s) => (
                <div
                  key={s.step}
                  onClick={() => s.step < currentStep && setCurrentStep(s.step)}
                  className={`flex flex-col gap-1 cursor-pointer transition-all ${
                    currentStep === s.step
                      ? 'opacity-100'
                      : currentStep > s.step
                      ? 'opacity-80'
                      : 'opacity-40'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center shrink-0 ${
                      currentStep === s.step
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : currentStep > s.step
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-300 text-slate-700'
                    }`}>
                      {currentStep > s.step ? '✓' : s.step}
                    </span>
                    <span className="text-[11px] font-bold text-slate-900 truncate hidden sm:inline">
                      {s.title}
                    </span>
                  </div>
                  <div className={`h-1 rounded-full w-full ${
                    currentStep >= s.step ? 'bg-indigo-600' : 'bg-slate-200'
                  }`} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">

          {/* SUCCESS SCREEN */}
          {isSubmittedSuccess ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-md animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-slate-900 font-heading">
                  Registration Successful! 🎉
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  You are registered for <strong>{hackathon.title}</strong> as a {registrationType === 'team' ? `Team (${teamName})` : 'Individual Participant'}.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>Hackathon:</span>
                  <span className="text-indigo-700">{hackathon.title}</span>
                </div>
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>Registered Type:</span>
                  <span className="uppercase text-slate-700">{registrationType}</span>
                </div>
                {registrationType === 'team' && (
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>Team Name:</span>
                    <span className="text-indigo-700">{teamName}</span>
                  </div>
                )}
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>Members Registered:</span>
                  <span className="text-emerald-700">{members.length} Member(s)</span>
                </div>
              </div>
              <button
                onClick={handleResetClose}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all cursor-pointer shadow-md"
              >
                Go to Workspace
              </button>
            </div>
          ) : (
            <>
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* STEP 1: Registration Type Selection */}
              {currentStep === 1 && (
                <div className="space-y-5">
                  <div className="text-center space-y-1">
                    <h3 className="text-lg font-bold text-slate-900">Choose How You Want to Register</h3>
                    <p className="text-xs text-slate-500">Select whether you are competing individually or as a team</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {/* Option A: Individual */}
                    <div
                      onClick={() => {
                        setRegistrationType('individual');
                        setNumberOfMembers(1);
                        setMembers([createEmptyMember('Participant')]);
                      }}
                      className={`p-6 rounded-2xl border-2 transition-all cursor-pointer space-y-3 relative ${
                        registrationType === 'individual'
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500/20'
                          : 'border-slate-200 bg-white hover:border-indigo-300'
                      }`}
                    >
                      {registrationType === 'individual' && (
                        <span className="absolute top-3 right-3 text-indigo-600 font-bold">✓</span>
                      )}
                      <div className="p-3 rounded-xl bg-indigo-100 text-indigo-700 w-fit">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base">Individual Registration</h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          Register as a solo hacker. You can join existing open teams or compete individually.
                        </p>
                      </div>
                    </div>

                    {/* Option B: Team */}
                    <div
                      onClick={() => {
                        setRegistrationType('team');
                        setNumberOfMembers(2);
                        setMembers([
                          createEmptyMember('Team Lead'),
                          createEmptyMember('Member #2')
                        ]);
                      }}
                      className={`p-6 rounded-2xl border-2 transition-all cursor-pointer space-y-3 relative ${
                        registrationType === 'team'
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500/20'
                          : 'border-slate-200 bg-white hover:border-indigo-300'
                      }`}
                    >
                      {registrationType === 'team' && (
                        <span className="absolute top-3 right-3 text-indigo-600 font-bold">✓</span>
                      )}
                      <div className="p-3 rounded-xl bg-violet-100 text-violet-700 w-fit">
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base">Team Registration</h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          Create a new team squad and register up to {hackathon.maxTeamSize || 5} members.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Basic & Team Details */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900">
                      {registrationType === 'team' ? 'Team Overview' : 'Basic Participant Info'}
                    </h3>
                    <p className="text-xs text-slate-500">Provide high-level details before adding member profiles</p>
                  </div>

                  {registrationType === 'team' ? (
                    <div className="space-y-4 pt-1">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">TEAM NAME *</label>
                        <div className="relative">
                          <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                          <input
                            type="text"
                            value={teamName}
                            onChange={(e) => {
                              setTeamName(e.target.value);
                              if (members.length > 0) {
                                handleMemberFieldChange(0, 'name', teamLeadName);
                              }
                            }}
                            placeholder="e.g. CyberPioneers"
                            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">TEAM LEAD NAME *</label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                          <input
                            type="text"
                            value={teamLeadName}
                            onChange={(e) => {
                              setTeamLeadName(e.target.value);
                              handleMemberFieldChange(0, 'name', e.target.value);
                            }}
                            placeholder="e.g. John Doe"
                            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          NUMBER OF TEAM MEMBERS (Max {hackathon.maxTeamSize || 5})
                        </label>
                        <select
                          value={numberOfMembers}
                          onChange={(e) => handleMemberCountChange(Number(e.target.value))}
                          className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-indigo-500 outline-none cursor-pointer"
                        >
                          {Array.from({ length: hackathon.maxTeamSize || 5 }, (_, i) => i + 1).map((num) => (
                            <option key={num} value={num}>
                              {num} {num === 1 ? 'Member (Lead Only)' : 'Members'}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-indigo-700 font-bold">
                        <User className="w-4 h-4" /> Individual Registration Selected
                      </div>
                      <p className="text-slate-600">
                        You will register as a solo participant for <strong>{hackathon.title}</strong>. Click Next to fill in your personal contact details, skills, and resume.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: Member Details, Skills & Resume */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {registrationType === 'team' ? 'Team Member Profiles' : 'Participant Details & Resume'}
                      </h3>
                      <p className="text-xs text-slate-500">Collect skills, proficiency, and resume for verification</p>
                    </div>

                    {registrationType === 'team' && (
                      <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                        {members.length} Member(s) Total
                      </span>
                    )}
                  </div>

                  {/* Tabs for multiple members if team */}
                  {registrationType === 'team' && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-100">
                      {members.map((m, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveMemberTab(idx)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                            activeMemberTab === idx
                              ? 'bg-indigo-600 text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {idx === 0 ? '👑 Team Lead' : `Member #${idx + 1}`}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Form fields for current selected member */}
                  {members[activeMemberTab] && (
                    <div className="space-y-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">FULL NAME *</label>
                          <div className="relative">
                            <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                            <input
                              type="text"
                              value={members[activeMemberTab].name}
                              onChange={(e) => handleMemberFieldChange(activeMemberTab, 'name', e.target.value)}
                              placeholder="e.g. Alex Johnson"
                              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 focus:border-indigo-500 outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">EMAIL ADDRESS *</label>
                          <div className="relative">
                            <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                            <input
                              type="email"
                              value={members[activeMemberTab].email}
                              onChange={(e) => handleMemberFieldChange(activeMemberTab, 'email', e.target.value)}
                              placeholder="alex@example.com"
                              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 focus:border-indigo-500 outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">PHONE NUMBER *</label>
                          <div className="relative">
                            <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                            <input
                              type="text"
                              value={members[activeMemberTab].phone}
                              onChange={(e) => handleMemberFieldChange(activeMemberTab, 'phone', e.target.value)}
                              placeholder="+91 9876543210"
                              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 focus:border-indigo-500 outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">COLLEGE / ORGANIZATION *</label>
                          <div className="relative">
                            <Building className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                            <input
                              type="text"
                              value={members[activeMemberTab].organization}
                              onChange={(e) => handleMemberFieldChange(activeMemberTab, 'organization', e.target.value)}
                              placeholder="e.g. IIT Madras / Tech Corp"
                              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 focus:border-indigo-500 outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">ROLE / DESIGNATION</label>
                          <div className="relative">
                            <Briefcase className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                            <input
                              type="text"
                              value={members[activeMemberTab].role}
                              onChange={(e) => handleMemberFieldChange(activeMemberTab, 'role', e.target.value)}
                              placeholder="e.g. AI Engineer / Frontend Dev"
                              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 focus:border-indigo-500 outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">EXPERIENCE LEVEL</label>
                          <select
                            value={members[activeMemberTab].experienceLevel}
                            onChange={(e) => handleMemberFieldChange(activeMemberTab, 'experienceLevel', e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 focus:border-indigo-500 outline-none cursor-pointer"
                          >
                            <option value="Beginner">Beginner (0-1 yrs)</option>
                            <option value="Intermediate">Intermediate (1-3 yrs)</option>
                            <option value="Advanced">Advanced / Expert (3+ yrs)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">SKILLS & PROFICIENCY *</label>
                        <div className="relative">
                          <Code2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                          <input
                            type="text"
                            value={members[activeMemberTab].skills}
                            onChange={(e) => handleMemberFieldChange(activeMemberTab, 'skills', e.target.value)}
                            placeholder="e.g. Python, PyTorch, React, Node.js, FastAPI"
                            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 focus:border-indigo-500 outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">GITHUB / LINKEDIN (Optional)</label>
                          <div className="relative">
                            <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                            <input
                              type="text"
                              value={members[activeMemberTab].github}
                              onChange={(e) => handleMemberFieldChange(activeMemberTab, 'github', e.target.value)}
                              placeholder="https://github.com/username"
                              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 focus:border-indigo-500 outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">RESUME UPLOAD (PDF/DOC)</label>
                          <div className="relative">
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={(e) => handleFileUpload(activeMemberTab, e)}
                              className="hidden"
                              id={`resume-upload-${activeMemberTab}`}
                            />
                            <label
                              htmlFor={`resume-upload-${activeMemberTab}`}
                              className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 cursor-pointer"
                            >
                              <span className="truncate">
                                {members[activeMemberTab].resumeFileName || 'Choose File...'}
                              </span>
                              <Upload className="w-3.5 h-3.5 text-indigo-600 shrink-0 ml-2" />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: Review & Final Registration */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900">Review Registration Summary</h3>
                    <p className="text-xs text-slate-500">Please review all submitted details before final confirmation</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="font-bold text-slate-700">Hackathon Event:</span>
                      <span className="font-black text-indigo-700">{hackathon.title}</span>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="font-bold text-slate-700">Registration Mode:</span>
                      <span className="font-black uppercase text-purple-700">{registrationType}</span>
                    </div>

                    {registrationType === 'team' && (
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                        <span className="font-bold text-slate-700">Team Name:</span>
                        <span className="font-black text-slate-900">{teamName}</span>
                      </div>
                    )}

                    <div className="space-y-2 pt-1">
                      <span className="font-bold text-slate-700 block">Registered Participants ({members.length}):</span>
                      <div className="space-y-2">
                        {members.map((m, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                            <div className="flex items-center justify-between font-bold text-slate-900">
                              <span>{idx + 1}. {m.name} ({m.role || 'Member'})</span>
                              <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-mono">{m.experienceLevel}</span>
                            </div>
                            <div className="text-[11px] text-slate-500 flex flex-wrap gap-3">
                              <span>📧 {m.email}</span>
                              <span>📞 {m.phone}</span>
                              <span>🏫 {m.organization}</span>
                            </div>
                            <div className="text-[11px] text-slate-600 pt-0.5">
                              <strong>Skills:</strong> {m.skills}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {/* Modal Footer Controls */}
        {!isSubmittedSuccess && (
          <div className="p-4 px-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-all flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all flex items-center gap-1 cursor-pointer"
              >
                Next Step <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {isSubmitting ? 'Registering...' : 'Confirm & Register Now'} <ShieldCheck className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
