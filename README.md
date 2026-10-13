# ⚡ FocusFlow AI

**A premium productivity workspace — task manager, Pomodoro focus timer, and productivity analytics in one beautiful dashboard.**

FocusFlow AI is a fully client-side productivity SaaS web app built with **Next.js (App Router), TypeScript, Tailwind CSS, and Framer Motion**. Every feature is functional and persisted in your browser — no backend required.

---

## ✨ Features

| Feature | Description |
| --- | --- |
| 📊 **Interactive dashboard** | Greeting, live stat cards (tasks, completion rate, focus time), weekly focus & completion charts, priority donut, and a quick-add bar |
| ✅ **Task manager** | Full CRUD — add, edit, delete, and complete tasks with title, description, priority, category, and due date; search, status tabs, priority filters, and overdue detection |
| 🍅 **Pomodoro focus timer** | 25/5/15 focus–break cycles with auto-advancing long breaks every 4 sessions, progress ring, pause/reset/skip, and automatic 🍅 counters on linked tasks |
| 📈 **Productivity analytics** | Animated line chart (focus trend), bar charts (tasks created/completed), donut charts (status & time-of-day patterns), week-over-week trend |
| 🌓 **Dark / light mode** | Persistent theme with a polished navy-and-violet dark palette and a springy animated toggle |
| 💾 **localStorage persistence** | Tasks, focus sessions, timer state, and theme survive refreshes — SSR-safe hydration throughout |
| 🎬 **Smooth animations** | Framer Motion everywhere: page headers, stat reveals, layout transitions, modals, drawer, and an active-nav pill that slides between links |
| 📱 **Responsive design** | Mobile drawer navigation, fluid grids, and a floating mini-timer that appears while the clock runs on other pages |
| ⚙️ **Settings** | Theme preference, JSON data export, and a guarded danger-zone reset |

## 🛠 Tech stack

- **[Next.js](https://nextjs.org) 15** (App Router) + **React 19**
- **TypeScript** (strict mode)
- **Tailwind CSS** with a custom navy/violet design system (`darkMode: class`)
- **Framer Motion** for animations
- **Lucide React** icons
- Custom **SVG charts** (bar, line, donut) — zero chart dependencies
- **localStorage** persistence via a reusable SSR-safe hook

## 🚀 Getting started

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

# 3. Open http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build
npm run start      # serve the production build
npm run typecheck  # strict TypeScript check (tsc --noEmit)
```

> Requires **Node.js 18.18+** (Node 20+ recommended).

## 📁 Project structure

```
focusflow-ai/
├── app/
│   ├── layout.tsx          # Root layout + metadata
│   ├── page.tsx            # Dashboard
│   ├── globals.css         # Tailwind layers + design tokens
│   ├── tasks/page.tsx      # Task manager
│   ├── focus/page.tsx      # Pomodoro timer
│   ├── analytics/page.tsx  # Charts & insights
│   └── settings/page.tsx   # Preferences & data management
├── components/
│   ├── charts/             # BarChart, LineChart, DonutChart (SVG)
│   ├── layout/             # AppShell, Sidebar, TopBar
│   ├── pomodoro/           # TimerControls, ProgressRing, MiniTimer
│   ├── tasks/              # TaskItem, TaskForm (modal)
│   └── ui/                 # PageHeader, StatCard, Modal, EmptyState
├── hooks/
│   └── useLocalStorage.ts  # SSR-safe persistence hook
├── lib/
│   ├── task-context.tsx    # Task CRUD state + filters
│   ├── pomodoro-context.tsx# Timer engine + session logging
│   ├── theme-context.tsx   # Dark/light mode
│   ├── types.ts            # Shared types
│   └── utils.ts            # Formatting & analytics helpers
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## 🚢 Deploying to Vercel

The app is fully static/client-side — deploying to Vercel takes one minute:

1. Push this repository to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Vercel auto-detects Next.js. No environment variables are required.
4. Click **Deploy** — done. 🎉

A `vercel.json` is included with explicit framework/build settings (not strictly required).

## 💡 Usage tips

- **Quick add** tasks from the dashboard or manage everything in **Tasks**.
- In **Focus Timer**, pick a task to link the session with — finished focus sessions automatically add a 🍅 to that task.
- Your task list, timer, analytics, and theme persist in `localStorage` under the `ff:*` keys.
- Use **Settings → Export data** to back up, and the danger zone to reset.

## 📄 License

MIT — build something great with it.
