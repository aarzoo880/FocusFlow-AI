import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#f4f6fb",
          100: "#e8ecf7",
          200: "#ccd5ea",
          300: "#a3b1d4",
          400: "#7186b8",
          500: "#4d669c",
          600: "#394e7e",
          700: "#2a3a61",
          800: "#1c2746",
          900: "#101a33",
          950: "#0a1024",
        },
        violet: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 24px -4px rgba(139, 92, 246, 0.45)",
        card: "0 8px 30px rgba(2, 6, 23, 0.08)",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.5s ease-out both",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
