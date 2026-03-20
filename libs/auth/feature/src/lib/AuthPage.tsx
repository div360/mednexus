import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Button,
} from '@mednexus/shared/ui';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { useAuthStore } from '@mednexus/auth/data-access';
import { signOut } from '@mednexus/shared/firebase';

export function AuthPage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('login');

  const handleLogout = async () => {
    await signOut();
    logout();
  };

  if (isAuthenticated && user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-50 p-4">
        <Card className="w-full max-w-md shadow-xl border-surface-200 text-center py-8">
          <CardHeader>
            <div className="w-16 h-16 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              {user.displayName?.charAt(0) || user.email.charAt(0).toUpperCase()}
            </div>
            <CardTitle className="text-2xl text-brand-900">
              Welcome to MedNexus
            </CardTitle>
            <CardDescription className="text-surface-600 mt-2">
              Authentication was successful.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-left">
            <div className="bg-surface-100 rounded-md p-4 text-sm font-mono overflow-auto">
              <p>
                <strong>Name:</strong> {user.displayName}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Role:</strong> {user.role}
              </p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="w-full mt-6">
              Sign out for testing
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex w-1/2 bg-brand-900 flex-col p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <svg width="400" height="400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v4h4v2h-4v4h-2v-4H7v-2h4V7z" />
          </svg>
        </div>

        <div className="relative z-10 flex items-center gap-2 font-bold text-2xl tracking-tight mb-auto">
          <div className="w-8 h-8 rounded bg-teal-500 flex items-center justify-center text-white">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          MedNexus
        </div>

        <div className="relative z-10 mt-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Your Healthcare,
            <br />
            Connected.
          </h1>
          <p className="text-brand-200 text-lg max-w-md">
            The central platform for clinical insights, patient management, and
            collaborative care.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-surface-50">
        <div className="w-full max-w-md space-y-6 animate-fade-in">
          <div className="flex flex-col space-y-2 lg:hidden text-center mb-8">
            <div className="mx-auto w-10 h-10 rounded bg-brand-600 flex items-center justify-center text-white mb-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-surface-900">
              MedNexus
            </h1>
          </div>

          <Card className="border-0 shadow-lg shadow-surface-200/50">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Get started</CardTitle>
              <CardDescription className="text-center">
                Sign in to your account or create a new one
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="login" className="animate-slide-up">
                  <LoginForm onSuccess={() => {}} />
                </TabsContent>
                <TabsContent value="signup" className="animate-slide-up">
                  <SignupForm onSuccess={() => {}} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-surface-500">
            Secure, HIPAA-compliant access for healthcare providers.
          </p>
        </div>
      </div>
    </div>
  );
}
