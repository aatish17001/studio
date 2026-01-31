"use client";

import { useAuth } from '@/components/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import type { UserRole } from '@/types';

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: UserRole | 'any';
}

export function AuthGuard({ children, requiredRole = 'any' }: AuthGuardProps) {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      router.push('/login');
      return;
    }

    if (requiredRole !== 'any' && userProfile?.role !== requiredRole) {
      if (userProfile?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    }
  }, [user, userProfile, loading, router, requiredRole]);

  if (loading || !user || (requiredRole !== 'any' && userProfile?.role !== requiredRole)) {
     return (
        <div className="w-full h-screen flex items-center justify-center bg-background">
           <div className="flex items-center space-x-2">
             <div className="w-4 h-4 rounded-full bg-primary animate-pulse"></div>
             <div className="w-4 h-4 rounded-full bg-primary animate-pulse [animation-delay:0.2s]"></div>
             <div className="w-4 h-4 rounded-full bg-primary animate-pulse [animation-delay:0.4s]"></div>
           </div>
        </div>
    );
  }

  return <>{children}</>;
}
