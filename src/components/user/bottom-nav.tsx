"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { QrCode, LineChart, BarChart, Sparkles, User } from "lucide-react";

const navItems = [
  { href: "", icon: QrCode, label: "Check-in" },
  { href: "progress", icon: BarChart, label: "Progress" },
  { href: "stats", icon: LineChart, label: "Stats" },
  { href: "summary", icon: Sparkles, label: "Summary" },
];

export function BottomNav() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-border bg-background/80 backdrop-blur-md md:hidden">
      <nav className="flex h-16 items-center justify-around">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href ? `/?tab=${item.href}` : "/"}
            className={cn(
              "flex flex-col items-center gap-1 p-2 text-muted-foreground transition-colors",
              activeTab === item.href ? "text-primary" : "hover:text-foreground"
            )}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
