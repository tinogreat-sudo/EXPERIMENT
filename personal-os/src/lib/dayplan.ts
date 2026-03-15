import { v4 as uuid } from "uuid";
import { db } from "./db";
import type { DayPlan, DayTemplate, TimeBlock } from "@/types";
import { getTodayDateString } from "./utils";

/**
 * Ensures a DayPlan exists for the given date, creating one if needed.
 */
export async function ensureDayPlan(date?: string): Promise<DayPlan> {
  const target = date || getTodayDateString();
  const now = new Date().toISOString();

  let plan = await db.dayPlans.where("date").equals(target).first();
  if (plan) return plan;

  plan = {
    id: uuid(),
    date: target,
    dayType: "work",
    templateId: null,
    intention: null,
    sleepHours: null,
    sleepQuality: null,
    bedtime: null,
    wakeTime: null,
    morningEnergy: null,
    overallEnergy: null,
    overallFocus: null,
    startedAt: null,
    endedAt: null,
    status: "planning",
    createdAt: now,
    updatedAt: now,
    syncedAt: null,
  };
  await db.dayPlans.add(plan);
  return plan;
}

/**
 * Load a template's blocks into a specific day.
 * Replaces all existing non-started blocks for that day.
 */
export async function loadTemplateIntoPlan(
  templateId: string,
  date?: string
): Promise<void> {
  const target = date || getTodayDateString();
  const now = new Date().toISOString();
  const plan = await ensureDayPlan(target);

  const template = await db.dayTemplates.get(templateId);
  if (!template) throw new Error("Template not found");

  // Remove pending blocks (keep in-progress/completed)
  const existingBlocks = await db.timeBlocks
    .where("dayPlanId")
    .equals(plan.id)
    .toArray();

  const toDelete = existingBlocks
    .filter((b) => b.status === "pending")
    .map((b) => b.id);

  await db.timeBlocks.bulkDelete(toDelete);

  // Create new blocks from template
  const newBlocks: TimeBlock[] = template.blocks.map((tb, i) => ({
    id: uuid(),
    dayPlanId: plan.id,
    title: tb.title,
    categoryId: tb.categoryId,
    startTime: tb.startTime,
    endTime: tb.endTime,
    isNonNegotiable: tb.isNonNegotiable,
    recurrence: "none",
    recurrenceUntil: null,
    status: "pending",
    goalId: null,
    skillId: null,
    sortOrder: i,
    createdAt: now,
    updatedAt: now,
    syncedAt: null,
  }));

  await db.timeBlocks.bulkAdd(newBlocks);

  // Update plan with template reference
  await db.dayPlans.update(plan.id, {
    templateId,
    dayType: template.dayType,
    updatedAt: now,
  });
}

/**
 * Save current day's blocks as a new template.
 */
export async function saveCurrentDayAsTemplate(
  name: string,
  date?: string
): Promise<string> {
  const target = date || getTodayDateString();
  const now = new Date().toISOString();

  const plan = await db.dayPlans.where("date").equals(target).first();
  if (!plan) throw new Error("No plan found for this date");

  const blocks = await db.timeBlocks
    .where("dayPlanId")
    .equals(plan.id)
    .sortBy("startTime");

  const templateId = uuid();
  const template: DayTemplate = {
    id: templateId,
    name,
    dayType: plan.dayType,
    deepWorkTarget: 180,
    skillTarget: 60,
    goalTarget: 180,
    blocks: blocks.map((b) => ({
      title: b.title,
      categoryId: b.categoryId,
      startTime: b.startTime,
      endTime: b.endTime,
      isNonNegotiable: b.isNonNegotiable,
    })),
    isDefault: false,
    createdAt: now,
    updatedAt: now,
    syncedAt: null,
  };

  await db.dayTemplates.add(template);
  return templateId;
}

/**
 * Seed default day templates.
 */
