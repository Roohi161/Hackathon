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
  CheckCircle2
} from 'lucide-react';
import type { Hackathon } from '../../types';

interface HackathonDetailProps {
  hackathon: Hackathon;
  onBack: () => void;
  onOpenTeamRegistration: (hackathon: Hackathon) => void;
  onOpenSubmissionModal: (hackathon: Hackathon) => void;
}

export const HackathonDetail: React.FC<HackathonDetailProps> = ({
  hackathon,
  onBack,
  onOpenTeamRegistration,
  onOpenSubmissionModal
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'problems' | 'rubrics' | 'schedule' | 'rules'>('overview');
  
  // Real-time Countdown Timer State
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(hackathon.endDate).getTime();
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
  }, [hackathon.endDate]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-900/60 hover:bg-gray-800 text-xs font-medium text-gray-300 border border-white/10 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Hackathons
      </button>

      {/* Header Banner Section */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-2xl">
        <div className="h-64 sm:h-80 w-full relative">
          <img
            src={hackathon.banner}
            alt={hackathon.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-transparent" />
        </div>

        {/* Floating Content Over Banner */}
        <div className="relative -mt-32 p-6 sm:p-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
                <span>Organized by {hackathon.organizerName}</span>
                {hackathon.organizerVerified && (
                  <span title="Verified Host">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white">{hackathon.title}</h1>
              <p className="text-gray-300 text-sm max-w-2xl">{hackathon.tagline}</p>
            </div>

            {/* Countdown Box */}
            <div className="p-4 rounded-2xl glass-card border border-indigo-500/30 text-center min-w-[260px] shadow-xl">
              <div className="flex items-center justify-center gap-1.5 text-xs text-indigo-300 font-semibold mb-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>SUBMISSION COUNTDOWN</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center font-mono">
                <div className="p-2 rounded-lg bg-gray-900/80 border border-white/10">
                  <span className="block text-xl font-bold text-white">{timeLeft.days}</span>
                  <span className="text-[10px] text-gray-400">DAYS</span>
                </div>
                <div className="p-2 rounded-lg bg-gray-900/80 border border-white/10">
                  <span className="block text-xl font-bold text-white">{timeLeft.hours}</span>
                  <span className="text-[10px] text-gray-400">HRS</span>
                </div>
                <div className="p-2 rounded-lg bg-gray-900/80 border border-white/10">
                  <span className="block text-xl font-bold text-white">{timeLeft.minutes}</span>
                  <span className="text-[10px] text-gray-400">MIN</span>
                </div>
                <div className="p-2 rounded-lg bg-gray-900/80 border border-white/10">
                  <span className="block text-xl font-bold text-indigo-400 animate-pulse">{timeLeft.seconds}</span>
                  <span className="text-[10px] text-gray-400">SEC</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-800">
            <button
              onClick={() => onOpenTeamRegistration(hackathon)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-white gradient-bg hover:opacity-95 shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <UserPlus className="w-4 h-4" /> Register Team / Join Code
            </button>

            <button
              onClick={() => onOpenSubmissionModal(hackathon)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-indigo-300 bg-indigo-950/80 border border-indigo-500/40 hover:bg-indigo-900/90 shadow-md transition-all transform hover:-translate-y-0.5"
            >
              <Send className="w-4 h-4 text-indigo-400" /> Submit Demo Project
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-gray-800 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'overview'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-900'
          }`}
        >
          Overview & Prizes
        </button>
        <button
          onClick={() => setActiveTab('problems')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'problems'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-900'
          }`}
        >
          Problem Statements ({hackathon.problemStatements.length})
        </button>
        <button
          onClick={() => setActiveTab('rubrics')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'rubrics'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-900'
          }`}
        >
          Judging Rubrics
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'schedule'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-900'
          }`}
        >
          Schedule Timeline
        </button>
        <button
          onClick={() => setActiveTab('rules')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'rules'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-900'
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
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" /> Total Prize Pool: {hackathon.prizePool}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {hackathon.prizeBreakdown.map((prize, idx) => (
                  <div key={idx} className="p-4 rounded-2xl glass-card border border-amber-500/20 space-y-2">
                    <span className="text-base font-bold text-amber-300 block">{prize.title}</span>
                    <span className="text-2xl font-extrabold text-white block">{prize.amount}</span>
                    {prize.description && (
                      <p className="text-xs text-gray-400 leading-relaxed">{prize.description}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Tracks */}
              <div className="pt-4 space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" /> Tracks & Focus Areas
                </h4>
                <div className="flex flex-wrap gap-2">
                  {hackathon.tracks.map((t, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-xl bg-indigo-950/60 border border-indigo-700/40 text-xs font-medium text-indigo-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Metadata Sidebar */}
            <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
              <h4 className="font-bold text-white text-sm pb-2 border-b border-gray-800">Event Details</h4>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Start Date</span>
                  <span className="text-white font-medium">{new Date(hackathon.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> End Date</span>
                  <span className="text-white font-medium">{new Date(hackathon.endDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Format</span>
                  <span className="text-indigo-400 font-medium capitalize">{hackathon.mode}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Registered Hackers</span>
                  <span className="text-white font-mono">{hackathon.participantsCount}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'problems' && (
          <div className="space-y-4">
            {hackathon.problemStatements.map((ps) => (
              <div key={ps.id} className="p-6 rounded-2xl glass-panel border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    Track: {ps.track}
                  </span>
                  <span className="text-xs text-amber-400 font-medium">Difficulty: {ps.difficulty}</span>
                </div>
                <h4 className="text-base font-bold text-white">{ps.title}</h4>
                <p className="text-xs text-gray-300 leading-relaxed">{ps.description}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'rubrics' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {hackathon.rubrics.map((rub) => (
              <div key={rub.id} className="p-5 rounded-2xl glass-card border border-indigo-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{rub.name}</span>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold">
                    {rub.weight}% Weight
                  </span>
                </div>
                <p className="text-xs text-gray-300">{rub.description}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="relative pl-6 border-l-2 border-indigo-500/30 space-y-6">
            {hackathon.schedule.map((item, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-indigo-500 border-4 border-gray-950 group-hover:scale-125 transition-transform" />
                <div className="p-4 rounded-xl glass-card border border-white/5 space-y-1">
                  <span className="text-xs font-mono text-indigo-400 font-bold">{item.time}</span>
                  <h4 className="font-semibold text-white text-sm">{item.event}</h4>
                  {item.description && <p className="text-xs text-gray-400">{item.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-3">
            <h4 className="font-bold text-white text-sm mb-2">Official Rules & Guidelines</h4>
            <ul className="space-y-2 text-xs text-gray-300">
              {hackathon.rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
