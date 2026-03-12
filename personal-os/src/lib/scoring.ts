import { db } from "./db";
import { getTodayDateString } from "./utils";
import type {
  DayPlan,
  TimeBlock,
  TimeSession,
  HabitLog,
  Habit,
  JournalEntry,
  DailyScore,
  ScoreBand,
  UserSettings,
} from "@/types";

// ===== Score Component Weights =====
const MAX_SCHEDULE = 25;
const MAX_FOCUS = 20;
const MAX_GOALS = 20;
const MAX_HABITS = 15;
const MAX_SKILLS = 10;
const MAX_REFLECTION = 10;
const MAX_DISTRACTION_PENALTY = 20;

// ===== Helpers =====

function getBlockDurationMinutes(block: TimeBlock): number {
  const [sh, sm] = block.startTime.split(":").map(Number);
  const [eh, em] = block.endTime.split(":").map(Number);
  return (eh * 60 + em) - (sh * 60 + sm);
}

function escalatingPenalty(minutes: number, cap: number): number {
  const blocks = Math.floor(minutes / 15);
  let penalty = 0;
  for (let i = 0; i < blocks; i++) {
    if (i < 2) penalty += 2;
    else if (i < 4) penalty += 3;
    else penalty += 4;
  }
  return Math.min(penalty, cap);
}

function getScoreBand(score: number): ScoreBand {
  if (score >= 85) return "strong";
  if (score >= 70) return "solid";
  if (score >= 50) return "mixed";
  if (score >= 30) return "weak";
  return "off-track";
}

// ===== Main Scoring Function =====

export interface ScoreInput {
  dayPlan: DayPlan;
  blocks: TimeBlock[];
  sessions: TimeSession[];
  habits: Habit[];
  habitLogs: HabitLog[];
  journalEntry: JournalEntry | null;
  settings: UserSettings;
}

export interface ScoreBreakdown {
  scheduleAdherence: number;
  focusScore: number;
  goalAlignmentScore: number;
  habitScore: number;
  skillScore: number;
  reflectionScore: number;
  distractionPenalty: number;
  untrackedPenalty: number;
  plannedMinutes: number;
  completedPlannedMin: number;
  deepWorkMinutes: number;
  goalLinkedMinutes: number;
  skillBuildingMinutes: number;
  distractionMinutes: number;
  untrackedMinutes: number;
  rawScore: number;
  scoreBand: ScoreBand;
  isCalibration: boolean;
}

/** Check if user is still in the 7-day calibration period */
function isInCalibration(settings: UserSettings): boolean {
  if (settings.calibrationComplete) return false;
  if (!settings.calibrationStartDate) return true; // hasn't started, treat first run as calibration
  const start = new Date(settings.calibrationStartDate);
  const now = new Date();
  const daysSinceStart = Math.floor((now.getTime() - start.getTime()) / 86400000);
  return daysSinceStart < 7;
}

