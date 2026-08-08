import { create } from 'zustand';
import type { Notification, Announcement } from '../types/notification';
import { INITIAL_ANNOUNCEMENTS } from '../data/mockData';

const STORAGE_KEY = 'hc_announcements_feed';

const loadPersisted = (): Announcement[] | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed as Announcement[];
    }
  } catch {
    // ignore
  }
  return null;
};

interface NotificationState {
  notifications: Notification[];
  announcements: Announcement[];
  unreadCount: number;
  isDrawerOpen: boolean;

  setNotifications: (notifications: Notification[]) => void;
  setAnnouncements: (announcements: Announcement[]) => void;
  addAnnouncement: (announcement: Announcement) => void;
  markAnnouncementAsRead: (id: string) => void;
  markAllAnnouncementsAsRead: () => void;
  removeAnnouncement: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  toggleDrawer: () => void;
  setDrawerOpen: (open: boolean) => void;
}

const persist = (announcements: Announcement[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(announcements));
  } catch {
    // ignore
  }
};

const seed = loadPersisted() || (INITIAL_ANNOUNCEMENTS as unknown as Announcement[]);

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  announcements: seed,
  unreadCount: seed.filter((a) => !a.isRead).length,
  isDrawerOpen: false,

  setNotifications: (notifications: Notification[]) =>
    set({
      notifications,
      unreadCount: notifications.filter((n: Notification) => !n.isRead).length,
    }),
  setAnnouncements: (announcements: Announcement[]) => {
    persist(announcements);
    set({ announcements, unreadCount: announcements.filter((a) => !a.isRead).length });
  },
  addAnnouncement: (announcement: Announcement) => {
    const next = [{ ...announcement, isRead: false, timestamp: announcement.timestamp || new Date().toISOString() }, ...get().announcements];
    persist(next);
    set({ announcements: next, unreadCount: get().unreadCount + 1 });
  },
  markAnnouncementAsRead: (id: string) => {
    const next = get().announcements.map((a) => (a.id === id ? { ...a, isRead: true } : a));
    persist(next);
    set({ announcements: next, unreadCount: next.filter((a) => !a.isRead).length });
  },
  markAllAnnouncementsAsRead: () => {
    const next = get().announcements.map((a) => ({ ...a, isRead: true }));
    persist(next);
    set({ announcements: next, unreadCount: 0 });
  },
  removeAnnouncement: (id: string) => {
    const next = get().announcements.filter((a) => a.id !== id);
    persist(next);
    set({ announcements: next, unreadCount: next.filter((a) => !a.isRead).length });
  },
  markAsRead: (id: string) =>
    set((state: NotificationState) => {
      const updated = state.notifications.map((n: Notification) =>
        n.id === id ? { ...n, isRead: true } : n
      );
      return {
        notifications: updated,
        unreadCount: updated.filter((n: Notification) => !n.isRead).length,
      };
    }),
  markAllAsRead: () =>
    set((state: NotificationState) => ({
      notifications: state.notifications.map((n: Notification) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),
  toggleDrawer: () => set((state: NotificationState) => ({ isDrawerOpen: !state.isDrawerOpen })),
  setDrawerOpen: (isDrawerOpen: boolean) => set({ isDrawerOpen }),
}));
