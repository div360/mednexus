import { create } from 'zustand';

interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  status: 'stable' | 'critical' | 'recovering';
}

interface PatientState {
  patients: Patient[];
  selectedPatient: Patient | null;
  isLoading: boolean;
  setPatients: (patients: Patient[]) => void;
  selectPatient: (patient: Patient | null) => void;
  setLoading: (loading: boolean) => void;
}

export const usePatientStore = create<PatientState>((set) => ({
  patients: [],
  selectedPatient: null,
  isLoading: false,
  setPatients: (patients) => set({ patients }),
  selectPatient: (patient) => set({ selectedPatient: patient }),
  setLoading: (isLoading) => set({ isLoading }),
}));

export const patientStore = usePatientStore;
