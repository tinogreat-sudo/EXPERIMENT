"use client";

import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";

const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/schedule": "Schedule",
  "/timer": "Timer",
  "/habits": "Habits",
  "/goals": "Goals",
  "/journal": "Journal",
  "/analytics": "Analytics",
  "/ai-coach": "AI Coach",
};

export function TopBar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const title = PAGE_TITLES[pathname] ?? "Personal OS";

  return (
    <header className="md:hidden sticky top-0 z-40 h-14 flex items-center justify-between px-4 border-b border-border-light dark:border-border-dark bg-bg-light/80 dark:bg-bg-dark/80 backdrop-blur-lg">
      <div className="flex items-center gap-2">
        <div className="bg-primary p-1.5 rounded-lg text-white flex items-center justify-center">
          <span className="material-symbols-outlined text-sm">rocket_launch</span>
        </div>
        <h1 className="text-lg font-bold">{title}</h1>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="size-9 rounded-lg flex items-center justify-center hover:bg-surface-light-hover dark:hover:bg-surface-dark-hover cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">
            {theme === "dark" ? "light_mode" : "dark_mode"}
          </span>
        </button>
        <button className="size-9 rounded-lg flex items-center justify-center hover:bg-surface-light-hover dark:hover:bg-surface-dark-hover cursor-pointer">
          <span className="material-symbols-outlined text-lg">settings</span>
        </button>
      </div>
    </header>
  );
}
