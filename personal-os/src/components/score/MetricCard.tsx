import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: ReactNode;
  suffix?: string;
  trend?: { value: string; positive: boolean };
  trailing?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function MetricCard({ label, value, suffix, trend, trailing, children, className }: MetricCardProps) {
  return (
    <div className={cn(
      "bg-surface-light dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-border-light dark:border-border-dark",
      className
    )}>
      <p className="text-xs font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-widest mb-2">
        {label}
      </p>
      <div className="flex items-end justify-between">
        <div className="flex items-end gap-2">
          <span className="text-4xl font-bold">{value}</span>
          {suffix && <span className="text-text-muted-light dark:text-text-muted-dark mb-1 text-sm">{suffix}</span>}
        </div>
        {trend && (
          <span className={cn(
            "text-xs font-bold flex items-center gap-0.5 mb-1",
            trend.positive ? "text-success" : "text-danger"
          )}>
            <span className="material-symbols-outlined text-sm">
              {trend.positive ? "trending_up" : "trending_down"}
            </span>
            {trend.value}
          </span>
        )}
        {trailing}
      </div>
      {children}
    </div>
  );
}
