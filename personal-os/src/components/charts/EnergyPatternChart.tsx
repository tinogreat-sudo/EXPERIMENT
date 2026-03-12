"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

interface EnergyData {
  hour: number;
  energy: number;
  focus: number;
  count: number;
}

export function EnergyPatternChart({ data }: { data: EnergyData[] }) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-text-muted-light dark:text-text-muted-dark text-sm">
        Rate your energy and focus during sessions to see patterns
      </div>
    );
  }

  const chartData = data.map((d) => ({
    hour: `${d.hour}:00`,
    Energy: d.energy,
    Focus: d.focus,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
        <YAxis domain={[0, 5]} tick={{ fontSize: 10 }} />
        <Tooltip
          contentStyle={{ background: "#2a1f1b", border: "1px solid rgba(236,91,19,0.1)", borderRadius: 8, fontSize: 12 }}
        />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
        <Bar dataKey="Energy" fill="#f59e0b" radius={[3, 3, 0, 0]} maxBarSize={15} />
        <Bar dataKey="Focus" fill="#3b82f6" radius={[3, 3, 0, 0]} maxBarSize={15} />
      </BarChart>
    </ResponsiveContainer>
  );
}
