"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import AddSubjectModal from "@/app/components/dashboard/AddSubjectModal";
import SubjectCard from "@/app/components/dashboard/SubjectCard";

type Subject = {
  id: string;
  title: string;
  slug: string;
  color_theme: string | null;
};

type SubjectGridProps = {
  subjects: Subject[];
};

export default function SubjectGrid({ subjects }: SubjectGridProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {subjects.map((subject) => (
          <SubjectCard
            key={subject.id}
            title={subject.title}
            colorTheme={subject.color_theme || "bg-indigo-500/20"}
          />
        ))}

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="group flex aspect-square items-center justify-center rounded-3xl border-2 border-dashed border-indigo-300/80 bg-white/25 p-5 backdrop-blur-xl transition-all duration-200 hover:border-indigo-500 hover:bg-white/35 dark:border-indigo-500/45 dark:bg-slate-900/25 dark:hover:border-indigo-400 dark:hover:bg-slate-900/35"
        >
          <div className="flex flex-col items-center gap-2 text-indigo-600 transition-transform duration-200 group-hover:scale-105 dark:text-indigo-300">
            <Plus className="size-7 transition-transform duration-200 group-hover:scale-110" />
            <span className="text-sm font-semibold">Add New Subject</span>
          </div>
        </button>
      </div>

      <AddSubjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
