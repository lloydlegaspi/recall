"use client";

import { ArrowRight, BookOpenText, Brain } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SubjectCardProps = {
  title: string;
  colorTheme: string;
  iconClassName?: string;
  glowClassName?: string;
};

export default function SubjectCard({
  title,
  colorTheme,
  iconClassName,
  glowClassName,
}: SubjectCardProps) {
  return (
    <motion.div
      className="group relative"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
    >
      <article
        className={cn(
          "relative aspect-square overflow-hidden rounded-3xl border border-white/60 bg-white/55 p-5 shadow-xl backdrop-blur-xl transition-all duration-300 group-hover:-translate-y-0.5 group-hover:brightness-105 group-hover:saturate-125 dark:border-white/10 dark:bg-slate-900/40",
          glowClassName,
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute inset-0 rounded-3xl opacity-90 transition-all duration-300 group-hover:opacity-100",
            colorTheme
          )}
        />
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(110%_90%_at_80%_0%,rgba(255,255,255,0.28)_0%,rgba(255,255,255,0)_60%)] dark:bg-[radial-gradient(110%_90%_at_80%_0%,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_60%)]" />
        <div className="relative flex h-full flex-col justify-between">
          <div className="space-y-2">
            <h2 className="flex items-center gap-2 text-base font-bold tracking-tight text-slate-900 dark:text-white md:text-lg">
              <BookOpenText className={cn("size-4", iconClassName)} />
              {title}
            </h2>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {/* Primary Action: Chat */}
            <Button
              asChild
              variant="ghost"
              className="h-auto w-max rounded-full bg-white/60 px-3 py-2 text-xs font-semibold text-slate-800 transition-colors hover:bg-white dark:bg-black/20 dark:text-slate-100 dark:hover:bg-black/40"
            >
              <Link
                href={`/study/${encodeURIComponent(title)}`}
                className="inline-flex items-center gap-2"
              >
                <span>Open Workspace</span>
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </article>
    </motion.div>
  );
}