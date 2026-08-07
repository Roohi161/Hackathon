import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Trophy,
  Users,
  ShieldCheck,
  Clock,
  Send,
  UserPlus,
  Layers,
  CheckCircle2,
  FolderCode
} from 'lucide-react';
import type { Hackathon } from '../../types';

import { useParams, useNavigate } from 'react-router-dom';
import { useHackathonStore } from '../../stores/hackathonStore';

import { RegistrationModal } from './RegistrationModal';

interface HackathonDetailProps {
  hackathon?: Hackathon;
  onBack?: () => void;
  onOpenTeamRegistration?: (hackathon: Hackathon) => void;
  onOpenSubmissionModal?: (hackathon: Hackathon) => void;
}

export const HackathonDetail: React.FC<HackathonDetailProps> = ({
  hackathon: propsHackathon,
  onBack,
  onOpenTeamRegistration,
  onOpenSubmissionModal
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const storeHackathons = useHackathonStore((s) => s.hackathons);
  
  const allHackathons = storeHackathons || [];
  const hackathon = (propsHackathon && propsHackathon.id) ? propsHackathon : (allHackathons.find((h: any) => h.id === id) || null);

  // Lookup registration status from localStorage
  const getRegistrationRecord = () => {
    try {
      const saved = localStorage.getItem('hc_global_registrations');
      if (saved) {
        const list = JSON.parse(saved);
        return list.find((item: any) => item.hackathonId === hackathon?.id);
      }
    } catch {
      // ignore
    }
    return null;
  };

  const regRecord = getRegistrationRecord();
  const registrationStatus = regRecord?.status || 'APPROVED';

  const handleBackAction = () => {
    if (onBack) {
      onBack();
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/hackathons');
    }
  };
  const [activeTab, setActiveTab] = useState<'overview' | 'problems' | 'rubrics' | 'schedule' | 'rules'>('overview');
  
  // Registration Modal State
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Real-time Countdown Timer State
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(hackathon?.endDate || Date.now()).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [hackathon]);

  if (!hackathon) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Hackathon Not Found</h2>
        <button
          onClick={handleBackAction}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-sm hover:bg-indigo-700"
        >
          Back to Hackathons List
        </button>
      </div>
    );
  }

  const problemStatementsList = hackathon.problemStatements || [];
  const prizeBreakdownList = hackathon.prizeBreakdown || hackathon.prizes || [];
  const tracksList = hackathon.tracks || [];
  const rubricsList = hackathon.rubrics || [];
  const scheduleList = hackathon.schedule || [];
  const rulesList = hackathon.rules || [];

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(hackathon?.endDate || Date.now()).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [hackathon]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Back Button */}
      <button
        onClick={handleBackAction}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 shadow-sm transition-all hover:border-slate-300 active:scale-95 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 text-slate-500" /> Back to Hackathons
      </button>

      {/* Header Banner Section */}
      <div className="rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-xl">
        {/* Cover Image */}
        <div className="h-48 sm:h-64 w-full relative overflow-hidden bg-slate-950">
          <img
            src={hackathon.banner}
            alt={hackathon.title}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-700 shadow-2xs">
                <span>Organized by {hackathon.organizerName}</span>
                {hackathon.organizerVerified && (
                  <span title="Verified Host">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {hackathon.title}
              </h1>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
                {hackathon.tagline}
              </p>
            </div>

            {/* Countdown Box */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center min-w-[280px] shadow-sm">
              <div className="flex items-center justify-center gap-1.5 text-xs text-indigo-700 font-extrabold tracking-wider mb-3">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>SUBMISSION COUNTDOWN</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center font-mono">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <span className="block text-2xl font-black text-slate-900">{timeLeft.days}</span>
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider">DAYS</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <span className="block text-2xl font-black text-slate-900">{timeLeft.hours}</span>
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider">HRS</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <span className="block text-2xl font-black text-slate-900">{timeLeft.minutes}</span>
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider">MIN</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <span className="block text-2xl font-black text-indigo-600 animate-pulse">{timeLeft.seconds}</span>
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider">SEC</span>
                </div>
              </div>
            </div>
          </div>

          {/* Registration Status Banner if Under Review or Rejected */}
          {regRecord && (
            <div className="pt-4 border-t border-slate-100">
              {registrationStatus === 'APPROVED' && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span><strong>Registration Approved!</strong> You have full access to problem statements, rubrics, and submission workspace.</span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-600 text-white">APPROVED</span>
                </div>
              )}
              {registrationStatus === 'UNDER_REVIEW' && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-600 shrink-0 animate-spin" />
                    <span><strong>Registration Under Review:</strong> The organizer is reviewing your application. Full problem statements and rubrics will unlock upon approval.</span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-amber-500 text-white">UNDER REVIEW</span>
                </div>
              )}
              {registrationStatus === 'REJECTED' && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-rose-600 shrink-0" />
                    <span><strong>Registration Declined:</strong> Your application for this hackathon was not accepted by the organizer.</span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-rose-600 text-white">REJECTED</span>
                </div>
              )}
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-slate-100">
            {registrationStatus === 'APPROVED' && (
              <button
                onClick={() => {
                  if (onOpenSubmissionModal) onOpenSubmissionModal(hackathon);
                  else navigate('/projects');
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-200 transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <FolderCode className="w-4 h-4" /> Submit Project / Files
              </button>
            )}

            <button
              onClick={() => {
                if (onOpenTeamRegistration) onOpenTeamRegistration(hackathon);
                setIsRegisterModalOpen(true);
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all active:scale-95 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" /> {regRecord ? 'Update Registration' : 'Register for Hackathon'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Overview & Prizes
        </button>
        <button
          onClick={() => setActiveTab('problems')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'problems'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Problem Statements ({problemStatementsList.length})
        </button>
        <button
          onClick={() => setActiveTab('rubrics')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'rubrics'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Judging Rubrics
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'schedule'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Schedule Timeline
        </button>
        <button
          onClick={() => setActiveTab('rules')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'rules'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Rules & Guidelines
        </button>
      </div>

      {/* Tab Contents */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Prizes List */}
            <div className="lg:col-span-2 space-y-5">
              <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
                <Trophy className="w-5 h-5 text-amber-500" /> Total Prize Pool: {hackathon.prizePool}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(hackathon.prizeBreakdown || []).map((prize: any, idx: number) => (
                  <div key={idx} className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2 shadow-xs">
                    <span className="text-sm font-bold text-amber-900 block">{prize.title}</span>
                    <span className="text-2xl font-black text-amber-600 block">{prize.amount}</span>
                    {prize.description && (
                      <p className="text-xs text-amber-800/80 leading-relaxed font-medium">{prize.description}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Tracks */}
              <div className="pt-4 space-y-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" /> Tracks & Focus Areas
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(hackathon.tracks || []).map((t: any, idx: number) => {
                    const trackName = typeof t === 'string' ? t : (t?.name || 'Track');
                    return (
                      <span key={idx} className="px-3.5 py-2 rounded-xl bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-700 shadow-2xs">
                        {trackName}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Metadata Sidebar */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm">
              <h4 className="font-bold text-slate-900 text-sm pb-3 border-b border-slate-100 uppercase tracking-wider">Event Details</h4>
              <div className="space-y-3 text-xs font-medium">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" /> Start Date</span>
                  <span className="text-slate-900 font-bold">{new Date(hackathon.startDate || Date.now()).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /> End Date</span>
                  <span className="text-slate-900 font-bold">{new Date(hackathon.endDate || Date.now()).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> Format</span>
                  <span className="text-indigo-600 font-bold capitalize">{hackathon.mode}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-slate-400" /> Registered Hackers</span>
                  <span className="text-slate-900 font-mono font-bold">{hackathon.participantsCount || 0}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'problems' && (
          <div className="space-y-4">
            {(hackathon.problemStatements || []).map((ps: any) => (
              <div key={ps.id} className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    Track: {ps.track}
                  </span>
                  <span className="text-xs text-amber-600 font-bold">Difficulty: {ps.difficulty}</span>
                </div>
                <h4 className="text-base font-bold text-slate-900">{ps.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{ps.description}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'rubrics' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(hackathon.rubrics || []).map((rub: any) => (
              <div key={rub.id} className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{rub.name}</span>
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-mono text-xs font-bold border border-indigo-100">
                    {rub.weight}% Weight
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">{rub.description}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="relative pl-6 border-l-2 border-indigo-200 space-y-6">
            {(hackathon.schedule || []).map((item: any, idx: number) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-indigo-600 border-4 border-white shadow-sm group-hover:scale-125 transition-transform" />
                <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-sm">
                  <span className="text-xs font-mono text-indigo-600 font-bold">{item.time}</span>
                  <h4 className="font-bold text-slate-900 text-sm">{item.event}</h4>
                  {item.description && <p className="text-xs text-slate-500 font-medium">{item.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm">
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider pb-2 border-b border-slate-100">Official Rules & Guidelines</h4>
            <ul className="space-y-3 text-xs text-slate-600 font-medium">
              {(hackathon.rules || []).map((rule: any, idx: number) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Registration Form Step-by-Step Modal */}
      <RegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        hackathon={hackathon}
      />
    </div>
  );
};
