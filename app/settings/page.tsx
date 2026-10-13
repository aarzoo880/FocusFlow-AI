"use client";

import { useState } from "react";
import { Download, Moon, Sun, Trash2, TriangleAlert } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Modal } from "@/components/ui/Modal";
import { useTheme } from "@/lib/theme-context";
import { useTasks } from "@/lib/task-context";
import { usePomodoro } from "@/lib/pomodoro-context";
import { formatDate } from "@/lib/utils";

export default function SettingsPage() {
  const { theme, toggleTheme, mounted } = useTheme();
  const { tasks, resetAll } = useTasks();
  const { sessions, totalFocusSeconds, todaySessions } = usePomodoro();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const exportData = () => {
    const payload = {
      app: "FocusFlow AI",
      version: 1,
      exportedAt: new Date().toISOString(),
      tasks,
      sessions,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `focusflow-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Manage your preferences and data."
      />

      <div className="space-y-4">
        {/* Appearance */}
        <section className="card p-5">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            Appearance
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:max-w-md">
            {(["light", "dark"] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  if (mounted && theme !== t) toggleTheme();
                }}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                  mounted && theme === t
                    ? "border-violet-500 bg-violet-500/10 ring-1 ring-violet-500/40"
                    : "border-slate-200 hover:border-slate-300 dark:border-navy-700 dark:hover:border-navy-600"
                }`}
              >
                {t === "light" ? (
                  <Sun className="h-5 w-5 text-amber-500" />
                ) : (
                  <Moon className="h-5 w-5 text-violet-400" />
                )}
                <div>
                  <div className="text-sm font-semibold capitalize text-slate-900 dark:text-white">
                    {t}
                  </div>
                  <div className="text-xs text-slate-400">
                    {t === "dark" ? "Navy & violet" : "Soft daylight"}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Data */}
        <section className="card p-5">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            Your data
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Everything is stored locally in your browser — nothing leaves your
            device.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center sm:max-w-md">
            <div className="rounded-xl bg-slate-100 p-3 dark:bg-navy-800">
              <div className="text-xl font-bold tabular-nums text-slate-900 dark:text-white">
                {tasks.length}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Tasks</div>
            </div>
            <div className="rounded-xl bg-slate-100 p-3 dark:bg-navy-800">
              <div className="text-xl font-bold tabular-nums text-slate-900 dark:text-white">
                {sessions.filter((s) => s.type === "focus").length}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Sessions</div>
            </div>
            <div className="rounded-xl bg-slate-100 p-3 dark:bg-navy-800">
              <div className="text-xl font-bold tabular-nums text-slate-900 dark:text-white">
                {Math.round(totalFocusSeconds / 60)}m
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Focused</div>
            </div>
          </div>
          <button onClick={exportData} className="btn-primary mt-4">
            <Download className="h-4 w-4" />
            Export data (JSON)
          </button>
        </section>

        {/* Danger zone */}
        <section className="card border-rose-200 p-5 dark:border-rose-900/50">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-rose-600 dark:text-rose-400">
            <TriangleAlert className="h-4 w-4" />
            Danger zone
          </h2>
          <p className="mt-1 max-w-lg text-xs text-slate-400">
            Permanently delete all tasks and focus sessions from this browser.
            Consider exporting a backup first. {todaySessions > 0 && `You focused ${todaySessions} time(s) today.`}
          </p>
          <button
            onClick={() => setConfirmOpen(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-rose-300 px-4 py-2.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50 dark:border-rose-800 dark:hover:bg-rose-950/40"
          >
            <Trash2 className="h-4 w-4" />
            Reset all data
          </button>
        </section>
      </div>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Reset everything?">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          This will permanently delete{" "}
          <span className="font-semibold text-slate-900 dark:text-white">
            {tasks.length} tasks
          </span>{" "}
          and{" "}
          <span className="font-semibold text-slate-900 dark:text-white">
            {sessions.length} focus sessions
          </span>{" "}
          from this browser&apos;s localStorage. This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={() => setConfirmOpen(false)} className="btn-ghost ring-1 ring-slate-200 dark:ring-navy-700">
            Cancel
          </button>
          <button
            onClick={() => {
              if (confirmed) return;
              setConfirmed(true);
              resetAll();
              try {
                window.localStorage.removeItem("ff:sessions");
                window.localStorage.removeItem("ff:cycle");
                setTimeout(() => window.location.reload(), 300);
              } catch {
                window.location.reload();
              }
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
          >
            <Trash2 className="h-4 w-4" />
            {confirmed ? "Deleted — reloading…" : "Yes, delete everything"}
          </button>
        </div>
        <p className="mt-3 text-[11px] text-slate-400">
          Current time reference: {formatDate(Date.now())}
        </p>
      </Modal>
    </>
  );
}
