"use client";

import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, orderBy, Timestamp, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import type { Checkin } from "@/types";
import { formatDistanceToNow } from "date-fns";

export default function RecentActivity() {
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfToday = Timestamp.fromDate(today);

    const q = query(
      collection(db, "checkins"),
      where("timestamp", ">=", startOfToday),
      orderBy("timestamp", "desc"),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newCheckins: Checkin[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Checkin));
      setCheckins(newCheckins);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Users who checked in today.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))
        )}
        {!loading && checkins.length === 0 && (
          <p className="text-muted-foreground text-sm">No check-ins yet today.</p>
        )}
        {checkins.map((checkin) => (
          <div key={checkin.id} className="flex items-center gap-4">
            <Avatar>
              {/* Assuming user profile pic is not stored on checkin, this is a placeholder */}
              <AvatarFallback>{checkin.userName?.charAt(0) ?? 'U'}</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none">{checkin.userName}</p>
              <p className="text-sm text-muted-foreground">{checkin.userEmail}</p>
            </div>
            <div className="ml-auto text-sm text-muted-foreground">
              {checkin.timestamp && formatDistanceToNow(checkin.timestamp.toDate(), { addSuffix: true })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
