import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Trophy,
  Users,
  ShieldCheck,
  Megaphone,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  FolderCode,
  Link2,
  MapPin,
  Globe,
  MessageCircle,
  BookOpen,
  Sparkles,
  ChevronRight,
  Phone,
  Mail,
  Building,
  Briefcase,
  Scale,
  BellRing
} from 'lucide-react';
import type { Hackathon } from '../../types';
import { useHackathonStore } from '../../stores/hackathonStore';
import { useNotificationStore } from '../../stores/notificationStore';
import { registrationApi } from '../../services/registrationApi';
import { ProgressRing } from '../ui/ProgressRing';
import { BarChart } from '../ui/BarChart';

interface ApprovedHackathonDashboardProps {
  hackathon?: Hackathon;
  onBack?: () => void;
}

interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const formatDate = (value?: string) => {
  if (!value) return '—';
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
};

const formatTime = (value?: string) => {
  if (!value) return '';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const getCountdown = (target: string): CountdownParts | null => {
  const t = new Date(target).getTime();
  if (isNaN(t)) return null;
  const diff = t - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60)
  };
};

const isUrgent = (target?: string) => {
  if (!target) return false;
  const t = new Date(target).getTime();
  if (isNaN(t)) return false;
  const diff = t - Date.now();
  return diff > 0 && diff <= 48 * 60 * 60 * 1000;
};

