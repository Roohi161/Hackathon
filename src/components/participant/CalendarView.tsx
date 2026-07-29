import React from 'react';
import { Calendar, Clock, Video, Users, Trophy } from 'lucide-react';

export const CalendarView: React.FC = () => {
  const events = [
    { date: 'July 30, 2026', time: '02:00 PM', title: 'Team Alpha Coders Architecture Sync', type: 'Team Meeting', icon: Users, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
    { date: 'August 01, 2026', time: '06:00 PM', title: 'Live Mentorship with Dr. John Doe', type: 'Mentor Session', icon: Video, color: 'bg-violet-50 text-violet-600 border-violet-100' },
    { date: 'August 02, 2026', time: '11:59 PM', title: 'AI Hackathon Final Submission Deadline', type: 'Submission Lock', icon: Clock, color: 'bg-amber-50 text-amber-600 border-amber-100' },
    { date: 'August 05, 2026', time: '04:00 PM', title: 'Live Judging Panel & Award Ceremony', type: 'Judging & Results', icon: Trophy, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-2xs">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Events Calendar & Schedule</h2>
            <p className="text-xs font-semibold text-slate-500">Track deadlines, mentor office hours, and judging sessions</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-slate-900">Upcoming Timeline</h3>
        <div className="space-y-3">
          {events.map((ev, i) => {
            const Icon = ev.icon;
            return (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl border shrink-0 ${ev.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">{ev.date}</span>
                    <h4 className="text-xs font-extrabold text-slate-900">{ev.title}</h4>
                    <span className="text-[10px] font-bold text-indigo-600">{ev.type}</span>
                  </div>
                </div>
                <span className="text-xs font-black text-slate-700 font-mono bg-white px-3 py-1 rounded-xl border border-slate-200">
                  {ev.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
