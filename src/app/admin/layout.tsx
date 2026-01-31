import { AuthGuard } from "@/components/auth-guard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import Link from "next/link";
import { Dumbbell, LogOut } from "lucide-react";
import { AdminHeader } from "./_components/header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requiredRole="admin">
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <AdminHeader />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                {children}
            </main>
        </div>
    </AuthGuard>
  );
}
