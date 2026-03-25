import type { NotificationEventDetail } from '@mednexus/shared/types';

export const APP_NOTIFICATION_EVENT = 'mednexus:notify';

export function emitAppNotification(detail: NotificationEventDetail): void {
  if (typeof window === 'undefined') {
    return;
  }

  const hostWindow = window as Window & {
    __MEDNEXUS_NOTIFY__?: (payload: NotificationEventDetail) => void;
  };

  if (typeof hostWindow.__MEDNEXUS_NOTIFY__ === 'function') {
    hostWindow.__MEDNEXUS_NOTIFY__(detail);
    return;
  }

  window.dispatchEvent(
    new CustomEvent<NotificationEventDetail>(APP_NOTIFICATION_EVENT, {
      detail,
    })
  );
}
