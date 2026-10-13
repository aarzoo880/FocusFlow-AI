"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, Zap } from "lucide-react";
import { usePomodoro, TIMER_CONFIG } from "@/lib/pomodoro-context";
import { formatClock, cx } from "@/lib/utils";

export function MiniTimer() {
  const { running, mode, secondsLeft, toggleRunning } = usePomodoro();

  return (
    <AnimatePresence>
      {running && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 lg:left-[calc(50%+128px)]"
        >
          <Link
            href="/focus"
            className={cx(
              "flex items-center gap-3 rounded-full border px-4 py-2.5 shadow-glow backdrop-blur-xl transition-colors",
              mode === "focus"
                ? "border-violet-500/40 bg-violet-600/90 text-white"
                : "border-emerald-500/40 bg-emerald-600/90 text-white"
            )}
          >
            <Zap
              className="h-4 w-4 text-white"
              fill="currentColor"
            />
            <span className="font-mono text-sm font-semibold tabular-nums">
              {formatClock(secondsLeft)}
            </span>
            <span className="hidden text-xs font-medium opacity-80 sm:inline">
              {TIMER_CONFIG[mode].label}
            </span>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleRunning();
              }}
              aria-label={running ? "Pause timer" : "Resume timer"}
              className="grid h-7 w-7 place-items-center rounded-full bg-white/15 transition-colors hover:bg-white/25"
            >
              {running ? (
                <Pause className="h-3.5 w-3.5" fill="currentColor" />
              ) : (
                <Play className="ml-0.5 h-3.5 w-3.5 text-white" fill="currentColor" />
              )}
            </button>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
