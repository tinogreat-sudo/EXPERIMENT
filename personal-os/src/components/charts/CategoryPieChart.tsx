"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  "Deep Work": "#ec5b13",
  "Learning": "#f59e0b",
  "Exercise": "#10b981",
  "Admin": "#6366f1",
  "Social": "#8b5cf6",
  "Leisure": "#06b6d4",
  "Distraction": "#ef4444",
  "Commute": "#78716c",
  "Meals": "#84cc16",
  "Rest": "#6366f1",
};

export function CategoryPieChart({ data }: { data: Record<string, number> }) {
  const chartData: CategoryData[] = Object.entries(data).map(([name, value]) => ({
    name,
    value,
    color: CATEGORY_COLORS[name] || "#94a3b8",
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[250px] text-text-muted-light dark:text-text-muted-dark text-sm">
        No tracked sessions yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={90}
          paddingAngle={2}
          dataKey="value"
          label={({ name, value }) => `${name}: ${value}m`}
          labelLine={false}
        >
          {chartData.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => `${value} min`}
          contentStyle={{ background: "#2a1f1b", border: "1px solid rgba(236,91,19,0.1)", borderRadius: 8, fontSize: 12 }}
        />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
