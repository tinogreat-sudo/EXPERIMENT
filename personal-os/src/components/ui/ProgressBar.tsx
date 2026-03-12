import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0-100
  color?: string;
  className?: string;
}

export function ProgressBar({ value, color = "bg-primary", className }: ProgressBarProps) {
  const clampedValue = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden", className)}>
      <div
        className={cn("h-full rounded-full transition-all duration-300", color)}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}

interface SegmentedBarProps {
  value: number; // 1-5
  onChange?: (value: number) => void;
  className?: string;
}

export function SegmentedBar({ value, onChange, className }: SegmentedBarProps) {
  return (
    <div className={cn("flex gap-1", className)}>
      {[1, 2, 3, 4, 5].map((level) => (
        <button
          key={level}
          type="button"
          onClick={() => onChange?.(level)}
          className={cn(
            "h-2 flex-1 rounded-full transition-colors duration-150",
            level <= value ? "bg-primary" : "bg-slate-200 dark:bg-slate-700",
            onChange && "cursor-pointer hover:opacity-80"
          )}
          aria-label={`Level ${level}`}
        />
      ))}
    </div>
  );
}
