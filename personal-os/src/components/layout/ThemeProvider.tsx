"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "dark" | "light" | "system";

interface ThemeContextValue {
  theme: Theme;
  resolved: "dark" | "light";
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  resolved: "dark",
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("pos-theme") as Theme | null) ?? "dark";
    }
    return "dark";
  });
  const [resolved, setResolved] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function resolve() {
      const r = theme === "system" ? (mediaQuery.matches ? "dark" : "light") : theme;
      setResolved(r);
      document.documentElement.classList.toggle("dark", r === "dark");
    }

    resolve();
    mediaQuery.addEventListener("change", resolve);
    return () => mediaQuery.removeEventListener("change", resolve);
  }, [theme]);

  function setTheme(t: Theme) {
    setThemeState(t);
    localStorage.setItem("pos-theme", t);
  }

  return (
    <ThemeContext.Provider value={{ theme, resolved, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
