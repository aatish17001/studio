"use client";

import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Hourglass } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export function StatsTab() {
  const [occupancy, setOccupancy] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const oneHourAgo = Timestamp.fromMillis(Date.now() - 60 * 60 * 1000);
    const q = query(
      collection(db, "checkins"),
      where("timestamp", ">", oneHourAgo)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOccupancy(snapshot.size);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="container mx-auto max-w-2xl p-4 sm:p-6 space-y-6">
      <h1 className="text-3xl font-bold font-headline text-foreground">Live Gym Stats</h1>
      
      <Card className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
        <CardHeader>
            <div className="flex items-center gap-2 text-foreground">
                <Users className="h-5 w-5" />
                <CardTitle>Current Occupancy</CardTitle>
            </div>
          <CardDescription>Number of people checked in within the last hour.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
             <Skeleton className="w-24 h-16" />
          ) : (
            <p className="text-7xl font-bold text-primary">{occupancy}</p>
          )}
        </CardContent>
        <Hourglass className="absolute -right-8 -bottom-8 h-40 w-40 text-foreground/5" />
      </Card>
    </div>
  );
}
