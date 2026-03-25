import type { Patient, PatientStatus } from '@mednexus/shared/types';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const CRITICAL_VISIT_HOURS = [8, 14];
const STANDARD_VISIT_HOUR = 10;

function withHour(baseDate: Date, hour: number): Date {
  const date = new Date(baseDate);
  date.setHours(hour, 0, 0, 0);
  return date;
}

function nextCriticalVisit(lastVisit: Date): Date {
  for (const hour of CRITICAL_VISIT_HOURS) {
    const candidate = withHour(lastVisit, hour);
    if (candidate.getTime() > lastVisit.getTime()) {
      return candidate;
    }
  }

  const nextDay = new Date(lastVisit.getTime() + ONE_DAY_MS);
  return withHour(nextDay, CRITICAL_VISIT_HOURS[0]);
}

function nextStandardVisit(lastVisit: Date): Date {
  const sameDay = withHour(lastVisit, STANDARD_VISIT_HOUR);
  if (sameDay.getTime() > lastVisit.getTime()) {
    return sameDay;
  }

  const nextDay = new Date(lastVisit.getTime() + ONE_DAY_MS);
  return withHour(nextDay, STANDARD_VISIT_HOUR);
}

export function getVisitScheduleLabel(status: PatientStatus): string {
  switch (status) {
    case 'critical':
      return 'Twice daily at 08:00 and 14:00';
    case 'discharged':
      return 'No visits required';
    default:
      return 'Once daily at 10:00';
  }
}

export function getPatientVisitBaseDate(patient: Patient): Date {
  return new Date(patient.lastVisitedAt ?? patient.admittedAt);
}

export function getNextVisitDueAt(patient: Patient): string | null {
  if (patient.status === 'discharged') {
    return null;
  }

  const baseDate = getPatientVisitBaseDate(patient);

  if (patient.status === 'critical') {
    return nextCriticalVisit(baseDate).toISOString();
  }

  return nextStandardVisit(baseDate).toISOString();
}

export function isPatientVisitDue(patient: Patient, now = new Date()): boolean {
  const nextDueAt = getNextVisitDueAt(patient);
  if (!nextDueAt) {
    return false;
  }

  return new Date(nextDueAt).getTime() <= now.getTime();
}

export function formatVisitTimestamp(timestamp?: string | null): string {
  if (!timestamp) {
    return 'Not recorded';
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(timestamp));
}
