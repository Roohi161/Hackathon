import React, { useEffect, useState } from 'react';
import { X, Bell, AlertTriangle, Info, CheckCircle2, Send, Plus, Trash2, Radio, CheckCheck } from 'lucide-react';
import type { Announcement } from '../types';
import { useToastStore } from '../stores/toastStore';
import { useNotificationStore } from '../stores/notificationStore';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const addToast = useToastStore((s) => s.addToast);
  const announcements = useNotificationStore((s) => s.announcements);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const addAnnouncement = useNotificationStore((s) => s.addAnnouncement);
  const markAnnouncementAsRead = useNotificationStore((s) => s.markAnnouncementAsRead);
  const markAllAnnouncementsAsRead = useNotificationStore((s) => s.markAllAnnouncementsAsRead);
  const removeAnnouncement = useNotificationStore((s) => s.removeAnnouncement);

  // Mark everything read when the drawer opens
  useEffect(() => {
    if (isOpen && unreadCount > 0) {
      markAllAnnouncementsAsRead();
    }
  }, [isOpen]);

  // Composer Form State
  const [showComposer, setShowComposer] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newType, setNewType] = useState<Announcement['type']>('info');
  const [activeFilter, setActiveFilter] = useState<'all' | 'critical' | 'info' | 'update'>('all');

  if (!isOpen) return null;

  const handleCreateBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    addAnnouncement({
      id: `ann-${Date.now()}`,
      hackathonId: 'platform',
      hackathonTitle: 'Hackathon Central Platform',
      title: newTitle,
      content: newContent,
      type: newType,
      timestamp: new Date().toISOString()
    });

    addToast({
      title: 'Broadcast Published',
      message: `Live announcement "${newTitle}" pushed to all participants!`,
      type: 'success',
      duration: 4000
    });

    setNewTitle('');
    setNewContent('');
    setShowComposer(false);
  };

  const handleDeleteAnnouncement = (id: string) => {
    removeAnnouncement(id);
  };

  const filteredAnnouncements = announcements.filter((a) => {
    if (activeFilter === 'all') return true;
    return a.type === activeFilter;
  });

  const getTypeBadge = (type: Announcement['type']) => {
    switch (type) {
      case 'critical':
        return (
          <span className="flex items-center gap-1 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <AlertTriangle className="w-3 h-3" /> Critical
          </span>
        );
      case 'info':
        return (
          <span className="flex items-center gap-1 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
            <Info className="w-3 h-3" /> Announcement
          </span>
        );
      case 'update':
        return (
          <span className="flex items-center gap-1 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> System Update
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] overflow-hidden bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col text-slate-100 font-sans">
          
          {/* Header Bar */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full" />
              </div>
              <div>
                <h3 className="font-black text-white text-base leading-tight flex items-center gap-2">
                  <span>Live Notification Feed</span>
                </h3>
                <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                  Start times, deadlines, logins &amp; everything else
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowComposer(!showComposer)}
                className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all shadow-md text-xs font-bold flex items-center gap-1 cursor-pointer"
                title="Post New Broadcast"
              >
                <Plus className="w-4 h-4" />
                <span>Post</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Broadcast Composer Form */}
          {showComposer && (
            <form onSubmit={handleCreateBroadcast} className="p-4 bg-slate-950 border-b border-slate-800 space-y-3 animate-slideDown">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-purple-400 tracking-wider flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5" /> Compose Live Broadcast
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Real-Time Sync</span>
              </div>

              <input
                type="text"
                placeholder="Broadcast Title (e.g. Workshop Starting in 15 mins)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 outline-none focus:border-purple-500"
              />

              <textarea
                rows={2}
                placeholder="Broadcast message details..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                required
                className="w-full px-3.5 py-2 text-xs font-medium rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 outline-none focus:border-purple-500"
              />

              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-1.5">
                  {(['info', 'critical', 'update'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewType(t)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase transition-all cursor-pointer ${
                        newType === t ? 'bg-purple-600 text-white shadow-sm' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish</span>
                </button>
              </div>
            </form>
          )}

          {/* Priority Filter Chips */}
          <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-900/60 flex items-center gap-2 overflow-x-auto text-xs font-bold">
            <span className="text-[10px] font-black uppercase text-slate-500 shrink-0">FILTER:</span>
            {[
              { id: 'all', label: `All (${announcements.length})` },
              { id: 'critical', label: `Critical (${announcements.filter((a) => a.type === 'critical').length})` },
              { id: 'info', label: `Info (${announcements.filter((a) => a.type === 'info').length})` },
              { id: 'update', label: `Updates (${announcements.filter((a) => a.type === 'update').length})` },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as any)}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer shrink-0 ${
                  activeFilter === f.id
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
            <button
              onClick={markAllAnnouncementsAsRead}
              className="ml-auto px-3 py-1 rounded-xl text-[11px] font-bold text-emerald-400 hover:bg-emerald-500/10 transition-colors cursor-pointer shrink-0 flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Mark all read
            </button>
          </div>

          {/* Broadcast Cards Feed */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {filteredAnnouncements.length === 0 ? (
              <div className="text-center py-16 text-slate-500 space-y-2">
                <Bell className="w-8 h-8 mx-auto opacity-40 text-purple-400" />
                <p className="text-xs font-bold text-slate-400">No notifications yet.</p>
                <p className="text-[11px] text-slate-500">
                  Logins, new hackathons, registration updates, start/end times &amp; broadcasts will appear here automatically.
                </p>
                <button
                  onClick={() => setActiveFilter('all')}
                  className="text-xs text-purple-400 font-bold hover:underline cursor-pointer"
                >
                  View All Notifications
                </button>
              </div>
            ) : (
              filteredAnnouncements.map((item) => (
                <div
                  key={item.id}
                  onClick={() => !item.isRead && markAnnouncementAsRead(item.id)}
                  className={`p-4 rounded-2xl border transition-all space-y-2.5 relative group shadow-sm cursor-pointer ${
                    item.isRead
                      ? 'bg-slate-850 border-slate-800/90'
                      : 'bg-slate-800/70 border-purple-500/40'
                  } hover:border-purple-500/40`}
                >
                  {/* Top Badge & Time */}
                  <div className="flex items-center justify-between">
                    {getTypeBadge(item.type)}
                    <div className="flex items-center gap-2">
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                      )}
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {item.timestamp
                          ? new Date(item.timestamp).toLocaleString([], { hour: '2-digit', minute: '2-digit' })
                          : item.createdAt || ''}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteAnnouncement(item.id); }}
                        className="p-1 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Delete Notification"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Body */}
                  <h4 className="font-bold text-white text-xs leading-snug">{item.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.content}</p>

                  {/* Footer Event Title */}
                  {item.hackathonTitle && (
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                      <span className="font-bold text-indigo-400 truncate">{item.hackathonTitle}</span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Live Sync
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer Engine Bar */}
          <div className="p-3.5 border-t border-slate-800 bg-slate-950 text-center text-[10px] font-bold text-slate-500 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Auto-notifications for start times, deadlines, logins &amp; events</span>
          </div>

        </div>
      </div>
    </div>
  );
};
