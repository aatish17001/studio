import RecentActivity from "@/components/admin/recent-activity";
import QrScanner from "@/components/admin/qr-scanner";

export default function AdminDashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2">
      <RecentActivity />
      <QrScanner />
    </div>
  );
}
