"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import type { DailyScore } from "@/types";

const BAND_COLORS: Record<string, string> = {
  strong: "#10b981",
  solid: "#ec5b13",
  mixed: "#f59e0b",
  weak: "#ef4444",
  "off-track": "#64748b",
};

export function ScoreTrendChart({ scores }: { scores: DailyScore[] }) {
  if (scores.length === 0) {
    return (
      <div className="flex items-center justify-center h-[250px] text-text-muted-light dark:text-text-muted-dark text-sm">
        No daily scores yet — complete an End My Day ceremony to generate your first score
      </div>
    );
  }

  const data = scores.map((s) => ({
    date: s.date.slice(5), // MM-DD
    score: s.computedScore,
    band: s.scoreBand,
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
        <Tooltip
          contentStyle={{ background: "#2a1f1b", border: "1px solid rgba(236,91,19,0.1)", borderRadius: 8, fontSize: 12 }}
          formatter={(value: number) => [`${value}/100`, "Score"]}
        />
        <ReferenceLine y={70} stroke="#94a3b8" strokeDasharray="3 3" label={{ value: "70", position: "right", fontSize: 10 }} />
        <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={30}>
          {data.map((entry, i) => (
            <Cell key={i} fill={BAND_COLORS[entry.band] || "#ec5b13"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
