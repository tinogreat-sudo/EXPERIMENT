"use client";

import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface SleepScoreData {
  date: string;
  sleep: number;
  score: number;
}

export function SleepScoreChart({ data }: { data: SleepScoreData[] }) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-text-muted-light dark:text-text-muted-dark text-sm">
        Log sleep + generate scores to see correlations
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <ScatterChart margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis dataKey="sleep" type="number" name="Sleep" unit="h" domain={[0, 12]} tick={{ fontSize: 10 }} />
        <YAxis dataKey="score" type="number" name="Score" domain={[0, 100]} tick={{ fontSize: 10 }} />
        <Tooltip
          contentStyle={{ background: "#2a1f1b", border: "1px solid rgba(236,91,19,0.1)", borderRadius: 8, fontSize: 12 }}
          formatter={(value: number, name: string) => [name === "Sleep" ? `${value}h` : `${value}/100`, name]}
        />
        <Scatter data={data} fill="#6366f1" />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
