import React, { useState } from 'react';
import { X, Mail, Phone, Building, Code2, Briefcase, CheckCircle2, Clock, XCircle } from 'lucide-react';
import type { Hackathon } from '../../types';

interface MyRegistrationModalProps {
  registration: any;
  hackathon: Hackathon | null;
  onClose: () => void;
}

export const MyRegistrationModal: React.FC<MyRegistrationModalProps> = ({ registration, hackathon, onClose }) => {
  const [activeMemberTab, setActiveMemberTab] = useState(0);

  const members = Array.isArray(registration.members) && registration.members.length > 0
    ? registration.members
    : [
        { name: registration.groupName?.replace("'s Entry", '') || 'Team Lead', role: 'Team Lead', email: registration.leaderEmail }
      ];

  const activeIdx = Math.min(activeMemberTab, members.length - 1);
  const currentMember = members[activeIdx] || members[0];

  const status = registration.status || 'UNDER_REVIEW';
  const statusBadge = status === 'APPROVED'
    ? <span className="flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-700 border border-emerald-300"><CheckCircle2 className="w-3.5 h-3.5" /> Approved</span>
    : status === 'REJECTED'
    ? <span className="flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-700 border border-rose-300"><XCircle className="w-3.5 h-3.5" /> Rejected</span>
    : <span className="flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-700 border border-amber-300"><Clock className="w-3.5 h-3.5" /> Under Review</span>;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 border border-slate-200/90 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-100 text-indigo-700">
              MY REGISTRATION
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-1">{hackathon?.title || registration.hackathonTitle}</h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{registration.groupName} • Code: {registration.code}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Registration Summary */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            {statusBadge}
          </div>
          <span className="text-slate-500 font-semibold">👥 Team Size: <strong className="text-slate-900">{registration.groupSize || `${members.length} Member(s)`}</strong></span>
          <span className="text-slate-500 font-semibold">📅 Registered: <strong className="text-slate-900">{registration.registeredAt || 'Today'}</strong></span>
          <span className="text-slate-500 font-semibold">📧 Lead: <strong className="text-slate-900">{registration.leaderEmail}</strong></span>
        </div>

        {/* Member Tabs */}
        <div className="space-y-4 text-xs">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase text-slate-400 block">Registered Members ({members.length}):</span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {members.map((m: any, idx: number) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveMemberTab(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 border ${
                    activeIdx === idx
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-indigo-50 border-slate-200'
                  }`}
                >
                  <span>{idx === 0 ? '👑' : '👤'} {m.name || `Member #${idx + 1}`}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Member Details */}
          <div className="space-y-3 p-5 rounded-2xl bg-indigo-50/40 border border-indigo-100">
            <div className="flex justify-between items-start pb-2 border-b border-indigo-100">
              <div>
                <span className="font-black text-slate-900 text-sm block">{currentMember.name || 'Member Details'}</span>
                <span className="text-[11px] text-slate-500 font-medium">{currentMember.role || 'Team Member'}</span>
              </div>
              <span className="px-2.5 py-1 rounded-xl bg-white text-indigo-700 font-extrabold text-[10px] border border-indigo-100">
                Member #{activeIdx + 1} of {members.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400 font-bold block">Full Name:</span>
                <span className="font-extrabold text-slate-900 text-xs">{currentMember.name || '—'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block flex items-center gap-1"><Mail className="w-3 h-3" /> Email:</span>
                <span className="font-semibold text-slate-900">{currentMember.email || '—'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block flex items-center gap-1"><Phone className="w-3 h-3" /> Phone Number:</span>
                <span className="font-semibold text-slate-900">{currentMember.phone || '—'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block flex items-center gap-1"><Building className="w-3 h-3" /> College / Organization:</span>
                <span className="font-semibold text-slate-900">{currentMember.organization || '—'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block flex items-center gap-1"><Briefcase className="w-3 h-3" /> Role / Designation:</span>
                <span className="font-semibold text-slate-900">{currentMember.role || '—'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block flex items-center gap-1"><Code2 className="w-3 h-3" /> Skills:</span>
                <span className="font-semibold text-indigo-700">{currentMember.skills || '—'}</span>
              </div>
              {(currentMember.github || currentMember.linkedin) && (
                <div className="sm:col-span-2">
                  <span className="text-slate-400 font-bold block">GitHub / LinkedIn:</span>
                  <span className="font-semibold text-indigo-700 break-all">{currentMember.github}{currentMember.github && currentMember.linkedin ? ' • ' : ''}{currentMember.linkedin}</span>
                </div>
              )}
            </div>
          </div>

          {/* Registration Responses */}
          {currentMember.customAnswers && Object.keys(currentMember.customAnswers).length > 0 && (
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-black uppercase text-slate-400 block">My Registration Responses</span>
              {Object.entries(currentMember.customAnswers).map(([q, a], idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900 block">Q: {q}</span>
                  <p className="text-slate-700 font-medium mt-0.5">{a as string}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
