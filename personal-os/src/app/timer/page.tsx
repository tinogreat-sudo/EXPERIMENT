"use client";

import { useState } from "react";
import { useTimer, type TimerMode } from "@/hooks/useTimer";
import { useCategories, useTodaySessions, useSkills, useActiveGoals } from "@/hooks/useLiveData";
import { formatTimerDigits, formatTime, cn } from "@/lib/utils";
import { Button } from "@/components/ui";

const MODE_OPTIONS: { mode: TimerMode; label: string; desc: string }[] = [
  { mode: "pomodoro", label: "Pomodoro", desc: "25min work / 5min break" },
  { mode: "deepwork", label: "Deep Work", desc: "50min work / 10min break" },
  { mode: "custom", label: "Custom", desc: "30min configurable" },
];

export default function TimerPage() {
  const timer = useTimer();
  const categories = useCategories();
  const sessions = useTodaySessions();
  const skills = useSkills();
  const goals = useActiveGoals();
  const { minutes, seconds } = formatTimerDigits(timer.secondsRemaining);
  const totalDigits = formatTimerDigits(timer.totalSeconds);

  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const progress = timer.totalSeconds > 0 ? (timer.totalSeconds - timer.secondsRemaining) / timer.totalSeconds : 0;
  const dashOffset = circumference * (1 - progress);

  const isIdle = timer.state === "idle";
  const isRunning = timer.state === "running";
  const isPaused = timer.state === "paused";

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Focus Session</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Timer */}
        <div className="lg:col-span-3 flex flex-col items-center">
          {/* Mode selector */}
          {isIdle && (
            <div className="flex gap-2 mb-8 w-full">
              {MODE_OPTIONS.map((opt) => (
                <button
                  key={opt.mode}
                  onClick={() => timer.setMode(opt.mode)}
                  className={cn(
                    "flex-1 p-3 rounded-xl text-center transition-all cursor-pointer",
                    timer.config.mode === opt.mode
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:border-primary/30"
                  )}
                >
                  <p className="text-sm font-bold">{opt.label}</p>
                  <p className="text-[10px] opacity-70">{opt.desc}</p>
                </button>
              ))}
            </div>
          )}

          {/* Interval type badge */}
          {!isIdle && (
            <div className="mb-4">
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-bold uppercase",
                timer.intervalType === "work" ? "bg-primary/10 text-primary" : "bg-success/10 text-success"
              )}>
                {timer.intervalType === "work" ? "Focus" : timer.intervalType === "short-break" ? "Short Break" : "Long Break"}
              </span>
            </div>
          )}

          {/* Task title input */}
          {isIdle && (
            <input
              className="w-full max-w-sm bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl px-4 py-3 text-center text-lg font-medium mb-8 focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="What are you working on?"
              value={timer.sessionTitle}
              onChange={(e) => timer.setSessionTitle(e.target.value)}
            />
          )}

          {!isIdle && timer.sessionTitle && (
            <h2 className="text-xl font-bold mb-6">{timer.sessionTitle}</h2>
          )}

          {/* Circular timer */}
          <div className="relative flex items-center justify-center mb-8" style={{ width: 240, height: 240 }}>
            <svg className="size-full -rotate-90">
              <circle
                className="text-slate-200 dark:text-slate-800"
                cx="120" cy="120" r={radius}
                fill="transparent" stroke="currentColor" strokeWidth="10"
              />
              {!isIdle && (
                <circle
                  className="text-primary transition-[stroke-dashoffset] duration-1000 ease-linear"
                  cx="120" cy="120" r={radius}
                  fill="transparent" stroke="currentColor" strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                />
              )}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-6xl font-mono font-bold tabular-nums">
                {minutes}:{seconds}
              </span>
              <span className="text-sm text-text-muted-light dark:text-text-muted-dark font-bold mt-1">
                OF {totalDigits.minutes}:{totalDigits.seconds}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-4 w-full max-w-xs">
            {isIdle && (
              <Button variant="primary" size="lg" className="flex-1 py-4 rounded-2xl" onClick={timer.start}>
                <span className="material-symbols-outlined filled">play_arrow</span>
                Start
              </Button>
            )}
            {isRunning && (
              <>
                <Button variant="primary" size="lg" className="flex-1 py-4 rounded-2xl" onClick={timer.pause}>
                  <span className="material-symbols-outlined filled">pause</span>
                  Pause
                </Button>
                <Button variant="ghost" size="lg" className="py-4 rounded-2xl" onClick={timer.requestStop}>
                  <span className="material-symbols-outlined">stop</span>
                </Button>
              </>
            )}
            {isPaused && (
              <>
                <Button variant="primary" size="lg" className="flex-1 py-4 rounded-2xl" onClick={timer.resume}>
                  <span className="material-symbols-outlined filled">play_arrow</span>
                  Resume
                </Button>
                <Button variant="ghost" size="lg" className="py-4 rounded-2xl" onClick={timer.requestStop}>
                  <span className="material-symbols-outlined">stop</span>
                </Button>
              </>
            )}
          </div>

          {/* Session count */}
          {!isIdle && (
            <p className="mt-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">
              {timer.completedIntervals} intervals completed
            </p>
          )}

          {/* Category selector */}
          {isIdle && (
            <div className="mt-8 w-full">
              <p className="text-xs font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-widest mb-3">Category</p>
              <div className="grid grid-cols-5 gap-2">
                {categories.slice(0, 10).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => timer.setCategoryId(cat.id)}
                    className={cn(
                      "flex flex-col items-center gap-1 p-3 rounded-xl transition-all cursor-pointer",
                      timer.categoryId === cat.id
                        ? "ring-2 ring-primary bg-primary/10"
                        : "bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:border-primary/30"
                    )}
                  >
                    <span className="material-symbols-outlined text-lg" style={{ color: cat.color }}>
                      {cat.icon}
                    </span>
                    <span className="text-[10px] font-bold truncate w-full text-center">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Skill & Goal selectors */}
          {isIdle && (skills.length > 0 || goals.length > 0) && (
            <div className="mt-4 w-full flex gap-4">
              {skills.length > 0 && (
                <div className="flex-1">
                  <p className="text-xs font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-widest mb-2">Skill</p>
                  <select
                    className="w-full bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    value={timer.skillId ?? ""}
                    onChange={(e) => timer.setSkillId(e.target.value || null)}
                  >
                    <option value="">None</option>
                    {skills.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              )}
              {goals.length > 0 && (
                <div className="flex-1">
                  <p className="text-xs font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-widest mb-2">Goal</p>
                  <select
                    className="w-full bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    value={timer.goalId ?? ""}
                    onChange={(e) => timer.setGoalId(e.target.value || null)}
                  >
                    <option value="">None</option>
                    {goals.map((g) => (
                      <option key={g.id} value={g.id}>{g.title}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Session notes */}
          {!isIdle && (
            <div className="mt-6 w-full max-w-sm">
              <p className="text-xs font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-widest mb-2">Session Notes</p>
              <textarea
                className="w-full bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                rows={2}
                placeholder="Optional notes for this session..."
                value={timer.sessionNotes}
                onChange={(e) => timer.setSessionNotes(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Right: Session history */}
        <div className="lg:col-span-2">
          <h3 className="font-bold mb-4">Today&apos;s Sessions</h3>
          <div className="flex flex-col gap-2">
            {sessions.length === 0 ? (
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark text-center py-8">
                No sessions yet. Start your first timer.
              </p>
            ) : (
              sessions.map((session) => {
                const cat = categories.find((c) => c.id === session.categoryId);
                return (
                  <div
                    key={session.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark"
                  >
                    <div className="size-2 rounded-full shrink-0" style={{ backgroundColor: cat?.color ?? "#94a3b8" }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{session.title}</p>
                      <p className="text-[10px] text-text-muted-light dark:text-text-muted-dark">
                        {new Date(session.startedAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                        {session.endedAt && ` – ${new Date(session.endedAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-primary">{formatTime(session.durationMinutes)}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Energy/Focus Rating Modal */}
      {timer.pendingRating && (
        <SessionRatingModal
          onConfirm={(energy, focus) => timer.confirmStop(energy, focus)}
          onCancel={timer.cancelStop}
        />
      )}
    </div>
  );
}

function SessionRatingModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: (energy: number | null, focus: number | null) => void;
  onCancel: () => void;
}) {
  const [energy, setEnergy] = useState<number>(3);
  const [focus, setFocus] = useState<number>(3);

  const LABELS = ["", "Very Low", "Low", "Medium", "High", "Very High"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onCancel}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 w-full max-w-sm shadow-xl border border-border-light dark:border-border-dark"
      >
        <h2 className="text-lg font-bold mb-1">How was that session?</h2>
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-6">Rate your energy and focus levels.</p>

        {/* Energy */}
        <div className="mb-5">
          <p className="text-xs font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-widest mb-2">Energy Level</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                onClick={() => setEnergy(level)}
                className={cn(
                  "flex-1 py-2 rounded-lg text-center transition-all cursor-pointer",
                  energy === level
                    ? "bg-warning/20 text-warning ring-2 ring-warning/40 font-bold"
                    : "bg-surface-light-hover dark:bg-surface-dark-hover text-text-muted-light dark:text-text-muted-dark"
                )}
              >
                <span className="text-lg">{level <= 2 ? "⚡" : level <= 4 ? "🔥" : "💥"}</span>
                <p className="text-[10px] mt-0.5">{LABELS[level]}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Focus */}
        <div className="mb-6">
          <p className="text-xs font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-widest mb-2">Focus Level</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                onClick={() => setFocus(level)}
                className={cn(
                  "flex-1 py-2 rounded-lg text-center transition-all cursor-pointer",
                  focus === level
                    ? "bg-primary/20 text-primary ring-2 ring-primary/40 font-bold"
                    : "bg-surface-light-hover dark:bg-surface-dark-hover text-text-muted-light dark:text-text-muted-dark"
                )}
              >
                <span className="text-lg">{level <= 2 ? "😵" : level <= 4 ? "🎯" : "🧠"}</span>
                <p className="text-[10px] mt-0.5">{LABELS[level]}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="ghost" className="flex-1" onClick={() => onConfirm(null, null)}>Skip</Button>
          <Button type="button" variant="primary" className="flex-1" onClick={() => onConfirm(energy, focus)}>Save</Button>
        </div>
      </div>
    </div>
  );
}
