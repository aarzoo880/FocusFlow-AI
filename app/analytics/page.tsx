"use client";

import { BarChart3, CheckCircle2, Clock3, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { LineChart } from "@/components/charts/LineChart";
import { BarChart } from "@/components/charts/BarChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { useTasks } from "@/lib/task-context";
import { usePomodoro } from "@/lib/pomodoro-context";
import {
  completionRateLastDays,
  focusMinutesByDay,
  lastNDays,
  tasksCompletedPerDay,
  tasksCreatedPerDay,
} from "@/lib/utils";

export default function AnalyticsPage() {
  const { tasks } = useTasks();
  const { sessions, totalFocusSeconds } = usePomodoro();

  const labels7 = lastNDays(14).map((d) => d.label);
  const labels14 = lastNDays(14).map(
    (d) => d.label
  );

  const focusDaily = focusMinutesByDay(sessions, 14);
  const createdDaily = tasksCreatedPerDay(tasks, 14);
  const completedDaily = tasksCompletedPerDay(tasks, 14);

  // Best focus day this week (last 14 days)
  const bestIdx = focusDaily.reduce(
    (best, v, i) => (v > focusDaily[best] ? i : best),
    0
  );
  const totalThisWeek = focusDaily
    .slice(focusDaily.length - 7)
    .reduce((a, b) => a + b, 0);
  const prevWeek = focusDaily.slice(0, 7).reduce((a, b) => a + b, 0);
  const delta =
    prevWeek > 0
      ? Math.round(((totalThisWeek - prevWeek) / prevWeek) * 100)
      : null;

  const doneTotal = tasks.filter((t) => t.completed).length;
  const rate = completionRateLastDays(tasks, 7);

  const categorySlices = Object.entries(
    tasks.reduce<Record<string, number>>((acc, t) => {
      const key = t.completed ? "Completed" : "Active";
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {})
  ).map(([label, value], i) => ({
    label,
    value,
    color: i === 0 ? "#10b981" : "#8b5cf6",
  }));

  const hourBuckets = ["Morning (6-12)", "Afternoon (12-18)", "Evening (18-24)", "Night (0-6)"];
  const hourMeta = [
    { color: "#8b5cf6", label: hourBuckets[0] },
    { color: "#0ea5e9", label: hourBuckets[1] },
    { color: "#f59e0b", label: hourBuckets[2] },
    { color: "#64748b", label: hourBuckets[3] },
  ];
  const hourCounts = sessions
    .filter((s) => s.type === "focus")
    .map((s) => s.startedAt)
    .map((ts) => {
      const h = new Date(ts).getHours();
      if (h >= 6 && h < 12) return 0;
      if (h >= 12 && h < 18) return 1;
      if (h >= 18 && h < 24) return 2;
      return 3;
    });
  const hourSlices = hourMeta.map((m, i) => ({
    label: m.label,
    value: hourCounts.filter((c) => c === i).length,
    color: m.color,
  })).filter((s) => s.value > 0);

  return (
    <>
      <PageHeader
        title="Analytics"
        subtitle="Understand your productivity patterns over the last two weeks."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          index={0}
          icon={Clock3}
          accent="violet"
          label="Focus time (lifetime)"
          value={`${Math.round(totalFocusSeconds / 3600)}h ${Math.round((totalFocusSeconds % 3600) / 60)}m`}
          hint={`${sessions.filter((s) => s.type === "focus").length} sessions`}
        />
        <StatCard
          index={1}
          icon={CheckCircle2}
          accent="emerald"
          label="7-day completion"
          value={`${rate}%`}
          hint={`${doneTotal} tasks completed all-time`}
        />
        <StatCard
          index={2}
          icon={TrendingUp}
          accent="sky"
          label="Focus vs last week"
          value={delta === null ? "—" : `${delta >= 0 ? "+" : ""}${delta}%`}
          hint={
            delta === null
              ? "No prior data"
              : focusDaily[bestIdx] > 0
                ? `Best day: ${lastNDays(14)[bestIdx].key}`
                : "No focus logged yet"
          }
        />
        <StatCard
          index={3}
          icon={BarChart3}
          accent="amber"
          label="Sessions this week"
          value={String(sessions.filter((s) => s.type === "focus" && Date.now() - s.startedAt < 7 * 86_400_000).length)}
          hint={`${Math.round(totalThisWeek)} focus minutes`}
        />
      </div>

      {/* Focus trend */}
      <section className="card mt-6 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Focus trend
            </h2>
            <p className="text-xs text-slate-400">Minutes of deep work per day</p>
          </div>
          <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[11px] font-semibold text-violet-500">
            14 days
          </span>
        </div>
        <LineChart data={focusDaily} labels={labels14} unit=" min" />
      </section>

      {/* Created vs completed */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="card p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Tasks created
            </h2>
            <p className="text-xs text-slate-400">New tasks per day</p>
          </div>
          <BarChart data={createdDaily} labels={labels7.map((l, i) => (i >= 7 ? l : ""))} unit="" />
        </section>
        <section className="card p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Tasks completed
            </h2>
            <p className="text-xs text-slate-400">Finished tasks per day</p>
          </div>
          <BarChart
            data={completedDaily}
            labels={labels7.map((l, i) => (i >= 7 ? l : ""))}
            color="emerald"
            unit=" tasks"
          />
        </section>
      </div>

      {/* Status + time of day donuts */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="card p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Task status
            </h2>
            <p className="text-xs text-slate-400">Active vs completed</p>
          </div>
          {tasks.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">
              No data yet — add some tasks first.
            </p>
          ) : (
            <DonutChart
              slices={categorySlices}
              centerLabel="tasks"
              centerValue={String(tasks.length)}
              size={160}
            />
          )}
        </section>

        <section className="card p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Focus time of day
            </h2>
            <p className="text-xs text-slate-400">When you do your best work</p>
          </div>
          {hourSlices.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">
              Complete a focus session to unlock this chart.
            </p>
          ) : (
            <DonutChart
              slices={hourSlices}
              centerLabel="sessions"
              centerValue={String(hourCounts.length)}
              size={160}
            />
          )}
        </section>
      </div>
    </>
  );
}
