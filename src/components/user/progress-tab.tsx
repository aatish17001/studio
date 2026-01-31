"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, Timestamp, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { FireIcon } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export function ProgressTab() {
  const { userProfile } = useAuth();
  const [checkInDays, setCheckInDays] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userProfile) return;

    setLoading(true);
    const q = query(
      collection(db, "checkins"),
      where("userId", "==", userProfile.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const dates = querySnapshot.docs.map(doc => (doc.data().timestamp as Timestamp).toDate());
      setCheckInDays(dates);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userProfile]);

  const DayWithFire = ({ date }: { date: Date }) => (
    <div className="relative flex h-full w-full items-center justify-center">
      <span className="absolute">{date.getDate()}</span>
      <FireIcon className="h-5 w-5 text-primary opacity-60" />
    </div>
  );

  return (
    <div className="container mx-auto max-w-2xl p-4 sm:p-6 space-y-6">
      <h1 className="text-3xl font-bold font-headline text-foreground">Your Progress</h1>
      
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-primary">Current Streak</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <p className="text-7xl font-bold text-foreground">
              {userProfile?.currentStreak ?? 0}
            </p>
            <span className="text-xl font-medium text-muted-foreground">days</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Check-in Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="w-full h-[300px]" />
          ) : (
            <Calendar
                mode="multiple"
                selected={checkInDays}
                className="p-0"
                modifiers={{
                    checkedIn: checkInDays,
                }}
                modifiersClassNames={{
                    checkedIn: 'bg-primary/10 rounded-md',
                }}
                components={{
                    DayContent: ({ date }) => {
                        const isCheckedIn = checkInDays.some(d => d.toDateString() === date.toDateString());
                        return isCheckedIn ? <DayWithFire date={date} /> : <div>{date.getDate()}</div>;
                    },
                }}
                classNames={{
                    day_selected: "bg-primary/20 text-primary-foreground font-bold",
                    day_today: "ring-2 ring-primary ring-offset-2 ring-offset-background",
                }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
