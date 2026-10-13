"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  PRIORITY_ORDER,
  todayKey,
  uid,
} from "@/lib/utils";
import type { Priority, Task } from "@/lib/types";

export interface TaskInput {
  title: string;
  description?: string;
  priority?: Priority;
  category?: string;
  dueDate?: string | null;
}

interface TaskContextValue {
  tasks: Task[];
  hydrated: boolean;
  addTask: (input: TaskInput) => Task;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  incrementPomodoros: (id: string) => void;
  clearCompleted: () => void;
  resetAll: () => void;
  categories: string[];
  filtered: Task[];
  filter: FilterStateMutable;
}

interface FilterStateMutable {
  search: string;
  priority: Priority | "all";
  status: "all" | "active" | "completed";
  setSearch: (s: string) => void;
  setPriority: (p: Priority | "all") => void;
  setStatus: (s: "all" | "active" | "completed") => void;
}

const TaskContext = createContext<TaskContextValue | null>(null);

/** Seed tasks shown before the user's data hydrates / for first-run demo. */
const SEED_TASKS: Task[] = [
  {
    id: "seed-welcome",
    title: "Welcome to FocusFlow AI 👋",
    description:
      "Add, edit, complete and delete tasks. Everything is saved locally in your browser.",
    priority: "medium",
    category: "Onboarding",
    completed: false,
    createdAt: Date.now() - 2 * 3_600_000,
    completedAt: null,
    dueDate: todayKey(),
    pomodoros: 0,
  },
  {
    id: "seed-plan",
    title: "Plan your week",
    description: "Write down the three biggest outcomes you want this week.",
    priority: "high",
    category: "Planning",
    completed: false,
    createdAt: Date.now() - 24 * 3_600_000,
    completedAt: null,
    dueDate: todayKey(),
    pomodoros: 0,
  },
  {
    id: "seed-done",
    title: "Review daily analytics",
    description: "Check your focus charts to spot productivity trends.",
    priority: "low",
    category: "Review",
    completed: true,
    createdAt: Date.now() - 26 * 3_600_000,
    completedAt: Date.now() - 25 * 3_600_000,
    dueDate: null,
    pomodoros: 2,
  },
];

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks, hydrated] = useLocalStorage<Task[]>(
    "ff:tasks",
    SEED_TASKS
  );
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState<Priority | "all">("all");
  const [status, setStatus] = useState<"all" | "active" | "completed">("all");

  const addTask = useCallback(
    (input: TaskInput): Task => {
      const task: Task = {
        id: uid(),
        title: input.title.trim(),
        description: input.description?.trim() ?? "",
        priority: input.priority ?? "medium",
        category: input.category?.trim() || "General",
        completed: false,
        createdAt: Date.now(),
        completedAt: null,
        dueDate: input.dueDate ?? null,
        pomodoros: 0,
      };
      setTasks((prev) => [task, ...prev]);
      return task;
    },
    [setTasks]
  );

  const updateTask = useCallback(
    (id: string, patch: Partial<Task>) => {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    },
    [setTasks]
  );

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    },
    [setTasks]
  );

  const toggleComplete = useCallback(
    (id: string) => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                completed: !t.completed,
                completedAt: !t.completed ? Date.now() : null,
              }
            : t
        )
      );
    },
    [setTasks]
  );

  const incrementPomodoros = useCallback(
    (id: string) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, pomodoros: t.pomodoros + 1 } : t))
      );
    },
    [setTasks]
  );

  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  }, [setTasks]);

  const resetAll = useCallback(() => {
    setTasks([]);
  }, [setTasks]);

  const categories = useMemo(() => {
    const set = new Set(tasks.map((t) => t.category));
    return Array.from(set).sort();
  }, [tasks]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tasks
      .filter((t) => {
        if (status === "active" && t.completed) return false;
        if (status === "completed" && !t.completed) return false;
        if (priority !== "all" && t.priority !== priority) return false;
        if (q) {
          const haystack = `${t.title} ${t.description} ${t.category}`.toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        // Incomplete first, then priority, then newest
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        if (!a.completed && a.priority !== b.priority)
          return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
        return b.createdAt - a.createdAt;
      });
  }, [tasks, search, priority, status]);

  const filter = useMemo<FilterStateMutable>(
    () => ({
      search,
      priority,
      status,
      setSearch,
      setPriority,
      setStatus,
    }),
    [search, priority, status]
  );

  const value = useMemo<TaskContextValue>(
    () => ({
      tasks,
      hydrated,
      addTask,
      updateTask,
      deleteTask,
      toggleComplete,
      incrementPomodoros,
      clearCompleted,
      resetAll,
      categories,
      filtered,
      filter,
    }),
    [
      tasks,
      hydrated,
      addTask,
      updateTask,
      deleteTask,
      toggleComplete,
      incrementPomodoros,
      clearCompleted,
      resetAll,
      categories,
      filtered,
      filter,
    ]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks(): TaskContextValue {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used within TaskProvider");
  return ctx;
}
