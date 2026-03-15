"use client";

import { useState } from "react";
import Link from "next/link";
import { MetricCard } from "@/components/score/MetricCard";
import { ScoreRevealModal } from "@/components/score/ScoreRevealModal";
import { TimelineBar } from "@/components/schedule/TimelineBar";
import { TimerWidget } from "@/components/timer/TimerWidget";
import { HabitChecklist } from "@/components/habits/HabitChecklist";
import { useHabits, useTodayHabitLogs, useTodaySessions, useTodayPlan, useDayTemplates, useNotesDueForReview } from "@/hooks/useLiveData";
import { useTodayScore, useTodayDailyScore } from "@/hooks/useScore";
import { useTimer } from "@/hooks/useTimer";
import { Button } from "@/components/ui";
import { v4 as uuid } from "uuid";
import { db } from "@/lib/db";
import { getTodayDateString } from "@/lib/utils";
import { computeAndSaveDailyScore } from "@/lib/scoring";
import { useCallback, useMemo } from "react";
import type { DailyScore, DayTemplate, DayPlan } from "@/types";

export default function Dashboard() {
  const timer = useTimer();
  const habits = useHabits();
  const habitLogs = useTodayHabitLogs();
  const sessions = useTodaySessions();
  const todayPlan = useTodayPlan();
  const todayScore = useTodayScore();
  const dailyScore = useTodayDailyScore();
  const templates = useDayTemplates();
  const notesDue = useNotesDueForReview();
  const [showStartDay, setShowStartDay] = useState(false);
  const [showScoreReveal, setShowScoreReveal] = useState(false);
  const [revealScore, setRevealScore] = useState<DailyScore | null>(null);
  const [endingDay, setEndingDay] = useState(false);

  const dayStarted = todayPlan?.status === "active" || todayPlan?.status === "reviewing";
  const dayEnded = todayPlan?.status === "closed";

  const totalDeepWork = useMemo(
    () => sessions.filter((s) => !s.isDistraction).reduce((sum, s) => sum + s.durationMinutes, 0),
    [sessions]
  );

  const timelineSegments = useMemo(() => {
    if (sessions.length === 0) return [];
    const totalMins = sessions.reduce((s, sess) => s + sess.durationMinutes, 0);
    if (totalMins === 0) return [];
    return sessions.map((sess) => ({
      label: sess.title,
      color: sess.isDistraction ? "#ef4444" : "#ec5b13",
      widthPercent: Math.max(5, (sess.durationMinutes / (16 * 60)) * 100), // 16 waking hours
    }));
  }, [sessions]);

  const handleHabitToggle = useCallback(async (habitId: string) => {
    const today = getTodayDateString();
    const now = new Date().toISOString();
    const existing = habitLogs.find((l) => l.habitId === habitId);

    if (existing) {
      await db.habitLogs.update(existing.id, {
        status: existing.status === "done" ? "missed" : "done",
        updatedAt: now,
        syncedAt: null,
      });
    } else {
      let dayPlan = await db.dayPlans.where("date").equals(today).first();
      if (!dayPlan) {
        const planId = uuid();
        dayPlan = {
          id: planId, date: today, dayType: "work", templateId: null, intention: null,
          sleepHours: null, sleepQuality: null, bedtime: null, wakeTime: null,
          morningEnergy: null, overallEnergy: null, overallFocus: null,
          startedAt: null, endedAt: null, status: "active",
          createdAt: now, updatedAt: now, syncedAt: null,
        };
        await db.dayPlans.add(dayPlan);
      }
      await db.habitLogs.add({
        id: uuid(), habitId, dayPlanId: dayPlan.id, date: today,
        status: "done", createdAt: now, updatedAt: now, syncedAt: null,
      });
    }
  }, [habitLogs]);

  async function startMyDay(data: {
    intention: string;
    energy: number;
    sleepHours: number | null;
    sleepQuality: number | null;
    bedtime: string | null;
    wakeTime: string | null;
    templateId: string | null;
  }) {
    const today = getTodayDateString();
    const now = new Date().toISOString();
    let plan = await db.dayPlans.where("date").equals(today).first();
    if (!plan) {
      plan = {
        id: uuid(), date: today, dayType: "work", templateId: data.templateId,
        intention: data.intention,
        sleepHours: data.sleepHours, sleepQuality: data.sleepQuality,
        bedtime: data.bedtime, wakeTime: data.wakeTime,
        morningEnergy: data.energy, overallEnergy: null, overallFocus: null,
        startedAt: now, endedAt: null, status: "active",
        createdAt: now, updatedAt: now, syncedAt: null,
      };
      await db.dayPlans.add(plan);
    } else {
      await db.dayPlans.update(plan.id, {
        intention: data.intention,
        morningEnergy: data.energy,
        sleepHours: data.sleepHours,
        sleepQuality: data.sleepQuality,
        bedtime: data.bedtime,
        wakeTime: data.wakeTime,
        startedAt: now,
        status: "active",
        updatedAt: now,
        ...(data.templateId ? { templateId: data.templateId } : {}),
      });
    }

    // Load template blocks if selected
    if (data.templateId) {
      const { loadTemplateIntoPlan } = await import("@/lib/dayplan");
      await loadTemplateIntoPlan(data.templateId, today);
    }

    setShowStartDay(false);
  }

  async function endMyDay() {
    if (!todayPlan || endingDay) return;
    setEndingDay(true);
    try {
      // Close the day plan
      await db.dayPlans.update(todayPlan.id, {
        endedAt: new Date().toISOString(),
        status: "closed",
        updatedAt: new Date().toISOString(),
      });

      // Compute and save the daily score
      const savedScore = await computeAndSaveDailyScore();

      // Attempt AI scoring validation (non-blocking)
      try {
        const today = getTodayDateString();
        const blocks = await db.timeBlocks.where("dayPlanId").equals(todayPlan.id).toArray();
        const sessionsData = await db.timeSessions.where("dayPlanId").equals(todayPlan.id).toArray();
        const habitsData = await db.habits.filter((h) => h.isActive).toArray();
        const habitLogsData = await db.habitLogs.where("date").equals(today).toArray();
        const urgeEvents = await db.urgeEvents.where("dayPlanId").equals(todayPlan.id).toArray();
        const goals = await db.goals.toArray();
        const skills = await db.skills.toArray();
        const recentScores = await db.dailyScores.orderBy("date").reverse().limit(7).toArray();
        const recentJournals = await db.journalEntries.orderBy("date").reverse().limit(3).toArray();
        const settingsArr = await db.userSettings.toArray();
        const journalEntries = await db.journalEntries.where("date").equals(today).sortBy("updatedAt");
        const journalEntry = journalEntries[journalEntries.length - 1] ?? null;

        const res = await fetch("/api/ai/score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            breakdown: {
              scheduleAdherence: savedScore.scheduleAdherence,
              focusScore: savedScore.focusScore,
              goalAlignmentScore: savedScore.goalAlignmentScore,
              habitScore: savedScore.habitScore,
              skillScore: savedScore.skillScore,
              reflectionScore: savedScore.reflectionScore,
              distractionPenalty: savedScore.distractionPenalty,
              untrackedPenalty: savedScore.untrackedPenalty,
              plannedMinutes: savedScore.plannedMinutes,
              completedPlannedMin: savedScore.completedPlannedMin,
              deepWorkMinutes: savedScore.deepWorkMinutes,
              goalLinkedMinutes: savedScore.goalLinkedMinutes,
              skillBuildingMinutes: savedScore.skillBuildingMinutes,
              distractionMinutes: savedScore.distractionMinutes,
              untrackedMinutes: savedScore.untrackedMinutes,
              rawScore: savedScore.computedScore,
              scoreBand: savedScore.scoreBand,
            },
            journalEntry: journalEntry ? { content: journalEntry.content, wentWell: journalEntry.wentWell, wentWrong: journalEntry.wentWrong } : null,
            context: {
              todayPlan,
              blocks,
              sessions: sessionsData,
              habitLogs: habitLogsData,
              urgeEvents,
              habits: habitsData,
              goals,
              skills,
              recentScores,
              recentJournals,
              settings: settingsArr[0] ?? null,
            },
          }),
        });

        if (res.ok) {
          const aiData = await res.json();
          await db.dailyScores.update(savedScore.id, {
            aiScore: aiData.aiScore,
            aiScoreConfidence: aiData.confidence,
            aiVerdict: aiData.verdict,
            aiPositives: aiData.positives,
            aiNegatives: aiData.negatives,
            aiTomorrowActions: aiData.tomorrowActions,
            updatedAt: new Date().toISOString(),
          });
          // Re-read the updated score for the reveal
          const updated = await db.dailyScores.get(savedScore.id);
          if (updated) {
            setRevealScore(updated);
            setShowScoreReveal(true);
            return;
          }
        }
      } catch {
        // AI scoring failed silently — still show computed score
      }

      setRevealScore(savedScore);
      setShowScoreReveal(true);
    } finally {
      setEndingDay(false);
    }
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Active Mode</h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            {dayEnded
              ? "Day complete — great work!"
              : sessions.length > 0
                ? <>Focusing on <span className="text-primary font-medium">{sessions[sessions.length - 1]?.title}</span></>
                : "Ready to start your day"
            }
          </p>
          {todayPlan?.intention && (
            <p className="text-sm text-primary mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">flag</span>
              {todayPlan.intention}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {!dayStarted && !dayEnded && (
            <Button variant="primary" size="md" onClick={() => setShowStartDay(true)}>
              <span className="material-symbols-outlined text-lg filled">wb_sunny</span>
              Start My Day
            </Button>
          )}
          {dayStarted && !dayEnded && (
            <Button variant="ghost" size="md" onClick={endMyDay} disabled={endingDay}>
              <span className="material-symbols-outlined text-lg filled">bedtime</span>
              {endingDay ? "Computing Score..." : "End My Day"}
            </Button>
          )}
          <Button variant="danger" size="md" onClick={() => window.location.href = "/ai-coach"}>
            <span className="material-symbols-outlined text-lg">emergency</span>
            Rescue My Day
          </Button>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Metrics & Timeline */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Top Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              label="Efficiency Score"
              value={
                <span className={
                  todayScore ? (
                    todayScore.scoreBand === "strong" ? "text-success" :
                    todayScore.scoreBand === "solid" ? "text-primary" :
                    todayScore.scoreBand === "mixed" ? "text-warning" :
                    todayScore.scoreBand === "weak" ? "text-danger" : "text-text-muted-light dark:text-text-muted-dark"
                  ) : "text-primary"
                }>
                  {todayScore ? todayScore.rawScore : "—"}
                </span>
              }
              suffix="/ 100"
              trend={dailyScore ? {
                value: dailyScore.scoreBand,
                positive: dailyScore.computedScore >= 70,
              } : { value: "—", positive: true }}
            />
            <MetricCard
              label="Consistency Streak"
              value={dailyScore ? String(dailyScore.consistencyStreak) : "0"}
              suffix="Days"
              trailing={
                <div className="flex items-center gap-1 mb-1">
                  <span className="material-symbols-outlined text-sm text-primary filled">local_fire_department</span>
                  {dailyScore && dailyScore.consistencyMultiplier > 1 && (
                    <span className="text-[10px] font-bold text-primary">{dailyScore.consistencyMultiplier}x</span>
                  )}
                </div>
              }
            />
            <MetricCard
              label="Deep Work"
              value={totalDeepWork > 0 ? `${Math.round(totalDeepWork / 60 * 10) / 10}h` : "—"}
            >
              <div className="mt-2 h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-warning rounded-full transition-all"
                  style={{ width: `${Math.min(100, (totalDeepWork / 180) * 100)}%` }}
                />
              </div>
            </MetricCard>
          </div>

          {/* Timeline */}
          <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark">
            {timelineSegments.length > 0 ? (
              <TimelineBar segments={timelineSegments} />
            ) : (
              <div className="text-center py-8">
                <span className="material-symbols-outlined text-4xl text-text-muted-light dark:text-text-muted-dark mb-2">schedule</span>
                <p className="text-text-muted-light dark:text-text-muted-dark text-sm">
                  Your timeline will appear here as you track sessions.
                </p>
              </div>
            )}
          </div>

          {/* AI Coach Insight */}
          <div className="bg-gradient-to-br from-primary/10 to-transparent p-6 rounded-2xl border border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-6xl">smart_toy</span>
            </div>
            <div className="relative z-10">
              <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-2">AI Coach Insight</h3>
              <p className="text-lg font-medium leading-relaxed max-w-2xl">
                &ldquo;Start your day by planning your schedule and setting your top priorities. Use the Start My Day ceremony when ready.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Timer & Checklist */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Timer */}
          {timer.state !== "idle" ? (
            <TimerWidget
              secondsRemaining={timer.secondsRemaining}
              totalSeconds={timer.totalSeconds}
              taskName={timer.sessionTitle}
              isRunning={timer.state === "running"}
              onPause={timer.pause}
              onResume={timer.resume}
              onStop={timer.requestStop}
            />
          ) : (
            <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-5xl text-slate-600 mb-4">timer</span>
              <h3 className="text-xl font-bold mb-2">Ready to Focus?</h3>
              <p className="text-slate-400 text-sm mb-6">Start your first session</p>
              <Link
                href="/timer"
                className="w-full bg-primary text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <span className="material-symbols-outlined filled">play_arrow</span>
                Start Timer
              </Link>
            </div>
          )}

          {/* Habits */}
          <HabitChecklist habits={habits} logs={habitLogs} onToggle={handleHabitToggle} />

          {/* Second Brain — Notes due for review */}
          {notesDue.length > 0 && (
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-warning text-lg">pending_actions</span>
                  Notes to Review
                </h3>
                <Link href="/second-brain" className="text-xs text-primary font-bold hover:underline">
                  Review All
                </Link>
              </div>
              <div className="space-y-2">
                {notesDue.slice(0, 3).map((note) => (
                  <Link
                    key={note.id}
                    href="/second-brain"
                    className="flex items-start gap-2 p-2 rounded-lg hover:bg-surface-light-hover dark:hover:bg-surface-dark-hover transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm text-warning mt-0.5 shrink-0">note</span>
                    <span className="text-xs font-medium line-clamp-2 text-text-secondary-light dark:text-text-secondary-dark">{note.title}</span>
                  </Link>
                ))}
                {notesDue.length > 3 && (
                  <p className="text-xs text-text-muted-light dark:text-text-muted-dark pl-2">+{notesDue.length - 3} more due</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Start My Day Modal */}
      {showStartDay && (
        <StartDayModal
          onStart={startMyDay}
          onClose={() => setShowStartDay(false)}
          templates={templates}
          todayPlan={todayPlan ?? null}
        />
      )}

      {/* Score Reveal Modal */}
      {showScoreReveal && revealScore && (
        <ScoreRevealModal
          score={revealScore}
          onClose={() => setShowScoreReveal(false)}
        />
      )}
    </div>
  );
}

type StartData = {
  intention: string;
  energy: number;
  sleepHours: number | null;
  sleepQuality: number | null;
  bedtime: string | null;
  wakeTime: string | null;
  templateId: string | null;
};

function StartDayModal({
  onStart,
  onClose,
  templates,
  todayPlan,
}: {
  onStart: (data: StartData) => void;
  onClose: () => void;
  templates: DayTemplate[];
  todayPlan: DayPlan | null;
}) {
  const [step, setStep] = useState(1);
  const TOTAL_STEPS = 3;

  // Step 1 — Sleep
  const [sleepHours, setSleepHours] = useState<string>(todayPlan?.sleepHours ? String(todayPlan.sleepHours) : "");
  const [sleepQuality, setSleepQuality] = useState(todayPlan?.sleepQuality ?? 3);
  const [bedtime, setBedtime] = useState(todayPlan?.bedtime ?? "");
  const [wakeTime, setWakeTime] = useState(todayPlan?.wakeTime ?? "");

  // Step 2 — Template + Energy
  const [selectedTemplate, setSelectedTemplate] = useState<string>(todayPlan?.templateId ?? "");
  const [energy, setEnergy] = useState(todayPlan?.morningEnergy ?? 3);

  // Step 3 — Intention
  const [intention, setIntention] = useState(todayPlan?.intention ?? "");

  function handleFinish() {
    onStart({
      intention,
      energy,
      sleepHours: sleepHours ? parseFloat(sleepHours) : null,
      sleepQuality,
      bedtime: bedtime || null,
      wakeTime: wakeTime || null,
      templateId: selectedTemplate || null,
    });
  }

  const STEP_TITLES = ["Last Night's Sleep", "Energy & Schedule", "Today's Intention"];
  const STEP_ICONS = ["bedtime", "bolt", "wb_sunny"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 w-full max-w-md shadow-xl border border-border-light dark:border-border-dark"
      >
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i + 1 <= step ? "bg-primary w-6" : "bg-border-light dark:bg-border-dark w-3"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-text-muted-light dark:text-text-muted-dark font-bold">
            Step {step} of {TOTAL_STEPS}
          </span>
        </div>

        <div className="text-center mb-6">
          <span className="material-symbols-outlined text-4xl text-primary filled mb-2">{STEP_ICONS[step - 1]}</span>
          <h2 className="text-xl font-bold">Start Your Day</h2>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{STEP_TITLES[step - 1]}</p>
        </div>

        {/* Step 1: Sleep */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <label>
                <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Hours Slept</span>
                <input
                  type="number"
                  min={0}
                  max={24}
                  step={0.5}
                  className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(e.target.value)}
                  placeholder="e.g. 7.5"
                />
              </label>
              <label>
                <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Sleep Quality</span>
                <div className="flex gap-1 mt-1.5">
                  {[1, 2, 3, 4, 5].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setSleepQuality(q)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        sleepQuality === q
                          ? "bg-primary/20 text-primary ring-1 ring-primary/40"
                          : "bg-surface-light-hover dark:bg-surface-dark-hover text-text-muted-light dark:text-text-muted-dark"
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label>
                <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Bedtime</span>
                <input
                  type="time"
                  className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm"
                  value={bedtime}
                  onChange={(e) => setBedtime(e.target.value)}
                />
              </label>
              <label>
                <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Wake Time</span>
                <input
                  type="time"
                  className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                />
              </label>
            </div>
          </div>
        )}

        {/* Step 2: Template + Energy */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-2 block">Load Day Template</span>
              <div className="space-y-2 max-h-44 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => setSelectedTemplate("")}
                  className={`w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-all cursor-pointer ${
                    !selectedTemplate
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "border-border-light dark:border-border-dark hover:border-primary/30"
                  }`}
                >
                  <span className="font-medium">No template</span>
                  <span className="text-xs text-text-muted-light dark:text-text-muted-dark ml-2">Start with a blank schedule</span>
                </button>
                {templates.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTemplate(t.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-all cursor-pointer ${
                      selectedTemplate === t.id
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-border-light dark:border-border-dark hover:border-primary/30"
                    }`}
                  >
                    <span className="font-medium">{t.name}</span>
                    <span className="text-xs text-text-muted-light dark:text-text-muted-dark ml-2">
                      {t.blocks.length} blocks · {t.dayType}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-2 block">Morning Energy</span>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setEnergy(level)}
                    className={`flex-1 py-3 rounded-lg text-center transition-all cursor-pointer ${
                      energy === level
                        ? "bg-warning/20 text-warning ring-2 ring-warning/40 font-bold"
                        : "bg-surface-light-hover dark:bg-surface-dark-hover text-text-muted-light dark:text-text-muted-dark"
                    }`}
                  >
                    <span className="text-lg">{level <= 2 ? "😴" : level <= 4 ? "⚡" : "🔥"}</span>
                    <p className="text-[10px] mt-0.5">{level}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Intention */}
        {step === 3 && (
          <div>
            <label className="block mb-4">
              <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Today&apos;s Intention</span>
              <input
                className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                placeholder="What's your main focus today?"
                autoFocus
              />
            </label>
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
              This will be shown on your dashboard and included in your daily review.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <Button variant="ghost" className="flex-1" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          {step < TOTAL_STEPS ? (
            <Button variant="primary" className="flex-1" onClick={() => setStep(step + 1)}>
              Next
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Button>
          ) : (
            <Button variant="primary" className="flex-1 py-3" onClick={handleFinish}>
              <span className="material-symbols-outlined filled">wb_sunny</span>
              Let&apos;s Go!
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
