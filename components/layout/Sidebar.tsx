"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  BarChartHorizontalBig,
  LayoutDashboard,
  Settings,
  Timer,
  X,
  Zap,
} from "lucide-react";
import { cx } from "@/lib/utils";
import { usePomodoro } from "@/lib/pomodoro-context";
import { formatClock } from "@/lib/utils";
import { useTheme } from "@/lib/theme-context";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Tasks", icon: BarChartHorizontalBig },
  { href: "/focus", label: "Focus Timer", icon: Timer },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { running, mode, secondsLeft } = usePomodoro();
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 pb-6 pt-7">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-violet-400 shadow-glow">
          <Zap className="h-5 w-5 text-white" fill="currentColor" />
        </div>
        <div>
          <div className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            FocusFlow
          </div>
          <div className="text-[11px] font-medium uppercase tracking-widest text-violet-500">
            AI Productivity
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cx(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "text-violet-700 dark:text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-navy-800/70 dark:hover:text-white"
              )}
            >
              {active && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-xl bg-violet-500/10 ring-1 ring-violet-500/25 dark:bg-violet-500/15"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <Icon
                className={cx(
                  "relative h-5 w-5 shrink-0",
                  active ? "text-violet-500" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200"
                )}
              />
              <span className="relative">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Mini timer status */}
      <div className="px-4 pb-4">
        <Link
          href="/focus"
          onClick={onNavigate}
          className="block rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 transition-colors hover:bg-violet-500/10 dark:border-violet-500/25"
        >
          <div className="flex items-center justify-between text-xs font-medium text-violet-600 dark:text-violet-300">
            <span>{running ? "Focus in progress" : "Focus timer"}</span>
            <span
              className={cx(
                "h-2 w-2 rounded-full",
                running ? "animate-pulse-soft bg-emerald-500" : "bg-slate-400"
              )}
            />
          </div>
          <div className="mt-1 font-mono text-2xl font-semibold tabular-nums text-slate-900 dark:text-white">
            {formatClock(secondsLeft)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            {mode === "focus" ? "25 min focus session" : "Break time"}
          </div>
        </Link>
      </div>

      {/* Theme toggle */}
      <div className="border-t border-slate-200 px-4 py-4 dark:border-navy-800">
        <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="btn-ghost w-full justify-between"
        >
          <span>{theme === "dark" ? "Dark mode" : "Light mode"}</span>
          <span
            className={cx(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
              mounted && theme === "dark" ? "bg-violet-600" : "bg-slate-300"
            )}
          >
            <span
              className={cx(
                "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
                mounted && theme === "dark" ? "translate-x-6" : "translate-x-1"
              )}
            />
          </span>
        </button>
      </div>
    </div>
  );
}

export function Sidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-navy-800/80 dark:bg-navy-900/80 lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-200 bg-white dark:border-navy-800 dark:bg-navy-900 lg:hidden"
            >
              <button
                onClick={onClose}
                aria-label="Close navigation"
                className="absolute right-3 top-4 rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-navy-800"
              >
                <X className="h-5 w-5" />
              </button>
              <SidebarContent onNavigate={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
