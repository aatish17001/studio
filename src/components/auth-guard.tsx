"use client";

import { useAuth } from '@/components/providers/auth-provider';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import type { UserRole } from '@/types';

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: UserRole | 'any';
}

export function AuthGuard({ children, requiredRole = 'any' }: AuthGuardProps) {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      if (pathname !== '/login') {
        router.push('/login');
      }
      return;
    }

    if (requiredRole !== 'any') {
      if (!userProfile) {
        // Profile not loaded or failed to create. 
        // Do not redirect to / if we are already seeing an error or loading.
        // Effectively we wait or let the loading state persist if we consider profile mandatory.
        return;
      }

      if (userProfile.role !== requiredRole) {
        if (userProfile.role === 'admin') {
          if (pathname !== '/admin') {
            router.push('/admin');
          }
        } else {
          if (pathname !== '/') {
            router.push('/');
          }
        }
      }
    }
  }, [user, userProfile, loading, router, requiredRole, pathname]);

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
