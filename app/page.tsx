import Image from "next/image";
import Link from "next/link";
import { Brain, Play, Quote, Sparkles, Upload } from "lucide-react";

import LandingNavbar from "@/app/components/landing/LandingNavbar";

const featurePills = [
  {
    label: "Upload notes",
    icon: Upload,
    className: "text-[#7447ff]",
  },
  {
    label: "Generated quizzes",
    icon: Sparkles,
    className: "text-[#28a78e]",
  },
  {
    label: "Cited answers",
    icon: Quote,
    className: "text-[#378cf6]",
  },
  {
    label: "Adaptive learning",
    icon: Brain,
    className: "text-[#ed649c]",
  },
];

export default function LandingPage() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#bceeff] text-[#201c52]">
      <Image
        src="/landing-page-bg.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 z-0 object-cover object-center"
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1536px] flex-col px-4 pt-6 sm:px-8 lg:px-16">
        <LandingNavbar />

        <div className="relative mx-auto flex w-full flex-1 flex-col items-center pt-14 text-center sm:pt-16 lg:pt-[58px]">
          <h1 className="max-w-[1050px] font-serif text-[clamp(3rem,4.65vw,5rem)] leading-[0.95] font-medium tracking-normal text-[#251b5b] drop-shadow-[0_2px_0_rgba(255,255,255,0.58)]">
            Turn your notes into quizzes
            <br />
             you&apos;ll actually{" "}
            <span className="relative inline-block bg-linear-to-r from-[#8b6cf8] via-[#c96ee9] to-[#ed7aa4] bg-clip-text text-transparent">
              remember
              <span className="absolute -bottom-4 left-[6%] h-3 w-[92%] rounded-[50%] border-t-2 border-[#d06ff0] border-r-0 border-b-0 border-l-0 [transform:rotate(-1.4deg)]" />
              <span className="absolute -bottom-4 left-[52%] h-3 w-[44%] rounded-[50%] border-t-2 border-[#ff8d53] border-r-0 border-b-0 border-l-0 [transform:rotate(3deg)]" />
            </span>
          </h1>

          <p className="mt-7 max-w-[600px] text-balance text-[20px] leading-8 font-medium tracking-[0.01em] text-[#4b5870]">
            Recall turns PDFs, lecture slides, and reviewers into AI-generated
            quizzes with citations and adaptive learning.
          </p>

          <div className="mt-7 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              href="/home"
              className="inline-flex h-[60px] min-w-[266px] items-center justify-center gap-3 rounded-full bg-[#2d275f] px-8 text-[19px] font-bold text-white shadow-[0_16px_30px_rgba(32,28,82,0.34),inset_0_1px_0_rgba(255,255,255,0.2)] transition hover:-translate-y-0.5 hover:bg-[#362f72]"
            >
              <Sparkles className="size-6 fill-white/20" />
              Try Recall Free
            </Link>
            <Link
              href="#preview"
              className="inline-flex h-[56px] min-w-[226px] items-center justify-center gap-3 rounded-full border border-[#d6def0] bg-white/64 px-8 text-[18px] font-bold text-[#201c52] shadow-[0_14px_34px_rgba(77,99,140,0.12)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/82"
            >
              <Play className="size-5" />
              See Demo
            </Link>
          </div>

          <div className="mt-7 flex w-full max-w-[795px] flex-wrap items-center justify-center gap-4">
            {featurePills.map((pill) => {
              const Icon = pill.icon;

              return (
                <div
                  key={pill.label}
                  className="flex h-11 min-w-[162px] items-center justify-center gap-2 rounded-full border border-white/72 bg-white/58 px-5 text-sm font-semibold shadow-[0_12px_30px_rgba(77,99,140,0.1)] backdrop-blur-xl"
                >
                  <Icon className={`size-5 ${pill.className}`} />
                  <span className={pill.className}>{pill.label}</span>
                </div>
              );
            })}
          </div>

          <div
            id="preview"
            className="relative mt-6 flex w-full flex-1 items-end justify-center scroll-mt-8"
          >
            <div className="relative w-[min(100%,1088px)] translate-y-[4px] lg:-translate-x-[130px]">
              <Image
                src="/recall_embedded_homepage.png"
                alt="Recall dashboard preview"
                width={1100}
                height={472}
                priority
                className="w-full rounded-[32px] object-contain drop-shadow-[0_30px_55px_rgba(69,65,115,0.22)]"
              />
            </div>

            <Image
              src="/rere-waving-side.png"
              alt="Rere waving"
              width={500}
              height={500}
              priority
              className="absolute right-[1%] bottom-[17%] hidden w-[330px] drop-shadow-[0_28px_38px_rgba(64,45,120,0.28)] lg:block xl:right-[3%] xl:w-[370px] 2xl:w-[405px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
