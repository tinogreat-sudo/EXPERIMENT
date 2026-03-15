"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { v4 as uuid } from "uuid";
import { db } from "@/lib/db";
import { useCategories, useDayTemplates, useHabits, useUserSettings } from "@/hooks/useLiveData";
import { getTodayDateString } from "@/lib/utils";
import { loadTemplateIntoPlan, saveCurrentDayAsTemplate } from "@/lib/dayplan";
import { Button, Card, Badge } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { BlockRecurrence, BlockStatus, DayPlan, TimeBlock } from "@/types";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const TIMER_STORAGE_KEY = "personal-os-timer";

type ViewMode = "day" | "week" | "month";
type LayerKey = "planned" | "tracked" | "habits" | "goals";
type CalendarDensity = "compact" | "comfortable" | "spacious";
type CalendarColorSet = "category" | "status" | "high-contrast";

type EventKind = "planned" | "tracked" | "live" | "habit" | "goal";
type EventLayer = "planned" | "tracked" | "habits" | "goals";

interface ScheduleEvent {
  id: string;
  kind: EventKind;
  layer: EventLayer;
  dayKey: string;
  title: string;
  categoryId: string;
  startMin: number;
  endMin: number;
  status?: BlockStatus;
  sourceBlockId?: string;
  editable?: boolean;
  isNonNegotiable?: boolean;
}

interface EventPlacement {
  column: number;
  columnCount: number;
}

const DENSITY_HOUR_HEIGHT: Record<CalendarDensity, number> = {
  compact: 56,
  comfortable: 72,
  spacious: 88,
};

const STATUS_COLORS: Record<BlockStatus, string> = {
  pending: "#64748b",
  "in-progress": "#f59e0b",
  completed: "#10b981",
  skipped: "#ef4444",
  moved: "#6366f1",
};

const HIGH_CONTRAST_KIND_COLORS: Record<EventKind, string> = {
  planned: "#0f766e",
  tracked: "#0ea5e9",
  live: "#e11d48",
  habit: "#7c3aed",
  goal: "#f59e0b",
};

type SessionLite = {
  id: string;
  dayPlanId: string;
  title: string;
  categoryId: string;
  startedAt: string;
  endedAt: string | null;
  durationMinutes: number;
  goalId: string | null;
};

type GoalLite = { id: string; title: string };

const EMPTY_PLANS: DayPlan[] = [];
const EMPTY_BLOCKS: TimeBlock[] = [];
const EMPTY_SESSIONS: SessionLite[] = [];
const EMPTY_HABIT_LOGS: Array<{ id: string; date: string; habitId: string }> = [];
const EMPTY_GOALS: GoalLite[] = [];

function parseTimeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map((v) => parseInt(v, 10));
  return clampDayMinutes((Number.isFinite(h) ? h : 0) * 60 + (Number.isFinite(m) ? m : 0));
}

