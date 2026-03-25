import { useNotificationStore } from '@mednexus/shared/data-access';
import type { NotificationEventDetail } from '@mednexus/shared/types';

const SERVICE_WORKER_URL = '/sw.js';
const DEFAULT_NOTIFICATION_ICON = '/favicon.ico';

export function supportsNotifications(): boolean {
  return 'Notification' in window && 'serviceWorker' in navigator;
}

export async function registerAppServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!supportsNotifications()) {
    return null;
  }

  return navigator.serviceWorker.register(SERVICE_WORKER_URL);
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!supportsNotifications()) {
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  return Notification.requestPermission();
}

export async function showLocalNotification(
  detail: NotificationEventDetail
): Promise<boolean> {
  useNotificationStore.getState().addNotification(detail);

  const permission = await requestNotificationPermission();
  if (permission !== 'granted') {
    return false;
  }

  const options = {
    body: detail.body,
    tag: detail.tag,
    icon: DEFAULT_NOTIFICATION_ICON,
    badge: DEFAULT_NOTIFICATION_ICON,
    data: detail.data,
    requireInteraction: true,
  };

  const attachMainThreadClick = (notification: Notification) => {
    notification.onclick = () => {
      const url = typeof detail.data?.url === 'string' ? detail.data.url : '/patients';
      window.focus();
      if (window.location.pathname !== url) {
        window.location.assign(url);
      }
    };
  };

  try {
    if (document.visibilityState === 'visible') {
      const notification = new Notification(detail.title, options);
      attachMainThreadClick(notification);
      try {
        await registerAppServiceWorker();
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(detail.title, options);
      } catch {
        // Keep the foreground Notification API path even if the SW path is unavailable.
      }
      return true;
    }

    await registerAppServiceWorker();
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(detail.title, options);
    return true;
  } catch (error) {
    try {
      console.error('MedNexus notification fallback triggered:', error);
      const notification = new Notification(detail.title, options);
      attachMainThreadClick(notification);
      return true;
    } catch (fallbackError) {
      console.error('MedNexus notification failed:', fallbackError);
      return false;
    }
  }
}
