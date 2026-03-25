import * as React from 'react';
import { Suspense } from 'react';
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
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

export function App() {
  const navigate = useNavigate();
  return (
    <Suspense fallback={
      <div className="flex h-screen w-screen items-center justify-center bg-surface-50 text-brand-600">
        <div className="animate-pulse-slow font-medium text-lg">Loading MedNexus...</div>
      </div>
    }>
        <Routes>
          <Route path="/login" element={<AuthApp onLoginSuccess={() => navigate('/dashboard')} />} />
          <Route path="/signup" element={<AuthApp onLoginSuccess={() => navigate('/dashboard')} />} />
          
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
