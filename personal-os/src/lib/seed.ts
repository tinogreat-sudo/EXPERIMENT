import { v4 as uuid } from "uuid";
import { db } from "./db";
import { seedDefaultTemplates } from "./dayplan";
import type { Category } from "@/types";

const DEFAULT_CATEGORIES: Omit<Category, "id" | "createdAt" | "syncedAt">[] = [
  { name: "Deep Work", color: "#ec5b13", icon: "code", isDistraction: false, isDefault: true, sortOrder: 0 },
  { name: "Learning", color: "#f59e0b", icon: "school", isDistraction: false, isDefault: true, sortOrder: 1 },
  { name: "Exercise", color: "#10b981", icon: "fitness_center", isDistraction: false, isDefault: true, sortOrder: 2 },
  { name: "Admin", color: "#6366f1", icon: "mail", isDistraction: false, isDefault: true, sortOrder: 3 },
  { name: "Social", color: "#8b5cf6", icon: "group", isDistraction: false, isDefault: true, sortOrder: 4 },
  { name: "Leisure", color: "#06b6d4", icon: "sports_esports", isDistraction: false, isDefault: true, sortOrder: 5 },
  { name: "Distraction", color: "#ef4444", icon: "phone_android", isDistraction: true, isDefault: true, sortOrder: 6 },
  { name: "Commute", color: "#78716c", icon: "directions_car", isDistraction: false, isDefault: true, sortOrder: 7 },
  { name: "Meals", color: "#84cc16", icon: "restaurant", isDistraction: false, isDefault: true, sortOrder: 8 },
  { name: "Rest", color: "#818cf8", icon: "bedtime", isDistraction: false, isDefault: true, sortOrder: 9 },
];

export async function seedDefaultData() {
  const existingCategories = await db.categories.count();
  if (existingCategories > 0) {
    // Still seed templates if missing
    const cats = await db.categories.toArray();
    await seedDefaultTemplates(cats);
    return;
  }

  const now = new Date().toISOString();
  const categories: Category[] = DEFAULT_CATEGORIES.map((cat) => ({
    ...cat,
    id: uuid(),
    createdAt: now,
    syncedAt: null,
  }));

  await db.categories.bulkAdd(categories);
  await seedDefaultTemplates(categories);
}
