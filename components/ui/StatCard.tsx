"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cx } from "@/lib/utils";

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  accent = "violet",
  index = 0,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  accent?: "violet" | "emerald" | "amber" | "sky" | "rose";
  index?: number;
}) {
  const accents: Record<string, string> = {
    violet: "from-violet-600/20 to-violet-500/5 text-violet-500",
    emerald: "from-emerald-600/20 to-emerald-500/5 text-emerald-500",
    amber: "from-amber-600/20 to-amber-500/5 text-amber-500",
    sky: "from-sky-600/20 to-sky-500/5 text-sky-500",
    rose: "from-rose-600/20 to-rose-500/5 text-rose-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      className="card group p-5"
    >
      <div className="flex items-start justify-between">
        <div
          className={cx(
            "grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ring-1 ring-inset ring-white/10",
            accents[accent]
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4">
        <div className="text-2xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-white">
          {value}
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400">{label}</div>
        {hint && (
          <div className="mt-2 text-xs font-medium text-violet-500 dark:text-violet-400">
            {hint}
          </div>
        )}
      </div>
    </motion.div>
  );
}
