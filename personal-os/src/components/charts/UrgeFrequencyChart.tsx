"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface UrgeData {
  day: string;
  count: number;
}

export function UrgeFrequencyChart({ data }: { data: UrgeData[] }) {
  if (data.every((d) => d.count === 0)) {
    return (
      <div className="flex items-center justify-center h-[200px] text-text-muted-light dark:text-text-muted-dark text-sm">
        No urge events recorded
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis dataKey="day" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
        <Tooltip
          contentStyle={{ background: "#2a1f1b", border: "1px solid rgba(236,91,19,0.1)", borderRadius: 8, fontSize: 12 }}
          formatter={(value: number) => [`${value}`, "Urges"]}
        />
        <Bar dataKey="count" fill="#ef4444" radius={[3, 3, 0, 0]} maxBarSize={30} />
      </BarChart>
    </ResponsiveContainer>
  );
}
