import { useEffect } from 'react';
import { useAuthStore } from '@mednexus/auth/data-access';
import { APP_NOTIFICATION_EVENT } from '@mednexus/shared/utils';
import type { NotificationEventDetail } from '@mednexus/shared/types';
import {
  fetchPatientsFromFirestore,
  getNextVisitDueAt,
  isPatientVisitDue,
} from '@mednexus/patients/data-access';
import {
  registerAppServiceWorker,
  requestNotificationPermission,
  showLocalNotification,
} from '../notifications/browserNotifications';

const NOTIFIED_VISITS_KEY = 'mednexus-notified-visits';
const VISIT_CHECK_INTERVAL_MS = 60 * 1000;

function getNotifiedVisitMap(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(NOTIFIED_VISITS_KEY) ?? '{}') as Record<string, string>;
  } catch {
    return {};
  }
}

function setNotifiedVisitMap(value: Record<string, string>): void {
  localStorage.setItem(NOTIFIED_VISITS_KEY, JSON.stringify(value));
}

export function NotificationCoordinator() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    void registerAppServiceWorker();
  }, []);

  useEffect(() => {
    const hostWindow = window as Window & {
      __MEDNEXUS_NOTIFY__?: (payload: NotificationEventDetail) => void;
    };

    hostWindow.__MEDNEXUS_NOTIFY__ = (payload) => {
      void showLocalNotification(payload);
    };

    return () => {
      delete hostWindow.__MEDNEXUS_NOTIFY__;
    };
  }, []);

  useEffect(() => {
    const handleNotification = (event: Event) => {
      const customEvent = event as CustomEvent<NotificationEventDetail>;
      void showLocalNotification(customEvent.detail);
    };

    window.addEventListener(APP_NOTIFICATION_EVENT, handleNotification as EventListener);
    return () => {
      window.removeEventListener(APP_NOTIFICATION_EVENT, handleNotification as EventListener);
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    void requestNotificationPermission();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    let stopped = false;

    const runCheck = async () => {
      try {
        const patients = await fetchPatientsFromFirestore();
        if (stopped) {
          return;
        }

        const notifiedMap = getNotifiedVisitMap();
        const nextNotifiedMap = { ...notifiedMap };
        const now = Date.now();

        for (const patient of patients) {
          if (!isPatientVisitDue(patient)) {
            delete nextNotifiedMap[patient.id];
            continue;
          }

          const nextDueAt = getNextVisitDueAt(patient);
          if (!nextDueAt) {
            delete nextNotifiedMap[patient.id];
            continue;
          }

          const lastNotifiedAt = Number(nextNotifiedMap[patient.id] ?? '0');
          if (Number.isFinite(lastNotifiedAt) && now - lastNotifiedAt < VISIT_CHECK_INTERVAL_MS) {
            continue;
          }

          nextNotifiedMap[patient.id] = String(now);
          await showLocalNotification({
            title: 'Doctor visit due',
            body: `${patient.firstName} ${patient.lastName} needs a doctor check again now.`,
            tag: `patient-due-${patient.id}`,
            data: {
              patientId: patient.id,
              type: 'critical_alert',
              url: '/patients',
            },
          });
        }

        setNotifiedVisitMap(nextNotifiedMap);
      } catch (error) {
        console.error('MedNexus overdue patient poll failed:', error);
      }
    };

    void runCheck();
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void runCheck();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    const interval = window.setInterval(() => {
      void runCheck();
    }, VISIT_CHECK_INTERVAL_MS);

    return () => {
      stopped = true;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.clearInterval(interval);
    };
  }, [isAuthenticated]);

  return null;
}
