import type { NavigateFunction } from 'react-router-dom';

export interface DashboardMetrics {
  totalPatients: {
    value: number;
    trend: number;
  };
  activeCases: {
    value: number;
    trend: number;
  };
  criticalAlerts: {
    value: number;
    trend: number;
  };
  dischargedToday: {
    value: number;
    trend: number;
  };
}

export interface PatientAdmissionData {
  date: string;
  admissions: number;
}

export interface CaseDistributionData {
  condition: string;
  percentage: number;
  value: number;
  color: string;
}

/** Display status for dashboard recent-admissions table (maps from `Patient.status`). */
export type RecentPatientStatus = 'stable' | 'critical' | 'observation';

export interface RecentPatient {
  id: string;
  name: string;
  avatarInitials: string;
  age: number;
  condition: string;
  status: RecentPatientStatus;
  admittedOn: string;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  admissionsUrl?: string; // or include data directly
  admissionsHistory: PatientAdmissionData[];
  admissionsHistoryMonthly: PatientAdmissionData[];
  caseDistribution: CaseDistributionData[];
  recentPatients: RecentPatient[];
}

/** Zustand dashboard store shape. */
export interface DashboardStoreState {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
}

export interface CaseDistributionChartProps {
  data: CaseDistributionData[];
  totalActive: number;
}

export interface AdmissionsChartProps {
  data: PatientAdmissionData[];
  monthlyData: PatientAdmissionData[];
}

export interface RecentPatientsTableProps {
  patients: RecentPatient[];
  /** Required when embedded in shell MFE — host's navigate() avoids duplicate react-router-dom context. */
  navigate?: NavigateFunction;
}

export interface SummaryCardsProps {
  metrics: DashboardMetrics;
}
