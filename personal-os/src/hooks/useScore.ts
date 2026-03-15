"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { getTodayDateString } from "@/lib/utils";
import { computeScore, type ScoreBreakdown, type ScoreInput } from "@/lib/scoring";
import type { DailyScore, UserSettings } from "@/types";

const DEFAULT_SETTINGS: UserSettings = {
  id: "default",
  displayName: "User",
  deepWorkTarget: 180,
  skillBuildingTarget: 60,
  goalWorkTarget: 180,
  scoreThreshold: 70,
  defaultDayType: "work",
  pomodoroWorkMinutes: 25,
  pomodoroBreakMinutes: 5,
  pomodoroLongBreak: 15,
  pomodoroSessionsBeforeLong: 4,
  theme: "dark",
  calendarDensity: "comfortable",
  calendarColorSet: "category",
  calibrationComplete: false,
  calibrationStartDate: null,
  createdAt: "",
  updatedAt: "",
  syncedAt: null,
};

/** Live-compute today's score from Dexie data (recalculates on any data change) */
export function useTodayScore(): ScoreBreakdown | null {
  const today = getTodayDateString();

  return useLiveQuery(async () => {
    const dayPlan = await db.dayPlans.where("date").equals(today).first();
    if (!dayPlan) return null;

    const blocks = await db.timeBlocks.where("dayPlanId").equals(dayPlan.id).toArray();
    const sessions = await db.timeSessions.where("dayPlanId").equals(dayPlan.id).toArray();
    const habits = await db.habits.filter((h) => h.isActive).toArray();
    const habitLogs = await db.habitLogs.where("date").equals(today).toArray();
    const journalEntries = await db.journalEntries.where("date").equals(today).sortBy("updatedAt");
    const journalEntry = journalEntries[journalEntries.length - 1] ?? null;
    const settingsArr = await db.userSettings.toArray();
    const settings = settingsArr[0] ?? DEFAULT_SETTINGS;

    return computeScore({ dayPlan, blocks, sessions, habits, habitLogs, journalEntry, settings });
  }) ?? null;
}

/** Get persisted DailyScore for today */
export function useTodayDailyScore(): DailyScore | undefined {
  const today = getTodayDateString();
  return useLiveQuery(() => db.dailyScores.where("date").equals(today).first());
}

/** Get score trend (last N days) */
export function useScoreTrend(days: number = 30): DailyScore[] {
  return useLiveQuery(async () => {
    const all = await db.dailyScores.orderBy("date").reverse().limit(days).toArray();
    return all.reverse(); // oldest first for chart
  }, [days]) ?? [];
}
