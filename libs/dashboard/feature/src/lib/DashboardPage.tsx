import * as React from 'react';
import { useEffect, useState } from 'react';
import type { NavigateFunction } from 'react-router-dom';
import { useDashboardStore } from '@mednexus/dashboard/data-access';
import {
  SummaryCards,
  AdmissionsChart,
  CaseDistributionChart,
  RecentPatientsTable,
} from '@mednexus/dashboard/ui';

export function DashboardPage(props?: { navigate?: NavigateFunction }) {
  const { navigate } = props ?? {};
  
  // MFE FIX: Bypass Zustand's React hooks (which crash on MFE dedupe) by using Vanilla subscriptions
  const [storeState, setStoreState] = useState(() => useDashboardStore.getState());

  useEffect(() => {
    const unsubscribe = useDashboardStore.subscribe((state) => setStoreState(state));
    useDashboardStore.getState().fetchData();
    return unsubscribe;
  }, []);

  const { data, isLoading, error } = storeState;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
          <span className="mt-4 text-slate-400">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-rose-500">
        <h2 className="text-xl font-bold">Error loading dashboard</h2>
        <p>{error || 'No data available'}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <SummaryCards metrics={data.metrics} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AdmissionsChart data={data.admissionsHistory} monthlyData={data.admissionsHistoryMonthly} />
        </div>
        <div className="lg:col-span-1">
          <CaseDistributionChart 
            data={data.caseDistribution} 
            totalActive={data.metrics.activeCases.value} 
          />
        </div>
      </div>

      <RecentPatientsTable patients={data.recentPatients} navigate={navigate} />
    </div>
  );
}

export default DashboardPage;
