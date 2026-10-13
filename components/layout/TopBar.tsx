"use client";

import { Moon, Menu, Sun, Sparkles } from "lucide-react";
import { useTheme } from "@/lib/theme-context";

export function TopBar({ onMenu }: { onMenu: () => void }) {
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/70 backdrop-blur-xl dark:border-navy-800/70 dark:bg-navy-950/70">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenu}
            aria-label="Open navigation"
            className="btn-ghost -ml-1 p-2 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-600 dark:text-violet-300 sm:flex">
            <Sparkles className="h-3.5 w-3.5" />
            Pro workspace
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="btn-ghost p-2.5"
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-500 text-sm font-semibold text-white">
              A
            </div>
            <div className="hidden text-sm sm:block">
              <div className="font-semibold leading-tight text-slate-900 dark:text-white">
                Alex
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Free plan
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
