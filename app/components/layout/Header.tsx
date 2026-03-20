"use client";

import Link from "next/link";
import Image from "next/image";
import { Moon, Settings, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export default function Header() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <header className="fixed top-0 w-full z-50 border-b border-white/60 bg-white/50 backdrop-blur-xl dark:border-white/10 dark:bg-[#0B0F19]/50">
      <div className="flex h-16 w-full items-center justify-between px-6 md:px-12">
        <Link href="/" className="group inline-flex items-center gap-3">
          <Image
            src="/logo-with-bg.png"
            alt="Recall Logo"
            width={62}
            height={62}
            className="object-contain"
          />
          <span className="text-xl font-extrabold tracking-tighter text-slate-900 dark:text-white">
            Recall
          </span>
        </Link>

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
            aria-label="Settings"
          >
            <Settings className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
