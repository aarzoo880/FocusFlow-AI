"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  Inbox,
  ListChecks,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { TaskItem } from "@/components/tasks/TaskItem";
import { TaskForm } from "@/components/tasks/TaskForm";
import { useTasks } from "@/lib/task-context";
import { cx } from "@/lib/utils";
import type { Priority, Task } from "@/lib/types";

interface FormData {
  title: string;
  description: string;
  priority: Priority;
  category: string;
  dueDate: string;
}

const STATUS_TABS = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "completed", label: "Completed" },
] as const;

const PRIORITY_FILTERS: Array<{ id: "all" | Priority; label: string }> = [
  { id: "all", label: "Any priority" },
  { id: "high", label: "High" },
  { id: "medium", label: "Medium" },
  { id: "low", label: "Low" },
];

export default function TasksPage() {
  const {
    tasks,
    filtered,
    categories,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    clearCompleted,
    filter,
    hydrated,
  } = useTasks();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);

  const activeCount = useMemo(
    () => tasks.filter((t) => !t.completed).length,
    [tasks]
  );
  const completedCount = tasks.length - activeCount;

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditing(task);
    setFormOpen(true);
  };

  const handleSubmit = (data: FormData) => {
    if (editing) {
      updateTask(editing.id, {
        title: data.title.trim(),
        description: data.description.trim(),
        priority: data.priority,
        category: data.category.trim() || "General",
        dueDate: data.dueDate || null,
      });
    } else {
      addTask({
        title: data.title,
        description: data.description,
        priority: data.priority,
        category: data.category,
        dueDate: data.dueDate || null,
      });
    }
    setFormOpen(false);
    setEditing(null);
  };

  const hasAnyFilters =
    filter.search !== "" || filter.priority !== "all" || filter.status !== "all";

  return (
    <>
      <PageHeader
        title="Tasks"
        subtitle={`${activeCount} active · ${completedCount} completed`}
        actions={
          <>
            {completedCount > 0 && (
              <button onClick={clearCompleted} className="btn-ghost text-rose-500 hover:bg-rose-500/10">
                <Trash2 className="h-4 w-4" />
                Clear completed
              </button>
            )}
            <button onClick={openNew} className="btn-primary">
              <Plus className="h-4 w-4" />
              New task
            </button>
          </>
        }
      />

      {/* Filters */}
      <div className="card mb-4 flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="input pl-9"
            placeholder="Search tasks…"
            value={filter.search}
            onChange={(e) => filter.setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-navy-800">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => filter.setStatus(tab.id)}
              className={cx(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                filter.status === tab.id
                  ? "bg-white text-slate-900 shadow dark:bg-navy-900 dark:text-white"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <select
          aria-label="Filter by priority"
          className="input w-auto cursor-pointer"
          value={filter.priority}
          onChange={(e) =>
            filter.setPriority(e.target.value as Priority | "all")
          }
        >
          {PRIORITY_FILTERS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* Task list */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          tasks.length === 0 && hydrated ? (
            <EmptyState
              icon={Inbox}
              title="No tasks yet"
              description="Create your first task to get started. You can add, edit, complete and delete tasks anytime."
              action={
                <button onClick={openNew} className="btn-primary">
                  <Plus className="h-4 w-4" /> Add your first task
                </button>
              }
            />
          ) : hasAnyFilters ? (
            <EmptyState
              icon={ListChecks}
              title="No matching tasks"
              description="Try adjusting your search or filters to find what you're looking for."
              action={
                <button
                  onClick={() => {
                    filter.setSearch("");
                    filter.setPriority("all");
                    filter.setStatus("all");
                  }}
                  className="btn-ghost ring-1 ring-slate-200 dark:ring-navy-700"
                >
                  <X className="h-4 w-4" /> Clear filters
                </button>
              }
            />
          ) : null
        ) : (
          <ul className="divide-y divide-slate-100 p-3 dark:divide-navy-800/60 sm:p-4">
            <AnimatePresence initial={false}>
              {filtered.map((task, i) => (
                <li key={task.id} className="my-2 list-none first:my-0">
                  <TaskItem
                    task={task}
                    index={i}
                    onToggle={toggleComplete}
                    onEdit={openEdit}
                    onDelete={deleteTask}
                  />
                </li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>

      <TaskForm
        open={formOpen}
        editingTask={editing}
        categories={categories}
        onSubmit={handleSubmit}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
      />
    </>
  );
}
