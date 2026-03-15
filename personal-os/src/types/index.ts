// ===== Personal OS Entity Types =====
// Mirrors TECH-STACK.md Section 3 database schema

export interface UserSettings {
  id: string;
  displayName: string;
  deepWorkTarget: number; // minutes, default 180
  skillBuildingTarget: number; // minutes, default 60
  goalWorkTarget: number; // minutes, default 180
  scoreThreshold: number; // default 70
  defaultDayType: DayType;
  pomodoroWorkMinutes: number; // default 25
  pomodoroBreakMinutes: number; // default 5
  pomodoroLongBreak: number; // default 15
  pomodoroSessionsBeforeLong: number; // default 4
  theme: "dark" | "light" | "system";
  calendarDensity?: "compact" | "comfortable" | "spacious";
  calendarColorSet?: "category" | "status" | "high-contrast";
  calibrationComplete: boolean;
  calibrationStartDate: string | null;
  createdAt: string;
  updatedAt: string;
  syncedAt: string | null;
}

export type DayType = "work" | "school" | "weekend" | "recovery" | "travel" | "custom";
export type DayStatus = "planning" | "active" | "reviewing" | "closed";

export interface DayPlan {
  id: string;
  date: string; // YYYY-MM-DD
  dayType: DayType;
  templateId: string | null;
  intention: string | null;
  sleepHours: number | null;
  sleepQuality: number | null; // 1-5
  bedtime: string | null;
  wakeTime: string | null;
  morningEnergy: number | null; // 1-5
  overallEnergy: number | null; // 1-5
  overallFocus: number | null; // 1-5
  startedAt: string | null;
  endedAt: string | null;
  status: DayStatus;
  createdAt: string;
  updatedAt: string;
  syncedAt: string | null;
}

