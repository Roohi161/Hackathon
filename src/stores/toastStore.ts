import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastStore {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast: Omit<ToastItem, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id, duration: toast.duration ?? 5000 };
    set((state: ToastStore) => ({ toasts: [...state.toasts, newToast] }));

    if (newToast.duration > 0) {
      setTimeout(() => {
        set((state: ToastStore) => ({ toasts: state.toasts.filter((t: ToastItem) => t.id !== id) }));
      }, newToast.duration);
    }
  },
  removeToast: (id: string) =>
    set((state: ToastStore) => ({ toasts: state.toasts.filter((t: ToastItem) => t.id !== id) })),
  clearToasts: () => set({ toasts: [] }),
}));
