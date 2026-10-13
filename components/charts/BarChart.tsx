"use client";

import { motion } from "framer-motion";
import { cx } from "@/lib/utils";

export function BarChart({
  data,
  labels,
  height = 180,
  color = "violet",
  unit = "",
}: {
  data: number[];
  labels: string[];
  height?: number;
  color?: "violet" | "emerald" | "sky";
  unit?: string;
}) {
  const max = Math.max(...data, 1);
  const barColors = {
    violet: "from-violet-500 to-violet-400",
    emerald: "from-emerald-500 to-emerald-400",
    sky: "from-sky-500 to-sky-400",
  } as const;
  const glowColors = {
    violet: "shadow-violet-500/30",
    emerald: "shadow-emerald-500/30",
    sky: "shadow-sky-500/30",
  } as const;

  return (
    <div className="w-full" style={{ height }}>
      <div className="flex h-full items-end gap-1.5 sm:gap-2">
        {data.map((v, i) => (
          <div
            key={i}
            className="group relative flex h-full flex-1 flex-col items-center justify-end"
          >
            {/* Tooltip */}
            <div className="pointer-events-none absolute bottom-full z-10 mb-1 hidden whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-[11px] font-medium text-white shadow-lg group-hover:block dark:bg-navy-700">
              {Math.round(v * 10) / 10}
              {unit}
            </div>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${Math.max((v / max) * 100, 3)}%` }}
              transition={{ duration: 0.6, delay: i * 0.05, ease: "easeOut" }}
              className={cx(
                "w-full max-w-[28px] rounded-t-md bg-gradient-to-t shadow-sm",
                barColors[color],
                glowColors[color],
                v === 0 && "opacity-30"
              )}
            />
            <span className="mt-1.5 text-[10px] font-medium text-slate-400 dark:text-slate-500">
              {labels[i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
