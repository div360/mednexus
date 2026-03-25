import { create } from 'zustand';
import type { DashboardStoreState } from '@mednexus/shared/types';
import { usePatientStore } from '@mednexus/patients/data-access';
import { buildDashboardDataFromPatients } from './buildDashboardData';

export const useDashboardStore = create<DashboardStoreState>((set) => ({
  data: null,
  isLoading: true,
  error: null,

  fetchData: async () => {
    set({ isLoading: true, error: null });
    try {
      await usePatientStore.getState().fetchPatients();
      const patients = usePatientStore.getState().patients;
      set({
        data: buildDashboardDataFromPatients(patients),
        isLoading: false,
      });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
}));
