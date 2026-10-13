import { type Priority, type Task } from "./types";

export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

/** yyyy-mm-dd key for a timestamp, in local time. */
export function dayKey(ts: number): string {
  const d = new Date(ts);
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function todayKey(): string {
  return dayKey(Date.now());
}

/** Last N days as { key, label } pairs, oldest first. */
export function lastNDays(n: number): Array<{ key: string; label: string }> {
  const out: Array<{ key: string; label: string }> = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86_400_000);
    out.push({
      key: dayKey(d.getTime()),
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
    });
  }
  return out;
}

export function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export const PRIORITY_ORDER: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export const PRIORITY_META: Record<
  Priority,
  { label: string; badge: string; dot: string }
> = {
  high: {
    label: "High",
    badge:
      "bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-1 ring-rose-500/30",
    dot: "bg-rose-500",
  },
  medium: {
    label: "Medium",
    badge:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/30",
    dot: "bg-amber-500",
  },
  low: {
    label: "Low",
    badge:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/30",
    dot: "bg-emerald-500",
  },
};

export function isOverdue(task: Task): boolean {
  if (!task.dueDate || task.completed) return false;
  return task.dueDate < todayKey();
}

/** Completion rate across the last n days (0–100). */
export function completionRateLastDays(
  tasks: Task[],
  days: number
): number {
  const cutoff = Date.now() - days * 86_400_000;
  const relevant = tasks.filter(
    (t) => t.createdAt >= cutoff || (t.completedAt && t.completedAt >= cutoff)
  );
  if (relevant.length === 0) return 0;
  const done = relevant.filter((t) => t.completed).length;
  return Math.round((done / relevant.length) * 100);
}

/** Minutes focused per day for the last n days. */
export function focusMinutesByDay<T extends { startedAt: number; durationSeconds: number; type: string }>(
  sessions: T[],
  n: number
): number[] {
  const days = new Array(n).fill(0);
  const cutoff = Date.now() - n * 86_400_000;
  for (const s of sessions) {
    if (s.type !== "focus" || s.startedAt < cutoff) continue;
    const idx = Math.floor((s.startedAt - cutoff) / 86_400_000);
    const clamped = Math.min(idx, n - 1);
    days[clamped] += s.durationSeconds / 60;
  }
  return days.map((m) => Math.round(m * 10) / 10);
}

/** Tasks created per day for the last n days. */
export function tasksCreatedPerDay(tasks: Task[], n: number): number[] {
  const days = new Array(n).fill(0);
  const keys = lastNDays(n).map((d) => d.key);
  const offsets: Record<string, number> = {};
  keys.forEach((k, i) => (offsets[k] = i));
  for (const t of tasks) {
    const k = dayKey(t.createdAt);
    const i = offsets[k];
    if (i !== undefined) days[i] += 1;
  }
  return days;
}

/** Tasks completed per day for the last n days. */
export function tasksCompletedPerDay(tasks: Task[], n: number): number[] {
  const days = new Array(n).fill(0);
  const offsets: Record<string, number> = {};
  lastNDays(n).forEach((d, i) => (offsets[d.key] = i));
  for (const t of tasks) {
    if (!t.completed || t.completedAt === null) continue;
    const i = offsets[dayKey(t.completedAt)];
    if (i !== undefined) days[i] += 1;
  }
  return days;
}
