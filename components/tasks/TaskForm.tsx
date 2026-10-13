"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { cx, todayKey } from "@/lib/utils";
import type { Priority, Task } from "@/lib/types";

const PRIORITIES: Array<{ id: Priority; label: string; active: string }> = [
  { id: "low", label: "Low", active: "bg-emerald-500 text-white" },
  { id: "medium", label: "Medium", active: "bg-amber-500 text-white" },
  { id: "high", label: "High", active: "bg-rose-500 text-white" },
];

interface FormData {
  title: string;
  description: string;
  priority: Priority;
  category: string;
  dueDate: string;
}

const EMPTY: FormData = {
  title: "",
  description: "",
  priority: "medium",
  category: "General",
  dueDate: "",
};

export function TaskForm({
  open,
  editingTask,
  defaultCategory,
  categories,
  onSubmit,
  onClose,
}: {
  open: boolean;
  editingTask: Task | null;
  defaultCategory?: string;
  categories: string[];
  onSubmit: (data: FormData) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FormData>(EMPTY);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setError("");
      setForm(
        editingTask
          ? {
              title: editingTask.title,
              description: editingTask.description,
              priority: editingTask.priority,
              category: editingTask.category,
              dueDate: editingTask.dueDate ?? "",
            }
          : { ...EMPTY, category: defaultCategory ?? "General" }
      );
    }
  }, [open, editingTask, defaultCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Please give your task a title.");
      return;
    }
    onSubmit(form);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editingTask ? "Edit task" : "New task"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Title
          </label>
          <input
            autoFocus
            className="input"
            placeholder="What needs to be done?"
            value={form.title}
            maxLength={120}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          {error && (
            <p className="mt-1.5 text-xs font-medium text-rose-500">{error}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Description{" "}
            <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <textarea
            className="input min-h-[80px] resize-y"
            placeholder="Add details…"
            value={form.description}
            maxLength={400}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Priority
          </label>
          <div className="flex gap-2">
            {PRIORITIES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setForm({ ...form, priority: p.id })}
                className={cx(
                  "flex-1 rounded-xl border px-3 py-2 text-sm font-semibold transition-all",
                  form.priority === p.id
                    ? `border-transparent ${p.active} shadow`
                    : "border-slate-200 text-slate-500 hover:border-slate-300 dark:border-navy-700 dark:text-slate-400"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Category
            </label>
            <input
              className="input"
              list="ff-category-options"
              placeholder="e.g. Work, Personal"
              value={form.category}
              maxLength={32}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            <datalist id="ff-category-options">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Due date <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              type="date"
              className="input"
              min="2000-01-01"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
            {form.dueDate && (
              <button
                type="button"
                onClick={() => setForm({ ...form, dueDate: "" })}
                className="mt-1 text-xs font-medium text-violet-500 hover:underline"
              >
                Clear date
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          {form.dueDate === "" && !editingTask && (
            <button
              type="button"
              onClick={() => setForm({ ...form, dueDate: todayKey() })}
              className="text-xs font-medium text-slate-500 hover:text-violet-500 dark:text-slate-400"
            >
              📅 Due today?
            </button>
          )}
          <div className="ml-auto flex gap-2">
            <button type="button" onClick={onClose} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingTask ? "Save changes" : "Add task"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