function minutesToTime(value: number): string {
  const clamped = clampDayMinutes(value);
  const h = Math.floor(clamped / 60);
  const m = clamped % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function clampDayMinutes(value: number): number {
  return Math.min(24 * 60, Math.max(0, value));
}

function withAlpha(color: string, alphaHex: string): string {
  if (color.startsWith("#") && color.length === 7) {
    return `${color}${alphaHex}`;
  }
  return color;
}

function formatHourLabel(hour: number): string {
  const amPm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${String(displayHour).padStart(2, "0")} ${amPm}`;
}

function keyToDate(dateKey: string): Date {
  return new Date(`${dateKey}T12:00:00`);
}

function dateToKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDays(dateKey: string, amount: number): string {
  const d = keyToDate(dateKey);
  d.setDate(d.getDate() + amount);
  return dateToKey(d);
}

function startOfWeek(dateKey: string): string {
  const d = keyToDate(dateKey);
  const weekday = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - weekday);
  return dateToKey(d);
}

function endOfWeek(dateKey: string): string {
  return addDays(startOfWeek(dateKey), 6);
}

function startOfMonthGrid(dateKey: string): string {
  const d = keyToDate(dateKey);
  d.setDate(1);
  const firstKey = dateToKey(d);
  return startOfWeek(firstKey);
}

function endOfMonthGrid(dateKey: string): string {
  const d = keyToDate(dateKey);
  d.setMonth(d.getMonth() + 1, 0);
  const lastKey = dateToKey(d);
  return endOfWeek(lastKey);
}

function listDays(startKey: string, endKey: string): string[] {
  const out: string[] = [];
  let cursor = startKey;
  while (cursor <= endKey) {
    out.push(cursor);
    cursor = addDays(cursor, 1);
  }
  return out;
}

function recurrenceMatches(rule: BlockRecurrence | undefined, originKey: string, targetKey: string, until: string | null | undefined): boolean {
  if (!rule || rule === "none") return false;
  if (targetKey <= originKey) return false;
  if (until && targetKey > until) return false;

  const origin = keyToDate(originKey);
  const target = keyToDate(targetKey);

  if (rule === "daily") return true;
  if (rule === "weekdays") {
    const wd = target.getDay();
    return wd >= 1 && wd <= 5;
  }
  if (rule === "weekly") {
    return target.getDay() === origin.getDay();
  }
  return false;
}

function computePlacements(events: ScheduleEvent[]): Record<string, EventPlacement> {
  const sorted = [...events].sort((a, b) => (a.startMin - b.startMin) || (a.endMin - b.endMin));
  const placements: Record<string, EventPlacement> = {};

  const groups: ScheduleEvent[][] = [];
  let currentGroup: ScheduleEvent[] = [];
  let currentGroupEnd = -1;

  for (const event of sorted) {
    if (currentGroup.length === 0 || event.startMin < currentGroupEnd) {
      currentGroup.push(event);
      currentGroupEnd = Math.max(currentGroupEnd, event.endMin);
    } else {
      groups.push(currentGroup);
      currentGroup = [event];
      currentGroupEnd = event.endMin;
    }
  }
  if (currentGroup.length > 0) groups.push(currentGroup);

  for (const group of groups) {
    const columnEnds: number[] = [];
    const groupPlacement: Record<string, number> = {};

    for (const event of group) {
      let column = columnEnds.findIndex((end) => end <= event.startMin);
      if (column === -1) {
        column = columnEnds.length;
        columnEnds.push(event.endMin);
      } else {
        columnEnds[column] = event.endMin;
      }
      groupPlacement[event.id] = column;
    }

    for (const event of group) {
      placements[event.id] = { column: groupPlacement[event.id], columnCount: columnEnds.length };
    }
  }

  return placements;
}

function pickEventColor(event: ScheduleEvent, categoryColor: string, colorSet: CalendarColorSet): string {
  if (colorSet === "status" && event.kind === "planned" && event.status) {
    return STATUS_COLORS[event.status] ?? categoryColor;
  }
  if (colorSet === "high-contrast") {
    return HIGH_CONTRAST_KIND_COLORS[event.kind];
  }
  return categoryColor;
}

function dayHeaderLabel(dateKey: string): string {
  return keyToDate(dateKey).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
}

function monthHeaderLabel(dateKey: string): string {
  return keyToDate(dateKey).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default function SchedulePage() {
  const categories = useCategories();
  const templates = useDayTemplates();
  const settings = useUserSettings();
  const habits = useHabits(false);

  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [anchorDate, setAnchorDate] = useState(getTodayDateString());
  const [layers, setLayers] = useState<Record<LayerKey, boolean>>({
    planned: true,
    tracked: true,
    habits: true,
    goals: true,
  });

  const [showModal, setShowModal] = useState(false);
  const [editingBlock, setEditingBlock] = useState<TimeBlock | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [currentMinute, setCurrentMinute] = useState(new Date().getMinutes());
  const [liveTimer, setLiveTimer] = useState<{ title: string; categoryId: string; startedAt: string } | null>(null);

  const density: CalendarDensity = settings?.calendarDensity ?? "comfortable";
  const colorSet: CalendarColorSet = settings?.calendarColorSet ?? "category";
  const hourHeight = DENSITY_HOUR_HEIGHT[density];

  const dateRange = useMemo(() => {
    if (viewMode === "day") return { start: anchorDate, end: anchorDate };
    if (viewMode === "week") return { start: startOfWeek(anchorDate), end: endOfWeek(anchorDate) };
    return { start: startOfMonthGrid(anchorDate), end: endOfMonthGrid(anchorDate) };
  }, [anchorDate, viewMode]);

  const rangeDays = useMemo(() => listDays(dateRange.start, dateRange.end), [dateRange]);

  const rangePlans = useLiveQuery(async () => {
    return db.dayPlans.where("date").between(dateRange.start, dateRange.end, true, true).toArray();
  }, [dateRange.start, dateRange.end]) ?? EMPTY_PLANS;

  const planIds = useMemo(() => rangePlans.map((p) => p.id), [rangePlans]);
  const planIdsKey = useMemo(() => planIds.join("|"), [planIds]);

  const rangeBlocks = useLiveQuery(async () => {
    if (planIds.length === 0) return [] as TimeBlock[];
    return db.timeBlocks.where("dayPlanId").anyOf(planIds).toArray();
  }, [planIdsKey]) ?? EMPTY_BLOCKS;

  const rangeSessions = useLiveQuery(async () => {
    if (planIds.length === 0) return [] as Array<{
      id: string;
      dayPlanId: string;
      title: string;
      categoryId: string;
      startedAt: string;
      endedAt: string | null;
      durationMinutes: number;
      goalId: string | null;
    }>;
    return db.timeSessions.where("dayPlanId").anyOf(planIds).toArray();
  }, [planIdsKey]) ?? EMPTY_SESSIONS;

  const rangeHabitLogs = useLiveQuery(async () => {
    return db.habitLogs.where("date").between(dateRange.start, dateRange.end, true, true).toArray();
  }, [dateRange.start, dateRange.end]) ?? EMPTY_HABIT_LOGS;

  const goals = useLiveQuery(() => db.goals.toArray(), []) ?? EMPTY_GOALS;

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      setCurrentHour(now.getHours());
      setCurrentMinute(now.getMinutes());
    }

    function syncLiveTimer() {
      try {
        const raw = localStorage.getItem(TIMER_STORAGE_KEY);
        if (!raw) {
          setLiveTimer(null);
          return;
        }

        const parsed = JSON.parse(raw) as {
          state?: string;
          sessionStartedAt?: string | null;
          sessionTitle?: string;
          categoryId?: string;
        };

        const startedAt = parsed.sessionStartedAt;
        const valid =
          (parsed.state === "running" || parsed.state === "paused") &&
          typeof startedAt === "string" &&
          startedAt.length > 0;

        if (!valid) {
          setLiveTimer(null);
          return;
        }

        setLiveTimer({
          title: parsed.sessionTitle?.trim() || "Active Timer Session",
          categoryId: parsed.categoryId?.trim() || "",
          startedAt,
        });
      } catch {
        setLiveTimer(null);
      }
    }

    updateClock();
    syncLiveTimer();
    const interval = setInterval(() => {
      updateClock();
      syncLiveTimer();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const plansByDate = useMemo(() => {
    const map = new Map<string, DayPlan>();
    for (const p of rangePlans) map.set(p.date, p);
    return map;
  }, [rangePlans]);

  const dateByPlanId = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of rangePlans) map.set(p.id, p.date);
    return map;
  }, [rangePlans]);

  const goalsById = useMemo(() => {
    const map = new Map<string, string>();
    for (const g of goals) map.set(g.id, g.title);
    return map;
  }, [goals]);

  const habitsById = useMemo(() => {
    const map = new Map<string, string>();
    for (const h of habits) map.set(h.id, h.name);
    return map;
  }, [habits]);

  const allEvents = useMemo<ScheduleEvent[]>(() => {
    const events: ScheduleEvent[] = [];

    for (const block of rangeBlocks) {
      const sourceDate = dateByPlanId.get(block.dayPlanId);
      if (!sourceDate) continue;

      for (const dayKey of rangeDays) {
        const include = dayKey === sourceDate || recurrenceMatches(block.recurrence, sourceDate, dayKey, block.recurrenceUntil);
        if (!include) continue;

        const startMin = parseTimeToMinutes(block.startTime);
        const endRaw = parseTimeToMinutes(block.endTime);
        const endMin = Math.max(startMin + 15, endRaw);
        const editable = dayKey === sourceDate;

        events.push({
          id: `planned-${block.id}-${dayKey}`,
          kind: "planned",
          layer: "planned",
          dayKey,
          title: block.title,
          categoryId: block.categoryId,
          startMin,
          endMin,
          status: block.status,
          sourceBlockId: block.id,
          editable,
          isNonNegotiable: block.isNonNegotiable,
        });

        if (block.goalId) {
          events.push({
            id: `goal-block-${block.id}-${dayKey}`,
            kind: "goal",
            layer: "goals",
            dayKey,
            title: goalsById.get(block.goalId) ?? `Goal: ${block.title}`,
            categoryId: block.categoryId,
            startMin,
            endMin,
          });
        }
      }
    }

    for (const session of rangeSessions) {
      const started = new Date(session.startedAt);
      const dayKey = dateToKey(started);
      if (dayKey < dateRange.start || dayKey > dateRange.end) continue;

      const startMin = clampDayMinutes(started.getHours() * 60 + started.getMinutes());
      let endMin = startMin + Math.max(15, session.durationMinutes);
      if (session.endedAt) {
        const ended = new Date(session.endedAt);
        endMin = clampDayMinutes(ended.getHours() * 60 + ended.getMinutes());
        if (endMin <= startMin) endMin = startMin + Math.max(15, session.durationMinutes);
      }

      events.push({
        id: `tracked-${session.id}`,
        kind: "tracked",
        layer: "tracked",
        dayKey,
        title: session.title,
        categoryId: session.categoryId,
        startMin,
        endMin,
      });

      if (session.goalId) {
        events.push({
          id: `goal-session-${session.id}`,
          kind: "goal",
          layer: "goals",
          dayKey,
          title: goalsById.get(session.goalId) ?? `Goal Session: ${session.title}`,
          categoryId: session.categoryId,
          startMin,
          endMin,
        });
      }
    }

    const habitOffsetByDay = new Map<string, number>();
    const sortedLogs = [...rangeHabitLogs].sort((a, b) => a.date.localeCompare(b.date));
    for (const log of sortedLogs) {
      const index = habitOffsetByDay.get(log.date) ?? 0;
      habitOffsetByDay.set(log.date, index + 1);
      const startMin = 20 * 60 + index * 20;
      const endMin = Math.min(startMin + 18, 24 * 60);

      events.push({
        id: `habit-${log.id}`,
        kind: "habit",
        layer: "habits",
        dayKey: log.date,
        title: habitsById.get(log.habitId) ?? "Habit",
        categoryId: "",
        startMin,
        endMin,
      });
    }

    if (liveTimer) {
      const started = new Date(liveTimer.startedAt);
      const dayKey = dateToKey(started);
      if (dayKey >= dateRange.start && dayKey <= dateRange.end) {
        const now = new Date();
        const startMin = clampDayMinutes(started.getHours() * 60 + started.getMinutes());
        const endMin = Math.max(startMin + 15, clampDayMinutes(now.getHours() * 60 + now.getMinutes()));
        events.push({
          id: "live-timer",
          kind: "live",
          layer: "tracked",
          dayKey,
          title: liveTimer.title,
          categoryId: liveTimer.categoryId,
          startMin,
          endMin,
        });
      }
    }

    return events.sort((a, b) => (a.dayKey.localeCompare(b.dayKey) || a.startMin - b.startMin));
  }, [rangeBlocks, rangeDays, rangeSessions, rangeHabitLogs, liveTimer, dateByPlanId, dateRange, goalsById, habitsById]);

  const filteredEvents = useMemo(
    () => allEvents.filter((e) => layers[e.layer]),
    [allEvents, layers]
  );

  const dayEvents = useMemo(() => filteredEvents.filter((e) => e.dayKey === anchorDate), [filteredEvents, anchorDate]);
  const dayPlacements = useMemo(() => computePlacements(dayEvents), [dayEvents]);

  const weekDays = useMemo(() => listDays(startOfWeek(anchorDate), endOfWeek(anchorDate)), [anchorDate]);

  const [dragState, setDragState] = useState<{
    blockId: string;
    mode: "move" | "resize";
    startY: number;
    origStartMin: number;
    origEndMin: number;
  } | null>(null);
  const [dragPreview, setDragPreview] = useState<Record<string, { startMin: number; endMin: number }>>({});

  useEffect(() => {
    if (!dragState) return;

    const activeDrag = dragState;

    function onMove(evt: MouseEvent) {
      const deltaY = evt.clientY - activeDrag.startY;
      const minuteStep = 15;
      const deltaMin = Math.round((deltaY / hourHeight) * 60 / minuteStep) * minuteStep;

      let startMin = activeDrag.origStartMin;
      let endMin = activeDrag.origEndMin;

      if (activeDrag.mode === "move") {
        const duration = activeDrag.origEndMin - activeDrag.origStartMin;
        startMin = clampDayMinutes(activeDrag.origStartMin + deltaMin);
        startMin = Math.min(startMin, 24 * 60 - duration);
        endMin = startMin + duration;
      } else {
        endMin = clampDayMinutes(activeDrag.origEndMin + deltaMin);
        endMin = Math.max(endMin, activeDrag.origStartMin + 15);
      }

      setDragPreview((prev) => ({ ...prev, [activeDrag.blockId]: { startMin, endMin } }));
    }

    async function onUp() {
      const preview = dragPreview[activeDrag.blockId];
      if (preview) {
        await db.timeBlocks.update(activeDrag.blockId, {
          startTime: minutesToTime(preview.startMin),
          endTime: minutesToTime(preview.endMin),
          updatedAt: new Date().toISOString(),
        });
      }
      setDragState(null);
      setDragPreview((prev) => {
        const next = { ...prev };
        delete next[activeDrag.blockId];
        return next;
      });
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragState, hourHeight, dragPreview]);

  const getCategoryColor = useCallback(
    (catId: string) => categories.find((c) => c.id === catId)?.color ?? "#94a3b8",
    [categories]
  );

  const getCategoryIcon = useCallback(
    (catId: string) => categories.find((c) => c.id === catId)?.icon ?? "category",
    [categories]
  );

  const currentPlan = plansByDate.get(anchorDate) ?? null;
  const currentBlocks = useMemo(() => {
    if (!currentPlan) return [] as TimeBlock[];
    return rangeBlocks.filter((b) => b.dayPlanId === currentPlan.id);
  }, [currentPlan, rangeBlocks]);

  const completedCount = useMemo(() => currentBlocks.filter((b) => b.status === "completed").length, [currentBlocks]);
  const totalCount = currentBlocks.length;

  async function handleAddBlock(block: Omit<TimeBlock, "id" | "createdAt" | "updatedAt" | "syncedAt">) {
    const now = new Date().toISOString();
    if (editingBlock) {
      await db.timeBlocks.update(editingBlock.id, { ...block, updatedAt: now });
    } else {
      await db.timeBlocks.add({ ...block, id: uuid(), createdAt: now, updatedAt: now, syncedAt: null });
    }
    setShowModal(false);
    setEditingBlock(null);
  }

  async function deleteBlock(blockId: string) {
    await db.timeBlocks.delete(blockId);
  }

  async function updateBlockStatus(blockId: string, status: BlockStatus) {
    await db.timeBlocks.update(blockId, { status, updatedAt: new Date().toISOString() });
  }

  function shiftDate(direction: -1 | 1) {
    if (viewMode === "day") {
      setAnchorDate((d) => addDays(d, direction));
      return;
    }
    if (viewMode === "week") {
      setAnchorDate((d) => addDays(d, direction * 7));
      return;
    }
    const d = keyToDate(anchorDate);
    d.setMonth(d.getMonth() + direction);
    setAnchorDate(dateToKey(d));
  }

  function resetToToday() {
    setAnchorDate(getTodayDateString());
  }

  function activeLabel(): string {
    if (viewMode === "day") return dayHeaderLabel(anchorDate);
    if (viewMode === "week") {
      const start = startOfWeek(anchorDate);
      const end = endOfWeek(anchorDate);
      return `${dayHeaderLabel(start)} - ${dayHeaderLabel(end)}`;
    }
    return monthHeaderLabel(anchorDate);
  }

  function renderTimelineEvent(event: ScheduleEvent, placement: EventPlacement, dayKey: string, hourHeightPx: number) {
    const baseTop = (event.startMin / 60) * hourHeightPx;
    const baseHeight = Math.max(18, ((event.endMin - event.startMin) / 60) * hourHeightPx);
    const leftPercent = (placement.column / placement.columnCount) * 100;
    const widthPercent = 100 / placement.columnCount;

    const preview = event.sourceBlockId ? dragPreview[event.sourceBlockId] : undefined;
    const top = preview ? (preview.startMin / 60) * hourHeightPx : baseTop;
    const height = preview ? Math.max(18, ((preview.endMin - preview.startMin) / 60) * hourHeightPx) : baseHeight;

    const categoryColor = getCategoryColor(event.categoryId);
    const eventColor = pickEventColor(event, categoryColor, colorSet);
    const icon = getCategoryIcon(event.categoryId);
    const sourceBlock = event.sourceBlockId ? rangeBlocks.find((b) => b.id === event.sourceBlockId) : null;

    return (
      <div
        key={event.id}
        className={cn(
          "absolute rounded-lg border shadow-sm px-2 py-1 text-left group overflow-hidden",
          event.kind === "live" && "ring-2 ring-primary/40",
          event.editable && "cursor-pointer"
        )}
        style={{
          top: `${top}px`,
          height: `${height}px`,
          left: `calc(${leftPercent}% + 4px)`,
          width: `calc(${widthPercent}% - 8px)`,
          borderColor: withAlpha(eventColor, "99"),
          backgroundColor: withAlpha(eventColor, event.kind === "tracked" ? "2E" : "1F"),
        }}
        onClick={() => {
          if (!event.editable || !sourceBlock) return;
          const nextStatus: Record<BlockStatus, BlockStatus> = {
            pending: "in-progress",
            "in-progress": "completed",
            completed: "pending",
            skipped: "pending",
            moved: "pending",
          };
          updateBlockStatus(sourceBlock.id, nextStatus[sourceBlock.status]);
        }}
      >
        <div className="flex items-start gap-1.5 h-full">
          <div className="size-4 rounded flex items-center justify-center shrink-0 text-white" style={{ backgroundColor: eventColor }}>
            <span className="material-symbols-outlined text-[10px]">{icon}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold truncate">{event.title}</p>
            <p className="text-[10px] text-text-muted-light dark:text-text-muted-dark">
              {minutesToTime(preview?.startMin ?? event.startMin)} - {minutesToTime(preview?.endMin ?? event.endMin)}
            </p>
            <p className="text-[9px] uppercase font-bold tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
              {event.kind}
            </p>
          </div>
        </div>

        {event.editable && sourceBlock && (
          <>
            <div className="absolute top-1 right-1 hidden group-hover:flex gap-0.5">
              <button
                type="button"
                className="size-6 rounded flex items-center justify-center bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:bg-primary/10 cursor-pointer"
                title="Edit"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingBlock(sourceBlock);
                  setShowModal(true);
                }}
              >
                <span className="material-symbols-outlined text-xs">edit</span>
              </button>
              <button
                type="button"
                className="size-6 rounded flex items-center justify-center bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:bg-danger/10 text-danger cursor-pointer"
                title="Delete"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteBlock(sourceBlock.id);
                }}
              >
                <span className="material-symbols-outlined text-xs">delete</span>
              </button>
            </div>

            <div
              className="absolute inset-0"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragState({
                  blockId: sourceBlock.id,
                  mode: "move",
                  startY: e.clientY,
                  origStartMin: event.startMin,
                  origEndMin: event.endMin,
                });
              }}
            />

            <div
              className="absolute left-1 right-1 bottom-0 h-2 cursor-ns-resize"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragState({
                  blockId: sourceBlock.id,
                  mode: "resize",
                  startY: e.clientY,
                  origStartMin: event.startMin,
                  origEndMin: event.endMin,
                });
              }}
            />
          </>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold mb-2">Schedule</h1>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="primary">{activeLabel()}</Badge>
            <div className="flex items-center gap-1 text-text-secondary-light dark:text-text-secondary-dark text-sm">
              <span className="material-symbols-outlined text-sm">schedule</span>
              <span>{totalCount > 0 ? `${Math.round((completedCount / totalCount) * 100)}% Complete` : "No blocks yet"}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 border border-border-light dark:border-border-dark rounded-xl p-1">
            {(["day", "week", "month"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-bold capitalize",
                  viewMode === mode ? "bg-primary text-white" : "text-text-secondary-light dark:text-text-secondary-dark"
                )}
                onClick={() => setViewMode(mode)}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 border border-border-light dark:border-border-dark rounded-xl p-1">
            <button type="button" className="px-2 py-1 rounded-md hover:bg-surface-light-hover dark:hover:bg-surface-dark-hover" onClick={() => shiftDate(-1)}>
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button type="button" className="px-3 py-1 rounded-md text-sm font-bold hover:bg-surface-light-hover dark:hover:bg-surface-dark-hover" onClick={resetToToday}>
              Today
            </button>
            <button type="button" className="px-2 py-1 rounded-md hover:bg-surface-light-hover dark:hover:bg-surface-dark-hover" onClick={() => shiftDate(1)}>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>

          <Button variant="ghost" onClick={() => setShowTemplateModal(true)}>
            <span className="material-symbols-outlined text-lg">layers</span>
            Templates
          </Button>
          <Button variant="primary" onClick={() => { setEditingBlock(null); setShowModal(true); }}>
            <span className="material-symbols-outlined text-lg">add</span>
            Add Block
          </Button>
        </div>
      </div>

      <Card className="mb-5 p-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-text-muted-light dark:text-text-muted-dark">Layers</span>
          {(["planned", "tracked", "habits", "goals"] as LayerKey[]).map((layer) => (
            <button
              key={layer}
              type="button"
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border",
                layers[layer]
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark"
              )}
              onClick={() => setLayers((prev) => ({ ...prev, [layer]: !prev[layer] }))}
            >
              {layer}
            </button>
          ))}
          <span className="text-xs text-text-muted-light dark:text-text-muted-dark">
            Density: {density} | Colors: {colorSet}
          </span>
        </div>
      </Card>

      {viewMode === "day" && (
        <div className="grid" style={{ gridTemplateColumns: "80px 1fr" }}>
          <div className="border-r border-border-light dark:border-border-dark relative" style={{ height: `${HOURS.length * hourHeight}px` }}>
            {HOURS.map((hour) => {
              const isCurrentHour = anchorDate === getTodayDateString() && hour === currentHour;
              return (
                <div key={`label-${hour}`} className={cn("border-b border-border-light dark:border-border-dark", isCurrentHour && "bg-primary/5")} style={{ height: `${hourHeight}px` }}>
                  <div className="h-full flex items-start justify-end pr-4 py-2">
                    <span className={cn("text-xs font-bold uppercase tracking-tighter", isCurrentHour ? "text-primary" : "text-text-muted-light dark:text-text-muted-dark")}>
                      {formatHourLabel(hour)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="relative" style={{ height: `${HOURS.length * hourHeight}px` }}>
            {HOURS.map((hour) => {
              const isCurrentHour = anchorDate === getTodayDateString() && hour === currentHour;
              return (
                <div key={`row-${hour}`} className={cn("border-b border-border-light dark:border-border-dark", isCurrentHour && "bg-primary/5")} style={{ height: `${hourHeight}px` }} />
              );
            })}

            {anchorDate === getTodayDateString() && (
              <div className="absolute left-0 right-0 z-20 flex items-center" style={{ top: `${((currentHour * 60 + currentMinute) / 60) * hourHeight}px` }}>
                <div className="size-2 rounded-full bg-primary" />
                <div className="flex-1 h-[2px] bg-primary" />
                <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full ml-1">
                  {new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
                </span>
              </div>
            )}

            {dayEvents.map((event) => renderTimelineEvent(event, dayPlacements[event.id] ?? { column: 0, columnCount: 1 }, anchorDate, hourHeight))}
          </div>
        </div>
      )}

      {viewMode === "week" && (
        <div className="overflow-x-auto">
          <div className="grid min-w-[1100px]" style={{ gridTemplateColumns: "60px repeat(7, minmax(0, 1fr))" }}>
            <div />
            {weekDays.map((day) => (
              <div key={`head-${day}`} className="px-2 py-2 border-b border-border-light dark:border-border-dark text-center">
                <p className="text-xs font-bold uppercase text-text-muted-light dark:text-text-muted-dark">
                  {keyToDate(day).toLocaleDateString("en-US", { weekday: "short" })}
                </p>
                <p className={cn("text-sm font-bold", day === getTodayDateString() && "text-primary")}>{keyToDate(day).getDate()}</p>
              </div>
            ))}

            <div className="border-r border-border-light dark:border-border-dark" style={{ height: `${HOURS.length * hourHeight}px` }}>
              {HOURS.map((h) => (
                <div key={`wk-label-${h}`} style={{ height: `${hourHeight}px` }} className="border-b border-border-light dark:border-border-dark pr-2 text-right pt-1">
                  <span className="text-[10px] font-bold text-text-muted-light dark:text-text-muted-dark">{formatHourLabel(h)}</span>
                </div>
              ))}
            </div>

            {weekDays.map((day) => {
              const events = filteredEvents.filter((e) => e.dayKey === day);
              const placements = computePlacements(events);
              return (
                <div key={`wk-col-${day}`} className="relative border-r border-border-light dark:border-border-dark" style={{ height: `${HOURS.length * hourHeight}px` }}>
                  {HOURS.map((h) => (
                    <div key={`wk-row-${day}-${h}`} style={{ height: `${hourHeight}px` }} className="border-b border-border-light dark:border-border-dark" />
                  ))}
                  {day === getTodayDateString() && (
                    <div className="absolute left-0 right-0 z-10 flex items-center" style={{ top: `${((currentHour * 60 + currentMinute) / 60) * hourHeight}px` }}>
                      <div className="size-1.5 rounded-full bg-primary" />
                      <div className="flex-1 h-[2px] bg-primary" />
                    </div>
                  )}
                  {events.map((event) => renderTimelineEvent(event, placements[event.id] ?? { column: 0, columnCount: 1 }, day, hourHeight))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {viewMode === "month" && (
        <div className="grid grid-cols-7 gap-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="text-center text-xs font-bold uppercase text-text-muted-light dark:text-text-muted-dark py-2">{d}</div>
          ))}

          {rangeDays.map((day) => {
            const dayDate = keyToDate(day);
            const inMonth = dayDate.getMonth() === keyToDate(anchorDate).getMonth();
            const events = filteredEvents
              .filter((e) => e.dayKey === day)
              .sort((a, b) => a.startMin - b.startMin)
              .slice(0, 3);
            const total = filteredEvents.filter((e) => e.dayKey === day).length;

            return (
              <button
                key={`month-${day}`}
                type="button"
                className={cn(
                  "min-h-[140px] rounded-xl border border-border-light dark:border-border-dark p-2 text-left hover:border-primary/40 transition-colors",
                  !inMonth && "opacity-55",
                  day === getTodayDateString() && "ring-1 ring-primary/50"
                )}
                onClick={() => {
                  setAnchorDate(day);
                  setViewMode("day");
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={cn("text-xs font-bold", day === getTodayDateString() && "text-primary")}>{dayDate.getDate()}</span>
                </div>
                <div className="space-y-1">
                  {events.map((event) => {
                    const categoryColor = getCategoryColor(event.categoryId);
                    const eventColor = pickEventColor(event, categoryColor, colorSet);
                    return (
                      <div key={event.id} className="rounded px-1.5 py-1 text-[10px] font-bold truncate" style={{ backgroundColor: withAlpha(eventColor, "2E"), borderLeft: `3px solid ${eventColor}` }}>
                        {minutesToTime(event.startMin)} {event.title}
                      </div>
                    );
                  })}
                  {total > 3 && <p className="text-[10px] font-bold text-text-muted-light dark:text-text-muted-dark">+{total - 3} more</p>}
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {[
          { label: "Total Blocks", value: totalCount, icon: "grid_view" },
          { label: "Completed", value: completedCount, icon: "task_alt" },
          { label: "Completion Rate", value: totalCount > 0 ? `${Math.round((completedCount / totalCount) * 100)}%` : "-", icon: "percent" },
          { label: "Visible Events", value: filteredEvents.filter((e) => e.dayKey === anchorDate).length, icon: "event" },
        ].map((stat) => (
          <Card key={stat.label} variant="metric" className="flex items-center gap-3 p-4">
            <span className="material-symbols-outlined text-primary">{stat.icon}</span>
            <div>
              <p className="text-[10px] font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-widest">{stat.label}</p>
              <p className="text-xl font-bold">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {showTemplateModal && (
        <TemplateModal
          templates={templates}
          categories={categories}
          blocks={currentBlocks}
          onLoad={async (templateId) => {
            await loadTemplateIntoPlan(templateId, anchorDate);
            setShowTemplateModal(false);
          }}
          onSave={async (name) => {
            await saveCurrentDayAsTemplate(name, anchorDate);
            setShowTemplateModal(false);
          }}
          onClose={() => setShowTemplateModal(false)}
        />
      )}

      {showModal && (
        <BlockModal
          categories={categories}
          dateKey={anchorDate}
          dayPlanId={currentPlan?.id ?? null}
          editingBlock={editingBlock}
          onSave={handleAddBlock}
          onClose={() => { setShowModal(false); setEditingBlock(null); }}
        />
      )}
    </div>
  );
}

function BlockModal({
  categories,
  dateKey,
  dayPlanId,
  editingBlock,
  onSave,
  onClose,
}: {
  categories: { id: string; name: string; color: string; icon: string }[];
  dateKey: string;
  dayPlanId: string | null;
  editingBlock: TimeBlock | null;
  onSave: (block: Omit<TimeBlock, "id" | "createdAt" | "updatedAt" | "syncedAt">) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(editingBlock?.title ?? "");
  const [categoryId, setCategoryId] = useState(editingBlock?.categoryId ?? categories[0]?.id ?? "");
  const [startTime, setStartTime] = useState(editingBlock?.startTime ?? "09:00");
  const [endTime, setEndTime] = useState(editingBlock?.endTime ?? "10:00");
  const [isNonNeg, setIsNonNeg] = useState(editingBlock?.isNonNegotiable ?? false);
  const [recurrence, setRecurrence] = useState<BlockRecurrence>(editingBlock?.recurrence ?? "none");
  const [recurrenceUntil, setRecurrenceUntil] = useState(editingBlock?.recurrenceUntil ?? "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let planId = dayPlanId;
    if (!planId) {
      const now = new Date().toISOString();
      planId = uuid();
      await db.dayPlans.add({
        id: planId,
        date: dateKey,
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
      });
    }

    onSave({
      dayPlanId: planId,
      title: title || "Untitled Block",
      categoryId,
      startTime,
      endTime,
      isNonNegotiable: isNonNeg,
      recurrence,
      recurrenceUntil: recurrence === "none" ? null : (recurrenceUntil || null),
      status: editingBlock?.status ?? "pending",
      goalId: editingBlock?.goalId ?? null,
      skillId: editingBlock?.skillId ?? null,
      sortOrder: editingBlock?.sortOrder ?? 0,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 w-full max-w-md shadow-xl border border-border-light dark:border-border-dark"
      >
        <h2 className="text-lg font-bold mb-4">{editingBlock ? "Edit Time Block" : "Add Time Block"}</h2>

        <label className="block mb-3">
          <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Title</span>
          <input
            className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What are you working on?"
          />
        </label>

        <label className="block mb-3">
          <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Category</span>
          <select
            className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <label>
            <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Start</span>
            <input
              type="time"
              className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </label>
          <label>
            <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">End</span>
            <input
              type="time"
              className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <label>
            <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Repeat</span>
            <select
              className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm"
              value={recurrence}
              onChange={(e) => setRecurrence(e.target.value as BlockRecurrence)}
            >
              <option value="none">Does not repeat</option>
              <option value="daily">Daily</option>
              <option value="weekdays">Weekdays</option>
              <option value="weekly">Weekly</option>
            </select>
          </label>
          <label>
            <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Repeat Until</span>
            <input
              type="date"
              className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm"
              value={recurrenceUntil}
              onChange={(e) => setRecurrenceUntil(e.target.value)}
              disabled={recurrence === "none"}
            />
          </label>
        </div>

        <label className="flex items-center gap-3 mb-6">
          <input
            type="checkbox"
            checked={isNonNeg}
            onChange={(e) => setIsNonNeg(e.target.checked)}
            className="rounded text-primary focus:ring-primary size-5"
          />
          <span className="text-sm font-medium">Non-negotiable</span>
        </label>

        <div className="flex gap-3">
          <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" className="flex-1">{editingBlock ? "Save" : "Add Block"}</Button>
        </div>
      </form>
    </div>
  );
}

function TemplateModal({
  templates,
  categories,
  blocks,
  onLoad,
  onSave,
  onClose,
}: {
  templates: { id: string; name: string; dayType: string; blocks: { title: string; categoryId: string; startTime: string; endTime: string }[] }[];
  categories: { id: string; name: string; color: string }[];
  blocks: TimeBlock[];
  onLoad: (templateId: string) => Promise<void>;
  onSave: (name: string) => Promise<void>;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"load" | "save">("load");
  const [saveName, setSaveName] = useState("");
  const [loading, setLoading] = useState(false);

  const getCatColor = (catId: string) => categories.find((c) => c.id === catId)?.color ?? "#94a3b8";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 w-full max-w-lg shadow-xl border border-border-light dark:border-border-dark max-h-[80vh] overflow-y-auto"
      >
        <h2 className="text-lg font-bold mb-4">Day Templates</h2>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTab("load")}
            className={cn(
              "flex-1 py-2 rounded-lg text-sm font-bold cursor-pointer transition-all",
              tab === "load" ? "bg-primary text-white" : "bg-surface-light-hover dark:bg-surface-dark-hover border border-border-light dark:border-border-dark"
            )}
          >
            Load Template
          </button>
          <button
            onClick={() => setTab("save")}
            className={cn(
              "flex-1 py-2 rounded-lg text-sm font-bold cursor-pointer transition-all",
              tab === "save" ? "bg-primary text-white" : "bg-surface-light-hover dark:bg-surface-dark-hover border border-border-light dark:border-border-dark"
            )}
          >
            Save Current
          </button>
        </div>

        {tab === "load" ? (
          <div className="flex flex-col gap-3">
            {templates.length === 0 ? (
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark text-center py-6">
                No templates available yet. Save your current schedule as a template.
              </p>
            ) : (
              templates.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="p-4 rounded-xl border border-border-light dark:border-border-dark"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-bold">{tmpl.name}</h3>
                      <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                        {tmpl.blocks.length} blocks | {tmpl.dayType}
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      disabled={loading}
                      onClick={async () => {
                        setLoading(true);
                        await onLoad(tmpl.id);
                        setLoading(false);
                      }}
                    >
                      Load
                    </Button>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {tmpl.blocks.slice(0, 8).map((b, i) => (
                      <div
                        key={i}
                        className="h-2 flex-1 rounded-full"
                        style={{ backgroundColor: getCatColor(b.categoryId) }}
                        title={b.title}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div>
            {blocks.length === 0 ? (
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark text-center py-6">
                Add some blocks to your schedule first, then save it as a template.
              </p>
            ) : (
              <>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-3">
                  Save this day&apos;s {blocks.length} blocks as a reusable template.
                </p>
                <input
                  className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 mb-4"
                  placeholder="Template name..."
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                />
                <Button
                  variant="primary"
                  className="w-full"
                  disabled={loading || !saveName.trim()}
                  onClick={async () => {
                    setLoading(true);
                    await onSave(saveName.trim());
                    setLoading(false);
                  }}
                >
                  Save Template
                </Button>
              </>
            )}
          </div>
        )}

        <Button variant="ghost" className="w-full mt-4" onClick={onClose}>Close</Button>
      </div>
    </div>
  );
}
