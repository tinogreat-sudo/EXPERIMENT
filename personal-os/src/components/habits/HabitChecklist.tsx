"use client";

import { cn } from "@/lib/utils";
import type { Habit, HabitLog } from "@/types";

interface HabitChecklistProps {
  habits: Habit[];
  logs: HabitLog[];
  onToggle: (habitId: string) => void;
  className?: string;
}

export function HabitChecklist({ habits, logs, onToggle, className }: HabitChecklistProps) {
  const completedCount = logs.filter((l) => l.status === "done" || l.status === "resisted" || l.status === "no-urge").length;
  const positiveHabits = habits.filter((h) => h.type === "positive");

  return (
    <div className={cn("bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold">Today&apos;s Habits</h3>
        <span className="text-xs font-bold text-primary">
          {completedCount} / {habits.length}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {positiveHabits.map((habit) => {
          const log = logs.find((l) => l.habitId === habit.id);
          const isDone = log?.status === "done";

          return (
            <label
              key={habit.id}
              className="flex items-center gap-3 p-3 rounded-xl border border-border-light dark:border-border-dark hover:bg-surface-light-hover dark:hover:bg-surface-dark-hover cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={isDone}
                onChange={() => onToggle(habit.id)}
                className="rounded text-primary focus:ring-primary size-5 cursor-pointer"
              />
              <span className={cn("text-sm font-medium", isDone && "line-through text-text-muted-light dark:text-text-muted-dark")}>
                {habit.name}
              </span>
              {isDone && (
                <span className="material-symbols-outlined ml-auto text-success text-sm">check_circle</span>
              )}
              {!isDone && habit.currentStreak > 0 && (
                <span className="text-[10px] font-bold text-text-muted-light dark:text-text-muted-dark ml-auto">
                  {habit.currentStreak}d streak
                </span>
              )}
            </label>
          );
        })}

        {habits.length === 0 && (
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark text-center py-4">
            No habits yet. Start building your first routine.
          </p>
        )}
      </div>
    </div>
  );
}
