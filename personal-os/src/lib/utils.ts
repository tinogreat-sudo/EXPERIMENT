import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(minutes: number): string {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins}m`;
  return mins === 0 ? `${hrs}h` : `${hrs}h ${mins}m`;
}

export function formatTimerDigits(totalSeconds: number): { minutes: string; seconds: string } {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return {
    minutes: String(mins).padStart(2, "0"),
    seconds: String(secs).padStart(2, "0"),
  };
}

export function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0];
}

export function getDayOfWeek(date?: Date): string {
  const d = date || new Date();
  return d.toLocaleDateString("en-US", { weekday: "long" });
}

export function getFormattedDate(date?: Date): string {
  const d = date || new Date();
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

export function getCurrentTimeString(): string {
  return new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/** Apply a theme value to the document root */
export function applyTheme(theme: "dark" | "light" | "system"): void {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else if (theme === "light") {
    document.documentElement.classList.remove("dark");
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", prefersDark);
  }
}

/** Format minutes into a decimal hours string, e.g. 90 → "1.5h" */
export function minutesToHours(minutes: number): string {
  return `${Math.round((minutes / 60) * 10) / 10}h`;
}
