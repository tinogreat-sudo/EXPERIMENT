"use client";

import { useState } from "react";
import { Card } from "@/components/ui";
import { CategoryPieChart, ScoreTrendChart, HabitTrendChart, EnergyPatternChart, SleepScoreChart, UrgeFrequencyChart } from "@/components/charts";
import { useSessionsByCategory, useHabitTrends, useEnergyPatterns, useSleepVsScore, useUrgeFrequency, useSkills } from "@/hooks/useLiveData";
import { useScoreTrend, useTodayScore, useTodayDailyScore } from "@/hooks/useScore";
import { formatTime } from "@/lib/utils";

type DateRange = "today" | "week" | "month";

export default function AnalyticsPage() {
  const [range, setRange] = useState<DateRange>("week");
  const categoryData = useSessionsByCategory();
  const scoreTrend = useScoreTrend(range === "today" ? 1 : range === "week" ? 7 : 30);
  const todayScore = useTodayScore();
  const dailyScore = useTodayDailyScore();
  const habitTrends = useHabitTrends(range === "week" ? 7 : 14);
  const energyPatterns = useEnergyPatterns();
  const sleepVsScore = useSleepVsScore();
  const urgeFrequency = useUrgeFrequency();
  const skills = useSkills();

  const totalTracked = Object.values(categoryData).reduce((a, b) => a + b, 0);

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Performance Analytics</h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm">
            Insights and trends from your tracked data
          </p>
        </div>
        <div className="flex gap-1 bg-surface-light dark:bg-surface-dark rounded-lg p-1 border border-border-light dark:border-border-dark">
          {(["today", "week", "month"] as DateRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                range === r
                  ? "bg-primary/15 text-primary"
                  : "text-text-muted-light dark:text-text-muted-dark hover:text-text-primary-light dark:hover:text-text-primary-dark"
              }`}
            >
              {r === "today" ? "Today" : r === "week" ? "7 Days" : "30 Days"}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6">
        {/* Where Did My Day Go — 8 cols */}
        <Card className="md:col-span-8 p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">pie_chart</span>
              Where Did My Day Go
            </h2>
            {totalTracked > 0 && (
              <span className="text-xs text-text-muted-light dark:text-text-muted-dark">
                {formatTime(totalTracked)} tracked
              </span>
            )}
          </div>
          <CategoryPieChart data={categoryData} />
        </Card>

        {/* Smart Insights — 4 cols */}
        <Card className="md:col-span-4 p-4 lg:p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <h2 className="font-bold flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary">auto_awesome</span>
            Smart Insights
          </h2>
          {dailyScore?.aiVerdict ? (
            <div className="space-y-3 text-sm">
              <p>{dailyScore.aiVerdict}</p>
              {dailyScore.aiPositives && dailyScore.aiPositives.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-success mb-1">Positives</p>
                  <ul className="space-y-1">
                    {dailyScore.aiPositives.map((p, i) => (
                      <li key={i} className="flex gap-2 text-xs">
                        <span className="text-success">+</span> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {dailyScore.aiNegatives && dailyScore.aiNegatives.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-danger mb-1">Improve</p>
                  <ul className="space-y-1">
                    {dailyScore.aiNegatives.map((n, i) => (
                      <li key={i} className="flex gap-2 text-xs">
                        <span className="text-danger">−</span> {n}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : todayScore ? (
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-black">{todayScore.rawScore}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-primary/10 text-primary">
                  {todayScore.scoreBand}
                </span>
              </div>
              <div className="text-xs space-y-1 text-text-secondary-light dark:text-text-secondary-dark">
                <p>Schedule: {todayScore.scheduleAdherence.toFixed(1)}/25</p>
                <p>Focus: {todayScore.focusScore.toFixed(1)}/20</p>
                <p>Goals: {todayScore.goalAlignmentScore.toFixed(1)}/20</p>
                <p>Habits: {todayScore.habitScore.toFixed(1)}/15</p>
                <p>Skills: {todayScore.skillScore.toFixed(1)}/10</p>
                <p>Reflection: {todayScore.reflectionScore}/10</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
              Start tracking your day to generate insights. Complete sessions, check habits, and finish your End My Day ceremony.
            </p>
          )}
        </Card>

        {/* Score Trend — 7 cols */}
        <Card className="md:col-span-7 p-4 lg:p-6">
          <h2 className="font-bold flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary">monitoring</span>
            Daily Score Trend
          </h2>
          <ScoreTrendChart scores={scoreTrend} />
        </Card>

        {/* Correlations — 5 cols */}
        <Card className="md:col-span-5 p-4 lg:p-6">
          <h2 className="font-bold flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary">bedtime</span>
            Sleep vs Score
          </h2>
          <SleepScoreChart data={sleepVsScore} />
        </Card>

        {/* Habit Trends — 8 cols */}
        <Card className="md:col-span-8 p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">checklist</span>
              Habit Completion Trends
            </h2>
          </div>
          <HabitTrendChart data={habitTrends} />
        </Card>

        {/* Skill Progression — 4 cols */}
        <Card className="md:col-span-4 p-4 lg:p-6">
          <h2 className="font-bold flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary">military_tech</span>
            Skill Progression
          </h2>
          {skills.length > 0 ? (
            <div className="space-y-3">
              {skills.map((skill) => {
                const pct = skill.targetHours ? Math.min(100, Math.round((skill.loggedHours / skill.targetHours) * 100)) : 0;
                return (
                  <div key={skill.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{skill.name}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{skill.level}</span>
                    </div>
                    <div className="h-2 rounded-full bg-border-light dark:bg-surface-dark-raised overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-text-muted-light dark:text-text-muted-dark mt-0.5">
                      {skill.loggedHours.toFixed(1)}h{skill.targetHours ? ` / ${skill.targetHours}h` : ""}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
              Add skills to track your learning progress
            </p>
          )}
        </Card>

        {/* Energy Patterns — 6 cols */}
        <Card className="md:col-span-6 p-4 lg:p-6">
          <h2 className="font-bold flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary">bolt</span>
            Energy &amp; Focus by Hour
          </h2>
          <EnergyPatternChart data={energyPatterns} />
        </Card>

        {/* Urge Frequency — 6 cols */}
        <Card className="md:col-span-6 p-4 lg:p-6">
          <h2 className="font-bold flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary">shield</span>
            Urge Frequency by Day
          </h2>
          <UrgeFrequencyChart data={urgeFrequency} />
        </Card>
      </div>
    </div>
  );
}
