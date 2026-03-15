"use client";

import { useState } from "react";
import { v4 as uuid } from "uuid";
import { db } from "@/lib/db";
import { Button, Card } from "@/components/ui";
import { minutesToHours } from "@/lib/utils";
import { useTheme } from "@/components/layout/ThemeProvider";
import { useUserSettings } from "@/hooks/useLiveData";
import type { UserSettings, DayType } from "@/types";

const DAY_TYPES: { value: DayType; label: string }[] = [
  { value: "work", label: "Work Day" },
  { value: "school", label: "School Day" },
  { value: "weekend", label: "Weekend" },
  { value: "recovery", label: "Recovery Day" },
  { value: "travel", label: "Travel Day" },
  { value: "custom", label: "Custom" },
];

export default function SettingsPage() {
  const settings = useUserSettings();

  if (settings === undefined) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <span className="material-symbols-outlined text-2xl text-text-muted-light dark:text-text-muted-dark animate-spin">progress_activity</span>
      </div>
    );
  }

  return <SettingsForm key={settings?.id ?? "new"} settings={settings ?? null} />;
}

function SettingsForm({ settings }: { settings: UserSettings | null }) {
  const { setTheme: setAppTheme } = useTheme();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form state initialized from settings
  const [displayName, setDisplayName] = useState(settings?.displayName ?? "User");
  const [deepWorkTarget, setDeepWorkTarget] = useState(settings?.deepWorkTarget ?? 180);
  const [skillBuildingTarget, setSkillBuildingTarget] = useState(settings?.skillBuildingTarget ?? 60);
  const [goalWorkTarget, setGoalWorkTarget] = useState(settings?.goalWorkTarget ?? 180);
  const [scoreThreshold, setScoreThreshold] = useState(settings?.scoreThreshold ?? 70);
  const [defaultDayType, setDefaultDayType] = useState<DayType>(settings?.defaultDayType ?? "work");
  const [pomodoroWork, setPomodoroWork] = useState(settings?.pomodoroWorkMinutes ?? 25);
  const [pomodoroBreak, setPomodoroBreak] = useState(settings?.pomodoroBreakMinutes ?? 5);
  const [pomodoroLongBreak, setPomodoroLongBreak] = useState(settings?.pomodoroLongBreak ?? 15);
  const [pomodoroSessionsBeforeLong, setPomodoroSessionsBeforeLong] = useState(settings?.pomodoroSessionsBeforeLong ?? 4);
  const [theme, setTheme] = useState<"dark" | "light" | "system">(settings?.theme ?? "dark");
  const [calendarDensity, setCalendarDensity] = useState<"compact" | "comfortable" | "spacious">(settings?.calendarDensity ?? "comfortable");
  const [calendarColorSet, setCalendarColorSet] = useState<"category" | "status" | "high-contrast">(settings?.calendarColorSet ?? "category");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const now = new Date().toISOString();

    const updated: UserSettings = {
      id: settings?.id ?? uuid(),
      displayName,
      deepWorkTarget,
      skillBuildingTarget,
      goalWorkTarget,
      scoreThreshold,
      defaultDayType,
      pomodoroWorkMinutes: pomodoroWork,
      pomodoroBreakMinutes: pomodoroBreak,
      pomodoroLongBreak,
      pomodoroSessionsBeforeLong,
      theme,
      calendarDensity,
      calendarColorSet,
      calibrationComplete: settings?.calibrationComplete ?? false,
      calibrationStartDate: settings?.calibrationStartDate ?? null,
      createdAt: settings?.createdAt ?? now,
      updatedAt: now,
      syncedAt: null,
    };

    await db.userSettings.put(updated);

    // Apply and persist theme via shared provider
    setAppTheme(theme);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function resetCalibration() {
    if (!settings) return;
    if (!confirm("Reset the calibration period? The 7-day learning period will restart.")) return;
    await db.userSettings.update(settings.id, {
      calibrationComplete: false,
      calibrationStartDate: null,
      updatedAt: new Date().toISOString(),
    });
  }

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">settings</span>
          Settings
        </h1>
        <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm mt-1">
          Customize your Personal OS experience and scoring targets.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile */}
        <Card>
          <h2 className="text-sm font-bold uppercase tracking-widest text-text-muted-light dark:text-text-muted-dark mb-4">Profile</h2>
          <label className="block">
            <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Display Name</span>
            <input
              className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
            />
          </label>
        </Card>

        {/* Scoring Targets */}
        <Card>
          <h2 className="text-sm font-bold uppercase tracking-widest text-text-muted-light dark:text-text-muted-dark mb-4">
            Daily Scoring Targets
          </h2>
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-4">
            These targets determine how your daily score is calculated. Higher targets mean you need to do more to get a high score.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label>
              <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">
                Deep Work Target (min)
              </span>
              <input
                type="number"
                min={0}
                max={600}
                step={15}
                className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={deepWorkTarget}
                onChange={(e) => setDeepWorkTarget(parseInt(e.target.value) || 0)}
              />
              <p className="text-[10px] text-text-muted-light dark:text-text-muted-dark mt-1">Currently {minutesToHours(deepWorkTarget)}/day</p>
            </label>

            <label>
              <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">
                Skill Building Target (min)
              </span>
              <input
                type="number"
                min={0}
                max={480}
                step={15}
                className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={skillBuildingTarget}
                onChange={(e) => setSkillBuildingTarget(parseInt(e.target.value) || 0)}
              />
              <p className="text-[10px] text-text-muted-light dark:text-text-muted-dark mt-1">Currently {minutesToHours(skillBuildingTarget)}/day</p>
            </label>

            <label>
              <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">
                Goal-Linked Work Target (min)
              </span>
              <input
                type="number"
                min={0}
                max={600}
                step={15}
                className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={goalWorkTarget}
                onChange={(e) => setGoalWorkTarget(parseInt(e.target.value) || 0)}
              />
              <p className="text-[10px] text-text-muted-light dark:text-text-muted-dark mt-1">Currently {minutesToHours(goalWorkTarget)}/day</p>
            </label>

            <label>
              <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">
                Consistency Score Threshold
              </span>
              <input
                type="number"
                min={50}
                max={95}
                step={5}
                className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={scoreThreshold}
                onChange={(e) => setScoreThreshold(parseInt(e.target.value) || 70)}
              />
              <p className="text-[10px] text-text-muted-light dark:text-text-muted-dark mt-1">Days ≥{scoreThreshold} count toward your streak</p>
            </label>
          </div>
        </Card>

        {/* Default Day Type */}
        <Card>
          <h2 className="text-sm font-bold uppercase tracking-widest text-text-muted-light dark:text-text-muted-dark mb-4">Day Defaults</h2>
          <label className="block">
            <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Default Day Type</span>
            <select
              className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm"
              value={defaultDayType}
              onChange={(e) => setDefaultDayType(e.target.value as DayType)}
            >
              {DAY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <p className="text-[10px] text-text-muted-light dark:text-text-muted-dark mt-1">Used when creating a new day plan without selecting a template</p>
          </label>
        </Card>

        {/* Pomodoro Settings */}
        <Card>
          <h2 className="text-sm font-bold uppercase tracking-widest text-text-muted-light dark:text-text-muted-dark mb-4">
            Pomodoro / Focus Timer
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <label>
              <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Work (min)</span>
              <input
                type="number"
                min={5}
                max={120}
                step={5}
                className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={pomodoroWork}
                onChange={(e) => setPomodoroWork(parseInt(e.target.value) || 25)}
              />
            </label>
            <label>
              <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Short Break</span>
              <input
                type="number"
                min={1}
                max={30}
                step={1}
                className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={pomodoroBreak}
                onChange={(e) => setPomodoroBreak(parseInt(e.target.value) || 5)}
              />
            </label>
            <label>
              <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Long Break</span>
              <input
                type="number"
                min={5}
                max={60}
                step={5}
                className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={pomodoroLongBreak}
                onChange={(e) => setPomodoroLongBreak(parseInt(e.target.value) || 15)}
              />
            </label>
            <label>
              <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Sessions → Long</span>
              <input
                type="number"
                min={2}
                max={8}
                step={1}
                className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={pomodoroSessionsBeforeLong}
                onChange={(e) => setPomodoroSessionsBeforeLong(parseInt(e.target.value) || 4)}
              />
            </label>
          </div>
        </Card>

        {/* Theme */}
        <Card>
          <h2 className="text-sm font-bold uppercase tracking-widest text-text-muted-light dark:text-text-muted-dark mb-4">Appearance</h2>
          <div className="space-y-4">
            <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-2 block">Theme</span>
            <div className="flex gap-2">
              {(["dark", "light", "system"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTheme(t)}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold capitalize cursor-pointer transition-all border ${
                    theme === t
                      ? "bg-primary/10 text-primary border-primary/30"
                      : "border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:border-primary/20"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm block mx-auto mb-1">
                    {t === "dark" ? "dark_mode" : t === "light" ? "light_mode" : "contrast"}
                  </span>
                  {t}
                </button>
              ))}
            </div>

            <div>
              <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Calendar Density</span>
              <select
                className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm"
                value={calendarDensity}
                onChange={(e) => setCalendarDensity(e.target.value as "compact" | "comfortable" | "spacious")}
              >
                <option value="compact">Compact</option>
                <option value="comfortable">Comfortable</option>
                <option value="spacious">Spacious</option>
              </select>
            </div>

            <div>
              <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Calendar Color Set</span>
              <select
                className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm"
                value={calendarColorSet}
                onChange={(e) => setCalendarColorSet(e.target.value as "category" | "status" | "high-contrast")}
              >
                <option value="category">Category Colors</option>
                <option value="status">Status Colors</option>
                <option value="high-contrast">High Contrast</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Calibration */}
        {settings && (
          <Card>
            <h2 className="text-sm font-bold uppercase tracking-widest text-text-muted-light dark:text-text-muted-dark mb-4">Calibration</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Scoring Calibration Period</p>
                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">
                  {settings.calibrationComplete
                    ? "Calibration complete — full scoring is active."
                    : settings.calibrationStartDate
                      ? `Calibration in progress since ${settings.calibrationStartDate}. Penalties are reduced.`
                      : "Calibration will start when you complete your first day."}
                </p>
              </div>
              {settings.calibrationComplete && (
                <Button type="button" variant="ghost" size="sm" onClick={resetCalibration}>
                  Reset
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* Save */}
        <div className="flex items-center gap-3">
          <Button type="submit" variant="primary" size="lg" disabled={saving}>
            {saving ? (
              <>
                <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                Saving...
              </>
            ) : saved ? (
              <>
                <span className="material-symbols-outlined text-sm filled">check_circle</span>
                Saved!
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">save</span>
                Save Settings
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
