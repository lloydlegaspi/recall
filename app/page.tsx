"use client";

import { motion } from "framer-motion";
import SubjectCard from "@/app/components/dashboard/SubjectCard";
import { Plus } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const subjects = [
  {
    title: "COSC-481",
    colorTheme:
      "bg-[radial-gradient(120%_120%_at_10%_0%,rgba(99,102,241,0.55)_0%,rgba(125,211,252,0.4)_45%,rgba(255,255,255,0.08)_100%)] dark:bg-[radial-gradient(120%_120%_at_10%_0%,rgba(129,140,248,0.35)_0%,rgba(34,211,238,0.2)_48%,rgba(15,23,42,0.06)_100%)]",
    iconClassName: "text-indigo-600 dark:text-indigo-300",
    glowClassName: "shadow-indigo-300/55 dark:shadow-[0_0_30px_rgba(99,102,241,0.22)]",
  },
  {
    title: "Art History 101",
    colorTheme:
      "bg-[radial-gradient(120%_120%_at_10%_0%,rgba(251,146,60,0.55)_0%,rgba(253,230,138,0.4)_46%,rgba(255,255,255,0.08)_100%)] dark:bg-[radial-gradient(120%_120%_at_10%_0%,rgba(251,113,133,0.32)_0%,rgba(245,158,11,0.2)_52%,rgba(15,23,42,0.06)_100%)]",
    iconClassName: "text-rose-600 dark:text-rose-300",
    glowClassName: "shadow-orange-300/50 dark:shadow-[0_0_30px_rgba(244,114,182,0.2)]",
  },
  {
    title: "ECON-101",
    colorTheme:
      "bg-[radial-gradient(120%_120%_at_10%_0%,rgba(16,185,129,0.52)_0%,rgba(110,231,183,0.4)_48%,rgba(255,255,255,0.08)_100%)] dark:bg-[radial-gradient(120%_120%_at_10%_0%,rgba(16,185,129,0.3)_0%,rgba(20,184,166,0.2)_52%,rgba(15,23,42,0.06)_100%)]",
    iconClassName: "text-emerald-600 dark:text-emerald-300",
    glowClassName: "shadow-emerald-300/50 dark:shadow-[0_0_30px_rgba(16,185,129,0.2)]",
  },
];

export default function Home() {
  return (
    <motion.section
      className="space-y-10"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants} className="space-y-1">
        <h1 className="font-sans text-5xl font-extrabold tracking-tighter text-slate-900 dark:text-white">
          Hi, champion!
        </h1>
        <p className="mt-2 text-lg font-medium text-slate-500 dark:text-slate-300">
          Pick a subject to resume your recall flow.
        </p>
      </motion.div>

      <motion.div variants={containerVariants} className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
        {subjects.map((subject) => (
          <motion.div key={subject.title} variants={itemVariants}>
            <SubjectCard
              title={subject.title}
              colorTheme={subject.colorTheme}
              iconClassName={subject.iconClassName}
              glowClassName={subject.glowClassName}
            />
          </motion.div>
        ))}

        <motion.article
          variants={itemVariants}
          className="group flex min-h-[190px] items-center justify-center rounded-3xl border-2 border-dashed border-indigo-300/80 bg-white/25 p-6 backdrop-blur-xl transition-all duration-200 hover:border-indigo-500 hover:bg-white/35 dark:border-indigo-500/45 dark:bg-slate-900/25 dark:hover:border-indigo-400 dark:hover:bg-slate-900/35"
        >
          <div className="flex flex-col items-center gap-2 text-indigo-600 transition-transform duration-200 group-hover:scale-105 dark:text-indigo-300">
            <Plus className="size-7 transition-transform duration-200 group-hover:scale-110" />
            <span className="text-sm font-semibold">Add New Subject</span>
          </div>
        </motion.article>
      </motion.div>
    </motion.section>
  );
}
