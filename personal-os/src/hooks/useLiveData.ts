"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { getTodayDateString } from "@/lib/utils";
import type { DayPlan, DayTemplate, TimeBlock, TimeSession, HabitLog, Goal, Habit, Category, Skill, UrgeEvent, JournalEntry, UserSettings, DailyScore } from "@/types";

export function useTodayPlan(): DayPlan | undefined {
  const today = getTodayDateString();
  return useLiveQuery(() => db.dayPlans.where("date").equals(today).first());
}

export function useTodayBlocks(): TimeBlock[] {
  const plan = useTodayPlan();
  return useLiveQuery(
    () => (plan ? db.timeBlocks.where("dayPlanId").equals(plan.id).sortBy("startTime") : Promise.resolve([] as TimeBlock[])),
    [plan?.id]
  ) ?? [];
}

export function useTodaySessions(): TimeSession[] {
  const plan = useTodayPlan();
  return useLiveQuery(
    () => (plan ? db.timeSessions.where("dayPlanId").equals(plan.id).toArray() : Promise.resolve([] as TimeSession[])),
    [plan?.id]
  ) ?? [];
}

export function useTodayHabitLogs(): HabitLog[] {
  const today = getTodayDateString();
  return useLiveQuery(() => db.habitLogs.where("date").equals(today).toArray()) ?? [];
}

export function useActiveGoals(): Goal[] {
  return useLiveQuery(() => db.goals.where("status").equals("active").toArray()) ?? [];
}

export function useHabits(activeOnly = true): Habit[] {
  return useLiveQuery(
    () => (activeOnly ? db.habits.filter((h) => h.isActive).toArray() : db.habits.toArray()),
    [activeOnly]
  ) ?? [];
}

export function useDayTemplates() {
  return useLiveQuery(() => db.dayTemplates.toArray()) ?? [];
}

export function useCategories(): Category[] {
  return useLiveQuery(() => db.categories.orderBy("sortOrder").toArray()) ?? [];
}

// ===== Phase 2 Hooks =====

export function useSkills(): Skill[] {
  return useLiveQuery(() => db.skills.toArray()) ?? [];
}

export function useUserSettings(): UserSettings | undefined {
  return useLiveQuery(async () => {
    const arr = await db.userSettings.toArray();
    return arr[0];
  });
}

export function useTodayUrgeEvents(): UrgeEvent[] {
  const plan = useTodayPlan();
  return useLiveQuery(
    () => (plan ? db.urgeEvents.where("dayPlanId").equals(plan.id).toArray() : Promise.resolve([] as UrgeEvent[])),
    [plan?.id]
  ) ?? [];
}

export function useTodayJournal(): JournalEntry | undefined {
  const today = getTodayDateString();
  return useLiveQuery(() => db.journalEntries.where("date").equals(today).first());
}

export function useRecentScores(days: number = 7): DailyScore[] {
  return useLiveQuery(async () => {
    return db.dailyScores.orderBy("date").reverse().limit(days).toArray();
  }, [days]) ?? [];
}

export function useRecentJournals(days: number = 3): JournalEntry[] {
  return useLiveQuery(async () => {
    return db.journalEntries.orderBy("date").reverse().limit(days).toArray();
  }, [days]) ?? [];
}

/** Aggregate session minutes by category for a given day plan */
export function useSessionsByCategory(): Record<string, number> {
  const sessions = useTodaySessions();
  const categories = useCategories();

  const result: Record<string, number> = {};
  for (const cat of categories) {
    const mins = sessions
      .filter((s) => s.categoryId === cat.id)
      .reduce((sum, s) => sum + s.durationMinutes, 0);
    if (mins > 0) result[cat.name] = mins;
  }
  return result;
}

/** Habit completion rate over last N days */
export function useHabitTrends(days: number = 14): { date: string; rate: number }[] {
  return useLiveQuery(async () => {
    const habits = await db.habits.filter((h) => h.isActive).toArray();
    if (habits.length === 0) return [];

    const allLogs = await db.habitLogs.orderBy("date").reverse().limit(days * habits.length).toArray();
    const dateMap = new Map<string, { done: number; total: number }>();

    for (const log of allLogs) {
      const entry = dateMap.get(log.date) ?? { done: 0, total: 0 };
      entry.total++;
      if (log.status === "done" || log.status === "resisted" || log.status === "no-urge") {
        entry.done++;
      }
      dateMap.set(log.date, entry);
    }

    return Array.from(dateMap.entries())
      .map(([date, { done, total }]) => ({ date, rate: Math.round((done / total) * 100) }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [days]) ?? [];
}

/** Energy/focus averages by hour */
export function useEnergyPatterns(): { hour: number; energy: number; focus: number; count: number }[] {
  return useLiveQuery(async () => {
    const sessions = await db.timeSessions.toArray();
    const hourMap = new Map<number, { energySum: number; focusSum: number; count: number }>();

    for (const s of sessions) {
      if (!s.energyLevel && !s.focusLevel) continue;
      const hour = new Date(s.startedAt).getHours();
      const entry = hourMap.get(hour) ?? { energySum: 0, focusSum: 0, count: 0 };
      entry.energySum += s.energyLevel ?? 0;
      entry.focusSum += s.focusLevel ?? 0;
      entry.count++;
      hourMap.set(hour, entry);
    }

    return Array.from(hourMap.entries())
      .map(([hour, { energySum, focusSum, count }]) => ({
        hour,
        energy: Math.round((energySum / count) * 10) / 10,
        focus: Math.round((focusSum / count) * 10) / 10,
        count,
      }))
      .sort((a, b) => a.hour - b.hour);
  }) ?? [];
}

/** Sleep vs Score correlation data */
export function useSleepVsScore(): { date: string; sleep: number; score: number }[] {
  return useLiveQuery(async () => {
    const scores = await db.dailyScores.orderBy("date").reverse().limit(30).toArray();
    const results: { date: string; sleep: number; score: number }[] = [];

    for (const score of scores) {
      const plan = await db.dayPlans.where("date").equals(score.date).first();
      if (plan?.sleepHours) {
        results.push({ date: score.date, sleep: plan.sleepHours, score: score.computedScore });
      }
    }
    return results.reverse();
  }) ?? [];
}

/** Urge frequency by day of week for a specific habit */
export function useUrgeFrequency(habitId?: string): { day: string; count: number }[] {
  return useLiveQuery(async () => {
    const events = habitId
      ? await db.urgeEvents.where("habitId").equals(habitId).toArray()
      : await db.urgeEvents.toArray();

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const counts = new Array(7).fill(0);

    for (const e of events) {
      const d = new Date(e.occurredAt).getDay();
      counts[d]++;
    }

    return dayNames.map((day, i) => ({ day, count: counts[i] }));
  }, [habitId]) ?? [];
}
