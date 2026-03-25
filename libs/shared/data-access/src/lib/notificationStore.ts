import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppNotification, NotificationEventDetail, NotificationType } from '@mednexus/shared/types';

function inferNotificationType(detail: NotificationEventDetail): NotificationType {
  const candidate = detail.data?.type;
  switch (candidate) {
    case 'patient_assigned':
    case 'appointment_reminder':
    case 'critical_alert':
    case 'lab_result':
    case 'system':
      return candidate;
    default:
      return 'system';
  }
}

function toAppNotification(detail: NotificationEventDetail): AppNotification {
  return {
    id: crypto.randomUUID(),
    type: inferNotificationType(detail),
    title: detail.title,
    message: detail.body,
    createdAt: new Date().toISOString(),
    isRead: false,
    ...(typeof detail.data?.patientId === 'string'
      ? { patientId: detail.data.patientId }
      : {}),
  };
}

interface NotificationState {
  notifications: AppNotification[];
  toasts: AppNotification[];
  addNotification: (detail: NotificationEventDetail) => AppNotification;
  markRead: (id: string) => void;
  dismissToast: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      toasts: [],
      addNotification: (detail) => {
        const notification = toAppNotification(detail);
        set((state) => ({
          notifications: [notification, ...state.notifications].slice(0, 50),
          toasts: [notification, ...state.toasts].slice(0, 5),
        }));
        return notification;
      },
      markRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === id
              ? { ...notification, isRead: true }
              : notification
          ),
        })),
      dismissToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id),
        })),
      clearAll: () => set({ notifications: [], toasts: [] }),
    }),
    {
      name: 'mednexus-notifications',
      partialize: (state) => ({
        notifications: state.notifications,
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...(persistedState as Partial<NotificationState>),
        toasts: [],
      }),
    }
  )
);
