"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Flame,
  ListTodo,
  Plus,
  Target,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { DonutChart } from "@/components/charts/DonutChart";
import { BarChart } from "@/components/charts/BarChart";
import { TaskItem } from "@/components/tasks/TaskItem";
import { useTasks } from "@/lib/task-context";
import { usePomodoro } from "@/lib/pomodoro-context";
import {
  cx,
  dayKey,
  formatClock,
  focusMinutesByDay,
  lastNDays,
  tasksCompletedPerDay,
  todayKey,
} from "@/lib/utils";

function greeting(): string {
  const h = new Date().getHours();
  if (h < 5) return "Burning the midnight oil";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const { tasks, addTask, toggleComplete, deleteTask } = useTasks();
  const { todayFocusSeconds, todaySessions, sessions } = usePomodoro();
  const [quickTitle, setQuickTitle] = useState("");

  const total = tasks.length;
  const done = tasks.filter((t) => t.completed).length;
  const rate = total > 0 ? Math.round((done / total) * 100) : 0;
  const dueToday = tasks.filter(
    (t) => t.dueDate === todayKey() && !t.completed
  ).length;

  const weekLabels = lastNDays(7).map((d) => d.label);
  const focusWeek = focusMinutesByDay(sessions, 7);
  const completedWeek = tasksCompletedPerDay(tasks, 7);

  const prioritySlices = [
    { id: "high", color: "#f43f5e" },
    { id: "medium", color: "#f59e0b" },
    { id: "low", color: "#10b981" },
  ].map((p) => ({
    label: p.id.charAt(0).toUpperCase() + p.id.slice(1),
    value: tasks.filter((t) => t.priority === p.id).length,
    color: p.color,
  }));

  const upcoming = tasks
    .filter((t) => !t.completed)
    .filter((t) => !t.dueDate || t.dueDate <= todayKey())
    .slice(0, 4);

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    addTask({ title: quickTitle, category: "General" });
    setQuickTitle("");
  };

  return (
    <>
      <PageHeader
        title={`${greeting()}, Alex 👋`}
        subtitle={`You have ${dueToday} task${dueToday === 1 ? "" : "s"} due today and ${todaySessions} focus session${todaySessions === 1 ? "" : "s"} logged.`}
        actions={
          <Link href="/focus" className="btn-primary">
            Start focus
          </Link>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          index={0}
          icon={ListTodo}
          accent="violet"
          label="Tasks created"
          value={String(total)}
          hint={`${dueToday} due today`}
        />
        <StatCard
          index={1}
          icon={CheckCircle2}
          accent="emerald"
          label="Completion rate"
          value={`${rate}%`}
          hint={`${done} of ${total} done`}
        />
        <StatCard
          index={2}
          icon={Clock3}
          accent="sky"
          label="Focus time today"
          value={`${Math.round(todayFocusSeconds / 60)} min`}
          hint={`${todaySessions} session${todaySessions === 1 ? "" : "s"} today`}
        />
        <StatCard
          index={3}
          icon={Flame}
          accent="rose"
          label="Focus sessions today"
          value={String(todaySessions)}
          hint="4 sessions = long break"
        />
      </div>

      {/* Charts row */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Focus minutes — this week
            </h2>
            <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[11px] font-semibold text-violet-500">
              7 days
            </span>
          </div>
          <BarChart data={focusWeek} labels={weekLabels} unit="min" />
        </section>

        <section className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Tasks completed — this week
            </h2>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-500">
              7 days
            </span>
          </div>
          <BarChart
            data={completedWeek}
            labels={weekLabels}
            color="emerald"
            unit=" tasks"
          />
        </section>
      </div>

      {/* Breakdown + quick add */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-5">
        <section className="card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <Target className="h-4 w-4 text-violet-500" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Priority breakdown
            </h2>
          </div>
          {total === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">
              Add tasks to see your breakdown.
            </p>
          ) : (
            <DonutChart
              slices={prioritySlices}
              centerLabel="tasks"
              centerValue={String(total)}
              size={160}
            />
          )}
        </section>

        <section className="card p-5 lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Up next
            </h2>
            <Link
              href="/tasks"
              className="group flex items-center gap-1 text-xs font-semibold text-violet-500 hover:text-violet-600"
            >
              All tasks
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <form onSubmit={handleQuickAdd} className="mb-4 flex gap-2">
            <input
              className="input"
              placeholder="Quick add a task…"
              value={quickTitle}
              maxLength={120}
              onChange={(e) => setQuickTitle(e.target.value)}
            />
            <button
              type="submit"
              aria-label="Add task"
              className="btn-primary shrink-0 px-3"
              disabled={!quickTitle.trim()}
            >
              <Plus className="h-4 w-4" />
            </button>
          </form>

          {upcoming.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">
              🎉 Nothing urgent left. Enjoy your free time!
            </p>
          ) : (
            <ul className="space-y-2.5">
              {upcoming.map((task, i) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  index={i}
                  onToggle={toggleComplete}
                  onDelete={deleteTask}
                  onEdit={() => {}}
                />
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
