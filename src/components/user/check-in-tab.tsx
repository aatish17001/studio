"use client";

import { useAuth } from "@/components/providers/auth-provider";
import QRCode from "react-qr-code";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { isToday } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, XCircle } from "lucide-react";

export function CheckInTab() {
  const { userProfile } = useAuth();

  if (!userProfile) {
    return null;
  }
  
  const hasCheckedInToday = userProfile.lastCheckIn ? isToday(userProfile.lastCheckIn.toDate()) : false;

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-background p-4 sm:p-6">
      <Card className="w-full max-w-sm overflow-hidden border-2 border-primary/50 shadow-lg shadow-primary/10">
        <CardHeader className="items-center text-center p-4 bg-muted/30">
            <Avatar className="h-20 w-20 border-2 border-primary mb-2">
                <AvatarImage src={userProfile.photoURL ?? ''} alt={userProfile.name ?? 'User'} />
                <AvatarFallback>{userProfile.name?.charAt(0) ?? 'U'}</AvatarFallback>
            </Avatar>
            <CardTitle className="font-headline text-2xl">{userProfile.name}</CardTitle>
            <CardDescription className="font-code text-xs text-muted-foreground">{userProfile.uid}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6 gap-6">
          <div className="bg-white p-4 rounded-lg">
             <QRCode
                value={userProfile.uid}
                size={256}
                bgColor="#FFFFFF"
                fgColor="#222222"
                level="Q"
                className="w-full max-w-[200px] h-auto"
            />
          </div>

          <div className="flex flex-col items-center gap-2 text-center">
            {hasCheckedInToday ? (
                <div className="flex items-center gap-2 text-primary">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold">You have checked in today!</span>
                </div>
            ) : (
                <div className="flex items-center gap-2 text-amber-400">
                    <XCircle className="h-5 w-5" />
                    <span className="font-semibold">You have not checked in today</span>
                </div>
            )}
             <p className="text-sm text-muted-foreground">Present this QR code to the admin to check in.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
