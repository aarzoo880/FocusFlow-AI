"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { uid } from "@/lib/utils";
import type { FocusSession, TimerMode } from "@/lib/types";
import type { Task } from "@/lib/types";
import { useTasks } from "@/lib/task-context";

export const TIMER_CONFIG: Record<TimerMode, { label: string; seconds: number }> = {
  focus: { label: "Focus", seconds: 25 * 60 },
  shortBreak: { label: "Short Break", seconds: 5 * 60 },
  longBreak: { label: "Long Break", seconds: 15 * 60 },
};

export const LONG_BREAK_INTERVAL = 4;

interface PomodoroContextValue {
  mode: TimerMode;
  secondsLeft: number;
  running: boolean;
  sessions: FocusSession[];
  cycleCount: number; // focus sessions completed in current cycle
  linkedTaskId: string | null;
  activeTask: Task | null;
  setMode: (m: TimerMode) => void;
  toggleRunning: () => void;
  reset: () => void;
  skip: () => void;
  setLinkedTaskId: (id: string | null) => void;
  todayFocusSeconds: number;
  totalFocusSeconds: number;
  todaySessions: number;
}

const PomodoroContext = createContext<PomodoroContextValue | null>(null);

export function PomodoroProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sessions, setSessions] = useLocalStorage<FocusSession[]>("ff:sessions", []);
  const [cycleCount, setCycleCount] = useLocalStorage<number>("ff:cycle", 0);
  const [mode, setModeState] = useLocalStorage<TimerMode>("ff:mode", "focus");
  const [running, setRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(
    () => TIMER_CONFIG.focus.seconds
  );
  const [linkedTaskId, setLinkedTaskId] = useLocalStorage<string | null>(
    "ff:linked-task",
    null
  );

  const { tasks, incrementPomodoros } = useTasks();
  const finishedRef = useRef(false);

  // Keep timer duration in sync when mode changes
  useEffect(() => {
    setSecondsLeft(TIMER_CONFIG[mode].seconds);
    finishedRef.current = false;
  }, [mode]);

  const persistSession = useCallback(
    (type: "focus" | "break", durationSeconds: number) => {
      if (durationSeconds <= 0) return;
      const endedAt = Date.now();
      const session: FocusSession = {
        id: uid(),
        startedAt: endedAt - durationSeconds * 1000,
        endedAt,
        durationSeconds,
        taskId: type === "focus" ? linkedTaskId : null,
        type,
      };
      setSessions((prev) => [...prev, session]);
    },
    [linkedTaskId, setSessions]
  );

  /** Transition to what should come next after the current mode finishes. */
  const advance = useCallback(
    (auto: boolean) => {
      if (mode === "focus") {
        persistSession("focus", TIMER_CONFIG.focus.seconds);
        if (linkedTaskId) incrementPomodoros(linkedTaskId);
        const nextIndex = cycleCount + 1;
        setCycleCount(nextIndex);
        if (nextIndex % LONG_BREAK_INTERVAL === 0) {
          setModeState("longBreak");
        } else {
          setModeState("shortBreak");
        }
      } else {
        const elapsed = TIMER_CONFIG[mode].seconds - secondsLeft;
        persistSession("break", elapsed);
        setModeState("focus");
      }
      if (auto) setRunning(true); // auto-start next block
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [mode, secondsLeft, cycleCount, linkedTaskId, persistSession, setCycleCount, setModeState, incrementPomodoros]
  );

  const finishNow = useCallback(
    (auto: boolean) => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      setRunning(false);
      advance(auto);
    },
    [advance]
  );

  // Countdown tick
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          // Mode advance handled by explicit timeout below
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running]);

  // Auto-advance when the timer hits zero
  useEffect(() => {
    if (!running || secondsLeft !== 0) return;
    if (finishedRef.current) return;
    finishedRef.current = true;
    // Small delay so users see 00:00 before auto-starting the next block
    const timeout = setTimeout(() => {
      advance(true);
    }, 900);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, running]);

  const setMode = useCallback(
    (m: TimerMode) => {
      setRunning(false);
      finishedRef.current = false;
      setModeState(m);
    },
    [setModeState]
  );

  const toggleRunning = useCallback(() => {
    setRunning((r) => !r);
  }, []);

  const reset = useCallback(() => {
    setRunning(false);
    finishedRef.current = false;
    // Discard partially completed session
    if (secondsLeft < TIMER_CONFIG[mode].seconds && mode === "focus") {
      const elapsed = TIMER_CONFIG[mode].seconds - secondsLeft;
      if (elapsed >= 60) persistSession("focus", elapsed);
    }
    setSecondsLeft(TIMER_CONFIG[mode].seconds);
  }, [mode, secondsLeft, persistSession]);

  const skip = useCallback(() => {
    setRunning(false);
    finishedRef.current = false;
    advance(false);
  }, [advance]);

  const activeTask = useMemo(
    () => tasks.find((t) => t.id === linkedTaskId) ?? null,
    [tasks, linkedTaskId]
  );

  const todayKeyStr = new Date().toDateString();
  const { todayFocusSeconds, totalFocusSeconds, todaySessions } = useMemo(() => {
    let todaySec = 0;
    let totalSec = 0;
    let todayCount = 0;
    for (const s of sessions) {
      if (s.type !== "focus") continue;
      totalSec += s.durationSeconds;
      if (new Date(s.startedAt).toDateString() === todayKeyStr) {
        todaySec += s.durationSeconds;
        todayCount += 1;
      }
    }
    return { todayFocusSeconds: todaySec, totalFocusSeconds: totalSec, todaySessions: todayCount };
  }, [sessions, todayKeyStr]);

  const value = useMemo<PomodoroContextValue>(
    () => ({
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
    }),
    [
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
    ]
  );

  return (
    <PomodoroContext.Provider value={value}>
      {children}
    </PomodoroContext.Provider>
  );
}

export function usePomodoro(): PomodoroContextValue {
  const ctx = useContext(PomodoroContext);
  if (!ctx) throw new Error("usePomodoro must be used within PomodoroProvider");
  return ctx;
}
