import { create } from 'zustand';
import type {
  Patient,
  PatientStoreState,
  PatientsQueryParams,
} from '@mednexus/shared/types';
import {
  createPatientInFirestore,
  fetchPatientsFromFirestore,
  fetchPatientFilterMetadata,
  queryPatientsFromFirestore,
} from './patientsFirestore';

const defaultQuery: PatientsQueryParams = {
  search: '',
  statusFilter: 'All',
  departmentFilter: 'All',
};

export const usePatientStore = create<PatientStoreState>((set, get) => ({
  patients: [],
  selectedPatient: null,
  isLoading: false,
  filterMetadata: null,
  lastQueryParams: defaultQuery,
  setPatients: (patients) => set({ patients }),
  selectPatient: (patient) => set({ selectedPatient: patient }),
  setLoading: (isLoading) => set({ isLoading }),
  fetchPatients: async () => {
    set({ isLoading: true });
    try {
      const patients = await fetchPatientsFromFirestore();
      set({ patients, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  },
  loadFilterMetadata: async () => {
    const meta = await fetchPatientFilterMetadata();
    set({ filterMetadata: meta });
  },
  queryPatients: async (params) => {
    set({ isLoading: true, lastQueryParams: params });
    try {
      const patients = await queryPatientsFromFirestore(params);
      set({ patients, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  },
  addPatient: async (patient) => {
    set({ isLoading: true });
    try {
      await createPatientInFirestore(patient);
      await get().queryPatients(get().lastQueryParams);
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  },
}));

export const patientStore = usePatientStore;
