"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, GoogleAuthProvider, signInWithRedirect, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { UserProfile } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        const userRef = doc(db, 'users', userAuth.uid);
        try {
          const snapshot = await getDoc(userRef);
          if (snapshot.exists()) {
            setUserProfile(snapshot.data() as UserProfile);
          } else {
            // New user, create profile
            const newUserProfile: UserProfile = {
              uid: userAuth.uid,
              email: userAuth.email,
              role: 'user',
              currentStreak: 0,
              lastCheckIn: null,
              name: userAuth.displayName,
              photoURL: userAuth.photoURL,
            };
            await setDoc(userRef, newUserProfile);
            setUserProfile(newUserProfile);
          }
          setUser(userAuth);
        } catch (error) {
          console.error("Auth provider error:", error);
          setUser(null);
          setUserProfile(null);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };
  
  const value = { user, userProfile, loading, signIn, signOut };

  if (loading) {
    return (
        <div className="w-full h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
          </div>
        </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
