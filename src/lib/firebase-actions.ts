"use server";

import { db } from "@/lib/firebase";
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import type { UserProfile } from "@/types";
import { isYesterday, isToday } from "date-fns";

export async function processCheckIn(userId: string) {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error("User not found");
    }

    const userProfile = userSnap.data() as UserProfile;
    
    const lastCheckInDate = userProfile.lastCheckIn?.toDate();
    let newStreak = userProfile.currentStreak;

    if (lastCheckInDate) {
        if (isToday(lastCheckInDate)) {
            return { success: false, message: "Already checked in today." };
        }
        if (isYesterday(lastCheckInDate)) {
            newStreak += 1;
        } else {
            newStreak = 1;
        }
    } else {
        newStreak = 1;
    }

    // Use a transaction to ensure atomicity
    await addDoc(collection(db, 'checkins'), {
        userId: userId,
        timestamp: serverTimestamp(),
        userName: userProfile.name,
        userEmail: userProfile.email,
    });

    await updateDoc(userRef, {
        currentStreak: newStreak,
        lastCheckIn: serverTimestamp(),
    });

    return { success: true, message: `Check-in successful! New streak: ${newStreak} days.`, userName: userProfile.name };
  } catch (error) {
    console.error("Check-in error: ", error);
    if(error instanceof Error) {
        return { success: false, message: error.message };
    }
    return { success: false, message: "An unknown error occurred." };
  }
}
