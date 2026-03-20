import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Label } from '@mednexus/shared/ui';
import { signIn } from '@mednexus/shared/firebase';
import { useAuthStore } from '@mednexus/auth/data-access';
import type { LoginCredentials } from '@mednexus/shared/types';
import { loginSchema } from '@mednexus/shared/types';

export function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [errorMsg, setErrorMsg] = useState('');
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errorMsg && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
          {errorMsg}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          placeholder="doctor@mednexus.app"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <a href="#" className="text-xs text-brand-600 hover:underline">
            Forgot password?
          </a>
        </div>
        <Input id="password" type="password" {...register('password')} />
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
}
