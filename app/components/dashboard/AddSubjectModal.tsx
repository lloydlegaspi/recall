"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, X } from "lucide-react";

import { supabase } from "@/lib/supabase";

type AddSubjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const colors = [
  "bg-blue-500/20",
  "bg-emerald-500/20",
  "bg-rose-500/20",
  "bg-amber-500/20",
  "bg-purple-500/20",
];

function getFolderSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AddSubjectModal({ isOpen, onClose }: AddSubjectModalProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      setError("Please enter a subject title.");
      setIsLoading(false);
      return;
    }

    const slug = getFolderSlug(normalizedTitle);
    const colorTheme = colors[Math.floor(Math.random() * colors.length)];

    const { error: insertError } = await supabase.from("subjects").insert({
      title: normalizedTitle,
      slug,
      color_theme: colorTheme,
    });

    if (insertError) {
      setError(insertError.message || "Unable to create subject.");
      setIsLoading(false);
      return;
    }

    router.refresh();
    setTitle("");
    onClose();
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-white/60 bg-white/70 p-8 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
        <div className="relative mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Create New Subject
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-0 top-0 inline-flex size-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-white/50 hover:text-slate-700 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Close create subject modal"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="subject-title"
              className="text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Subject Title
            </label>
            <input
              id="subject-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Biology 101"
              className="w-full rounded-xl border border-white/40 bg-white/50 px-4 py-3 text-slate-900 outline-none ring-0 transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500 dark:border-white/10 dark:bg-slate-950/30 dark:text-white"
              disabled={isLoading}
            />
          </div>

          {error ? (
            <p className="rounded-lg border border-rose-300/50 bg-rose-50/70 px-3 py-2 text-sm text-rose-600 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-200">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:from-indigo-600 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Creating Subject...
              </>
            ) : (
              <>
                <Plus className="size-4" />
                Create Subject
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
