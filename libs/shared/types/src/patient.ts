export type PatientStatus = 'active' | 'discharged' | 'critical' | 'stable' | 'observation';
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
/** Patients list layout (grid vs table). */
export type ViewMode = 'grid' | 'list';

/** Firestore-backed patient list query (search + filters). */
export interface PatientsQueryParams {
  search: string;
  statusFilter: string;
  departmentFilter: string;
}

/** Distinct values for filter dropdowns (from Firestore). */
export interface PatientFilterMetadata {
  departments: string[];
  statuses: string[];
}

export interface Vitals {
  bloodPressure: string;
  heartRate: number;
  temperature: number;
  oxygenSaturation: number;
  weight: number;
  height: number;
  recordedAt: string;
}

export interface Diagnosis {
  id: string;
  condition: string;
  icdCode: string;
  diagnosedAt: string;
  doctor: string;
  notes?: string;
}

export interface Appointment {
  id: string;
  doctorName: string;
  department: string;
  scheduledAt: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  bloodGroup: BloodGroup;
  email: string;
  phone: string;
  address: string;
  status: PatientStatus;
  department: string;
  assignedDoctor: string;
  admittedAt: string;
  /** ISO datetime; set when `status` is `discharged` (used for dashboard stats). */
  dischargedAt?: string;
  vitals: Vitals;
  diagnoses: Diagnosis[];
  appointments: Appointment[];
  avatarUrl?: string;
}

/** Zustand patient store shape (state + actions). */
export interface PatientStoreState {
  patients: Patient[];
  selectedPatient: Patient | null;
  isLoading: boolean;
  filterMetadata: PatientFilterMetadata | null;
  lastQueryParams: PatientsQueryParams;
  setPatients: (patients: Patient[]) => void;
  selectPatient: (patient: Patient | null) => void;
  setLoading: (loading: boolean) => void;
  fetchPatients: () => Promise<void>;
  loadFilterMetadata: () => Promise<void>;
  queryPatients: (params: PatientsQueryParams) => Promise<void>;
  addPatient: (patient: Patient) => Promise<void>;
}
