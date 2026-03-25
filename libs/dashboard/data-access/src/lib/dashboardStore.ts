import { create } from 'zustand';
import type { DashboardData } from '@mednexus/shared/types';
import { buildDashboardDataFromPatients } from './buildDashboardData';
import { mockPatients } from './mock-data/mockPatients';

interface DashboardState {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  data: buildDashboardDataFromPatients(mockPatients),
  isLoading: false,
  error: null,

  fetchData: async () => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      set({
        data: buildDashboardDataFromPatients(mockPatients),
        isLoading: false,
      });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
}));
