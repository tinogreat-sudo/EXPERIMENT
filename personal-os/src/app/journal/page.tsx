"use client";

import { useState, useMemo } from "react";
import { v4 as uuid } from "uuid";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { getTodayDateString, getFormattedDate, cn } from "@/lib/utils";
import { Button, Badge } from "@/components/ui";
import type { JournalEntry } from "@/types";

const MOOD_LABELS = ["", "Terrible", "Bad", "Okay", "Good", "Great"];
const MOOD_ICONS = ["", "sentiment_very_dissatisfied", "sentiment_dissatisfied", "sentiment_neutral", "sentiment_satisfied", "sentiment_very_satisfied"];

export default function JournalPage() {
  const today = getTodayDateString();
  const entries = useLiveQuery(() => db.journalEntries.orderBy("date").reverse().toArray()) ?? [];
  const todayEntry = useMemo(() => entries.find((e) => e.date === today), [entries, today]);
  const [mode, setMode] = useState<"write" | "history">(todayEntry ? "write" : "write");

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Journal</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setMode("write")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-bold cursor-pointer transition-all",
              mode === "write" ? "bg-primary text-white" : "bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark"
            )}
          >
            Write
          </button>
          <button
            onClick={() => setMode("history")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-bold cursor-pointer transition-all",
              mode === "history" ? "bg-primary text-white" : "bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark"
            )}
          >
            History
          </button>
        </div>
      </div>

      {mode === "write" ? (
        <JournalEditor entry={todayEntry ?? null} date={today} />
      ) : (
        <JournalHistory entries={entries} />
      )}
    </div>
  );
}

function JournalEditor({ entry, date }: { entry: JournalEntry | null; date: string }) {
  const [content, setContent] = useState(entry?.content ?? "");
  const [wentWell, setWentWell] = useState(entry?.wentWell ?? "");
  const [wentWrong, setWentWrong] = useState(entry?.wentWrong ?? "");
  const [improve, setImprove] = useState(entry?.improveTomorrow ?? "");
  const [mood, setMood] = useState(entry?.mood ?? 0);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const now = new Date().toISOString();

    let dayPlan = await db.dayPlans.where("date").equals(date).first();
    if (!dayPlan) {
      const planId = uuid();
      dayPlan = {
        id: planId, date, dayType: "work", templateId: null, intention: null,
        sleepHours: null, sleepQuality: null, bedtime: null, wakeTime: null,
        morningEnergy: null, overallEnergy: null, overallFocus: null,
        startedAt: null, endedAt: null, status: "active",
        createdAt: now, updatedAt: now, syncedAt: null,
      };
      await db.dayPlans.add(dayPlan);
    }

    if (entry) {
      await db.journalEntries.update(entry.id, {
        content, wentWell: wentWell || null, wentWrong: wentWrong || null,
        improveTomorrow: improve || null, mood: mood || null, updatedAt: now,
      });
    } else {
      await db.journalEntries.add({
        id: uuid(), dayPlanId: dayPlan.id, date, content,
        wentWell: wentWell || null, wentWrong: wentWrong || null,
        improveTomorrow: improve || null, mood: mood || null,
        createdAt: now, updatedAt: now, syncedAt: null,
      });
    }
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Badge variant="primary" className="mb-2">{getFormattedDate()}</Badge>
      </div>

      {/* Mood selector */}
      <div>
        <p className="text-xs font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-widest mb-3">How are you feeling?</p>
        <div className="flex gap-2 justify-center">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              onClick={() => setMood(level)}
              className={cn(
                "flex flex-col items-center gap-1 p-3 rounded-xl transition-all cursor-pointer",
                mood === level ? "bg-primary/10 ring-2 ring-primary" : "bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:border-primary/30"
              )}
            >
              <span className="material-symbols-outlined text-2xl" style={{ color: mood === level ? "#ec5b13" : undefined }}>
                {MOOD_ICONS[level]}
              </span>
              <span className="text-[10px] font-bold">{MOOD_LABELS[level]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Prompts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-success/5 border border-success/20 rounded-xl p-4">
          <p className="text-xs font-bold text-success uppercase mb-2">What went well?</p>
          <textarea
            className="w-full bg-transparent border-none resize-none text-sm focus:outline-none"
            rows={3}
            placeholder="Wins, progress, good moments..."
            value={wentWell}
            onChange={(e) => setWentWell(e.target.value)}
          />
        </div>
        <div className="bg-danger/5 border border-danger/20 rounded-xl p-4">
          <p className="text-xs font-bold text-danger uppercase mb-2">What went wrong?</p>
          <textarea
            className="w-full bg-transparent border-none resize-none text-sm focus:outline-none"
            rows={3}
            placeholder="Challenges, mistakes, setbacks..."
            value={wentWrong}
            onChange={(e) => setWentWrong(e.target.value)}
          />
        </div>
        <div className="bg-info/5 border border-info/20 rounded-xl p-4">
          <p className="text-xs font-bold text-info uppercase mb-2">Improve tomorrow?</p>
          <textarea
            className="w-full bg-transparent border-none resize-none text-sm focus:outline-none"
            rows={3}
            placeholder="What to do differently..."
            value={improve}
            onChange={(e) => setImprove(e.target.value)}
          />
        </div>
      </div>

      {/* Free write */}
      <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6">
        <p className="text-xs font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-widest mb-3">Free write</p>
        <textarea
          className="w-full bg-transparent border-none resize-none text-sm focus:outline-none min-h-[200px]"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <Button variant="primary" size="lg" className="w-full" onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : entry ? "Update Entry" : "Save Entry"}
      </Button>
    </div>
  );
}

function JournalHistory({ entries }: { entries: JournalEntry[] }) {
  return (
    <div className="flex flex-col gap-3">
      {entries.length === 0 && (
        <div className="text-center py-12">
          <span className="material-symbols-outlined text-5xl text-text-muted-light dark:text-text-muted-dark mb-4">edit_note</span>
          <p className="text-text-muted-light dark:text-text-muted-dark">
            Today&apos;s page is blank. What&apos;s on your mind?
          </p>
        </div>
      )}
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="p-4 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold">{new Date(entry.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
            {entry.mood && (
              <span className="material-symbols-outlined text-lg" style={{ color: "#ec5b13" }}>
                {MOOD_ICONS[entry.mood]}
              </span>
            )}
          </div>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark line-clamp-2">
            {entry.content || entry.wentWell || "No content"}
          </p>
        </div>
      ))}
    </div>
  );
}
