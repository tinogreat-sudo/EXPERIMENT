import { v4 as uuid } from "uuid";
import { db } from "./db";
import { seedDefaultTemplates } from "./dayplan";
import type { Category } from "@/types";

let seedPromise: Promise<void> | null = null;

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

function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

function pickPrimaryCategory(group: Category[]): Category {
  return [...group].sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    return a.createdAt.localeCompare(b.createdAt);
  })[0];
}

async function remapCategoryReferences(oldId: string, newId: string) {
  if (oldId === newId) return;

  const blocks = await db.timeBlocks.where("categoryId").equals(oldId).toArray();
  for (const block of blocks) {
    await db.timeBlocks.update(block.id, {
      categoryId: newId,
      updatedAt: new Date().toISOString(),
    });
  }

  const sessions = await db.timeSessions.where("categoryId").equals(oldId).toArray();
  for (const session of sessions) {
    await db.timeSessions.update(session.id, {
      categoryId: newId,
      updatedAt: new Date().toISOString(),
    });
  }

  const templates = await db.dayTemplates.toArray();
  for (const template of templates) {
    let changed = false;
    const nextBlocks = template.blocks.map((block) => {
      if (block.categoryId !== oldId) return block;
      changed = true;
      return { ...block, categoryId: newId };
    });

    if (changed) {
      await db.dayTemplates.update(template.id, {
        blocks: nextBlocks,
        updatedAt: new Date().toISOString(),
      });
    }
  }
}

async function reconcileCategories() {
  const now = new Date().toISOString();
  const defaultByName = new Map(DEFAULT_CATEGORIES.map((c) => [normalizeName(c.name), c]));

  const current = await db.categories.orderBy("sortOrder").toArray();
  const byName = new Map<string, Category[]>();

  for (const category of current) {
    const key = normalizeName(category.name);
    const list = byName.get(key) ?? [];
    list.push(category);
    byName.set(key, list);
  }

  for (const [key, group] of byName.entries()) {
    if (group.length <= 1) continue;

    const primary = pickPrimaryCategory(group);
    const duplicates = group.filter((c) => c.id !== primary.id);

    for (const dup of duplicates) {
      await remapCategoryReferences(dup.id, primary.id);
      await db.categories.delete(dup.id);
    }

    const defaultSpec = defaultByName.get(key);
    if (defaultSpec) {
      await db.categories.update(primary.id, {
        ...defaultSpec,
        syncedAt: primary.syncedAt,
      });
    }
  }

  const afterMerge = await db.categories.toArray();
  const existingKeys = new Set(afterMerge.map((c) => normalizeName(c.name)));

  const missingDefaults = DEFAULT_CATEGORIES.filter((cat) => !existingKeys.has(normalizeName(cat.name)));
  if (missingDefaults.length > 0) {
    await db.categories.bulkAdd(
      missingDefaults.map((cat) => ({
        ...cat,
        id: uuid(),
        createdAt: now,
        syncedAt: null,
      }))
    );
  }
}

async function seedDefaultDataInternal() {
  await db.transaction("rw", db.categories, db.timeBlocks, db.timeSessions, db.dayTemplates, async () => {
    await reconcileCategories();
  });

  const categories = await db.categories.orderBy("sortOrder").toArray();
  await seedDefaultTemplates(categories);
}

export async function seedDefaultData() {
  if (!seedPromise) {
    seedPromise = seedDefaultDataInternal().finally(() => {
      seedPromise = null;
    });
  }
  await seedPromise;
}