export function computeScore(input: ScoreInput): ScoreBreakdown {
  const { blocks, sessions, habits, habitLogs, journalEntry, settings } = input;
  const calibrating = isInCalibration(settings);

  // --- Schedule Adherence (25pts) ---
  let plannedWeighted = 0;
  let completedPlannedWeighted = 0;
  for (const block of blocks) {
    const dur = getBlockDurationMinutes(block);
    const weight = block.isNonNegotiable ? 2 : 1;
    plannedWeighted += dur * weight;
    if (block.status === "completed") {
      completedPlannedWeighted += dur * weight;
    }
  }
  const plannedMinutes = blocks.reduce((s, b) => s + getBlockDurationMinutes(b), 0);
  const completedPlannedMin = blocks
    .filter((b) => b.status === "completed")
    .reduce((s, b) => s + getBlockDurationMinutes(b), 0);
  const scheduleAdherence = plannedWeighted > 0
    ? Math.round(MAX_SCHEDULE * Math.min(1, completedPlannedWeighted / plannedWeighted) * 10) / 10
    : 0;

  // --- Focus & Deep Work (20pts) ---
  // Deep work = sessions whose category is "Deep Work" (isDistraction=false, first category by sortOrder which is typically Deep Work)
  // We identify deep work by checking category names or by non-distraction sessions
  const deepWorkMinutes = sessions
    .filter((s) => !s.isDistraction)
    .reduce((sum, s) => sum + s.durationMinutes, 0);
  const focusScore = Math.round(MAX_FOCUS * Math.min(1, deepWorkMinutes / Math.max(1, settings.deepWorkTarget)) * 10) / 10;

  // --- Goal Alignment (20pts) ---
  const goalLinkedMinutes = sessions
    .filter((s) => s.goalId)
    .reduce((sum, s) => sum + s.durationMinutes, 0);
  const goalAlignmentScore = Math.round(MAX_GOALS * Math.min(1, goalLinkedMinutes / Math.max(1, settings.goalWorkTarget)) * 10) / 10;

  // --- Habit Completion (15pts) ---
  const activeHabits = habits.filter((h) => h.isActive);
  let habitWeightedDone = 0;
  let habitWeightedTotal = 0;
  for (const habit of activeHabits) {
    habitWeightedTotal += habit.weight;
    const log = habitLogs.find((l) => l.habitId === habit.id);
    if (log) {
      if (habit.type === "positive" && log.status === "done") {
        habitWeightedDone += habit.weight;
      } else if (habit.type === "negative" && (log.status === "resisted" || log.status === "no-urge")) {
        habitWeightedDone += habit.weight;
      }
    }
  }
  const habitScore = habitWeightedTotal > 0
    ? Math.round(MAX_HABITS * (habitWeightedDone / habitWeightedTotal) * 10) / 10
    : 0;

  // --- Skill Building (10pts) ---
  const skillBuildingMinutes = sessions
    .filter((s) => s.skillId)
    .reduce((sum, s) => sum + s.durationMinutes, 0);
  const skillScore = Math.round(MAX_SKILLS * Math.min(1, skillBuildingMinutes / Math.max(1, settings.skillBuildingTarget)) * 10) / 10;

  // --- Reflection (10pts) ---
  let reflectionScore = 0;
  if (journalEntry) {
    reflectionScore += 4; // wrote a journal entry
    if (journalEntry.wentWell || journalEntry.wentWrong) reflectionScore += 3; // planned vs actual review
  }
  if (input.dayPlan.endedAt) reflectionScore += 3; // completed end-of-day review

  // --- Distraction Penalty ---
  const distractionMinutes = sessions
    .filter((s) => s.isDistraction)
    .reduce((sum, s) => sum + s.durationMinutes, 0);
  const distractionPenalty = escalatingPenalty(distractionMinutes, MAX_DISTRACTION_PENALTY) * (calibrating ? 0.5 : 1);

  // --- Untracked Penalty ---
  const totalTrackedMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
  const wakingMinutes = 16 * 60; // 960 minutes
  const untrackedMinutes = Math.max(0, wakingMinutes - totalTrackedMinutes);
  const untrackedPenalty = escalatingPenalty(untrackedMinutes, MAX_DISTRACTION_PENALTY) * (calibrating ? 0.5 : 1);

  // --- Final Score ---
  const rawScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        scheduleAdherence + focusScore + goalAlignmentScore + habitScore + skillScore + reflectionScore - distractionPenalty - untrackedPenalty
      )
    )
  );

  return {
    scheduleAdherence,
    focusScore,
    goalAlignmentScore,
    habitScore,
    skillScore,
    reflectionScore,
    distractionPenalty,
    untrackedPenalty,
    plannedMinutes,
    completedPlannedMin,
    deepWorkMinutes,
    goalLinkedMinutes,
    skillBuildingMinutes,
    distractionMinutes,
    untrackedMinutes,
    rawScore,
    scoreBand: getScoreBand(rawScore),
    isCalibration: calibrating,
  };
}

// ===== Consistency Multiplier =====

export async function computeConsistencyStreak(
  threshold: number = 70
): Promise<{ streak: number; multiplier: number }> {
  const scores = await db.dailyScores.orderBy("date").reverse().limit(30).toArray();
  let streak = 0;
  for (const score of scores) {
    if (score.computedScore >= threshold) {
      streak++;
    } else {
      break;
    }
  }
  let multiplier = 1.0;
  if (streak >= 30) multiplier = 1.2;
  else if (streak >= 14) multiplier = 1.15;
  else if (streak >= 7) multiplier = 1.1;
  else if (streak >= 3) multiplier = 1.05;

  return { streak, multiplier };
}

