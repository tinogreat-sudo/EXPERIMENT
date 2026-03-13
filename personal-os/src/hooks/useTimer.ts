"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { db } from "@/lib/db";
import { getTodayDateString } from "@/lib/utils";
import type { TimeSession, FocusSession } from "@/types";

export type TimerState = "idle" | "running" | "paused" | "completed";
export type TimerMode = "pomodoro" | "deepwork" | "custom";

interface TimerConfig {
  mode: TimerMode;
  workMinutes: number;
  breakMinutes: number;
  longBreakMinutes: number;
  sessionsBeforeLong: number;
}

const DEFAULT_CONFIGS: Record<TimerMode, TimerConfig> = {
  pomodoro: { mode: "pomodoro", workMinutes: 25, breakMinutes: 5, longBreakMinutes: 15, sessionsBeforeLong: 4 },
  deepwork: { mode: "deepwork", workMinutes: 50, breakMinutes: 10, longBreakMinutes: 15, sessionsBeforeLong: 4 },
  custom: { mode: "custom", workMinutes: 30, breakMinutes: 5, longBreakMinutes: 15, sessionsBeforeLong: 4 },
};

// Persist timer state to localStorage so it survives navigation
const STORAGE_KEY = "personal-os-timer";

interface PersistedTimer {
  state: TimerState;
  mode: TimerMode;
  intervalType: "work" | "short-break" | "long-break";
  secondsRemaining: number;
  completedIntervals: number;
  sessionTitle: string;
  categoryId: string;
  skillId: string | null;
  goalId: string | null;
  sessionStartedAt: string | null;
  timeSessionId: string | null;
  intervalStartedAt: string | null;
  lastTickAt: string;
}

function loadPersisted(): PersistedTimer | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedTimer;
  } catch {
    return null;
  }
}

