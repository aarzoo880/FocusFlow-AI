import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: {
    default: "FocusFlow AI — Productivity Dashboard",
    template: "%s · FocusFlow AI",
  },
  description:
    "FocusFlow AI is a premium productivity workspace: smart task manager, Pomodoro focus timer, and productivity analytics — all in one beautiful dashboard.",
  keywords: ["productivity", "pomodoro", "task manager", "analytics", "focus"],
  authors: [{ name: "FocusFlow AI" }],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a1024" },
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