// ===== Full Score Computation & Save =====

export async function computeAndSaveDailyScore(date?: string): Promise<DailyScore> {
  const targetDate = date || getTodayDateString();
  const now = new Date().toISOString();

  // Gather data
  const dayPlan = await db.dayPlans.where("date").equals(targetDate).first();
  if (!dayPlan) throw new Error("No day plan found for " + targetDate);

  const blocks = await db.timeBlocks.where("dayPlanId").equals(dayPlan.id).toArray();
  const sessions = await db.timeSessions.where("dayPlanId").equals(dayPlan.id).toArray();
  const habits = await db.habits.filter((h) => h.isActive).toArray();
  const habitLogs = await db.habitLogs.where("date").equals(targetDate).toArray();
  const journalEntry = await db.journalEntries.where("date").equals(targetDate).first() ?? null;
  const settingsArr = await db.userSettings.toArray();
  const settings: UserSettings = settingsArr[0] ?? {
    id: "default", displayName: "User", deepWorkTarget: 180, skillBuildingTarget: 60,
    goalWorkTarget: 180, scoreThreshold: 70, defaultDayType: "work" as const, pomodoroWorkMinutes: 25,
    pomodoroBreakMinutes: 5, pomodoroLongBreak: 15, pomodoroSessionsBeforeLong: 4,
    theme: "dark" as const, calibrationComplete: false, calibrationStartDate: null,
    createdAt: now, updatedAt: now, syncedAt: null,
  };

  const breakdown = computeScore({ dayPlan, blocks, sessions, habits, habitLogs, journalEntry, settings });
  const { streak, multiplier } = await computeConsistencyStreak(settings.scoreThreshold);

  // Handle calibration lifecycle
  if (!settings.calibrationComplete) {
    if (!settings.calibrationStartDate) {
      // First score ever — start calibration
      await db.userSettings.update(settings.id, {
        calibrationStartDate: targetDate,
        updatedAt: now,
      });
    } else {
      // Check if 7 days have passed
      const start = new Date(settings.calibrationStartDate);
      const today = new Date(targetDate);
      if (Math.floor((today.getTime() - start.getTime()) / 86400000) >= 7) {
        await db.userSettings.update(settings.id, {
          calibrationComplete: true,
          updatedAt: now,
        });
      }
    }
  }

  // Check if score already exists for this date
  const existing = await db.dailyScores.where("date").equals(targetDate).first();

  const scoreRecord: DailyScore = {
    id: existing?.id ?? crypto.randomUUID(),
    dayPlanId: dayPlan.id,
    date: targetDate,
    computedScore: breakdown.rawScore,
    aiScore: existing?.aiScore ?? null,
    aiScoreConfidence: existing?.aiScoreConfidence ?? null,
    aiVerdict: existing?.aiVerdict ?? null,
    aiPositives: existing?.aiPositives ?? null,
    aiNegatives: existing?.aiNegatives ?? null,
    aiTomorrowActions: existing?.aiTomorrowActions ?? null,
    scheduleAdherence: breakdown.scheduleAdherence,
    focusScore: breakdown.focusScore,
    goalAlignmentScore: breakdown.goalAlignmentScore,
    habitScore: breakdown.habitScore,
    skillScore: breakdown.skillScore,
    reflectionScore: breakdown.reflectionScore,
    distractionPenalty: breakdown.distractionPenalty,
    untrackedPenalty: breakdown.untrackedPenalty,
    plannedMinutes: breakdown.plannedMinutes,
    completedPlannedMin: breakdown.completedPlannedMin,
    deepWorkMinutes: breakdown.deepWorkMinutes,
    goalLinkedMinutes: breakdown.goalLinkedMinutes,
    skillBuildingMinutes: breakdown.skillBuildingMinutes,
    distractionMinutes: breakdown.distractionMinutes,
    untrackedMinutes: breakdown.untrackedMinutes,
    consistencyStreak: streak,
    consistencyMultiplier: multiplier,
    scoreBand: breakdown.scoreBand,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    syncedAt: null,
  };

  await db.dailyScores.put(scoreRecord);
  return scoreRecord;
}
