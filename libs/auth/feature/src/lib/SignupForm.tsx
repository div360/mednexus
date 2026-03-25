import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUp } from '@mednexus/shared/firebase';
import { getAuthStore, upsertUserProfileInFirestore } from '@mednexus/auth/data-access';
import type { AppUser, SignupCredentials } from '@mednexus/shared/types';
import { signupSchema } from '@mednexus/shared/types';

export function SignupForm({ onSuccess }: { onSuccess: () => void }) {
  const [errorMsg, setErrorMsg] = useState('');
  const useHostAuth = getAuthStore();
  const { setUser, setLoading, setError } = useHostAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupCredentials>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupCredentials) => {
    try {
      setErrorMsg('');
      setLoading(true);
      const userCredential = await signUp(
        data.email,
        data.password,
        data.displayName
      );

      const appUser: AppUser = {
        uid: userCredential.user.uid,
        email: userCredential.user.email || '',
        displayName: data.displayName,
        photoURL: null,
        role: 'doctor',
        createdAt: new Date().toISOString(),
      };
      setUser(appUser);
      await upsertUserProfileInFirestore(appUser);
      onSuccess();
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      setError(error.message ?? '');
      setErrorMsg(
        error.code === 'auth/email-already-in-use'
          ? 'Email is already registered. Please sign in.'
          : 'Failed to create account. Please try again.'
      );
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

      {/* Name Input */}
      <div className="space-y-2">
        <label htmlFor="displayName" className="text-[11px] font-bold tracking-[0.1em] text-teal-600 uppercase">
          Full Name
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-[14px] flex items-center pointer-events-none text-surface-500 group-focus-within:text-teal-500 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <input
            id="displayName"
            className="w-full bg-surface-950 border border-brand-800/20 text-surface-200 text-[15px] font-medium rounded-lg pl-[40px] pr-4 py-[14px] focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500 transition-all placeholder:text-surface-700 placeholder:font-normal shadow-inner"
            placeholder="Dr. Julia Vance"
            {...register('displayName')}
          />
          {errors.displayName && (
            <p className="absolute -bottom-5 text-[11px] text-red-500">{errors.displayName.message}</p>
          )}
        </div>
      </div>

      {/* Email Input */}
      <div className="space-y-2 pt-2">
        <label htmlFor="signup-email" className="text-[11px] font-bold tracking-[0.1em] text-teal-600 uppercase">
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
            id="signup-email"
            type="email"
            className="w-full bg-surface-950 border border-brand-800/20 text-surface-200 text-[15px] font-medium rounded-lg pl-[40px] pr-4 py-[14px] focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500 transition-all placeholder:text-surface-700 placeholder:font-normal shadow-inner"
            placeholder="julian.vance@mednexus.com"
            {...register('email')}
          />
          {errors.email && (
            <p className="absolute -bottom-5 text-[11px] text-red-500">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Grid for passwords */}
      <div className="grid grid-cols-2 gap-4 pt-2">
        {/* Password */}
        <div className="space-y-2">
          <label htmlFor="signup-password" className="text-[11px] font-bold tracking-[0.1em] text-teal-600 uppercase">
            Security Key
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-[14px] flex items-center pointer-events-none text-surface-500 group-focus-within:text-teal-500 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
            </div>
            <input
              id="signup-password"
              type="password"
              className="w-full bg-surface-950 border border-brand-800/20 text-surface-200 text-[15px] tracking-widest font-bold rounded-lg pl-[40px] pr-3 py-[14px] focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500 transition-all placeholder:text-surface-700 placeholder:font-normal placeholder:tracking-normal shadow-inner"
              placeholder="••••••••"
              {...register('password')}
            />
            {errors.password && (
              <p className="absolute -bottom-5 text-[11px] text-red-500">{errors.password.message}</p>
            )}
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-[11px] font-bold tracking-[0.1em] text-teal-600 uppercase">
            Confirm Key
          </label>
          <div className="relative group">
            <input
              id="confirmPassword"
              type="password"
              className="w-full bg-surface-950 border border-brand-800/20 text-surface-200 text-[15px] tracking-widest font-bold rounded-lg px-4 py-[14px] focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500 transition-all placeholder:text-surface-700 placeholder:font-normal placeholder:tracking-normal shadow-inner"
              placeholder="••••••••"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="absolute -bottom-5 text-[11px] text-red-500 whitespace-nowrap">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white font-medium py-[14px] rounded-lg mt-8 shadow-button-glow transition-all duration-300 flex justify-center items-center gap-2 group disabled:opacity-75"
      >
        {isSubmitting ? 'Registering...' : 'Create Account'}
        {!isSubmitting && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5c-1.1 0-2 .9-2 2v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
        )}
      </button>
    </form>
  );
}
