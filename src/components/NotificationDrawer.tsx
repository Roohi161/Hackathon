import React from 'react';
import { X, Bell, AlertTriangle, Info, Sparkles, CheckCircle2 } from 'lucide-react';
import type { Announcement } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  announcements: Announcement[];
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  announcements
}) => {
  if (!isOpen) return null;

  const getTypeBadge = (type: Announcement['type']) => {
    switch (type) {
      case 'critical':
        return (
          <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
            <AlertTriangle className="w-3 h-3" /> Critical
          </span>
        );
      case 'info':
        return (
          <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Info className="w-3 h-3" /> Announcement
          </span>
        );
      case 'update':
        return (
          <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Update
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md glass-panel border-l border-white/10 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-base">Live Broadcasts & Notifications</h3>
                <p className="text-xs text-gray-400">Real-time organizer updates</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {announcements.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No announcements posted yet.</p>
              </div>
            ) : (
              announcements.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl glass-card border border-white/5 hover:border-indigo-500/30 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    {getTypeBadge(item.type)}
                    <span className="text-[11px] text-gray-500 font-mono">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <h4 className="font-medium text-white text-sm">{item.title}</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">{item.content}</p>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
                    <span className="truncate font-medium text-indigo-400">{item.hackathonTitle}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-gray-800 bg-gray-950/60 text-center text-xs text-gray-500">
            Powered by Socket.IO WebSocket Engine
          </div>
        </div>
      </div>
    </div>
  );
};
