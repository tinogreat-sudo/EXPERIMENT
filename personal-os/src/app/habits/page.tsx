"use client";

import { useState, useCallback, useMemo } from "react";
import { v4 as uuid } from "uuid";
import { db } from "@/lib/db";
import { useHabits, useTodayHabitLogs, useTodayPlan, useActiveGoals } from "@/hooks/useLiveData";
import { getTodayDateString, cn } from "@/lib/utils";
import { computeStreak } from "@/lib/streaks";
import { Button, Card, Badge } from "@/components/ui";
import type { Habit, HabitType, NegativeHabitStatus } from "@/types";

export default function HabitsPage() {
  const habits = useHabits();
  const habitLogs = useTodayHabitLogs();
  const todayPlan = useTodayPlan();
  const [showModal, setShowModal] = useState(false);

  const positiveHabits = useMemo(() => habits.filter((h) => h.type === "positive"), [habits]);
  const negativeHabits = useMemo(() => habits.filter((h) => h.type === "negative"), [habits]);

  const completedCount = useMemo(
    () => habitLogs.filter((l) => l.status === "done" || l.status === "resisted" || l.status === "no-urge").length,
    [habitLogs]
  );

  const longestStreak = useMemo(
    () => habits.reduce((max, h) => Math.max(max, h.longestStreak), 0),
    [habits]
  );

  const resistedCount = useMemo(
    () => habitLogs.filter((l) => l.status === "resisted").length,
    [habitLogs]
  );

  async function ensureDayPlan() {
    const today = getTodayDateString();
    const now = new Date().toISOString();
    let plan = await db.dayPlans.where("date").equals(today).first();
    if (!plan) {
      const id = uuid();
      plan = {
        id, date: today, dayType: "work", templateId: null, intention: null,
        sleepHours: null, sleepQuality: null, bedtime: null, wakeTime: null,
        morningEnergy: null, overallEnergy: null, overallFocus: null,
        startedAt: null, endedAt: null, status: "active",
        createdAt: now, updatedAt: now, syncedAt: null,
      };
      await db.dayPlans.add(plan);
    }
    return plan;
  }

  const togglePositive = useCallback(async (habitId: string) => {
    const now = new Date().toISOString();
    const today = getTodayDateString();
    const existing = habitLogs.find((l) => l.habitId === habitId);
    if (existing) {
      await db.habitLogs.update(existing.id, {
        status: existing.status === "done" ? "missed" : "done",
        updatedAt: now,
      });
    } else {
      const plan = await ensureDayPlan();
      await db.habitLogs.add({
        id: uuid(), habitId, dayPlanId: plan.id, date: today,
        status: "done", createdAt: now, updatedAt: now, syncedAt: null,
      });
    }
    // Update streak
    const { currentStreak, longestStreak } = await computeStreak(habitId, "positive");
    await db.habits.update(habitId, { currentStreak, longestStreak, updatedAt: now });
  }, [habitLogs]);

  const logNegativeStatus = useCallback(async (habitId: string, status: NegativeHabitStatus) => {
    const now = new Date().toISOString();
    const today = getTodayDateString();
    const existing = habitLogs.find((l) => l.habitId === habitId);
    if (existing) {
      await db.habitLogs.update(existing.id, { status, updatedAt: now });
    } else {
      const plan = await ensureDayPlan();
      await db.habitLogs.add({
        id: uuid(), habitId, dayPlanId: plan.id, date: today,
        status, createdAt: now, updatedAt: now, syncedAt: null,
      });
    }
    // Update streak
    const { currentStreak, longestStreak } = await computeStreak(habitId, "negative");
    await db.habits.update(habitId, { currentStreak, longestStreak, updatedAt: now });
  }, [habitLogs]);

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Habits</h1>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <span className="material-symbols-outlined text-lg">add</span>
          Add Habit
        </Button>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card variant="metric" className="flex items-center gap-4">
          <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">check_circle</span>
          </div>
          <div>
            <p className="text-xs font-bold text-text-muted-light dark:text-text-muted-dark uppercase">Daily Completion</p>
            <p className="text-2xl font-bold">
              {habits.length > 0 ? `${Math.round((completedCount / habits.length) * 100)}%` : "—"}
            </p>
          </div>
        </Card>
        <Card variant="metric" className="flex items-center gap-4">
          <div className="size-12 rounded-xl bg-warning/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-warning">local_fire_department</span>
          </div>
          <div>
            <p className="text-xs font-bold text-text-muted-light dark:text-text-muted-dark uppercase">Longest Streak</p>
            <p className="text-2xl font-bold">{longestStreak > 0 ? `${longestStreak}d` : "—"}</p>
          </div>
        </Card>
        <Card variant="metric" className="flex items-center gap-4">
          <div className="size-12 rounded-xl bg-success/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-success">shield</span>
          </div>
          <div>
            <p className="text-xs font-bold text-text-muted-light dark:text-text-muted-dark uppercase">Urges Resisted</p>
            <p className="text-2xl font-bold">{resistedCount}</p>
          </div>
        </Card>
      </div>

      {/* Positive Habits */}
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-success">trending_up</span>
        Building
      </h2>
      <div className="flex flex-col gap-2 mb-8">
        {positiveHabits.length === 0 && (
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark text-center py-6">No positive habits yet. Start building your first routine.</p>
        )}
        {positiveHabits.map((habit) => {
          const log = habitLogs.find((l) => l.habitId === habit.id);
          const isDone = log?.status === "done";
          return (
            <label
              key={habit.id}
              className="flex items-center gap-4 p-4 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark hover:bg-surface-light-hover dark:hover:bg-surface-dark-hover transition-colors cursor-pointer"
            >
              <input
                type="checkbox"
                checked={isDone}
                onChange={() => togglePositive(habit.id)}
                className="rounded text-primary focus:ring-primary size-5 cursor-pointer"
              />
              <span className={cn("text-sm font-medium flex-1", isDone && "line-through text-text-muted-light dark:text-text-muted-dark")}>
                {habit.name}
              </span>
              {habit.currentStreak > 0 && (
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-warning text-sm">local_fire_department</span>
                  <span className="text-xs font-bold">{habit.currentStreak}d</span>
                </div>
              )}
            </label>
          );
        })}
      </div>

      {/* Negative Habits / Urge Tracking */}
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-danger">shield</span>
        Breaking
      </h2>
      <div className="flex flex-col gap-3">
        {negativeHabits.length === 0 && (
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark text-center py-6">No negative habits being tracked.</p>
        )}
        {negativeHabits.map((habit) => {
          const log = habitLogs.find((l) => l.habitId === habit.id);
          return (
            <div
              key={habit.id}
              className="p-4 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold">{habit.name}</p>
                  {habit.currentStreak > 0 && (
                    <p className="text-xs text-success font-bold">{habit.currentStreak} clean days</p>
                  )}
                </div>
                {log && (
                  <Badge variant={log.status === "resisted" ? "success" : log.status === "no-urge" ? "default" : "danger"}>
                    {log.status === "resisted" ? "Resisted" : log.status === "no-urge" ? "No Urge" : "Relapsed"}
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant={log?.status === "relapsed" ? "danger" : "ghost"}
                  size="sm"
                  className="flex-1"
                  onClick={() => logNegativeStatus(habit.id, "relapsed")}
                >
                  Relapsed
                </Button>
                <Button
                  variant={log?.status === "resisted" ? "primary" : "ghost"}
                  size="sm"
                  className="flex-1"
                  onClick={() => logNegativeStatus(habit.id, "resisted")}
                >
                  Resisted
                </Button>
                <Button
                  variant={log?.status === "no-urge" ? "secondary" : "ghost"}
                  size="sm"
                  className="flex-1"
                  onClick={() => logNegativeStatus(habit.id, "no-urge")}
                >
                  No Urge
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Habit Modal */}
      {showModal && <HabitModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

function HabitModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<HabitType>("positive");
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "custom">("daily");
  const [weight, setWeight] = useState(1);
  const [goalId, setGoalId] = useState("");
  const goals = useActiveGoals();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const now = new Date().toISOString();
    await db.habits.add({
      id: uuid(),
      name: name || "New Habit",
      description: description || null,
      type,
      frequency,
      frequencyDays: null,
      weight,
      isActive: true,
      currentStreak: 0,
      longestStreak: 0,
      goalId: goalId || null,
      createdAt: now,
      updatedAt: now,
      syncedAt: null,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 w-full max-w-sm shadow-xl border border-border-light dark:border-border-dark"
      >
        <h2 className="text-lg font-bold mb-4">Add Habit</h2>
        <label className="block mb-3">
          <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Name</span>
          <input
            className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Morning meditation"
          />
        </label>
        <label className="block mb-3">
          <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Description</span>
          <input
            className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional details"
          />
        </label>
        <div className="mb-3">
          <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-2 block">Type</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType("positive")}
              className={cn(
                "flex-1 py-2 rounded-lg text-sm font-bold cursor-pointer transition-all",
                type === "positive" ? "bg-success/10 text-success border border-success/30" : "bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark"
              )}
            >
              Building
            </button>
            <button
              type="button"
              onClick={() => setType("negative")}
              className={cn(
                "flex-1 py-2 rounded-lg text-sm font-bold cursor-pointer transition-all",
                type === "negative" ? "bg-danger/10 text-danger border border-danger/30" : "bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark"
              )}
            >
              Breaking
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <label>
            <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Frequency</span>
            <select className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm" value={frequency} onChange={(e) => setFrequency(e.target.value as typeof frequency)}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="custom">Custom</option>
            </select>
          </label>
          <label>
            <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Weight (1-5)</span>
            <input
              type="number"
              min={1}
              max={5}
              className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={weight}
              onChange={(e) => setWeight(Math.min(5, Math.max(1, parseInt(e.target.value) || 1)))}
            />
          </label>
        </div>
        {goals.length > 0 && (
          <label className="block mb-4">
            <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Link to Goal</span>
            <select className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm" value={goalId} onChange={(e) => setGoalId(e.target.value)}>
              <option value="">None</option>
              {goals.map((g) => (
                <option key={g.id} value={g.id}>{g.title}</option>
              ))}
            </select>
          </label>
        )}
        <div className="flex gap-3">
          <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" className="flex-1">Add</Button>
        </div>
      </form>
    </div>
  );
}
