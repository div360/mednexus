import * as React from 'react';
import { Suspense, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@mednexus/auth/data-access';
import { Layout } from './components/Layout';

// @ts-expect-error - Module Federation remote import
const AuthApp = React.lazy(() => import('auth/AuthPage'));
// @ts-expect-error - Module Federation remote import
const DashboardApp = React.lazy(() => import('dashboard/DashboardPage'));
// @ts-expect-error - Module Federation remote import
const AnalyticsApp = React.lazy(() => import('analytics/AnalyticsPage'));
// @ts-expect-error - Module Federation remote import
const PatientsApp = React.lazy(() => import('patients/PatientsPage'));

function DashboardWithHostNavigate() {
  const navigate = useNavigate();
  return <DashboardApp hostNavigate={navigate} />;
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

/**
 * Login/signup must render inside the shell Router (Navigate works here).
 * Uses a stable navigate callback so the remote AuthPage is not remounted every App render.
 * If already authenticated, redirect before mounting the federated auth bundle.
 */
function LoginEntry() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const goDashboard = useCallback(() => {
    navigate('/dashboard', { replace: true });
  }, [navigate]);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <AuthApp onLoginSuccess={goDashboard} />;
}

export function App() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-screen items-center justify-center bg-surface-50 text-brand-600">
        <div className="animate-pulse-slow font-medium text-lg">Loading MedNexus...</div>
      </div>
    }>
        <Routes>
          <Route path="/login" element={<LoginEntry />} />
          <Route path="/signup" element={<LoginEntry />} />
          
          <Route element={
            <RequireAuth>
              <Layout>
                <Outlet />
              </Layout>
            </RequireAuth>
          }>
            <Route path="/dashboard/*" element={<DashboardWithHostNavigate />} />
            <Route path="/analytics/*" element={<AnalyticsApp />} />
            <Route path="/patients/*" element={<PatientsApp />} />
          </Route>
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    </Suspense>
  );
}

export default App;
