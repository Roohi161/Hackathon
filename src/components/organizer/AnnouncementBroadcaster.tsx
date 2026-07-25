import React, { useState } from 'react';
import { Send, AlertTriangle, Info, CheckCircle2, Radio } from 'lucide-react';
import type { Hackathon, Announcement } from '../../types';

interface AnnouncementBroadcasterProps {
  hackathons: Hackathon[];
  onBroadcastAnnouncement: (announcement: Announcement) => void;
}

export const AnnouncementBroadcaster: React.FC<AnnouncementBroadcasterProps> = ({
  hackathons,
  onBroadcastAnnouncement
}) => {
  const [selectedHackathonId, setSelectedHackathonId] = useState<string>(hackathons[0]?.id || '');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<'critical' | 'info' | 'update'>('info');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !selectedHackathonId) return;

    const targetHackathon = hackathons.find((h) => h.id === selectedHackathonId);
    const newAnnouncement: Announcement = {
      id: `ann-${Date.now()}`,
      hackathonId: selectedHackathonId,
      hackathonTitle: targetHackathon?.title || 'Hackathon Central',
      title,
      content,
      timestamp: new Date().toISOString(),
      type
    };

    onBroadcastAnnouncement(newAnnouncement);
    setTitle('');
    setContent('');
    alert('Announcement broadcast successfully via WebSockets engine!');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      <div className="p-6 rounded-2xl glass-panel border border-purple-500/30 flex items-center gap-3">
        <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
          <Radio className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-white">Live Broadcast & Notification Center</h2>
          <p className="text-xs text-gray-400">Push instant banners to participant notification drawers</p>
        </div>
      </div>

      <form onSubmit={handleSend} className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">Target Hackathon</label>
          <select
            value={selectedHackathonId}
            onChange={(e) => setSelectedHackathonId(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {hackathons.map((h) => (
              <option key={h.id} value={h.id}>
                {h.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">Broadcast Severity Type</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setType('info')}
              className={`p-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 ${
                type === 'info'
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500'
                  : 'bg-gray-900 text-gray-400 border-white/5'
              }`}
            >
              <Info className="w-3.5 h-3.5" /> Info
            </button>
            <button
              type="button"
              onClick={() => setType('critical')}
              className={`p-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 ${
                type === 'critical'
                  ? 'bg-red-500/20 text-red-300 border-red-500'
                  : 'bg-gray-900 text-gray-400 border-white/5'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" /> Critical
            </button>
            <button
              type="button"
              onClick={() => setType('update')}
              className={`p-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 ${
                type === 'update'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                  : 'bg-gray-900 text-gray-400 border-white/5'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Update
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">Headline Title</label>
          <input
            type="text"
            required
            placeholder="e.g. 🚀 Submission Deadline Extended by 2 Hours!"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">Announcement Body</label>
          <textarea
            rows={4}
            required
            placeholder="Type your message details..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 text-xs rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-purple-600 hover:bg-purple-500 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
        >
          <Send className="w-4 h-4" /> Broadcast Announcement Live
        </button>
      </form>
    </div>
  );
};
