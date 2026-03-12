import { db } from "./db";
import { getTodayDateString } from "./utils";
import { computeScore, type ScoreBreakdown } from "./scoring";
import type {
  DayPlan,
  TimeBlock,
  TimeSession,
  HabitLog,
  Habit,
  UrgeEvent,
  Goal,
  Skill,
  JournalEntry,
  DailyScore,
  UserSettings,
} from "@/types";

// ===== Context Packet for AI =====

export interface AIContextPacket {
  currentTime: string;
  userTimezone: string;
  todayDate: string;
  todayPlan: DayPlan | null;
  todayBlocks: TimeBlock[];
  todaySessions: TimeSession[];
  todayHabitLogs: HabitLog[];
  todayUrgeEvents: UrgeEvent[];
  activeHabits: Habit[];
  activeGoals: Goal[];
  weeklyFocusGoals: Goal[];
  skills: Skill[];
  recentScores: DailyScore[];
  recentJournalEntries: JournalEntry[];
  currentStreak: number;
  scoringTargets: {
    deepWorkTarget: number;
    skillTarget: number;
    goalTarget: number;
    scoreThreshold: number;
  };
  lastNightSleep: { hours: number; quality: number } | null;
  currentEnergy: number | null;
}

export interface AIScoringPacket extends AIContextPacket {
  computedScore: number;
  computedBreakdown: ScoreBreakdown;
  journalEntry: JournalEntry | null;
}

/** Build a full context packet from Dexie data passed from the client */
export function buildContextPacketFromData(data: {
  todayPlan: DayPlan | null;
  blocks: TimeBlock[];
  sessions: TimeSession[];
  habitLogs: HabitLog[];
  urgeEvents: UrgeEvent[];
  habits: Habit[];
  goals: Goal[];
  skills: Skill[];
  recentScores: DailyScore[];
  recentJournals: JournalEntry[];
  settings: UserSettings | null;
  userTimezone?: string;
  userLocalTime?: string;
}): AIContextPacket {
  const settings = data.settings;
  const tz = data.userTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  return {
    currentTime: data.userLocalTime || new Date().toISOString(),
    userTimezone: tz,
    todayDate: getTodayDateString(),
    todayPlan: data.todayPlan,
    todayBlocks: data.blocks,
    todaySessions: data.sessions,
    todayHabitLogs: data.habitLogs,
    todayUrgeEvents: data.urgeEvents,
    activeHabits: data.habits,
    activeGoals: data.goals.filter((g) => g.status === "active"),
    weeklyFocusGoals: data.goals.filter((g) => g.isWeeklyFocus),
    skills: data.skills,
    recentScores: data.recentScores,
    recentJournalEntries: data.recentJournals,
    currentStreak: data.recentScores.length > 0 ? data.recentScores[0].consistencyStreak : 0,
    scoringTargets: {
      deepWorkTarget: settings?.deepWorkTarget ?? 180,
      skillTarget: settings?.skillBuildingTarget ?? 60,
      goalTarget: settings?.goalWorkTarget ?? 180,
      scoreThreshold: settings?.scoreThreshold ?? 70,
    },
    lastNightSleep: data.todayPlan?.sleepHours
      ? { hours: data.todayPlan.sleepHours, quality: data.todayPlan.sleepQuality ?? 3 }
      : null,
    currentEnergy: data.todayPlan?.morningEnergy ?? null,
  };
}

/** Build the scoring packet by adding score breakdown to context */
export function buildScoringPacket(
  context: AIContextPacket,
  breakdown: ScoreBreakdown,
  journalEntry: JournalEntry | null
): AIScoringPacket {
  return {
    ...context,
    computedScore: breakdown.rawScore,
    computedBreakdown: breakdown,
    journalEntry,
  };
}

// ===== System Prompts =====

export function getSystemPrompt(mode: string, context: AIContextPacket): string {
  const base = `You are the AI Coach for "Personal OS" — a personal productivity and life management app.
You have access to the user's full day context. Be direct, warm, actionable, and concise.
Today's date: ${context.todayDate}
User's local time: ${context.currentTime}
User's timezone: ${context.userTimezone}

USER CONTEXT:
${JSON.stringify(context, null, 2)}
`;

  const modeInstructions: Record<string, string> = {
    planning: `MODE: PLANNING
Help the user plan their day or upcoming schedule. Suggest time blocks, priorities, and identify gaps.
Focus on what matters most based on their goals and weekly focus areas.
If they have a template loaded, work with it. If not, suggest a structure.`,

    accountability: `MODE: ACCOUNTABILITY
Hold the user accountable. Compare planned vs actual. Call out gaps between intention and execution.
Be honest but encouraging. Point out patterns of avoidance or distraction.
Reference their habit streaks, completion rates, and score trends.`,

    review: `MODE: REVIEW
Help the user review their day or week. Summarize what went well, what didn't, and suggest improvements.
Use their score breakdown, habit data, and journal entries to give specific feedback.
Highlight patterns across recent days.`,

    coaching: `MODE: COACHING
Act as a thoughtful productivity coach. Help the user think through challenges, build better systems,
and overcome mental blocks. Ask probing questions. Suggest experiments and mindset shifts.`,

    general: `MODE: GENERAL
Respond naturally to whatever the user asks. You have full context about their day, habits, goals, and patterns.
Be helpful, concise, and reference their data when relevant.`,

    rescue: `MODE: RESCUE MY DAY
The user's day has gone off-track. Analyze what's been completed vs planned, what time remains,
and suggest a restructured plan for the rest of the day.
Be pragmatic — prioritize non-negotiable blocks and high-impact activities.
Output a clear, time-blocked plan for the remaining hours.`,

    stuck: `MODE: WHY AM I STUCK
The user feels stuck or unmotivated. Analyze their current state:
- Is their timer idle? How long since last session?
- Are habits unchecked?
- Are they off-schedule?
- What's their energy level?
Give ONE specific, actionable next step. Keep it short and motivating.`,
  };

  return base + "\n\n" + (modeInstructions[mode] || modeInstructions.general);
}

export function getScoringSystemPrompt(): string {
  return `You are the scoring validator for "Personal OS". You will receive a computed daily score and full day context.

Your job:
1. Review the computed score and breakdown
2. Provide an AI-adjusted score (0-100) if you think the computed score doesn't reflect the full picture
3. Rate your confidence in this adjustment (0.0-1.0)
4. Write a brief verdict (1-2 sentences)
5. List 2-3 positives from the day
6. List 1-2 negatives or areas for improvement
7. Suggest 2-3 specific actions for tomorrow

Respond in JSON format:
{
  "aiScore": number,
  "confidence": number,
  "verdict": "string",
  "positives": ["string"],
  "negatives": ["string"],
  "tomorrowActions": ["string"]
}`;
}
