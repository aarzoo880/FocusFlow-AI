"use client";

import { motion } from "framer-motion";

interface Slice {
  label: string;
  value: number;
  color: string; // hex
}

export function DonutChart({
  slices,
  size = 180,
  centerLabel,
  centerValue,
}: {
  slices: Slice[];
  size?: number;
  centerLabel?: string;
  centerValue?: string;
}) {
  const total = slices.reduce((a, s) => a + s.value, 0);
  const radius = size / 2;
  const stroke = Math.max(14, size * 0.11);
  const r = radius - stroke / 2 - 2;
  const circumference = 2 * Math.PI * r;

  let offset = 0;

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 sm:justify-start">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={radius}
            cy={radius}
            r={r}
            fill="none"
            strokeWidth={stroke}
            className="stroke-slate-200 dark:stroke-navy-700"
          />
          {slices.map((s, i) => {
            if (s.value <= 0) return null;
            const fraction = s.value / total;
            const dash = fraction * circumference;
            const el = (
              <motion.circle
                key={s.label}
                cx={radius}
                cy={radius}
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circumference - dash}`}
                initial={{ strokeDashoffset: -offset, opacity: 0 }}
                animate={{ strokeDashoffset: -offset, opacity: 1 }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
              />
            );
            offset += dash;
            return el;
          })}
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <div className="text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
              {centerValue ?? total}
            </div>
            {centerLabel && (
              <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                {centerLabel}
              </div>
            )}
          </div>
        </div>
      </div>

      <ul className="space-y-2">
        {slices.map((s) => (
          <li key={s.label} className="flex items-center gap-2.5 text-sm">
            <span
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            <span className="text-slate-600 dark:text-slate-300">{s.label}</span>
            <span className="ml-auto font-semibold tabular-nums text-slate-900 dark:text-white">
              {total > 0 ? Math.round((s.value / total) * 100) : 0}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
