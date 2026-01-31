import type { Timestamp } from 'firebase/firestore';

export type UserRole = 'admin' | 'user';

export interface UserProfile {
  uid: string;
  email: string | null;
  role: UserRole;
  currentStreak: number;
  lastCheckIn: Timestamp | null;
  name: string | null;
  photoURL: string | null;
}

export interface Checkin {
  id: string;
  userId: string;
  timestamp: Timestamp;
  userName?: string;
  userEmail?: string;
}
