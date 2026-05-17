"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ElementType, type FormEvent } from "react";
import {
  ArrowRight,
  Bell,
  BookOpenText,
  Boxes,
  ChevronDown,
  Code2,
  Languages,
  Loader2,
  Moon,
  Plus,
  Settings,
  Sparkles,
  Sun,
  User,
  Users,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";

import { supabase } from "@/lib/supabase";

type Subject = {
  id: string;
  title: string;
  slug: string;
  color_theme: string | null;
};

type CourseStyle = {
  icon: ElementType;
  iconClassName: string;
  iconShellClassName: string;
  cardClassName: string;
  progressClassName: string;
  art: "rizal" | "translation" | "social" | "algorithms" | "data";
};

const courseStyles: CourseStyle[] = [
  {
    icon: BookOpenText,
    iconClassName: "text-[#7b45ff]",
    iconShellClassName: "shadow-[#7b45ff]/22",
    cardClassName: "bg-[#ffeaf6]/72 dark:bg-[#3a1831]/70",
    progressClassName: "from-[#ff4daf] to-[#f05a9a]",
    art: "rizal",
  },
  {
    icon: Languages,
    iconClassName: "text-[#6048ff]",
    iconShellClassName: "shadow-[#6048ff]/22",
    cardClassName: "bg-[#eef1ff]/76 dark:bg-[#171b45]/76",
    progressClassName: "from-[#6d57ff] to-[#5b42f2]",
    art: "translation",
  },
  {
    icon: Users,
    iconClassName: "text-[#18c987]",
    iconShellClassName: "shadow-[#18c987]/20",
    cardClassName: "bg-[#e7faf3]/78 dark:bg-[#10362f]/76",
    progressClassName: "from-[#18c987] to-[#14b67d]",
    art: "social",
  },
  {
    icon: Code2,
    iconClassName: "text-[#ff6b2d]",
    iconShellClassName: "shadow-[#ff6b2d]/20",
    cardClassName: "bg-[#fff0e5]/80 dark:bg-[#3a2019]/76",
    progressClassName: "from-[#ff7331] to-[#f6612c]",
    art: "algorithms",
  },
  {
    icon: Boxes,
    iconClassName: "text-[#347cf4]",
    iconShellClassName: "shadow-[#347cf4]/20",
    cardClassName: "bg-[#edf6ff]/80 dark:bg-[#132a44]/76",
    progressClassName: "from-[#4a83f5] to-[#5876f8]",
    art: "data",
  },
];

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

export default function HomeDashboardPage() {
  const { resolvedTheme, setTheme } = useTheme();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);
  const [subjectsError, setSubjectsError] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isTipsOpen, setIsTipsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const isDark = resolvedTheme === "dark";

  const refreshSubjects = useCallback(async () => {
    setIsLoadingSubjects(true);
    setSubjectsError(null);

    const { data, error } = await supabase
      .from("subjects")
      .select("id, title, slug, color_theme, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      setSubjects([]);
      setSubjectsError(error.message || "Unable to load courses.");
      setIsLoadingSubjects(false);
      return;
    }

    setSubjects((data as Subject[]) || []);
    setIsLoadingSubjects(false);
  }, []);

  useEffect(() => {
    let shouldIgnore = false;

    supabase
      .from("subjects")
      .select("id, title, slug, color_theme, created_at")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (shouldIgnore) {
          return;
        }

        if (error) {
          setSubjects([]);
          setSubjectsError(error.message || "Unable to load courses.");
          setIsLoadingSubjects(false);
          return;
        }

        setSubjects((data as Subject[]) || []);
        setIsLoadingSubjects(false);
      });

    return () => {
      shouldIgnore = true;
    };
  }, []);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!profileRef.current?.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  function toggleTheme() {
    setTheme(isDark ? "light" : "dark");
  }

  return (
    <section className="relative h-screen overflow-hidden bg-[#dff4ff] text-[#10105f] dark:bg-[#10122f] dark:text-white">
      <Image
        src="/homepage-bg.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 z-0 object-cover object-center opacity-100 dark:opacity-32"
      />
      <div className="absolute inset-0 z-0 bg-white/4 dark:bg-[#0b1028]/72" />

      <div className="relative z-20 mx-auto flex h-screen w-full max-w-[1660px] flex-col px-5 py-5 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between gap-5">
          <Link href="/" className="flex items-center gap-4" aria-label="Recall landing page">
            <Image
              src="/logo-with-bg.png"
              alt=""
              width={68}
              height={68}
              priority
              className="size-12 rounded-[16px] object-contain shadow-[0_12px_30px_rgba(111,84,232,0.28)] sm:size-14"
            />
            <span className="text-[26px] font-extrabold tracking-[-0.04em] text-[#111066] dark:text-white sm:text-[28px]">
              Recall
            </span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-5">
            <button
              type="button"
              className="grid size-11 place-items-center rounded-full border border-white/70 bg-white/70 text-[#111066] shadow-[0_14px_35px_rgba(75,94,134,0.16)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/90 dark:border-white/10 dark:bg-white/12 dark:text-white"
              aria-label="Notifications"
            >
              <Bell className="size-5" />
            </button>

            <div ref={profileRef} className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen((current) => !current)}
                className="flex items-center gap-3 rounded-full px-1.5 py-1.5 text-[#111066] transition hover:bg-white/42 dark:text-white dark:hover:bg-white/10"
                aria-expanded={isProfileOpen}
                aria-haspopup="menu"
              >
                <span className="grid size-11 place-items-center overflow-hidden rounded-full bg-linear-to-br from-[#ffe5c8] via-[#f2b88e] to-[#1f376f] shadow-[0_14px_30px_rgba(35,50,92,0.2)]">
                  <span className="mt-1 text-[22px] font-black text-white">U</span>
                </span>
                <span className="hidden text-[17px] font-bold sm:block">User</span>
                <ChevronDown
                  className={`size-5 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isProfileOpen ? (
                <div
                  role="menu"
                  className="absolute right-0 top-[calc(100%+12px)] z-30 w-[238px] overflow-hidden rounded-[24px] border border-white/72 bg-white/82 p-2 text-[#12115f] shadow-[0_24px_70px_rgba(50,68,110,0.2)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#11172f]/88 dark:text-white"
                >
                  <Link
                    href="/home"
                    role="menuitem"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 rounded-[18px] px-4 py-3 text-sm font-bold transition hover:bg-[#f0ecff] dark:hover:bg-white/10"
                  >
                    <User className="size-5 text-[#6048ff]" />
                    Profile
                  </Link>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={toggleTheme}
                    className="flex w-full items-center justify-between rounded-[18px] px-4 py-3 text-left text-sm font-bold transition hover:bg-[#f0ecff] dark:hover:bg-white/10"
                  >
                    <span className="flex items-center gap-3">
                      <Sun className="size-5 text-[#ff9a2e] dark:hidden" />
                      <Moon className="hidden size-5 text-[#b7adff] dark:block" />
                      Theme
                    </span>
                    <span
                      suppressHydrationWarning
                      className="rounded-full bg-[#eee9ff] px-3 py-1 text-xs text-[#3e2cff] dark:bg-white/10 dark:text-white"
                    >
                      {isDark ? "Dark" : "Light"}
                    </span>
                  </button>

                  <Link
                    href="/settings"
                    role="menuitem"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 rounded-[18px] px-4 py-3 text-sm font-bold transition hover:bg-[#f0ecff] dark:hover:bg-white/10"
                  >
                    <Settings className="size-5 text-[#6048ff]" />
                    Settings
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col pt-5 lg:pt-6">
          <div className="grid w-full gap-8 lg:grid-cols-[minmax(340px,0.78fr)_minmax(700px,1.22fr)] lg:items-start xl:grid-cols-[minmax(380px,0.7fr)_minmax(850px,1.3fr)]">
            <section className="space-y-2">
              <h1 className="font-[Georgia,serif] text-[clamp(2rem,2.6vw,3rem)] leading-[0.96] font-bold tracking-normal text-[#11105f] drop-shadow-[0_2px_0_rgba(255,255,255,0.62)] dark:text-white">
                Good morning, user.
                <Sparkles className="ml-2 inline size-5 fill-[#ec6fee] text-[#ec6fee]" />
              </h1>
              <p className="text-[17px] leading-6 font-semibold text-[#536099] dark:text-[#c7d2ff]">
                Pick a course to resume your recall flow.
              </p>
            </section>

            <section className="grid gap-5 sm:grid-cols-3">
              <StatCard
                label="Courses"
                value={isLoadingSubjects ? "..." : String(subjects.length)}
                icon={BookOpenText}
                iconClassName="text-[#7a45ff]"
              />
              <StatCard
                label="Day Streak"
                value="24"
                icon={Sun}
                iconClassName="text-[#ff9a2e]"
              />
              <StatCard
                label="Overall Mastery"
                value="87%"
                icon={Sparkles}
                iconClassName="text-[#18c987]"
              />
            </section>
          </div>

          <section className="mt-6 grid w-full flex-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {isLoadingSubjects ? (
              <LoadingTile />
            ) : subjectsError ? (
              <StatusTile title="Could not load courses" description={subjectsError} />
            ) : subjects.length > 0 ? (
              subjects.map((subject, index) => (
                <CourseTile
                  key={subject.id}
                  subject={subject}
                  styleConfig={courseStyles[index % courseStyles.length]}
                />
              ))
            ) : (
              <StatusTile
                title="No courses yet"
                description="Create your first course to start building a recall workspace."
              />
            )}

            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="group flex min-h-[224px] flex-col items-center justify-center rounded-[20px] border-2 border-dashed border-[#b7a7ff]/88 bg-white/34 p-5 text-center shadow-[0_18px_42px_rgba(86,105,143,0.08)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-[#6b54ff] hover:bg-white/48 dark:border-[#8c7cff]/60 dark:bg-white/8 dark:hover:bg-white/12"
            >
              <span className="grid size-[68px] place-items-center rounded-full bg-[#ece5ff] text-[#4b2dff] transition group-hover:scale-105 dark:bg-white/10 dark:text-[#cfc6ff]">
                <Plus className="size-8" />
              </span>
              <span className="mt-5 text-[18px] font-black text-[#3020ff] dark:text-[#d6d1ff]">
                Add New Course
              </span>
              <span className="mt-2 max-w-[150px] text-[14px] leading-5 font-semibold text-[#536099] dark:text-[#c7d2ff]">
                Create a workspace and start learning.
              </span>
            </button>
          </section>

          <section className="mt-6 flex w-full flex-col gap-4 rounded-[20px] border border-white/72 bg-white/56 p-4 shadow-[0_18px_48px_rgba(76,95,137,0.12)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-4">
              <span className="grid size-[56px] place-items-center rounded-[16px] bg-white/62 text-[#a05aff] shadow-[0_12px_30px_rgba(111,84,232,0.12)] dark:bg-white/10">
                <Sparkles className="size-7" />
              </span>
              <span>
                <strong className="block text-[16px] font-black text-[#3020ff] dark:text-white">
                  Tip for success
                </strong>
                <span className="mt-1 block text-[16px] font-semibold text-[#536099] dark:text-[#c7d2ff]">
                  Short, focused sessions every day lead to stronger recall.
                </span>
              </span>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setIsTipsOpen(true)}
                className="inline-flex h-12 items-center justify-center gap-3 rounded-[16px] bg-white/72 px-6 text-[15px] font-black text-[#3020ff] shadow-[0_12px_30px_rgba(86,105,143,0.12)] transition hover:-translate-y-0.5 hover:bg-white dark:bg-white/10 dark:text-white dark:hover:bg-white/14"
              >
                <Sparkles className="size-5" />
                View Study Tips
              </button>
            </div>
          </section>
        </main>
      </div>

      <CreateCourseModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={refreshSubjects}
      />
      <TipsModal isOpen={isTipsOpen} onClose={() => setIsTipsOpen(false)} />
    </section>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  iconClassName,
}: {
  label: string;
  value: string;
  icon: ElementType;
  iconClassName: string;
}) {
  return (
    <article className="flex min-h-[92px] items-center gap-4 rounded-[18px] border border-white/72 bg-white/52 px-5 shadow-[0_18px_48px_rgba(76,95,137,0.12)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/10">
      <span className="grid size-[56px] place-items-center rounded-[16px] bg-white/68 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_14px_30px_rgba(84,95,145,0.12)] dark:bg-white/10">
        <Icon className={`size-8 ${iconClassName}`} strokeWidth={2.3} />
      </span>
      <span>
        <strong className="block text-[27px] leading-none font-black tracking-[-0.04em] text-[#12115f] dark:text-white">
          {value}
        </strong>
        <span className="mt-2 block text-[14px] font-semibold text-[#65709f] dark:text-[#c8d2ff]">
          {label}
        </span>
      </span>
    </article>
  );
}

function CourseTile({
  subject,
  styleConfig,
}: {
  subject: Subject;
  styleConfig: CourseStyle;
}) {
  const Icon = styleConfig.icon;

  return (
    <article
      className={`group relative min-h-[224px] overflow-hidden rounded-[20px] border border-white/76 p-5 shadow-[0_18px_48px_rgba(76,95,137,0.12)] backdrop-blur-2xl transition hover:-translate-y-1 dark:border-white/10 ${styleConfig.cardClassName}`}
    >
      <CourseArt art={styleConfig.art} />

      <div className="relative z-10 flex h-full flex-col">
        <span
          className={`grid size-[58px] place-items-center rounded-[16px] bg-white/64 shadow-[0_16px_34px_var(--tw-shadow-color)] dark:bg-white/10 ${styleConfig.iconShellClassName}`}
        >
          <Icon className={`size-8 ${styleConfig.iconClassName}`} strokeWidth={2.25} />
        </span>

        <h2 className="mt-4 font-[Georgia,serif] text-[25px] leading-[0.98] font-bold tracking-normal text-[#11105f] dark:text-white">
          {subject.title}
        </h2>

        <div className="mt-5 flex items-center gap-4">
          <span className="h-2 w-full overflow-hidden rounded-full bg-[#dfdbf2] dark:bg-white/12">
            <span className={`block h-full w-1/3 rounded-full bg-linear-to-r ${styleConfig.progressClassName}`} />
          </span>
          <span className="shrink-0 text-[14px] font-semibold text-[#65709f] dark:text-[#c7d2ff]">
            Workspace
          </span>
        </div>

        <p className="mt-3 max-w-[420px] text-[15px] leading-5 font-semibold text-[#536099] dark:text-[#c7d2ff]">
          Open your materials, chat, and quiz tools.
        </p>

        <Link
          href={`/study/${encodeURIComponent(subject.title)}`}
          className="mt-auto inline-flex h-11 w-[min(100%,245px)] items-center justify-center self-center rounded-full bg-white/80 px-6 text-[15px] font-black text-[#3020ff] shadow-[0_13px_30px_rgba(86,105,143,0.13)] transition hover:-translate-y-0.5 hover:bg-white dark:bg-white/10 dark:text-white dark:hover:bg-white/16"
        >
          <span className="whitespace-nowrap">Open Workspace</span>
          <ArrowRight className="ml-5 size-5 transition group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}

function LoadingTile() {
  return (
    <div className="flex min-h-[224px] items-center justify-center rounded-[20px] border border-white/76 bg-white/42 shadow-[0_18px_48px_rgba(76,95,137,0.12)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/10">
      <div className="flex items-center gap-3 text-[15px] font-bold text-[#536099] dark:text-[#c7d2ff]">
        <Loader2 className="size-5 animate-spin text-[#6048ff]" />
        Loading courses
      </div>
    </div>
  );
}

function StatusTile({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-[224px] flex-col justify-center rounded-[20px] border border-white/76 bg-white/42 p-6 shadow-[0_18px_48px_rgba(76,95,137,0.12)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/10">
      <h2 className="font-[Georgia,serif] text-[25px] font-bold text-[#11105f] dark:text-white">
        {title}
      </h2>
      <p className="mt-3 text-[15px] leading-5 font-semibold text-[#536099] dark:text-[#c7d2ff]">
        {description}
      </p>
    </div>
  );
}

function CreateCourseModal({
  isOpen,
  onClose,
  onCreated,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      setError("Please enter a course title.");
      setIsSubmitting(false);
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
      setError(insertError.message || "Unable to create course.");
      setIsSubmitting(false);
      return;
    }

    await onCreated();
    setTitle("");
    setIsSubmitting(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/36 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[26px] border border-white/70 bg-white/82 p-7 text-[#12115f] shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-[#11172f]/90 dark:text-white">
        <div className="relative mb-6">
          <h2 className="text-2xl font-black tracking-[-0.03em]">Add New Course</h2>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-0 top-0 inline-flex size-9 items-center justify-center rounded-full text-[#65709f] transition hover:bg-[#f0ecff] hover:text-[#12115f] dark:text-[#c7d2ff] dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Close add course modal"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="course-title" className="text-sm font-bold text-[#536099] dark:text-[#c7d2ff]">
              Course Title
            </label>
            <input
              id="course-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Machine Learning"
              disabled={isSubmitting}
              className="w-full rounded-[18px] border border-white/70 bg-white/72 px-4 py-3 text-[#12115f] outline-none transition placeholder:text-[#8a94bd] focus:border-[#7865ff] focus:ring-2 focus:ring-[#7865ff]/30 disabled:opacity-70 dark:border-white/10 dark:bg-white/10 dark:text-white"
            />
          </div>

          {error ? (
            <p className="rounded-[14px] border border-rose-300/50 bg-rose-50/70 px-3 py-2 text-sm font-semibold text-rose-600 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-200">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[16px] bg-[#3020ff] px-4 text-sm font-black text-white shadow-[0_14px_30px_rgba(48,32,255,0.24)] transition hover:-translate-y-0.5 hover:bg-[#2416d8] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Creating Course
              </>
            ) : (
              <>
                <Plus className="size-4" />
                Create Course
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function TipsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  const tips = [
    "Do short, focused sessions (10-20 minutes).",
    "Review previously learned items before adding new material.",
    "Use active recall: test yourself instead of re-reading notes.",
  ];

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/36 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[20px] border border-white/70 bg-white/92 p-6 text-[#12115f] shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-[#11172f]/90 dark:text-white">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-black">Study Tips</h3>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full p-2 text-[#65709f] transition hover:bg-[#f0ecff] hover:text-[#12115f] dark:text-[#c7d2ff] dark:hover:bg-white/10"
            aria-label="Close study tips"
          >
            <X className="size-5" />
          </button>
        </div>

        <ul className="mt-4 space-y-3">
          {tips.map((t, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1 inline-block h-3 w-3 rounded-full bg-[#3020ff]" />
              <span className="text-sm font-semibold text-[#536099] dark:text-[#c7d2ff]">{t}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 text-right">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[12px] bg-[#3020ff] px-4 text-sm font-black text-white transition hover:-translate-y-0.5"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

function CourseArt({ art }: { art: CourseStyle["art"] }) {
  if (art === "rizal") {
    return (
      <div className="pointer-events-none absolute inset-0 opacity-42">
        <div className="absolute right-[18%] top-10 h-36 w-16 border-r-4 border-[#d995ee]/55">
          <div className="absolute right-[-12px] top-[-6px] h-5 w-5 rounded-full bg-[#d995ee]/60" />
          <div className="absolute bottom-0 right-[-48px] h-16 w-24 rounded-t-full bg-[#d995ee]/18" />
        </div>
        <div className="absolute bottom-16 left-[42%] h-16 w-52 rounded-full bg-white/36" />
        <div className="absolute bottom-20 right-8 flex gap-4">
          <span className="size-12 rounded-full bg-[#d995ee]/22" />
          <span className="size-16 rounded-full bg-[#d995ee]/20" />
          <span className="size-11 rounded-full bg-[#d995ee]/20" />
        </div>
      </div>
    );
  }

  if (art === "translation") {
    return (
      <div className="pointer-events-none absolute inset-0 opacity-46">
        <div className="absolute right-7 top-7 size-48 rounded-full border border-white/60" />
        <div className="absolute right-11 top-10 size-40 rounded-full border border-white/42" />
        <div className="absolute right-6 top-28 h-px w-52 -rotate-12 bg-white/56" />
        <div className="absolute right-6 top-44 h-px w-52 rotate-12 bg-white/50" />
        <div className="absolute right-28 top-8 h-52 w-px bg-white/40" />
      </div>
    );
  }

  if (art === "social") {
    return (
      <div className="pointer-events-none absolute inset-0 opacity-46">
        <div className="absolute right-8 top-18 flex items-end gap-5">
          <span className="h-20 w-12 rounded-t-full bg-[#6fd7bf]/35" />
          <span className="h-24 w-14 rounded-t-full bg-[#6fd7bf]/35" />
          <span className="h-16 w-10 rounded-t-full bg-[#6fd7bf]/35" />
        </div>
        <div className="absolute right-16 top-10 rounded-xl bg-[#6fd7bf]/30 px-5 py-3" />
        <div className="absolute right-32 top-18 rounded-lg bg-[#6fd7bf]/35 px-4 py-3" />
      </div>
    );
  }

  if (art === "algorithms") {
    return (
      <div className="pointer-events-none absolute inset-0 opacity-48">
        <div className="absolute right-10 top-8 h-24 w-56 border-t border-[#f5a27a]/38">
          <span className="absolute left-6 top-0 size-4 -translate-y-1/2 rotate-45 border border-[#f5a27a]/55" />
          <span className="absolute right-2 top-0 h-6 w-14 -translate-y-1/2 rounded border border-[#f5a27a]/44" />
          <span className="absolute left-28 top-11 h-6 w-12 rounded border border-[#f5a27a]/38" />
          <span className="absolute left-40 top-20 h-9 w-11 rounded border border-[#f5a27a]/34" />
        </div>
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 opacity-58">
      <div className="absolute right-8 top-9 h-36 w-52">
        <span className="absolute bottom-0 left-0 size-3 rounded-full bg-[#5c95f4]" />
        <span className="absolute bottom-8 left-12 size-4 rounded-full bg-[#5c95f4]" />
        <span className="absolute bottom-5 left-24 size-4 rounded-full bg-[#5c95f4]" />
        <span className="absolute bottom-24 left-24 size-4 rounded-full bg-[#5c95f4]" />
        <span className="absolute bottom-16 left-36 size-4 rounded-full bg-[#5c95f4]" />
        <span className="absolute bottom-10 right-0 size-4 rounded-full bg-[#5c95f4]" />
        <svg className="h-full w-full" viewBox="0 0 210 150" fill="none">
          <path
            d="M6 142 60 106 112 128 112 50 166 84 204 116M60 106 112 50M112 128 166 84M60 106 166 84"
            stroke="#5c95f4"
            strokeOpacity="0.48"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  );
}
