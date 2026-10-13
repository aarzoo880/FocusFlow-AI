"use client";

import { motion } from "framer-motion";
import { Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import { cx } from "@/lib/utils";

export function TimerControls({
  running,
  onToggle,
  onReset,
  onSkip,
  size = "md",
}: {
  running: boolean;
  onToggle: () => void;
  onReset: () => void;
  onSkip: () => void;
  size?: "sm" | "md";
}) {
  const main = size === "md" ? "h-14 w-14" : "h-12 w-12";
  const side = size === "md" ? "h-11 w-11" : "h-10 w-10";

  return (
    <div className="flex items-center justify-center gap-4">
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={onReset}
        aria-label="Reset timer"
        className={cx(
          "grid place-items-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-700 dark:border-navy-700 dark:text-slate-400 dark:hover:border-navy-600 dark:hover:text-slate-200",
          side
        )}
      >
        <RotateCcw className={size === "md" ? "h-5 w-5" : "h-4 w-4"} />
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={onToggle}
        aria-label={running ? "Pause timer" : "Start timer"}
        className={cx(
          "grid place-items-center rounded-full bg-gradient-to-br from-violet-600 to-violet-500 text-white shadow-glow transition-all hover:brightness-110",
          main
        )}
      >
        {running ? (
          <Pause className="h-6 w-6" fill="currentColor" />
        ) : (
          <Play className="ml-0.5 h-6 w-6" fill="currentColor" />
        )}
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={onSkip}
        aria-label="Skip to next block"
        className={cx(
          "grid place-items-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-700 dark:border-navy-700 dark:text-slate-400 dark:hover:border-navy-600 dark:hover:text-slate-200",
          side
        )}
      >
        <SkipForward className={size === "md" ? "h-5 w-5" : "h-4 w-4"} />
      </motion.button>
    </div>
  );
}

export function ProgressRing({
  progress,
  size = 240,
  color = "#8b5cf6",
  children,
}: {
  progress: number; // 0..1 remaining fraction
  size?: number;
  color?: string;
  children: React.ReactNode;
}) {
  const stroke = 10;
  const r = (size - stroke) / 2 - 4;
  const circumference = 2 * Math.PI * r;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          className="stroke-slate-200 dark:stroke-navy-800"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: circumference * (1 - progress) }}
          transition={{ duration: 0.5, ease: "linear" }}
          style={{
            filter: `drop-shadow(0 0 8px ${color}66)`,
          }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}
