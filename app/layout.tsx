import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import AppShell from "@/app/components/layout/AppShell";

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
      <body suppressHydrationWarning className="relative isolate min-h-full overflow-x-hidden bg-slate-50 font-sans text-slate-900 dark:bg-slate-950 dark:text-slate-50">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
