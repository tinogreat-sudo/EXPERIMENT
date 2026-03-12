import { db } from "./db";
import type { HabitLog } from "@/types";

/**
 * Computes the current streak for a habit based on consecutive days of completion.
 * For positive habits: counts consecutive "done" days going backwards from today.
 * For negative habits: counts consecutive "resisted" or "no-urge" days going backwards.
 */
export async function computeStreak(
  habitId: string,
  habitType: "positive" | "negative"
): Promise<{ currentStreak: number; longestStreak: number }> {
  const logs = await db.habitLogs
    .where("habitId")
    .equals(habitId)
    .toArray();

  if (logs.length === 0) return { currentStreak: 0, longestStreak: 0 };

  // Get unique dates sorted descending
  const dateMap = new Map<string, HabitLog>();
  for (const log of logs) {
    const existing = dateMap.get(log.date);
    if (!existing || log.updatedAt > existing.updatedAt) {
      dateMap.set(log.date, log);
    }
  }

  const sortedDates = Array.from(dateMap.keys()).sort().reverse();

  function isSuccess(log: HabitLog): boolean {
    if (habitType === "positive") return log.status === "done";
    return log.status === "resisted" || log.status === "no-urge";
  }

  // Current streak: count consecutive days backwards from today
  let currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const checkDate = new Date(today);
  for (let i = 0; i < 365; i++) {
    const dateStr = checkDate.toISOString().split("T")[0];
    const log = dateMap.get(dateStr);

    if (log && isSuccess(log)) {
      currentStreak++;
    } else if (i === 0 && !log) {
      // Today hasn't been logged yet — don't break streak, just skip
    } else {
      break;
    }
    checkDate.setDate(checkDate.getDate() - 1);
  }

  // Longest streak: scan all dates
  let longestStreak = 0;
  let streak = 0;
  const allDates = Array.from(dateMap.keys()).sort();

  for (let i = 0; i < allDates.length; i++) {
    const log = dateMap.get(allDates[i])!;
    if (isSuccess(log)) {
      streak++;
      // Check for consecutive day
      if (i > 0) {
        const prev = new Date(allDates[i - 1]);
        const curr = new Date(allDates[i]);
        const diffDays = Math.round((curr.getTime() - prev.getTime()) / 86400000);
        if (diffDays > 1) streak = 1; // gap found, reset
      }
      longestStreak = Math.max(longestStreak, streak);
    } else {
      streak = 0;
    }
  }

  return { currentStreak, longestStreak: Math.max(longestStreak, currentStreak) };
}

/**
 * Updates streak fields on all active habits based on their logs.
 * Call this once per day or after any habit log change.
 */
export async function updateAllStreaks() {
  const habits = await db.habits.where("isActive").equals("true").toArray()
    .catch(() => db.habits.filter((h) => h.isActive).toArray());

  for (const habit of habits) {
    const { currentStreak, longestStreak } = await computeStreak(habit.id, habit.type);
    if (habit.currentStreak !== currentStreak || habit.longestStreak !== longestStreak) {
      await db.habits.update(habit.id, {
        currentStreak,
        longestStreak,
        updatedAt: new Date().toISOString(),
      });
    }
  }
}
