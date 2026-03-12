"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  iconFilled?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Dashboard", icon: "dashboard" },
  { href: "/schedule", label: "Schedule", icon: "calendar_today" },
  { href: "/timer", label: "Timer", icon: "timer" },
  { href: "/habits", label: "Habits", icon: "checklist" },
  { href: "/goals", label: "Goals", icon: "ads_click" },
  { href: "/skills", label: "Skills", icon: "military_tech" },
  { href: "/journal", label: "Journal", icon: "edit_note" },
  { href: "/analytics", label: "Analytics", icon: "monitoring" },
  { href: "/ai-coach", label: "AI Coach", icon: "psychology" },
];

export function Sidebar() {
  const pathname = usePathname();
  const longestStreak = useLiveQuery(async () => {
    const habits = await db.habits.filter((h) => h.isActive).toArray();
    return habits.reduce((max, h) => Math.max(max, h.currentStreak), 0);
  }) ?? 0;

  return (
    <aside className="hidden md:flex w-20 lg:w-64 flex-col border-r border-border-dark bg-bg-light dark:bg-bg-dark h-screen sticky top-0 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 p-6">
        <div className="bg-primary p-2 rounded-xl text-white flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined">rocket_launch</span>
        </div>
        <h2 className="hidden lg:block text-xl font-bold tracking-tight text-text-primary-light dark:text-text-primary-dark">
          Personal OS
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 px-3">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-3 py-3 rounded-xl transition-colors",
                isActive
                  ? "bg-primary-light text-primary font-semibold"
                  : "text-text-secondary-light dark:text-text-secondary-dark hover:bg-primary/5"
              )}
            >
              <span className={cn("material-symbols-outlined", isActive && "filled")}>
                {item.icon}
              </span>
              <span className="hidden lg:block text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="mt-auto border-t border-border-light dark:border-border-dark p-4 flex flex-col gap-3">
        {/* Streak counter */}
        {longestStreak > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-warning/10">
            <span className="material-symbols-outlined text-warning text-lg filled">local_fire_department</span>
            <span className="hidden lg:block text-sm font-bold text-warning">{longestStreak}d streak</span>
          </div>
        )}
        {/* Settings link */}
        <Link
          href="#"
          className="flex items-center gap-4 px-3 py-2 rounded-xl text-text-secondary-light dark:text-text-secondary-dark hover:bg-primary/5 transition-colors"
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="hidden lg:block text-sm">Settings</span>
        </Link>
        <div className="flex items-center gap-3 px-2">
          <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-lg">person</span>
          </div>
          <div className="hidden lg:block overflow-hidden">
            <p className="text-sm font-bold truncate text-text-primary-light dark:text-text-primary-dark">
              User
            </p>
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
              Personal OS
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
