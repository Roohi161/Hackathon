import React, { useState } from 'react';
import { Settings, Bell, Shield, Save, CheckCircle2 } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [submissionReminders, setSubmissionReminders] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-2xs">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Account Preferences & Settings</h2>
            <p className="text-xs font-semibold text-slate-500">Manage notifications, privacy, connected accounts, and security</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Bell className="w-4 h-4 text-indigo-600" /> Notifications & Alerts
          </h3>
          <div className="space-y-3 text-xs font-bold text-slate-700">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <span>Email Notifications for Hackathon Deadlines</span>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
            </label>
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <span>Submission Reminders & Mentor Alerts</span>
              <input
                type="checkbox"
                checked={submissionReminders}
                onChange={(e) => setSubmissionReminders(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Shield className="w-4 h-4 text-indigo-600" /> Privacy & Visibility
          </h3>
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer text-xs font-bold text-slate-700">
            <span>Make Portfolio & Projects Visible to Recruiters</span>
            <input
              type="checkbox"
              checked={publicProfile}
              onChange={(e) => setPublicProfile(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded"
            />
          </label>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
        >
          {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{saved ? 'Preferences Saved!' : 'Save Settings'}</span>
        </button>
      </form>
    </div>
  );
};
