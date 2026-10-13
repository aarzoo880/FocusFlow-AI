"use client";

import { useMemo } from "react";
import { CheckCircle2, Flame, Timer, Zap } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { ProgressRing, TimerControls } from "@/components/pomodoro/TimerControls";
import { usePomodoro, TIMER_CONFIG, LONG_BREAK_INTERVAL } from "@/lib/pomodoro-context";
import { useTasks } from "@/lib/task-context";
import { cx, formatClock } from "@/lib/utils";
import type { TimerMode } from "@/lib/types";

const MODE_TABS: Array<{ id: TimerMode; label: string }> = [
  { id: "focus", label: "Focus" },
  { id: "shortBreak", label: "Short Break" },
  { id: "longBreak", label: "Long Break" },
];

const MODE_COLORS: Record<TimerMode, string> = {
  focus: "#8b5cf6",
  shortBreak: "#10b981",
  longBreak: "#0ea5e9",
};

export default function FocusPage() {
  const {
    mode,
    secondsLeft,
    running,
    sessions,
    cycleCount,
    linkedTaskId,
    activeTask,
    setMode,
    toggleRunning,
    reset,
    skip,
    setLinkedTaskId,
    todayFocusSeconds,
    totalFocusSeconds,
    todaySessions,
  } = usePomodoro();

  const { tasks } = useTasks();
  const activeTasks = useMemo(
    () => tasks.filter((t) => !t.completed),
    [tasks]
  );

  const total = TIMER_CONFIG[mode].seconds;
  const progress = secondsLeft / total;
  const nextMode =
    mode === "focus"
      ? (cycleCount + 1) % LONG_BREAK_INTERVAL === 0
        ? "long break"
        : "short break"
      : "focus session";
  const thisWeekSessions = sessions.filter(
    (s) => s.type === "focus" && Date.now() - s.startedAt < 7 * 86_400_000
  ).length;

  return (
    <>
      <PageHeader
        title="Focus Timer"
        subtitle="Work in deliberate sprints with the Pomodoro technique."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          index={0}
          icon={Zap}
          accent="violet"
          label="Sessions today"
          value={String(todaySessions)}
          hint={`${thisWeekSessions} this week`}
        />
        <StatCard
          index={1}
          icon={Timer}
          accent="sky"
          label="Focus time today"
          value={`${Math.round(todayFocusSeconds / 60)} min`}
          hint={`${Math.round(totalFocusSeconds / 3600)}h lifetime`}
        />
        <StatCard
          index={2}
          icon={Flame}
          accent="amber"
          label="Current cycle"
          value={`${cycleCount % LONG_BREAK_INTERVAL}/${LONG_BREAK_INTERVAL}`}
          hint={`Next: ${nextMode}`}
        />
      </div>

      {/* Timer card */}
      <section className="card mt-6 flex flex-col items-center px-6 py-10">
        {/* Mode tabs */}
        <div className="mb-8 flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-navy-800">
          {MODE_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id)}
              className={cx(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all sm:px-4 sm:text-sm",
                mode === tab.id
                  ? "bg-white text-slate-900 shadow dark:bg-navy-900 dark:text-white"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <ProgressRing progress={progress} color={MODE_COLORS[mode]} size={248}>
          <div className="text-center">
            <div className="font-mono text-5xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-white">
              {formatClock(secondsLeft)}
            </div>
            <div
              className={cx(
                "mt-1 text-xs font-semibold uppercase tracking-widest",
                mode === "focus"
                  ? "text-violet-500"
                  : mode === "shortBreak"
                    ? "text-emerald-500"
                    : "text-sky-500"
              )}
            >
              {running ? TIMER_CONFIG[mode].label : `${TIMER_CONFIG[mode].label} — paused`}
            </div>
          </div>
        </ProgressRing>

        <div className="mt-8">
          <TimerControls
            running={running}
            onToggle={toggleRunning}
            onReset={reset}
            onSkip={skip}
          />
        </div>

        <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
          {mode === "focus"
            ? `Finishing this session counts toward ${activeTask ? "“" + activeTask.title + "”" : "your focus streak"}.`
            : "Break time — step away from the screen for a bit."}
        </p>
      </section>

      {/* Linked task */}
      <section className="card mt-6 p-5">
        <div className="mb-3 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-violet-500" />
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            What are you focusing on?
          </h2>
        </div>
        <select
          aria-label="Link a task to this session"
          className="input cursor-pointer"
          value={linkedTaskId ?? ""}
          onChange={(e) => setLinkedTaskId(e.target.value || null)}
        >
          <option value="">— No linked task —</option>
          {activeTasks.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>
        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
          Completed focus sessions automatically add a 🍅 pomodoro to the linked
          task.
        </p>
      </section>
    </>
  );
}
