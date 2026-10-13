"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center px-6 py-14 text-center"
    >
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-violet-500/10 ring-1 ring-violet-500/20">
        <Icon className="h-6 w-6 text-violet-500" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  );
}
