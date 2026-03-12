import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "primary";
  className?: string;
}

const variantStyles: Record<string, string> = {
  default: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
  primary: "bg-primary-light text-primary",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
