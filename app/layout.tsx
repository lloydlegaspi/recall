import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { ThemeProvider } from "@/app/components/ThemeProvider";
import Header from "@/app/components/layout/Header";
import Sidebar from "@/app/components/layout/Sidebar";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Recall",
  description: "RAG study hub for your courses",
  icons: {
    icon: "/logo-with-bg.png",
    shortcut: "/logo-with-bg.png",
    apple: "/logo-with-bg.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="relative isolate min-h-full overflow-x-hidden bg-slate-50 font-sans text-slate-900 dark:bg-slate-950 dark:text-slate-50">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative min-h-screen">
            <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
              <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950" />

              <div className="absolute -top-36 -left-24 h-[500px] w-[500px] rounded-full bg-blue-400/18 blur-[120px] dark:hidden" />
              <div className="absolute -bottom-40 -right-28 h-[600px] w-[600px] rounded-full bg-violet-400/16 blur-[120px] dark:hidden" />
              <div className="absolute top-[34%] left-[28%] h-[420px] w-[420px] rounded-full bg-cyan-300/12 blur-[120px] dark:hidden" />

              <div className="absolute -top-44 -left-20 hidden h-[520px] w-[520px] rounded-full bg-indigo-900/20 blur-[130px] dark:block" />
              <div className="absolute -bottom-44 -right-20 hidden h-[620px] w-[620px] rounded-full bg-violet-900/18 blur-[130px] dark:block" />
              <div className="absolute top-[30%] left-[32%] hidden h-[420px] w-[420px] rounded-full bg-cyan-900/12 blur-[120px] dark:block" />
            </div>

            <Sidebar />

            <main className="relative min-h-screen md:ml-[15%] md:w-[85%]">
              <Header />
              <div className="px-6 pt-24 pb-8 md:px-12 lg:px-16">{children}</div>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
