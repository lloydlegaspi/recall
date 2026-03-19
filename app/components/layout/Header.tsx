"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export default function Header() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <header className="fixed top-0 right-0 left-0 z-20 border-b border-white/40 bg-white/45 backdrop-blur-md md:left-[15%] dark:border-white/10 dark:bg-slate-900/45">
      <div className="flex h-16 items-center justify-between px-6 md:px-8">
        <div className="h-10 w-44 rounded-2xl border border-white/50 bg-white/40 dark:border-white/10 dark:bg-slate-800/30" />

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl text-slate-700 hover:bg-white/70 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800/70 dark:hover:text-white"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="hidden size-4 dark:block" />
            <Moon className="size-4 dark:hidden" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl text-slate-700 hover:bg-white/70 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800/70 dark:hover:text-white"
            aria-label="User menu"
          >
            <span className="inline-flex size-2.5 rounded-full bg-slate-400 dark:bg-slate-500" />
          </Button>
        </div>
      </div>
    </header>
  );
}
