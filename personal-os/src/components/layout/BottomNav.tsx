"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/", label: "Home", icon: "dashboard" },
  { href: "/schedule", label: "Schedule", icon: "calendar_today" },
  { href: "/timer", label: "Timer", icon: "timer" },
  { href: "/habits", label: "Habits", icon: "checklist" },
  { href: "/ai-coach", label: "Coach", icon: "psychology" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 bg-surface-light dark:bg-bg-dark border-t border-border-light dark:border-border-dark flex items-center justify-around px-2">
      {TABS.map((tab) => {
        const isActive = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex flex-col items-center gap-0.5 min-w-[48px] py-1 rounded-lg transition-colors",
              isActive ? "text-primary" : "text-text-muted-light dark:text-text-muted-dark"
            )}
          >
            <span className={cn("material-symbols-outlined text-xl", isActive && "filled")}>
              {tab.icon}
            </span>
            <span className="text-[10px] font-bold">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
