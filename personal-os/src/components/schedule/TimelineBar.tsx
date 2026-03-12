"use client";

import { cn } from "@/lib/utils";
import { useMemo, useEffect, useState } from "react";

interface TimelineSegment {
  label: string;
  color: string;
  widthPercent: number;
}

interface TimelineBarProps {
  segments: TimelineSegment[];
  className?: string;
}

export function TimelineBar({ segments, className }: TimelineBarProps) {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    function update() {
      setCurrentTime(
        new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
      );
    }
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  const totalWidth = useMemo(() => segments.reduce((s, seg) => s + seg.widthPercent, 0), [segments]);
  const remainingWidth = Math.max(0, 100 - totalWidth);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">schedule</span>
          Today&apos;s Timeline
        </h3>
        <span className="text-xs text-text-muted-light dark:text-text-muted-dark">{currentTime}</span>
      </div>

      {/* Timeline bar */}
      <div className="h-10 w-full flex rounded-xl overflow-hidden mb-4">
        {segments.map((seg, i) => (
          <div
            key={i}
            className="h-full flex items-center justify-center text-[10px] text-white font-bold"
            style={{ width: `${seg.widthPercent}%`, backgroundColor: seg.color }}
            title={seg.label}
          >
            {seg.widthPercent > 8 ? seg.label : ""}
          </div>
        ))}
        {remainingWidth > 0 && (
          <div
            className="h-full bg-slate-100 dark:bg-slate-800 border-l-2 border-primary border-dashed relative"
            style={{ width: `${remainingWidth}%` }}
          >
            <div className="absolute -top-6 left-0 text-[10px] text-primary font-bold">CURRENT</div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-text-secondary-light dark:text-text-secondary-dark">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="size-2 rounded-full" style={{ backgroundColor: seg.color }} />
            {seg.label}
          </div>
        ))}
      </div>
    </div>
  );
}