export async function seedDefaultTemplates(categories: { id: string; name: string }[]) {
  const count = await db.dayTemplates.count();
  if (count > 0) return;

  const catMap = new Map(categories.map((c) => [c.name, c.id]));
  const now = new Date().toISOString();

  const templates: DayTemplate[] = [
    {
      id: uuid(),
      name: "Productive Work Day",
      dayType: "work",
      deepWorkTarget: 180,
      skillTarget: 60,
      goalTarget: 180,
      blocks: [
        { title: "Morning Routine", categoryId: catMap.get("Admin") ?? "", startTime: "07:00", endTime: "08:00", isNonNegotiable: true },
        { title: "Deep Work Block 1", categoryId: catMap.get("Deep Work") ?? "", startTime: "08:00", endTime: "10:00", isNonNegotiable: true },
        { title: "Break", categoryId: catMap.get("Rest") ?? "", startTime: "10:00", endTime: "10:15", isNonNegotiable: false },
        { title: "Deep Work Block 2", categoryId: catMap.get("Deep Work") ?? "", startTime: "10:15", endTime: "12:00", isNonNegotiable: true },
        { title: "Lunch", categoryId: catMap.get("Meals") ?? "", startTime: "12:00", endTime: "13:00", isNonNegotiable: false },
        { title: "Admin & Email", categoryId: catMap.get("Admin") ?? "", startTime: "13:00", endTime: "14:00", isNonNegotiable: false },
        { title: "Skill Building", categoryId: catMap.get("Learning") ?? "", startTime: "14:00", endTime: "15:30", isNonNegotiable: false },
        { title: "Exercise", categoryId: catMap.get("Exercise") ?? "", startTime: "16:00", endTime: "17:00", isNonNegotiable: true },
        { title: "Evening Wind Down", categoryId: catMap.get("Leisure") ?? "", startTime: "20:00", endTime: "21:00", isNonNegotiable: false },
      ],
      isDefault: true,
      createdAt: now,
      updatedAt: now,
      syncedAt: null,
    },
    {
      id: uuid(),
      name: "Study Day",
      dayType: "school",
      deepWorkTarget: 120,
      skillTarget: 120,
      goalTarget: 120,
      blocks: [
        { title: "Morning Routine", categoryId: catMap.get("Admin") ?? "", startTime: "07:00", endTime: "08:00", isNonNegotiable: true },
        { title: "Study Block 1", categoryId: catMap.get("Learning") ?? "", startTime: "08:00", endTime: "10:00", isNonNegotiable: true },
        { title: "Break", categoryId: catMap.get("Rest") ?? "", startTime: "10:00", endTime: "10:30", isNonNegotiable: false },
        { title: "Study Block 2", categoryId: catMap.get("Learning") ?? "", startTime: "10:30", endTime: "12:30", isNonNegotiable: true },
        { title: "Lunch", categoryId: catMap.get("Meals") ?? "", startTime: "12:30", endTime: "13:30", isNonNegotiable: false },
        { title: "Project Work", categoryId: catMap.get("Deep Work") ?? "", startTime: "14:00", endTime: "16:00", isNonNegotiable: false },
        { title: "Exercise", categoryId: catMap.get("Exercise") ?? "", startTime: "16:30", endTime: "17:30", isNonNegotiable: true },
        { title: "Review & Notes", categoryId: catMap.get("Learning") ?? "", startTime: "19:00", endTime: "20:00", isNonNegotiable: false },
      ],
      isDefault: true,
      createdAt: now,
      updatedAt: now,
      syncedAt: null,
    },
    {
      id: uuid(),
      name: "Recovery Day",
      dayType: "recovery",
      deepWorkTarget: 0,
      skillTarget: 30,
      goalTarget: 60,
      blocks: [
        { title: "Sleep In", categoryId: catMap.get("Rest") ?? "", startTime: "08:00", endTime: "09:00", isNonNegotiable: false },
        { title: "Light Walk", categoryId: catMap.get("Exercise") ?? "", startTime: "10:00", endTime: "11:00", isNonNegotiable: false },
        { title: "Leisure Reading", categoryId: catMap.get("Leisure") ?? "", startTime: "11:00", endTime: "12:00", isNonNegotiable: false },
        { title: "Lunch", categoryId: catMap.get("Meals") ?? "", startTime: "12:00", endTime: "13:00", isNonNegotiable: false },
        { title: "Social Time", categoryId: catMap.get("Social") ?? "", startTime: "14:00", endTime: "16:00", isNonNegotiable: false },
        { title: "Light Skill Building", categoryId: catMap.get("Learning") ?? "", startTime: "17:00", endTime: "18:00", isNonNegotiable: false },
      ],
      isDefault: true,
      createdAt: now,
      updatedAt: now,
      syncedAt: null,
    },
  ];

  await db.dayTemplates.bulkAdd(templates);
}
