"use client";

import {
  BookOpen,
  BrainCircuit,
  Home,
  Menu,
  MessageCircle,
  Settings,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Subjects", href: "/subjects", icon: BookOpen },
  { label: "Chat", href: "/chat", icon: MessageCircle },
  { label: "Quiz", href: "/quiz", icon: BrainCircuit },
  { label: "Settings", href: "/settings", icon: Settings },
];

type SidebarLinksProps = {
  onNavigate?: () => void;
};

function SidebarLinks({ onNavigate }: SidebarLinksProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
              isActive &&
                "rounded-full bg-slate-900 font-semibold text-white shadow-lg shadow-slate-900/20 dark:bg-indigo-500/20 dark:text-indigo-100 dark:ring-1 dark:ring-indigo-400/40 dark:shadow-[0_0_24px_rgba(99,102,241,0.35)]"
            )}
          >
            <Icon className="size-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarContent({ onNavigate }: SidebarLinksProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-8 flex items-center gap-3 rounded-2xl bg-white/55 p-3 ring-1 ring-slate-200/60 backdrop-blur-sm dark:bg-slate-900/35 dark:ring-white/10">
        <Image
          src="/logo-with-bg.png"
          alt="Recall logo"
          width={60}
          height={60}
          priority
        />
        <p className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">Recall</p>
      </div>

      <SidebarLinks onNavigate={onNavigate} />
    </div>
  );
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed top-4 left-4 z-50 inline-flex size-10 items-center justify-center rounded-xl border border-white/50 bg-white/70 text-slate-800 shadow-sm backdrop-blur-md md:hidden"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-900/35 backdrop-blur-sm transition-opacity md:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen w-[78%] max-w-[320px] flex-col border-r border-slate-200/50 bg-white/40 p-6 backdrop-blur-2xl transition-transform duration-300 md:hidden dark:border-white/10 dark:bg-slate-950/40",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent onNavigate={() => setIsOpen(false)} />
      </aside>

      <aside className="fixed inset-y-0 left-0 z-30 hidden h-screen w-[15%] flex-col border-r border-slate-200/50 bg-white/40 p-6 backdrop-blur-2xl md:flex dark:border-white/10 dark:bg-slate-950/40">
        <SidebarContent />
      </aside>
    </>
  );
}
