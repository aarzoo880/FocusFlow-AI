export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  category: string;
  completed: boolean;
  createdAt: number;
  completedAt: number | null;
  dueDate: string | null; // ISO date string (yyyy-mm-dd)
  pomodoros: number; // focus sessions linked to this task
}

export interface FocusSession {
  id: string;
  startedAt: number;
  endedAt: number;
  durationSeconds: number;
  taskId: string | null;
  type: "focus" | "break";
}

export type TimerMode = "focus" | "shortBreak" | "longBreak";

export interface FilterState {
  search: string;
  priority: Priority | "all";
  status: "all" | "active" | "completed";
}
