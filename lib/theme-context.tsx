"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useLocalStorage<Theme>("ff:theme", "dark");
  const [mounted, setMounted] = useState(false);

  // Apply the class whenever theme changes (and on first hydrate)
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => setMounted(true), []);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, [setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
