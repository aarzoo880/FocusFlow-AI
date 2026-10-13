"use client";

import { motion } from "framer-motion";

export function LineChart({
  data,
  labels,
  height = 190,
  color = "#8b5cf6",
  unit = "",
}: {
  data: number[];
  labels: string[];
  height?: number;
  color?: string;
  unit?: string;
}) {
  const width = 560;
  const padX = 24;
  const padTop = 16;
  const padBottom = 26;
  const innerW = width - padX * 2;
  const innerH = height - padTop - padBottom;
  const max = Math.max(...data, 1);

  const points = data.map((v, i) => {
    const x = data.length === 1 ? padX : padX + (i / (data.length - 1)) * innerW;
    const y = padTop + innerH - (v / max) * innerH;
    return { x, y, v };
  });

  const path = points
    .map((p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      return `L ${p.x} ${p.y}`;
    })
    .join(" ");

  const areaPath = `${path} L ${points[points.length - 1].x} ${padTop + innerH} L ${points[0].x} ${padTop + innerH} Z`;

  return (
    <div className="w-full" style={{ height }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-full w-full overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={padX}
            x2={width - padX}
            y1={padTop + innerH * f}
            y2={padTop + innerH * f}
            className="stroke-slate-200 dark:stroke-navy-700"
            strokeDasharray="4 6"
            strokeWidth="1"
          />
        ))}

        <motion.path
          d={areaPath}
          fill="url(#lineFill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
        <motion.path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        {points.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4"
            fill={color}
            stroke="white"
            strokeWidth="2"
            className="stroke-white dark:stroke-navy-900"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 + i * 0.05 }}
          >
            <title>
              {labels[i]}: {Math.round(p.v * 10) / 10}
              {unit}
            </title>
          </motion.circle>
        ))}
      </svg>
      <div className="mt-1 flex justify-between px-6 text-[10px] font-medium text-slate-400 dark:text-slate-500">
        {labels.map((l, i) => (
          <span key={i} className={data.length > 10 && i % 2 !== 0 ? "hidden sm:inline" : ""}>
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}
