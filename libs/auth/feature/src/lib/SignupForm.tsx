import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Label } from '@mednexus/shared/ui';
import { signUp } from '@mednexus/shared/firebase';
import { useAuthStore } from '@mednexus/auth/data-access';
import type { SignupCredentials } from '@mednexus/shared/types';
import { signupSchema } from '@mednexus/shared/types';

export function SignupForm({ onSuccess }: { onSuccess: () => void }) {
  const [errorMsg, setErrorMsg] = useState('');
  const { setUser, setLoading, setError } = useAuthStore();

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

      setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email || '',
        displayName: data.displayName,
        photoURL: null,
        role: 'doctor',
        createdAt: new Date().toISOString(),
      });

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errorMsg && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
          {errorMsg}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="displayName">Full Name</Label>
        <Input
          id="displayName"
          placeholder="Dr. John Doe"
          {...register('displayName')}
        />
        {errors.displayName && (
          <p className="text-xs text-red-500">{errors.displayName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-email">Email address</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="doctor@mednexus.app"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <Input
          id="signup-password"
          type="password"
          {...register('password')}
        />
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  );
}
