import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from '@mednexus/shared/firebase';
import { useAuthStore } from '@mednexus/auth/data-access';
import type { LoginCredentials } from '@mednexus/shared/types';
import { loginSchema } from '@mednexus/shared/types';

export function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { setUser, setLoading, setError } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginCredentials) => {
    try {
      setErrorMsg('');
      setLoading(true);
      const userCredential = await signIn(data.email, data.password);

      setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email || '',
        displayName: userCredential.user.displayName,
        photoURL: null,
        role: 'doctor',
        createdAt: new Date().toISOString(),
      });

      onSuccess();
    } catch (err: unknown) {
      setError((err as Error).message);
      setErrorMsg('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {errorMsg && (
        <div className="p-3 text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded-md">
          {errorMsg}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="email" className="text-[11px] font-bold tracking-[0.12em] text-teal-400 uppercase">
          Medical ID / Email
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-[14px] flex items-center pointer-events-none text-surface-500 group-focus-within:text-teal-500 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M2 6l10 7 10-7" />
            </svg>
          </div>
          <input
            id="email"
            type="email"
            className="w-full rounded-lg border border-surface-700/50 bg-surface-950 py-[14px] pl-[40px] pr-4 text-[15px] font-medium text-surface-200 shadow-inner transition-all placeholder:font-normal placeholder:text-surface-500 focus:border-teal-500/40 focus:outline-none focus:ring-1 focus:ring-teal-500/30"
            placeholder="julian.vance@mednexus.com"
            {...register('email')}
          />
          {errors.email && (
            <p className="absolute -bottom-5 text-[11px] text-red-500">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-[11px] font-bold tracking-[0.12em] text-teal-400 uppercase">
            Security Key
          </label>
          <a href="#" className="text-xs text-surface-400 hover:text-white transition-colors">
            Forgot password?
          </a>
        </div>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-[14px] flex items-center pointer-events-none text-surface-500 group-focus-within:text-teal-500 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            className="w-full rounded-lg border border-surface-700/50 bg-surface-950 py-[14px] pl-[40px] pr-11 text-[15px] font-medium tracking-widest text-surface-200 shadow-inner transition-all placeholder:tracking-normal placeholder:font-normal placeholder:text-surface-500 focus:border-teal-500/40 focus:outline-none focus:ring-1 focus:ring-teal-500/30"
            placeholder="••••••••••••"
            {...register('password')}
          />
          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-0 flex items-center pr-[14px] text-surface-500 hover:text-surface-300"
          >
            {showPassword ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
          {errors.password && (
            <p className="absolute -bottom-5 text-[11px] text-red-500">{errors.password.message}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white font-medium py-[14px] rounded-lg mt-8 shadow-button-glow transition-all duration-300 flex justify-center items-center gap-2 group disabled:opacity-75"
      >
        {isSubmitting ? 'Authenticating...' : 'Log In'}
        {!isSubmitting && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        )}
      </button>
    </form>
  );
}
