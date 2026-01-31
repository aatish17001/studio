import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-6 w-6", className)}
    >
      <path d="M11.4 2.7C10.1 1.4 8.1 1.4 6.8 2.7L3.5 6c-1.3 1.3-1.3 3.3 0 4.6l3.4 3.4c1.3 1.3 3.3 1.3 4.6 0l1.5-1.5" />
      <path d="m18 13 1.5-1.5c1.3-1.3 1.3-3.3 0-4.6l-3.4-3.4c-1.3-1.3-3.3-1.3-4.6 0L10 5" />
      <path d="M2 22l5-5" />
      <path d="m13 18 5-5" />
      <path d="M15 3h6v6" />
      <path d="M3 15v6h6" />
    </svg>
  );
}
