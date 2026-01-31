"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Dumbbell } from 'lucide-react';

function GoogleIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.94 11.06A10.82 10.82 0 0 0 12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c2.86 0 5.48-1.12 7.4-2.94" />
            <path d="M22 12h-8" />
            <path d="M12 4V2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m19.07 19.07 1.41 1.41" />
            <path d="M12 22v-2" />
            <path d="m4.93 19.07 1.41-1.41" />
            <path d="m19.07 4.93 1.41-1.41" />
        </svg>
    )
}

export default function LoginPage() {
  const { user, userProfile, signIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      if (userProfile?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    }
  }, [user, userProfile, loading, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <Dumbbell className="h-16 w-16 text-primary" />
          <h1 className="text-4xl font-bold tracking-tighter text-foreground sm:text-5xl font-headline">
            GymStreak Pro
          </h1>
          <p className="text-muted-foreground">
            Sign in to track your streak and manage the gym.
          </p>
        </div>
        <div className="flex justify-center">
            <Button
              onClick={signIn}
              disabled={loading}
              className="w-full max-w-xs transition-transform duration-200 hover:scale-105 bg-card border hover:bg-muted"
              variant="outline"
              size="lg"
            >
              <GoogleIcon />
              Sign in with Google
            </Button>
        </div>
      </div>
    </div>
  );
}
