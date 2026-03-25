import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { useAuthStore } from '@mednexus/auth/data-access';
import { signOut } from '@mednexus/shared/firebase';

export function AuthPage({ onLoginSuccess }: { onLoginSuccess?: () => void }) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('login');

  const handleLogout = async () => {
    await signOut();
    logout();
  };

  const handleSuccess = () => {
    if (onLoginSuccess) {
      onLoginSuccess();
    } else {
      window.location.href = '/dashboard';
    }
  };

  if (isAuthenticated && user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-950 p-4">
        <div className="w-full max-w-md bg-surface-900 border border-surface-800 rounded-2xl shadow-card text-center py-8 px-6">
          <div className="w-16 h-16 bg-teal-500/20 text-teal-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            {user.displayName?.charAt(0) || user.email.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to MedNexus</h2>
          <p className="text-surface-400 text-sm mb-6">Authentication was successful.</p>
          
          <div className="bg-surface-950 border border-surface-800 rounded-md p-4 text-sm font-mono text-left text-surface-200 mb-6">
            <p><strong className="text-teal-500">Name:</strong> {user.displayName}</p>
            <p><strong className="text-teal-500">Email:</strong> {user.email}</p>
            <p><strong className="text-teal-500">Role:</strong> {user.role}</p>
          </div>
          <button 
            onClick={handleLogout} 
            className="w-full border border-surface-800 hover:bg-surface-800 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Sign out for testing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-brand-950 font-sans selection:bg-teal-500/30 lg:flex-row">
      {/* Left pane - Branding & Copy */}
      <div className="hidden lg:flex w-[55%] flex-col p-12 text-white relative items-start justify-center">
        {/* Top Logo */}
        <div className="absolute top-12 left-12 flex items-center gap-3 font-bold text-2xl tracking-tight">
          <div className="w-10 h-10 rounded-lg bg-[#7673C1] flex items-center justify-center">
            {/* MedNexus abstract nodes logo */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#25173B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" fill="#25173B"/>
              <circle cx="5" cy="5" r="2" fill="#25173B"/>
              <circle cx="19" cy="5" r="2" fill="#25173B"/>
              <circle cx="5" cy="19" r="2" fill="#25173B"/>
              <path d="M7 7l3 3M17 7l-3 3M7 17l3-3M12 9V5" />
            </svg>
          </div>
          <span className="text-teal-400 text-[28px] font-bold tracking-[-0.04em]">MedNexus</span>
        </div>

        {/* Hero Text */}
        <div className="max-w-2xl mt-12 z-10">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-[-0.03em] mb-7 leading-[1.08] text-white">
            Nexus — The central connection for{' '}
            <span className="text-teal-400">modern medicine.</span>
          </h1>
          <p className="text-surface-400 text-[19px] leading-relaxed max-w-lg mb-12 font-medium">
            Clinical intelligence at your fingertips. Securely access patient data, predictive analytics, and enterprise-grade medical insights.
          </p>

          {/* Tag / Button */}
          <div className="inline-flex items-center gap-3 rounded-full bg-white/[0.04] border border-white/10 px-4 py-2.5 text-sm font-medium text-surface-200">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-teal-500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18" />
              <path d="M18 9l-5 5-4-4-6 6" />
            </svg>
            Real-time Insights
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end text-sm text-surface-500 font-medium">
        </div>
      </div>

      {/* Mobile branding */}
      <div className="flex items-center gap-3 px-6 pt-8 pb-2 lg:hidden">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#7673C1]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#25173B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" fill="#25173B" />
            <circle cx="5" cy="5" r="2" fill="#25173B" />
            <circle cx="19" cy="5" r="2" fill="#25173B" />
            <circle cx="5" cy="19" r="2" fill="#25173B" />
            <path d="M7 7l3 3M17 7l-3 3M7 17l3-3M12 9V5" />
          </svg>
        </div>
        <span className="text-xl font-bold tracking-tight text-teal-400">MedNexus</span>
      </div>

      {/* Right pane - Form Component */}
      <div className="w-full lg:w-[45%] flex flex-1 items-center justify-center p-6 relative">
        <div className="w-full max-w-[460px] rounded-xl border border-surface-800/60 bg-[#0a1428] p-10 shadow-card-teal relative overflow-hidden z-10 transition-all duration-500 sm:rounded-2xl">
          
          {/* Subtle lighting internally */}
          <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-teal-500/10 rounded-full blur-[80px] pointer-events-none" />
          
          {/* Title & Descr */}
          <div className="mb-10 relative z-10">
            <h2 className="text-[28px] font-bold tracking-tight text-white mb-3">
              {activeTab === 'login' ? 'Login' : 'Sign up'}
            </h2>
            <p className="text-surface-400 text-[15px]">
              {activeTab === 'login' 
                ? 'Enter your credentials to access the clinical prism.' 
                : 'Create an account to join the MedNexus network.'}
            </p>
          </div>

          <div className="relative z-10">
             {activeTab === 'login' ? (
                <LoginForm onSuccess={handleSuccess} />
             ) : (
                <SignupForm onSuccess={handleSuccess} />
             )}
          </div>

          {/* Toggle Tab Footer */}
          <div className="mt-8 text-center text-xs text-surface-500 relative z-10">
            {activeTab === 'login' ? (
              <p>Don't have access? <button onClick={() => setActiveTab('signup')} className="text-teal-400 hover:text-teal-300 font-medium ml-1">Request Account</button></p>
            ) : (
              <p>Already registered? <button onClick={() => setActiveTab('login')} className="text-teal-400 hover:text-teal-300 font-medium ml-1">Return to Login</button></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
