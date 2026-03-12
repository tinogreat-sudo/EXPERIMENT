import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

type CardVariant = "base" | "metric" | "featured" | "ghost";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children: ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  base: "bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:border-border-light-strong dark:hover:border-border-dark-strong",
  metric:
    "bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-[0_1px_2px_rgba(0,0,0,0.05)]",
  featured:
    "bg-primary text-white shadow-[0_8px_24px_rgba(236,91,19,0.20)]",
  ghost:
    "border-2 border-dashed border-border-light dark:border-border-dark opacity-60",
};

export function Card({ variant = "base", className, children, ...props }: CardProps) {
  return (
    <div
      className={cn("rounded-xl p-5 transition-colors duration-150", variantStyles[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
}
