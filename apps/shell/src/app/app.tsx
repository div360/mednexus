import * as React from 'react';
import { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@mednexus/auth/data-access';

// @ts-ignore - Module Federation remote import
const AuthApp = React.lazy(() => import('auth/AuthPage'));
// @ts-ignore
const DashboardApp = React.lazy(() => import('dashboard/DashboardPage'));
// @ts-ignore
const AnalyticsApp = React.lazy(() => import('analytics/AnalyticsPage'));
// @ts-ignore
const PatientsApp = React.lazy(() => import('patients/PatientsPage'));

function RequireAuth({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

export function App() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-screen items-center justify-center bg-surface-50 text-brand-600">
        <div className="animate-pulse-slow font-medium text-lg">Loading MedNexus...</div>
      </div>
    }>
        <Routes>
          <Route path="/login" element={<AuthApp />} />
          <Route path="/signup" element={<AuthApp />} />
          <Route 
            path="/dashboard/*" 
            element={
              <RequireAuth>
                <DashboardApp />
              </RequireAuth>
            } 
          />
          <Route 
            path="/analytics/*" 
            element={
              <RequireAuth>
                <AnalyticsApp />
              </RequireAuth>
            } 
          />
          <Route 
            path="/patients/*" 
            element={
              <RequireAuth>
                <PatientsApp />
              </RequireAuth>
            } 
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    </Suspense>
  );
}

export default App;
