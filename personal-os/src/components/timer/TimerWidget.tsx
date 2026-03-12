"use client";

import { cn, formatTimerDigits } from "@/lib/utils";

interface TimerWidgetProps {
  secondsRemaining: number;
  totalSeconds: number;
  taskName: string;
  isRunning: boolean;
  onPause?: () => void;
  onResume?: () => void;
  onStop?: () => void;
  className?: string;
}

export function TimerWidget({
  secondsRemaining,
  totalSeconds,
  taskName,
  isRunning,
  onPause,
  onResume,
  onStop,
  className,
}: TimerWidgetProps) {
  const { minutes, seconds } = formatTimerDigits(secondsRemaining);
  const progress = totalSeconds > 0 ? (totalSeconds - secondsRemaining) / totalSeconds : 0;
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);
  const totalMinStr = formatTimerDigits(totalSeconds).minutes;
  const totalSecStr = formatTimerDigits(totalSeconds).seconds;

  return (
    <div className={cn("bg-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col items-center text-center", className)}>
      <p className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-tighter">Current Sprint</p>
      <h3 className="text-xl font-bold mb-6">{taskName || "Ready to Focus"}</h3>

      {/* Circular timer ring */}
      <div className="relative size-48 flex items-center justify-center mb-8">
        <svg className="size-full -rotate-90">
          <circle
            className="text-slate-800"
            cx="96" cy="96" r={radius}
            fill="transparent" stroke="currentColor" strokeWidth="8"
          />
          <circle
            className="text-primary transition-[stroke-dashoffset] duration-1000 ease-linear"
            cx="96" cy="96" r={radius}
            fill="transparent" stroke="currentColor" strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-mono font-bold tabular-nums">
            {minutes}:{seconds}
          </span>
          <span className="text-xs text-slate-500 font-bold mt-1">
            OF {totalMinStr}:{totalSecStr}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 w-full">
        {isRunning ? (
          <button
            onClick={onPause}
            className="flex-1 bg-primary text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined filled">pause</span> Pause
          </button>
        ) : (
          <button
            onClick={onResume}
            className="flex-1 bg-primary text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined filled">play_arrow</span> Resume
          </button>
        )}
        <button
          onClick={onStop}
          className="size-12 bg-slate-800 text-white rounded-2xl flex items-center justify-center hover:bg-slate-700 cursor-pointer transition-colors"
        >
          <span className="material-symbols-outlined">stop</span>
        </button>
      </div>
    </div>
  );
}
