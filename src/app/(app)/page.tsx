"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from 'react';
import { CheckInTab } from "@/components/user/check-in-tab";
import { ProgressTab } from "@/components/user/progress-tab";
import { StatsTab } from "@/components/user/stats-tab";
import { SummaryTab } from "@/components/user/summary-tab";

function TabContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');

  switch (tab) {
    case 'progress':
      return <ProgressTab />;
    case 'stats':
      return <StatsTab />;
    case 'summary':
      return <SummaryTab />;
    default:
      return <CheckInTab />;
  }
}

export default function UserHomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TabContent />
    </Suspense>
  );
}