function savePersisted(data: PersistedTimer | null) {
  if (typeof window === "undefined") return;
  if (!data) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

interface UseTimerReturn {
  state: TimerState;
  secondsRemaining: number;
  totalSeconds: number;
  config: TimerConfig;
  intervalType: "work" | "short-break" | "long-break";
  completedIntervals: number;
  sessionTitle: string;
  categoryId: string;
  skillId: string | null;
  goalId: string | null;
  pendingRating: boolean;
  sessionNotes: string;
  setMode: (mode: TimerMode) => void;
  setSessionTitle: (title: string) => void;
  setCategoryId: (id: string) => void;
  setSkillId: (id: string | null) => void;
  setGoalId: (id: string | null) => void;
  setSessionNotes: (notes: string) => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  requestStop: () => void;
  confirmStop: (energy: number | null, focus: number | null) => Promise<void>;
  cancelStop: () => void;
  skip: () => void;
  reset: () => void;
}

export function useTimer(): UseTimerReturn {
  // Restore persisted state on mount (read once via lazy initializers)
  const [initialPersisted] = useState(loadPersisted);
  const didRestore = useRef(false);

  const [state, setState] = useState<TimerState>(() => {
    const p = initialPersisted;
    if (p && (p.state === "running" || p.state === "paused")) return p.state;
    return "idle";
  });
  const [config, setConfig] = useState<TimerConfig>(() => {
    const p = initialPersisted;
    if (p) return DEFAULT_CONFIGS[p.mode];
    return DEFAULT_CONFIGS.pomodoro;
  });
  const [intervalType, setIntervalType] = useState<"work" | "short-break" | "long-break">(() => {
    return initialPersisted?.intervalType ?? "work";
  });
  const [secondsRemaining, setSecondsRemaining] = useState(() => {
    const p = initialPersisted;
    if (p && (p.state === "running" || p.state === "paused")) {
      // Account for elapsed time while navigated away
      if (p.state === "running") {
        const elapsed = Math.floor((Date.now() - new Date(p.lastTickAt).getTime()) / 1000);
        return Math.max(0, p.secondsRemaining - elapsed);
      }
      return p.secondsRemaining;
    }
    return DEFAULT_CONFIGS.pomodoro.workMinutes * 60;
  });
  const [completedIntervals, setCompletedIntervals] = useState(() => initialPersisted?.completedIntervals ?? 0);
  const [sessionTitle, setSessionTitle] = useState(() => initialPersisted?.sessionTitle ?? "");
  const [categoryId, setCategoryId] = useState(() => initialPersisted?.categoryId ?? "");
  const [skillId, setSkillId] = useState<string | null>(() => initialPersisted?.skillId ?? null);
  const [goalId, setGoalId] = useState<string | null>(() => initialPersisted?.goalId ?? null);
  const [pendingRating, setPendingRating] = useState(false);
  const [sessionNotes, setSessionNotes] = useState("");

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionStartRef = useRef<string | null>(initialPersisted?.sessionStartedAt ?? null);
  const timeSessionIdRef = useRef<string | null>(initialPersisted?.timeSessionId ?? null);
  const intervalStartRef = useRef<string | null>(initialPersisted?.intervalStartedAt ?? null);

  const totalSeconds =
    intervalType === "work"
      ? config.workMinutes * 60
      : intervalType === "long-break"
        ? config.longBreakMinutes * 60
        : config.breakMinutes * 60;

  // Persist state changes (ref reads happen inside the effect, not during render)
  useEffect(() => {
    if (state === "idle") {
      savePersisted(null);
    } else {
      savePersisted({
        state,
        mode: config.mode,
        intervalType,
        secondsRemaining,
        completedIntervals,
        sessionTitle,
        categoryId,
        skillId,
        goalId,
        sessionStartedAt: sessionStartRef.current,
        timeSessionId: timeSessionIdRef.current,
        intervalStartedAt: intervalStartRef.current,
        lastTickAt: new Date().toISOString(),
      });
    }
  }, [state, config.mode, intervalType, secondsRemaining, completedIntervals, sessionTitle, categoryId, skillId, goalId]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startCountdown = useCallback(() => {
    clearTimer();
    intervalRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearTimer();
          setState("completed");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearTimer]);

  // Auto-resume running timer on mount
  useEffect(() => {
    if (!didRestore.current && initialPersisted?.state === "running" && secondsRemaining > 0) {
      didRestore.current = true;
      startCountdown();
    } else {
      didRestore.current = true;
    }
  }, [startCountdown, secondsRemaining, initialPersisted]);

  // Record a FocusSession for the completed interval
  const recordFocusInterval = useCallback(async (type: "work" | "short-break" | "long-break", wasCompleted: boolean) => {
    if (!timeSessionIdRef.current || !intervalStartRef.current) return;
    const now = new Date().toISOString();
    const startMs = new Date(intervalStartRef.current).getTime();
    const endMs = new Date(now).getTime();
    const durationMinutes = Math.max(1, Math.round((endMs - startMs) / 60000));

    const focusSession: FocusSession = {
      id: uuid(),
      timeSessionId: timeSessionIdRef.current,
      intervalType: type,
      durationMinutes,
      completedAt: wasCompleted ? now : null,
      wasCompleted,
      createdAt: now,
      syncedAt: null,
    };
    await db.focusSessions.add(focusSession);
  }, []);

  const setMode = useCallback((mode: TimerMode) => {
    if (state !== "idle") return;
    const newConfig = DEFAULT_CONFIGS[mode];
    setConfig(newConfig);
    setSecondsRemaining(newConfig.workMinutes * 60);
    setIntervalType("work");
    setCompletedIntervals(0);
  }, [state]);

  const start = useCallback(() => {
    const now = new Date().toISOString();
    sessionStartRef.current = now;
    timeSessionIdRef.current = uuid();
    intervalStartRef.current = now;
    setState("running");
    startCountdown();
  }, [startCountdown]);

  const pause = useCallback(() => {
    clearTimer();
    setState("paused");
  }, [clearTimer]);

  const resume = useCallback(() => {
    setState("running");
    startCountdown();
  }, [startCountdown]);

  const requestStop = useCallback(() => {
    clearTimer();
    setPendingRating(true);
  }, [clearTimer]);

  const cancelStop = useCallback(() => {
    setPendingRating(false);
    setState("paused");
  }, []);

  const confirmStop = useCallback(async (energy: number | null, focus: number | null) => {
    // Record the final focus interval
    await recordFocusInterval(intervalType, false);

    if (sessionStartRef.current && timeSessionIdRef.current) {
      const now = new Date().toISOString();
      const startTime = new Date(sessionStartRef.current).getTime();
      const endTime = new Date(now).getTime();
      const durationMinutes = Math.round((endTime - startTime) / 60000);

      const today = getTodayDateString();
      let dayPlan = await db.dayPlans.where("date").equals(today).first();

      if (!dayPlan) {
        const planId = uuid();
        dayPlan = {
          id: planId,
          date: today,
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
          status: "active",
          createdAt: now,
          updatedAt: now,
          syncedAt: null,
        };
        await db.dayPlans.add(dayPlan);
      }

      const session: TimeSession = {
        id: timeSessionIdRef.current,
        dayPlanId: dayPlan.id,
        timeBlockId: null,
        title: sessionTitle || "Untitled Session",
        categoryId,
        startedAt: sessionStartRef.current,
        endedAt: now,
        durationMinutes: Math.max(1, durationMinutes),
        isManualEntry: false,
        energyLevel: energy,
        focusLevel: focus,
        notes: sessionNotes || null,
        goalId: goalId,
        skillId: skillId,
        isDistraction: false,
        distractionCategory: null,
        createdAt: now,
        updatedAt: now,
        syncedAt: null,
      };
      await db.timeSessions.add(session);
    }
    setPendingRating(false);
    setState("idle");
    setSecondsRemaining(config.workMinutes * 60);
    setIntervalType("work");
    setCompletedIntervals(0);
    setSessionNotes("");
    setSkillId(null);
    setGoalId(null);
    sessionStartRef.current = null;
    timeSessionIdRef.current = null;
    intervalStartRef.current = null;
    savePersisted(null);
  }, [sessionTitle, categoryId, skillId, goalId, sessionNotes, config.workMinutes, intervalType, recordFocusInterval]);

  const skip = useCallback(async () => {
    clearTimer();
    // Record completed interval
    await recordFocusInterval(intervalType, true);

    const now = new Date().toISOString();
    intervalStartRef.current = now;

    if (intervalType === "work") {
      const newCount = completedIntervals + 1;
      setCompletedIntervals(newCount);
      if (newCount > 0 && newCount % config.sessionsBeforeLong === 0) {
        setIntervalType("long-break");
        setSecondsRemaining(config.longBreakMinutes * 60);
      } else {
        setIntervalType("short-break");
        setSecondsRemaining(config.breakMinutes * 60);
      }
    } else {
      setIntervalType("work");
      setSecondsRemaining(config.workMinutes * 60);
    }
    setState("running");
    startCountdown();
  }, [clearTimer, intervalType, completedIntervals, config, startCountdown, recordFocusInterval]);

  const reset = useCallback(() => {
    clearTimer();
    setState("idle");
    setSecondsRemaining(config.workMinutes * 60);
    setIntervalType("work");
    setCompletedIntervals(0);
    setSessionNotes("");
    sessionStartRef.current = null;
    timeSessionIdRef.current = null;
    intervalStartRef.current = null;
    savePersisted(null);
  }, [clearTimer, config.workMinutes]);

  // Handle interval completion — auto skip via setTimeout to avoid setState-in-effect
  useEffect(() => {
    if (state === "completed") {
      const timeoutId = setTimeout(() => skip(), 0);
      return () => clearTimeout(timeoutId);
    }
  }, [state, skip]);

  // Cleanup on unmount
  useEffect(() => () => clearTimer(), [clearTimer]);

  return {
    state,
    secondsRemaining,
    totalSeconds,
    config,
    intervalType,
    completedIntervals,
    sessionTitle,
    categoryId,
    skillId,
    goalId,
    pendingRating,
    sessionNotes,
    setMode,
    setSessionTitle,
    setCategoryId,
    setSkillId,
    setGoalId,
    setSessionNotes,
    start,
    pause,
    resume,
    requestStop,
    confirmStop,
    cancelStop,
    skip,
    reset,
  };
}
