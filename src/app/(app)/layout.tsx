import { AuthGuard } from "@/components/auth-guard";
import { BottomNav } from "@/components/user/bottom-nav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requiredRole="user">
      <main className="pb-16 md:pb-0">
        {children}
      </main>
      <BottomNav />
    </AuthGuard>
  );
}
