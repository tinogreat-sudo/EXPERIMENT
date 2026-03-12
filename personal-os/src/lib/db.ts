import Dexie, { type Table } from "dexie";
import type {
  UserSettings,
  DayPlan,
  DayTemplate,
  TimeBlock,
  TimeSession,
  FocusSession,
  Category,
  Goal,
  GoalMilestone,
  Skill,
  Habit,
  HabitLog,
  UrgeEvent,
  JournalEntry,
  Note,
  DailyScore,
  AIChatSession,
  AIChatMessage,
} from "@/types";

export class PersonalOSDB extends Dexie {
  userSettings!: Table<UserSettings>;
  dayPlans!: Table<DayPlan>;
  dayTemplates!: Table<DayTemplate>;
  timeBlocks!: Table<TimeBlock>;
  timeSessions!: Table<TimeSession>;
  focusSessions!: Table<FocusSession>;
  categories!: Table<Category>;
  goals!: Table<Goal>;
  goalMilestones!: Table<GoalMilestone>;
  skills!: Table<Skill>;
  habits!: Table<Habit>;
  habitLogs!: Table<HabitLog>;
  urgeEvents!: Table<UrgeEvent>;
  journalEntries!: Table<JournalEntry>;
  notes!: Table<Note>;
  dailyScores!: Table<DailyScore>;
  aiChatSessions!: Table<AIChatSession>;
  aiChatMessages!: Table<AIChatMessage>;

  constructor() {
    super("PersonalOSDB");
    this.version(2).stores({
      userSettings: "id",
      dayPlans: "id, date, status, syncedAt",
      dayTemplates: "id, dayType, syncedAt",
      timeBlocks: "id, dayPlanId, startTime, syncedAt",
      timeSessions: "id, dayPlanId, categoryId, startedAt, syncedAt",
      focusSessions: "id, timeSessionId, syncedAt",
      categories: "id, name, isDefault, sortOrder, syncedAt",
      goals: "id, status, priority, syncedAt",
      goalMilestones: "id, goalId, syncedAt",
      skills: "id, syncedAt",
      habits: "id, type, isActive, syncedAt",
      habitLogs: "id, habitId, date, dayPlanId, syncedAt",
      urgeEvents: "id, habitId, dayPlanId, syncedAt",
      journalEntries: "id, dayPlanId, date, syncedAt",
      notes: "id, nextReviewDate, syncedAt",
      dailyScores: "id, date, dayPlanId, syncedAt",
      aiChatMessages: "id, createdAt, syncedAt",
    });
    this.version(3).stores({
      aiChatSessions: "id, updatedAt, syncedAt",
      aiChatMessages: "id, sessionId, createdAt, syncedAt",
    }).upgrade(async (tx) => {
      // Migrate existing messages into a "General" session
      const msgs = await tx.table("aiChatMessages").toArray();
      if (msgs.length > 0) {
        const sessionId = "migrated-session";
        await tx.table("aiChatSessions").add({
          id: sessionId,
          title: "General",
          mode: "general",
          createdAt: msgs[0].createdAt,
          updatedAt: msgs[msgs.length - 1].createdAt,
          syncedAt: null,
        });
        for (const msg of msgs) {
          await tx.table("aiChatMessages").update(msg.id, { sessionId });
        }
      }
    });
  }
}

export const db = new PersonalOSDB();
