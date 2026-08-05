import React, { useState, useEffect } from 'react';
import {
  Sparkles, Save, Eye, CheckCircle2, ChevronRight, ChevronLeft, Calendar as CalendarIcon,
  Globe, MapPin, Award, Users, Trophy, Building2, ShieldCheck, FileText, Plus, Trash2,
  AlertTriangle, Upload, HelpCircle, Code2, Cpu, Zap, Lock, DollarSign, Layers, Link as LinkIcon,
  Check, X
} from 'lucide-react';
import type {
  Hackathon, HackathonTrack, ProblemStatement, RubricCriteria, PrizeItem, FAQItem,
  HackathonSponsor, HackathonJudge, HackathonMentor, SubmissionConfig, CertificateSettings, SEOSettings
} from '../../types/hackathon';
import { useToastStore } from '../../stores/toastStore';

interface CreateHackathonWizardProps {
  initialHackathon?: Hackathon | null;
  onSaveDraft: (hackathonData: Partial<Hackathon>) => void;
  onPublish: (hackathonData: Hackathon) => void;
  onCancel: () => void;
}

const DEFAULT_SUBMISSION_CONFIG: SubmissionConfig = {
  github: 'required',
  demoUrl: 'required',
  videoUrl: 'optional',
  presentation: 'optional',
  apkUpload: 'disabled',
  zipUpload: 'disabled',
  documentation: 'optional',
  techStack: 'required',
  aiDeclaration: 'optional'
};

const DEFAULT_CERTIFICATE_SETTINGS: CertificateSettings = {
  enabled: true,
  templateName: 'Enterprise Modern Dark',
  signatureTitle: 'Lead Program Chair',
  enableQrVerification: true
};

const DEFAULT_SEO_SETTINGS: SEOSettings = {
  metaTitle: '',
  metaDescription: '',
  keywords: 'hackathon, ai, web3, coding challenge, developers, build',
  ogImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80'
};

