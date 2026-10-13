"use client";

import { motion } from "framer-motion";
import {
  Bell,
  Check,
  Flame,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  PRIORITY_META,
  cx,
  formatRelative,
  isOverdue,
  todayKey,
} from "@/lib/utils";
import type { Task } from "@/lib/types";

export function TaskItem({
  task,
  index,
  onToggle,
  onEdit,
  onDelete,
}: {
  task: Task;
  index: number;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}) {
  const meta = PRIORITY_META[task.priority];
  const overdue = isOverdue(task);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.3) }}
      className={cx(
        "group flex items-start gap-3 rounded-xl border p-4 transition-colors",
        task.completed
          ? "border-slate-200/60 bg-slate-50/60 dark:border-navy-800 dark:bg-navy-900/40"
          : "border-slate-200 bg-white hover:border-violet-300 hover:shadow-card dark:border-navy-700/70 dark:bg-navy-900/70 dark:hover:border-violet-500/40"
      )}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        aria-label={task.completed ? "Mark as active" : "Mark as completed"}
        className={cx(
          "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition-all",
          task.completed
            ? "border-emerald-500 bg-emerald-500"
            : "border-slate-300 hover:border-violet-500 dark:border-navy-600 dark:hover:border-violet-400"
        )}
      >
        {task.completed && (
          <Check className="h-3 w-3 text-white" strokeWidth={3} />
        )}
      </button>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cx(
              "text-sm font-semibold",
              task.completed
                ? "text-slate-400 line-through dark:text-slate-500"
                : "text-slate-900 dark:text-white"
            )}
          >
            {task.title}
          </span>
          <span
            className={cx(
              "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
              meta.badge
            )}
          >
            {meta.label}
          </span>
          {overdue && (
            <span className="flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-500 ring-1 ring-rose-500/30">
              <Bell className="h-2.5 w-2.5" /> Overdue
            </span>
          )}
          {!task.completed && !overdue && task.dueDate === todayKey() && (
            <span className="rounded-full bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold text-sky-500 ring-1 ring-sky-500/30">
              Today
            </span>
          )}
        </div>

        {task.description && (
          <p
            className={cx(
              "mt-1 text-xs leading-relaxed",
              task.completed
                ? "text-slate-400 dark:text-slate-500"
                : "text-slate-500 dark:text-slate-400"
            )}
          >
            {task.description}
          </p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400 dark:text-slate-500">
          <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-medium dark:bg-navy-800">
            {task.category}
          </span>
          <span>{formatRelative(task.createdAt)}</span>
          {task.pomodoros > 0 && (
            <span className="flex items-center gap-1 text-violet-500 dark:text-violet-400">
              <Flame className="h-3 w-3" />
              {task.pomodoros} {task.pomodoros === 1 ? "pomodoro" : "pomodoros"}
            </span>
          )}
          {task.completed && task.completedAt && (
            <span className="text-emerald-500 dark:text-emerald-400">
              Completed {formatRelative(task.completedAt)}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
        <button
          onClick={() => onEdit(task)}
          aria-label={`Edit ${task.title}`}
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-violet-500/10 hover:text-violet-500"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          aria-label={`Delete ${task.title}`}
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-500/10 hover:text-rose-500"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </motion.li>
  );
}
