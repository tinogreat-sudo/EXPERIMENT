"use client";

import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white shadow-[0_4px_12px_rgba(236,91,19,0.20)] hover:opacity-90 active:scale-[0.98]",
  secondary:
    "bg-primary-light text-primary border border-primary/20 hover:bg-primary/15",
  ghost:
    "bg-transparent border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:bg-surface-light-hover dark:hover:bg-surface-dark-hover",
  danger:
    "bg-danger/10 text-danger hover:bg-danger/20",
  icon:
    "bg-transparent hover:bg-primary-light text-text-secondary-light dark:text-text-secondary-dark rounded-full p-2",
};

const sizeStyles: Record<string, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-bold rounded-lg transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
        variantStyles[variant],
        variant !== "icon" && sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);

Button.displayName = "Button";
