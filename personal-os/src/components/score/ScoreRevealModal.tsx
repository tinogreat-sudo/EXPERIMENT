"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { DailyScore, ScoreBand } from "@/types";

const BAND_CONFIG: Record<ScoreBand, { label: string; color: string; emoji: string; message: string }> = {
  strong: { label: "Strong", color: "text-success", emoji: "🔥", message: "Incredible day! You're operating at peak performance." },
  solid: { label: "Solid", color: "text-primary", emoji: "💪", message: "Great job. Consistent effort leads to great results." },
  mixed: { label: "Mixed", color: "text-warning", emoji: "🤔", message: "Some wins, some misses. Tomorrow is a fresh start." },
  weak: { label: "Weak", color: "text-danger", emoji: "😤", message: "Tough day. Identify one thing to change and move forward." },
  "off-track": { label: "Off Track", color: "text-text-muted-light dark:text-text-muted-dark", emoji: "💤", message: "Everyone has off days. What matters is getting back on track." },
};

interface ScoreRevealModalProps {
  score: DailyScore;
  onClose: () => void;
}

export function ScoreRevealModal({ score, onClose }: ScoreRevealModalProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const band = BAND_CONFIG[score.scoreBand];

  // Pre-compute confetti particle positions to avoid impure calls during render
  const confettiParticles = useMemo(
    () =>
      Array.from({ length: 20 }).map((_, i) => ({
        left: `${(((i * 37 + 13) % 100))}%`,
        top: `${(((i * 23 + 7) % 40))}%`,
        backgroundColor: ["#ec5b13", "#10b981", "#f59e0b", "#3b82f6", "#8b5cf6"][i % 5],
        animationDelay: `${(i * 0.1) % 2}s`,
        animationDuration: `${1 + (i * 0.13) % 2}s`,
        opacity: 0.8,
      })),
    []
  );

  // Animate score counting up
  useEffect(() => {
    const target = score.computedScore;
    const duration = 1500;
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * target));

      if (progress >= 1) {
        clearInterval(interval);
        setRevealed(true);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [score.computedScore]);

  // Confetti for strong scores
  const showConfetti = score.scoreBand === "strong" && revealed;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface-light dark:bg-surface-dark rounded-3xl p-8 w-full max-w-lg shadow-2xl border border-border-light dark:border-border-dark relative overflow-hidden"
      >
        {/* Confetti particles */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {confettiParticles.map((particle, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-sm animate-bounce"
                style={particle}
              />
            ))}
          </div>
        )}

        {/* Score Display */}
        <div className="text-center mb-8 relative z-10">
          <span className="text-5xl mb-4 block">{band.emoji}</span>
          <div className="relative inline-block">
            <span className={cn("text-7xl font-black tabular-nums", band.color)}>
              {displayScore}
            </span>
            <span className="text-2xl font-bold text-text-muted-light dark:text-text-muted-dark ml-1">/100</span>
          </div>
          {revealed && (
            <div className="mt-3 animate-[fadeIn_0.5s_ease-out]">
              <span className={cn("text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full", band.color,
                score.scoreBand === "strong" ? "bg-success/10" :
                score.scoreBand === "solid" ? "bg-primary/10" :
                score.scoreBand === "mixed" ? "bg-warning/10" :
                score.scoreBand === "weak" ? "bg-danger/10" : "bg-slate-100 dark:bg-slate-800"
              )}>
                {band.label}
              </span>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-3 max-w-sm mx-auto">
                {band.message}
              </p>
            </div>
          )}
        </div>

        {/* Consistency streak */}
        {revealed && score.consistencyStreak > 0 && (
          <div className="flex items-center justify-center gap-2 mb-6 py-3 bg-primary/5 rounded-xl">
            <span className="material-symbols-outlined text-primary filled">local_fire_department</span>
            <span className="text-sm font-bold">{score.consistencyStreak} day streak</span>
            {score.consistencyMultiplier > 1 && (
              <span className="text-xs bg-primary/15 text-primary px-2 py-0.5 rounded-full font-bold">
                {score.consistencyMultiplier}x
              </span>
            )}
          </div>
        )}

        {/* Score Breakdown */}
        {revealed && (
          <div className="space-y-4">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-between py-2 text-sm font-medium cursor-pointer"
            >
              <span>Score Breakdown</span>
              <span className="material-symbols-outlined text-sm">{showDetails ? "expand_less" : "expand_more"}</span>
            </button>
            {showDetails && (
              <div className="grid grid-cols-2 gap-3 text-sm">
                <ScoreRow label="Schedule" value={score.scheduleAdherence} max={25} />
                <ScoreRow label="Focus" value={score.focusScore} max={20} />
                <ScoreRow label="Goals" value={score.goalAlignmentScore} max={20} />
                <ScoreRow label="Habits" value={score.habitScore} max={15} />
                <ScoreRow label="Skills" value={score.skillScore} max={10} />
                <ScoreRow label="Reflection" value={score.reflectionScore} max={10} />
                {score.distractionPenalty > 0 && (
                  <div className="col-span-2 text-danger text-xs">
                    Distraction penalty: −{score.distractionPenalty}
                  </div>
                )}
                {score.untrackedPenalty > 0 && (
                  <div className="col-span-2 text-warning text-xs">
                    Untracked time penalty: −{score.untrackedPenalty}
                  </div>
                )}
              </div>
            )}

            {/* AI Verdict */}
            {score.aiVerdict && (
              <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">AI Verdict</p>
                <p className="text-sm">{score.aiVerdict}</p>
                {score.aiTomorrowActions && score.aiTomorrowActions.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark mb-1">Tomorrow&apos;s Actions</p>
                    <ul className="space-y-1">
                      {score.aiTomorrowActions.map((a, i) => (
                        <li key={i} className="text-xs flex gap-2">
                          <span className="text-primary">→</span> {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Close */}
        {revealed && (
          <div className="mt-6 text-center">
            <Button variant="primary" className="px-8" onClick={onClose}>
              Done
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function ScoreRow({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span>{label}</span>
        <span className="font-bold">{value.toFixed(1)}/{max}</span>
      </div>
      <div className="h-1.5 rounded-full bg-border-light dark:bg-surface-dark-raised overflow-hidden">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
