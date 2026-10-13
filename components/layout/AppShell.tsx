"use client";

import { useEffect, useState } from "react";
import { TaskProvider } from "@/lib/task-context";
import { PomodoroProvider } from "@/lib/pomodoro-context";
import { ThemeProvider } from "@/lib/theme-context";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { MiniTimer } from "@/components/pomodoro/MiniTimer";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Avoid hydration mismatch: render shell after mount (all data is client-side)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 animate-pulse rounded-lg bg-violet-500" />
          <div className="text-lg font-semibold tracking-tight text-slate-500">
            FocusFlow AI
          </div>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <TaskProvider>
        <PomodoroProvider>
          <div className="flex min-h-screen">
            <Sidebar
              mobileOpen={mobileNavOpen}
              onClose={() => setMobileNavOpen(false)}
            />
            <div className="flex min-h-screen w-full flex-col lg:pl-64">
              <TopBar onMenu={() => setMobileNavOpen(true)} />
              <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
                {children}
              </main>
              <MiniTimer />
            </div>
          </div>
        </PomodoroProvider>
      </TaskProvider>
    </ThemeProvider>
  );
}
