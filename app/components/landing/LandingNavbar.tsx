import Image from "next/image";
import Link from "next/link";

export default function LandingNavbar() {
  return (
    <header className="mx-auto flex w-full max-w-[1144px] items-center justify-between rounded-full border border-white/70 bg-white/72 px-7 py-4 shadow-[0_22px_70px_rgba(77,99,140,0.18)] backdrop-blur-2xl sm:px-8">
      <Link href="/" className="flex items-center gap-3" aria-label="Recall home">
        <Image
          src="/logo-with-bg.png"
          alt=""
          width={48}
          height={48}
          priority
          className="size-11 rounded-2xl object-contain shadow-[0_10px_25px_rgba(117,90,188,0.24)] sm:size-12"
        />
        <span className="text-2xl font-bold tracking-[-0.03em] text-[#201c52] sm:text-[28px]">
          Recall
        </span>
      </Link>

      <nav className="flex items-center gap-5 text-[15px] font-medium text-[#17143e] sm:gap-6 sm:text-base">
        <Link href="/dashboard" className="hidden transition hover:text-[#6c4be8] sm:inline">
          Log in
        </Link>
        <Link
          href="/dashboard"
          className="rounded-full bg-[#201c52] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(32,28,82,0.22)] transition hover:-translate-y-0.5 hover:bg-[#2c2668] sm:px-6 sm:text-base"
        >
          Try Recall Free
        </Link>
      </nav>
    </header>
  );
}
