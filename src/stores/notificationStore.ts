import { create } from 'zustand';
import type { Notification, Announcement } from '../types/notification';
import { INITIAL_ANNOUNCEMENTS } from '../data/mockData';

interface NotificationState {
  notifications: Notification[];
  announcements: Announcement[];
  unreadCount: number;
  isDrawerOpen: boolean;

  setNotifications: (notifications: Notification[]) => void;
  setAnnouncements: (announcements: Announcement[]) => void;
  addAnnouncement: (announcement: Announcement) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  toggleDrawer: () => void;
  setDrawerOpen: (open: boolean) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  announcements: INITIAL_ANNOUNCEMENTS as unknown as Announcement[],
  unreadCount: INITIAL_ANNOUNCEMENTS.length,
  isDrawerOpen: false,

  setNotifications: (notifications: Notification[]) =>
    set({
      notifications,
      unreadCount: notifications.filter((n: Notification) => !n.isRead).length,
    }),
  setAnnouncements: (announcements: Announcement[]) => set({ announcements }),
  addAnnouncement: (announcement: Announcement) =>
    set((state: NotificationState) => ({
      announcements: [announcement, ...state.announcements],
      unreadCount: state.unreadCount + 1,
    })),
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