export const ApprovedHackathonDashboard: React.FC<ApprovedHackathonDashboardProps> = ({ hackathon: propsHackathon, onBack }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const storeHackathons = useHackathonStore((s) => s.hackathons);
  const announcements = useNotificationStore((s) => s.announcements);

  const hackathon = (propsHackathon && propsHackathon.id) ? propsHackathon : (storeHackathons.find((h: any) => h.id === id) || null);

  const [registration, setRegistration] = useState<any | null>(null);

  useEffect(() => {
    if (!hackathon) return;
    let cancelled = false;
    registrationApi.getAll()
      .then((list) => {
        if (cancelled || !Array.isArray(list)) return;
        const mine = list.find((r: any) => r.hackathonId === hackathon.id);
        if (mine) setRegistration(mine);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [hackathon?.id]);

  const submissionTarget = hackathon?.submissionDeadline || hackathon?.endDate || '';

  const [countdown, setCountdown] = useState<CountdownParts | null>(getCountdown(submissionTarget));
  useEffect(() => {
    if (!submissionTarget) return;
    setCountdown(getCountdown(submissionTarget));
    const t = setInterval(() => setCountdown(getCountdown(submissionTarget)), 1000);
    return () => clearInterval(t);
  }, [submissionTarget]);

  const myAnnouncements = useMemo(
    () => (announcements || []).filter((a: any) => a.hackathonId === hackathon?.id),
    [announcements, hackathon?.id]
  );
  const importantNotifications = myAnnouncements.filter((a: any) => a.priority === 'HIGH' || a.priority === 'CRITICAL' || a.type === 'critical');

  const members = useMemo(
    () => (Array.isArray(registration?.members) && registration.members.length > 0
      ? registration.members
      : [{ name: registration?.groupName?.replace("'s Entry", '') || 'Team Lead', role: 'Team Lead', email: registration?.leaderEmail }]),
    [registration]
  );

  const importantDates = useMemo(() => {
    const items: { label: string; date?: string; end?: string }[] = [
      { label: 'Registration Closes', date: hackathon?.registrationEnd },
      { label: 'Team Formation Deadline', date: hackathon?.teamFormationDeadline },
      { label: 'Hackathon Starts', date: hackathon?.startDate },
      { label: 'Submission Deadline', date: hackathon?.submissionDeadline },
      { label: 'Hackathon Ends', date: hackathon?.endDate },
      { label: 'Evaluation Starts', date: hackathon?.evaluationStart },
      { label: 'Evaluation Ends', date: hackathon?.evaluationEnd },
      { label: 'Winners Announced', date: hackathon?.winnerAnnouncementDate },
      { label: 'Certificates Distributed', date: hackathon?.certDistributionDate }
    ];
    return items
      .filter((i) => i.date)
      .map((i) => ({ ...i, sortTime: new Date(i.date as string).getTime() }))
      .filter((i) => !isNaN(i.sortTime))
      .sort((a, b) => a.sortTime - b.sortTime);
  }, [hackathon]);

  const rulesList = useMemo(
    () => (hackathon?.rules || []).filter(Boolean),
    [hackathon?.rules]
  );
  const eligibilityList = useMemo(
    () => (hackathon?.eligibility || []).filter(Boolean),
    [hackathon?.eligibility]
  );
  const problemStatements = hackathon?.problemStatements || [];
  const rubrics = hackathon?.rubrics || [];
  const prizeItems = hackathon?.prizeBreakdown || hackathon?.prizes || [];

  const checklist = useMemo(
    () => [
      { label: 'Team Registered', done: true },
      { label: 'Deadline Published', done: !!submissionTarget },
      { label: 'Problem Statement', done: problemStatements.length > 0 || !!hackathon?.description || !!hackathon?.tagline },
      { label: 'Rules & Criteria', done: rulesList.length > 0 || eligibilityList.length > 0 || rubrics.length > 0 },
      { label: 'Submission Locked', done: false }
    ],
    [submissionTarget, problemStatements.length, rulesList.length, eligibilityList.length, rubrics.length, hackathon?.description, hackathon?.tagline]
  );
  const doneCount = checklist.filter((c) => c.done).length;
  const readinessPct = Math.round((doneCount / checklist.length) * 100);

  const milestoneBars = useMemo(() => {
    const upcoming = importantDates.filter((d) => d.sortTime > Date.now()).slice(0, 4);
    return upcoming.map((d) => {
      const days = Math.max(1, Math.ceil((d.sortTime - Date.now()) / (1000 * 60 * 60 * 24)));
      return {
        label: d.label,
        value: days,
        display: `${days} day${days === 1 ? '' : 's'}`,
        color: d.sortTime - Date.now() <= 48 * 60 * 60 * 1000 ? '#f43f5e' : '#6366f1'
      };
    });
  }, [importantDates]);

  const AVATARS = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80'
  ];

  const deadlineOver = submissionTarget && new Date(submissionTarget).getTime() <= Date.now();

  if (!hackathon) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Hackathon Not Found</h2>
        <button
          onClick={() => navigate('/my-hackathons')}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-sm hover:bg-indigo-700 cursor-pointer"
        >
          Back to My Hackathons
        </button>
      </div>
    );
  }

  const socialLinks = hackathon.socialLinks || {};

  const sectionCard = 'bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-4';

  const SectionTitle: React.FC<{ icon: React.ReactNode; title: string; badge?: React.ReactNode }> = ({ icon, title, badge }) => (
    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
      <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 tracking-tight">
        <span className="p-1.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">{icon}</span>
        {title}
      </h3>
      {badge}
    </div>
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Back */}
      <button
        onClick={() => (onBack ? onBack() : navigate('/my-hackathons'))}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 shadow-sm transition-all hover:border-slate-300 active:scale-95 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 text-slate-500" /> Back to My Hackathons
      </button>

      {/* Header Banner */}
      <div className="rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-md">
        <div className="h-40 sm:h-52 w-full relative overflow-hidden bg-slate-950">
          {hackathon.banner && (
            <img src={hackathon.banner} alt={hackathon.title} className="w-full h-full object-cover opacity-80" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
          <div className="absolute bottom-4 left-4 sm:left-6 right-4 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500 text-white shadow-sm border border-emerald-400">
                <CheckCircle2 className="w-3 h-3 inline mr-1" /> Approved
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-white/90 text-slate-800 backdrop-blur-md capitalize">
                {hackathon.mode}
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-amber-400/95 text-slate-950">
                <Trophy className="w-3 h-3 inline mr-1" /> {hackathon.prizePool || 'Prize Pool'}
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">{hackathon.title}</h1>
            <p className="text-xs sm:text-sm text-slate-200 font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Organized by {hackathon.organizerName || 'Organizer'}
            </p>
          </div>
        </div>

        {/* Quick stat strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-slate-100">
          <div className="p-4 text-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Submission Deadline</span>
            <span className={`text-sm font-black block mt-1 ${deadlineOver ? 'text-slate-400' : isUrgent(submissionTarget) ? 'text-rose-600' : 'text-slate-900'}`}>
              {formatDate(submissionTarget)} {formatTime(submissionTarget) && `• ${formatTime(submissionTarget)}`}
            </span>
          </div>
          <div className="p-4 text-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Team Size</span>
            <span className="text-sm font-black text-slate-900 block mt-1">{registration?.groupSize || `${members.length} Member(s)`}</span>
          </div>
          <div className="p-4 text-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Registered On</span>
            <span className="text-sm font-black text-slate-900 block mt-1">{registration?.registeredAt || '—'}</span>
          </div>
          <div className="p-4 text-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">New Updates</span>
            <span className={`text-sm font-black block mt-1 ${importantNotifications.length > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
              {importantNotifications.length > 0 ? `${importantNotifications.length} Important` : 'None'}
            </span>
          </div>
        </div>
      </div>

      {/* Alert strip: countdown + submission status + notifications */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Countdown */}
        <div className={`rounded-3xl p-5 border-2 shadow-sm space-y-3 ${isUrgent(submissionTarget) ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${isUrgent(submissionTarget) ? 'text-rose-600' : 'text-slate-500'}`}>
              <Clock className="w-3.5 h-3.5" /> Submission Countdown
            </span>
            {deadlineOver ? (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-slate-200 text-slate-600">CLOSED</span>
            ) : isUrgent(submissionTarget) ? (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-rose-600 text-white animate-pulse">URGENT</span>
            ) : countdown ? (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-700">ON TRACK</span>
            ) : null}
          </div>
          {countdown ? (
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { label: 'DAYS', value: countdown.days },
                { label: 'HRS', value: countdown.hours },
                { label: 'MIN', value: countdown.minutes },
                { label: 'SEC', value: countdown.seconds }
              ].map((u) => (
                <div key={u.label} className={`p-2 rounded-xl border ${isUrgent(submissionTarget) ? 'bg-white border-rose-200' : 'bg-slate-50 border-slate-200'}`}>
                  <span className={`block text-xl font-black font-mono ${isUrgent(submissionTarget) ? 'text-rose-600' : 'text-slate-900'}`}>{u.value}</span>
                  <span className="text-[9px] font-bold text-slate-400 tracking-wider">{u.label}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs font-semibold text-slate-500">Deadline not announced yet. Check back soon.</p>
          )}
          <p className="text-[11px] text-slate-500 font-medium">
            {deadlineOver
              ? 'Submission window has closed.'
              : countdown
              ? isUrgent(submissionTarget)
                ? 'Deadline is less than 48 hours away — finalize your submission now!'
                : 'You have time — keep building and reviewing your checklist.'
              : 'The organizer will announce the official submission window.'}
          </p>
        </div>

        {/* Submission status */}
        <div className="rounded-3xl p-5 bg-white border-2 border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5" /> Submission Status
            </span>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-700 border border-amber-300">
              NOT SUBMITTED
            </span>
          </div>
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs font-semibold text-amber-800 leading-relaxed">
              Your project has not been submitted yet. Build, verify, and lock your submission before the deadline.
            </p>
          </div>
          <button
            onClick={() => navigate('/projects')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            <FolderCode className="w-4 h-4" /> Go to Submission Workspace
          </button>
        </div>

        {/* Notifications summary */}
        <div className="rounded-3xl p-5 bg-white border-2 border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <BellRing className="w-3.5 h-3.5" /> Notifications
            </span>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${importantNotifications.length > 0 ? 'bg-rose-100 text-rose-700 border border-rose-300' : 'bg-slate-100 text-slate-500'}`}>
              {myAnnouncements.length} Total
            </span>
          </div>
          {importantNotifications.length > 0 ? (
            <div className="space-y-2">
              {importantNotifications.slice(0, 2).map((n: any) => (
                <div key={n.id} className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200/80">
                  <p className="text-xs font-bold text-rose-800 line-clamp-1">{n.title}</p>
                </div>
              ))}
              {importantNotifications.length > 2 && (
                <p className="text-[11px] font-bold text-rose-600">+{importantNotifications.length - 2} more important updates</p>
              )}
            </div>
          ) : (
            <p className="text-xs font-semibold text-slate-500">No important updates right now.</p>
          )}
        </div>
      </div>

      {/* Analytics: Progress ring + milestone bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 flex flex-col sm:flex-row items-center gap-6">
          <ProgressRing
            value={readinessPct}
            size={150}
            strokeWidth={14}
            color={readinessPct >= 60 ? '#10b981' : readinessPct >= 40 ? '#f59e0b' : '#f43f5e'}
            label="Readiness"
          />
          <div className="flex-1 w-full space-y-3">
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 tracking-tight">
                <span className="p-1.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <Sparkles className="w-4 h-4" />
                </span>
                Challenge Setup Progress
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                {doneCount} of {checklist.length} steps complete — {readinessPct}% ready.
              </p>
            </div>
            <ul className="space-y-2">
              {checklist.map((c) => (
                <li key={c.label} className="flex items-center gap-2 text-xs font-semibold">
                  {c.done ? (
                    <span className="w-4.5 h-4.5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <span className="w-4.5 h-4.5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 border border-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    </span>
                  )}
                  <span className={c.done ? 'text-slate-700' : 'text-slate-400'}>{c.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 tracking-tight">
            <span className="p-1.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <Clock className="w-4 h-4" />
            </span>
            Days to Key Milestones
          </h3>
          <BarChart
            items={milestoneBars}
            emptyMessage="No upcoming milestones announced yet."
          />
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Problem Statement */}
          <div className={sectionCard}>
            <SectionTitle icon={<BookOpen className="w-4 h-4" />} title="Problem Statement" />
            {problemStatements.length > 0 ? (
              <div className="space-y-4">
                {problemStatements.map((ps: any) => (
                  <div key={ps.id || ps.title} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-indigo-100 text-indigo-700">
                        {ps.track || 'Core Challenge'}
                      </span>
                      {ps.difficulty && (
                        <span className="text-[10px] font-bold text-amber-600">{ps.difficulty}</span>
                      )}
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{ps.title}</h4>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">{ps.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {hackathon.description || hackathon.tagline || 'The challenge brief has not been published yet.'}
                </p>
                {!hackathon.description && !hackathon.tagline && (
                  <p className="text-xs text-slate-400 font-semibold">The organizer will publish the problem statement soon.</p>
                )}
              </div>
            )}
          </div>

          {/* Important Dates */}
          <div className={sectionCard}>
            <SectionTitle
              icon={<Calendar className="w-4 h-4" />}
              title="Important Dates"
              badge={isUrgent(hackathon.submissionDeadline) ? (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-700 border border-amber-300 animate-pulse">Deadline Soon</span>
              ) : undefined}
            />
            {importantDates.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {importantDates.map((d) => {
                  const time = d.sortTime;
                  const past = time < Date.now();
                  const soon = !past && time - Date.now() <= 48 * 60 * 60 * 1000;
                  return (
                    <div
                      key={d.label}
                      className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${soon ? 'bg-amber-50 border-amber-200' : past ? 'bg-slate-50 border-slate-200/80' : 'bg-white border-slate-200/80'}`}
                    >
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-slate-500 block truncate">{d.label}</span>
                        <span className={`text-xs font-black block ${soon ? 'text-amber-700' : past ? 'text-slate-400' : 'text-slate-900'}`}>
                          {formatDate(d.date)}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">{formatTime(d.date)}</span>
                      </div>
                      {soon && <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-500 text-white shrink-0">Soon</span>}
                      {past && <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-slate-200 text-slate-500 shrink-0">Passed</span>}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs font-semibold text-slate-500">Key dates have not been announced yet.</p>
            )}
          </div>

          {/* Notifications */}
          <div className={sectionCard}>
            <SectionTitle
              icon={<Megaphone className="w-4 h-4" />}
              title="Notifications & Announcements"
              badge={myAnnouncements.length > 0 ? (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-indigo-100 text-indigo-700">{myAnnouncements.length} Update(s)</span>
              ) : undefined}
            />
            {myAnnouncements.length > 0 ? (
              <div className="space-y-2.5">
                {myAnnouncements.map((n: any) => {
                  const important = n.priority === 'HIGH' || n.priority === 'CRITICAL' || n.type === 'critical';
                  return (
                    <div
                      key={n.id}
                      className={`p-3.5 rounded-2xl border flex items-start gap-3 ${important ? 'bg-rose-50/70 border-rose-200' : 'bg-slate-50 border-slate-200/80'}`}
                    >
                      <span className={`p-2 rounded-xl shrink-0 ${important ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'}`}>
                        <Megaphone className="w-3.5 h-3.5" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-xs font-black ${important ? 'text-rose-800' : 'text-slate-900'}`}>{n.title}</span>
                          {important && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-rose-600 text-white">Important</span>
                          )}
                          <span className="text-[10px] font-semibold text-slate-400 ml-auto">{n.createdAt || n.timestamp || ''}</span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">{n.content}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs font-semibold text-slate-500">
                No announcements yet. When the organizer posts updates, they will appear here.
              </p>
            )}
          </div>

          {/* Team Details */}
          <div className={sectionCard}>
            <SectionTitle
              icon={<Users className="w-4 h-4" />}
              title="Your Team"
              badge={
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-700 border border-emerald-300">
                  {registration?.groupName || 'Team'} • {members.length} Member(s)
                </span>
              }
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {members.map((m: any, idx: number) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={AVATARS[idx % AVATARS.length]}
                      alt={m.name || 'Member avatar'}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="font-black text-slate-900 text-xs truncate block">{m.name || 'Team Member'}</span>
                      <span className="text-[10px] font-semibold text-slate-400">{m.role || (idx === 0 ? 'Team Lead' : 'Team Member')}</span>
                    </div>
                    {idx === 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-100 text-amber-700 shrink-0">Team Lead</span>
                    )}
                  </div>
                  <div className="space-y-1 text-[11px] font-medium text-slate-500">
                    {m.email && (
                      <span className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-slate-400" /> {m.email}</span>
                    )}
                    {m.phone && (
                      <span className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-slate-400" /> {m.phone}</span>
                    )}
                    {m.organization && (
                      <span className="flex items-center gap-1.5"><Building className="w-3 h-3 text-slate-400" /> {m.organization}</span>
                    )}
                    {m.role && (
                      <span className="flex items-center gap-1.5"><Briefcase className="w-3 h-3 text-slate-400" /> {m.role}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Prizes */}
          <div className={sectionCard}>
            <SectionTitle icon={<Trophy className="w-4 h-4" />} title="Prizes" />
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 block">Total Prize Pool</span>
              <span className="text-2xl font-black text-amber-700 block mt-1">{hackathon.prizePool || 'To be announced'}</span>
            </div>
            {prizeItems.length > 0 && (
              <div className="space-y-2">
                {prizeItems.map((p: any, idx: number) => (
                  <div key={p.id || idx} className="p-3 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{p.title}</span>
                      {p.description && <span className="text-[11px] text-slate-500 font-medium">{p.description}</span>}
                    </div>
                    {p.amount && <span className="text-sm font-black text-emerald-600 shrink-0">{p.amount}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Evaluation Criteria */}
          <div className={sectionCard}>
            <SectionTitle icon={<Scale className="w-4 h-4" />} title="Evaluation Criteria" />
            {rubrics.length > 0 ? (
              <div className="space-y-2">
                {rubrics.map((r: any) => (
                  <div key={r.id || r.name} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900">{r.name}</span>
                      <span className="px-2 py-0.5 rounded-lg bg-indigo-100 text-indigo-700 font-mono text-[10px] font-black">{r.weight}%</span>
                    </div>
                    {r.description && <p className="text-[11px] text-slate-500 font-medium mt-1">{r.description}</p>}
                  </div>
                ))}
                {rubrics.reduce((acc: number, r: any) => acc + Number(r.weight || 0), 0) === 100 && (
                  <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Weights verified (100%)
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs font-semibold text-slate-500">Evaluation criteria will be shared by the organizer.</p>
            )}
          </div>

          {/* Rules */}
          <div className={sectionCard}>
            <SectionTitle icon={<ShieldCheck className="w-4 h-4" />} title="Rules & Guidelines" />
            {(rulesList.length > 0 || eligibilityList.length > 0) ? (
              <ul className="space-y-2.5">
                {rulesList.map((rule: any, idx: number) => (
                  <li key={`r-${idx}`} className="flex items-start gap-2.5 text-xs text-slate-600 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{rule}</span>
                  </li>
                ))}
                {eligibilityList.map((el: any, idx: number) => (
                  <li key={`e-${idx}`} className="flex items-start gap-2.5 text-xs text-slate-600 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed"><strong className="text-slate-800">Eligibility:</strong> {el}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs font-semibold text-slate-500">Rules will be published by the organizer.</p>
            )}
          </div>

          {/* Resources */}
          <div className={sectionCard}>
            <SectionTitle icon={<Sparkles className="w-4 h-4" />} title="Resources & Links" />
            <div className="space-y-2">
              {hackathon.website && (
                <a
                  href={hackathon.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-indigo-50 hover:border-indigo-200 transition-all text-xs font-bold text-slate-800"
                >
                  <Globe className="w-4 h-4 text-indigo-600 shrink-0" /> Official Website <ChevronRight className="w-3.5 h-3.5 ml-auto text-slate-300" />
                </a>
              )}
              {hackathon.location && (
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-bold text-slate-800">
                  <MapPin className="w-4 h-4 text-indigo-600 shrink-0" /> {hackathon.location}
                </div>
              )}
              {hackathon.mode && (
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-bold text-slate-800 capitalize">
                  <Link2 className="w-4 h-4 text-indigo-600 shrink-0" /> {hackathon.mode} Format
                </div>
              )}
              {(hackathon.tags || []).length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(hackathon.tags || []).map((t: any, idx: number) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-[11px] font-bold text-indigo-700">{t}</span>
                  ))}
                </div>
              )}
              {(socialLinks.discord || socialLinks.twitter || socialLinks.github || socialLinks.linkedin) && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {socialLinks.discord && (
                    <a href={socialLinks.discord} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-indigo-50 text-[11px] font-bold text-slate-700">
                      <MessageCircle className="w-3.5 h-3.5 text-indigo-600" /> Discord
                    </a>
                  )}
                  {socialLinks.github && (
                    <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-indigo-50 text-[11px] font-bold text-slate-700">
                      <Globe className="w-3.5 h-3.5 text-indigo-600" /> GitHub
                    </a>
                  )}
                  {socialLinks.twitter && (
                    <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-indigo-50 text-[11px] font-bold text-slate-700">
                      <Globe className="w-3.5 h-3.5 text-indigo-600" /> Twitter
                    </a>
                  )}
                  {socialLinks.linkedin && (
                    <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-indigo-50 text-[11px] font-bold text-slate-700">
                      <Globe className="w-3.5 h-3.5 text-indigo-600" /> LinkedIn
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