export const CreateHackathonWizard: React.FC<CreateHackathonWizardProps> = ({
  initialHackathon,
  onSaveDraft,
  onPublish,
  onCancel
}) => {
  const addToast = useToastStore((s) => s.addToast);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [lastAutoSaved, setLastAutoSaved] = useState<string>('Just now');
  const [isPublishing, setIsPublishing] = useState(false);

  // STEP 1 — Branding & Identity State
  const [title, setTitle] = useState(initialHackathon?.title || '');
  const [tagline, setTagline] = useState(initialHackathon?.tagline || '');
  const [shortDescription, setShortDescription] = useState(initialHackathon?.shortDescription || initialHackathon?.description || '');
  const [detailedDescription, setDetailedDescription] = useState(initialHackathon?.detailedDescription || initialHackathon?.description || '');
  const [logo, setLogo] = useState(initialHackathon?.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80');
  const [banner, setBanner] = useState(initialHackathon?.banner || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80');
  const [coverImage, setCoverImage] = useState(initialHackathon?.coverImage || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80');
  const [organizerName, setOrganizerName] = useState(initialHackathon?.organizerName || 'TechCorp India Labs');
  const [website, setWebsite] = useState(initialHackathon?.website || 'https://hackathoncentral.io');
  const [supportEmail, setSupportEmail] = useState(initialHackathon?.supportEmail || 'support@hackathoncentral.io');
  const [supportPhone, setSupportPhone] = useState(initialHackathon?.supportPhone || '+91 98765 43210');
  const [slug, setSlug] = useState(initialHackathon?.slug || '');
  const [socialLinks, setSocialLinks] = useState(initialHackathon?.socialLinks || { twitter: '', discord: '', linkedin: '', github: '' });

  // STEP 2 — Event Details & Timeline State
  const [mode, setMode] = useState<Hackathon['mode']>(initialHackathon?.mode || 'HYBRID');
  const [category, setCategory] = useState(initialHackathon?.category || 'AI & Machine Learning');
  const [subcategory, setSubcategory] = useState(initialHackathon?.subcategory || '');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels'>(initialHackathon?.difficulty || 'Intermediate');
  const [timezone, setTimezone] = useState(initialHackathon?.timezone || 'India Standard Time (IST UTC+05:30)');
  const [country, setCountry] = useState(initialHackathon?.country || 'India');
  const [stateName, setStateName] = useState(initialHackathon?.state || 'Tamil Nadu');
  const [city, setCity] = useState(initialHackathon?.city || 'Chennai');
  const [venue, setVenue] = useState(initialHackathon?.venue || 'IIT Madras Research Park Auditorium');
  const [mapsUrl, setMapsUrl] = useState(initialHackathon?.mapsUrl || 'https://maps.google.com');

  // Timeline Matrix
  const [registrationStart, setRegistrationStart] = useState(initialHackathon?.registrationStart || '2026-08-10T09:00');
  const [registrationEnd, setRegistrationEnd] = useState(initialHackathon?.registrationEnd || '2026-08-25T23:59');
  const [teamFormationDeadline, setTeamFormationDeadline] = useState(initialHackathon?.teamFormationDeadline || '2026-08-26T18:00');
  const [startDate, setStartDate] = useState(initialHackathon?.startDate || '2026-08-27T09:00');
  const [endDate, setEndDate] = useState(initialHackathon?.endDate || '2026-08-30T18:00');
  const [submissionDeadline, setSubmissionDeadline] = useState(initialHackathon?.submissionDeadline || '2026-08-30T17:00');
  const [evaluationStart, setEvaluationStart] = useState(initialHackathon?.evaluationStart || '2026-08-31T09:00');
  const [evaluationEnd, setEvaluationEnd] = useState(initialHackathon?.evaluationEnd || '2026-09-02T18:00');
  const [winnerAnnouncementDate, setWinnerAnnouncementDate] = useState(initialHackathon?.winnerAnnouncementDate || '2026-09-03T16:00');
  const [certDistributionDate, setCertDistributionDate] = useState(initialHackathon?.certDistributionDate || '2026-09-05T12:00');

  // STEP 3 — Registration, Eligibility & Tracks State
  const [minTeamSize, setMinTeamSize] = useState(initialHackathon?.minTeamSize || 1);
  const [maxTeamSize, setMaxTeamSize] = useState(initialHackathon?.maxTeamSize || 4);
  const [maxParticipants, setMaxParticipants] = useState(initialHackathon?.maxParticipants || 1500);
  const [registrationFee, setRegistrationFee] = useState(initialHackathon?.registrationFee || 'Free');
  const [requireApproval, setRequireApproval] = useState(initialHackathon?.requireApproval || false);
  const [isInviteOnly, setIsInviteOnly] = useState(initialHackathon?.isInviteOnly || false);
  const [isWaitlistEnabled, setIsWaitlistEnabled] = useState(initialHackathon?.isWaitlistEnabled || true);
  const [audience, setAudience] = useState<'Everyone' | 'Students' | 'Professionals'>(initialHackathon?.audience || 'Everyone');
  const [prerequisites, setPrerequisites] = useState(initialHackathon?.prerequisites || 'Basic programming knowledge in Python, JS, or Rust');

  // Tracks & Problem Statements
  const [tracks, setTracks] = useState<HackathonTrack[]>(() => {
    if (!initialHackathon?.tracks || initialHackathon.tracks.length === 0) {
      return [
        { id: 'tr-1', hackathonId: 'h-1', name: 'Generative AI & Autonomous Agents', description: 'Build LLM agents, multi-agent frameworks, and multimodal tools.', color: '#9333ea' },
        { id: 'tr-2', hackathonId: 'h-1', name: 'Web3 & Decentralized Protocols', description: 'Zero-knowledge proofs, smart contract tools, and DeFi infrastructure.', color: '#4f46e5' },
        { id: 'tr-3', hackathonId: 'h-1', name: 'Smart Cities & GreenTech', description: 'IoT sensors, clean energy optimization, and sustainable mobility.', color: '#059669' }
      ];
    }
    return initialHackathon.tracks.map((t, idx) =>
      typeof t === 'string' ? { id: `tr-${idx}`, hackathonId: 'h-1', name: t, description: 'Track details...', color: '#7c3aed' } : t
    );
  });

  const [problemStatements, setProblemStatements] = useState<ProblemStatement[]>(initialHackathon?.problemStatements || [
    { id: 'ps-1', title: 'Autonomous Multi-Agent Workflow Engine', description: 'Develop an agentic framework capable of self-correcting code generation.', difficulty: 'Advanced' },
    { id: 'ps-2', title: 'Zero-Knowledge Identity Attestation', description: 'Create privacy-preserving identity verification for decentralized dApps.', difficulty: 'Intermediate' }
  ]);

  // STEP 4 — Prizes, Sponsors, Judges & Mentors State
  const [prizePool, setPrizePool] = useState(initialHackathon?.prizePool || '₹25,00,000');
  const [prizes, setPrizes] = useState<PrizeItem[]>(initialHackathon?.prizes || [
    { id: 'prz-1', title: 'Grand Winner (1st Place)', amount: '₹10,00,000', description: 'Cash Prize + Incubation Grant + Trophy' },
    { id: 'prz-2', title: 'Runner-Up (2nd Place)', amount: '₹6,00,000', description: 'Cash Prize + Fast-track Interview' },
    { id: 'prz-3', title: 'Best AI Innovation Award', amount: '₹4,00,000', description: 'Sponsored by TechCorp AI Labs' }
  ]);

  const [sponsors, setSponsors] = useState<HackathonSponsor[]>(initialHackathon?.sponsors || [
    { id: 'sp-1', name: 'TechCorp India Labs', tier: 'Title', website: 'https://techcorp.io', logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80' },
    { id: 'sp-2', name: 'Vercel India Hub', tier: 'Platinum', website: 'https://vercel.com', logo: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=100&q=80' }
  ]);

  const [judges, setJudges] = useState<HackathonJudge[]>(initialHackathon?.judges || [
    { id: 'jdg-1', name: 'Dr. Suresh Kumar', company: 'Google DeepMind', designation: 'Principal AI Researcher', expertise: 'Generative AI & LLMs', linkedin: 'https://linkedin.com' },
    { id: 'jdg-2', name: 'Elena Rostova', company: 'Vercel', designation: 'Head of Developer Relations', expertise: 'Frontend Architecture & DX', linkedin: 'https://linkedin.com' }
  ]);

  const [mentors, setMentors] = useState<HackathonMentor[]>(initialHackathon?.mentors || [
    { id: 'mnt-1', name: 'Shaik Ansar Ali', company: 'Incux AI', skills: 'Agentic Frameworks, PyTorch, React', availability: '10:00 AM - 4:00 PM IST', bio: 'Senior AI Engineer & Hackathon Mentor' }
  ]);

  // STEP 5 — Submissions, Rubrics, Resources & Launch State
  const [submissionConfig, setSubmissionConfig] = useState<SubmissionConfig>(initialHackathon?.submissionConfig || DEFAULT_SUBMISSION_CONFIG);
  const [rubrics, setRubrics] = useState<RubricCriteria[]>(initialHackathon?.rubrics || [
    { id: 'rub-1', name: 'Code Quality & Technical Execution', weight: 30, description: 'Clean architecture, error handling, and test coverage.' },
    { id: 'rub-2', name: 'Innovation & Originality', weight: 30, description: 'Uniqueness of technical solution and creative problem solving.' },
    { id: 'rub-3', name: 'UI / UX Design & Presentation', weight: 20, description: 'User experience, visual aesthetics, and pitch clarity.' },
    { id: 'rub-4', name: 'Real-World Business Impact', weight: 20, description: 'Market viability, scalability, and practical utility.' }
  ]);

  const [rules, setRules] = useState<string[]>(initialHackathon?.rules || [
    'All code must be written during the hackathon period.',
    'Plagiarism or pre-built commercial products are strictly prohibited.',
    'Generative AI assistance is permitted but must be declared upon submission.'
  ]);

  const [faqs, setFaqs] = useState<FAQItem[]>(initialHackathon?.faqs || [
    { id: 'faq-1', question: 'Who is eligible to participate?', answer: 'Developers, students, and working professionals worldwide are welcome.' },
    { id: 'faq-2', question: 'What is the registration fee?', answer: 'Registration is 100% free for all participants.' }
  ]);

  const [certificateSettings, setCertificateSettings] = useState<CertificateSettings>(initialHackathon?.certificateSettings || DEFAULT_CERTIFICATE_SETTINGS);
  const [seoSettings, setSeoSettings] = useState<SEOSettings>(initialHackathon?.seoSettings || DEFAULT_SEO_SETTINGS);

  // Auto-slug generator
  useEffect(() => {
    if (title && !initialHackathon?.slug) {
      setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  }, [title, initialHackathon]);

  // Auto-Save interval simulator
  useEffect(() => {
    const timer = setInterval(() => {
      setLastAutoSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // Calculate 0-100 Readiness Score
  const calculateReadinessScore = () => {
    let score = 0;
    if (title.trim()) score += 15;
    if (tagline.trim() && detailedDescription.trim()) score += 15;
    if (registrationStart && startDate && endDate) score += 20;
    if (tracks.length > 0) score += 15;
    if (prizes.length > 0) score += 15;
    if (rubrics.reduce((acc, r) => acc + (r.weight || 0), 0) === 100) score += 10;
    if (judges.length > 0) score += 10;
    return score;
  };

  const readinessScore = calculateReadinessScore();

  // Rubrics Weight Total Check
  const rubricWeightTotal = rubrics.reduce((acc, r) => acc + Number(r.weight || 0), 0);

  // Step Validation Checkers
  const isStep1Valid = Boolean(title.trim() && organizerName.trim());
  const isStep2Valid = Boolean(startDate && endDate && registrationStart && registrationEnd);
  const isStep3Valid = tracks.length > 0;
  const isStep4Valid = prizes.length > 0;
  const isStep5Valid = rubricWeightTotal === 100;

  // Assembly of Hackathon Object
  const getCompiledHackathonData = (): Hackathon => ({
    id: initialHackathon?.id || `org-h-${Date.now()}`,
    title,
    slug,
    tagline,
    description: shortDescription || tagline,
    shortDescription,
    detailedDescription,
    logo,
    banner,
    coverImage,
    status: (initialHackathon?.status || 'PUBLISHED') as any,
    mode,
    category: subcategory.trim() ? subcategory.trim() : category,
    subcategory: subcategory.trim(),
    difficulty,
    timezone,
    country,
    state: stateName,
    city,
    venue,
    mapsUrl,
    registrationStart,
    registrationEnd,
    teamFormationDeadline,
    startDate,
    endDate,
    submissionDeadline,
    evaluationStart,
    evaluationEnd,
    winnerAnnouncementDate,
    certDistributionDate,
    minTeamSize,
    maxTeamSize,
    maxParticipants,
    registrationFee,
    requireApproval,
    isInviteOnly,
    isWaitlistEnabled,
    audience,
    prerequisites,
    prizePool,
    prizeBreakdown: prizes,
    prizes,
    organizerName,
    website,
    supportEmail,
    supportPhone,
    socialLinks,
    tracks,
    problemStatements,
    sponsors,
    judges,
    mentors,
    submissionConfig,
    rubrics,
    rules,
    faqs,
    certificateSettings,
    seoSettings,
    updatedAt: new Date().toISOString(),
    createdAt: initialHackathon?.createdAt || new Date().toISOString()
  });

  const handleDraftSaveAction = () => {
    const data = getCompiledHackathonData();
    onSaveDraft(data);
    addToast({
      title: 'Draft Saved',
      message: `Draft "${title || 'Untitled Event'}" saved to your workspace.`,
      type: 'info',
      duration: 3000
    });
  };

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      addToast({ title: 'Validation Warning', message: 'Event title is required.', type: 'warning' });
      setCurrentStep(1);
      return;
    }
    if (rubricWeightTotal !== 100) {
      addToast({ title: 'Rubric Weight Error', message: 'Scoring rubric weights must sum to exactly 100%.', type: 'error' });
      setCurrentStep(5);
      return;
    }

    setIsPublishing(true);
    setTimeout(() => {
      const data = getCompiledHackathonData();
      onPublish(data);
      setIsPublishing(false);
    }, 600);
  };

  // Helper Handlers for Arrays
  const handleAddTrack = () => {
    const newTr: HackathonTrack = { id: `tr-${Date.now()}`, hackathonId: 'h-1', name: 'New Track Title', description: 'Track details...', color: '#7c3aed' };
    setTracks([...tracks, newTr]);
  };
  const handleRemoveTrack = (id: string) => setTracks(tracks.filter(t => t.id !== id));

  const handleAddProblemStatement = () => {
    const newPs: ProblemStatement = { id: `ps-${Date.now()}`, title: 'New Problem Statement', description: 'Context...', difficulty: 'Intermediate' };
    setProblemStatements([...problemStatements, newPs]);
  };
  const handleRemoveProblemStatement = (id: string) => setProblemStatements(problemStatements.filter(p => p.id !== id));

  const handleAddPrize = () => {
    const newPrz: PrizeItem = { id: `prz-${Date.now()}`, title: 'Special Recognition Award', amount: '₹1,00,00,000', description: 'Award details...' };
    setPrizes([...prizes, newPrz]);
  };
  const handleRemovePrize = (id: string) => setPrizes(prizes.filter(p => p.id !== id));

  const handleAddSponsor = () => {
    const newSp: HackathonSponsor = { id: `sp-${Date.now()}`, name: 'Sponsor Name', tier: 'Gold', website: 'https://sponsor.com' };
    setSponsors([...sponsors, newSp]);
  };
  const handleRemoveSponsor = (id: string) => setSponsors(sponsors.filter(s => s.id !== id));

  const handleAddJudge = () => {
    const newJdg: HackathonJudge = { id: `jdg-${Date.now()}`, name: 'New Judge Name', company: 'Tech Org', designation: 'Lead Architect', expertise: 'Artificial Intelligence' };
    setJudges([...judges, newJdg]);
  };
  const handleRemoveJudge = (id: string) => setJudges(judges.filter(j => j.id !== id));

  const handleAddMentor = () => {
    const newMnt: HackathonMentor = { id: `mnt-${Date.now()}`, name: 'Mentor Name', company: 'AI Startup', skills: 'Python, React', availability: 'Flexible' };
    setMentors([...mentors, newMnt]);
  };
  const handleRemoveMentor = (id: string) => setMentors(mentors.filter(m => m.id !== id));

  const handleAddRubric = () => {
    const newRub: RubricCriteria = { id: `rub-${Date.now()}`, name: 'Criteria Name', weight: 10, description: 'Evaluation criteria...' };
    setRubrics([...rubrics, newRub]);
  };
  const handleRemoveRubric = (id: string) => setRubrics(rubrics.filter(r => r.id !== id));

  return (
    <div className="space-y-6">
      
      {/* Top Action & Step Stepper Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        
        {/* Header Action Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-600" />
                <span>{initialHackathon ? 'Edit Hackathon Configuration' : 'Enterprise Hackathon Studio'}</span>
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                Auto-Saved ({lastAutoSaved})
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Configure 5 consolidated modules: Branding, Format & Timeline, Tracks, Prizes & Panel, and Launch Audit.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowPreviewModal(true)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-4 h-4 text-slate-500" />
              <span>Live Preview</span>
            </button>

            <button
              onClick={handleDraftSaveAction}
              className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs rounded-2xl transition-colors flex items-center gap-1.5 cursor-pointer border border-purple-200/60"
            >
              <Save className="w-4 h-4" />
              <span>Save Draft</span>
            </button>

            <button
              onClick={onCancel}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* 5 Consolidated Stepper Pills */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
          {[
            { step: 1, title: '1. Identity & Branding', icon: Building2, valid: isStep1Valid },
            { step: 2, title: '2. Format & Timeline', icon: CalendarIcon, valid: isStep2Valid },
            { step: 3, title: '3. Reg & Tracks', icon: Layers, valid: isStep3Valid },
            { step: 4, title: '4. Prizes & Panel', icon: Trophy, valid: isStep4Valid },
            { step: 5, title: '5. Rubrics & Launch', icon: ShieldCheck, valid: isStep5Valid },
          ].map((s) => {
            const Icon = s.icon;
            const isCurrent = currentStep === s.step;
            const isCompleted = currentStep > s.step;

            return (
              <button
                key={s.step}
                type="button"
                onClick={() => setCurrentStep(s.step as any)}
                className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                  isCurrent
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent shadow-md shadow-purple-200'
                    : isCompleted
                    ? 'bg-purple-50/80 text-purple-800 border-purple-200/80 hover:bg-purple-100/80'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon className={`w-4 h-4 ${isCurrent ? 'text-white' : 'text-purple-600'}`} />
                  {s.valid && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                </div>
                <span className="font-extrabold text-xs mt-2 truncate">{s.title}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Main Form Content Engine (Full Width Max-5XL Centered) */}
      <main className="max-w-5xl mx-auto space-y-6">
          
          {/* STEP 1 — IDENTITY & BRANDING */}
          {currentStep === 1 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <div>
                <h3 className="text-xl font-black text-slate-900">Step 1: Event Identity & Branding</h3>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">Specify basic information, logo, banner URLs, support contacts, and slug</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-600 block mb-1.5">HACKATHON NAME *</label>
                  <input
                    type="text"
                    placeholder="e.g. Global AI & Web3 Innovation Summit 2026"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-4 py-3 text-xs font-bold rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-purple-500 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-600 block mb-1.5">TAGLINE</label>
                    <input
                      type="text"
                      placeholder="e.g. Build state-of-the-art autonomous AI agents"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs font-semibold rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-600 block mb-1.5">CUSTOM URL SLUG</label>
                    <input
                      type="text"
                      placeholder="e.g. ai-web3-innovation-2026"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs font-mono font-bold rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white text-indigo-600 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-600 block mb-1.5">SHORT DESCRIPTION</label>
                  <textarea
                    rows={2}
                    placeholder="Brief 1-2 sentence overview of the event..."
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs font-medium rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-600 block mb-1.5">DETAILED PROBLEM STATEMENT & RICH CONTEXT</label>
                  <textarea
                    rows={5}
                    placeholder="Comprehensive description of challenge objectives, background, and expectations..."
                    value={detailedDescription}
                    onChange={(e) => setDetailedDescription(e.target.value)}
                    className="w-full px-4 py-3 text-xs font-medium rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white outline-none"
                  />
                </div>

                {/* Media Images URLs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-600 block mb-1.5">LOGO IMAGE URL</label>
                    <input
                      type="text"
                      value={logo}
                      onChange={(e) => setLogo(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-600 block mb-1.5">BANNER IMAGE URL</label>
                    <input
                      type="text"
                      value={banner}
                      onChange={(e) => setBanner(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-600 block mb-1.5">COVER IMAGE URL</label>
                    <input
                      type="text"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200"
                    />
                  </div>
                </div>

                {/* Organizer & Support Contacts */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-600 block mb-1.5">ORGANIZER NAME</label>
                    <input
                      type="text"
                      value={organizerName}
                      onChange={(e) => setOrganizerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl bg-slate-50 border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-600 block mb-1.5">SUPPORT EMAIL</label>
                    <input
                      type="email"
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl bg-slate-50 border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-600 block mb-1.5">SUPPORT PHONE</label>
                    <input
                      type="text"
                      value={supportPhone}
                      onChange={(e) => setSupportPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl bg-slate-50 border border-slate-200"
                    />
                  </div>
                </div>

              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs rounded-2xl shadow-md flex items-center gap-2 hover:from-purple-700 hover:to-indigo-700 transition-all cursor-pointer"
                >
                  <span>Next: Format & Timeline</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 — FORMAT, LOCATION & TIMELINE */}
          {currentStep === 2 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <div>
                <h3 className="text-xl font-black text-slate-900">Step 2: Event Format, Location & Timeline Matrix</h3>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">Configure event mode, categories, location address, and 8 milestone dates</p>
              </div>

              <div className="space-y-5">
                
                {/* Event Mode Chips */}
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-600 block mb-1.5">EVENT MODE</label>
                  <div className="flex items-center gap-3">
                    {(['ONLINE', 'HYBRID', 'IN_PERSON'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMode(m)}
                        className={`flex-1 py-2.5 rounded-2xl text-xs font-extrabold uppercase transition-all cursor-pointer border ${
                          mode === m
                            ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {m.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category, Subcategory & Difficulty */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-600 block mb-1.5">
                      MAIN CATEGORY
                    </label>
                    <select
                      value={category}
                      onChange={(e) => {
                        const selectedVal = e.target.value;
                        setCategory(selectedVal);
                        if (selectedVal !== 'Custom / Other Subcategory') {
                          setSubcategory('');
                        }
                      }}
                      className="w-full px-3.5 py-2.5 text-xs font-bold rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-purple-500 outline-none"
                    >
                      <option>AI & Machine Learning</option>
                      <option>Web3 & Blockchain</option>
                      <option>FinTech & DeFi</option>
                      <option>Smart Cities & GreenTech</option>
                      <option>Healthcare & Biotech</option>
                      <option>Open Innovation</option>
                      <option value="Custom / Other Subcategory">➕ Custom / Other Subcategory</option>
                    </select>
                  </div>

                  <div>
                    <label className={`text-[10px] font-black uppercase block mb-1.5 ${category === 'Custom / Other Subcategory' ? 'text-purple-700' : 'text-slate-400 opacity-60'}`}>
                      SUBCATEGORY (CUSTOM TEXT) {category !== 'Custom / Other Subcategory' && '(DISABLED)'}
                    </label>
                    <input
                      type="text"
                      placeholder={category === 'Custom / Other Subcategory' ? "Type custom subcategory..." : "Select 'Custom / Other Subcategory' above"}
                      value={subcategory}
                      disabled={category !== 'Custom / Other Subcategory'}
                      onChange={(e) => setSubcategory(e.target.value)}
                      className={`w-full px-3.5 py-2.5 text-xs font-semibold rounded-2xl border outline-none transition-all ${
                        category === 'Custom / Other Subcategory'
                          ? 'bg-purple-50/50 border-purple-300 text-slate-900 focus:bg-white focus:border-purple-600 shadow-2xs'
                          : 'bg-slate-100/70 border-slate-200 text-slate-400 cursor-not-allowed opacity-60 select-none'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-600 block mb-1.5">DIFFICULTY</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 text-xs font-bold rounded-2xl bg-slate-50 border border-slate-200 outline-none"
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                      <option>All Levels</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-600 block mb-1.5">TIMEZONE</label>
                    <input
                      type="text"
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-2xl bg-slate-50 border border-slate-200"
                    />
                  </div>
                </div>

                {/* Physical Location Details (if Offline or Hybrid) */}
                {mode !== 'ONLINE' && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">OFFLINE VENUE LOCATION</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} className="px-3 py-2 text-xs rounded-xl bg-white border border-slate-200" />
                      <input type="text" placeholder="State" value={stateName} onChange={(e) => setStateName(e.target.value)} className="px-3 py-2 text-xs rounded-xl bg-white border border-slate-200" />
                      <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="px-3 py-2 text-xs rounded-xl bg-white border border-slate-200" />
                    </div>
                    <input type="text" placeholder="Full Venue Address" value={venue} onChange={(e) => setVenue(e.target.value)} className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200" />
                  </div>
                )}

                {/* Milestone Dates Grid */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">MILESTONE TIMELINE DATES</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
                    <div>
                      <label className="text-[10px] uppercase text-slate-500 block mb-1">REGISTRATION OPENS</label>
                      <input type="datetime-local" value={registrationStart} onChange={(e) => setRegistrationStart(e.target.value)} className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase text-slate-500 block mb-1">REGISTRATION CLOSES</label>
                      <input type="datetime-local" value={registrationEnd} onChange={(e) => setRegistrationEnd(e.target.value)} className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase text-slate-500 block mb-1">HACKING STARTS</label>
                      <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase text-slate-500 block mb-1">SUBMISSION DEADLINE</label>
                      <input type="datetime-local" value={submissionDeadline} onChange={(e) => setSubmissionDeadline(e.target.value)} className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200" />
                    </div>
                  </div>
                </div>

              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs rounded-2xl shadow-md flex items-center gap-2 hover:from-purple-700 hover:to-indigo-700 transition-all cursor-pointer"
                >
                  <span>Next: Reg & Tracks</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — REGISTRATION RULES, ELIGIBILITY & TRACKS */}
          {currentStep === 3 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <div>
                <h3 className="text-xl font-black text-slate-900">Step 3: Registration Rules, Eligibility & Tracks</h3>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">Define team limits, registration fees, target audience, tracks, and problem statements</p>
              </div>

              <div className="space-y-5">
                
                {/* Team Sizes & Fee */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-600 block mb-1.5">MIN TEAM SIZE</label>
                    <input type="number" min={1} max={10} value={minTeamSize} onChange={(e) => setMinTeamSize(Number(e.target.value))} className="w-full px-3.5 py-2.5 text-xs font-bold rounded-2xl bg-slate-50 border border-slate-200" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-600 block mb-1.5">MAX TEAM SIZE</label>
                    <input type="number" min={1} max={10} value={maxTeamSize} onChange={(e) => setMaxTeamSize(Number(e.target.value))} className="w-full px-3.5 py-2.5 text-xs font-bold rounded-2xl bg-slate-50 border border-slate-200" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-600 block mb-1.5">REGISTRATION FEE</label>
                    <input type="text" value={registrationFee} onChange={(e) => setRegistrationFee(e.target.value)} className="w-full px-3.5 py-2.5 text-xs font-bold rounded-2xl bg-slate-50 border border-slate-200 text-emerald-600" />
                  </div>
                </div>

                {/* Dynamic Tracks Section */}
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">CHALLENGE TRACKS ({tracks.length})</h4>
                    <button type="button" onClick={handleAddTrack} className="px-3 py-1.5 bg-purple-50 text-purple-700 font-bold text-xs rounded-xl hover:bg-purple-100 transition-colors flex items-center gap-1 cursor-pointer">
                      <Plus className="w-3.5 h-3.5" /> Add Track
                    </button>
                  </div>

                  <div className="space-y-3">
                    {tracks.map((tr) => (
                      <div key={tr.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 relative">
                        <div className="flex justify-between items-center gap-2">
                          <input type="text" value={tr.name} onChange={(e) => setTracks(tracks.map(t => t.id === tr.id ? { ...t, name: e.target.value } : t))} className="font-bold text-xs text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 flex-1 outline-none" />
                          <button type="button" onClick={() => handleRemoveTrack(tr.id)} className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <input type="text" value={tr.description || ''} onChange={(e) => setTracks(tracks.map(t => t.id === tr.id ? { ...t, description: e.target.value } : t))} placeholder="Track description..." className="w-full text-xs text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 outline-none" />
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setCurrentStep(2)} className="px-5 py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-2xl flex items-center gap-1.5 cursor-pointer">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button type="button" onClick={() => setCurrentStep(4)} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs rounded-2xl shadow-md flex items-center gap-2 hover:from-purple-700 hover:to-indigo-700 cursor-pointer">
                  <span>Next: Prizes & Panel</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 — PRIZES, SPONSORS, JUDGES & MENTORS */}
          {currentStep === 4 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <div>
                <h3 className="text-xl font-black text-slate-900">Step 4: Prizes, Sponsors, Judges & Mentors</h3>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">Configure award breakdowns, corporate sponsors, judges, and mentors</p>
              </div>

              <div className="space-y-6">
                
                {/* Prizes Builder */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">PRIZE BREAKDOWN ({prizes.length})</h4>
                    <button type="button" onClick={handleAddPrize} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-xl hover:bg-emerald-100 flex items-center gap-1 cursor-pointer">
                      <Plus className="w-3.5 h-3.5" /> Add Prize
                    </button>
                  </div>

                  <div className="space-y-3">
                    {prizes.map((p) => (
                      <div key={p.id} className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
                        <div className="flex justify-between items-center gap-2">
                          <input type="text" value={p.title} onChange={(e) => setPrizes(prizes.map(item => item.id === p.id ? { ...item, title: e.target.value } : item))} className="font-bold text-xs text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 flex-1" />
                          <input type="text" value={p.amount} onChange={(e) => setPrizes(prizes.map(item => item.id === p.id ? { ...item, amount: e.target.value } : item))} className="font-bold text-xs text-emerald-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 w-32" />
                          <button type="button" onClick={() => handleRemovePrize(p.id!)} className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Judges Builder */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">JUDGES PANEL ({judges.length})</h4>
                    <button type="button" onClick={handleAddJudge} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-xl hover:bg-indigo-100 flex items-center gap-1 cursor-pointer">
                      <Plus className="w-3.5 h-3.5" /> Add Judge
                    </button>
                  </div>

                  <div className="space-y-3">
                    {judges.map((j) => (
                      <div key={j.id} className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 space-y-2">
                        <div className="flex justify-between items-center gap-2">
                          <input type="text" value={j.name} onChange={(e) => setJudges(judges.map(item => item.id === j.id ? { ...item, name: e.target.value } : item))} className="font-bold text-xs text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 flex-1" />
                          <input type="text" value={j.company} onChange={(e) => setJudges(judges.map(item => item.id === j.id ? { ...item, company: e.target.value } : item))} placeholder="Company" className="text-xs text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 w-36" />
                          <button type="button" onClick={() => handleRemoveJudge(j.id)} className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setCurrentStep(3)} className="px-5 py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-2xl flex items-center gap-1.5 cursor-pointer">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button type="button" onClick={() => setCurrentStep(5)} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs rounded-2xl shadow-md flex items-center gap-2 hover:from-purple-700 hover:to-indigo-700 cursor-pointer">
                  <span>Next: Rubrics & Launch Audit</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5 — SUBMISSIONS, RUBRICS & LAUNCH AUDIT */}
          {currentStep === 5 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <div>
                <h3 className="text-xl font-black text-slate-900">Step 5: Rubrics & Launch Audit</h3>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">Define weighted evaluation rubrics (must equal 100%) and launch event</p>
              </div>

              <div className="space-y-6">
                
                {/* Rubrics Builder */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">EVALUATION RUBRICS</h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${rubricWeightTotal === 100 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        Total Weight: {rubricWeightTotal}%
                      </span>
                    </div>

                    <button type="button" onClick={handleAddRubric} className="px-3 py-1.5 bg-purple-50 text-purple-700 font-bold text-xs rounded-xl hover:bg-purple-100 flex items-center gap-1 cursor-pointer">
                      <Plus className="w-3.5 h-3.5" /> Add Rubric
                    </button>
                  </div>

                  <div className="space-y-3">
                    {rubrics.map((r) => (
                      <div key={r.id} className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100 space-y-2">
                        <div className="flex justify-between items-center gap-2">
                          <input type="text" value={r.name} onChange={(e) => setRubrics(rubrics.map(item => item.id === r.id ? { ...item, name: e.target.value } : item))} className="font-bold text-xs text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 flex-1" />
                          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-slate-200">
                            <span className="text-[10px] font-black uppercase text-slate-400">Weight:</span>
                            <input type="number" min={0} max={100} value={r.weight} onChange={(e) => setRubrics(rubrics.map(item => item.id === r.id ? { ...item, weight: Number(e.target.value) } : item))} className="w-12 text-xs font-black text-purple-700 outline-none text-right" />
                            <span className="text-xs font-black">%</span>
                          </div>
                          <button type="button" onClick={() => handleRemoveRubric(r.id)} className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Launch Action */}
                <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white space-y-4 shadow-xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-black text-base">Ready to Launch Event</h4>
                      <p className="text-xs text-slate-300">Publish your hackathon to live workspace and platform portal</p>
                    </div>
                    <span className="text-xs font-black bg-emerald-500 text-white px-3 py-1 rounded-full uppercase">
                      {readinessScore}% Score
                    </span>
                  </div>

                  <button
                    onClick={handlePublishSubmit}
                    disabled={isPublishing || rubricWeightTotal !== 100}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-sm rounded-2xl shadow-lg transition-all cursor-pointer disabled:opacity-40 flex items-center justify-center gap-2"
                  >
                    <span>🚀</span>
                    <span>{isPublishing ? 'Publishing Event...' : 'Publish Hackathon to Live Platform'}</span>
                  </button>
                </div>

              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setCurrentStep(4)} className="px-5 py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-2xl flex items-center gap-1.5 cursor-pointer">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              </div>
            </div>
          )}
        </main>

      {/* Live Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4 border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                <Eye className="w-5 h-5 text-purple-600" /> Live Hackathon Portal Preview
              </h3>
              <button onClick={() => setShowPreviewModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="relative h-48 rounded-2xl overflow-hidden bg-slate-900">
                <img src={banner} alt="Banner" className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent p-5 flex flex-col justify-between">
                  <span className="self-start px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500 text-white">
                    {mode}
                  </span>
                  <div>
                    <h2 className="text-white font-black text-xl leading-snug">{title || 'Untitled Event'}</h2>
                    <p className="text-slate-300 text-xs mt-1">{tagline}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-800 font-bold">
                  <p className="text-[9px] uppercase text-slate-400">Prize Pool</p>
                  <p className="text-sm font-black">{prizePool}</p>
                </div>
                <div className="p-3 bg-slate-100 rounded-2xl text-slate-800 font-bold">
                  <p className="text-[9px] uppercase text-slate-400">Team Size</p>
                  <p className="text-sm font-black">{minTeamSize} — {maxTeamSize} Ppl</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-2xl text-purple-800 font-bold">
                  <p className="text-[9px] uppercase text-slate-400">Fee</p>
                  <p className="text-sm font-black">{registrationFee}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 space-y-2">
                <h4 className="font-bold text-slate-900">Detailed Description</h4>
                <p className="text-slate-600 leading-relaxed">{detailedDescription || shortDescription || 'No description provided.'}</p>
              </div>
            </div>

            <button onClick={() => setShowPreviewModal(false)} className="w-full py-3 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800">
              Close Live Preview
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
