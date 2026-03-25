export type PatientStatus = 'active' | 'discharged' | 'critical' | 'stable' | 'observation';
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type ViewMode = 'grid' | 'list';

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