export interface DayTemplate {
  id: string;
  name: string;
  dayType: DayType;
  deepWorkTarget: number;
  skillTarget: number;
  goalTarget: number;
  blocks: TemplateBlock[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  syncedAt: string | null;
}

export interface TemplateBlock {
  title: string;
  categoryId: string;
  startTime: string; // HH:MM
  endTime: string;
  isNonNegotiable: boolean;
}

export type BlockStatus = "pending" | "in-progress" | "completed" | "skipped" | "moved";
export type BlockRecurrence = "none" | "daily" | "weekdays" | "weekly";

export interface TimeBlock {
  id: string;
  dayPlanId: string;
  title: string;
  categoryId: string;
  startTime: string; // HH:MM
  endTime: string;
  isNonNegotiable: boolean;
  recurrence?: BlockRecurrence;
  recurrenceUntil?: string | null; // YYYY-MM-DD
  status: BlockStatus;
  goalId: string | null;
  skillId: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  syncedAt: string | null;
}

export interface TimeSession {
  id: string;
  dayPlanId: string;
  timeBlockId: string | null;
  title: string;
  categoryId: string;
  startedAt: string;
  endedAt: string | null;
  durationMinutes: number;
  isManualEntry: boolean;
  energyLevel: number | null; // 1-5
  focusLevel: number | null; // 1-5
  notes: string | null;
  goalId: string | null;
  skillId: string | null;
  isDistraction: boolean;
  distractionCategory: string | null;
  createdAt: string;
  updatedAt: string;
  syncedAt: string | null;
}

export interface FocusSession {
  id: string;
  timeSessionId: string;
  intervalType: "work" | "short-break" | "long-break";
  durationMinutes: number;
  completedAt: string | null;
  wasCompleted: boolean;
  createdAt: string;
  syncedAt: string | null;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  isDistraction: boolean;
  isDefault: boolean;
  sortOrder: number;
  createdAt: string;
  syncedAt: string | null;
}

export interface Goal {
  id: string;
  title: string;
  description: string | null;
  type: "short-term" | "long-term";
  status: "active" | "paused" | "completed" | "abandoned";
  targetDate: string | null;
  priority: "high" | "medium" | "low";
  isWeeklyFocus: boolean;
  progressPercent: number; // 0-100
  createdAt: string;
  updatedAt: string;
  syncedAt: string | null;
}

export interface GoalMilestone {
  id: string;
  goalId: string;
  title: string;
  isCompleted: boolean;
  completedAt: string | null;
  sortOrder: number;
  createdAt: string;
  syncedAt: string | null;
}

export interface Skill {
  id: string;
  name: string;
  description: string | null;
  targetHours: number | null;
  loggedHours: number;
  level: "beginner" | "intermediate" | "advanced" | "expert";
  nextMilestone: string | null;
  createdAt: string;
  updatedAt: string;
  syncedAt: string | null;
}

export type HabitType = "positive" | "negative";
export type HabitFrequency = "daily" | "weekly" | "custom";

export interface Habit {
  id: string;
  name: string;
  description: string | null;
  type: HabitType;
  frequency: HabitFrequency;
  frequencyDays: string[] | null; // e.g. ["mon","tue","wed"]
  weight: number; // default 1.0
  isActive: boolean;
  currentStreak: number;
  longestStreak: number;
  goalId: string | null;
  createdAt: string;
  updatedAt: string;
  syncedAt: string | null;
}

export type PositiveHabitStatus = "done" | "missed" | "skipped";
export type NegativeHabitStatus = "relapsed" | "resisted" | "no-urge";

export interface HabitLog {
  id: string;
  habitId: string;
  dayPlanId: string;
  date: string;
  status: PositiveHabitStatus | NegativeHabitStatus;
  createdAt: string;
  updatedAt: string;
  syncedAt: string | null;
}

export type UrgeTrigger =
  | "boredom"
  | "stress"
  | "tiredness"
  | "avoidance"
  | "social-pressure"
  | "notification"
  | "no-clear-next-step"
  | "other";

export interface UrgeEvent {
  id: string;
  habitId: string;
  dayPlanId: string;
  occurredAt: string;
  intensity: number; // 1-5
  trigger: UrgeTrigger;
  wasResisted: boolean;
  alternativeAction: string | null;
  notes: string | null;
  createdAt: string;
  syncedAt: string | null;
}

export interface JournalEntry {
  id: string;
  dayPlanId: string;
  date: string;
  content: string;
  wentWell: string | null;
  wentWrong: string | null;
  improveTomorrow: string | null;
  mood: number | null; // 1-5
  createdAt: string;
  updatedAt: string;
  syncedAt: string | null;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  goalId: string | null;
  skillId: string | null;
  journalEntryId: string | null;
  reviewStatus: "new" | "learning" | "known";
  nextReviewDate: string | null;
  reviewCount: number;
  lastReviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
  syncedAt: string | null;
}

export type ScoreBand = "strong" | "solid" | "mixed" | "weak" | "off-track";

export interface DailyScore {
  id: string;
  dayPlanId: string;
  date: string;
  computedScore: number; // 0-100
  aiScore: number | null;
  aiScoreConfidence: number | null;
  aiVerdict: string | null;
  aiPositives: string[] | null;
  aiNegatives: string[] | null;
  aiTomorrowActions: string[] | null;
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
  consistencyStreak: number;
  consistencyMultiplier: number;
  scoreBand: ScoreBand;
  createdAt: string;
  updatedAt: string;
  syncedAt: string | null;
}

export type AIChatMode = "planning" | "accountability" | "review" | "coaching" | "general";

export interface AIChatSession {
  id: string;
  title: string;
  mode: AIChatMode;
  createdAt: string;
  updatedAt: string;
  syncedAt: string | null;
}

export interface AIChatMessage {
  id: string;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  mode: AIChatMode;
  actionsTaken: Record<string, unknown>[] | null;
  contextSnapshot: Record<string, unknown> | null;
  createdAt: string;
  syncedAt: string | null;
}
