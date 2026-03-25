import type {
  CaseDistributionData,
  DashboardData,
  Patient,
  PatientAdmissionData,
  RecentPatient,
  RecentPatientStatus,
} from '@mednexus/shared/types';

const DEPT_COLORS = ['#4f46e5', '#0d9488', '#c7d2fe', '#475569', '#f59e0b', '#ec4899'];

const MONTHS = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
];

function sameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function calculateAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

function formatAdmittedOn(iso: string): string {
  const d = new Date(iso);
  const mon = MONTHS[d.getMonth()];
  const day = d.getDate();
  const hh = d.getHours().toString().padStart(2, '0');
  const mm = d.getMinutes().toString().padStart(2, '0');
  return `${mon} ${day}, ${hh}:${mm}`;
}

function mapToRecentStatus(status: Patient['status']): RecentPatientStatus {
  switch (status) {
    case 'critical':
      return 'critical';
    case 'observation':
      return 'observation';
    case 'stable':
    case 'active':
      return 'stable';
    default:
      return 'stable';
  }
}

function mapPatientToRecent(p: Patient): RecentPatient {
  const primary = p.diagnoses[0]?.condition ?? '—';
  return {
    id: p.id,
    name: `${p.firstName} ${p.lastName}`,
    avatarInitials: `${p.firstName[0] ?? ''}${p.lastName[0] ?? ''}`.toUpperCase(),
    age: calculateAge(p.dateOfBirth),
    condition: primary,
    status: mapToRecentStatus(p.status),
    admittedOn: formatAdmittedOn(p.admittedAt),
  };
}

function countAdmissionsBetween(
  patients: Patient[],
  start: Date,
  end: Date
): number {
  return patients.filter((p) => {
    const a = new Date(p.admittedAt);
    return a >= start && a <= end;
  }).length;
}

function buildAdmissionsHistory(
  patients: Patient[],
  now: Date,
  days = 7
): PatientAdmissionData[] {
  const out: PatientAdmissionData[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const day = new Date(now);
    day.setDate(day.getDate() - i);
    day.setHours(12, 0, 0, 0);
    const label = `${MONTHS[day.getMonth()]} ${day.getDate()}`;
    const admissions = patients.filter((p) =>
      sameCalendarDay(new Date(p.admittedAt), day)
    ).length;
    out.push({ date: label, admissions });
  }
  return out;
}

function buildAdmissionsHistoryMonthly(
  patients: Patient[],
  now: Date,
  months = 12
): PatientAdmissionData[] {
  const out: PatientAdmissionData[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = MONTHS[d.getMonth()];
    const admissions = patients.filter((p) => {
      const pd = new Date(p.admittedAt);
      return pd.getFullYear() === d.getFullYear() && pd.getMonth() === d.getMonth();
    }).length;
    out.push({ date: label, admissions });
  }
  return out;
}

function buildCaseDistribution(patients: Patient[]): CaseDistributionData[] {
  const active = patients.filter((p) => p.status !== 'discharged');
  const total = active.length;
  if (total === 0) {
    return [];
  }
  const byDept = new Map<string, number>();
  for (const p of active) {
    const d = p.department || 'Other';
    byDept.set(d, (byDept.get(d) ?? 0) + 1);
  }
  const entries = [...byDept.entries()].sort((a, b) => b[1] - a[1]);
  return entries.map(([department, count], i) => ({
    condition: department,
    percentage: Math.round((count / total) * 100),
    value: count,
    color: DEPT_COLORS[i % DEPT_COLORS.length],
  }));
}

function buildRecentPatients(patients: Patient[], now: Date): RecentPatient[] {
  const cutoff = new Date(now.getTime() - 48 * 60 * 60 * 1000);
  return patients
    .filter(
      (p) =>
        p.status !== 'discharged' && new Date(p.admittedAt) >= cutoff
    )
    .sort(
      (a, b) =>
        new Date(b.admittedAt).getTime() - new Date(a.admittedAt).getTime()
    )
    .slice(0, 10)
    .map(mapPatientToRecent);
}

/** Derives dashboard view-model from the canonical patient registry. */
export function buildDashboardDataFromPatients(
  patients: Patient[],
  now: Date = new Date()
): DashboardData {
  const totalPatients = patients.length;

  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const thisWeekAdmits = countAdmissionsBetween(patients, weekAgo, now);
  const prevWeekAdmits = countAdmissionsBetween(patients, twoWeeksAgo, weekAgo);
  const totalTrendPct =
    prevWeekAdmits === 0
      ? thisWeekAdmits > 0
        ? 100
        : 0
      : Math.round(
          ((thisWeekAdmits - prevWeekAdmits) / prevWeekAdmits) * 100
        );

  const activeCases = patients.filter((p) => p.status !== 'discharged').length;
  const criticalAlerts = patients.filter((p) => p.status === 'critical').length;

  const todayYmd = now.toISOString().slice(0, 10);
  const dischargedToday = patients.filter(
    (p) =>
      p.status === 'discharged' &&
      p.dischargedAt?.startsWith(todayYmd)
  ).length;

  return {
    metrics: {
      totalPatients: { value: totalPatients, trend: totalTrendPct },
      activeCases: { value: activeCases, trend: 0 },
      criticalAlerts: { value: criticalAlerts, trend: 0 },
      dischargedToday: { value: dischargedToday, trend: 0 },
    },
    admissionsHistory: buildAdmissionsHistory(patients, now, 7),
    admissionsHistoryMonthly: buildAdmissionsHistoryMonthly(patients, now, 12),
    caseDistribution: buildCaseDistribution(patients),
    recentPatients: buildRecentPatients(patients, now),
  };
}
