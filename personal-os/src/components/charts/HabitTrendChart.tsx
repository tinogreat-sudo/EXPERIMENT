"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface HabitData {
  date: string;
  rate: number;
}

export function HabitTrendChart({ data }: { data: HabitData[] }) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-text-muted-light dark:text-text-muted-dark text-sm">
        No habit data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data.map((d) => ({ ...d, date: d.date.slice(5) }))} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} unit="%" />
        <Tooltip
          contentStyle={{ background: "#2a1f1b", border: "1px solid rgba(236,91,19,0.1)", borderRadius: 8, fontSize: 12 }}
          formatter={(value: number) => [`${value}%`, "Completion"]}
        />
        <Bar dataKey="rate" fill="#10b981" radius={[3, 3, 0, 0]} maxBarSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
}
